function Footer() {
  return (
    <footer
      className='fixed mt-auto bottom-0 left-0 right-0 bg-linear-to-b from-background/60 to-black/60 text-center text-sm text-muted-foreground flex justify-between items-center h-22 sm:h-12 px-5 z-50 animate-[fadeIn_1s_ease-in-out]
      mx-auto  max-w-6xl flex-col gap-4  py-4 sm:flex-row sm:justify-between sm:px-6 min-w-full'
    >

        {/* Icons */}
        <div className="flex items-center gap-6 ">
          <a
            href="https://github.com/ietrsc/coding-club-website"
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-300 hover:text-primary"
          >
            <i className="ri-github-line text-xl"></i>
          </a>

          <a
            href="https://www.linkedin.com/company/ietrmlau"
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-300 hover:text-primary"
          >
            <i className="ri-linkedin-box-line text-xl"></i>
          </a>

          <a
            href="mailto:contact.adityasingh.tech@gmail.com"
            className="transition duration-300 hover:text-primary"
          >
            <i className="ri-mail-line text-xl"></i>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs sm:text-sm">
          © {new Date().getFullYear()} IET Students Community. All rights reserved.
        </div>

    </footer>
  );
}

export default Footer;