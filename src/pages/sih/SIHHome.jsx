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
          <h1
            className='text-4xl  md:text-6xl font-bold
                  max-w-3xl z-3 '
          ><span className='bg-linear-to-r from-primary to-highlight text-transparent bg-clip-text'>{event.title}</span></h1>
          <h2 className='mx-3 max-w-xs sm:max-w-2xl text-muted-foreground'>{event.shortDescription}</h2>

        </div>


        {/* content section */}
        <div className='flex justify-center items-center gap-5 pt-14 animate-[fadeIn_1s_ease-in-out]'>
          {/* <div className="z-10 animate-[fadeIn_0.8s_ease-in-out] p-6 rounded-xl bg-primary/10 backdrop-blur-xs border border-white/10 hover:-translate-y-1 hover:scale-[1.02]
                transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)]">
                <h3 className="text-xl font-semibold mb-2 text-primary">Register Your Team</h3>
                <p className="text-muted-foreground">
                Already have a team? Submit your team's details and get ready for the internal hackathon.
                </p>
                <p className='text-muted-foreground'>NOTE: Incomplete teams can also register. Your team will be eligible to participate once the required team size is completed. Other students can send requests to join your team. </p>
                <div className='flex justify-end items-center mt-3'>
                  <button className='bg-primary rounded-xl px-5 py-2.5 cursor-pointer  hover:bg-primary2 hover:scale-105 active:scale-95 duration-300'>
                    Register Your Team →
                  </button>
                  </div>
              </div> */}
          <div
            className="
            max-w-3/4
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
            <div className="mt-6 flex justify-end">
              <Link
              to="/sih/teams"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-primary bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
            >
              Explore Teams
            </Link>
            </div>
          </div>

          <div
            className="
            max-w-3/4
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
              Register as an Individual
            </h3>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/70">
              Don't have a team yet? Register individually and connect with other
              students looking for teammates.
            </p>

            {/* Important Note */}
            <div className="mt-5 rounded-xl border border-primary/15 bg-primary/5 p-4">
              <p className="text-xs sm:text-sm leading-relaxed text-white/55">
                <span className="font-semibold text-primary">
                  What happens next:
                </span>{" "}
                Once you register, your profile will be listed immediately so teams can find you based on your skills, interests, and preferred role. You can also browse existing teams and send requests to join teams you're interested in, subject to the team leader's approval.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6 flex justify-end">
              <Link
              to="/sih/signup"
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-primary bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
            >
                Register as a participant
            </Link>
            </div>
          </div>

        </div>

      </section>
    </div>
  )
}

export default SIHHome