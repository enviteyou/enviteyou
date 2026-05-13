const cookieSections = [
  {
    title: "1. What Are Cookies?",
    body: [
      "Cookies are small data files stored on your device when accessing EnviteYou. They are utilized to maintain secure sessions, remember system preferences, process payments safely, and analyze platform usage to ensure optimal technical performance.",
    ],
  },
  {
    title: "2. Types of Cookies We Deploy",
    body: [
      "We deploy specific categories of cookies to ensure our digital services operate securely and efficiently:",
      "Strictly Necessary (Technical) Cookies: Essential for core site functions, including active user sessions, secure account access, and retaining fundamental settings. These are required for the website to function and cannot be switched off.",
      "Analytical Cookies: Utilized to understand aggregate usage metrics and improve platform infrastructure. These cookies process anonymized data and do not identify individual users.",
      "Third-Party Cookies: Deployed exclusively by integrated, secure service providers (such as Razorpay and Stripe) to facilitate compliant, encrypted payment processing.",
    ],
  },
  {
    title: "4. Cookie Management",
    body: [
      "You retain full control over your cookie preferences. Modifications can be made directly through your device's browser settings to block, delete, or notify you when a cookie is deployed:",
      "Google Chrome: Settings > Privacy and security > Cookies",
      "Apple Safari: Preferences > Privacy",
      "Mozilla Firefox: Options > Privacy & Security",
      "Microsoft Edge: Settings > Cookies and site permissions",
      "Note: Disabling or rejecting strictly necessary technical cookies will disrupt critical platform functionality, including the inability to process purchases or access purchased digital templates.",
    ],
  },
  {
    title: "5. Consent Authorization",
    body: [
      "By navigating and interacting with EnviteYou, you acknowledge and accept the deployment of strictly necessary technical cookies required for service delivery. Analytical and third-party tracking cookies are activated only upon your explicit consent via our platform's cookie banner. Consent parameters can be adjusted or withdrawn at any time.",
    ],
  },
];

const cookieRows = [
  {
    name: "_session",
    provider: "EnviteYou",
    purpose: "Maintains the active user session",
    duration: "Session",
  },
  {
    name: "preferences",
    provider: "EnviteYou",
    purpose: "Stores basic user settings (e.g., currency, language)",
    duration: "1 Year",
  },
  {
    name: "cookie_consent",
    provider: "EnviteYou",
    purpose: "Records the user's cookie consent status",
    duration: "1 Year",
  },
  {
    name: "__rzp_mid / __stripe_mid",
    provider: "Razorpay / Stripe",
    purpose: "Facilitates secure payment gateway processing",
    duration: "1 Year",
  },
  {
    name: "__stripe_sid",
    provider: "Stripe",
    purpose: "Secures the active payment session against fraud",
    duration: "30 Minutes",
  },
];

export default function CookiePolicyPage() {
  return (
    <main className="bg-white text-black">
      <section className="relative overflow-hidden border-b border-black/8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_68%)] blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.2),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">EnviteYou</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Cookie Policy</h1>
          <p className="mt-4 text-sm text-black/56 sm:text-base">Last Updated: May 12, 2026</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
        <div className="space-y-10">
          {cookieSections.slice(0, 2).map((section) => (
            <article key={section.title} className="rounded-4xl border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,246,242,0.96))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{section.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-black/70 sm:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}

          <article className="rounded-4xl border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,246,242,0.96))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">3. Specific Cookies Deployed</h2>
            <p className="mt-4 text-sm leading-7 text-black/70 sm:text-base">Below is a breakdown of the primary cookies utilized on our platform:</p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm text-black/70">
                <thead>
                  <tr className="border-b border-black/10 text-xs uppercase tracking-[0.22em] text-black/45">
                    <th className="py-3 pr-4 font-semibold">Name</th>
                    <th className="py-3 pr-4 font-semibold">Provider</th>
                    <th className="py-3 pr-4 font-semibold">Purpose</th>
                    <th className="py-3 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieRows.map((row) => (
                    <tr key={row.name} className="border-b border-black/8 last:border-0">
                      <td className="py-4 pr-4 font-medium text-black">{row.name}</td>
                      <td className="py-4 pr-4">{row.provider}</td>
                      <td className="py-4 pr-4">{row.purpose}</td>
                      <td className="py-4">{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          {cookieSections.slice(2).map((section) => (
            <article key={section.title} className="rounded-4xl border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,246,242,0.96))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{section.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-black/70 sm:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}

          <article className="rounded-4xl border border-black/8 bg-black p-6 text-white shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">6. Contact Information</h2>
            <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">For technical inquiries regarding data storage, privacy, or cookie deployment, please contact our compliance team:</p>
            <p className="mt-4 text-base font-medium">Elevate Ecommerce Synergies</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <a href="tel:+918828287278" className="rounded-2xl border border-white/12 bg-white/6 px-5 py-4 transition hover:bg-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-white/54">Phone</p>
                <p className="mt-2 text-base font-medium">+91 8828287278</p>
              </a>
              <a href="mailto:care@enviteyou.com" className="rounded-2xl border border-white/12 bg-white/6 px-5 py-4 transition hover:bg-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-white/54">Email</p>
                <p className="mt-2 text-base font-medium">care@enviteyou.com</p>
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
