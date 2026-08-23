import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSihAuth } from "../../context/SihAuthContext";

function TeamDetails() {
  const { teamId } = useParams();

  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useSihAuth();

  const [team, setTeam] = useState(null);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] =
    useState(false);

  const [removing, setRemoving] = useState(null);
  const [processingRequest, setProcessingRequest] =
    useState(null);

  const [error, setError] = useState("");
  const [requestError, setRequestError] =
    useState("");
  const [requestMessage, setRequestMessage] =
    useState("");
const totalMembers = (team?.members?.length || 0) + 1; // +1 for leader

const isEligible =
  team?.isEligible === true &&
  totalMembers === 6;

  // ==========================================
  // FETCH TEAM
  // ==========================================

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/teams/${teamId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch team"
        );
      }

      setTeam(data.data);
    } catch (err) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHECK IF CURRENT USER IS TEAM LEADER
  // ==========================================

  const isTeamLeader =
    isAuthenticated &&
    user?.participantId?._id &&
    team?.leaderId?._id &&
    user.participantId._id === team.leaderId._id;

  // ==========================================
  // FETCH PENDING JOIN REQUESTS
  // ==========================================

  const fetchJoinRequests = async () => {
    if (!isTeamLeader) {
      setRequests([]);
      return;
    }

    try {
      setRequestsLoading(true);
      setRequestError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/teams/${teamId}/requests`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch join requests"
        );
      }

      setRequests(data.data || []);
    } catch (err) {
      setRequestError(
        err.message ||
          "Failed to fetch join requests"
      );
    } finally {
      setRequestsLoading(false);
    }
  };

  // ==========================================
  // FETCH TEAM
  // ==========================================

  useEffect(() => {
    fetchTeam();
  }, [teamId]);

  // ==========================================
  // FETCH REQUESTS ONLY AFTER TEAM IS LOADED
  // ==========================================

  useEffect(() => {
    if (!team || authLoading) return;

    fetchJoinRequests();
  }, [
    team,
    isTeamLeader,
    authLoading,
    teamId,
  ]);

  // ==========================================
  // REMOVE MEMBER
  // ==========================================

  const handleRemoveMember = async (memberId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member?"
    );

    if (!confirmed) return;

    try {
      setRemoving(memberId);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/teams/${teamId}/members/${memberId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to remove member"
        );
      }

      setTeam(data.data.team);

      await fetchTeam();
    } catch (err) {
      setError(
        err.message ||
          "Failed to remove member"
      );
    } finally {
      setRemoving(null);
    }
  };

  // ==========================================
  // ACCEPT JOIN REQUEST
  // ==========================================

  const handleAcceptRequest = async (
    requestId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this join request?"
    );

    if (!confirmed) return;

    try {
      setProcessingRequest(requestId);
      setRequestError("");
      setRequestMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/requests/${requestId}/accept`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to accept join request"
        );
      }

      setRequestMessage(
        data.message ||
          "Join request accepted successfully"
      );

      setTeam(data.data?.team || team);

      setRequests((prevRequests) =>
        prevRequests.filter(
          (request) =>
            request._id !== requestId
        )
      );

      await fetchTeam();
    } catch (err) {
      setRequestError(
        err.message ||
          "Failed to accept join request"
      );
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleDeleteTeam = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this team? This action cannot be undone."
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/teams/${teamId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to delete team"
      );
    }

    alert("Team deleted successfully");

    navigate("/sih/teams");

  } catch (error) {
    console.error(
      "Delete team error:",
      error
    );

    alert(
      error.message || "Failed to delete team"
    );
  }
};
  // ==========================================
  // REJECT JOIN REQUEST
  // ==========================================

  const handleRejectRequest = async (
    requestId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this join request?"
    );

    if (!confirmed) return;

    try {
      setProcessingRequest(requestId);
      setRequestError("");
      setRequestMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/requests/${requestId}/reject`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to reject join request"
        );
      }

      setRequestMessage(
        data.message ||
          "Join request rejected successfully"
      );

      setRequests((prevRequests) =>
        prevRequests.filter(
          (request) =>
            request._id !== requestId
        )
      );
    } catch (err) {
      setRequestError(
        err.message ||
          "Failed to reject join request"
      );
    } finally {
      setProcessingRequest(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Loading team...
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error && !team) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">

          <h2 className="text-xl font-semibold text-red-500">
            Unable to load team
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>

          <div className="mt-6 flex justify-center gap-3">

            <button
              onClick={fetchTeam}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white"
            >
              Try Again
            </button>

            <Link
              to="/sih/teams"
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium"
            >
              Back
            </Link>

          </div>
        </div>
      </div>
    );
  }

  if (!team) return null;

  const leader = team.leaderId;

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

      <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">

        {/* ==========================================
            BACK
        =========================================== */}

        <Link
          to="/sih/teams"
          className="inline-flex items-center text-sm text-muted-foreground transition hover:text-primary"
        >
          ← Back to Teams
        </Link>

        {/* ==========================================
            TEAM HEADER
        =========================================== */}

        <div className="glass-strong mt-5 rounded-2xl p-6 sm:p-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>

              <p className="text-sm font-medium uppercase tracking-widest text-primary">
                SIH Team
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                {team.teamName}
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                {team.members?.length || 0} team member
                {team.members?.length !== 1
                  ? "s"
                  : ""}
              </p>

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
          

        </div>

        {/* ==========================================
            GENERAL ERROR
        =========================================== */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}
        

        {/* ==========================================
            TEAM LEADER
        =========================================== */}

        <div className="mt-8">

          <h2 className="mb-4 text-xl font-semibold">
            Team Leader
          </h2>

          <div className="glass-strong rounded-2xl p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                {leader?.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div className="flex-1">

                <h3 className="text-xl font-semibold">
                  {leader?.name}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  {leader?.email}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {leader?.branch && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      {leader.branch}
                    </span>
                  )}

                  {leader?.year && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      Year {leader.year}
                    </span>
                  )}

                  {leader?.department && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      {leader.department}
                    </span>
                  )}

                </div>

              </div>

              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Team Leader
              </span>

            </div>

          </div>

        </div>

        {/* ==========================================
            JOIN REQUESTS — LEADER ONLY
        =========================================== */}

        {isTeamLeader && (
          <div className="mt-10">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-xl font-semibold">
                Join Requests
              </h2>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {requests.length} Pending
              </span>

            </div>

            {requestMessage && (
              <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
                {requestMessage}
              </div>
            )}

            {requestError && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {requestError}
              </div>
            )}

            {requestsLoading ? (
              <div className="glass-strong rounded-2xl p-6 text-center text-sm text-muted-foreground">
                Loading join requests...
              </div>
            ) : requests.length === 0 ? (
              <div className="glass-strong rounded-2xl p-6 text-center">

                <h3 className="font-semibold">
                  No pending requests
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  New join requests will appear here.
                </p>

              </div>
            ) : (
              <div className="space-y-4">

                {requests.map((request) => {

                  const participant =
                    request.participantId;

                  const isProcessing =
                    processingRequest ===
                    request._id;

                  return (
                    <div
                      key={request._id}
                      className="glass-strong rounded-2xl p-5"
                    >

                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {participant?.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold">
                              {participant?.name ||
                                "Unknown Participant"}
                            </h3>

                            <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-[10px] font-medium text-yellow-500">
                              Pending
                            </span>

                          </div>

                          <p className="mt-1 break-all text-sm text-muted-foreground">
                            {participant?.email}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">

                            {participant?.phone && (
                              <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                                {participant.phone}
                              </span>
                            )}

                            {participant?.branch && (
                              <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                                {participant.branch}
                              </span>
                            )}

                            {participant?.year && (
                              <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                                Year {participant.year}
                              </span>
                            )}

                            {participant?.gender && (
                              <span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize">
                                {participant.gender}
                              </span>
                            )}

                          </div>

                          {participant?.department && (
                            <p className="mt-3 text-xs text-muted-foreground">
                              {participant.department}
                            </p>
                          )}

                          {participant?.skills?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">

                              {participant.skills.map(
                                (skill, index) => (
                                  <span
                                    key={index}
                                    className="text-xs text-primary"
                                  >
                                    #{skill}
                                  </span>
                                )
                              )}

                            </div>
                          )}

                        </div>

                        <div className="flex shrink-0 flex-col gap-2 sm:w-32">

                          <button
                            type="button"
                            onClick={() =>
                              handleAcceptRequest(
                                request._id
                              )
                            }
                            disabled={isProcessing}
                            className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isProcessing
                              ? "Processing..."
                              : "Accept"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleRejectRequest(
                                request._id
                              )
                            }
                            disabled={isProcessing}
                            className="rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Reject
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>
        )}

        {/* ==========================================
            MEMBERS
        =========================================== */}

        <div className="mt-10">

          <div className="mb-4 flex items-center justify-between">

            <h2 className="text-xl font-semibold">
              Team Members
            </h2>

            <span className="text-sm text-muted-foreground">
              {team.members?.length || 0} Members
            </span>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {team.members?.map((member) => {

              const isLeader =
                member._id === leader?._id;

              return (
                <div
                  key={member._id}
                  className="glass-strong rounded-2xl p-5"
                >

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                      {member.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold">
                          {member.name}
                        </h3>

                        {isLeader && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                            Leader
                          </span>
                        )}

                      </div>

                      <p className="mt-1 break-all text-sm text-muted-foreground">
                        {member.email}
                      </p>

                      {member.phone && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {member.phone}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-2">

                        {member.branch && (
                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                            {member.branch}
                          </span>
                        )}

                        {member.year && (
                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                            Year {member.year}
                          </span>
                        )}

                        {member.gender && (
                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs capitalize">
                            {member.gender}
                          </span>
                        )}

                      </div>

                      {member.skills?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">

                          {member.skills.map(
                            (skill, index) => (
                              <span
                                key={index}
                                className="text-xs text-primary"
                              >
                                #{skill}
                              </span>
                            )
                          )}

                        </div>
                      )}

                    </div>

                  </div>

                  {/* ==================================
                      REMOVE — LEADER ONLY
                  =================================== */}

                  {isTeamLeader &&
                    !isLeader && (
                      <button
                        onClick={() =>
                          handleRemoveMember(
                            member._id
                          )
                        }
                        disabled={
                          removing === member._id
                        }
                        className="mt-5 w-full rounded-xl border border-red-500/20 px-4 py-2.5 text-xs font-medium text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {removing === member._id
                          ? "Removing..."
                          : "Remove Member"}
                      </button>
                    )}

                </div>
              );
            })}

          </div>

        </div>

        {/* ==========================================
            TEAM INFO
        =========================================== */}

        <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-5">

          <h3 className="font-semibold">
            Team Information
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <div>
              <p className="text-xs text-muted-foreground">
                Team ID
              </p>

              <p className="mt-1 break-all text-sm font-medium">
                {team._id}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Created
              </p>

              <p className="mt-1 text-sm font-medium">
                {team.createdAt
                  ? new Date(
                      team.createdAt
                    ).toLocaleDateString()
                  : "—"}
              </p>
            </div>

          </div>

        </div>

        {/* ==========================================
            ACTIONS
        =========================================== */}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

          <Link
            to="/sih/teams"
            className="flex-1 rounded-xl border border-border px-5 py-3 text-center text-sm font-medium transition hover:bg-muted"
          >
            View All Teams
          </Link>

          {isTeamLeader && (
  <button
    onClick={handleDeleteTeam}
    className="rounded-xl border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
  >
    Delete Team
  </button>
)}

        </div>

      </section>
    </div>
  );
}

export default TeamDetails;