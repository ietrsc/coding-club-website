import express from "express";

import {
  createParticipant,
  getAvailableParticipants,
} from "../controllers/participant.controller.js";

const router = express.Router();

router.post("/", createParticipant);

router.get("/", getAvailableParticipants);

export default router;