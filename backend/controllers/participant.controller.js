import Participant from "../models/Participant.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  uploadProfileImageBuffer,
  deleteProfileImage,
} from "../utils/cloudinary.js";


// ==========================================
// CREATE PARTICIPANT
// ==========================================

const createParticipant = asyncHandler(
  async (req, res) => {
    const {
      name,
      email,
      phone,
      gender,
      department,
      branch,
      year,
      skills,
    } = req.body;

    // ------------------------------------------
    // Validate required fields
    // ------------------------------------------

    if (
      !name ||
      !email ||
      !phone ||
      !gender ||
      !department ||
      !branch ||
      !year
    ) {
      throw new ApiError(
        400,
        "All required fields must be provided"
      );
    }

    // ------------------------------------------
    // Profile picture required
    // ------------------------------------------

    if (!req.file) {
      throw new ApiError(
        400,
        "Profile picture is required"
      );
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // ------------------------------------------
    // Check existing participant
    // ------------------------------------------

    const existingParticipant =
      await Participant.findOne({
        email: normalizedEmail,
      });

    if (existingParticipant) {
      throw new ApiError(
        409,
        "Participant with this email already exists"
      );
    }

    // ------------------------------------------
    // Upload profile image
    // ------------------------------------------

    let uploadedImage;

    try {
      uploadedImage =
        await uploadProfileImageBuffer(
          req.file.buffer,
          {
            publicIdPrefix:
              normalizedEmail,
          }
        );
    } catch (error) {
      console.error(
        "Cloudinary upload failed (createParticipant):",
        error
      );

      throw new ApiError(
        500,
        "Failed to upload profile picture"
      );
    }

    // ------------------------------------------
    // Create participant
    // ------------------------------------------

    let participant;

    try {
      participant =
        await Participant.create({
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          gender,
          department:
            department.trim(),
          branch: branch.trim(),
          year,
          skills: Array.isArray(skills)
            ? skills
            : skills
              ? [skills]
              : [],
          profileImage:
            uploadedImage.secure_url,
          profileImagePublicId:
            uploadedImage.public_id,
        });
    } catch (error) {
      await deleteProfileImage(
        uploadedImage.public_id
      );

      throw error;
    }

    return res.status(201).json(
      new ApiResponse(
        201,
        participant,
        "Participant registered successfully"
      )
    );
  }
);


// ==========================================
// GET AVAILABLE PARTICIPANTS
// ==========================================

const getAvailableParticipants =
  asyncHandler(async (req, res) => {
    // Only participants who:
    // 1. Have no team
    // 2. Have a linked verified user

    const participants =
      await Participant.find({
        teamId: null,
      });

    return res.status(200).json(
      new ApiResponse(
        200,
        participants,
        "Available participants fetched successfully"
      )
    );
  });


// ==========================================
// UPDATE MY PROFILE
// ==========================================

const updateMyProfile =
  asyncHandler(async (req, res) => {
    // ------------------------------------------
    // Find participant using authenticated user
    // ------------------------------------------

    const participant =
      await Participant.findOne({
        userId: req.user.userId,
      });

    if (!participant) {
      throw new ApiError(
        404,
        "Participant profile not found"
      );
    }

    // ------------------------------------------
    // Extract editable fields
    // ------------------------------------------

    const {
      name,
      department,
      branch,
      skills,
    } = req.body;

    // ------------------------------------------
    // Update text fields
    // ------------------------------------------

    if (
      name !== undefined
    ) {
      if (!name.toString().trim()) {
        throw new ApiError(
          400,
          "Name cannot be empty"
        );
      }

      participant.name =
        name.toString().trim();
    }

    if (
      department !== undefined
    ) {
      if (
        !department
          .toString()
          .trim()
      ) {
        throw new ApiError(
          400,
          "Department cannot be empty"
        );
      }

      participant.department =
        department.toString().trim();
    }

    if (
      branch !== undefined
    ) {
      if (
        !branch.toString().trim()
      ) {
        throw new ApiError(
          400,
          "Branch cannot be empty"
        );
      }

      participant.branch =
        branch.toString().trim();
    }

    // ------------------------------------------
    // Update skills
    // ------------------------------------------

    if (skills !== undefined) {
      let parsedSkills = [];

      if (Array.isArray(skills)) {
        parsedSkills = skills;
      } else if (
        typeof skills === "string"
      ) {
        parsedSkills =
          skills
            .split(",")
            .map((skill) =>
              skill.trim()
            )
            .filter(Boolean);
      }

      participant.skills =
        parsedSkills;
    }

    // ------------------------------------------
    // Update profile picture
    // ------------------------------------------

    let newImage = null;
    let oldPublicId = null;

    if (req.file) {
      try {
        newImage =
          await uploadProfileImageBuffer(
            req.file.buffer,
            {
              publicIdPrefix:
                participant.email,
            }
          );
      } catch (error) {
        console.error(
          "Cloudinary upload failed (update profile):",
          error
        );

        throw new ApiError(
          500,
          "Failed to upload new profile picture"
        );
      }

      oldPublicId =
        participant.profileImagePublicId;

      participant.profileImage =
        newImage.secure_url;

      participant.profileImagePublicId =
        newImage.public_id;
    }

    // ------------------------------------------
    // Save participant
    // ------------------------------------------

    try {
      await participant.save();
    } catch (error) {
      // New image was uploaded but database
      // update failed, so clean up the new image.
      if (newImage?.public_id) {
        await deleteProfileImage(
          newImage.public_id
        );
      }

      throw error;
    }

    // ------------------------------------------
    // Delete old image only after successful save
    // ------------------------------------------

    if (
      oldPublicId &&
      newImage?.public_id &&
      oldPublicId !== newImage.public_id
    ) {
      try {
        await deleteProfileImage(
          oldPublicId
        );
      } catch (error) {
        console.error(
          "Failed to delete old profile image:",
          error
        );
      }
    }

    // ------------------------------------------
    // Return updated participant
    // ------------------------------------------

    const updatedParticipant =
      await Participant.findById(
        participant._id
      ).select("-__v");

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          participant:
            updatedParticipant,
        },
        "Profile updated successfully"
      )
    );
  });


export {
  createParticipant,
  getAvailableParticipants,
  updateMyProfile,
};