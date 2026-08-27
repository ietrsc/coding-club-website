import React from 'react'
import { Link } from 'react-router-dom';
import GridAnimation from '../../components/GridAnimation'
import { events } from '../../data/event';
import { useParams } from 'react-router-dom';
import { UserRound, UsersRound } from 'lucide-react';
import { useSihAuth } from "../../context/SihAuthContext";
import { useNavigate } from "react-router-dom";

function SIHHome() {
  const { slug } = useParams();
  const event = events.find((e) => e.slug === "sih-2026");
  return (
    <div className="relative min-h-screen overflow-hidden pb-10 ">
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

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6">

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
            <img
              src="../images/pragyanLogo.jpeg"
              alt="Pragyan's Logo"
              className="h-50 w-50 rounded-xl object-cover"
            />
          </div>
          <h1
            className='text-4xl  md:text-5xl font-bold
                 z-3 text-center'
          ><span className='bg-linear-to-r from-primary to-highlight text-transparent bg-clip-text'>PRAGYAN - The Coding Club of CSE</span></h1>
          <h2 className='mx-3 max-w-120 sm:max-w-2xl text-muted-foreground text-center'>Department of Computer Science | Dr. Rammanohar Lohia Avadh University.</h2>
          <a href='https:/cseiet.vercel.app' target='_blank' className='text-primary text-sm underline hover:scale-105 hover:text-blue-400 duration-200'>
            Go to the official website of CSE clubs →
          </a>
          <a href="https://chat.whatsapp.com/LIxHxt2agoaCn5qbgoDvrA" target='_blank' className='text-primary hover:scale-105 hover:text-blue-400 duration-200 text-sm underline'>
            Join CLUBS - Deptt of CSE →
          </a>

        </div>


        {/* content section */}
        <div className='flex flex-col md:flex-row justify-evenly items-center gap-5 pt-14 animate-[fadeIn_1s_ease-in-out] '>

          <div
            className="
            md:min-h-120
            md:max-w-1/2
    group
    relative
    z-10
    overflow-hidden
    rounded-2xl
    border border-primary/20
    bg-white/5
    backdrop-blur-md
    p-6 sm:p-8
    transition-all
    duration-300
    hover:-translate-y-2
    hover:border-primary/40
    hover:bg-primary/5
    hover:shadow-[0_0_30px_rgba(32,178,166,0.2)]
  "
          >
            {/* Top Accent */}
            <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-primary via-highlight to-primary opacity-70" />

            {/* Icon */}
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
              <UsersRound className="h-7 w-7 text-primary" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-white">
              Create / Find a Team
            </h3>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/70">
              You can create your own team and become the team leader, or browse existing teams and send a request to join one.
            </p>

            {/* Important Note */}
            <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-4">
              <p className="text-xs sm:text-sm leading-relaxed text-white/55">
                <span className="font-semibold text-primary">
                  Important:
                </span>{" "}
                Incomplete teams can also register, but they will be eligible to
                participate only after reaching the required team size. Team leaders can
                invite individually registered students to join their team, while students
                can also browse teams and request to join one.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6">
              <Link
                to="/sih/teams"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-primary bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
              >
                Explore Teams →
              </Link>
            </div>
          </div>

          <div
            className="
            md:min-h-120
            md:max-w-1/2
    group
    relative
    z-10
    overflow-hidden
    rounded-2xl
    border border-primary/20
    bg-white/5
    backdrop-blur-md
    p-6 sm:p-8
    transition-all
    duration-300
    hover:-translate-y-2
    hover:border-primary/40
    hover:bg-primary/5
    hover:shadow-[0_0_30px_rgba(32,178,166,0.2)]
  "
          >
            {/* Top Accent */}
            <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-highlight via-primary to-highlight opacity-70" />

            {/* Icon */}
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
              <UserRound className="h-7 w-7 text-primary" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-white">
              Participants List
            </h3>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/70">
              Already have a team but need more members? Browse registered participants and find the right teammates for your team.
            </p>

            {/* Important Note */}
            <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-4">
              <p className="text-xs sm:text-sm leading-relaxed text-white/55">
                <span className="font-semibold text-primary">
                  Important:
                </span>{" "}
                Registered students will be listed as available participants, allowing team leaders to send invitation requests asking whether they would like to join their teams.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6 flex justify-end">
              <Link
                to="/sih/participants"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-primary bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
              >
                Explore Participants →
              </Link>
            </div>
          </div>

        </div>

      </section>
    </div>
  )
}

export default SIHHome