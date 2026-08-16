import React from 'react'
import GridAnimation from '../components/GridAnimation'
import { Brain, Code2, GraduationCap, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

function Resources() {
  const navigate = useNavigate();

  return (
    <div >
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

      <section className='relative min-h-screen overflow-hidden py-30 z-3 animate-[fadeIn_1s_ease-in-out]'>

        {/* hero section */}
        <div className='flex flex-col items-center '>
          <h1
            className='text-4xl text-center  md:text-6xl font-bold
          max-w-3xl mx-15 z-3 text-gray-300'
          >Learning <span className='bg-primary text-transparent bg-clip-text'>Resources</span></h1>
          <h2 className='text-sm  md:text-xl
            max-w-150 text-center mx-15 mt-5 text-muted-foreground z-3 '>
            Curated notes, PYQs, roadmaps, and learning resources to help students grow in tech.
          </h2>
        </div>


        {/* Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-8 sm:mx-auto mt-10'>
          <a onClick={() => navigate('/dsa')} className='cursor-pointer group'>
            <div className="z-10 animate-[fadeIn_0.8s_ease-in-out] p-6 rounded-xl bg-primary/10 backdrop-blur-xs border border-white/10 hover:-translate-y-3 hover:scale-[1.02]
transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] flex flex-col gap-2">

              <Brain className="w-12 h-12 text-primary" />
              <h2 className="text-2xl font-bold text-primary">Data Structures
                & Algorithms</h2>

              <p className="text-muted-foreground">
                Master problem solving, coding patterns,
                interview preparation, and CP.
              </p>
              <ul>
                <li>✓ DSA Sheets</li>
                <li>✓ Roadmaps</li>
                <li>✓ Interview Prep</li>
                <li>✓ Competitive Programming</li>
              </ul>
              <button className='underline sm:no-underline group-hover:underline text-primary group-hover:translate-x-1 transition-all duration-300 text-xl font-semibold cursor-pointer text-start'>
                Explore DSA →
              </button>

            </div>
          </a>

          <a  className='cursor-pointer group'>
          <div className="z-10 animate-[fadeIn_0.8s_ease-in-out] p-6 rounded-xl bg-primary/10 backdrop-blur-xs border border-white/10 hover:-translate-y-3 hover:scale-[1.02]
transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] flex flex-col gap-2">
            <Code2 className="w-12 h-12 text-primary" />
            <h2 className="text-2xl font-bold text-primary">Development</h2>

            <p className="text-muted-foreground">
              Build modern web applications, master frontend and backend technologies, and learn through real-world projects.
            </p>
            <ul>
              <li>✓ Frontend Development</li>
              <li>✓ Backend Development</li>
              <li>✓ Full-Stack Projects</li>
              <li>✓ Deployment & Tools</li>
            </ul>
            <button className='underline sm:no-underline group-hover:underline text-primary group-hover:translate-x-1 transition-all duration-300 text-xl font-semibold cursor-pointer text-start'>Explore Development →</button>

          </div>
          </a>

          <a className='cursor-pointer group' onClick={
            () => navigate('/academics')
          }>
          <div className="z-10 animate-[fadeIn_0.8s_ease-in-out] p-6 rounded-xl bg-primary/10 backdrop-blur-xs border border-white/10 hover:-translate-y-3 hover:scale-[1.02]
transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] flex flex-col gap-2">
            <GraduationCap className="w-12 h-12 text-primary" />
            <h2 className="text-2xl font-bold text-primary">Academics</h2>

            <p className="text-muted-foreground">
              Access semester notes, PYQs,
              lab manuals, and study materials
              designed to help you excel in academics.

            </p>
            <ul>
              <li>✓ Semester Notes</li>
              <li>✓ Previous Year Questions</li>
              <li>✓ Exam Preparation</li>
              <li>✓ Sessionals</li>
            </ul>
            <button className='underline sm:no-underline group-hover:underline text-primary group-hover:translate-x-1 transition-all duration-300 font-semibold text-xl cursor-pointer text-start'>Explore Academics →</button>

          </div>
          </a>

        </div>

      </section>

    </div>
  )
}

export default Resources
