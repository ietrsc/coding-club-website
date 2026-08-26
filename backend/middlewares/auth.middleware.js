import jwt from "jsonwebtoken";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authMiddleware = asyncHandler(
  async (req, res, next) => {
    const token =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","");

    if (!token) {
      throw new ApiError(
        401,
        "Authentication required"
      );
    }

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

    req.user = decoded;

    next();
  }
);

export { authMiddleware };