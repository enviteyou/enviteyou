const privacySections = [
  {
    title: "1. Information We Collect",
    body: [
      "At EnviteYou (operated by Elevate Ecommerce Synergies), we collect information necessary to provide seamless digital invitation customization, vendor management, and photo selection services. This includes:",
      "Personal Identity & Contact Data: Name, email address, phone number, and billing details provided when creating an account, placing an order, or registering as a partner vendor.",
      "Customization & Media Assets: Event details (e.g. bride & groom names, event dates, venues), uploaded photos, guest lists, and template preferences required to render your customized digital invitations and photo selection galleries.",
      "Technical & Usage Data: IP address, browser type, operating system, access timestamps, and interaction metrics collected automatically via secure server logs and technical cookies.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "We process your data strictly to fulfill service requests and maintain platform integrity. Primary use cases include:",
      "Generating and serving customized digital invitations, web pages, and digital photo albums.",
      "Facilitating secure online payments through authorized payment processors (including Razorpay and Stripe).",
      "Enabling vendor-client collaboration, photo selection tracking, and digital asset delivery.",
      "Sending transactional confirmations, account alerts, and customer support communications.",
      "Protecting against fraudulent activity, unauthorized access, and legal non-compliance.",
    ],
  },
  {
    title: "3. Data Protection & Security",
    body: [
      "We implement industry-standard administrative, technical, and physical security measures to safeguard your personal data against unauthorized access, loss, alteration, or disclosure. All data transmissions are encrypted using Secure Sockets Layer (SSL/TLS) technology.",
      "Uploaded media assets and preview images are processed securely using encrypted cloud infrastructure (such as Cloudinary) with restricted access policies.",
    ],
  },
  {
    title: "4. Information Sharing & Disclosure",
    body: [
      "We do NOT sell, trade, or rent your personal information to third parties for marketing purposes. Data is shared only with trusted service providers under strict data processing agreements required for platform operation:",
      "Payment Gateways: Razorpay and Stripe for secure transaction processing.",
      "Cloud Hosting & Infrastructure: Secure cloud infrastructure providers for data storage and content delivery.",
      "Legal & Regulatory Authorities: When required by applicable law, subpoena, court order, or government regulation.",
    ],
  },
  {
    title: "5. Your Rights & Choices",
    body: [
      "You have full control over your personal information stored on EnviteYou:",
      "Access & Correction: You may view and update your profile details and saved invitations at any time through your account dashboard.",
      "Data Deletion: You can request the permanent removal of your account, customized invitations, or uploaded photos by contacting our support team.",
      "Communication Preferences: You can opt out of non-essential promotional communications at any time.",
    ],
  },
  {
    title: "6. Children's Privacy",
    body: [
      "Our services are designed for adult event hosts and professional vendors. We do not knowingly collect personal data from individuals under the age of 18 without parental consent.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-black">
      <section className="relative overflow-hidden border-b border-black/8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_68%)] blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.2),transparent_70%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">EnviteYou</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-black/56 sm:text-base">Last Updated: May 12, 2026</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
        <div className="space-y-10">
          {privacySections.map((section) => (
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
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">7. Contact Information</h2>
            <p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">
              If you have any questions, concerns, or requests regarding this Privacy Policy or how your data is handled, please reach out to our privacy team:
            </p>
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
