export default function AboutPage() {
  return (
    <main className="bg-white text-black">
      <section className="relative overflow-hidden border-b border-black/8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_68%)] blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.2),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">About Us</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">The Art of Gathering</h1>
          <p className="mt-4 text-sm text-black/56 sm:text-base">Made in India with love.</p>
          <div className="mt-8 space-y-6 text-base leading-8 text-black/72 sm:text-lg">
            <p>
              At the heart of every great moment is a simple human desire: to gather. Whether it is two families
              uniting for a vibrant wedding, a company celebrating a milestone gala, a college bringing thousands
              together for a festival, or a simple birthday surrounded by your closest friends, every memorable event
              starts the exact same way. It starts with an invitation.
            </p>
            <p>
              But somewhere along the way, the magic of the invite was lost to convenience. We traded beautiful
              anticipation for cold calendar links. We swapped out the excitement of being invited for heavy PDF files
              and mass text messages that get buried in notifications. The emotion was stripped away, leaving only
              logistics.
            </p>
            <p>
              We created EnviteYou to bring the soul back to the way the world gathers.
            </p>
            <p>
              We believe an invitation is not just a time and a location. It is the digital red carpet. It is the very
              first emotion your guest feels before they even step through the door, and the first glimpse into the
              experience you are building for them.
            </p>
            <p>
              That is why we approach our platform with one quiet, unwavering philosophy: every pixel has a purpose.
              We think before we post, publish, or send. By stripping away the clutter, the heavy downloads, and the
              confusing tech, we create digital spaces that focus entirely on connection.
            </p>
            <p>
              Today, we are starting by bringing calm to the beautiful chaos of weddings. Tomorrow, we are redefining
              how the globe manages guest lists, RSVPs, and event experiences, from intimate birthday dinners to
              massive corporate summits.
            </p>
            <p>
              We handle the tech, the tracking, and the invisible details, so you can focus on what actually matters:
              the people in the room.
            </p>
            <p>Welcome to EnviteYou. Let’s bring people together.</p>
          </div>
        </div>
      </section>
    </main>
  );
}