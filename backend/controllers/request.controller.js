import Participant from "../models/Participant.model.js";
import Team from "../models/Team.model.js";
import User from "../models/User.model.js";
import JoinRequest from "../models/JoinRequest.model.js";

import { updateTeamEligibility } from "../utils/teamEligibility.js";

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// ==========================================
// 1. SEND JOIN REQUEST
// ==========================================

const sendJoinRequest = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  // ------------------------------------------
  // FIND AUTHENTICATED PARTICIPANT
  // ------------------------------------------

  const participant = await Participant.findOne({
    userId: req.user.userId,
  });

  if (!participant) {
    throw new ApiError(
      404,
      "Participant profile not found"
    );
  }

  // ------------------------------------------
  // FIND TEAM
  // ------------------------------------------

  const team = await Team.findById(teamId);

  if (!team) {
    throw new ApiError(
      404,
      "Team not found"
    );
  }

  // ------------------------------------------
  // PARTICIPANT ALREADY HAS A TEAM
  // ------------------------------------------

  if (participant.teamId) {
    throw new ApiError(
      400,
      "Participant already belongs to a team"
    );
  }

  // ------------------------------------------
  // LEADER CANNOT JOIN OWN TEAM
  // ------------------------------------------

  if (
    team.leaderId.toString() ===
    participant._id.toString()
  ) {
    throw new ApiError(
      400,
      "Team leader cannot send a join request to their own team"
    );
  }

  // ------------------------------------------
  // TEAM CAPACITY
  // ------------------------------------------

  if (team.members.length >= 6) {
    throw new ApiError(
      400,
      "Team is already full"
    );
  }

  // ------------------------------------------
  // DUPLICATE PENDING REQUEST
  // ------------------------------------------

  const existingRequest =
    await JoinRequest.findOne({
      participantId: participant._id,
      teamId: team._id,
      status: "pending",
    });

  if (existingRequest) {
    throw new ApiError(
      400,
      "You already have a pending request for this team"
    );
  }

  // ------------------------------------------
  // CREATE REQUEST
  // ------------------------------------------

  const joinRequest =
  await JoinRequest.create({
    participantId: participant._id,
    teamId: team._id,
    requestType: "join",
    status: "pending",
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      joinRequest,
      "Join request sent successfully"
    )
  );
});


// ==========================================
// 2. GET TEAM JOIN REQUESTS
// ==========================================

const getTeamJoinRequests = asyncHandler(
  async (req, res) => {
    const { teamId } = req.params;

    // Team existence is already checked by
    // teamLeaderMiddleware, but keeping this
    // check makes the controller safe on its own.

    const team = await Team.findById(teamId);

    if (!team) {
      throw new ApiError(
        404,
        "Team not found"
      );
    }

    const requests = await JoinRequest.find({
      teamId,
      status: "pending",
    }).populate(
      "participantId",
      "name email phone gender department branch year skills profileImage"
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        requests,
        "Team join requests fetched successfully"
      )
    );
  }
);


// ==========================================
// 3. ACCEPT JOIN REQUEST
// ==========================================

const acceptJoinRequest = asyncHandler(
  async (req, res) => {
    const { requestId } = req.params;

    // ------------------------------------------
    // FIND REQUEST
    // ------------------------------------------

    const request =
      await JoinRequest.findById(requestId);

    if (!request) {
      throw new ApiError(
        404,
        "Join request not found"
      );
    }

    // ------------------------------------------
    // REQUEST MUST BE PENDING
    // ------------------------------------------

    if (request.status !== "pending") {
      throw new ApiError(
        400,
        "This join request has already been processed"
      );
    }

    // ------------------------------------------
    // FIND LOGGED-IN USER
    // ------------------------------------------

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
        "Participant profile is not linked to this account"
      );
    }

    // ------------------------------------------
    // FIND TEAM
    // ------------------------------------------

    const team = await Team.findById(
      request.teamId
    );

    if (!team) {
      throw new ApiError(
        404,
        "Team not found"
      );
    }

    // ------------------------------------------
    // CHECK TEAM LEADER
    // ------------------------------------------

    if (
      team.leaderId.toString() !==
      user.participantId.toString()
    ) {
      throw new ApiError(
        403,
        "Only the team leader can accept this request"
      );
    }

    // ------------------------------------------
    // FIND PARTICIPANT
    // ------------------------------------------

    const participant =
      await Participant.findById(
        request.participantId
      );

    if (!participant) {
      throw new ApiError(
        404,
        "Participant not found"
      );
    }

    // ------------------------------------------
    // PARTICIPANT ALREADY HAS TEAM
    // ------------------------------------------

    if (participant.teamId) {
      throw new ApiError(
        400,
        "Participant already belongs to another team"
      );
    }

    // ------------------------------------------
    // CHECK TEAM CAPACITY
    // ------------------------------------------

    if (team.members.length >= 6) {
      throw new ApiError(
        400,
        "Team is already full"
      );
    }

    // ------------------------------------------
    // ADD PARTICIPANT
    // ------------------------------------------

    team.members.push(participant._id);

    participant.teamId = team._id;

    request.status = "accepted";

    // ------------------------------------------
    // UPDATE ELIGIBILITY
    // ------------------------------------------

    await updateTeamEligibility(team);

    // ------------------------------------------
    // SAVE
    // ------------------------------------------

    await participant.save();
    await team.save();
    await request.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          request,
          participant,
          team,
        },
        "Join request accepted successfully"
      )
    );
  }
);


// ==========================================
// 4. REJECT JOIN REQUEST
// ==========================================

const rejectJoinRequest = asyncHandler(
  async (req, res) => {
    const { requestId } = req.params;

    // ------------------------------------------
    // FIND REQUEST
    // ------------------------------------------

    const request =
      await JoinRequest.findById(requestId);

    if (!request) {
      throw new ApiError(
        404,
        "Join request not found"
      );
    }

    // ------------------------------------------
    // REQUEST MUST BE PENDING
    // ------------------------------------------

    if (request.status !== "pending") {
      throw new ApiError(
        400,
        "This join request has already been processed"
      );
    }

    // ------------------------------------------
    // FIND LOGGED-IN USER
    // ------------------------------------------

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
        "Participant profile is not linked to this account"
      );
    }

    // ------------------------------------------
    // FIND TEAM
    // ------------------------------------------

    const team = await Team.findById(
      request.teamId
    );

    if (!team) {
      throw new ApiError(
        404,
        "Team not found"
      );
    }

    // ------------------------------------------
    // CHECK TEAM LEADER
    // ------------------------------------------

    if (
      team.leaderId.toString() !==
      user.participantId.toString()
    ) {
      throw new ApiError(
        403,
        "Only the team leader can reject this request"
      );
    }

    // ------------------------------------------
    // REJECT REQUEST
    // ------------------------------------------

    request.status = "rejected";

    await request.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        request,
        "Join request rejected successfully"
      )
    );
  }
);
// ==========================================
// 5. TEAM LEADER INVITES PARTICIPANT
// ==========================================

const sendTeamInvite = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { participantId } = req.body;

  // ==========================================
  // VALIDATE PARTICIPANT ID
  // ==========================================

  if (!participantId) {
    throw new ApiError(
      400,
      "participantId is required"
    );
  }

  // ==========================================
  // FIND TEAM
  // ==========================================

  // teamLeaderMiddleware already verifies that
  // the logged-in user is the leader.

  const team = req.team ||
    await Team.findById(teamId);

  if (!team) {
    throw new ApiError(
      404,
      "Team not found"
    );
  }

  // ==========================================
  // CHECK TEAM CAPACITY
  // ==========================================

  if (team.members.length >= 6) {
    throw new ApiError(
      400,
      "Team is already full"
    );
  }

  // ==========================================
  // FIND PARTICIPANT
  // ==========================================

  const participant =
    await Participant.findById(
      participantId
    );

  if (!participant) {
    throw new ApiError(
      404,
      "Participant not found"
    );
  }

  // ==========================================
  // LEADER CANNOT INVITE THEMSELVES
  // ==========================================

  if (
    team.leaderId.toString() ===
    participant._id.toString()
  ) {
    throw new ApiError(
      400,
      "Team leader cannot invite themselves"
    );
  }

  // ==========================================
  // PARTICIPANT ALREADY HAS A TEAM
  // ==========================================

  if (participant.teamId) {
    throw new ApiError(
      400,
      "Participant already belongs to a team"
    );
  }

  // ==========================================
  // CHECK EXISTING PENDING REQUEST
  // ==========================================

  const existingRequest =
    await JoinRequest.findOne({
      participantId: participant._id,
      teamId: team._id,
      status: "pending",
    });

  if (existingRequest) {
    throw new ApiError(
      400,
      "A pending request already exists between this participant and team"
    );
  }

  // ==========================================
  // CREATE INVITATION
  // ==========================================

  const invitation =
    await JoinRequest.create({
      participantId: participant._id,
      teamId: team._id,
      requestType: "invite",
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
// ==========================================
// TEAM LEADER INVITES PARTICIPANT
// ==========================================

const inviteParticipantToTeam = asyncHandler(
  async (req, res) => {
    const { teamId } = req.params;
    const { participantId } = req.body;

    // ==========================================
    // VALIDATE PARTICIPANT ID
    // ==========================================

    if (!participantId) {
      throw new ApiError(
        400,
        "participantId is required"
      );
    }

    // ==========================================
    // FIND AUTHENTICATED TEAM LEADER
    // ==========================================

    const leaderParticipant =
      await Participant.findOne({
        userId: req.user.userId,
      });

    if (!leaderParticipant) {
      throw new ApiError(
        404,
        "Participant profile not found"
      );
    }

    // ==========================================
    // FIND TEAM
    // ==========================================

    const team = await Team.findById(teamId);

    if (!team) {
      throw new ApiError(
        404,
        "Team not found"
      );
    }

    // ==========================================
    // VERIFY LEADER OWNS THIS TEAM
    // ==========================================

    if (
      team.leaderId.toString() !==
      leaderParticipant._id.toString()
    ) {
      throw new ApiError(
        403,
        "Only the team leader can invite participants"
      );
    }

    // ==========================================
    // TEAM CAPACITY
    // ==========================================

    if (team.members.length >= 6) {
      throw new ApiError(
        400,
        "Team is already full"
      );
    }

    // ==========================================
    // FIND PARTICIPANT
    // ==========================================

    const participant =
      await Participant.findById(participantId);

    if (!participant) {
      throw new ApiError(
        404,
        "Participant not found"
      );
    }

    // ==========================================
    // PARTICIPANT ALREADY IN A TEAM
    // ==========================================

    if (participant.teamId) {
      throw new ApiError(
        400,
        "Participant already belongs to a team"
      );
    }

    // ==========================================
    // CANNOT INVITE YOURSELF
    // ==========================================

    if (
      participant._id.toString() ===
      leaderParticipant._id.toString()
    ) {
      throw new ApiError(
        400,
        "Team leader cannot invite themselves"
      );
    }

    // ==========================================
    // CHECK EXISTING PENDING INVITATION
    // ==========================================

    const existingRequest = await JoinRequest.findOne({
  participantId: participant._id,
  teamId: team._id,
  requestType: "join",
  status: "pending",
});

if (existingRequest) {
  throw new ApiError(
    400,
    "You already have a pending request for this team"
  );
}

// NOTE: this function is not currently wired to any
// route (dead code) — it previously created a "join"
// requestType here even though this is a leader-
// initiated invite, which would have made it
// indistinguishable from a participant's own join
// request. Fixed to "invite" for correctness if this
// is ever wired up; sendTeamInvite() below is the
// version actually used, and the invitation.controller.js
// TeamInvitation-based flow is what the frontend calls.
const joinRequest = await JoinRequest.create({
  participantId: participant._id,
  teamId: team._id,
  requestType: "invite",
  status: "pending",
});

    // ==========================================
    // CREATE INVITATION
    // ==========================================

    return res.status(201).json(
      new ApiResponse(
        201,
        joinRequest,
        "Invitation sent successfully"
      )
    );
  }
);


export {
  sendJoinRequest,
  getTeamJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  sendTeamInvite,
  inviteParticipantToTeam
};