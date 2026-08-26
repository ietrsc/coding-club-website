import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.model.js";
import Participant from "../models/Participant.model.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
  uploadProfileImageBuffer,
  deleteProfileImage,
} from "../utils/cloudinary.js";

import {
  sendVerificationEmail,
} from "../nodemailer/email.js";


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
// ACCESS TOKEN COOKIE OPTIONS
// ==========================================

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  maxAge: 24 * 60 * 60 * 1000,
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

  // ------------------------------------------
  // Password validation
  // ------------------------------------------

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
      {
        publicIdPrefix: normalizedEmail,
      }
    );
  } catch (error) {
    console.error(
      "Cloudinary upload failed (signup):",
      error
    );

    throw new ApiError(
      500,
      "Failed to upload profile picture"
    );
  }

  // ------------------------------------------
  // Track whether participant was created here
  // ------------------------------------------

  let participantCreated = false;

  // ------------------------------------------
  // Create / update Participant
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
        profileImagePublicId:
          uploadedImage.public_id,
      });

      participantCreated = true;
    } catch (error) {
      await deleteProfileImage(
        uploadedImage.public_id
      );

      throw error;
    }
  } else {
    // Participant already exists but has no
    // user account yet.

    const oldPublicId =
      participant.profileImagePublicId;

    participant.profileImage =
      uploadedImage.secure_url;

    participant.profileImagePublicId =
      uploadedImage.public_id;

    await participant.save();

    if (oldPublicId) {
      await deleteProfileImage(
        oldPublicId
      );
    }
  }

  // ------------------------------------------
  // Hash password
  // ------------------------------------------

  const hashedPassword =
    await bcrypt.hash(password, 10);

  // ------------------------------------------
  // Generate 6-digit verification code
  // ------------------------------------------

  const verificationCode =
    crypto
      .randomInt(100000, 1000000)
      .toString();

  // ------------------------------------------
  // Hash verification code before saving
  // ------------------------------------------

  const hashedVerificationToken =
    crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");

  // ------------------------------------------
  // Create User
  // ------------------------------------------

  let user;

  try {
    user = await User.create({
      participantId: participant._id,
      email: normalizedEmail,
      password: hashedPassword,

      isEmailVerified: false,

      emailVerificationToken:
        hashedVerificationToken,

      emailVerificationExpires:
        new Date(
          Date.now() + 15 * 60 * 1000
        ),
    });
  } catch (error) {
    // Roll back only if this signup created
    // the participant.

    if (participantCreated) {
      if (
        participant?.profileImagePublicId
      ) {
        await deleteProfileImage(
          participant.profileImagePublicId
        );
      }

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
  // Send verification email
  // ------------------------------------------

  try {
    await sendVerificationEmail(
      normalizedEmail,
      verificationCode
    );
  } catch (error) {
    console.error(
      "Verification email sending failed:",
      error
    );

    // User remains unverified.
    // A resend-code endpoint can be added later.
  }

  // ------------------------------------------
  // Get participant data
  // ------------------------------------------

  const participantData =
    await Participant.findById(
      participant._id
    ).select("-__v");

  // ------------------------------------------
  // IMPORTANT:
  // No access token or cookie is created here.
  // User must verify their email first.
  // ------------------------------------------

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        userId: user._id,
        email: user.email,
        participant: participantData,
        isEmailVerified: false,
      },
      "Account created successfully. Please check your email and verify your account."
    )
  );
});


// ==========================================
// VERIFY EMAIL
// ==========================================

const verifyEmail = asyncHandler(
  async (req, res) => {
    const { code } = req.body;

    // ------------------------------------------
    // Validate code
    // ------------------------------------------

    if (!code) {
      throw new ApiError(
        400,
        "Verification code is required"
      );
    }

    const verificationCode =
      code.toString().trim();

    if (!/^\d{6}$/.test(verificationCode)) {
      throw new ApiError(
        400,
        "Please enter a valid 6-digit verification code"
      );
    }

    // ------------------------------------------
    // Hash received code
    // ------------------------------------------

    const hashedVerificationToken =
      crypto
        .createHash("sha256")
        .update(verificationCode)
        .digest("hex");

    // ------------------------------------------
    // Find user with valid, non-expired code
    // ------------------------------------------

    const user = await User.findOne({
      emailVerificationToken:
        hashedVerificationToken,

      emailVerificationExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      throw new ApiError(
        400,
        "Invalid or expired verification code"
      );
    }

    // ------------------------------------------
    // Mark user as verified
    // ------------------------------------------

    user.isEmailVerified = true;

    // Remove verification information
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;

    await user.save();

    // ------------------------------------------
    // Generate access token
    // ------------------------------------------

    const accessToken =
      generateAccessToken(user._id);

    // ------------------------------------------
    // Automatically log user in
    // ------------------------------------------

    res.cookie(
      "accessToken",
      accessToken,
      cookieOptions
    );

    // ------------------------------------------
    // Get participant data
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
          email: user.email,
          participant,
          isEmailVerified: true,
        },
        "Email verified successfully"
      )
    );
  }
);


// ==========================================
// RESEND VERIFICATION CODE
// ==========================================

const RESEND_COOLDOWN_MS = 60 * 1000; // 1 minute
const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const resendVerificationCode = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError(
        400,
        "Email is required"
      );
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      throw new ApiError(
        404,
        "No account found with this email"
      );
    }

    if (user.isEmailVerified) {
      throw new ApiError(
        400,
        "This email is already verified. Please login."
      );
    }

    // ------------------------------------------
    // Basic cooldown so this can't be spammed.
    // The previous code's issue time is derived
    // from its expiry timestamp minus its TTL.
    // ------------------------------------------

    if (user.emailVerificationExpires) {
      const previousIssuedAt =
        user.emailVerificationExpires.getTime() -
        VERIFICATION_CODE_TTL_MS;

      const elapsed =
        Date.now() - previousIssuedAt;

      if (elapsed < RESEND_COOLDOWN_MS) {
        const waitSeconds = Math.ceil(
          (RESEND_COOLDOWN_MS - elapsed) / 1000
        );

        throw new ApiError(
          429,
          `Please wait ${waitSeconds}s before requesting a new code`
        );
      }
    }

    // ------------------------------------------
    // Generate a fresh 6-digit verification code
    // ------------------------------------------

    const verificationCode =
      crypto
        .randomInt(100000, 1000000)
        .toString();

    const hashedVerificationToken =
      crypto
        .createHash("sha256")
        .update(verificationCode)
        .digest("hex");

    user.emailVerificationToken =
      hashedVerificationToken;

    user.emailVerificationExpires =
      new Date(
        Date.now() + VERIFICATION_CODE_TTL_MS
      );

    await user.save();

    // ------------------------------------------
    // Send the new code
    // ------------------------------------------

    try {
      await sendVerificationEmail(
        normalizedEmail,
        verificationCode
      );
    } catch (error) {
      console.error(
        "Resend verification email failed:",
        error
      );

      throw new ApiError(
        500,
        "Failed to send verification email. Please try again."
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { email: normalizedEmail },
        "A new verification code has been sent to your email."
      )
    );
  }
);


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
  // Prevent unverified users from logging in
  // ------------------------------------------

  if (!user.isEmailVerified) {
    throw new ApiError(
      403,
      "Please verify your email before logging in"
    );
  }

  // ------------------------------------------
  // Generate access token
  // ------------------------------------------

  const accessToken =
    generateAccessToken(user._id);

  // ------------------------------------------
  // Set authentication cookie
  // ------------------------------------------

  res.cookie(
    "accessToken",
    accessToken,
    cookieOptions
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
        isEmailVerified: true,
      },
      "Login successful"
    )
  );
});


// ==========================================
// LOGOUT
// ==========================================

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(
    "accessToken",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
    }
  );

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
          select:
            "teamName leaderId",
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
  verifyEmail,
  resendVerificationCode,
  login,
  logout,
  getCurrentUser,
};