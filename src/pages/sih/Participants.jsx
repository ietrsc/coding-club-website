import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSihAuth } from "../../context/SihAuthContext";
import GridAnimation from "../../components/GridAnimation";
import ParticipantAvatar from "../../components/ParticipantAvatar";
import { events } from "../../data/event";


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

  const event = events.find((e) => e.slug === "sih-2026");

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-16">

      <div className="hidden md:block pointer-events-none">
        <GridAnimation />
      </div>

      {/* backgroundImage*/}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('../images/backgroundImg.png')` }}
      ></div>

      {/*overlay layer*/}
      <div className='fixed inset-0 bg-linear-to-b from-black/70 to-black/80 '></div>

      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

        {/* hero section */}

        <div className='flex flex-col items-center gap-2'>
          <h1
            className='text-4xl  md:text-6xl font-bold
                  max-w-3xl z-3 md:text-center'
          ><span className='bg-linear-to-r from-primary to-highlight text-transparent bg-clip-text'>{event.title}</span></h1>
          <h2 className='mx-3 max-w-xs sm:max-w-2xl text-muted-foreground'>These participants are currently looking for a team. If you are
            creating a team, you can find potential teammates here.</h2>

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

        <p className="text-sm text-center uppercase tracking-[0.2em] font-semibold mt-8 text-primary">
          Participants Looking for Teams
        </p>

        {/* Participant cards */}
        {!loading && !error && participants.length > 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {participants.map((participant) => (
              <div
                key={participant._id}
                className="
      group
      relative
      overflow-hidden
      rounded-3xl
      border border-primary/20
      bg-white/5
      p-6
      backdrop-blur-md
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-primary/40
      hover:bg-primary/5
      hover:shadow-[0_0_35px_rgba(32,178,166,0.15)]
    "
              >
                {/* Ambient Glow */}
                <div
                  className="
        pointer-events-none
        absolute
        -right-16
        -top-16
        h-40
        w-40
        rounded-full
        bg-primary/5
        blur-3xl
        transition-all
        duration-300
        group-hover:bg-primary/10
      "
                />

                {/* Header */}
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <ParticipantAvatar
                      src={participant.profileImage}
                      name={participant.name}
                      size="h-12 w-12"
                      className="rounded-xl border border-primary/20 bg-primary/10"
                      textClassName="font-semibold text-primary"
                    />

                    <div className="min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Participant
                      </span>

                      <h2 className="mt-1 truncate text-xl font-bold text-white">
                        {participant.name}
                      </h2>

                      <p className="mt-1 truncate text-sm text-white/45">
                        {participant.college}
                      </p>
                    </div>
                  </div>

                  {participant.gender && (
                    <span
                      className="
            shrink-0
            rounded-full
            border border-primary/20
            bg-primary/10
            px-3
            py-1
            text-xs
            font-medium
            capitalize
            text-primary
          "
                    >
                      {participant.gender}
                    </span>
                  )}
                </div>

                {/* Academic Information */}
                <div className="relative mt-6 grid grid-cols-2 gap-3">
                  <div
                    className="
          rounded-xl
          border border-white/5
          bg-black/20
          p-4
        "
                  >
                    <p className="text-xs text-white/40">
                      Branch
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {participant.branch}
                    </p>
                  </div>

                  <div
                    className="
          rounded-xl
          border border-white/5
          bg-black/20
          p-4
        "
                  >
                    <p className="text-xs text-white/40">
                      Year
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {participant.year}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="relative mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-white/70">
                      Skills
                    </p>

                    {participant.skills?.length > 0 && (
                      <span className="text-xs text-white/35">
                        {participant.skills.length} skill
                        {participant.skills.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {participant.skills?.length > 0 ? (
                      participant.skills.map((skill, index) => (
                        <span
                          key={`${participant._id}-${index}`}
                          className="
                rounded-full
                border border-primary/15
                bg-primary/5
                px-3
                py-1.5
                text-xs
                text-primary/80
                transition-all
                duration-300
                group-hover:border-primary/25
              "
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-white/35">
                        No skills added
                      </span>
                    )}
                  </div>
                </div>

                {/* Team Leader Action */}
                {isAuthenticated && isTeamLeader && (
                  <button
                    type="button"
                    onClick={() => handleSendInvitation(participant._id)}
                    disabled={sendingInvitation === participant._id}
                    className="
          relative
          mt-7
          w-full
          rounded-xl
          border border-primary
          hover:bg-primary
          cursor-pointer
          px-4
          py-3
          text-sm
          font-semibold
          text-white
          shadow-[0_0_20px_rgba(32,178,166,0.15)]
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:shadow-[0_0_30px_rgba(32,178,166,0.3)]
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
                  >
                    {sendingInvitation === participant._id
                      ? "Sending Invitation..."
                      : "Invite to Join Team →"}
                  </button>
                )}

                {/* Bottom Accent */}
                <div
                  className="
        absolute
        bottom-0
        left-0
        h-px
        w-0
        bg-primary
        transition-all
        duration-500
        group-hover:w-full
      "
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Participants;