import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useSihAuth } from "../../context/SihAuthContext";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser, fetchCurrentUser } =
    useSihAuth();

  const [code, setCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [resendLoading, setResendLoading] =
    useState(false);

  const [resendMessage, setResendMessage] =
    useState("");

  const [cooldown, setCooldown] =
    useState(0);

  const inputRefs = useRef([]);

  // Email passed from Signup page
  const email = location.state?.email || "";

  // Redirect if user directly opens verification page
  useEffect(() => {
    if (!email) {
      navigate("/sih/signup", {
        replace: true,
      });
    }
  }, [email, navigate]);

  // Tick the resend cooldown down every second
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // ==========================================
  // HANDLE CODE CHANGE
  // ==========================================

  const handleChange = (index, value) => {
    // Allow only numbers
    const digit = value.replace(/\D/g, "").slice(-1);

    const newCode = [...code];
    newCode[index] = digit;

    setCode(newCode);
    setError("");

    // Move to next input automatically
    if (
      digit &&
      index < code.length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================
  // HANDLE BACKSPACE
  // ==========================================

  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ==========================================
  // HANDLE PASTE
  // ==========================================

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedCode =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    if (!pastedCode) return;

    const newCode = [
      "",
      "",
      "",
      "",
      "",
      "",
    ];

    pastedCode
      .split("")
      .forEach((digit, index) => {
        newCode[index] = digit;
      });

    setCode(newCode);
    setError("");

    const nextIndex =
      Math.min(
        pastedCode.length,
        5
      );

    inputRefs.current[
      nextIndex
    ]?.focus();
  };

  // ==========================================
  // VERIFY EMAIL
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const verificationCode =
      code.join("");

    if (verificationCode.length !== 6) {
      setError(
        "Please enter the complete 6-digit verification code."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-email`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            code: verificationCode,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to verify email."
        );
      }

      // Fetch the complete authenticated user
      const currentUser =
        await fetchCurrentUser();

      if (currentUser) {
        setUser(currentUser);
      }

      // Redirect after successful verification
      navigate("/sih", {
        replace: true,
      });
    } catch (err) {
      console.error(
        "Email verification error:",
        err
      );

      setError(
        err.message ||
          "Failed to verify email."
      );

      // Clear code after failed verification
      setCode([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESEND VERIFICATION CODE
  // ==========================================

  const handleResend = async () => {
    if (cooldown > 0 || resendLoading) return;

    setError("");
    setResendMessage("");

    try {
      setResendLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-verification-code`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to resend verification code."
        );
      }

      setResendMessage(
        "A new code has been sent to your email."
      );

      setCooldown(60);

      // Clear the old code so the user
      // doesn't accidentally submit it.
      setCode([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error(
        "Resend verification code error:",
        err
      );

      setError(
        err.message ||
          "Failed to resend verification code."
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 px-4 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
              ✉️
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Verify your email
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              We sent a 6-digit verification
              code to
            </p>

            <p className="mt-1 break-all font-medium text-primary">
              {email}
            </p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit}>
            
            <div
              className="mb-6 flex justify-center gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {code.map(
                (digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] =
                        element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={loading}
                    onChange={(event) =>
                      handleChange(
                        index,
                        event.target.value
                      )
                    }
                    onKeyDown={(event) =>
                      handleKeyDown(
                        index,
                        event
                      )
                    }
                    onPaste={handlePaste}
                    className="h-12 w-11 rounded-xl border border-slate-300 bg-white text-center text-xl font-bold text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-12"
                  />
                )
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Resend success message */}
            {resendMessage && (
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-600">
                {resendMessage}
              </div>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Verifying..."
                : "Verify Email"}
            </button>
          </form>

          {/* Resend code */}
          <p className="mt-5 text-center text-sm text-slate-500">
            Didn't get the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading || cooldown > 0}
              className="font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:no-underline"
            >
              {resendLoading
                ? "Sending..."
                : cooldown > 0
                ? `Resend code (${cooldown}s)`
                : "Resend code"}
            </button>
          </p>

          {/* Expiry Information */}
          <p className="mt-5 text-center text-xs text-slate-400">
            The verification code will expire
            in 15 minutes.
          </p>

          {/* Back to Signup */}
          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-sm text-slate-500">
              Entered the wrong email?{" "}
              <Link
                to="/sih/signup"
                className="font-semibold text-primary hover:underline"
              >
                Sign up again
              </Link>
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default VerifyEmail;