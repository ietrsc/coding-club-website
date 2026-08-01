import React from 'react'
import { Calendar, Users, BookOpen } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { events } from '../data/event';
import GridAnimation from '../components/GridAnimation';

function Events() {
  const navigate = useNavigate();
  return (
    <div className='bg-linear-to-b from-background/90 via-black/60 to-background/90'>

      <div className="hidden md:block">
        <GridAnimation />
      </div>
      {/* backgroundImage*/}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('images/backgroundImg.png')` }}
      ></div>

      {/*overlay layer*/}
      <div className='fixed inset-0 bg-linear-to-b from-black/70 to-black/80 '></div>
      <div className='relative z-10'>
        <section className="events-sec py-35 pb-24">
          <div className="container mx-auto px-6">

            <div className="text-center mb-12">
              <h2 className="animate-[fadeIn_1s_ease-in-out] text-5xl font-bold">
                Upcoming <span className="text-primary">Events</span>
              </h2>
              <p className="animate-[fadeIn_1s_ease-in-out] text-muted-foreground mt-6 text-2xl">
                Join exciting events and level up your skills
              </p>
            </div>
            <div className={`
          grid mx-auto gap-8 animate-[fadeIn_1s_ease-in-out] justify-center
           ${events.length === 1 ? "grid-cols-1 max-w-68" :
                events.length === 2 ? "grid-cols-1 sm:grid-cols-2 max-w-68 sm:max-w-145" :
                  "gird-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-68 sm:max-w-145 md:max-w-220"} }`
            }>
              {/* Event Card */}
              {events.map((event) => (

                <div key={event.id} className="relative group rounded-2xl
              shadow-[0_0_30px_rgba(32,178,166,0.2)] sm:shadow-none overflow-hidden border border-primary/40 sm:border-white/10 hover:border-primary/40 h-96 hover:transform-3d duration-300  hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] cursor-pointer z-10 flex items-center justify-center bg-primary/10 backdrop-blur-md sm:backdrop-blur-xs active:scale-105 hover:-translate-y-2">

                  {/* Background Image */}
                  <img
                    src="/images/cardBg.png"
                    alt="bg"
                    className="absolute inset-0 w-full h-full object-contain opacity-40 group-hover:opacity-60 transition duration-300 "
                  />

                  <div
                    className="group p-6 ml-6 rounded-xl z-10 w-full max-w-sm h-auto"
                  >
                    <div className='h-40 w-48 border-4  border-primary rounded-2xl overflow-hidden'>
                      <img src={event.thumbnail} alt="event image" className='h-40 w-50 object-cover group-hover:scale-3d transition-transform duration-300 rounded-xl group-hover:scale-115 ' />
                    </div>


                    <h3 className="text-white text-center mt-3 text-sm font-semibold ">
                      {event.title}
                    </h3>

                    <div className="flex mt-2 justify-center">
                      <span className="flex justify-center items-center text-xs px-3 rounded-full bg-purple-500/20 text-purple-400">
                        {event.type}
                      </span>&nbsp;
                      <div className={`${event.status === "live" ? "" : "hidden"}`}>
                        <span className="text-xs px-3 py-0.75 rounded-full bg-green-500/20 text-green-400">
                          <span className="relative inline-flex size-3">
                            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                          </span>
                          <span className='ml-0.5'>
                            {event.status}
                          </span>
                        </span>
                      </div>
                      <div className={`${event.status === "expired" ? "" : "hidden"}`}>
                        <span className="text-xs px-2 py-0.75 rounded-full bg-gray-500/45 text-gray-400">
                          <span className='ml-0.5'>
                            {event.status}
                          </span>
                        </span>
                      </div>
                      <div className={`${event.status === "upcoming" ? "" : "hidden"}`}>
                        <span className="text-xs px-3 py-0.75 rounded-full bg-yellow-500/20 text-yellow-400">
                          <span className="relative inline-flex size-3">
                            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex size-2 rounded-full bg-yellow-500"></span>
                          </span>
                          <span className='ml-0.5'>
                            {event.status}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className='flex flex-col mt-2 justify-center items-center gap-2'>
                      <button onClick={() => navigate(`/events/${event.slug}`)} className=" text-white transition-all duration-50 sm:duration-100 cursor-pointer z-20 border border-primary bg-black/35 hover:bg-primary active:bg-primary rounded-2xl w-full h-8" >
                        Details
                      </button>


                    </div>
                  </div>
                </div>

              ))}
            </div>



          </div>

        </section>
      </div>
    </div>
  )
}

export default Events
