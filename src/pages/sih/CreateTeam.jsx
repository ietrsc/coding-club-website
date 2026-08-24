import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSihAuth } from "../../context/SihAuthContext";
import ParticipantAvatar from "../../components/ParticipantAvatar";

const emptyPerson = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  department: "",
  branch: "",
  year: "",
  skills: "",
};

function CreateTeam() {
  const navigate = useNavigate();

  const {
    user,
    loading: authLoading,
    fetchCurrentUser,
  } = useSihAuth();

  const [teamName, setTeamName] = useState("");

  const [members, setMembers] = useState([]);

  // One File (or null) per entry in `members`, same index —
  // the leader has to supply a photo for each member they add,
  // since those members don't have an account yet to upload
  // their own.
  const [memberImages, setMemberImages] = useState([]);
  const [memberImagePreviews, setMemberImagePreviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // CHECK IF PARTICIPANT ALREADY HAS A TEAM
  // ==========================================

  const alreadyInTeam =
    !!user?.participantId?.teamId;

  // ==========================================
  // MEMBER CHANGE
  // ==========================================

  const handleMemberChange = (index, e) => {
    const { name, value } = e.target;

    setMembers((prev) =>
      prev.map((member, i) =>
        i === index
          ? {
              ...member,
              [name]: value,
            }
          : member
      )
    );
  };

  // ==========================================
  // ADD MEMBER
  // ==========================================

  const addMember = () => {
    if (members.length >= 5) {
      setError(
        "A team can have a maximum of 6 members including the leader."
      );
      return;
    }

    setError("");

    setMembers((prev) => [
      ...prev,
      {
        ...emptyPerson,
      },
    ]);

    setMemberImages((prev) => [...prev, null]);
    setMemberImagePreviews((prev) => [...prev, ""]);
  };

  // ==========================================
  // REMOVE MEMBER
  // ==========================================

  const removeMember = (index) => {
    setMembers((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setMemberImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setMemberImagePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================
  // MEMBER PROFILE PICTURE CHANGE
  // ==========================================

  const handleMemberImageChange = (index, e) => {
    const file = e.target.files?.[0] || null;

    setMemberImages((prev) =>
      prev.map((img, i) => (i === index ? file : img))
    );

    setMemberImagePreviews((prev) =>
      prev.map((preview, i) =>
        i === index
          ? file
            ? URL.createObjectURL(file)
            : ""
          : preview
      )
    );
  };

  // ==========================================
  // PERSON FORM
  // ==========================================

  const renderPersonFields = (
    person,
    handleChange,
    imagePreview,
    onImageChange
  ) => {
    return (
      <div className="grid gap-5 sm:grid-cols-2">

        {/* Profile Picture */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Profile Picture <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background/50 text-[10px] text-muted-foreground">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Member preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                "No photo"
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              required
              className="flex-1 text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary/15 file:px-3 file:py-2 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/25"
            />
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            You're uploading this on the member's behalf — they can update it once they sign up.
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={person.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
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
            value={person.email}
            onChange={handleChange}
            required
            placeholder="example@gmail.com"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <input
            type="tel"
            name="phone"
            value={person.phone}
            onChange={handleChange}
            required
            placeholder="10 digit mobile number"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Gender
          </label>

          <select
            name="gender"
            value={person.gender}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="">
              Select gender
            </option>

            <option value="male">
              Male
            </option>

            <option value="female">
              Female
            </option>
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
            value={person.department}
            onChange={handleChange}
            required
            placeholder="department name"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
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
            value={person.branch}
            onChange={handleChange}
            required
            placeholder="e.g. CSE"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Year */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Year
          </label>

          <select
            name="year"
            value={person.year}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="">
              Select year
            </option>

            <option value="1">
              1st Year
            </option>

            <option value="2">
              2nd Year
            </option>

            <option value="3">
              3rd Year
            </option>

            <option value="4">
              4th Year
            </option>
          </select>
        </div>

        {/* Skills */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Skills
          </label>

          <input
            type="text"
            name="skills"
            value={person.skills}
            onChange={handleChange}
            placeholder="React, Node.js, Python"
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>

      </div>
    );
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extra frontend protection
    if (alreadyInTeam) {
      setError(
        "You already belong to a team."
      );
      return;
    }

    // Every added member needs a profile picture — the
    // leader supplies it since the member has no account yet.
    const missingImageIndex = members.findIndex(
      (_, index) => !memberImages[index]
    );

    if (missingImageIndex !== -1) {
      setError(
        `Please upload a profile picture for Member ${missingImageIndex + 2}.`
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();

      payload.append("teamName", teamName.trim());

      payload.append(
        "members",
        JSON.stringify(
          members.map((member) => ({
            ...member,

            year: Number(member.year),

            skills: member.skills
              ? member.skills
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)
              : [],
          }))
        )
      );

      memberImages.forEach((file, index) => {
        payload.append(`memberImage_${index}`, file);
      });

      const response = await fetch(
       `${import.meta.env.VITE_API_URL}/api/teams`,
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
          data.message ||
            "Failed to create team"
        );
      }

      setSuccess("Team created successfully!");

const createdTeam = data.data || data;

// Refresh the logged-in user's data
// This updates user.participantId.teamId in SihAuthContext
await fetchCurrentUser();

setTimeout(() => {
  if (createdTeam?._id) {
    navigate(`/sih/teams/${createdTeam._id}`);
  } else {
    navigate("/sih/teams");
  }
}, 1200);
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // AUTH LOADING
  // ==========================================

  if (authLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-24 pb-16">

        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "url('/images/backgroundImg.png')",
          }}
        />

        <div className="fixed inset-0 bg-linear-to-b from-background/80 via-background/90 to-background pointer-events-none" />

        <div className="relative z-10 flex min-h-[70vh] items-center justify-center">
          <div className="text-sm text-muted-foreground">
            Checking authentication...
          </div>
        </div>

      </div>
    );
  }

  // ==========================================
  // ALREADY HAS A TEAM
  // ==========================================

  if (alreadyInTeam) {
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

        <section className="relative z-10 mx-auto max-w-xl px-4 sm:px-6">

          <div className="glass-strong mt-20 rounded-2xl p-8 text-center">

            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Smart India Hackathon
            </p>

            <h1 className="mt-3 text-2xl font-bold">
              You Already Have a Team
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Each SIH participant can belong to only
              one team at a time.
            </p>

            <div className="mt-6 flex flex-col gap-3">

              <Link
                to={`/sih/teams/${user.participantId.teamId}`}
                className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                View Your Team
              </Link>

              <Link
                to="/sih/teams"
                className="w-full rounded-xl border border-border px-5 py-3 text-sm transition hover:border-primary hover:text-primary"
              >
                Browse Teams
              </Link>

            </div>

          </div>

        </section>

      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-16">

      {/* ==========================================
          BACKGROUND
      =========================================== */}

      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "url('/images/backgroundImg.png')",
        }}
      />

      <div className="fixed inset-0 bg-linear-to-b from-background/80 via-background/90 to-background pointer-events-none" />

      <section className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">

        {/* ==========================================
            HEADER
        =========================================== */}

        <div className="mb-8 text-center">

          <p className="text-sm font-medium uppercase tracking-widest text-primary">
            Smart India Hackathon
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Create Your Team
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Create your SIH team and add the other
            members. Your account will automatically
            become the team leader.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="glass-strong rounded-2xl p-5 sm:p-8"
        >

          {/* =====================================
              TEAM INFORMATION
          ====================================== */}

          <div>

            <h2 className="text-xl font-semibold">
              Team Information
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter your SIH team name.
            </p>

          </div>

          <div className="mt-6">

            <label className="mb-2 block text-sm font-medium">
              Team Name
            </label>

            <input
              type="text"
              value={teamName}
              onChange={(e) =>
                setTeamName(e.target.value)
              }
              required
              placeholder="e.g. Code Warriors"
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm outline-none focus:border-primary"
            />

          </div>

          {/* =====================================
              LOGGED IN LEADER
          ====================================== */}

          <div className="mt-10 border-t border-border pt-8">

            <h2 className="text-xl font-semibold">
              Team Leader
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              You are automatically registered as the
              team leader using your logged-in SIH account.
            </p>

            <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-4">

              <div className="flex items-center gap-3">

                <ParticipantAvatar
                  src={user?.participantId?.profileImage}
                  name={user?.participantId?.name}
                  size="h-10 w-10"
                  className="rounded-full bg-primary/10"
                  textClassName="font-semibold text-primary"
                />

                <div>
                  <p className="text-sm font-medium">
                    {user?.participantId?.name ||
                      "Logged-in participant"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {user?.participantId?.email ||
                      "Your account details will be used automatically."}
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* =====================================
              TEAM MEMBERS
          ====================================== */}

          <div className="mt-10 border-t border-border pt-8">

            <div className="flex items-start justify-between gap-4">

              <div>

                <h2 className="text-xl font-semibold">
                  Team Members
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add the other members of your team.
                </p>

              </div>

              <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                {members.length} member
                {members.length !== 1
                  ? "s"
                  : ""}
              </span>

            </div>

            <div className="mt-6 space-y-6">

              {members.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-background/30 p-5 text-sm text-muted-foreground">
                  No additional members yet — that's fine,
                  you can create the team with just yourself
                  and invite others later.
                </div>
              )}

              {members.map(
                (member, index) => (

                  <div
                    key={index}
                    className="rounded-2xl border border-border bg-background/30 p-5"
                  >

                    <div className="mb-5 flex items-center justify-between">

                      <h3 className="font-semibold">
                        Member {index + 2}
                      </h3>

                      {/* No minimum members required —
                          a team of just the leader is
                          valid, so Remove is always
                          available. */}
                      <button
                        type="button"
                        onClick={() =>
                          removeMember(index)
                        }
                        className="text-xs text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>

                    </div>

                    {renderPersonFields(
                      member,
                      (e) =>
                        handleMemberChange(
                          index,
                          e
                        ),
                      memberImagePreviews[index],
                      (e) =>
                        handleMemberImageChange(
                          index,
                          e
                        )
                    )}

                  </div>
                )
              )}

            </div>

            {/* Add member */}

            <button
              type="button"
              onClick={addMember}
              disabled={members.length >= 5}
              className="mt-6 w-full rounded-xl border border-dashed border-primary/50 px-4 py-3 text-sm font-medium text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {members.length >= 5
                ? "Maximum Team Size Reached"
                : "+ Add Another Member"}
            </button>

          </div>

          {/* =====================================
              INFORMATION
          ====================================== */}

          <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-4">

            <p className="text-xs leading-5 text-muted-foreground">
              The logged-in participant will automatically
              become the team leader and the first team
              member. Adding more members is optional — you
              can create a team with just yourself and add
              up to 5 more (6 total) whenever you're ready.
            </p>

          </div>

          {/* =====================================
              ERROR
          ====================================== */}

          {error && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              <p>
                Any of your team members are already registered
              </p>
            </div>
          )}

          {/* =====================================
              SUCCESS
          ====================================== */}

          {success && (
            <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
              {success}
            </div>
          )}

          {/* =====================================
              SUBMIT
          ====================================== */}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating Team..."
              : "Create Team"}
          </button>

          {/* Back */}

          <div className="mt-5 text-center">

            <Link
              to="/sih/teams"
              className="text-sm text-muted-foreground transition hover:text-primary"
            >
              ← Back to Teams
            </Link>

          </div>

        </form>

      </section>
    </div>
  );
}

export default CreateTeam;