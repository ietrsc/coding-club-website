import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSihAuth } from "../../context/SihAuthContext";

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
  navigate("/sih/teams");
}, 700);
    } catch (err) {
      setError(
        err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-16">

      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "url('/images/backgroundImg.png')",
        }}
      />

      <div className="fixed inset-0 bg-linear-to-b from-background/80 via-background/90 to-background pointer-events-none" />

      <section className="relative z-10 mx-auto flex min-h-[80vh] max-w-md items-center px-4 sm:px-6">

        <div className="w-full">

          {/* Header */}

          <div className="mb-8 text-center">

            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Smart India Hackathon
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              SIH Login
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Login to create or manage your SIH team.
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="glass-strong rounded-2xl p-6 sm:p-8"
          >

            {/* Email */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                placeholder="student@example.com"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Password */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
              />

            </div>

            {/* Error */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
                {success}
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

            {/* Signup */}

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/sih/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>

            {/* Back */}

            <div className="mt-3 text-center">
              <Link
                to="/sih"
                className="text-sm text-muted-foreground transition hover:text-primary"
              >
                ← Back to SIH
              </Link>
            </div>

          </form>

        </div>

      </section>
    </div>
  );
}

export default Login;