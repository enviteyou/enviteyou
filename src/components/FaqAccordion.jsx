"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "Do I need a software to edit these templates?",
    answer:
      "No. EnviteYou works directly in your browser. You can add your names, event details, venue, photos, and RSVP information without coding or installing software.",
  },
  {
    question: "What is EnviteYou?",
    answer:
      "EnviteYou is a digital wedding invitation platform for creating elegant wedding invite websites that can be shared with guests through a simple link.",
  },
  {
    question: "Will this open like a website?",
    answer:
      "Yes. Your invite opens like a mobile-friendly website in any modern browser, so guests do not need to download an app.",
  },
  {
    question: "What if I want to separate guests to separate events?",
    answer:
      "Higher-tier plans can support multiple event sections and guest-specific RSVP flows, depending on the setup you choose.",
  },
  {
    question: "How do I get started?",
    answer:
      "Choose a template or pricing plan, complete your purchase, and add your wedding details. Your digital invitation link is delivered online.",
  },
  {
    question: "How long does it take to edit the invite?",
    answer:
      "Most couples can complete the basic invite details in minutes. Custom or bespoke experiences can take longer depending on the design scope.",
  },
  {
    question: "What happens after I buy the template?",
    answer:
      "After successful payment, you receive digital access to your purchased invitation template or setup flow.",
  },
  {
    question: "Can I purchase now and use it later?",
    answer:
      "Yes. You can purchase your digital invite and complete the details when you are ready.",
  },
  {
    question: "Can I purchase it using my phone?",
    answer:
      "Yes. EnviteYou is built mobile-first, so you can browse, purchase, and manage your invite from your phone.",
  },
  {
    question: "Is there an expiry to the template?",
    answer:
      "Template access depends on your selected plan and purchase terms. Your invite is delivered digitally after payment.",
  },
  {
    question: "Will I need to buy a domain name?",
    answer:
      "No, standard plans include a clean EnviteYou link. Custom domains can be discussed for bespoke plans.",
  },
  {
    question: "How do I add my details in the template?",
    answer:
      "You add your details through a simple form or guided setup. The invitation content is then updated for your guests to view.",
  },
  {
    question: "Can I add music?",
    answer:
      "Yes, music can be added depending on the selected plan and browser support for guest playback.",
  },
  {
    question: "What's included in the template?",
    answer:
      "Templates can include event details, couple story, gallery, venue links, RSVP, schedule, and mobile sharing features depending on your plan.",
  },
];

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-black/18">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 py-2.5 text-left text-black/80 transition hover:text-black/70 sm:gap-4 sm:py-3"
        aria-expanded={isOpen}
      >
        <span className="relative mt-1 h-4 w-4 shrink-0" aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 h-px w-3.5 -translate-x-1/2 -translate-y-1/2 bg-current" />
          <span
            className={`absolute left-1/2 top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 bg-current transition duration-200 ${
              isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
        </span>
        <span className="text-[12px] font-medium text-black/80 leading-5 sm:text-[17px] sm:leading-6">{item.question}</span>
      </button>

      <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
          <p className="pb-3 pl-7 text-[13px] leading-5 text-black/58 sm:pl-8 sm:text-[15px] sm:leading-6">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion() {
  const [openKeys, setOpenKeys] = useState([]);

  const toggleItem = (index) => {
    setOpenKeys((current) =>
      current.includes(index) ? current.filter((key) => key !== index) : [...current, index]
    );
  };

  return (
    <section id="faq" className="bg-white text-black">
      <div className="mx-auto max-w-2xl px-5 py-18 sm:px-8 lg:py-16">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-3xl">Questions ? Answers.</h2>

        <div className="mt-8">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.question}
              item={item}
              isOpen={openKeys.includes(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
