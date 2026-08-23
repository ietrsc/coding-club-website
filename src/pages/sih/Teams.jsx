import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSihAuth } from "../../context/SihAuthContext";

function Teams() {

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

const visibleTeams = teams.filter(
  (team) =>
    team._id?.toString() !== userTeamId?.toString()
);

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

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-16">

      {/* ==========================================
          BACKGROUND
      =========================================== */}

      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "url('/images/backgroundImg.png')",
        }}
      />

      <div className="fixed inset-0 bg-linear-to-b from-background/80 via-background/90 to-background pointer-events-none" />

      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

        {/* ==========================================
            HEADER
        =========================================== */}

        <div className="text-center">

          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Smart India Hackathon
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            SIH Teams
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Browse existing teams, view their members,
            or request to join a team that matches
            your interests.
          </p>

        </div>

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

            {isAuthenticated && isInTeam ? (
  <Link
    to={`/sih/teams/${userTeamId}`}
    className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
  >
    View Your Team
  </Link>
) : (
  <Link
    to="/sih/teams/create"
    className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
  >
    Create Team
  </Link>
)}

          </div>
        )}

        {/* ==========================================
            TEAMS
        =========================================== */}

        {!error && teams.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2">

            {visibleTeams.map((team) => {

              const regularMemberCount = team.members?.length || 0;

// Leader + regular members
const memberCount = regularMemberCount;

const isFull = memberCount >= 6;

const isEligible =
  team.isEligible === true && memberCount === 6;

              return (
                <div
                  key={team._id}
                  className="glass rounded-2xl p-6 transition-all duration-300 hover:border-primary/50"
                >

                  {/* Team heading */}

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h2 className="text-xl font-semibold">
                        {team.teamName}
                      </h2>
                    </div>

                    {/* Eligibility */}

                    {isEligible ? (
                      <span className="shrink-0 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                        Eligible ✓
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500">
                        Not Eligible
                      </span>
                    )}

                  </div>

                  {/* ==================================
                      TEAM INFORMATION
                  =================================== */}

                  <div className="mt-6 space-y-3 text-sm">

                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Leader
                      </span>

                      <span className="font-medium">
                        {team.leaderId?.name ||
                          "Unknown"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Members
                      </span>

                      <span className="font-medium">
                        {memberCount} / 6
                      </span>
                    </div>

                  </div>

                  {/* ==================================
                      ELIGIBILITY EXPLANATION
                  =================================== */}

                  {!isEligible && (
  <p className="mt-4 rounded-xl bg-red-500/5 px-4 py-3 text-xs text-red-400">
    {memberCount < 6 
      ? `Not eligible — team is not full. ${memberCount}/6 members.`
      : "Not eligible — team must include at least one female participant."}
  </p>
)}

                  {/* ==================================
                      FULL TEAM
                  =================================== */}

                  {isFull && (
                    <p className="mt-4 rounded-xl bg-yellow-500/5 px-4 py-3 text-xs text-yellow-500">
                      This team has reached its maximum
                      capacity.
                    </p>
                  )}

                  {/* ==================================
                      BUTTONS
                  =================================== */}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                    <Link
                      to={`/sih/teams/${team._id}`}
                      className="flex-1 rounded-xl border border-border px-4 py-2.5 text-center text-sm transition hover:border-primary hover:text-primary"
                    >
                      View Team
                    </Link>

                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleRequestClick(
                            team._id
                          )
                        }
                        disabled={isFull}
                        className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isFull
                          ? "Team Full"
                          : "Request to Join"}
                      </button>
                    ) : (
                      <Link
                        to="/sih/login"
                        className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Login to Join
                      </Link>
                    )}

                  </div>

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