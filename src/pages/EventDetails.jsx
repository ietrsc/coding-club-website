import { useNavigate, useParams } from "react-router-dom";
import { events } from "../data/event";
import GridAnimation from "../components/GridAnimation";
import { Download } from "lucide-react";

function EventDetails() {

  const {slug} = useParams();
  const navigate = useNavigate();

  const event = events.find((e) => e.slug === slug);


  if (!event) {
    return <div className="pt-24 text-center">Event not found</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden pb-10 animate-[fadeIn_1s_ease-in-out]">
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

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6">

        {/* hero section */}

        <div className='flex flex-col items-center gap-2'>
          <h1
            className='text-4xl  md:text-6xl font-bold
            max-w-3xl z-3 '
          ><span className='bg-linear-to-r from-primary to-highlight text-transparent bg-clip-text'>{event.title}</span></h1>
          <h2 className='mx-3 max-w-xs sm:max-w-2xl text-muted-foreground'>{event.shortDescription}</h2>
          {/* <p className='mx-3 max-w-xs sm:max-w-2xl text-muted-foreground'>
            {event.date} || {event.time} || {event.venue}
          </p> */}

        </div>

        {/* contetn section */}


        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start mt-15">
          <img
            src={event.image}
            alt={event.title}
            className="h-auto w-full rounded-xl object-cover md:w-1/2"
          />

          <div className="w-full md:w-1/2 flex flex-col gap-5">
            <h2 className="mb-2 text-lg font-semibold">Description:</h2>
            <p className="mb-6 text-base text-muted-foreground sm:text-lg">
              {event.description}
            </p>

            <h2 className="mb-2 text-lg font-semibold">Important Details:</h2>
            <ul className="mb-6 ml-5 list-disc space-y-1 text-muted-foreground">
              <li><strong>Event Date:</strong>{event.date}</li>
              <li><strong>Time:</strong> {event.time} </li>
              <li><strong>Venue:</strong> {event.venue}</li>
              <li><strong>Registration Deadline:</strong> {event.registrationDeadline}</li>
              <li><strong>Team Size:</strong> {event.teamSize}</li>
              <li><strong>Mode:</strong> {event.mode}</li>
            </ul>

            <h2 className="mb-2 text-lg font-semibold">Contacts:</h2>
            <ul className="mb-6 ml-5 list-disc space-y-1 text-muted-foreground">
              <li><strong>Phone:</strong> {event.phone} </li>
              <li><strong>Email:</strong> {event.email} </li>
            </ul>
            <div>
              <h2>Important Documents:</h2>
              <div className="flex gap-2">
                <p className="text-muted-foreground"> Problem Statements:</p>
                <a href={event.psLink} className="text-blue-400 hover:underline">
                  <Download size={20} className="hover:scale-115" />
                </a>
              </div>
              <div className="flex gap-2">
                <p className="text-muted-foreground"> RuleBook:</p>
                <a href={event.rulebookLink} className="text-blue-400 hover:underline">
                  <Download size={20} className="hover:scale-115" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2  md:hidden">
            <div className=' flex justify-center items-center rounded-full border border-primary bg-primary sm:bg-surface hover:bg-linear-to-r from-primary to-highlight text-center text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-95  w-35 h-10 text-sm mt-0 sm:mt-3 cursor-pointer'>
              <a
                href="https://forms.gle/vbPLPBiuhjAqGGTo7"
                target="_blank"
                rel="noopener noreferrer"
                className={`${event.status === 'live' ? '' : 'hidden'} z-15`}
              >
                Register Now
              </a>
              <a
                className={`${event.status === 'expired' ? '' : 'hidden'} `}
                onClick={() => navigate(`/results/${event.slug}`)}
              >
                View Results →
              </a>
              <a
                className={`${event.status === 'upcoming' ? '' : 'hidden'} `}
                onClick={() =>
    window.location.href = "mailto:contact.adityasingh.tech@gmail.com"
  }
              >
                Contact Us →
              </a>

            </div>
          </div>
        </div>

      </section>
      <div className="fixed bottom-15 right-15 z-50 hidden md:block">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className={`${event.status === 'live' ? '' : 'hidden'} z-15`}
        >
          <div className=' flex justify-center items-center rounded-full border border-primary bg-primary sm:bg-surface hover:bg-linear-to-r from-primary to-highlight text-center text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-95  w-35 h-10 text-sm mt-0 sm:mt-3 cursor-pointer'>
            Register Now

          </div>
        </a>
        <a
          className={`${event.status === 'expired' ? '' : 'hidden'} z-10`}
          onClick={() => navigate(`/results/${event.slug}`)}
        >
          <div className=' flex justify-center items-center rounded-full border border-primary bg-primary sm:bg-surface hover:bg-linear-to-r from-primary to-highlight text-center text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-95  w-35 h-10 text-sm mt-0 sm:mt-3 cursor-pointer'>
            View Results →

          </div>
        </a>
        <a
          className={`${event.status === 'upcoming' ? '' : 'hidden'} z-10`}
          onClick={() => {
            window.location.href = "mailto:contact.adityasingh.tech@gmail.com";
          }
        }
        >
          <div className=' flex justify-center items-center rounded-full border border-primary bg-primary sm:bg-surface hover:bg-linear-to-r from-primary to-highlight text-center text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 active:scale-95  w-35 h-10 text-sm mt-0 sm:mt-3 cursor-pointer'>
            Contact Us →

          </div>
        </a>
      </div>
    </div>
  );
}

export default EventDetails;