import { Router } from "express";

import {
  sendTeamInvitation,
  getAvailableParticipants,
  getMyTeamInvitations,
  acceptTeamInvitation,
  rejectTeamInvitation,
} from "../controllers/invitation.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Team leader sends an invitation
router.post(
  "/invite",
  authMiddleware,
  sendTeamInvitation
);

// Team leader gets participants available for invitation
router.get(
  "/available-participants",
  authMiddleware,
  getAvailableParticipants
);

// Logged-in participant gets pending invitations
router.get(
  "/my",
  authMiddleware,
  getMyTeamInvitations
);

// Participant accepts an invitation
router.put(
  "/:invitationId/accept",
  authMiddleware,
  acceptTeamInvitation
);

// Participant rejects an invitation
router.put(
  "/:invitationId/reject",
  authMiddleware,
  rejectTeamInvitation
);

export default router;