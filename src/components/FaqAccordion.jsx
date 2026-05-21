"use client";

import { useState } from "react";

const faqItems = [
  {
    question:
      "Do I need to be a tech genius or know how to code to use this?",
    answer:
      "Not at all. If you can order food online or upload a picture to Instagram, you’re overqualified to use our platform. No coding, no software downloads - just a simple, step-by-step form to fill out.",
  },
  {
    question: "How exactly do I add my details to the template?",
    answer:
      "We’ve built a form that’s easier to fill out than a coffee shop loyalty card. Just type in your names, event dates, and venue, and watch the website update automatically. (Note: The level of customization depends on the plan you choose!)",
  },
  {
    question: "Be honest, how long does it take to make?",
    answer:
      "About 10 minutes. Honestly, it will probably take you longer to agree on which couple's photo to upload than it will to actually create the invite.",
  },
  {
    question: "Will my grandparents actually know how to open this?",
    answer:
      "Absolutely. If they can forward a floral 'Good Morning' message on WhatsApp, they can open this invite. There are no apps to install or passwords to forget - just one link that opens beautifully on any smartphone.",
  },
  {
    question:
      "Why should I use this instead of just sending a WhatsApp video?",
    answer:
      "Because a 50MB video eats up phone storage, buffers endlessly on bad Wi-Fi, and is impossible to search when your uncle is lost on the highway. Our invites load instantly and feature clickable Google Maps links, so your guests actually find the venue on time.",
  },
  {
    question: "Can I add my own background music?",
    answer:
      "Yes! Because an Indian wedding without a dramatic background score is just a corporate meeting. Pick a track from our library or upload your favorite .MP3 file to set the perfect mood.",
  },
  {
    question: "Will I get a custom web link (domain name)?",
    answer:
      "Our standard plans come with a clean, free link (like enviteyou.com/invitations/RahulWedsPriya). Want to go full VIP? Upgrade to our custom plan to get your very own domain (like RahulWedsPriya.in), subject to availability and pricing.",
  },
  {
    question:
      "The Baraat time just changed. Can I edit the invite after I’ve shared the link?",
    answer:
      "Because the Baraat is never actually on time, right? Our higher-tier plans allow you to make live edits even after the link is sent out. Our basic plan locks the details once generated—so choose based on how unpredictable your schedule is!",
  },
  {
    question:
      "Is there an expiry date? Will the website disappear after the wedding?",
    answer:
      "No expiry date here. You get lifetime access! Your website stays online as a digital memory box of your big day, long after the last piece of mithai is eaten.",
  },
  {
    question:
      "Do you make completely custom, one-of-a-kind invites from scratch?",
    answer:
      "We do. For couples who want a website as unique as their love story, we offer a bespoke service. No templates, no pre-made libraries - just a premium, custom-designed experience that includes a proper domain name.",
  },
  {
    question:
      "How do I share this with my guests, and how do they view it?",
    answer:
      "We give you one simple link. Drop it in WhatsApp, email it, or text it. Guests just tap the link and it instantly opens like a premium website in their phone’s browser - no zooming or squinting required.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Since this is a digital product with instant access, all sales are final and non-refundable. Please double-check the template details before you hit buy. If you’re unsure about anything, just drop us a message before checking out!",
  },
  {
    question:
      "I love these templates. Can I buy them and re-sell them to others?",
    answer:
      "We’ll keep this one strictly legal: No. These templates are protected under copyright and intellectual property laws. Reselling, modifying, or reverse-engineering them is strictly prohibited and will lead to serious legal action. We put a lot of heart into designing these - please don't make us send our lawyers.",
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
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-3xl">Questions ? <br /> Answers.</h2>

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
