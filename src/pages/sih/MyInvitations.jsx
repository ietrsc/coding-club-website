import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Inbox, X } from "lucide-react";
import GridAnimation from "../../components/GridAnimation";
import ParticipantAvatar from "../../components/ParticipantAvatar";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

function MyInvitations() {
  const navigate = useNavigate();

  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/invitations/my`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load invitations"
        );
      }

      setInvitations(data.data || []);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (invitationId) => {
    try {
      setProcessingId(invitationId);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/invitations/${invitationId}/accept`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to accept invitation"
        );
      }

      setMessage(
        data.message || "Invitation accepted successfully!"
      );

      setInvitations((previousInvitations) =>
        previousInvitations.filter(
          (invitation) => invitation._id !== invitationId
        )
      );
      window.dispatchEvent(
  new CustomEvent("sih-invitations-changed")
);

      setTimeout(() => {
        navigate("/sih/teams");
      }, 1000);
    } catch (error) {
      setError(
        error.message || "Failed to accept invitation"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (invitationId) => {
    try {
      setProcessingId(invitationId);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/invitations/${invitationId}/reject`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to reject invitation"
        );
      }

      setMessage(
        data.message || "Invitation rejected successfully"
      );

      setInvitations((previousInvitations) =>
        previousInvitations.filter(
          (invitation) => invitation._id !== invitationId
        )
      );
      window.dispatchEvent(
  new CustomEvent("sih-invitations-changed")
);

    } catch (error) {
      setError(
        error.message || "Failed to reject invitation"
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 pt-24">
        <div className="flex flex-col items-center gap-4 text-center">
          <div
            className="
              h-10
              w-10
              rounded-full
              border-2
              border-primary/20
              border-t-primary
              animate-spin
            "
          />

          <div>
            <p className="text-sm font-medium text-white/70">
              Loading invitations...
            </p>

            <p className="mt-1 text-xs text-white/40">
              Checking your pending team invitations
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-20 pt-28 sm:px-6">

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

      <section className="mx-auto w-full max-w-6xl animate-[fadeIn_1s_ease-in-out]">

        {/* Header */}
        <div className="relative mb-10 text-center">
          <span
            className="
              inline-flex
              rounded-full
              border border-primary/25
              bg-primary/10
              px-3
              py-1
              text-xs
              font-semibold
              tracking-wider
              text-primary
            "
          >
            TEAM INVITATIONS
          </span>

          <h1
            className="
              mt-4
              text-3xl
              font-bold
              text-white
              sm:text-4xl
              lg:text-5xl
            "
          >
            Your Invitations
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/50 sm:text-base">
            Teams that want you as a member will appear here.
            Review their invitations and decide whether you want
            to join.
          </p>
        </div>

        {/* Success */}
        {message && (
          <div
            className="
              mx-auto
              mb-6
              max-w-2xl
              rounded-2xl
              border border-green-400/20
              bg-green-400/5
              px-5
              py-4
              text-center
              backdrop-blur-md
            "
          >
            <div className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4 text-green-400" />

              <p className="text-sm font-medium text-green-400">
                {message}
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="
              mx-auto
              mb-6
              max-w-2xl
              rounded-2xl
              border border-red-400/20
              bg-red-400/5
              px-5
              py-4
              text-center
              backdrop-blur-md
            "
          >
            <div className="flex items-center justify-center gap-2">
              <X className="h-4 w-4 text-red-400" />

              <p className="text-sm font-medium text-red-400">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && invitations.length === 0 && (
          <div
            className="
              mx-auto
              mt-12
              max-w-xl
              rounded-3xl
              border border-primary/20
              bg-white/5
              p-10
              text-center
              backdrop-blur-md
              shadow-[0_0_35px_rgba(32,178,166,0.08)]
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border border-primary/25
                bg-primary/10
              "
            >
              <Inbox className="h-8 w-8 text-primary" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white">
              No Pending Invitations
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
              You don't have any pending team invitations right now.
              Keep an eye on your profile as team leaders may invite
              you to join their teams.
            </p>

            <button
              type="button"
              onClick={() => navigate("/sih/teams")}
              className="
                mt-6
                rounded-xl
                border border-primary/25
                bg-primary/5
                px-6
                py-3
                text-sm
                font-semibold
                text-primary
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-primary/50
                hover:bg-primary/10
                active:scale-95
                cursor-pointer
              "
            >
              Browse Teams →
            </button>
          </div>
        )}

        {/* Invitations */}
        {invitations.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {invitations.map((invitation) => {
              const isProcessing =
                processingId === invitation._id;

              return (
                <div
                  key={invitation._id}
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
                  {/* Glow */}
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
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                        Team Invitation
                      </p>

                      <h2 className="mt-2 truncate text-2xl font-bold text-white">
                        {invitation.teamId?.teamName || "Team"}
                      </h2>
                    </div>

                    <span
                      className="
                        shrink-0
                        rounded-full
                        border border-yellow-400/20
                        bg-yellow-400/10
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-yellow-300
                      "
                    >
                      Pending
                    </span>
                  </div>

                  {/* Leader */}
                  <div
                    className="
                      relative
                      mt-6
                      rounded-2xl
                      border border-white/5
                      bg-black/20
                      p-5
                    "
                  >
                    <p className="text-xs font-medium uppercase tracking-wider text-white/35">
                      Invited by
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      <ParticipantAvatar
                        src={invitation.teamId?.leaderId?.profileImage}
                        name={invitation.teamId?.leaderId?.name}
                        size="h-10 w-10"
                        className="rounded-full bg-primary/10"
                        textClassName="text-sm font-semibold text-primary"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-white">
                          {invitation.teamId?.leaderId?.name ||
                            "Unknown"}
                        </p>

                        {invitation.teamId?.leaderId?.email && (
                          <p className="truncate text-sm text-white/45">
                            {invitation.teamId.leaderId.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleReject(invitation._id)
                      }
                      disabled={isProcessing}
                      className="
                        rounded-xl
                        border border-red-400/20
                        bg-red-400/5
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-red-400
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:border-red-400/40
                        hover:bg-red-400/10
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isProcessing ? "Processing..." : "Reject"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleAccept(invitation._id)
                      }
                      disabled={isProcessing}
                      className="
                        rounded-xl
                        bg-primary
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        shadow-[0_0_20px_rgba(32,178,166,0.15)]
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:bg-primary2
                        hover:shadow-[0_0_30px_rgba(32,178,166,0.3)]
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isProcessing ? "Processing..." : "Accept →"}
                    </button>
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

        {/* Back */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => navigate("/sih")}
            className="
              text-sm
              text-white/40
              transition-colors
              duration-300
              hover:text-primary
            "
          >
            ← Back to SIH
          </button>
        </div>

      </section>
    </div>
  );
}

export default MyInvitations;