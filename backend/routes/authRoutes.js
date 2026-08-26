import express from "express";

import {
  signup,
  verifyEmail,
  resendVerificationCode,
  login,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/signup",
  upload.single("profileImage"),
  signup
);
router.post(
  "/verify-email",
  verifyEmail
);

router.post(
  "/resend-verification-code",
  resendVerificationCode
);

router.post("/login", login);

router.post("/logout", logout);

router.get(
  "/me",
  authMiddleware,
  getCurrentUser
);

export default router;