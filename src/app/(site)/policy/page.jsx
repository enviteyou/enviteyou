const policySections = [
	{
		title: "1. Intellectual Property & Copyright",
		body: [
			"All templates, designs, graphics, and digital assets available on EnviteYou are the exclusive intellectual property of Elevate Ecommerce Synergies.",
			"They are protected under the Indian Copyright Act, 1957, the Trademarks Act, 1999, and applicable international laws.",
			"Strict prohibition: Any unauthorized attempt to copy, resell, modify, distribute, reverse-engineer, sub-license, or share our templates, whether for free or for profit, is strictly prohibited.",
			"Enforcement: We actively monitor for unauthorized usage. Violations will result in immediate legal action, including civil damages and criminal prosecution under Indian jurisdiction.",
		],
	},
	{
		title: "2. License to Use Templates",
		body: [
			"Upon purchasing a template from EnviteYou, you are granted a non-exclusive, non-transferable, single-use license.",
			"The template may only be edited and used for one personal event, such as a single wedding, corporate event, or party.",
			"You may not use the digital invite for multiple events or commercial resale.",
		],
	},
	{
		title: "3. Information We Collect",
		body: [
			"We collect only the essential data required to provide our digital services and process your orders.",
			"Personal data includes your full name, email address, and phone number.",
			"Event data includes details related to your event, such as dates, venues, schedules, and names, added to the digital invitation.",
			"Billing information is collected for invoicing and payment processing.",
		],
	},
	{
		title: "4. How We Use Your Data",
		body: [
			"Your data is strictly utilized to deliver and manage your digital invitation.",
			"We use it to process secure payments, issue invoices, provide customer support, and send technical updates.",
			"We also use it to comply with Indian and international tax, legal, and anti-fraud regulations.",
			"We never sell, rent, or trade your personal data to third-party marketing or advertising agencies.",
		],
	},
	{
		title: "5. Payment Security",
		body: [
			"All transactions are processed through secure, globally recognized payment gateways that comply with PCI-DSS, RBI guidelines, and international payment regulations.",
			"Elevate Ecommerce Synergies does not collect, process, or store your credit card numbers or banking passwords on our servers.",
		],
	},
	{
		title: "6. Data Security & Retention",
		body: [
			"We implement industry-standard security measures, including SSL encryption, to protect your data during transmission and storage.",
			"Your data is retained only for as long as necessary to keep your invitation active and to comply with statutory legal and tax obligations.",
		],
	},
	{
		title: "7. Refund Policy",
		body: [
			"Because our platform provides immediate access to digital products and proprietary templates, all sales are final and non-refundable.",
			"Please review your selected template and plan details carefully before completing your purchase.",
		],
	},
];

export default function PolicyPage() {
	return (
		<main className="bg-white text-black">
			<section className="relative overflow-hidden border-b border-black/8">
				<div className="pointer-events-none absolute inset-0">
					<div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_68%)] blur-3xl" />
					<div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.2),transparent_70%)] blur-3xl" />
				</div>

				<div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">EnviteYou</p>
					<h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Privacy Policy & Terms of Use</h1>
					<p className="mt-4 text-sm text-black/56 sm:text-base">Last Updated: May 12, 2026</p>
					<p className="mt-8 max-w-3xl text-base leading-8 text-black/72 sm:text-lg">
						At EnviteYou, operated by Elevate Ecommerce Synergies, we are committed to protecting your privacy,
						securing your personal data, and strictly enforcing our intellectual property rights. This policy outlines
						how we collect, use, and protect your information, as well as the legal terms of using our digital products.
					</p>
				</div>
			</section>

			<section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
				<div className="space-y-10">
					{policySections.map((section) => (
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
						<h2 className="text-xl font-semibold tracking-tight sm:text-2xl">8. Contact Us</h2>
						<p className="mt-4 text-sm leading-7 text-white/78 sm:text-base">
							If you have any questions regarding this Privacy Policy, your data, or legal compliance, please contact
							us using the details below.
						</p>
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
