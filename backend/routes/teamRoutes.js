import express from "express";

import {
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeam,
  removeTeamMember,
} from "../controllers/team.controller.js";

import {
  sendJoinRequest,
  getTeamJoinRequests,
  sendTeamInvite
} from "../controllers/request.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { teamLeaderMiddleware } from "../middlewares/teamLeader.middleware.js";
import upload from "../middlewares/multer.middleware.js";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.any(),
  createTeam
);
router.get("/", getAllTeams);
router.get("/:teamId", getTeam);

router.delete(
  "/:teamId/members/:memberId",
  authMiddleware,
  teamLeaderMiddleware,
  removeTeamMember
);
router.delete(
  "/:teamId",
  authMiddleware,
  teamLeaderMiddleware,
  deleteTeam
);

router.post(
  "/:teamId/join",
  authMiddleware,
  sendJoinRequest
);
router.post(
  "/:teamId/invite",
  authMiddleware,
  teamLeaderMiddleware,
  sendTeamInvite
);

router.get(
  "/:teamId/requests",
  authMiddleware,
  teamLeaderMiddleware,
  getTeamJoinRequests
);

export default router;