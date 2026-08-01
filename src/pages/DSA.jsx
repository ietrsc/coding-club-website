import { Brain, Search, Target, Trophy } from 'lucide-react'
import React, { useState } from 'react'
import GridAnimation from '../components/GridAnimation'
import { resources } from '../data/resources'

function DSA() {
  const featuredResources = resources.filter(
    (resource) => resource.featured
  );
  const [filter, setFilter] = useState('All');
  const filteredFeaturedResources = resources.filter(
    (resource) => (resource.category && resource.featured)
  );
  console.log(filteredFeaturedResources);

  const categories = [
    "All",
    "Sheets",
    "Roadmaps",
    "Platforms",
    "Interview Prep",
    "CP",
    "Books",
  ];
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
          <Brain className="w-10 h-10 text-primary" />
          <h1
            className='text-4xl text-center  md:text-6xl font-bold
          max-w-3xl mx-15 z-3 text-gray-300'
          ><span className='bg-primary text-transparent bg-clip-text'>DSA</span> Resources</h1>
          <h2 className='text-sm  md:text-xl
            max-w-3xl text-center mx-15 mt-2 text-muted-foreground z-3 '>
            Master Data Structures & Algorithms through curated sheets, roadmaps, coding platforms, and interview preparation resources.
          </h2>
        </div>

        {/* searchbar */}
        <div className='flex justify-center mt-5'>
          <div className='z-5 h-12 transition-all duration-300 animate-[fadeIn_1s_ease-in-out] w-100  flex items-center justify-center'>
            <input id='search' type="text" placeholder='Search resources...' className='px-5 border border-primary rounded-s-xl h-8 w-50 sm:w-100 outline-none ' />
            <button className='rounded-r-xl bg-primary text-sm flex justify-center items-center w-15 h-8 mr-2 cursor-pointer '>
              <Search className='hover:scale-110' />
            </button>
          </div>

        </div>

        {/* category pills */}
        <div className="flex mx-8 sm:mx-auto justify-center ">

          <div className="flex gap-3 py-3 max-w-sm sm:max-w-4xl flex-wrap px-4  justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`
              px-4 py-2
        rounded-full
        cursor-pointer
        hover:bg-primary hover:text-black
        border
        ${category == filter ? "bg-primary text-black border-primary" : "bg-white/5 border-primary text-primary"}
        transition-all
      `} onClick={() => (setFilter(category))}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Resources */}

        <div className='text-center sm:text-start mt-5 mx-5 sm:mx-35'>
          {/* <h2 className='text-2xl uppercase tracking-[0.2em] font-semibold'>
            POPULAR <span className="text-primary">Resources</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Start your DSA journey with the most trusted and widely used learning resources.
          </p> */}

          {/* Cards */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-8 sm:mx-auto mt-10'>

            {featuredResources.map((resource) => {
              const Icon = resource.icon;
              return (

                <div key={resource.title} className="z-10 animate-[fadeIn_0.8s_ease-in-out] p-6 rounded-xl bg-primary/10 backdrop-blur-xs border border-white/10 hover:-translate-y-3 hover:scale-[1.02]
            transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(32,178,166,0.2)] flex flex-col gap-2 items-center justify-center text-center">
                  <Icon className="w-12 h-12  text-primary" />
                  <h2 className="text-2xl font-bold text-white">{resource.title}</h2>
                  <div>
                    <span className="flex justify-center items-center text-xs px-3 py-1 rounded-full bg-primary/20 text-primary">
                      {resource.category}
                    </span>
                  </div>

                  <p className="text-muted-foreground">
                    {resource.description}
                  </p>
                  <a href={resource.link} target='_blank' className='transition-all duration-0 sm:duration-300 text-sm font-semibold cursor-pointer border border-primary rounded-2xl w-25 h-8 flex justify-center items-center mt-2 active:bg-primary bg-black/25 hover:bg-primary text-white '>Explore →</a>

                </div>
              );
            })}
          </div>
        </div>

        {/* All Resources */}
        <div className="mt-10 mx-5 sm:mx-35">
          <h2 className='text-2xl text-center uppercase tracking-[0.2em] font-semibold'>
            All <span className="text-primary">Resources</span>
          </h2>

          <p className="text-muted-foreground text-center mt-2">
            Browse all available DSA learning resources.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {
              resources.map((resource) => {
                const Icon = resource.icon;

                return (
                  <a
                    key={resource.title}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
          group
          rounded-2xl
          border border-primary/20
          hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]
          bg-white/5
          backdrop-blur-md
          p-5
          hover:border-primary/40
          hover:-translate-y-1
          transition-all duration-300
        "
                  >
                    <Icon className="w-8 h-8 text-primary mb-4" />

                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {resource.category}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg mb-2">
                      {resource.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>

                    <span className="text-primary text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                      Open Resource →
                    </span>
                  </a>
                );
              })
}
          </div>
        </div>

      </section>
    </div>
  )
}

export default DSA;
