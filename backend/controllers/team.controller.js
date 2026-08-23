import Team from "../models/Team.model.js";
import Participant from "../models/Participant.model.js";
import { updateTeamEligibility } from "../utils/teamEligibility.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// ==========================================
// CREATE TEAM
// ==========================================

const createTeam = asyncHandler(async (req, res) => {
  const {
    teamName,
    members = [],
  } = req.body;

  // ==========================================
  // GET AUTHENTICATED PARTICIPANT
  // ==========================================

  const leaderParticipant = await Participant.findOne({
    userId: req.user.userId,
  });

  if (!leaderParticipant) {
    throw new ApiError(
      404,
      "Participant profile not found for this account"
    );
  }

  // ==========================================
  // VALIDATE TEAM
  // ==========================================

  if (!teamName) {
    throw new ApiError(
      400,
      "Team name is required"
    );
  }

  // ==========================================
  // CHECK LEADER ALREADY HAS A TEAM
  // ==========================================

  if (leaderParticipant.teamId) {
    throw new ApiError(
      400,
      "You already belong to a team"
    );
  }

  // ==========================================
  // VALIDATE MEMBERS
  // ==========================================

  if (!Array.isArray(members)) {
    throw new ApiError(
      400,
      "Members must be an array"
    );
  }

  // Leader automatically counts as first member
  // Team capacity = 6
  if (members.length > 5) {
    throw new ApiError(
      400,
      "A team can have a maximum of 6 members including the leader"
    );
  }

  const participantEmails = [
    leaderParticipant.email.toLowerCase(),
  ];

  // ==========================================
  // VALIDATE TEAM MEMBERS
  // ==========================================

  for (const member of members) {
    const requiredMemberFields = [
      "name",
      "email",
      "phone",
      "gender",
      "department",
      "branch",
      "year",
    ];

    for (const field of requiredMemberFields) {
      if (
        member[field] === undefined ||
        member[field] === null ||
        member[field].toString().trim() === ""
      ) {
        throw new ApiError(
          400,
          `Member ${field} is required`
        );
      }
    }

    const email = member.email
      .trim()
      .toLowerCase();

    // ==========================================
    // DUPLICATE EMAIL INSIDE TEAM
    // ==========================================

    if (participantEmails.includes(email)) {
      throw new ApiError(
        400,
        `Duplicate email found: ${member.email}`
      );
    }

    participantEmails.push(email);

    // ==========================================
    // EXISTING PARTICIPANT CHECK
    // ==========================================

    const existingParticipant =
      await Participant.findOne({ email });

    if (existingParticipant) {
      if (existingParticipant.teamId) {
        throw new ApiError(
          400,
          `Participant with email ${member.email} already belongs to a team`
        );
      }

      throw new ApiError(
        400,
        `Participant with email ${member.email} already exists`
      );
    }
  }

  // ==========================================
  // CREATE TEAM MEMBERS
  // ==========================================

  const createdMembers = [];

  try {
    for (const member of members) {
      const participant = await Participant.create({
        name: member.name.trim(),
        email: member.email.trim().toLowerCase(),
        phone: member.phone.trim(),
        gender: member.gender,
        department: member.department.trim(),
        branch: member.branch.trim(),
        year: member.year,
        skills: member.skills || [],
      });

      createdMembers.push(participant);
    }

    // ==========================================
    // CREATE TEAM
    // ==========================================

    const memberIds = createdMembers.map(
      (participant) => participant._id
    );

    const team = await Team.create({
      teamName: teamName.trim(),

      // AUTHENTICATED PARTICIPANT
      leaderId: leaderParticipant._id,

      // Leader automatically first member
      members: [
        leaderParticipant._id,
        ...memberIds,
      ],
    });

    // ==========================================
    // ASSIGN TEAM TO LEADER
    // ==========================================

    leaderParticipant.teamId = team._id;

    await leaderParticipant.save();

    // ==========================================
    // ASSIGN TEAM TO OTHER MEMBERS
    // ==========================================

    for (const participant of createdMembers) {
      participant.teamId = team._id;

      await participant.save();
    }

    // ==========================================
    // CALCULATE ELIGIBILITY
    // ==========================================

    await updateTeamEligibility(team);

    await team.save();

    // ==========================================
    // POPULATE TEAM
    // ==========================================

    const populatedTeam = await Team.findById(
      team._id
    )
      .populate(
        "leaderId",
        "name email phone gender department branch year skills"
      )
      .populate(
        "members",
        "name email phone gender department branch year skills"
      );

    return res.status(201).json(
      new ApiResponse(
        201,
        populatedTeam,
        "Team created successfully"
      )
    );

  } catch (error) {
    // ==========================================
    // CLEANUP CREATED MEMBERS
    // ==========================================

    await Participant.deleteMany({
      _id: {
        $in: createdMembers.map(
          (participant) => participant._id
        ),
      },
    });

    throw error;
  }
});


// ==========================================
// GET ALL TEAMS
// ==========================================

const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find()
    .populate(
      "leaderId",
      "name email phone gender department branch year skills"
    )
    .populate(
      "members",
      "name email phone gender department branch year skills"
    );

  return res.status(200).json(
    new ApiResponse(
      200,
      teams,
      "Teams fetched successfully"
    )
  );
});


// ==========================================
// GET SINGLE TEAM
// ==========================================

const getTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId)
    .populate(
      "leaderId",
      "name email phone gender department branch year skills"
    )
    .populate(
      "members",
      "name email phone gender department branch year skills"
    );

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      team,
      "Team fetched successfully"
    )
  );
});


// ==========================================
// REMOVE TEAM MEMBER
// ==========================================

const removeTeamMember = asyncHandler(async (req, res) => {
  const { teamId, memberId } = req.params;

  // Find team
  const team = await Team.findById(teamId);

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  // Find participant
  const participant = await Participant.findById(memberId);

  if (!participant) {
    throw new ApiError(404, "Participant not found");
  }

  // Check whether participant is actually a member
  const isMember = team.members.some(
    (member) => member.toString() === memberId
  );

  if (!isMember) {
    throw new ApiError(
      400,
      "Participant is not a member of this team"
    );
  }

  // Leader cannot be removed
  if (team.leaderId.toString() === memberId) {
    throw new ApiError(
      400,
      "Team leader cannot be removed from the team"
    );
  }

  // Remove participant from team
  team.members = team.members.filter(
    (member) => member.toString() !== memberId
  );

  // Remove team association
  participant.teamId = null;

  // Recalculate eligibility
  await updateTeamEligibility(team);

  // Save
  await participant.save();
  await team.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        team,
        removedParticipant: participant,
      },
      "Team member removed successfully"
    )
  );
});
// ==========================================
// DELETE TEAM
// ==========================================

const deleteTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  // Get logged-in participant
  const loggedInParticipant = await Participant.findOne({
    userId: req.user.userId,
  });

  if (!loggedInParticipant) {
    throw new ApiError(
      404,
      "Participant profile not found"
    );
  }

  // Find team
  const team = await Team.findById(teamId);

  if (!team) {
    throw new ApiError(404, "Team not found");
  }

  // Only the team leader can delete the team
  if (
    team.leaderId.toString() !==
    loggedInParticipant._id.toString()
  ) {
    throw new ApiError(
      403,
      "Only the team leader can delete this team"
    );
  }

  // Remove team association from ALL members
  await Participant.updateMany(
    {
      _id: { $in: team.members },
    },
    {
      $set: {
        teamId: null,
      },
    }
  );

  // Delete the team
  await Team.findByIdAndDelete(teamId);

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Team deleted successfully"
    )
  );
});

export {
  createTeam,
  getAllTeams,
  getTeam,
  removeTeamMember,
  deleteTeam
};