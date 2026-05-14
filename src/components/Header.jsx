"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TRANSLATIONS = {
  en: {
    howItWorks: "HOW IT WORKS",
    testimonials: "TESTIMONIALS",
    pricing: "PRICING",
    blog: "BLOG",
    ourStory: "OUR STORY",
    getInTouch: "GET IN TOUCH",
    pricingBtn: "PRICING",
  },
  es: {
    howItWorks: "COMO FUNCIONA",
    testimonials: "TESTIMONIOS",
    pricing: "PRECIOS",
    blog: "BLOG",
    ourStory: "NUESTRA HISTORIA",
    getInTouch: "CONTACTO",
    pricingBtn: "PRECIOS",
  },
  fr: {
    howItWorks: "FONCTIONNEMENT",
    testimonials: "TEMOIGNAGES",
    pricing: "TARIFS",
    blog: "BLOG",
    ourStory: "NOTRE HISTOIRE",
    getInTouch: "CONTACT",
    pricingBtn: "TARIFS",
  },
};

const CURRENCIES = [
  { code: "USD", label: "USD" },
  { code: "EUR", label: "EUR" },
  { code: "GBP", label: "GBP" },
  { code: "INR", label: "INR" },
];

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
];

export default function Header() {
  const [language, setLanguage] = useState("EN");
  const [currency, setCurrency] = useState("INR");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setLanguage(localStorage.getItem("envite-language") || "EN");
      setCurrency(localStorage.getItem("envite-currency") || "INR");
    });
  }, []);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const navItems = [
    { label: t.howItWorks, href: "/how-it-works" },
    { label: t.testimonials, href: "/#testimonials" },
    { label: t.blog, href: "/#blog" },
    { label: t.ourStory, href: "/about" },
    { label: t.getInTouch, href: "mailto:care@enviteyou.com" },
  ];

  const mobileNavItems = [
    ...navItems.slice(0, 2),
    { label: t.pricing, href: "/pricing" },
    ...navItems.slice(2),
  ];

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("envite-language", newLang);
    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: newLang } }));
  };

  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    localStorage.setItem("envite-currency", newCurr);
    window.dispatchEvent(new CustomEvent("currencyChange", { detail: { currency: newCurr } }));
  };

  return (
    <header className="sticky top-2 z-50 px-3 py-2 text-black sm:top-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-sm border border-black/8 bg-white/86 px-3 py-2 shadow-[0_18px_60px_rgba(70,35,25,0.12)] backdrop-blur-xl sm:px-5 lg:px-7">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-5">
          <Link href="/" className="flex min-w-0 shrink items-center pr-1 lg:pr-6" aria-label="EnviteYou home">
            <Image
              src="/logo.png"
              alt="EnviteYou Logo"
              width={160}
              height={80}
              priority
              className="h-8 w-auto max-w-21.5 sm:h-12 sm:max-w-37.5"
            />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-6 border-l border-r border-black/8 px-6 lg:flex xl:gap-8" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="whitespace-nowrap text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[#74313d]/76 transition hover:text-[#74313d] xl:text-[0.7rem]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-3">
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger
                aria-label="Select currency"
                className="hidden h-9 w-18.5 rounded-full border border-black/10 bg-white px-2 text-[0.68rem] font-semibold text-black/72 outline-none transition hover:border-black/20 sm:inline-flex sm:px-3 sm:text-xs shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 [&>svg]:opacity-60"
              >
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent className="min-w-20 rounded-xl border border-black/10 bg-white shadow-lg z-[9999]" side="bottom" align="end">
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code} className="cursor-pointer rounded-lg text-[0.68rem] font-semibold text-black/72 focus:bg-black/5 focus:text-black sm:text-xs">
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger
                aria-label="Select language"
                className="hidden h-9 w-17.5 rounded-full border border-black/10 bg-white px-2 text-[0.68rem] font-semibold text-black/72 outline-none transition hover:border-black/20 sm:inline-flex sm:px-3 sm:text-xs shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 [&>svg]:opacity-60"
              >
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="min-w-20 rounded-xl border border-black/10 bg-white shadow-lg z-[9999]" side="bottom" align="end">
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="cursor-pointer rounded-lg text-[0.68rem] font-semibold text-black/72 focus:bg-black/5 focus:text-black sm:text-xs">
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Link
              href="/pricing"
              className="hidden h-9 items-center justify-center rounded-full border border-black bg-black px-3 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_26px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-black/90 sm:px-5 sm:text-xs lg:inline-flex"
            >
              {t.pricingBtn}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/72 transition hover:border-black/20 lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="relative h-3.5 w-4" aria-hidden="true">
                <span className={`absolute left-0 top-0 h-0.5 w-full bg-current transition ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
                <span className={`absolute left-0 top-1.5 h-0.5 w-full bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 top-3 h-0.5 w-full bg-current transition ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`grid overflow-hidden transition-all duration-300 lg:hidden ${menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        >
          <nav className="min-h-0" aria-label="Mobile navigation">
            <div className="space-y-2 px-1 pb-2 pt-3">
              {mobileNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-wide text-black/72 transition hover:border-black/20 hover:bg-black/[0.03] hover:text-black"
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-2 grid grid-cols-2 gap-2 sm:hidden border-t border-[#74313d]/10 pt-2">
                <Select value={currency} onValueChange={handleCurrencyChange}>
                  <SelectTrigger
                    aria-label="Select currency mobile"
                    className="h-10 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm font-semibold text-black/72 outline-none transition hover:border-black/20 shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
                  >
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent className="min-w-30 rounded-xl border border-black/10 bg-white shadow-lg z-[9999]">
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code} className="cursor-pointer rounded-lg text-sm font-semibold text-black/72 focus:bg-black/5 focus:text-black">
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger
                    aria-label="Select language mobile"
                    className="h-10 w-full rounded-2xl border border-black/10 bg-white px-3 text-sm font-semibold text-black/72 outline-none transition hover:border-black/20 shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
                  >
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="min-w-30 rounded-xl border border-black/10 bg-white shadow-lg z-[9999]">
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code} className="cursor-pointer rounded-lg text-sm font-semibold text-black/72 focus:bg-black/5 focus:text-black">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
