import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/darkthemeCodingBackgroundimg.jpg'
import GridAnimation from '../components/GridAnimation';
import {
  CalendarDays,
  Users,
  BookOpen,
  Target,
  Handshake,
  Rocket,
  Zap,
  ChevronDown,
} from "lucide-react";
import { UsersRound, Sparkles, Plus } from "lucide-react";
import { TypeAnimation } from 'react-type-animation';
import { blockquote, code } from 'framer-motion/client';


function Home() {
  const communityHighlights = [
    {
      icon: Target,
      label: "Student Driven",
    },
    {
      icon: Handshake,
      label: "Collaborative",
    },
    {
      icon: Rocket,
      label: "Growth Focused",
    },
    {
      icon: Zap,
      label: "Impact Oriented",
    },
  ];

  const Navigate = useNavigate();

  return (
    <>
      <div className="hidden md:block">
        <GridAnimation />
      </div>

      {/* backgroundImage*/}
      <div
        className="fixed inset-0 bg-cover bg-center z-0 bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('${bgImage}')` }}
      ></div>

      {/*overlay layer*/}
      <div className='fixed inset-0 bg-linear-to-r from-black/55 via-black/80 to-primary/8'></div>



      {/*Animation layer*/}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <div className="absolute top-[8%] left-[22%] w-2 h-2 bg-primary rounded-full opacity-15 animate-[float_7s_ease-in-out_infinite]"></div>

        <div className="absolute top-[12%] left-[68%] w-1.5 h-1.5 bg-highlight rounded-full opacity-20 animate-[float_9s_ease-in-out_infinite]"></div>

        <div className="absolute top-[18%] left-[45%] w-2 h-2 bg-primary rounded-full opacity-10 animate-[float_8s_ease-in-out_infinite]"></div>

        <div className="absolute top-[26%] left-[82%] w-1.5 h-1.5 bg-highlight rounded-full opacity-15 animate-[float_6s_ease-in-out_infinite]"></div>

        <div className="absolute top-[32%] left-[15%] w-2 h-2 bg-primary rounded-full opacity-20 animate-[float_10s_ease-in-out_infinite]"></div>



        <div className="absolute top-[76%] left-[86%] w-1.5 h-1.5 bg-highlight rounded-full opacity-15 animate-[float_8s_ease-in-out_infinite]"></div>

        <div className="absolute top-[82%] left-[25%] w-2 h-2 bg-primary rounded-full opacity-10 animate-[float_9s_ease-in-out_infinite]"></div>

        <div className="absolute top-[87%] left-[52%] w-1.5 h-1.5 bg-highlight rounded-full opacity-20 animate-[float_6s_ease-in-out_infinite]"></div>

        <div className="absolute top-[92%] left-[72%] w-2 h-2 bg-primary rounded-full opacity-15 animate-[float_8s_ease-in-out_infinite]"></div>

        <div className="absolute top-[96%] left-[38%] w-1.5 h-1.5 bg-highlight rounded-full opacity-10 animate-[float_10s_ease-in-out_infinite]"></div>

      </div>

      {/*main content*/}
      <section className='relative min-h-screen overflow-hidden'>
        <div className='relative z-10 flex flex-col justify-center items-center min-h-screen text-center px-4 sm:px-6 gap-4 animate-[fadeIn_1s_ease-in-out]'>

          <h1
            className='text-4xl  md:text-6xl font-bold
            max-w-3xl mx-auto '
          >Your <span className='bg-linear-to-r from-primary to-highlight text-transparent bg-clip-text'>CODING</span><br /> Journey Starts Here</h1>

          <h2 className='mt-6 text-lg  md:text-xl text-primary max-w-xl'>
            <TypeAnimation
              sequence={[
                "Join a community of developers, explore events, and grow your skills at IET.",
              ]}
              speed={50}
              cursor={true}
              className="font-mono text-lg text-[#20B2AA]"
            />
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 w-full sm:w-auto ">
            <button
              className="w-70 sm:w-auto hover:scale-105 border cursor-pointer px-6 py-3 rounded-full shadow-lg shadow-primary/30 transition-all duration-300 text-white bg-primary border-primary hover:bg-primary2 mx-auto"
              onClick={() => Navigate('/events')}
            >
              Explore Events
            </button>

            <a href="https://chat.whatsapp.com/BOBvRMpmMfX6592BVVoQvA">
              <div className="relative inline-flex rounded-full p-0.5 overflow-hidden group">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,#22d3ee,#14b8a6,#f59e0b,#22d3ee)] opacity-0 group-hover:opacity-100 spin-slow transition-opacity duration-300" />

                <button className="relative z-10 rounded-full bg-[#0b0f14] active:bg-primary px-6 py-3 text-white border border-primary/20 w-70 sm:w-auto cursor-pointer">
                  Join Community
                </button>
              </div>
            </a>
          </div>
        </div>
        <button
          onClick={() =>
            document.getElementById("about-community")?.scrollIntoView({
              behavior: "smooth",
            })
          }
          className="hidden md:flex absolute bottom-12 left-1/2 z-20 -translate-x-1/2 flex-col items-center gap-1 text-muted-foreground cursor-pointer hover:text-white transition-colors group"
        >
          <span className="text-sm transition-all duration-300 ease-in-out group-hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] group-hover:bg-primary/10">Scroll to Explore</span>
          <ChevronDown className="h-8 w-8 text-primary animate-bounce drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
        </button>
      </section>

      {/*About community*/}
      <section id="about-community" className='relative min-h-screen overflow-hidden'>
        <div className="animate-[fadeIn_1s_ease-in-out] container mx-auto px-6 text-center z-10 md:py-23">

          <h2 className="animate-[fadeIn_1s_ease-in-out] text-5xl font-bold mb-4">
            Why <span className="text-primary">Join</span>  Our <span className="text-primary">Community?</span>

          </h2>
          <p className="animate-[fadeIn_1s_ease-in-out] text-xl text-foreground mb-12">
            Learn, collaborate, and grow with a community of passionate students and developers.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pb-24">
            {/* Card 1 */}
            <div className="animate-[fadeIn_0.8s_ease-in-out] p-6 rounded-xl bg-primary/10 backdrop-blur-xs border border-white/10 hover:-translate-y-3 hover:scale-[1.02]
                transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] z-10"
            >

              <div className='flex justify-center'>
                <CalendarDays className="w-8 h-8 mb-4 text-primary " />

              </div>

              <h3 className="text-xl font-semibold mb-2">Events</h3>

              <p className="text-muted-foreground">
                Participate in coding contests, hackathons, workshops, and community activities.
              </p>

            </div>

            {/* Card 2 */}
            <div className="z-10 animate-[fadeIn_0.8s_ease-in-out] p-6 rounded-xl bg-primary/10 backdrop-blur-xs border border-white/10 hover:-translate-y-3 hover:scale-[1.02]
                transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)]">

              <div className='flex justify-center'>
                <Users className="w-8 h-8 mb-4 text-primary " />

              </div>

              <h3 className="text-xl font-semibold mb-2">Community</h3>

              <p className="text-muted-foreground">
                Connect with peers, seniors, and mentors who share your passion for technology.
              </p>

            </div>

            {/* Card 3 */}

            <div className="animate-[fadeIn_0.8s_ease-in-out] p-6 rounded-xl bg-primary/10 backdrop-blur-xs border border-white/10 hover:-translate-y-3 hover:scale-[1.02]
                transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] z-10">

              <div className='flex justify-center'>

                <BookOpen className="w-8 h-8 mb-4 text-primary " />
              </div>

              <h3 className="text-xl font-semibold mb-2">Learning</h3>
              <p className="text-muted-foreground">
                Access curated resources, roadmaps, and opportunities to accelerate your growth.
              </p>

            </div>

            {/* Community Description Card */}
            <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-primary/10 backdrop-blur-xs p-6 animate-[fadeIn_0.8s_ease-in-out] hover:-translate-y-3 hover:scale-[1.02] transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] z-10 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-0 mb-4">
              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-2 border-dashed border-primary/60 bg-primary/5">
                <UsersRound className="h-18 w-18 text-primary drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]" />

                <Sparkles className="absolute -top-3 left-4 h-4 w-4 text-primary" />
                <Sparkles className="absolute right-4 top-5 h-4 w-4 text-primary" />
                <Plus className="absolute -left-2 top-2 h-4 w-4 text-primary" />
                <Plus className="absolute -right-2 bottom-4 h-4 w-4 text-primary" />
                <Plus className="absolute left-2 bottom-2 h-4 w-4 text-primary" />
              </div>
              <div className='w-full md:w-200 flex flex-col text-start mx-12 '>
                <h3 className="text-2xl font-bold text-white mb-3">
                  About IET Students Community
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  IET Students Community is a student-driven platform built to help learners grow through resources, events, collaboration, and continuous improvement. We aim to create an active environment where students can learn, connect, and build together.
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {communityHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                      >
                        <Icon className="h-5 w-5 text-primary shrink-0" />
                        <span className="text-white/85 text-sm md:text-base">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* Rmlau logo */}
      <div className="hidden md:block">
        <a href="https://www.rmlau.ac.in/">
          <img src="/images/rmlauLogo.png" alt="Rmalau Logo" className="
        relative
        md:fixed
        shadow-lg shadow-primary
        bottom-18 bg-transparent right-8 h-15 w-15 rounded-2xl hover:scale-110 transition-all duration-300 z-50
        " style={{
              boxShadow: "3px 3px 10px #20b2a6"
            }} />
        </a>
      </div>
    </>
  )
}

export default Home;