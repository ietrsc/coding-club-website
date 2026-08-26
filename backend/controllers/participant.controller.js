import Participant from "../models/Participant.model.js";
import User from "../models/User.model.js";

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
    // Profile picture is required
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
    // Upload profile picture
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
          skills: skills || [],
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
// GET AVAILABLE VERIFIED PARTICIPANTS
// ==========================================

const getAvailableParticipants =
  asyncHandler(async (req, res) => {
    // ------------------------------------------
    // Find all verified users
    // ------------------------------------------

    const verifiedUsers =
      await User.find({
        isEmailVerified: true,
      }).select("participantId");

    // ------------------------------------------
    // Get verified participant IDs
    // ------------------------------------------

    const verifiedParticipantIds =
      verifiedUsers.map(
        (user) => user.participantId
      );

    // ------------------------------------------
    // Only return:
    // 1. Email-verified participants
    // 2. Participants not already in a team
    // ------------------------------------------

    const participants =
      await Participant.find({
        _id: {
          $in: verifiedParticipantIds,
        },
        teamId: null,
      });

    return res.status(200).json(
      new ApiResponse(
        200,
        participants,
        "Available verified participants fetched successfully"
      )
    );
  });


export {
  createParticipant,
  getAvailableParticipants,
};