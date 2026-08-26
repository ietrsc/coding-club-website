import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GridAnimation from "../../components/GridAnimation";
import ParticipantAvatar from "../../components/ParticipantAvatar";
import { events } from "../../data/event";


function Participants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const navigate = useNavigate();

  // user.participantId.teamId is now populated with
  // { _id, teamName, leaderId } by getCurrentUser, so we
  // can tell if the logged-in participant leads their team
  // without a second network request.



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

  useEffect(() => {
    fetchParticipants();
  }, []);

  const event = events.find((e) => e.slug === "sih-2026");

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-28">

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
        animate-[fadeIn_1s_ease-in-out]
        relative
        group
        overflow-hidden
        h-96
        w-full
        max-w-59 sm:max-w-68 max-h-83 sm:max-h-100
        mx-auto
        rounded-2xl
        border
        border-primary/30
        bg-primary/10
        backdrop-blur-md
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-primary/50
        hover:shadow-[0_0_30px_rgba(32,178,166,0.2)]
        z-10
        active:scale-[0.98]
      "
              >

                {/* Ambient background */}
                <div
                  className="
          absolute
          -top-20
          left-1/2
          -translate-x-1/2
          h-56
          w-56
          rounded-full
          bg-primary/10
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-primary/20
          max-w-59 sm:max-w-68 max-h-83 sm:max-h-96
        "
                />

                <img
                  src="/images/cardBg.png"
                  alt="bg"
                  className="absolute inset-0 opacity-90 sm:opacity-70 group-hover:opacity-90 object-contain transition duration-300"
                />

                {/* Large Profile Avatar */}
                <button
                  type="button"
                  disabled={!participant.profileImage}
                  onClick={(e) => {
                    e.stopPropagation();

                    if (participant.profileImage) {
                      setSelectedAvatar({
                        src: participant.profileImage,
                        name: participant.name,
                      });
                    }
                  }}
                  className="
          absolute
          top-8
          left-1/2
          -translate-x-1/2
          z-20
          h-22
          w-22
          md:h-32
          md:w-32
          rounded-full
          border-2
          border-primary
          bg-primary/10
          overflow-hidden
          shadow-[0_0_25px_rgba(32,178,166,0.2)]
          transition-all
          duration-300
          hover:scale-105
          hover:shadow-[0_0_35px_rgba(32,178,166,0.35)]
          disabled:cursor-default
        "
                >
                  <ParticipantAvatar
                    src={participant.profileImage}
                    name={participant.name}
                    size="h-full w-full"
                    className="rounded-full"
                    textClassName="text-3xl font-bold text-primary"
                  />

                  {participant.profileImage && (
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

                {/* Content */}
                <div
                  className="
          relative mt-30 md:mt-42
          inset-x-0
          z-10
          flex
          flex-col
          items-center
          mx-6
          text-center

          to-transparent
        "
                >

                  {/* Name */}
                  <h2 className=" text-xl font-bold text-white">
                    {participant.name}
                  </h2>

                  {/* Academic Information */}
                  <div className="relative mt-1 grid grid-cols-2 gap-3">

                    <div className="rounded-xl border border-white/5 bg-black/20 p-4 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-white/30">
                        Branch
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-white">
                        {participant.branch.toUpperCase() || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-black/20 p-4 text-center">
                      <p className="text-[10px] uppercase tracking-wider text-white/30">
                        Year
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {participant.year || "—"}
                      </p>
                    </div>

                  </div>

                  {/* View Details Button */}

                  <button
                    type="button"
                    onClick={
                      () => navigate(`/sih/participants/${participant._id}`)
                    }
                    className={`

                      cursor-pointer
              mt-3
              w-full

              max-w-40
              rounded-2xl
              border
              border-primary

              px-4
              py-2.5
              text-xs
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-primary
              active:bg-primary
              hover:-translate-y-0.5
              hover:shadow-[0_0_25px_rgba(32,178,166,0.25)]
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-50
            bg-primary/5
            `}
                  >
                    View Details →

                    {/* {sendingInvitation === participant._id
                        ? "Sending Invitation..."
                        : "Invite to Join Team →"} */}
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
            ))}
          </div>
        )}


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
      px-4
      backdrop-blur-sm
    "
            onClick={() => setSelectedAvatar(null)}
          >
            <div
              className="relative max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setSelectedAvatar(null)}
                className="
          absolute
          -right-3
          -top-3
          z-10
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          border border-white/10
          bg-black/70
          text-xl
          text-white
          transition-all
          hover:bg-primary
          cursor-pointer
        "
              >
                ×
              </button>

              {/* Image */}
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
          shadow-[0_0_60px_rgba(32,178,166,0.2)]
          mx-auto
        "
              />

              {/* Name */}
              <p className="mt-4 text-center text-sm font-medium text-white/80">
                {selectedAvatar.name}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Participants;