import { CalendarDays, Megaphone, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { announcements } from "../data/announcements";

function Announcement() {
  const navigate = useNavigate();

  const iconMap = {
    calendar: CalendarDays,
    rocket: Rocket,
  };

  return (
    <section className="relative pt-30 px-4 sm:px-6 py-5 max-h-screen">
  <div className="max-w-5xl mx-auto">

    {/* Section Heading */}
    <div className="flex items-center justify-center  gap-4 mb-10">
      <div className="hidden sm:block h-px w-20 bg-linear-to-r from-transparent to-primary" />

      <div className="flex items-center gap-3">
        <Megaphone className="w-7 h-7 text-primary" />

        <h2 className="text-3xl md:text-4xl font-bold tracking-wider text-primary">
          ANNOUNCEMENTS
        </h2>
      </div>

      <div className="hidden sm:block h-px w-20 bg-linear-to-l from-transparent to-primary" />
    </div>

    {/* Outer Glassmorphism Container */}
    <div
      className="
        max-h-150
        relative
        overflow-hidden
        rounded-3xl
        border border-primary/20
        bg-white/5
        backdrop-blur-md
        shadow-[0_0_35px_rgba(32,178,166,0.08)]
        p-4
        sm:p-6
        lg:p-8
        overflow-y-auto
      "
    >

      {/* Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-highlight/5 blur-3xl pointer-events-none" />

      {/* Scrollable Announcements */}
      <div className="relative z-10 max-h-150 pt-5 overflow-y-auto pr-2 space-y-6">

        {announcements.map((announcement) => {
          const Icon = iconMap[announcement.icon] || CalendarDays;

          return (
            <div
              key={announcement.id}
              className="
              mb-3
                relative
                overflow-hidden
                rounded-2xl
                border border-primary/20
                bg-black/25
                backdrop-blur-sm
                p-6
                sm:p-8
                lg:p-10
                transition-all
                duration-300
                hover:border-primary/40
                hover:bg-primary/5
                hover:-translate-y-1
                hover:shadow-[0_0_25px_rgba(32,178,166,0.12)]
              "
            >

              <div className="grid grid-cols-1 lg:grid-cols-[130px_1fr_180px] gap-6 lg:gap-10 items-center">

                {/* Icon */}
                <div className="flex justify-center">
                  <div className="
                    h-24
                    w-24
                    rounded-full
                    border border-primary/40
                    bg-primary/5
                    flex
                    items-center
                    justify-center
                  ">
                    <Icon className="w-11 h-11 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center lg:text-left">
                  <span className="
                    inline-flex
                    rounded-full
                    border border-primary/30
                    bg-primary/10
                    px-3
                    py-1
                    text-xs
                    font-medium
                    tracking-wide
                    text-primary
                  ">
                    {announcement.badge}
                  </span>

                  <h3 className="
                    mt-4
                    text-2xl
                    sm:text-3xl
                    lg:text-4xl
                    font-bold
                    text-white
                  ">
                    {announcement.title}
                  </h3>

                  <p className="
                    mt-2
                    text-lg
                    sm:text-xl
                    font-semibold
                    text-primary
                  ">
                    {announcement.highlight}
                  </p>

                  <p className="
                    mt-3
                    text-sm
                    sm:text-base
                    leading-relaxed
                    text-white/65
                    max-w-2xl
                    mx-auto
                    lg:mx-0
                  ">
                    {announcement.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="flex justify-center">
                  <button
                    onClick={() => navigate(announcement.link)}
                    className="
                      px-5
                      py-2.5
                      rounded-xl
                      bg-primary
                      text-white
                      font-semibold
                      transition-all
                      duration-300
                      hover:scale-105
                      hover:bg-primary2
                      active:scale-95
                      cursor-pointer
                    "
                  >
                    {announcement.buttonText} →
                  </button>
                </div>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  </div>
</section>
  );
}

export default Announcement;