const shippingSections = [
  {
    title: "1. Digital Delivery & Instant Access",
    body: [
      "Upon the successful completion of your payment, your order is fulfilled immediately. You will be instantly redirected to a confirmation page on our platform, which will include the direct access or preview link to your purchased digital template.",
    ],
  },
  {
    title: "2. Email Confirmation",
    body: [
      "In addition to instant on-screen access, an automated confirmation email will be sent to the email address you provided during checkout. This email will contain:",
      "The direct link to access, edit, or manage your digital invitation.",
    ],
  },
  {
    title: "3. No Physical Shipping",
    body: [
      "EnviteYou does not sell physical goods. Therefore:",
      "No physical items (such as paper cards, USB drives, or printed materials) will be shipped to your postal address.",
      "There are no shipping fees, handling charges, or physical delivery timeframes to track.",
      "No physical logistics or courier services are involved in our fulfillment process.",
    ],
  },
  {
    title: "4. Access Issues & Troubleshooting",
    body: [
      "Digital delivery is typically instantaneous. However, if you do not receive your access link or email confirmation within 5 to 10 minutes of a successful payment:",
      "Please check your email's Spam, Junk, or Promotions folders.",
      "Ensure that the email address provided at checkout was spelled correctly.",
      "If you still cannot locate your access link, please contact our support team immediately so we can manually verify your payment and resend your access link.",
    ],
  },
];

export default function ShippingPolicyPage() {
  return (
    <main className="bg-white text-black">
      <section className="relative overflow-hidden border-b border-black/8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_68%)] blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.2),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">EnviteYou</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Shipping Policy</h1>
          <p className="mt-4 text-sm text-black/56 sm:text-base">Last Updated: May 12, 2026</p>
          <p className="mt-8 max-w-3xl text-base leading-8 text-black/72 sm:text-lg">
            At EnviteYou (operated by Elevate Ecommerce Synergies), we specialize in digital templates and online event management tools. Because our offerings are 100% digital, our delivery process is instant and entirely paperless.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
        <div className="space-y-10">
          {shippingSections.map((section) => (
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
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Contact Support</h2>
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
