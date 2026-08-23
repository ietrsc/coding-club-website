import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSihAuth } from "../../context/SihAuthContext";


function Participants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sendingInvitation, setSendingInvitation] = useState(null);
const [inviteMessage, setInviteMessage] = useState("");
const [inviteError, setInviteError] = useState("");

  const {
  user,
  isAuthenticated,
  loading: authLoading,
} = useSihAuth();
const userParticipantId =
  user?.participantId?._id ||
  user?.participantId;

const userTeamId =
  user?.participantId?.teamId?._id ||
  user?.participantId?.teamId;

// user.participantId.teamId is now populated with
// { _id, teamName, leaderId } by getCurrentUser, so we
// can tell if the logged-in participant leads their team
// without a second network request.
const teamLeaderId =
  user?.participantId?.teamId?.leaderId?._id ||
  user?.participantId?.teamId?.leaderId;

const isTeamLeader =
  Boolean(userParticipantId) &&
  Boolean(teamLeaderId) &&
  userParticipantId.toString() === teamLeaderId.toString();
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/participants`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch participants");
      }

      // Handles both:
      // { data: [...] }
      // and directly returning [...]
      setParticipants(data.data || data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleSendInvitation = async (participantId) => {
  try {
    setSendingInvitation(participantId);
    setInviteMessage("");
    setInviteError("");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/invitations/invite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          participantId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to send invitation"
      );
    }

    setInviteMessage(
      data.message || "Invitation sent successfully!"
    );

  } catch (error) {
    setInviteError(
      error.message || "Failed to send invitation"
    );
  } finally {
    setSendingInvitation(null);
  }
};

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-16">

      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/images/backgroundImg.png')" }}
      />

      <div className="fixed inset-0 bg-linear-to-b from-background/80 via-background/90 to-background pointer-events-none" />

      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Smart India Hackathon
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Participants Looking for Teams
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            These participants are currently looking for a team. If you are
            creating a team, you can find potential teammates here.
          </p>
        </div>
        {inviteMessage && (
  <div className="mx-auto mt-6 max-w-xl rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-sm text-green-600">
    {inviteMessage}
  </div>
)}

{inviteError && (
  <div className="mx-auto mt-6 max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-500">
    {inviteError}
  </div>
)}

        {/* Loading */}
        {loading && (
          <div className="mt-12 text-center text-sm text-muted-foreground">
            Loading participants...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto mt-10 max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && participants.length === 0 && (
          <div className="mx-auto mt-12 max-w-xl glass rounded-2xl p-8 text-center">
            <h2 className="text-lg font-semibold">
              No participants available
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              There are currently no participants looking for a team.
            </p>
          </div>
        )}
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
            to="/sih/teams"
            className="rounded-xl bg-primary px-5 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
          >
            Browse Teams
          </Link>

          <Link
            to="/sih/register"
            className="rounded-xl border border-border px-5 py-2.5 text-center text-sm transition hover:border-primary hover:text-primary"
          >
            Register as a participant
          </Link>

          

        </div>

        {/* Participant cards */}
        {!loading && !error && participants.length > 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {participants.map((participant) => (
              <div
                key={participant._id}
                className="glass rounded-2xl p-5 transition-all duration-300 hover:border-primary/50"
              >

                {/* Name */}
                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h2 className="text-lg font-semibold">
                      {participant.name}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {participant.college}
                    </p>
                  </div>

                  {/* Gender */}
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs capitalize text-primary">
                    {participant.gender}
                  </span>
                </div>
                

                {/* Academic information */}
                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Branch
                    </span>

                    <span className="font-medium">
                      {participant.branch}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Year
                    </span>

                    <span className="font-medium">
                      {participant.year}
                    </span>
                  </div>
                </div>
                

                {/* Skills */}
                <div className="mt-5">
                  <p className="mb-2 text-sm text-muted-foreground">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {participant.skills?.length > 0 ? (
                      participant.skills.map((skill, index) => (
                        <span
                          key={`${participant._id}-${index}`}
                          className="rounded-full bg-surface px-3 py-1 text-xs text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No skills added
                      </span>
                    )}
                    
                  </div>
                  
                </div>
                {isAuthenticated && isTeamLeader && (<button
  onClick={() =>
    handleSendInvitation(participant._id)
  }
  disabled={
    sendingInvitation === participant._id
  }
  className="mt-6 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
>
  {sendingInvitation === participant._id
    ? "Sending..."
    : "Send Invitation"}
</button>)}
                

              </div>
              
              
            ))}
            

          </div>
        )}

        

      </section>
    </div>
  );
}

export default Participants;