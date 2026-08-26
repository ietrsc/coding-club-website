import jwt from "jsonwebtoken";

import User from "../models/User.model.js";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const authMiddleware = asyncHandler(
  async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req
        .header("Authorization")
        ?.replace("Bearer ", "");

    // ------------------------------------------
    // Check token
    // ------------------------------------------

    if (!token) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

    // ------------------------------------------
    // Verify JWT
    // ------------------------------------------

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );
    } catch (error) {
      throw new ApiError(
        401,
        "Invalid or expired token"
      );
    }

    // ------------------------------------------
    // Check user still exists
    // ------------------------------------------

    const user =
      await User.findById(
        decoded.userId
      ).select(
        "_id participantId isEmailVerified"
      );

    if (!user) {
      throw new ApiError(
        401,
        "User not found"
      );
    }

    // ------------------------------------------
    // Block unverified users
    // ------------------------------------------

    if (!user.isEmailVerified) {
      throw new ApiError(
        403,
        "Please verify your email before accessing the SIH section"
      );
    }

    // ------------------------------------------
    // Attach authenticated user
    // ------------------------------------------

    req.user = {
      userId: user._id,
      participantId: user.participantId,
      isEmailVerified:
        user.isEmailVerified,
    };

    next();
  }
);


export { authMiddleware };