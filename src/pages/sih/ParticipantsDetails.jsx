import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, UserRound, GraduationCap, Code2 } from "lucide-react";
import GridAnimation from "../../components/GridAnimation";
import ParticipantAvatar from "../../components/ParticipantAvatar";
import { useSihAuth } from "../../context/SihAuthContext";

function ParticipantsDetails() {
  const { participantId } = useParams();
  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
  } = useSihAuth();

  const [participant, setParticipant] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sendingInvitation, setSendingInvitation] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");

  // ==========================================
  // FETCH PARTICIPANT
  // ==========================================

  const fetchParticipant = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/participants`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch participants"
        );
      }

      const participants = data.data || data;

      const foundParticipant = participants.find(
        (participant) =>
          participant._id?.toString() === participantId
      );

      if (!foundParticipant) {
        throw new Error("Participant not found");
      }

      setParticipant(foundParticipant);
    } catch (err) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (participantId) {
      fetchParticipant();
    }
  }, [participantId]);

  // ==========================================
  // INVITE PARTICIPANT
  // ==========================================

  const handleSendInvitation = async () => {
  if (!isAuthenticated) {
    navigate("/sih/login");
    return;
  }

  if (!participant?._id) return;

  try {
    setSendingInvitation(true);
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
          participantId: participant._id,
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

    window.dispatchEvent(
      new CustomEvent("sih-invitations-changed")
    );
  } catch (err) {
    setInviteError(
      err.message || "Failed to send invitation"
    );
  } finally {
    setSendingInvitation(false);
  }
};

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-24">

        <div className="pointer-events-none fixed inset-0 z-0">
          <GridAnimation />

          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 flex min-h-[70vh] items-center justify-center">
          <div className="text-sm text-white/50">
            Loading participant...
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !participant) {
    return (
      <div className="relative min-h-screen overflow-hidden px-4 pb-20 pt-24">

        <div className="pointer-events-none fixed inset-0 z-0">
          <GridAnimation />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-md items-center justify-center">

          <div className="w-full rounded-3xl border border-red-400/20 bg-red-400/5 p-8 text-center backdrop-blur-md">

            <h2 className="text-xl font-bold text-red-400">
              Participant not found
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/50">
              {"Unable to load this participant."}
            </p>

            <Link
              to="/sih/participants"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-primary/25
                bg-primary/5
                px-5
                py-2.5
                text-sm
                font-semibold
                text-primary
                transition-all
                duration-300
                hover:border-primary/50
                hover:bg-primary/10
              "
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Participants
            </Link>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-24 pt-24 sm:px-6">

      <div className="hidden md:block pointer-events-none">
        <GridAnimation />
      </div>

      {/* backgroundImage*/}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('../../images/backgroundImg.png')` }}
      ></div>

      {/*overlay layer*/}
      <div className='fixed inset-0 bg-linear-to-b from-black/70 to-black/80 '></div>

      {/* ==========================================
          PAGE
      ========================================== */}

      <section className="relative z-10 mx-auto w-full max-w-5xl">

        {/* Back */}
        <Link
          to="/sih/participants"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-white/45
            transition-all
            duration-300
            hover:-translate-x-1
            hover:text-primary
          "
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Participants
        </Link>

        {/* ==========================================
            PROFILE HERO
        ========================================== */}

        <div
          className="
            relative
            mt-6
            overflow-hidden
            rounded-[2rem]
            border
            border-primary/25
            bg-gradient-to-br
            from-primary/10
            via-white/5
            to-transparent
            p-8
            sm:p-10
            lg:p-12
            backdrop-blur-xl
            shadow-[0_0_60px_rgba(32,178,166,0.10)]
          "
        >

          {/* Glow */}
          <div
            className="
              pointer-events-none
              absolute
              -top-24
              left-1/2
              h-80
              w-80
              -translate-x-1/2
              rounded-full
              bg-primary/10
              blur-[110px]
            "
          />

          <div className="relative z-10 flex flex-col items-center text-center">

            {/* Avatar */}
            <button
              type="button"
              disabled={!participant.profileImage}
              onClick={() => {
                if (participant.profileImage) {
                  setSelectedAvatar({
                    src: participant.profileImage,
                    name: participant.name,
                  });
                }
              }}
              className="
                group/avatar
                relative
                h-32
                w-32
                overflow-hidden
                rounded-full
                border-2
                border-primary
                bg-primary/10
                shadow-[0_0_30px_rgba(32,178,166,0.20)]
                transition-all
                duration-300
                hover:scale-105
                hover:shadow-[0_0_40px_rgba(32,178,166,0.35)]
                disabled:cursor-default
                sm:h-40
                sm:w-40
              "
            >
              <ParticipantAvatar
                src={participant.profileImage}
                name={participant.name}
                size="h-full w-full"
                className="rounded-full"
                textClassName="
                  text-4xl
                  font-bold
                  text-primary
                  sm:text-5xl
                "
              />

              {participant.profileImage && (
                <span
                  className="
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
                    cursor-pointer
                  "
                >
                  View Photo
                </span>
              )}
            </button>

            {/* Name */}
            <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
              {participant.name}
            </h1>

          </div>
        </div>

        {/* ==========================================
            ACADEMIC INFORMATION
        ========================================== */}

        <section className="mt-12">

          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Academic Information
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              About
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">

            {/* Department */}
            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-5
                backdrop-blur-md
                transition-all
                duration-300
                hover:border-primary/25
                hover:bg-primary/5
              "
            >
              <div className="flex items-center gap-2 text-white/35">
                <GraduationCap className="h-4 w-4" />

                <p className="text-xs uppercase tracking-wider">
                  Department
                </p>
              </div>

              <p className="mt-3 text-sm font-semibold text-white">
                {participant.department || "—"}
              </p>
            </div>

            {/* Branch */}
            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-5
                backdrop-blur-md
                transition-all
                duration-300
                hover:border-primary/25
                hover:bg-primary/5
              "
            >
              <div className="flex items-center gap-2 text-white/35">
                <Code2 className="h-4 w-4" />

                <p className="text-xs uppercase tracking-wider">
                  Branch
                </p>
              </div>

              <p className="mt-3 text-sm font-semibold text-white">
                {participant.branch || "—"}
              </p>
            </div>

            {/* Year */}
            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-5
                backdrop-blur-md
                transition-all
                duration-300
                hover:border-primary/25
                hover:bg-primary/5
              "
            >
              <div className="flex items-center gap-2 text-white/35">
                <UserRound className="h-4 w-4" />

                <p className="text-xs uppercase tracking-wider">
                  Year
                </p>
              </div>

              <p className="mt-3 text-sm font-semibold text-white">
                {participant.year
                  ? `${participant.year} Year`
                  : "—"}
              </p>
            </div>

          </div>
        </section>

        {/* ==========================================
            SKILLS
        ========================================== */}

        <section className="mt-10">

          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Technical Profile
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Skills
            </h2>
          </div>

          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-6
              backdrop-blur-md
            "
          >
            {participant.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {participant.skills.map((skill, index) => (
                  <span
                    key={`${participant._id}-${index}`}
                    className="
                      rounded-full
                      border
                      border-primary/20
                      bg-primary/5
                      px-4
                      py-2
                      text-sm
                      font-medium
                      text-primary
                      transition-all
                      duration-300
                      hover:border-primary/40
                      hover:bg-primary/10
                    "
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">
                No skills added.
              </p>
            )}
          </div>

        </section>

        {/* ==========================================
            CONTACT
        ========================================== */}

        <section className="mt-10">

          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Contact
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Get in Touch
            </h2>
          </div>

          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/5
              p-6
              backdrop-blur-md
            "
          >
            <div className="flex items-start gap-4">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-primary/20
                  bg-primary/5
                "
              >
                <Mail className="h-5 w-5 text-primary" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  Email
                </p>

                <p className="mt-2 break-all text-sm font-medium text-white/80">
                  {participant.email || "Not available"}
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* ==========================================
            MESSAGES
        ========================================== */}

        {inviteMessage && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-green-400/20
              bg-green-400/5
              px-5
              py-4
              text-center
              text-sm
              font-medium
              text-green-400
            "
          >
            {inviteMessage}
          </div>
        )}

        {inviteError && (
          <div
            className="
              mt-6
              rounded-2xl
              border
              border-red-400/20
              bg-red-400/5
              px-5
              py-4
              text-center
              text-sm
              font-medium
              text-red-400
            "
          >
            { inviteError || "Something went wrong."}
          </div>
        )}


        {/* ==========================================
            CTA
        ========================================== */}

        {isAuthenticated && (
          <section className="mt-10">

            <button
              type="button"
              onClick={handleSendInvitation}
              disabled={sendingInvitation}
              className="
                w-full
                rounded-2xl
                bg-primary
                px-6
                py-4
                text-sm
                font-bold
                text-white
                shadow-[0_0_25px_rgba(32,178,166,0.18)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-primary2
                hover:shadow-[0_0_35px_rgba(32,178,166,0.3)]
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-50
                cursor-pointer
              "
            >
              {sendingInvitation
                ? "Sending Invitation..."
                : "Invite to Join Team →"}
            </button>

          </section>
        )}

        {/* ==========================================
            BACK
        ========================================== */}

        <div className="mt-8 text-center">
          <Link
            to="/sih/participants"
            className="
              text-sm
              text-white/40
              transition-colors
              duration-300
              hover:text-primary
            "
          >
            ← Back to Participants
          </Link>
        </div>

      </section>

      {/* ==========================================
          LARGE AVATAR VIEWER
      ========================================== */}

      {selectedAvatar && (
        <div
          className="
            fixed
            inset-0
            z-[100]
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
            onClick={(event) => event.stopPropagation()}
          >

            {/* Close */}
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
                hover:bg-primary
              "
            >
              ×
            </button>

            {/* Image */}
            <img
              src={selectedAvatar.src}
              alt={selectedAvatar.name}
              className="
                max-h-[85vh]
                max-w-[90vw]
                rounded-3xl
                border
                border-primary/30
                object-contain
                shadow-[0_0_60px_rgba(32,178,166,0.25)]
              "
            />

            <p className="mt-4 text-center text-sm font-semibold text-white/80">
              {selectedAvatar.name}
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

export default ParticipantsDetails;