const footerLinks = {
  Templates: ["Classic", "Modern", "Luxury", "Editorial"],
  Services: ["Custom invites", "Branding", "RSVP pages", "Guest support"],
  Studio: ["About", "Journal", "Contact", "Careers"],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/8 bg-white text-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_68%)] blur-3xl" />
        <div className="absolute -right-32 -bottom-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.2),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black text-sm font-semibold tracking-[0.28em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
                MP
              </div>
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.35em] text-black/45">Missing Piece</p>
                <p className="text-sm font-medium text-black/85">Wedding invitation templates</p>
              </div>
            </div>

            <p className="mt-6 max-w-md text-sm leading-7 text-black/58 sm:text-base">
              Crafted for couples who want a clean, premium wedding presence with elegant typography, refined motion,
              and a cinematic showcase of invitation designs.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-[0_18px_42px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-black/92">
                Choose a template
              </button>
              <button className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium text-black/75 shadow-[0_14px_34px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:text-black">
                Book a consultation
              </button>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:gap-14">
            {Object.entries(footerLinks).map(([title, items]) => (
              <div key={title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-black/45">{title}</h2>
                <ul className="mt-5 space-y-3 text-sm text-black/70">
                  {items.map((item) => (
                    <li key={item}>
                      <a href="#" className="transition duration-200 hover:text-black">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-linear-to-r from-transparent via-black/12 to-transparent" />

        <div className="mt-6 flex flex-col gap-4 text-sm text-black/48 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Missing Piece Invites. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <a href="#" className="transition hover:text-black">Instagram</a>
            <a href="#" className="transition hover:text-black">Pinterest</a>
            <a href="#" className="transition hover:text-black">Email</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
