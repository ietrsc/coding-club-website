import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ParticipantRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    department: "",
    branch: "",
    year: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    const participantData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      gender: formData.gender,
      department: formData.department.trim(),
      branch: formData.branch.trim(),
      year: formData.year,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/participants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(participantData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setMessage("Registration successful!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        department: "",
        branch: "",
        year: "",
        skills: "",
      });

      // For now, redirect after a short delay.
      setTimeout(() => {
        navigate("/sih/participants");
      }, 1200);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="relative min-h-screen overflow-hidden pt-24 pb-16">
      
      {/* backgroundImage*/}

      <div
        className="fixed inset-0 bg-cover bg-center z-0 bg-no-repeat pointer-events-none"
        style={{ backgroundImage: `url('../../images/backgroundImg.png')` }}
      ></div>


      <div className="fixed inset-0 bg-linear-to-b from-background/70  to-background/80 pointer-events-none" />

      <section className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Smart India Hackathon
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Participant Registration
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Register yourself before creating or joining a team.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-strong rounded-2xl p-5 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">

            {/* Name */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-primary"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* department */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                department
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="Enter department name"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Branch
              </label>

              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                placeholder="e.g. CSE"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />
            </div>

            {/* Year */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Year
              </label>

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-primary"
              >
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            {/* Skills */}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                required
                placeholder="React, Node.js, MongoDB"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-primary"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Separate multiple skills with commas.
              </p>
            </div>

          </div>

          {/* Messages */}
          {message && (
            <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register as Participant"}
          </button>

          <div className="mt-5 text-center">
            <Link
              to="/sih"
              className="text-sm text-muted-foreground transition hover:text-primary"
            >
              ← Back to SIH
            </Link>
          </div>

        </form>
      </section>
    </div>
  );
}

export default ParticipantRegister;