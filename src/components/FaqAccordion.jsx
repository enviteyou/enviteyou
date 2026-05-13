"use client";

import { useState } from "react";

const faqGroups = [
  {
    heading: "How Does This Work?",
    items: [
      {
        question: "Do I need to be a tech genius or know how to code to use this?",
        answer:
          "Not at all. If you can order food online or upload a picture to Instagram, you’re overqualified to use our platform. No coding, no software downloads, just a simple, step-by-step form to fill out.",
      },
      {
        question: "How exactly do I add my details to the template?",
        answer:
          "We’ve built a form that’s easier to fill out than a coffee shop loyalty card. Just type in your names, event dates, and venue, and watch the website update automatically. The level of customization depends on the plan you choose.",
      },
      {
        question: "Be honest, how long does it take to make?",
        answer:
          "About 10 minutes. Honestly, it will probably take you longer to agree on which couple's photo to upload than it will to actually create the invite.",
      },
      {
        question: "Will my grandparents actually know how to open this?",
        answer:
          "Absolutely. If they can forward a floral 'Good Morning' message on WhatsApp, they can open this invite. There are no apps to install or passwords to forget, just one link that opens beautifully on any smartphone.",
      },
    ],
  },
  {
    heading: "The Features & Perks",
    items: [
      {
        question: "Why should I use this instead of just sending a WhatsApp video?",
        answer:
          "Because a 50MB video eats up phone storage, buffers endlessly on bad Wi-Fi, and is impossible to search when your uncle is lost on the highway. Our invites load instantly and feature clickable Google Maps links, so your guests actually find the venue on time.",
      },
      {
        question: "Can I add my own background music?",
        answer:
          "Yes. Because an Indian wedding without a dramatic background score is just a corporate meeting. Pick a track from our library or upload your favorite .MP3 file to set the perfect mood.",
      },
      {
        question: "Will I get a custom web link (domain name)?",
        answer: (
          <>
            Our standard plans come with a clean, free link like{" "}
            <a
              href="https://enviteyou.com/invitations/RahulWedsPriya"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-black underline decoration-black/25 underline-offset-4 transition hover:decoration-black"
            >
              enviteyou.com/invitations/RahulWedsPriya
            </a>
            . Want to go full VIP? Upgrade to our custom plan to get your very own domain like RahulWedsPriya.in,
            subject to availability and pricing.
          </>
        ),
      },
      {
        question: "The Baraat time just changed. Can I edit the invite after I’ve shared the link?",
        answer:
          "Because the Baraat is never actually on time, right? Our higher-tier plans allow you to make live edits even after the link is sent out. Our basic plan locks the details once generated, so choose based on how unpredictable your schedule is.",
      },
      {
        question: "Is there an expiry date? Will the website disappear after the wedding?",
        answer:
          "No expiry date here. You get lifetime access. Your website stays online as a digital memory box of your big day, long after the last piece of mithai is eaten.",
      },
      {
        question: "Do you make completely custom, one-of-a-kind invites from scratch?",
        answer:
          "We do. For couples who want a website as unique as their love story, we offer a bespoke service. No templates, no pre-made libraries, just a premium, custom-designed experience that includes a proper domain name.",
      },
    ],
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium leading-7 text-black sm:text-lg">{item.question}</span>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/5 transition duration-300 ${
            isOpen ? "rotate-180 bg-black text-white" : "text-black/65"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden px-5 pb-5 sm:px-6">
          <div className="h-px w-full bg-linear-to-r from-transparent via-black/10 to-transparent" />
          <div className="pt-4 text-sm leading-7 text-black/68 sm:text-base">{item.answer}</div>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion() {
  const [openKey, setOpenKey] = useState("How Does This Work?|0");

  return (
    <section className="relative overflow-hidden border-y border-black/8 bg-[linear-gradient(180deg,rgba(248,246,242,0.9),rgba(255,255,255,1))]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_68%)] blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.18),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">FAQ</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">The “How Does This Work?” Section</h2>
          <p className="mt-4 text-sm leading-7 text-black/58 sm:text-base">
            Clear answers, playful wording, and the details your guests and buyers will want before they pick a plan.
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {faqGroups.map((group) => (
            <div key={group.heading} className="space-y-5">
              <h3 className="text-lg font-semibold tracking-tight text-black sm:text-2xl">{group.heading}</h3>
              <div className="space-y-4">
                {group.items.map((item, index) => {
                  const key = `${group.heading}|${index}`;

                  return (
                    <AccordionItem
                      key={item.question}
                      item={item}
                      isOpen={openKey === key}
                      onToggle={() => setOpenKey((current) => (current === key ? "" : key))}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}