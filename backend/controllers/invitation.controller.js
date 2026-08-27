import TeamInvitation from "../models/TeamInvitation.model.js";
import Participant from "../models/Participant.model.js";
import Team from "../models/Team.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { updateTeamEligibility } from "../utils/teamEligibility.js";


const sendTeamInvitation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;

  if (!participantId) {
    throw new ApiError(400, "Participant ID is required");
  }

  // Find logged-in participant
  const leaderParticipant = await Participant.findOne({
    userId: req.user.userId,
  });

  if (!leaderParticipant) {
    throw new ApiError(
      404,
      "Leader participant profile not found"
    );
  }

  // Find team led by this participant
  const team = await Team.findById(
  leaderParticipant.teamId
);

if (!team) {
  throw new ApiError(
    404,
    "Team not found"
  );
}

if (
  team.leaderId.toString() !==
  leaderParticipant._id.toString()
) {
  throw new ApiError(
    403,
    "Only the team leader can send invitations"
  );
}

  // Team capacity check
  if (team.members.length >= 6) {
    throw new ApiError(
      400,
      "Team is already full"
    );
  }

  // Find target participant
  const targetParticipant = await Participant.findById(
    participantId
  );

  if (!targetParticipant) {
    throw new ApiError(
      404,
      "Participant not found"
    );
  }

  // Leader cannot invite themselves
  if (
    targetParticipant._id.toString() ===
    leaderParticipant._id.toString()
  ) {
    throw new ApiError(
      400,
      "You cannot invite yourself"
    );
  }

  // Participant already belongs to a team
  if (targetParticipant.teamId) {
    throw new ApiError(
      400,
      "This participant is already a member of a team"
    );
  }

  // Check ONLY for a pending invitation
  const pendingInvitation =
    await TeamInvitation.findOne({
      teamId: team._id,
      participantId: targetParticipant._id,
      status: "pending",
    });

  if (pendingInvitation) {
    throw new ApiError(
      400,
      "Invitation is already pending for this participant"
    );
  }

  // Create a new invitation
  // This allows sending again after rejection
  const invitation =
    await TeamInvitation.create({
      teamId: team._id,
      participantId: targetParticipant._id,
      status: "pending",
    });

  return res.status(201).json(
    new ApiResponse(
      201,
      invitation,
      "Team invitation sent successfully"
    )
  );
});
const getAvailableParticipants = asyncHandler(async (req, res) => {
  // Find the participant profile of the logged-in user
  const leaderParticipant = await Participant.findOne({
    userId: req.user.userId,
  });

  if (!leaderParticipant) {
    throw new ApiError(404, "Leader participant profile not found");
  }

  // Find the team led by this participant
  const team = await Team.findById(
  leaderParticipant.teamId
);

if (!team) {
  throw new ApiError(
    404,
    "Team not found"
  );
}

if (
  team.leaderId.toString() !==
  leaderParticipant._id.toString()
) {
  throw new ApiError(
    403,
    "Only the team leader can view available participants"
  );
}

  // Find participants who don't belong to any team
  // and exclude the leader themselves
  const participants = await Participant.find({
    teamId: null,
    _id: { $ne: leaderParticipant._id },
  }).select(
    "name email phone gender department branch year skills"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      participants,
      "Available participants fetched successfully"
    )
  );
});
const getMyTeamInvitations = asyncHandler(async (req, res) => {
  // Find participant profile of logged-in user
  const participant = await Participant.findOne({
    userId: req.user.userId,
  });

  if (!participant) {
    throw new ApiError(404, "Participant profile not found");
  }

  const invitations = await TeamInvitation.find({
    participantId: participant._id,
    status: "pending",
  })
    .populate("teamId", "teamName leaderId")
    .populate({
      path: "teamId",
      populate: {
        path: "leaderId",
        select: "name email profileImage",
      },
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      invitations,
      "Team invitations fetched successfully"
    )
  );
});


const acceptTeamInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;

    const participant = await Participant.findOne({
      userId: req.user.userId,
    });

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant profile not found",
      });
    }

    const invitation = await TeamInvitation.findById(
      invitationId
    ).populate("teamId");

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    // Only invited participant can accept
    if (
      invitation.participantId.toString() !==
      participant._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to accept this invitation",
      });
    }

    // Invitation must be pending
    if (invitation.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This invitation is no longer pending",
      });
    }

    // Participant is already in a team
    if (participant.teamId) {
      return res.status(400).json({
        success: false,
        message:
          "You are already a member of a team",
      });
    }

    const team = await Team.findById(invitation.teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team no longer exists",
      });
    }

    // Check team capacity
    if (team.members.length >= 6) {
      return res.status(400).json({
        success: false,
        message: "This team is already full",
      });
    }

    // Add participant to team
    team.members.push(participant._id);
    participant.teamId = team._id;
    invitation.status = "accepted";

    await updateTeamEligibility(team);

    await team.save();
    await participant.save();
    await invitation.save();


    // ==========================================
    // CLOSE ALL OTHER PENDING INVITATIONS
    // ==========================================

    await TeamInvitation.updateMany(
      {
        participantId: participant._id,
        status: "pending",
        _id: { $ne: invitation._id },
      },
      {
        $set: {
          status: "rejected",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Invitation accepted and you have joined the team successfully",
      data: {
        team,
      },
    });

  } catch (error) {
    console.error(
      "Accept invitation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to accept invitation",
    });
  }
};

const rejectTeamInvitation = asyncHandler(async (req, res) => {
  const { invitationId } = req.params;

  // Find logged-in participant
  const participant = await Participant.findOne({
    userId: req.user.userId,
  });

  if (!participant) {
    throw new ApiError(404, "Participant profile not found");
  }

  // Find invitation
  const invitation = await TeamInvitation.findById(invitationId);

  if (!invitation) {
    throw new ApiError(404, "Invitation not found");
  }

  // Make sure this invitation belongs to the logged-in participant
  if (
    invitation.participantId.toString() !==
    participant._id.toString()
  ) {
    throw new ApiError(
      403,
      "You are not authorized to reject this invitation"
    );
  }

  // Invitation must still be pending
  if (invitation.status !== "pending") {
    throw new ApiError(
      400,
      "This invitation is no longer pending"
    );
  }

  // Reject invitation
  invitation.status = "rejected";

  await invitation.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      invitation,
      "Team invitation rejected successfully"
    )
  );
});

export { sendTeamInvitation,
    getAvailableParticipants,
    getMyTeamInvitations,
  acceptTeamInvitation,
  rejectTeamInvitation,
 };