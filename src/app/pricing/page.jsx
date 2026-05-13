"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const plans = [
  {
    name: "Essential",
    tag: "Instant digital invite",
    price: 1499,
    timeline: "Ready in minutes",
    description: "A refined one-page invitation for couples who want a beautiful link without extra setup.",
    features: [
      "Premium editable template",
      "Event date, venue, gallery, and story sections",
      "Mobile-first invite link",
      "Basic RSVP collection",
      "Secure digital delivery",
    ],
    accent: "from-[#f7efe4] to-[#fffaf3]",
    cta: "Start Essential",
  },
  {
    name: "Signature",
    tag: "Most chosen",
    price: 2999,
    timeline: "Best for full wedding flow",
    description: "A cinematic invitation suite with RSVP, itinerary, guest guidance, and a polished couple story.",
    features: [
      "Everything in Essential",
      "Multi-event wedding schedule",
      "Guest RSVP with meal or attendance notes",
      "Photo gallery and couple timeline",
      "WhatsApp sharing preview",
      "Priority support for setup",
    ],
    accent: "from-[#111111] to-[#3a332d]",
    featured: true,
    cta: "Choose Signature",
  },
  {
    name: "Bespoke",
    tag: "Custom experience",
    price: 6999,
    timeline: "Personalized build",
    description: "A made-for-you digital wedding presence with custom sections, motion, copy, and hand-tuned details.",
    features: [
      "Everything in Signature",
      "Custom visual direction",
      "Advanced animations and transitions",
      "Custom guest instructions or travel page",
      "Music, video, or countdown integration",
      "Launch support and final polish",
    ],
    accent: "from-[#e9d7be] to-[#fdf5ea]",
    cta: "Plan Bespoke",
  },
];

const comparisonRows = [
  ["Premium template", "Yes", "Yes", "Custom"],
  ["Mobile invite link", "Yes", "Yes", "Yes"],
  ["RSVP collection", "Basic", "Advanced", "Advanced"],
  ["Multiple wedding events", "1 event", "Up to 5 events", "Custom"],
  ["Gallery and story", "Basic", "Enhanced", "Custom"],
  ["Animation level", "Elegant", "Cinematic", "Bespoke"],
  ["Support", "Standard", "Priority", "Launch support"],
];

const addOns = [
  { name: "Extra Event Page", price: 499, text: "Add haldi, sangeet, reception, or after-party details." },
  { name: "Guest Travel Guide", price: 999, text: "Hotels, map notes, airport info, and arrival guidance." },
  { name: "Custom Music Setup", price: 799, text: "Add a romantic track, intro sound, or soft ambient music." },
  { name: "Express Polish", price: 1299, text: "Priority content update and visual review before launch." },
];

const notes = [
  "All plans are one-time purchases for one personal event.",
  "Access is delivered digitally after successful payment.",
  "Final pricing can vary for highly custom animation or content requests.",
  "Payments are processed through secure third-party gateways.",
];

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState("Signature");
  const [guestCount, setGuestCount] = useState(150);

  const selected = useMemo(
    () => plans.find((plan) => plan.name === selectedPlan) || plans[1],
    [selectedPlan]
  );

  const guestBand = guestCount <= 100 ? "intimate" : guestCount <= 250 ? "classic" : "grand";

  return (
    <main className="overflow-hidden bg-[#fffaf5] text-black">
      <section className="relative min-h-[calc(100vh-76px)] border-b border-black/8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#fffaf5_0%,#f3e7d8_48%,#ffffff_100%)]" />
        <div className="absolute left-1/2 top-14 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full border border-black/8 opacity-40 animate-[spin_24s_linear_infinite]" />
        <div className="absolute left-1/2 top-24 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-black/10 opacity-40 animate-[spin_18s_linear_infinite_reverse]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(180deg,transparent,#fffaf5)]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/45">EnviteYou Pricing</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Wedding invite plans that feel premium from the first tap.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-black/68 sm:text-lg">
              Choose an instantly delivered digital template or a bespoke animated invite experience for your wedding events, RSVP flow, and guest details.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="#plans" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-black/90">
                View plans
              </Link>
              <a href="mailto:care@enviteyou.com" className="rounded-full border border-black/12 bg-white/70 px-6 py-3 text-sm font-semibold text-black/76 shadow-[0_14px_34px_rgba(0,0,0,0.06)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-black/24 hover:text-black">
                Ask for custom quote
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2rem] border border-black/8 bg-white/28 shadow-[0_28px_90px_rgba(0,0,0,0.08)] backdrop-blur-xl" />
            <div className="relative rounded-[1.6rem] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
              <div className="aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-[#17120f] text-white">
                <div className="flex h-full flex-col justify-between bg-[radial-gradient(circle_at_30%_20%,rgba(233,215,190,0.32),transparent_34%),linear-gradient(155deg,#17120f,#3a2d25)] p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/48">Selected</p>
                      <h2 className="mt-3 text-4xl font-semibold">{selected.name}</h2>
                    </div>
                    <span className="rounded-full border border-white/18 px-3 py-1 text-xs text-white/76">{guestBand}</span>
                  </div>

                  <div className="space-y-5">
                    <div className="h-px w-full bg-linear-to-r from-transparent via-white/30 to-transparent" />
                    <p className="text-sm leading-7 text-white/70">{selected.description}</p>
                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/45">From</p>
                        <p className="mt-2 text-4xl font-semibold">{formatINR(selected.price)}</p>
                      </div>
                      <div className="text-right text-sm text-white/62">
                        <p>{guestCount} guests</p>
                        <p>{selected.timeline}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {plans.map((plan) => (
                  <button
                    key={plan.name}
                    type="button"
                    onClick={() => setSelectedPlan(plan.name)}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition duration-300 ${
                      selectedPlan === plan.name
                        ? "bg-black text-white shadow-[0_12px_24px_rgba(0,0,0,0.16)]"
                        : "bg-black/5 text-black/62 hover:bg-black/10 hover:text-black"
                    }`}
                  >
                    {plan.name}
                  </button>
                ))}
              </div>

              <label className="mt-5 block">
                <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-black/45">
                  Guest count
                  <span className="tracking-normal text-black/70">{guestCount}</span>
                </span>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="25"
                  value={guestCount}
                  onChange={(event) => setGuestCount(Number(event.target.value))}
                  className="mt-4 w-full accent-black"
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <section id="plans" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">Packages</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Pick your invite experience.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-black/58">
            Every plan includes secure checkout, digital delivery, and a shareable invite link made for mobile guests.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <article
              key={plan.name}
              className={`group relative overflow-hidden rounded-[1.6rem] border p-6 shadow-[0_22px_70px_rgba(0,0,0,0.08)] transition duration-500 hover:-translate-y-2 ${
                plan.featured
                  ? "border-black bg-black text-white lg:scale-[1.03]"
                  : "border-black/8 bg-white text-black"
              }`}
              style={{ animation: `pricingRise 700ms ease ${index * 120}ms both` }}
            >
              <div className={`absolute inset-0 bg-linear-to-br ${plan.accent} ${plan.featured ? "opacity-100" : "opacity-70"}`} />
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full border border-current opacity-10 transition duration-700 group-hover:scale-125" />
              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${plan.featured ? "text-white/55" : "text-black/42"}`}>{plan.tag}</p>
                    <h3 className="mt-4 text-3xl font-semibold">{plan.name}</h3>
                  </div>
                  {plan.featured ? (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">Popular</span>
                  ) : null}
                </div>

                <p className={`mt-5 min-h-20 text-sm leading-7 ${plan.featured ? "text-white/68" : "text-black/62"}`}>{plan.description}</p>

                <div className="mt-7 flex items-end gap-2">
                  <p className="text-4xl font-semibold">{formatINR(plan.price)}</p>
                  <p className={`pb-1 text-sm ${plan.featured ? "text-white/55" : "text-black/45"}`}>one-time</p>
                </div>
                <p className={`mt-2 text-sm ${plan.featured ? "text-white/58" : "text-black/50"}`}>{plan.timeline}</p>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className={`flex gap-3 text-sm leading-6 ${plan.featured ? "text-white/74" : "text-black/68"}`}>
                      <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${plan.featured ? "bg-white" : "bg-black"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="mailto:care@enviteyou.com"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ${
                    plan.featured
                      ? "bg-white text-black hover:bg-white/88"
                      : "bg-black text-white hover:-translate-y-0.5 hover:bg-black/90"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-black/8 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">Compare</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Clear choices, no guesswork.</h2>
              <p className="mt-5 text-sm leading-7 text-black/60">
                Use this quick comparison to match the invite to your wedding scale, event count, and design ambition.
              </p>
            </div>

            <div className="overflow-x-auto rounded-[1.4rem] border border-black/8 bg-[#fffaf5]">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-black/8 text-xs uppercase tracking-[0.22em] text-black/42">
                    <th className="px-5 py-4 font-semibold">Feature</th>
                    <th className="px-5 py-4 font-semibold">Essential</th>
                    <th className="px-5 py-4 font-semibold">Signature</th>
                    <th className="px-5 py-4 font-semibold">Bespoke</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row[0]} className="border-b border-black/8 last:border-0">
                      {row.map((cell, index) => (
                        <td key={`${row[0]}-${index}`} className={`px-5 py-4 ${index === 0 ? "font-semibold text-black" : "text-black/64"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">Add-ons</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Make the invite unmistakably yours.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {addOns.map((item) => (
              <article key={item.name} className="rounded-[1.2rem] border border-black/8 bg-white p-5 shadow-[0_16px_42px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="shrink-0 text-sm font-semibold">{formatINR(item.price)}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-black/62">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/42">Pricing notes</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Simple terms before you launch.</h2>
          </div>
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note} className="rounded-[1.1rem] border border-white/12 bg-white/6 p-5 text-sm leading-7 text-white/72">
                {note}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes pricingRise {
          from {
            opacity: 0;
            transform: translateY(28px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
