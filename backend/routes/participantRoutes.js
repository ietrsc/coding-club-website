import express from "express";

import {
  createParticipant,
  getAvailableParticipants,
} from "../controllers/participant.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/",
  upload.single("profileImage"),
  createParticipant
);

router.get("/", getAvailableParticipants);

export default router;