import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSihAuth } from "../../context/SihAuthContext";
import GridAnimation from "../../components/GridAnimation";
import { events } from "../../data/event";

function Login() {
  const { fetchCurrentUser } = useSihAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password"
        );
      }

      const currentUser = await fetchCurrentUser();

      if (!currentUser) {
        throw new Error(
          "Login succeeded, but user session could not be loaded"
        );
      }

      setSuccess("Login successful!");

      setTimeout(() => {
        navigate("/sih");
      }, 700);
    } catch (err) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const event = events.find((e) => e.slug === "sih-2026");

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-16">

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



      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6">

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
          <a href='https://cseiet.vercel.app' target='_blank' className='text-primary text-sm underline hover:scale-105 hover:text-blue-400 duration-200'>
            Go to the official website of CSE clubs →
          </a>
          <a href="https://chat.whatsapp.com/LIxHxt2agoaCn5qbgoDvrA" target='_blank' className='text-primary hover:scale-105 hover:text-blue-400 duration-200 text-sm underline'>
            Join CLUBS - Deptt of CSE →
          </a>

        </div>

        {/* content section */}
        <section className="animate-[fadeIn_1s_ease-in-out] mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <form
            onSubmit={handleSubmit}
            className="
    hover:bg-primary/5
    hover:-translate-y-1
    relative
    z-10
    w-full
    max-w-md
    overflow-hidden
    rounded-3xl
    border border-primary/20
    bg-white/5
    p-6
    sm:p-8
    backdrop-blur-md
    shadow-[0_0_40px_rgba(32,178,166,0.08)]
  "
          >
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-highlight/5 blur-3xl" />

            <div className="relative z-10">

              {/* Header */}
              <div className="mb-8 text-center">
                <span
                  className="
          inline-flex
          rounded-full
          border border-primary/25
          bg-primary/10
          px-3
          py-1
          text-xs
          font-medium
          tracking-wide
          text-primary
        "
                >
                  SIH 2026
                </span>

                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
                  Welcome Back
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Login to manage your SIH participation, team and invitations.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student@example.com"
                  className="
          w-full
          rounded-xl
          border border-white/10
          bg-black/20
          px-4
          py-3
          text-sm
          text-white
          placeholder:text-white/30
          outline-none
          transition-all
          duration-300
          focus:border-primary/60
          focus:bg-primary/5
          focus:ring-2
          focus:ring-primary/10
        "
                />
              </div>

              {/* Password */}
              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="
          w-full
          rounded-xl
          border border-white/10
          bg-black/20
          px-4
          py-3
          text-sm
          text-white
          placeholder:text-white/30
          outline-none
          transition-all
          duration-300
          focus:border-primary/60
          focus:bg-primary/5
          focus:ring-2
          focus:ring-primary/10
        "
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="
          mt-5
          rounded-xl
          border border-red-400/20
          bg-red-400/5
          px-4
          py-3
          text-sm
          leading-relaxed
          text-red-400
        "
                >
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  className="
          mt-5
          rounded-xl
          border border-green-400/20
          bg-green-400/5
          px-4
          py-3
          text-sm
          leading-relaxed
          text-green-400
        "
                >
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
              cursor-pointer
        mt-6
        w-full
        rounded-xl
        bg-primary
        px-4
        py-3.5
        text-sm
        font-semibold
        text-white
        shadow-[0_0_20px_rgba(32,178,166,0.18)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-primary2
        hover:shadow-[0_0_30px_rgba(32,178,166,0.3)]
        active:scale-[0.99]
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
              >
                {loading ? "Logging in..." : "Login →"}
              </button>

              {/* Signup */}
              <p className="mt-6 text-center text-sm text-white/50">
                Don't have an account?{" "}
                <Link
                  to="/sih/signup"
                  className="
          font-semibold
          text-primary
          transition-colors
          duration-300
          hover:text-highlight
          hover:underline
        "
                >
                  Sign Up
                </Link>
              </p>

            </div>
          </form>

        </section>

      </section>
    </div>
  );
}

export default Login;