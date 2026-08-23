import Participant from "../models/Participant.model.js";

const updateTeamEligibility = async (team) => {
  const allParticipantIds = [
    team.leaderId,
    ...team.members,
  ];

  const members = await Participant.find({
    _id: { $in: allParticipantIds },
  });

  const totalMembers = members.length;

  const hasFemaleMember = members.some(
    (member) =>
      member.gender?.toLowerCase() === "female"
  );

  team.isEligible =
    totalMembers === 6 && hasFemaleMember;

  console.log("TEAM ELIGIBILITY:", {
    totalMembers,
    hasFemaleMember,
    isEligible: team.isEligible,
  });

  return team;
};

export { updateTeamEligibility };