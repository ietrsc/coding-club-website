import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSihAuth } from "../context/SihAuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [invitationCount, setInvitationCount] = useState(0);

  const { user, isAuthenticated, logout, loading:authLoading } = useSihAuth();

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    const result = await logout();

    if (result.success) {
      setMenuOpen(false);
      navigate("/sih/login");
    } else {
      alert(result.message);
    }
  };

  // ==========================================
  // SCROLL
  // ==========================================

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user?._id) {
      setInvitationCount(0);
      return;
    }

    let cancelled = false;
    const fetchInvitationCount = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/invitations/my`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (!cancelled) {
            setInvitationCount(0);
          }
          return;
        }

        const data = await response.json();

        if (!cancelled) {
          setInvitationCount(data.data?.length || 0);
        }
      } catch (error) {
        console.error(
          "Failed to fetch invitation count:",
          error
        );

        if (!cancelled) {
          setInvitationCount(0);
        }
      }
    };

    fetchInvitationCount();

    // Update count immediately when an invitation
    // is accepted or rejected.
    window.addEventListener(
      "sih-invitations-changed",
      fetchInvitationCount
    );

    return () => {
      cancelled = true;

      window.removeEventListener(
        "sih-invitations-changed",
        fetchInvitationCount
      );
    };
  }, [
    authLoading,
    isAuthenticated,
    user?._id,
  ]);

  return (
    <header
      className={`h-15 min-w-full sm:h-20 fixed top-0 left-0 right-0 z-50 ${
        isScrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      {/* ==========================================
          MAIN NAVBAR
      =========================================== */}

      <nav className="px-4 sm:px-6 flex items-center justify-between animate-[fadeIn_1s_ease-in-out]">
        {/* ========================================
            LOGO
        ========================================= */}

        <div className="tittle">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight hover:text-primary flex justify-center items-center gap-2"
          >
            <span>
              <img
                src="/images/communityLogo.png"
                alt="CommunityLogo"
                className="h-8 w-10 rounded-xl"
              />
            </span>

            <span>IET STUDENTS COMMUNITY</span>
          </Link>
        </div>

        {/* ========================================
            DESKTOP NAVIGATION
        ========================================= */}

        <div className="hidden md:flex gap-1 items-center">
          <div className="links glass rounded-full px-2 py-1 flex items-center gap-1">
            {/* Home */}

            <Link
              to="/"
              className={`px-4 py-2 text-sm rounded-full ${
                location.pathname === "/"
                  ? "bg-surface text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              Home
            </Link>

            {/* Events */}

            <Link
              to="/events"
              className={`px-4 py-2 text-sm rounded-full ${
                location.pathname === "/events"
                  ? "bg-surface text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              Events
            </Link>

            {/* Members */}

            <Link
              to="/members"
              className={`px-4 py-2 text-sm rounded-full ${
                location.pathname === "/members"
                  ? "bg-surface text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface"
              }`}
            >
              Members
            </Link>
          </div>
        </div>

        {/* ========================================
            DESKTOP SIH AUTH
        ========================================= */}


        <div className={`hidden  items-center gap-3 ${location.pathname.includes("/sih") ? "md:flex": "md:hidden"} ${isAuthenticated ? "md:flex": "md:hidden"}`}>
          {isAuthenticated ? (
            <>
              <Link
                to="/sih/invitations"
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-primary/10 hover:text-primary ${location.pathname == "/sih/invitations" ? "bg-primary/10 text-primary" : ""}`}
              >
                <span>Invitations</span>

                {invitationCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
                    {invitationCount}
                  </span>
                )}
              </Link>
              <span className="text-sm text-muted-foreground">
                {user?.participantId?.name || "Participant"}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-500 transition hover:bg-red-500/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sih/login"
                className="rounded-xl border border-border px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
              >
                SIH Login
              </Link>

              <Link
                to="/sih/signup"
                className="rounded-xl border bg-surface hover:bg-primary border-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                SIH Sign Up
              </Link>
            </>
          )}
        </div>

        {/* ========================================
            MOBILE MENU BUTTON
        ========================================= */}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-primary transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
        >
          {menuOpen ? "✖" : "☰"}
        </button>
      </nav>

      {/* ==========================================
          MOBILE MENU
      =========================================== */}

      <div
        className={`md:hidden mt-6 mx-4 rounded-xl py-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 ease-in-out ${
          location.pathname === "/"
            ? "bg-linear-to-b from-primary/5 via-black/90 to-primary/10"
            : "bg-background/90"
        } ${
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        {/* Home */}

        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="w-full flex justify-center active:bg-primary/10 rounded-2xl h-8 items-center transition-all duration-100 ease-in-out z-10 text-foreground active:scale-150"
        >
          Home
        </Link>

        {/* Events */}

        <Link
          to="/events"
          onClick={() => setMenuOpen(false)}
          className="w-full flex justify-center active:bg-primary/10 rounded-2xl h-8 items-center transition-all duration-100 ease-in-out z-10 text-foreground active:scale-150"
        >
          Events
        </Link>

        {/* Members */}

        <Link
          to="/members"
          onClick={() => setMenuOpen(false)}
          className="w-full flex justify-center active:bg-primary/10 rounded-2xl h-8 items-center transition-all duration-100 ease-in-out z-10 text-foreground active:scale-150"
        >
          Members
        </Link>

        {/* RMLAU Logo */}

        <a href="https://www.rmlau.ac.in/" target="_blank" rel="noreferrer">
          <img
            src="/images/rmlauLogo.png"
            alt="RMLAU Logo"
            className="bg-transparent h-8 w-8 rounded-xl active:scale-1000 transition-all duration-300 z-50"
          />
        </a>

        {/* ========================================
            MOBILE SIH AUTH
        ========================================= */}

        <div className={`${
            location.pathname.includes("/sih") ?  isAuthenticated ? "flex": "hidden" : ""
          } `}>

        {isAuthenticated ? (
          <div className="flex justify-evenly items-center gap-3">
            <span className="text-sm text-foreground">
              {user?.participantId?.name || "Participant"}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-500 transition hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/sih/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm transition hover:text-primary"
            >
              SIH Login
            </Link>

            <Link
              to="/sih/signup"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              SIH Sign Up
            </Link>
          </div>
        )}

        </div>

      </div>
    </header>
  );
}

export default Navbar;
