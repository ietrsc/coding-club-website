import express from "express";

import {
  createParticipant,
  getAvailableParticipants,
  updateMyProfile,
} from "../controllers/participant.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/",
  upload.single("profileImage"),
  createParticipant
);

router.get(
  "/",
  getAvailableParticipants
);
router.put(
  "/profile",
  authMiddleware,
  upload.single("profileImage"),
  updateMyProfile
);


export default router;