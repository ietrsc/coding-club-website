import Participant from "../models/Participant.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadProfileImageBuffer, deleteProfileImage } from "../utils/cloudinary.js";

const createParticipant = asyncHandler(async(req,res)=>{
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
    throw new ApiError(400, "All required fields must be provided");
  }

  // Profile picture is required, same as the SIH signup flow.
  if (!req.file) {
    throw new ApiError(400, "Profile picture is required");
  }


  const existingParticipant = await Participant.findOne({ email });

  if (existingParticipant) {
    throw new ApiError(
      409,
      "Participant with this email already exists"
    );
  }

  let uploadedImage;

  try {
    uploadedImage = await uploadProfileImageBuffer(
      req.file.buffer,
      { publicIdPrefix: email.trim().toLowerCase() }
    );
  } catch (error) {
    console.error("Cloudinary upload failed (createParticipant):", error);
    throw new ApiError(500, "Failed to upload profile picture");
  }

  let participant;

  try {
    participant = await Participant.create({
      name,
      email,
      phone,
      gender,
      department,
      branch,
      year,
      skills: skills || [],
      profileImage: uploadedImage.secure_url,
      profileImagePublicId: uploadedImage.public_id,
    });
  } catch (error) {
    await deleteProfileImage(uploadedImage.public_id);
    throw error;
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      participant,
      "Participant registered successfully"
    )
  );
})
const getAvailableParticipants = asyncHandler(async (req, res) => {
  // Only participants who are not part of any team
  const participants = await Participant.find({
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

export {
  createParticipant,
  getAvailableParticipants,
};