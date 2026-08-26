import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSihAuth } from "../../context/SihAuthContext";
import GridAnimation from "../../components/GridAnimation";
import ParticipantAvatar from "../../components/ParticipantAvatar";
import { div } from "framer-motion/client";


function TeamDetails() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    fetchCurrentUser,
    loading: authLoading,
  } = useSihAuth();

  const [selectedAvatar, setSelectedAvatar] = useState(null);
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
  const totalMembers = (team?.members?.length || 0);

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
    <div className="relative min-h-screen overflow-hidden pt-24 pb-20">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <GridAnimation />

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:
              "url('../../images/backgroundImg.png')",
          }}
        />

        <div className="absolute inset-0 bg-black/10" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6">

        {/* Back */}
        <Link
          to="/sih/teams"
          className="
          inline-flex
          items-center
          gap-2
          text-sm
          text-white/45
          transition-all
          duration-300
          hover:-translate-x-0.5
          hover:text-primary
        "
        >
          ← Back to Teams
        </Link>

        {/* ==================================================
          TEAM PROFILE HEADER
      ================================================== */}
        <div
          className="
          relative
          mt-6
          overflow-hidden
          rounded-4xl
          border border-primary/25
          bg-linear-to-br
          from-primary/10
          via-white/5
          to-transparent
          p-6
          sm:p-8
          lg:p-10
          backdrop-blur-xl
          shadow-[0_0_60px_rgba(32,178,166,0.10)]
        "
        >
          {/* Glow */}
          <div
            className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-80
            w-80
            rounded-full
            bg-primary/15
            blur-[100px]
          "
          />

          <div
            className="
            pointer-events-none
            absolute
            -bottom-32
            -left-32
            h-72
            w-72
            rounded-full
            bg-primary/5
            blur-[90px]
          "
          />

          <div className="relative">

            {/* Top row */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

              <div className="flex items-start gap-5">

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                    SIH Internal Hackathon
                  </p>

                  <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {team.teamName}
                  </h1>

                  <p className="mt-2 text-sm text-white/45">
                    Team Leader:{" "}
                    <span className="font-semibold text-white/80">
                      {leader?.name || "Unknown"}
                    </span>
                  </p>
                </div>

              </div>

              {/* Status */}
              <div>
                {isEligible ? (
                  <div
                    className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border border-green-400/20
                    bg-green-400/10
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-green-400
                  "
                  >
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    Eligible
                  </div>
                ) : (
                  <div
                    className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border border-yellow-400/20
                    bg-yellow-400/10
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-yellow-300
                  "
                  >
                    <span className="h-2 w-2 rounded-full bg-yellow-300" />
                    Incomplete
                  </div>
                )}
              </div>

            </div>

            {/* Member progress */}
            <div className="mt-8">

              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                  Team Completion
                </span>

                <span className="text-sm font-bold text-primary">
                  {totalMembers} / 6
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="
                  h-full
                  rounded-full
                  bg-linear-to-r
                  from-primary
                  to-teal-300
                  shadow-[0_0_15px_rgba(32,178,166,0.5)]
                  transition-all
                  duration-500
                "
                  style={{
                    width: `${Math.min((totalMembers / 6) * 100, 100)}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs leading-relaxed text-white/40">
                {isEligible
                  ? "This team has completed the required team composition and is eligible to participate."
                  : "This team can continue adding members until the required team size is reached."}
              </p>

            </div>

          </div>
        </div>

        {/* General error */}
        {error && (
          <div
            className="
            mt-5
            rounded-2xl
            border border-red-400/20
            bg-red-400/5
            px-5
            py-4
            text-sm
            text-red-400
          "
          >
            {error}
          </div>
        )}

        {/* ==================================================
  TEAM LEADER
================================================== */}
        <section className="mt-12">

          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Team Leadership
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              Team Leader
            </h2>
          </div>

          <div
            className="
      relative
      overflow-hidden
      rounded-4xl
      border border-primary/25
      bg-linear-to-br
      from-primary/10
      via-white/5
      to-transparent
      p-6
      sm:p-8
      lg:p-10
      backdrop-blur-xl
      shadow-[0_0_50px_rgba(32,178,166,0.10)]
    "
          >
            {/* Background glow */}
            <div
              className="
    pointer-events-none
    absolute
    -top-24
    left-1/2
    h-72
    w-72
    -translate-x-1/2
    rounded-full
    bg-primary/10
    blur-[100px]
  "
            />

            <div className="relative z-10 flex flex-col items-center text-center">

              {/* Profile Picture */}
              <button
                type="button"
                disabled={!leader?.profileImage}
                onClick={(e) => {
                  e.stopPropagation();

                  if (leader?.profileImage) {
                    setSelectedAvatar({
                      src: leader.profileImage,
                      name: leader.name,
                    });
                  }
                }}
                className="
      group/avatar
      relative
      h-40
      w-40
      overflow-hidden
      rounded-full
      border-2
      border-primary
      bg-primary/10
      shadow-[0_0_25px_rgba(32,178,166,0.2)]
      transition-all
      duration-300
      hover:scale-105
      hover:shadow-[0_0_35px_rgba(32,178,166,0.35)]
      disabled:cursor-default
    "
              >
                <ParticipantAvatar
                  src={leader?.profileImage}
                  name={leader?.name}
                  size="h-full w-full"
                  className="rounded-full"
                  textClassName="text-4xl font-bold text-primary"
                />

                {/* View Photo Overlay */}
                {leader?.profileImage && (
                  <span
                    className="
                    cursor-pointer
          absolute
          inset-0
          flex
          items-center
          justify-center
          rounded-full
          bg-black/55
          text-xs
          font-semibold
          text-white
          opacity-0
          transition-opacity
          duration-300
          group-hover/avatar:opacity-100
        "
                  >
                    View Photo
                  </span>
                )}
              </button>

              {/* Name */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  {leader?.name || "Unknown Leader"}
                </h3>

                <span
                  className="
            rounded-full
            border border-primary/30
            bg-primary/10
            px-3
            py-1
            text-[10px]
            font-bold
            uppercase
            tracking-wider
            text-primary
          "
                >
                  Team Leader
                </span>

              </div>

              {/* Academic Info */}
              <div className="mt-3 flex flex-wrap justify-center gap-2">

                {leader?.branch && (
                  <span
                    className="
              rounded-full
              border border-white/10
              bg-black/20
              px-3
              py-1.5
              text-xs
              text-white/60
            "
                  >
                    {leader.branch}
                  </span>
                )}

                {leader?.year && (
                  <span
                    className="
              rounded-full
              border border-white/10
              bg-black/20
              px-3
              py-1.5
              text-xs
              text-white/60
            "
                  >
                    Year - {leader.year}
                  </span>
                )}

                {leader?.department && (
                  <span
                    className="
              rounded-full
              border border-white/10
              bg-black/20
              px-3
              py-1.5
              text-xs
              text-white/60
            "
                  >
                    {leader.department}
                  </span>
                )}

              </div>

              {/* Contact Details */}
              <div
                className="
          mt-8
          w-full
          max-w-2xl
          grid
          grid-cols-1
          gap-4
        "
              >

                <div
                  className="
            rounded-2xl
            border border-white/10
            bg-black/20
            p-4
            hover:bg-primary/12
            hover:border-primary
          "
                >
                  <p className="text-[10px] uppercase tracking-wider text-white/30">
                    Email
                  </p>

                  <p className="mt-2 break-all text-sm text-white/80">
                    {leader?.email || "Not available"}
                  </p>
                </div>

                {/* <div
                  className="
            rounded-2xl
            border border-white/10
            bg-black/20
            p-4
            hover:bg-primary/12
            hover:border-primary
          "
                >
                  <p className="text-[10px] uppercase tracking-wider text-white/30">
                    Phone
                  </p>

                  <p className="mt-2 text-sm text-white/80">
                    {leader?.phone || "Not available"}
                  </p>
                </div> */}

              </div>

              {/* Skills */}
              {leader?.skills?.length > 0 && (
                <div className="mt-6 w-full max-w-2xl">

                  <p className="mb-3 text-[10px] uppercase tracking-wider text-white/30">
                    Skills
                  </p>

                  <div className="flex flex-wrap justify-center gap-2">

                    {leader.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="
                  rounded-full
                  border border-primary/20
                  bg-primary/5
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-primary
                "
                      >
                        #{skill}
                      </span>
                    ))}

                  </div>

                </div>
              )}

            </div>
          </div>
        </section>


        {/* ==================================================
  TEAM MEMBERS
================================================== */}
        <section className="mt-12">

          <div className="mb-5 flex items-end justify-between gap-4">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                The Squad
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                Team Members
              </h2>
            </div>

            <span
              className="
        rounded-full
        border border-primary/15
        bg-primary/5
        px-3
        py-1
        text-xs
        font-semibold
        text-primary
      "
            >
              {totalMembers} / 6
            </span>

          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {team.members?.length === 1 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/40 backdrop-blur-md">
                No other members have joined yet.
              </div>
            )}

            {team.members?.map((member) => {

              const isLeader = member._id === leader?._id;

              if (isLeader) return null;

              return (
                <div
                  key={member._id}
                  className="
            group
            relative
            overflow-hidden
            rounded-3xl
            border border-white/10
            bg-white/5
            p-5
            backdrop-blur-md
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-primary/25
            hover:bg-primary/5
          "
                >

                  <div className="flex gap-4">

                    <button type="button"
                      disabled={!member?.profileImage}
                      onClick={(e) => {
                        e.stopPropagation();

                        if (member?.profileImage) {
                          setSelectedAvatar({
                            src: member.profileImage,
                            name: member.name,
                          });
                        }
                      }}
                      className="
      group/avatar
      relative
      h-20
      w-20
      overflow-hidden
      rounded-full
      border-2
      border-primary
      bg-primary/10
      shadow-[0_0_25px_rgba(32,178,166,0.2)]
      transition-all
      duration-300
      hover:scale-105
      hover:shadow-[0_0_35px_rgba(32,178,166,0.35)]
      disabled:cursor-default
    ">

                      <ParticipantAvatar
                        src={member.profileImage}
                        name={member.name}
                        size="h-full w-full"
                        className="
                rounded-xl
                border border-white/10
                bg-black/20
              "
                        textClassName="font-semibold text-primary"
                      />
                      {member.profileImage && (
                        <span
                          className="
                      cursor-pointer
              absolute
              inset-0
              flex
              items-center
              justify-center
              rounded-full
              bg-black/50
              text-xs
              font-semibold
              text-white
              opacity-0
              transition-opacity
              duration-300
              hover:opacity-100
            "
                        >
                          View Photo
                        </span>
                      )}
                    </button>

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate font-semibold text-white">
                        {member.name}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {member.branch && (
                          <span
                            className="
                      rounded-full
                      bg-black/20
                      px-2.5
                      py-1
                      text-xs
                      text-white/55
                    "
                          >
                            {member.branch}
                          </span>
                        )}

                        {member.year && (
                          <span
                            className="
                      rounded-full
                      bg-black/20
                      px-2.5
                      py-1
                      text-xs
                      text-white/55
                    "
                          >
                            Year - {member.year}
                          </span>
                        )}

                      </div>

                      {member.skills?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">

                          {member.skills.map((skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="text-xs text-primary/80"
                            >
                              #{skill}
                            </span>
                          ))}

                        </div>
                      )}

                    </div>

                  </div>


                  {/* Leader Controls */}
                  {isTeamLeader && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member._id)}
                      disabled={removing === member._id}
                      className="
                mt-5
                w-full
                rounded-xl
                border border-red-400/15
                bg-red-400/5
                px-4
                py-2.5
                text-xs
                font-semibold
                text-red-400
                transition-all
                duration-300
                hover:border-red-400/30
                hover:bg-red-400/10
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
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
        </section>

        {/* ==================================================
          JOIN REQUESTS
      ================================================== */}
        {isTeamLeader && (
          <section className="mt-12">

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  Team Control
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                  Join Requests
                </h2>
              </div>

              <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                {requests.length} Pending
              </span>
            </div>

            {requestMessage && (
              <div className="mb-4 rounded-2xl border border-green-400/20 bg-green-400/5 px-5 py-4 text-sm text-green-400">
                {requestMessage}
              </div>
            )}

            {requestError && (
              <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/5 px-5 py-4 text-sm text-red-400">
                {requestError}
              </div>
            )}

            {requestsLoading ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/40 backdrop-blur-md">
                Loading requests...
              </div>
            ) : requests.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
                <h3 className="font-semibold text-white">
                  No pending requests
                </h3>

                <p className="mt-2 text-sm text-white/40">
                  New requests from students will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => {

                  const participant =
                    request.participantId;

                  const isProcessing =
                    processingRequest === request._id;

                  return (
                    <div
                      key={request._id}
                      className="
                      rounded-3xl
                      border border-white/10
                      bg-white/5
                      p-5
                      backdrop-blur-md
                    "
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

                        <div className="flex min-w-0 flex-1 gap-4">

                          <ParticipantAvatar
                            src={participant?.profileImage}
                            name={participant?.name}
                            size="h-12 w-12"
                            className="rounded-xl bg-primary/10"
                            textClassName="text-primary"
                          />

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-white">
                                {participant?.name ||
                                  "Unknown Participant"}
                              </h3>

                              <span className="rounded-full bg-yellow-400/10 px-2.5 py-1 text-[10px] font-semibold text-yellow-300">
                                Pending
                              </span>
                            </div>

                            <p className="mt-1 truncate text-sm text-white/40">
                              {participant?.email}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {participant?.branch && (
                                <span className="rounded-full bg-black/20 px-2.5 py-1 text-xs text-white/55">
                                  {participant.branch}
                                </span>
                              )}

                              {participant?.year && (
                                <span className="rounded-full bg-black/20 px-2.5 py-1 text-xs text-white/55">
                                  Year {participant.year}
                                </span>
                              )}
                            </div>

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

                        </div>

                        <div className="flex gap-2 lg:w-52 lg:flex-col">
                          <button
                            type="button"
                            onClick={
                              () => navigate(`/sih/participants/${participant._id}`)
                            }
                            className="
                            flex-1
                            rounded-xl
                            border
                            border-primary
                            bg-primary/5
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition-all
                            duration-300
                            hover:bg-primary2
                            disabled:opacity-50
                            cursor-pointer
                          "
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleAcceptRequest(request._id)
                            }
                            disabled={isProcessing}
                            className="
                            cursor-pointer
                            flex-1
                            rounded-xl
                            bg-primary
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            transition-all
                            duration-300
                            hover:bg-primary2
                            disabled:opacity-50
                          "
                          >
                            {isProcessing
                              ? "Processing..."
                              : "Accept"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleRejectRequest(request._id)
                            }
                            disabled={isProcessing}
                            className="
                            cursor-pointer
                            flex-1
                            rounded-xl
                            border border-red-400/20
                            bg-red-400/5
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-red-400
                            transition-all
                            duration-300
                            hover:bg-red-400/10
                            disabled:opacity-50
                          "
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
          </section>
        )}

        {/* ==================================================
          TEAM DETAILS
      ================================================== */}
        <section className="mt-12">

          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Team Identity
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              Team Details
            </h2>
          </div>

          <div
            className="
            rounded-3xl
            border border-white/10
            bg-white/5
            p-6
            backdrop-blur-md
          "
          >
            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <p className="text-xs uppercase tracking-wider text-white/30">
                  Team ID
                </p>

                <p className="mt-2 break-all text-sm font-medium text-white/80">
                  {team._id}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/30">
                  Created
                </p>

                <p className="mt-2 text-sm font-medium text-white/80">
                  {team.createdAt
                    ? new Date(
                      team.createdAt
                    ).toLocaleDateString()
                    : "—"}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ==================================================
          ACTIONS
      ================================================== */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">

          <Link
            to="/sih/teams"
            className="
            flex-1
            rounded-xl
            border border-primary/20
            bg-white/5
            px-5
            py-3
            text-center
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:border-primary/40
            hover:bg-primary/10
            hover:text-primary
          "
          >
            ← View All Teams
          </Link>

          {isTeamLeader && (
            <button
              type="button"
              onClick={handleDeleteTeam}
              className="
              rounded-xl
              border border-red-400/20
              bg-red-400/5
              px-5
              py-3
              text-sm
              font-semibold
              text-red-400
              transition-all
              duration-300
              hover:border-red-400/40
              hover:bg-red-500
              hover:text-white
            "
            >
              Delete Team
            </button>
          )}

        </div>

        {selectedAvatar && (
          <div
            className="
      fixed
      inset-0
      z-100
      flex
      items-center
      justify-center
      bg-black/85
      p-4
      backdrop-blur-md
    "
            onClick={() => setSelectedAvatar(null)}
          >
            <div
              className="relative flex max-h-[95vh] max-w-[95vw] flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedAvatar(null)}
                className="
          absolute
          -right-3
          -top-3
          z-20
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border
          border-white/10
          bg-black/80
          text-xl
          text-white
          transition-all
          duration-300
          hover:scale-105
          hover:bg-primary
          cursor-pointer
        "
              >
                ×
              </button>

              {/* Large Image */}
              <img
                src={selectedAvatar.src}
                alt={selectedAvatar.name}
                className="
                max-h-[70vh]
                max-w-[75vw]
          rounded-3xl
          border
          border-primary/30
          object-contain
          shadow-[0_0_60px_rgba(32,178,166,0.25)]
        "
              />

              {/* Name */}
              <p className="mt-4 text-center text-sm font-semibold text-white/80">
                {selectedAvatar.name}
              </p>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}

export default TeamDetails;