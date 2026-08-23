import Participant from "../models/Participant.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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


  const existingParticipant = await Participant.findOne({ email });

  if (existingParticipant) {
    throw new ApiError(
      409,
      "Participant with this email already exists"
    );
  }
  const participant = await Participant.create({
    name,
    email,
    phone,
    gender,
    department,
    branch,
    year,
    skills: skills || [],
  });

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