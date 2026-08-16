import { GraduationCap, Undo2 } from 'lucide-react'
import React, { useState } from 'react'
import GridAnimation from '../components/GridAnimation'
import { academicResources } from '../data/academicResources'
import { div, h1, sub } from 'framer-motion/client'
import { resources } from '../data/resources'
import { useNavigate } from 'react-router-dom'


function Academics() {
  const navigate = useNavigate();
  let [selectedDepartment, setSelectedDepartment] = useState(null);
  let [selectedYear, setSelectedYear] = useState(null);
  let [selectedSemester, setSelectedSemester] = useState(null);
  let [selectedBranch, setSelectedBranch] = useState(null);
  let [selectedSubject, setSelectedSubject] = useState(null);
  let [selectedPyqYear, setSelectedPyqYear] = useState(null);


  return (
    <div>
      {/* Grid Animation */}
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

      {/* Main Content */}
      <section className='relative min-h-screen overflow-hidden py-30 z-3 animate-[fadeIn_1s_ease-in-out]'>

        {/* hero section */}
        <div className='flex flex-col items-center '>
          <GraduationCap className="w-10 h-10 text-primary" />
          <h1
            className='text-4xl text-center  md:text-6xl font-bold
          max-w-3xl mx-15 z-3 text-gray-300'
          ><span className='bg-primary text-transparent bg-clip-text'>Academics</span> Resources</h1>
          <h2 className='text-sm  md:text-xl
            max-w-150 text-center mx-15 mt-5 text-muted-foreground z-3 '>
            Access semester-wise previous year question papers, organized by year, semester, and branch to make your exam preparation faster and more effective.
          </h2>
        </div>

        {/* Year Cards */}
        <div className="h-auto flex flex-col items-center justify-center gap-5">
          <div className={`flex flex-wrap
           justify-center items-center gap-5 mt-5 text-center max-w-[60vw]
            `}>
            {!selectedDepartment && academicResources.map(
              (department) => {
                return (
                  <div
                    key={department.id}
                    onClick={() =>
                      setSelectedDepartment(department)
                }
                    className="
      relative
      z-10
      group
      h-52
      min-w-82
      rounded-2xl
      border border-primary/20
      bg-white/5
      backdrop-blur-md
      px-6
      py-8
      flex flex-col
      items-center
      justify-center
      text-center
      cursor-pointer
      overflow-hidden
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-primary/40
      hover:bg-primary/10
      hover:shadow-[0_0_30px_rgba(32,178,166,0.2)]
    "
                  >
                    {/* Glow */}
                    <div
                      className="
        absolute
        inset-0
        bg-linear-to-br
        from-primary/10
        via-transparent
        to-transparent
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-300
      "
                    />

                    <div className="relative z-10 flex flex-col items-center">
                      <h2
                        className="
          text-3xl
          sm:text-4xl
          font-bold
          text-primary
          transition-all
          duration-300
          group-hover:scale-105
        "
                      >
                        {department.title}
                      </h2>

                      <div
                        className="
          mt-5
          px-4
          py-1.5
          rounded-full
          border border-primary/20
          bg-primary/5
          text-xs
          text-primary
          transition-all
          duration-300
          group-hover:bg-primary/10
          group-hover:border-primary/40
        "
                      >
                        Explore Resources
                      </div>

                    </div>

                  </div>
                )
              }
            )}
            {!selectedYear && selectedDepartment && selectedDepartment.department.map(
              (year) => {
                return (
                  <div
                    key={year.id}
                    onClick={() => {
                      setSelectedYear(year)
                    }}
                    className="
      relative
      z-10
      group
      h-52
      min-w-82
      rounded-2xl
      border border-primary/20
      bg-white/5
      backdrop-blur-md
      px-6
      py-8
      flex flex-col
      items-center
      justify-center
      text-center
      cursor-pointer
      overflow-hidden
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-primary/40
      hover:bg-primary/10
      hover:shadow-[0_0_30px_rgba(32,178,166,0.2)]
    "
                  >
                    {/* Glow */}
                    <div
                      className="
        absolute
        inset-0
        bg-linear-to-br
        from-primary/10
        via-transparent
        to-transparent
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-300
      "
                    />

                    <div className="relative z-10 flex flex-col items-center">
                      <h2
                        className="
          text-3xl
          sm:text-4xl
          font-bold
          text-primary
          transition-all
          duration-300
          group-hover:scale-105
        "
                      >
                        {year.title}
                      </h2>

                      <p className="mt-3 text-sm sm:text-base text-white/60">
                        {year.semesters}
                      </p>

                      <div
                        className="
          mt-5
          px-4
          py-1.5
          rounded-full
          border border-primary/20
          bg-primary/5
          text-xs
          text-primary
          transition-all
          duration-300
          group-hover:bg-primary/10
          group-hover:border-primary/40
        "
                      >
                        Explore Resources
                      </div>

                    </div>

                  </div>
                )
              }
            )}
            {!selectedSemester && selectedYear && selectedYear.semester.map(
              (semester) => {
                return (
                  <div
                    key={semester.id}
                    onClick={() => (setSelectedSemester(semester))}
                    className="
      relative
      z-10
      group
      h-52
      min-w-82
      rounded-2xl
      border border-primary/20
      bg-white/5
      backdrop-blur-md
      px-6
      py-8
      flex flex-col
      items-center
      justify-center
      text-center
      cursor-pointer
      overflow-hidden
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-primary/40
      hover:bg-primary/10
      hover:shadow-[0_0_30px_rgba(32,178,166,0.2)]
    "
                  >
                    {/* Glow */}
                    <div
                      className="
        absolute
        inset-0
        bg-linear-to-br
        from-primary/10
        via-transparent
        to-transparent
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-300
      "
                    />

                    <div className="relative z-10 flex flex-col items-center">
                      <h2
                        className="
          text-3xl
          sm:text-4xl
          font-bold
          text-primary
          transition-all
          duration-300
          group-hover:scale-105
        "
                      >
                        {semester.title}
                      </h2>

                      <div
                        className="
          mt-5
          px-4
          py-1.5
          rounded-full
          border border-primary/20
          bg-primary/5
          text-xs
          text-primary
          transition-all
          duration-300
          group-hover:bg-primary/10
          group-hover:border-primary/40
        "
                      >
                        Explore Resources
                      </div>
                    </div>
                  </div>
                )
              }
            )}


            {!selectedBranch&& selectedSemester && selectedSemester.branch.map(
              (branch) => {
                return (
                  <div
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch)}
                    className="
      relative
      z-10
      group
      h-52
      min-w-82
      max-w-82
      rounded-2xl
      border border-primary/20
      bg-white/5
      backdrop-blur-md
      px-6
      py-8
      flex flex-col
      items-center
      justify-center
      text-center
      cursor-pointer
      overflow-hidden
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-primary/40
      hover:bg-primary/10
      hover:shadow-[0_0_30px_rgba(32,178,166,0.2)]
    "
                  >
                    {/* Glow */}
                    <div
                      className="
        absolute
        inset-0
        bg-linear-to-br
        from-primary/10
        via-transparent
        to-transparent
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-300
      "
                    />

                    <div className="relative z-10 flex flex-col items-center">
                      <h2
                        className="
          text-3xl
          sm:text-4xl
          font-bold
          text-primary
          transition-all
          duration-300
          group-hover:scale-105
        "
                      >
                        {branch.title}
                      </h2>

                      <div
                        className="
          mt-5
          px-4
          py-1.5
          rounded-full
          border border-primary/20
          bg-primary/5
          text-xs
          text-primary
          transition-all
          duration-300
          group-hover:bg-primary/10
          group-hover:border-primary/40
        "
                      >
                        Explore Resources
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            {!selectedSubject
             && selectedBranch && selectedBranch.subject.map(
              (subject) => {
                return (
                  <div
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject)}
                    className="
      relative
      z-10
      group
      h-52
      min-w-82
      max-w-82
      rounded-2xl
      border border-primary/20
      bg-white/5
      backdrop-blur-md
      px-6
      py-8
      flex flex-col
      items-center
      justify-center
      text-center
      cursor-pointer
      overflow-hidden
      transition-all
      duration-300
      hover:-translate-y-2
      hover:border-primary/40
      hover:bg-primary/10
      hover:shadow-[0_0_30px_rgba(32,178,166,0.2)]
    "
                  >
                    {/* Glow */}
                    <div
                      className="
        absolute
        inset-0
        bg-linear-to-br
        from-primary/10
        via-transparent
        to-transparent
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-300
      "
                    />

                    <div className="relative z-10 flex flex-col items-center">
                      <h2
                        className="
          text-2xl
          sm:text-3xl
          font-bold
          text-primary
          transition-all
          duration-300
          group-hover:scale-105
        "
                      >
                        {subject.title}
                      </h2>

                      <div
                        className="
          mt-5
          px-4
          py-1.5
          rounded-full
          border border-primary/20
          bg-primary/5
          text-xs
          text-primary
          transition-all
          duration-300
          group-hover:bg-primary/10
          group-hover:border-primary/40
        "
                      >
                        Explore Resources
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {
            !selectedDepartment &&
            <div
              onClick={() => navigate("/resources")}
              className='h-8 flex justify-center items-center rounded-2xl bg-white/5 border border-primary/20 text-sm text-primary cursor-pointer hover:-translate-y-2
      hover:border-primary/40
      hover:bg-primary/10
      hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] transition-all duration-100 px-2 mt-10'>
              Back to previous page
              <Undo2 />
            </div>
          }
          {
            !selectedYear && selectedDepartment &&
            <div
              onClick={() => setSelectedDepartment(null)}
              className='h-8 flex justify-center items-center rounded-2xl bg-white/5 border border-primary/20 text-sm text-primary cursor-pointer hover:-translate-y-2
      hover:border-primary/40
      hover:bg-primary/10
      hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] transition-all duration-100 px-2 mt-10'>
              Back to previous page
              <Undo2 />
            </div>
          }
          {
            !selectedSemester &&
            selectedYear &&
            <div
              onClick={() => setSelectedYear(null)}
              className='h-8 flex justify-center items-center rounded-2xl bg-white/5 border border-primary/20 text-sm text-primary cursor-pointer hover:-translate-y-2
      hover:border-primary/40
      hover:bg-primary/10
      hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] transition-all duration-100 px-2 mt-10'>
              Back to previous page
              <Undo2 />
            </div>
          }
          {
            !selectedBranch &&
            selectedSemester &&
            <div
              onClick={() => setSelectedSemester(null)}
              className='h-8 flex justify-center items-center rounded-2xl bg-white/5 border border-primary/20 text-sm text-primary cursor-pointer hover:-translate-y-2
      hover:border-primary/40
      hover:bg-primary/10
      hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] transition-all duration-100 px-2 mt-10'>
              Back to previous page
              <Undo2 />
            </div>
          }

        </div>

      </section>
    </div>
  )
}

export default Academics;
