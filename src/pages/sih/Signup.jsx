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

      <section className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">

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
            <a href="https://chat.whatsapp.com/JoRVufRkjw2L1WMChubKs3" target="_blank" >
              <img
                src="../images/pragyanLogo.jpeg"
                alt="Pragyan's Logo"
                className="h-50 w-50 rounded-xl object-cover cursor-pointer"
              />
            </a>
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
         <h1 className="text-muted-foreground text-4xl">
          Registration Closed...
         </h1>
        </section>

      </section>
    </div>
  );
}

export default Signup;