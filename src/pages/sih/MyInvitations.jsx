import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

function MyInvitations() {
  const navigate = useNavigate();

  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // GET MY PENDING INVITATIONS
  // ==========================================

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
      setError(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  // ==========================================
  // ACCEPT INVITATION
  // ==========================================

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

console.log("Accept invitation response:", data);

if (!response.ok) {
  throw new Error(
    data.message || "Failed to accept invitation"
  );
}

      setMessage(
        data.message || "Invitation accepted successfully!"
      );

      // Remove invitation from UI
      setInvitations((previousInvitations) =>
        previousInvitations.filter(
          (invitation) =>
            invitation._id !== invitationId
        )
      );
      window.dispatchEvent(
  new CustomEvent("sih-invitations-changed")
);

      // Redirect to team page after success
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

  // ==========================================
  // REJECT INVITATION
  // ==========================================

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

      // Remove invitation from UI
      setInvitations((previousInvitations) =>
        previousInvitations.filter(
          (invitation) =>
            invitation._id !== invitationId
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

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <p className="text-muted-foreground">
          Loading invitations...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="mx-auto w-full max-w-6xl px-5">

        {/* ================= HEADER ================= */}

        <div className="text-center">
          <p className="text-sm font-semibold tracking-wider text-primary">
            TEAM INVITATIONS
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Your Invitations
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Teams that want you as a member will appear here.
            You can accept or reject their invitation.
          </p>
        </div>

        {/* ================= SUCCESS MESSAGE ================= */}

        {message && (
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-sm text-green-600">
            {message}
          </div>
        )}

        {/* ================= ERROR MESSAGE ================= */}

        {error && (
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {!error && invitations.length === 0 && (
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-border p-8 text-center">
            <h2 className="text-xl font-semibold">
              No Pending Invitations
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              You don't have any pending team invitations right now.
            </p>
          </div>
        )}

        {/* ================= INVITATION CARDS ================= */}

        {invitations.length > 0 && (
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">

            {invitations.map((invitation) => (
              <div
                key={invitation._id}
                className="glass rounded-2xl border border-border p-6"
              >
                {/* Team Info */}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium tracking-wider text-primary">
                      TEAM INVITATION
                    </p>

                    <h2 className="mt-2 text-xl font-bold">
                      {invitation.teamId?.teamName || "Team"}
                    </h2>
                  </div>

                  <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-600">
                    Pending
                  </span>
                </div>

                {/* Leader Info */}

                <div className="mt-5 rounded-xl border border-border bg-surface p-4">
                  <p className="text-xs text-muted-foreground">
                    Team Leader
                  </p>

                  <p className="mt-1 font-medium">
                    {invitation.teamId?.leaderId?.name ||
                      "Unknown"}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {invitation.teamId?.leaderId?.email || ""}
                  </p>
                </div>

                {/* Action Buttons */}

                <div className="mt-6 grid grid-cols-2 gap-3">

                  <button
                    onClick={() =>
                      handleReject(invitation._id)
                    }
                    disabled={
                      processingId === invitation._id
                    }
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition hover:border-red-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {processingId === invitation._id
                      ? "Processing..."
                      : "Reject"}
                  </button>

                  <button
                    onClick={() =>
                      handleAccept(invitation._id)
                    }
                    disabled={
                      processingId === invitation._id
                    }
                    className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {processingId === invitation._id
                      ? "Processing..."
                      : "Accept"}
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </section>
    </div>
  );
}

export default MyInvitations;