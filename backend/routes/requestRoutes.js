import { Router } from "express";

import {
  acceptJoinRequest,
  rejectJoinRequest,
} from "../controllers/request.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.put(
  "/:requestId/accept",
  authMiddleware,
  acceptJoinRequest
);

router.put(
  "/:requestId/reject",
  authMiddleware,
  rejectJoinRequest
);

export default router;