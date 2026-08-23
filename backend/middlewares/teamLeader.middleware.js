import Team from "../models/Team.model.js";
import User from "../models/User.model.js";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const teamLeaderMiddleware = asyncHandler(
  async (req, res, next) => {
    const { teamId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      throw new ApiError(
        404,
        "Team not found"
      );
    }

    const user = await User.findById(
      req.user.userId
    ).select("participantId");

    if (!user) {
      throw new ApiError(
        401,
        "User account not found"
      );
    }

    if (!user.participantId) {
      throw new ApiError(
        403,
        "Participant profile not linked to this account"
      );
    }

    if (
      team.leaderId.toString() !==
      user.participantId.toString()
    ) {
      throw new ApiError(
        403,
        "Only the team leader can perform this action"
      );
    }

    req.team = team;
    req.participantId = user.participantId;

    next();
  }
);

export { teamLeaderMiddleware };