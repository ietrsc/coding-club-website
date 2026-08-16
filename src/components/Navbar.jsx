import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { motion } from "framer-motion";

function Navbar() {

  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) setIsScrolled(true);
      else setIsScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`h-15 min-w-full sm:h-20  fixed top-0 left-0 right-0  z-50 ${isScrolled ? "glass py-3" : "bg-transparent py-5"
      }`}>

      <nav className=" px-4 sm:px-6 flex items-center justify-between animate-[fadeIn_1s_ease-in-out]">
        <div className='tittle '>
          <Link to="/" className='text-xl font-bold tracking-tight hover:text-primary flex justify-center items-center gap-2'>
            <span>
              <img src="/images/communityLogo.png" alt="CommunityLogo" className="h-8 w-10 rounded-xl" />
            </span>
            <span>
              IET STUDENTS COMMUNITY
            </span>
          </Link>
        </div>
        <div className='hidden md:flex gap-1 items-center'>
          <div className="links glass rounded-full px-2 py-1 flex items-center gap-1">
            <Link to='/' className={`px-4 py-2 text-sm  rounded-full ${location.pathname === '/' ? 'bg-surface text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-surface'} `}
            >
              Home
            </Link>
            <Link to='/events' className={`px-4 py-2 text-sm  rounded-full ${location.pathname === '/events' ? 'bg-surface text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-surface'} `}>
              Events
            </Link>
            {/* <Link to='/resources' className={`px-4 py-2 text-sm  rounded-full ${(location.pathname === '/resources' || location.pathname === '/dsa'|| location.pathname === '/development'|| location.pathname === '/academics') ? 'bg-surface text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-surface'} `}
            >
              Resources
            </Link> */}
            <Link to='/members' className={`px-4 py-2 text-sm  rounded-full ${location.pathname === '/members' ? 'bg-surface text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-surface'} `}>
              Members
            </Link>
            {/* <Link to='/contact' className='px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-full hover:bg-surface'>
              Contact
            </Link> */}
          </div>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-primary transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 "
        >
          {menuOpen ? "✖" : "☰"}
        </button>

      </nav>
      <div
        className={`md:hidden mt-6 mx-4 rounded-xl py-4 flex flex-col items-center justify-center gap-3
  transition-all duration-300 ease-in-out
  ${location.pathname === '/' ? 'bg-linear-to-b from-primary/5 via-black/90 to-primary/10' : 'bg-background/90'}
  ${menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >

        <Link to="/" onClick={() => setMenuOpen(false)} className='w-full flex justify-center active:bg-primary/10 rounded-2xl h-8 items-center transition-all duration-100 ease-in-out z-10 text-foreground active:scale-150'>
          Home
        </Link>

        <Link to="/events" onClick={() => setMenuOpen(false)} className='w-full flex justify-center active:bg-primary/10 rounded-2xl h-8 items-center transition-all duration-100 ease-in-out z-10 text-foreground active:scale-150'>
          Events
        </Link>
        {/* <Link to="/resources" onClick={() => setMenuOpen(false)} className='w-full flex justify-center active:bg-primary/10 rounded-2xl h-8 items-center transition-all duration-100 ease-in-out z-10 text-foreground active:scale-150'>
          Resources
        </Link> */}
        <Link to="/members" onClick={() => setMenuOpen(false)} className='w-full flex justify-center active:bg-primary/10 rounded-2xl h-8 items-center transition-all duration-100 ease-in-out z-10 text-foreground active:scale-150'>
          Members
        </Link>
        <a href="https://www.rmlau.ac.in/">
          <img src="/images/rmlauLogo.png" alt="Rmalau Logo" className="
         bg-transparent  h-8 w-8 rounded-xl active:scale-1000 transition-all duration-300 z-50
        "/>
        </a>


      </div>
    </header>
  )
}

export default Navbar;