import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSihAuth } from "../../context/SihAuthContext";
import GridAnimation from "../../components/GridAnimation";
import { events } from "../../data/event";
import ParticipantAvatar from "../../components/ParticipantAvatar";

function Teams() {

  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);

  const [selectedTeam, setSelectedTeam] = useState(null);

  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);

  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useSihAuth();

  const userTeamId =
    user?.participantId?.teamId?._id ||
    user?.participantId?.teamId;

  const isInTeam = Boolean(userTeamId);

  // const visibleTeams = teams.filter(
  //   (team) =>
  //     team._id?.toString() !== userTeamId?.toString()
  // );

  // ==========================================
  // FETCH TEAMS
  // ==========================================

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/teams`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch teams"
        );
      }

      setTeams(data.data || data);
    } catch (err) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // ==========================================
  // OPEN REQUEST MODAL
  // ==========================================

  const handleRequestClick = (teamId) => {
    setSelectedTeam(teamId);
    setRequestMessage("");
  };

  // ==========================================
  // CLOSE REQUEST MODAL
  // ==========================================

  const closeRequestModal = () => {
    if (requestLoading) return;

    setSelectedTeam(null);
    setRequestMessage("");
  };

  // ==========================================
  // SEND JOIN REQUEST
  // ==========================================

  const handleJoinRequest = async () => {
    if (!isAuthenticated) {
      setRequestMessage(
        "Please login to send a join request."
      );
      return;
    }

    try {
      setRequestLoading(true);
      setRequestMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/teams/${selectedTeam}/join`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({}),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to send join request"
        );
      }

      setRequestMessage(
        data.message ||
        "Join request sent successfully!"
      );

      setTimeout(() => {
        setSelectedTeam(null);
        setRequestMessage("");
      }, 1200);
    } catch (err) {
      setRequestMessage(
        err.message ||
        "Something went wrong"
      );
    } finally {
      setRequestLoading(false);
    }
  };

  // ==========================================
  // LOADING AUTH + TEAMS
  // ==========================================

  if (authLoading || loading) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-24 pb-16">

        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "url('/images/backgroundImg.png')",
          }}
        />

        <div className="fixed inset-0 bg-linear-to-b from-background/80 via-background/90 to-background pointer-events-none" />

        <div className="relative z-10 flex min-h-[70vh] items-center justify-center">
          <div className="text-sm text-muted-foreground">
            Loading teams...
          </div>
        </div>

      </div>
    );
  }

  const event = events.find((e) => e.slug === "sih-2026");

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-26">

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

        <div className='flex flex-col items-center gap-2 '>

          <div
            className="
    my-5
    rounded-2xl
    border
    border-primary/40
    p-1
    shadow-[0_0_30px_rgba(32,178,166,0.25)]
    transition-all
    duration-300
    hover:border-primary/70
    hover:shadow-[0_0_40px_rgba(32,178,166,0.4)]
  "
          >
            <a href="https://chat.whatsapp.com/JoRVufRkjw2L1WMChubKs3" target="_blank" >
              <img
                src="../images/pragyanLogo.jpeg"
                alt="Pragyan's Logo"
                className="h-50 w-50 rounded-xl object-cover cursor-pointer"
              />
            </a>
          </div>
          <h1
            className='text-4xl  md:text-5xl font-bold
                 z-3 text-center'
          ><span className='bg-linear-to-r from-primary to-highlight text-transparent bg-clip-text'>PRAGYAN - The Coding Club of CSE</span></h1>
          <h2 className='mx-3 max-w-120 sm:max-w-2xl text-muted-foreground text-center'>Department of Computer Science | Dr. Rammanohar Lohia Avadh University.</h2>
          <a href='https://cseiet.vercel.app' target='_blank' className='text-primary text-sm underline hover:scale-105 hover:text-blue-400 duration-200'>
            Go to the official website of CSE clubs →
          </a>
          <a href="https://chat.whatsapp.com/LIxHxt2agoaCn5qbgoDvrA" target='_blank' className='text-primary hover:scale-105 hover:text-blue-400 duration-200 text-sm underline'>
            Join CLUBS - Deptt of CSE →
          </a>

        </div>

        {/* content section */}

        <section className="animate-[fadeIn_1s_ease-in-out]">
          {/* ==========================================
            TOP ACTIONS
        =========================================== */}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to={
                isAuthenticated && isInTeam
                  ? `/sih/teams/${userTeamId}`
                  : "/sih/teams/create"
              }
              className="rounded-xl bg-primary px-5 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
            >
              {isAuthenticated && isInTeam
                ? "View Your Team"
                : "Create a Team"}
            </Link>

            <Link
              to="/sih/participants"
              className="rounded-xl border border-border px-5 py-2.5 text-center text-sm transition hover:border-primary hover:text-primary"
            >
              Find Participants
            </Link>

          </div>

          {/* ==========================================
            LOGIN NOTICE
        =========================================== */}

          {!isAuthenticated && (
            <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 text-center">

              <p className="text-sm text-muted-foreground">
                You can browse teams without an account.
                To create a team or request to join one,
                please{" "}
                <Link
                  to="/sih/login"
                  className="font-medium text-primary hover:underline"
                >
                  login
                </Link>{" "}
                or{" "}
                <Link
                  to="/sih/signup"
                  className="font-medium text-primary hover:underline"
                >
                  create an account
                </Link>
                .
              </p>

            </div>
          )}

          {/* ==========================================
            ERROR
        =========================================== */}

          {error && (
            <div className="mx-auto mt-10 max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-center text-sm text-red-500">
              {error}
            </div>
          )}

          {/* ==========================================
            EMPTY
        =========================================== */}

          {!error && teams.length === 0 && (
            <div className="mx-auto mt-12 max-w-xl glass rounded-2xl p-8 text-center">

              <h2 className="text-lg font-semibold">
                No teams yet
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Be the first person to create an SIH
                team.
              </p>

            </div>
          )}

          {/* ==========================================
            TEAMS
        =========================================== */}

          {!error && teams.length > 0 && (
            <div className="mt-10 grid gap-5 md:grid-cols-2">

              {teams.map((team) => {


                const regularMemberCount = team.members?.length || 0;

                // Leader + regular members
                const memberCount = regularMemberCount;

                const isFull = memberCount >= 6;

                const isEligible =
                  team.isEligible === true && memberCount === 6;

                return (
                  <div
                    key={team._id}
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

                    {/* Team Header */}
                    <div className="relative flex items-start justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-4">

                        {/* Team Avatar */}
                        <ParticipantAvatar
                          src={team.leaderId?.profileImage}
                          name={team.leaderId?.name}
                          size="h-14 w-14"
                          className="
    shrink-0
    rounded-2xl
    border
    border-primary/25
    bg-primary/10
    shadow-[0_0_20px_rgba(32,178,166,0.12)]
  "
                          textClassName="
    text-xl
    font-bold
    text-primary
  "
                        />

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                            SIH Team
                          </p>

                          <h2 className="mt-1 truncate text-xl font-bold text-white">
                            {team.teamName}
                          </h2>
                        </div>

                      </div>

                      {/* Eligibility */}
                      {isEligible ? (
                        <span
                          className="
          shrink-0
          rounded-full
          border border-green-400/20
          bg-green-400/10
          px-3
          py-1.5
          text-xs
          font-semibold
          text-green-400
        "
                        >
                          Eligible ✓
                        </span>
                      ) : (
                        <span
                          className="
          shrink-0
          rounded-full
          border border-yellow-400/20
          bg-yellow-400/10
          px-3
          py-1.5
          text-xs
          font-semibold
          text-yellow-300
        "
                        >
                          Incomplete
                        </span>
                      )}

                    </div>

                    {/* Team Progress */}
                    <div className="relative mt-7">

                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-white/35">
                          Team Completion
                        </span>

                        <span className="text-sm font-bold text-primary">
                          {memberCount}/6
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="
          h-full
          rounded-full
          bg-linear-to-r
          from-primary
          to-teal-300
          shadow-[0_0_12px_rgba(32,178,166,0.45)]
          transition-all
          duration-500
        "
                          style={{
                            width: `${Math.min((memberCount / 6) * 100, 100)}%`,
                          }}
                        />
                      </div>

                    </div>

                    {/* Team Info */}
                    <div className="relative mt-6 grid grid-cols-2 gap-3">

                      <div
                        className="
        rounded-xl
        border border-white/5
        bg-black/20
        p-4
      "
                      >
                        <p className="text-xs text-white/35">
                          Team Leader
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-white">
                          {team.leaderId?.name || "Unknown"}
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
                        <p className="text-xs text-white/35">
                          Members
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          {memberCount} / 6
                        </p>
                      </div>

                    </div>

                    {/* Eligibility / Capacity Notice */}
                    {!isEligible && (
                      <div
                        className="
        relative
        mt-4
        rounded-xl
        border border-yellow-400/15
        bg-yellow-400/5
        px-4
        py-3
      "
                      >
                        <p className="text-xs leading-relaxed text-yellow-300/80">
                          {memberCount < 6
                            ? `This team currently has ${memberCount}/6 members and is looking for additional teammates.`
                            : "This team is not yet eligible to participate."}
                        </p>
                      </div>
                    )}

                    {/* Full Team */}
                    {isFull && (
                      <div
                        className="
        relative
        mt-4
        rounded-xl
        border border-primary/15
        bg-primary/5
        px-4
        py-3
      "
                      >
                        <p className="text-xs leading-relaxed text-primary/80">
                          This team has reached its maximum capacity of 6 members.
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="relative mt-6 flex flex-col gap-3 sm:flex-row">

                      <Link
                        to={`/sih/teams/${team._id}`}
                        className={`
                          ${team._id?.toString() == userTeamId?.toString() ? "hidden" : ""}
        flex-1
        rounded-xl
        border border-primary/20
        bg-white/5
        px-4
        py-3
        text-center
        text-sm
        font-semibold
        text-white
        transition-all
        duration-300
        hover:border-primary/50
        hover:bg-primary/10
        hover:text-primary
      `}
                      >
                        View Team →
                      </Link>

                      {isAuthenticated ? (
                        <button
                          type="button"
                          onClick={
                            team._id?.toString() == userTeamId?.toString() ? () => navigate(`/sih/teams/${userTeamId}`) :
                              () => handleRequestClick(team._id)
                          }
                          disabled={isFull}
                          className="
          flex-1
          rounded-xl
          bg-primary
          px-4
          py-3
          text-sm
          font-semibold
          text-white
          shadow-[0_0_20px_rgba(32,178,166,0.12)]
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:bg-primary2
          hover:shadow-[0_0_28px_rgba(32,178,166,0.25)]
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-50
          cursor-pointer
        "
                        >
                          {
                            isFull ? "Team Full" : "Request to Join →"
                          }
                        </button>
                      ) : (
                        <Link
                          to="/sih/login"
                          className="
          flex-1
          rounded-xl
          bg-primary
          px-4
          py-3
          text-center
          text-sm
          font-semibold
          text-white
          shadow-[0_0_20px_rgba(32,178,166,0.12)]
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:bg-primary2
          hover:shadow-[0_0_28px_rgba(32,178,166,0.25)]
        "
                        >
                          Login to Join →
                        </Link>
                      )}

                    </div>

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
                );
              })}

            </div>
          )}

          {/* ==========================================
            BACK
        =========================================== */}

          <div className="mt-10 text-center">

            <Link
              to="/sih"
              className="text-sm text-muted-foreground transition hover:text-primary"
            >
              ← Back to SIH
            </Link>

          </div>

        </section>


      </section>

      {/* ==========================================
          JOIN REQUEST MODAL
      =========================================== */}

      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

          <div className="w-full max-w-md glass-strong rounded-2xl p-6">

            {/* Modal Header */}

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Request to Join Team
              </h2>

              <button
                type="button"
                onClick={closeRequestModal}
                disabled={requestLoading}
                className="text-xl text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* Description */}

            <p className="mt-3 text-sm text-muted-foreground">
              Your logged-in SIH participant account
              will be used to send this join request.
            </p>

            {/* Message */}

            {requestMessage && (
              <div className="mt-4 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
                {requestMessage}
              </div>
            )}

            {/* Submit */}

            <button
              type="button"
              onClick={handleJoinRequest}
              disabled={requestLoading}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {requestLoading
                ? "Sending Request..."
                : "Send Join Request"}
            </button>

            {/* Cancel */}

            {!requestLoading && (
              <button
                type="button"
                onClick={closeRequestModal}
                className="mt-3 w-full rounded-xl border border-border px-4 py-3 text-sm transition hover:border-primary hover:text-primary"
              >
                Cancel
              </button>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Teams;