import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.model.js";
import Participant from "../models/Participant.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadProfileImageBuffer, deleteProfileImage } from "../utils/cloudinary.js";


// ==========================================
// GENERATE ACCESS TOKEN
// ==========================================

const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );
};


// ==========================================
// SIGNUP
// ==========================================

const signup = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    gender,
    department,
    branch,
    year,
    skills = [],
  } = req.body;

  // ------------------------------------------
  // Validate required fields
  // ------------------------------------------

  const requiredFields = [
    "name",
    "email",
    "password",
    "phone",
    "gender",
    "department",
    "branch",
    "year",
  ];

  for (const field of requiredFields) {
    if (
      req.body[field] === undefined ||
      req.body[field] === null ||
      req.body[field].toString().trim() === ""
    ) {
      throw new ApiError(
        400,
        `${field} is required`
      );
    }
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

  if (password.length < 6) {
    throw new ApiError(
      400,
      "Password must be at least 6 characters"
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  // ------------------------------------------
  // Check existing User
  // ------------------------------------------

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(
      400,
      "An account with this email already exists"
    );
  }

  // ------------------------------------------
  // Check existing Participant
  // ------------------------------------------

  let participant = await Participant.findOne({
    email: normalizedEmail,
  });

  if (participant?.userId) {
    throw new ApiError(
      400,
      "This participant already has an account"
    );
  }

  // ------------------------------------------
  // Upload profile picture
  // ------------------------------------------

  let uploadedImage;

  try {
    uploadedImage = await uploadProfileImageBuffer(
      req.file.buffer,
      { publicIdPrefix: normalizedEmail }
    );
  } catch (error) {
    // Log the real Cloudinary error server-side — the
    // response only gets a generic message so we don't leak
    // internals, but you need the real reason in the logs.
    console.error("Cloudinary upload failed (signup):", error);

    throw new ApiError(
      500,
      "Failed to upload profile picture"
    );
  }

  // ------------------------------------------
  // Create Participant
  // ------------------------------------------

  if (!participant) {
    try {
      participant = await Participant.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        gender,
        department: department.trim(),
        branch: branch.trim(),
        year,
        skills,
        profileImage: uploadedImage.secure_url,
        profileImagePublicId: uploadedImage.public_id,
      });
    } catch (error) {
      // Participant creation failed — don't leave an
      // orphaned image sitting in Cloudinary.
      await deleteProfileImage(uploadedImage.public_id);
      throw error;
    }
  } else {
    // ------------------------------------------
    // Edge case: this person was already added as a
    // bare Participant by a team leader (with a photo
    // the LEADER uploaded on their behalf). They're now
    // signing up for their own account, so their own
    // photo replaces the leader-supplied one.
    // ------------------------------------------

    const oldPublicId = participant.profileImagePublicId;

    participant.profileImage = uploadedImage.secure_url;
    participant.profileImagePublicId = uploadedImage.public_id;

    await participant.save();
    await deleteProfileImage(oldPublicId);
  }

  // ------------------------------------------
  // Hash password
  // ------------------------------------------

  const hashedPassword =
    await bcrypt.hash(password, 10);

  // ------------------------------------------
  // Create User
  // ------------------------------------------

  let user;

  try {
    user = await User.create({
      participantId: participant._id,
      email: normalizedEmail,
      password: hashedPassword,
    });
  } catch (error) {
    // If user creation fails, remove the
    // participant only if we created it here.
    if (participant && !participant.userId) {
      await deleteProfileImage(
        participant.profileImagePublicId
      );

      await Participant.findByIdAndDelete(
        participant._id
      );
    }

    throw error;
  }

  // ------------------------------------------
  // Link Participant → User
  // ------------------------------------------

  participant.userId = user._id;
  await participant.save();

  // ------------------------------------------
  // Generate token
  // ------------------------------------------

  const accessToken =
    generateAccessToken(user._id);

  // ------------------------------------------
  // Set HTTP-only cookie
  // ------------------------------------------

  res.cookie(
    "accessToken",
    accessToken,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    }
  );

  const participantData =
    await Participant.findById(
      participant._id
    ).select(
      "-__v"
    );

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        userId: user._id,
        participant: participantData,
      },
      "Account created successfully"
    )
  );
});


// ==========================================
// LOGIN
// ==========================================

const login = asyncHandler(async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw new ApiError(
      400,
      "Email and password are required"
    );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  // ------------------------------------------
  // Find user
  // ------------------------------------------

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  // ------------------------------------------
  // Compare password
  // ------------------------------------------

  const passwordValid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordValid) {
    throw new ApiError(
      401,
      "Invalid email or password"
    );
  }

  // ------------------------------------------
  // Generate token
  // ------------------------------------------

  const accessToken =
    generateAccessToken(user._id);

  // ------------------------------------------
  // Set cookie
  // ------------------------------------------

  res.cookie(
    "accessToken",
    accessToken,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    }
  );

  // ------------------------------------------
  // Get participant
  // ------------------------------------------

  const participant =
    await Participant.findById(
      user.participantId
    ).select("-__v");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        userId: user._id,
        participant,
      },
      "Login successful"
    )
  );
});


// ==========================================
// LOGOUT
// ==========================================

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Logout successful"
    )
  );
});


// ==========================================
// GET CURRENT USER
// ==========================================

const getCurrentUser = asyncHandler(
  async (req, res) => {
    const user = await User.findById(
      req.user.userId
    )
      .select("-password -__v")
      .populate({
        path: "participantId",
        populate: {
          path: "teamId",
          select: "teamName leaderId",
        },
      });

    if (!user) {
      throw new ApiError(
        401,
        "User not found"
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        user,
        "Current user fetched successfully"
      )
    );
  }
);


export {
  signup,
  login,
  logout,
  getCurrentUser,
};