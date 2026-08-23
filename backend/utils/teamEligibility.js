import Participant from "../models/Participant.model.js";

const updateTeamEligibility = async (team) => {
  const allParticipantIds = [
    team.leaderId,
    ...team.members,
  ].filter(Boolean);

  const members = await Participant.find({
    _id: { $in: allParticipantIds },
  }).select("name gender");

  const totalMembers = members.length;

  const hasFemaleMember = members.some((member) => {
    const gender = String(member.gender || "")
      .trim()
      .toLowerCase();

    return gender === "female";
  });

  team.isEligible =
    totalMembers === 6 && hasFemaleMember;

  console.log("TEAM ELIGIBILITY:", {
    totalMembers,
    members: members.map((member) => ({
      name: member.name,
      gender: member.gender,
    })),
    hasFemaleMember,
    isEligible: team.isEligible,
  });

  return team;
};

export { updateTeamEligibility };