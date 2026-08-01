import { useNavigate, useParams } from "react-router-dom";
import { events } from "../data/event";
import GridAnimation from "../components/GridAnimation";
import { Download } from "lucide-react";

function WebsprintResults() {
  const event = events.find((e) => e.slug === "websprint-2025");
  if (!event) {
    return <div className="pt-24 text-center">Event not found</div>;
  }
  return (
    <div >

      <div className="hidden md:block">
        <GridAnimation />
      </div>


      {/* backgroundImage*/}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('../images/backgroundImg.png')` }}
      ></div>

      {/*overlay layer*/}
      <div className='fixed inset-0 bg-linear-to-b from-black/70 to-black/80 '></div>

      <section className='relative min-h-screen overflow-hidden py-30 z-3 animate-[fadeIn_1s_ease-in-out] flex flex-col items-center gap-5'>

        {/* hero section */}

        <div className='flex flex-col items-center gap-2'>
          <h1
            className='text-4xl  md:text-6xl font-bold
            max-w-3xl z-3 '
          ><span className='bg-linear-to-r from-primary to-highlight text-transparent bg-clip-text'>{event.title}</span></h1>
          <h2 className='mx-3 max-w-xs sm:max-w-2xl text-muted-foreground'>{event.shortDescription}</h2>
          <p className='mx-3 max-w-xs sm:max-w-2xl text-muted-foreground'>
            {event.date} || {event.time} || {event.venue}
          </p>

        </div>


        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto ">
          <div className="animate-[fadeIn_0.8s_ease-in-out] p-6 rounded-xl bg-primary/10 backdrop-blur-xs border border-white/10 hover:-translate-y-3 hover:scale-[1.02]
transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] z-10 h-30 sm:h-20 w-80 sm:w-50 flex justify-center items-center flex-col">

            <h3 className="text-xl font-semibold mb-2">{event.participants}+ </h3>
            <p className="text-muted-foreground">
              Participants
            </p>

          </div>
          <div className="animate-[fadeIn_0.8s_ease-in-out] p-6 rounded-xl bg-primary/10 backdrop-blur-xs border border-white/10 hover:-translate-y-3 hover:scale-[1.02]
transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] z-10 h-30 sm:h-20 w-80 sm:w-50 flex justify-center items-center flex-col">

            <h3 className="text-xl font-semibold mb-2">{event.teams} </h3>
            <p className="text-muted-foreground">
              Teams
            </p>

          </div>
          <div className="animate-[fadeIn_0.8s_ease-in-out] p-6 rounded-xl bg-primary/10 backdrop-blur-xs border border-white/10 hover:-translate-y-3 hover:scale-[1.02]
transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] z-10 h-30 sm:h-20 w-80 sm:w-50 flex justify-center items-center flex-col">

            <h3 className="text-xl font-semibold mb-2">{event.projectSubmited} </h3>
            <p className="text-muted-foreground">
              Project Submited
            </p>

          </div>
        </div>

        {/* winners section */}

        <section className="mt-15 px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Event <span className="text-primary">Winners</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Celebrating the top performers of WebSprint 2026
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-8">

            {/* Winner ps - 01 */}
            <div className="relative w-70 sm:w-100 h-100 sm:h-100 rounded-3xl border border-primary/30 bg-linear-to-b from-primary/15 via-white/5 to-white/5 backdrop-blur-md shadow-[0_0_35px_rgba(32,178,166,0.20)] transition-all duration-300 hover:-translate-y-2 md:scale-105">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-primary/10 via-transparent to-cyan-400/10 pointer-events-none"></div>

              <h3 className=" absolute top-4 left-25 sm:left-40 text-3xl font-bold text-primary">
                Ps: 01
              </h3>

              <div className="absolute top-4 right-4 text-3xl">
                🥇
              </div>

              <div className="relative mt-15 z-10 flex h-80 flex-col items-center justify-evenly px-6 text-center">

                  <img
                    src="/events/websprint/winners/ps1.jpeg"
                    alt="Winner"
                    className="h-40 sm:h-48 w-80 rounded object-cover"
                  />

                <h3 className="mt-6 text-3xl font-bold text-yellow-300">
                  Winner
                </h3>

                <p className="mt-1 text-base font-medium text-white">
                  {event.ps1Winner}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.ps1Members.m1},&nbsp;
                  {event.ps1Members.m2},&nbsp;
                  {event.ps1Members.m3},&nbsp;
                  {event.ps1Members.m4}
                </p>
              </div>

              <div className="absolute bottom-0 left-1/2 h-3 w-28 -translate-x-1/2 rounded-full bg-cyan-400/90 blur-xl"></div>
            </div>

            {/* Winner ps - 02*/}
            <div className="relative w-70 sm:w-100 h-100 sm:h-100 rounded-3xl border border-primary/30 bg-linear-to-b from-primary/15 via-white/5 to-white/5 backdrop-blur-md shadow-[0_0_35px_rgba(32,178,166,0.20)] transition-all duration-300 hover:-translate-y-2 md:scale-105">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-primary/10 via-transparent to-cyan-400/10 pointer-events-none"></div>

              <h3 className=" absolute top-4 left-25 sm:left-40 text-3xl font-bold text-primary">
                Ps: 02
              </h3>

              <div className="absolute top-4 right-4 text-3xl">
                🥇
              </div>

              <div className="relative mt-15 z-10 flex h-80 flex-col items-center justify-evenly px-6 text-center">

                  <img
                    src="/events/websprint/winners/ps2.jpeg"
                    alt="Winner"
                    className="h-40 sm:h-48 w-80 rounded object-cover"
                  />

                <h3 className="mt-6 text-3xl font-bold text-yellow-300">
                  Winner
                </h3>

                <p className="mt-1 text-base font-medium text-white">
                  {event.ps2Winner}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.ps2Members.m1},&nbsp;
                  {event.ps2Members.m2},&nbsp;
                  {event.ps2Members.m3},&nbsp;
                  {event.ps2Members.m4}
                </p>
              </div>

              <div className="absolute bottom-0 left-1/2 h-3 w-28 -translate-x-1/2 rounded-full bg-cyan-400/90 blur-xl"></div>
            </div>

            {/* Winner Ps - 03 */}
            <div className="relative w-70 sm:w-100 h-100 sm:h-100 rounded-3xl border border-primary/30 bg-linear-to-b from-primary/15 via-white/5 to-white/5 backdrop-blur-md shadow-[0_0_35px_rgba(32,178,166,0.20)] transition-all duration-300 hover:-translate-y-2 md:scale-105">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-primary/10 via-transparent to-cyan-400/10 pointer-events-none"></div>

              <h3 className=" absolute top-4 left-25 sm:left-40 text-3xl font-bold text-primary">
                Ps: 03
              </h3>

              <div className="absolute top-4 right-4 text-3xl">
                🥇
              </div>

              <div className="relative mt-15 z-10 flex h-80 flex-col items-center justify-evenly px-6 text-center">

                  <img
                    src="/events/websprint/winners/ps3.jpeg"
                    alt="Winner"
                    className="h-40 sm:h-48 w-80 rounded object-cover"
                  />

                <h3 className="mt-6 text-3xl font-bold text-yellow-300">
                  Winner
                </h3>

                <p className="mt-1 text-base font-medium text-white">
                  {event.ps3Winner}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {event.ps3Members.m1},&nbsp;
                  {event.ps3Members.m2},&nbsp;
                  {event.ps3Members.m3},&nbsp;
                  {event.ps3Members.m4}
                </p>
              </div>


              <div className="absolute bottom-0 left-1/2 h-3 w-28 -translate-x-1/2 rounded-full bg-cyan-400/90 blur-xl"></div>
            </div>


          </div>
           <div className="z-10 pt-10 text-center">
            <a href={event.gallery} target="_blank" className="text-xl transition-all duration-300 ease-in-out group-hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] group-hover:bg-primary/10 underline text-primary">View Event Gallery →</a>
          </div>

        </section>
      </section>

    </div>
  )
}

export default WebsprintResults;
