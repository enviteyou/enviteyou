const termsSections = [
  {
    title: "1. Intellectual Property & Copyright",
    body: [
      "All templates, designs, code, graphics, and digital assets available on EnviteYou are the exclusive intellectual property of Elevate Ecommerce Synergies.",
      "Our assets are strictly protected under the Indian Copyright Act, 1957, the Trademarks Act, 1999, and applicable international intellectual property laws.",
      "Strict Prohibition: Any unauthorized attempt to copy, resell, modify, distribute, reverse-engineer, sub-license, or share our templates (in whole or in part) is strictly prohibited and will result in immediate civil damages and criminal prosecution.",
    ],
  },
  {
    title: "2. License and Acceptable Use",
    body: [
      "Upon purchasing a digital template:",
      "You receive a non-exclusive, non-transferable, single-use license.",
      "The template may be edited and used for one single personal event (e.g., one wedding or one corporate gathering).",
      "You may not use the digital invite for multiple events, nor can you resell the digital link or template structure to third parties.",
    ],
  },
  {
    title: "3. User Responsibilities",
    body: [
      "You are solely responsible for the accuracy of the content (dates, names, venues) and the legality of the media (images, music) you upload to your digital invitation. EnviteYou reserves the right to suspend any digital link that contains offensive, illegal, or inappropriate content.",
    ],
  },
  {
    title: "4. Payments and Billing",
    body: [
      "All prices are displayed on the website and are subject to change. Payments are processed securely via third-party gateways (Razorpay/Stripe). By submitting payment information, you authorize us to charge the applicable fees for your selected digital product or subscription tier.",
    ],
  },
  {
    title: "5. Refund & Cancellation Policy",
    body: [
      "Because EnviteYou provides instantly accessible digital templates, all sales are strictly final and non-refundable.",
      "We do not offer cancellations, refunds, or exchanges once access to the digital product is granted.",
      "Exceptions are made only in the event of a verified, unresolvable technical failure on our platform that prevents you from accessing your purchase entirely.",
      "Any illegitimate chargebacks filed for validly delivered digital goods will be aggressively disputed with full evidence of delivery.",
    ],
  },
  {
    title: "6. Limitation of Liability",
    body: [
      "EnviteYou and Elevate Ecommerce Synergies shall not be held liable for any indirect, incidental, or consequential damages arising from the use or inability to use our digital templates, including but not limited to event delays, miscommunications with guests, or technical downtime beyond our control.",
    ],
  },
  {
    title: "7. Governing Law and Jurisdiction",
    body: [
      "These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Delhi, India.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="bg-white text-black">
      <section className="relative overflow-hidden border-b border-black/8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_68%)] blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.2),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">EnviteYou</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-sm text-black/56 sm:text-base">Last Updated: May 13, 2026</p>
          <p className="mt-8 max-w-3xl text-base leading-8 text-black/72 sm:text-lg">
            Welcome to EnviteYou. By accessing our website and purchasing our digital products, you agree to be bound by the following Terms of Service. Please read them carefully.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
        <div className="space-y-10">
          {termsSections.map((section) => (
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
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">8. Elevate Ecommerce Synergies</h2>
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
