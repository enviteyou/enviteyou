const refundSections = [
  {
    title: "1. Digital Goods Standard",
    body: [
      "EnviteYou provides instantly accessible digital templates and software-as-a-service (SaaS) products. Due to the immediate, non-returnable nature of these digital assets, all sales are strictly final.",
    ],
  },
  {
    title: "2. No Refunds or Cancellations",
    body: [
      "Once a purchase is completed and access to the digital template or platform is granted, we do not offer refunds, cancellations, or exchanges under any circumstances. This policy applies globally to all transactions, regardless of the currency used (including INR, USD, or any other supported currency).",
    ],
  },
  {
    title: "3. Exceptions for Technical Failure",
    body: [
      "A refund will only be considered under the following strict conditions:",
      "A verified technical error on our platform prevents you from accessing your purchased template entirely.",
      "You have contacted our support team regarding the issue, and we are unable to resolve the technical failure within a reasonable timeframe (48 business hours).",
      "Note: Inability to use the template due to a lack of personal technical understanding or changing your mind does not qualify as a technical failure.",
    ],
  },
  {
    title: "4. Chargebacks and Disputes",
    body: [
      "We maintain comprehensive logs of IP addresses, access timestamps, and usage data. Any illegitimate chargebacks or payment disputes filed for validly delivered digital purchases will be aggressively contested. We will provide all necessary evidence of digital delivery to the payment gateway and relevant financial institutions.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <main className="bg-white text-black">
      <section className="relative overflow-hidden border-b border-black/8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_68%)] blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.2),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">EnviteYou</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Refund & Cancellation Policy</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
        <div className="space-y-10">
          {refundSections.map((section) => (
            <article key={section.title} className="rounded-4xl border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,246,242,0.96))] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.05)] sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{section.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-black/70 sm:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
