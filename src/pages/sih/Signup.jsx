import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSihAuth } from "../../context/SihAuthContext";
import GridAnimation from "../../components/GridAnimation";
import { events } from "../../data/event";

function Signup() {
  const { fetchCurrentUser } = useSihAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    department: "",
    branch: "",
    year: "",
    skills: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0] || null;

    setProfileImage(file);

    if (file) {
      setProfileImagePreview(URL.createObjectURL(file));
    } else {
      setProfileImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileImage) {
      setError("Profile picture is required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();

      payload.append("name", formData.name.trim());
      payload.append("email", formData.email.trim().toLowerCase());
      payload.append("password", formData.password);
      payload.append("phone", formData.phone.trim());
      payload.append("gender", formData.gender);
      payload.append("department", formData.department.trim());
      payload.append("branch", formData.branch.trim());
      payload.append("year", Number(formData.year));

      const skills = formData.skills
        ? formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
        : [];

      skills.forEach((skill) => payload.append("skills[]", skill));

      payload.append("profileImage", profileImage);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          // No Content-Type header — the browser sets the
          // multipart boundary automatically for FormData.
          credentials: "include",
          body: payload,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create account"
        );
      }

      const currentUser = await fetchCurrentUser();

      if (!currentUser) {
        throw new Error(
          "Account was created, but user session could not be loaded"
        );
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/sih");
      }, 1000);
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
    <div className="relative min-h-screen overflow-hidden pt-24 pb-26">

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

      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

        {/* hero section */}
        <div className='flex flex-col items-center gap-2'>
          <h1
            className='text-4xl  md:text-6xl font-bold
            max-w-3xl z-3 md:text-center'
          ><span className='bg-linear-to-r from-primary to-highlight text-transparent bg-clip-text'>{event.title}</span></h1>
          <h2 className='mx-3 max-w-xs sm:max-w-2xl text-muted-foreground z-10'>Create your participant account to create or
            join an SIH team.</h2>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Create SIH Account
          </p>
        </div>

        {/* content section */}
        <section className="animate-[fadeIn_1s_ease-in-out] mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <form
            onSubmit={handleSubmit}
            className="
    relative
    z-10
    w-full
    max-w-4xl
    overflow-hidden
    rounded-3xl
    border border-primary/20
    bg-white/5
    p-5
    sm:p-8
    lg:p-10
    backdrop-blur-md
    shadow-[0_0_40px_rgba(32,178,166,0.08)]
  "
          >
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-highlight/5 blur-3xl" />

            <div className="relative z-10">

              {/* Header */}
              <div className="mb-10 text-center sm:text-left">
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
                  Create Your Account
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
                  Create an account to participate in the SIH Internal Hackathon,
                  create or join teams, and manage your participation.
                </p>
              </div>

              {/* ================================
        ACCOUNT INFORMATION
    ================================= */}
              <section className="mb-10">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <span className="text-sm font-bold text-primary">01</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Account Information
                    </h3>

                    <p className="text-sm text-white/40">
                      Create your login credentials.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-white/80">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
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

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
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
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
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

                </div>
              </section>

              {/* ================================
        PERSONAL & ACADEMIC
    ================================= */}
              <section className="mb-10">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <span className="text-sm font-bold text-primary">02</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Personal & Academic Information
                    </h3>

                    <p className="text-sm text-white/40">
                      Tell us a little about yourself.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="10 digit mobile number"
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

                  {/* Gender */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">
                      Gender
                    </label>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="
              w-full
              rounded-xl
              border border-white/10
              bg-black/20
              px-4
              py-3
              text-sm
              text-white
              outline-none
              transition-all
              duration-300
              focus:border-primary/60
              focus:bg-primary/5
              focus:ring-2
              focus:ring-primary/10
            "
                    >
                      <option value="" className="bg-slate-900">
                        Select gender
                      </option>

                      <option value="male" className="bg-slate-900">
                        Male
                      </option>

                      <option value="female" className="bg-slate-900">
                        Female
                      </option>
                    </select>
                  </div>

                  {/* Year */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">
                      Year
                    </label>

                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="
              w-full
              rounded-xl
              border border-white/10
              bg-black/20
              px-4
              py-3
              text-sm
              text-white
              outline-none
              transition-all
              duration-300
              focus:border-primary/60
              focus:bg-primary/5
              focus:ring-2
              focus:ring-primary/10
            "
                    >
                      <option value="" className="bg-slate-900">
                        Select year
                      </option>

                      <option value="1" className="bg-slate-900">
                        1st Year
                      </option>

                      <option value="2" className="bg-slate-900">
                        2nd Year
                      </option>

                      <option value="3" className="bg-slate-900">
                        3rd Year
                      </option>

                      <option value="4" className="bg-slate-900">
                        4th Year
                      </option>
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">
                      Department
                    </label>

                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      placeholder="e.g. B.Tech/BCA"
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

                  {/* Branch */}
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-white/80">
                      Branch
                    </label>

                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                      placeholder="e.g. CSE"
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

                </div>
              </section>

              {/* ================================
        PROFILE PICTURE
    ================================= */}
              <section className="mb-10">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <span className="text-sm font-bold text-primary">03</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Profile Picture
                    </h3>

                    <p className="text-sm text-white/40">
                      Required — used on your participant profile and team roster.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div
                    className="
              flex
              h-20
              w-20
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border border-white/10
              bg-black/20
              text-xs
              text-white/30
            "
                  >
                    {profileImagePreview ? (
                      <img
                        src={profileImagePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      "No photo"
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      required
                      className="
              block
              w-full
              text-sm
              text-white/70
              file:mr-4
              file:rounded-xl
              file:border-0
              file:bg-primary/15
              file:px-4
              file:py-2
              file:text-sm
              file:font-medium
              file:text-primary
              hover:file:bg-primary/25
            "
                    />

                    <p className="mt-2 text-xs text-white/35">
                      JPG or PNG, up to 5MB.
                    </p>
                  </div>
                </div>
              </section>

              {/* ================================
        SKILLS
    ================================= */}
              <section className="mb-8">
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
                    <span className="text-sm font-bold text-primary">04</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Skills & Expertise
                    </h3>

                    <p className="text-sm text-white/40">
                      Help teams understand what you can contribute.
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, Python, Machine Learning..."
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

                <p className="mt-2 text-xs text-white/35">
                  Separate multiple skills with commas.
                </p>
              </section>

              {/* Error */}
              {error && (
                <div
                  className="
          mb-5
          rounded-xl
          border border-red-400/20
          bg-red-400/5
          px-4
          py-3
          text-sm
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
          mb-5
          rounded-xl
          border border-green-400/20
          bg-green-400/5
          px-4
          py-3
          text-sm
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
                {loading ? "Creating Account..." : "Create Account →"}
              </button>

              {/* Login */}
              <p className="mt-6 text-center text-sm text-white/50">
                Already have an account?{" "}
                <Link
                  to="/sih/login"
                  className="
          font-semibold
          text-primary
          transition-colors
          duration-300
          hover:text-highlight
          hover:underline
        "
                >
                  Login
                </Link>
              </p>

            </div>
          </form>
          <Link
              to="/sih"
              className="text-sm text-muted-foreground transition hover:text-primary text-center"
            >
              Go to SIH without login →
            </Link>
        </section>
        
        

      </section>
    </div>
  );
}

export default Signup;