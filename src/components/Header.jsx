"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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
    howItWorks: "CÓMO FUNCIONA",
    testimonials: "TESTIMONIOS",
    pricing: "PRECIOS",
    blog: "BLOG",
    ourStory: "NUESTRA HISTORIA",
    getInTouch: "CONTÁCTANOS",
    pricingBtn: "PRECIOS",
  },
  fr: {
    howItWorks: "COMMENT ÇA MARCHE",
    testimonials: "TÉMOIGNAGES",
    pricing: "TARIFICATION",
    blog: "BLOG",
    ourStory: "NOTRE HISTOIRE",
    getInTouch: "NOUS CONTACTER",
    pricingBtn: "TARIFICATION",
  },
};

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD" },
  { code: "EUR", symbol: "€", label: "EUR" },
  { code: "GBP", symbol: "£", label: "GBP" },
];

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
];

export default function Header() {
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("envite-language") || "en";
    const savedCurr = localStorage.getItem("envite-currency") || "USD";
    setLanguage(savedLang);
    setCurrency(savedCurr);
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("envite-language", newLang);
    // Optionally dispatch custom event for other components to listen
    window.dispatchEvent(
      new CustomEvent("languageChange", { detail: { language: newLang } })
    );
  };

  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    localStorage.setItem("envite-currency", newCurr);
    window.dispatchEvent(
      new CustomEvent("currencyChange", { detail: { currency: newCurr } })
    );
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS["en"];

  if (!mounted) return null;

  return (
    <header className="border-b border-black/8 bg-white px-5 sm:px-8 lg:px-10 py-4">
      <div className="mx-auto flex items-center justify-between gap-8 max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center">
            <svg className="h-6 w-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide text-black hidden sm:inline">ENVITE</span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          <a href="#how-it-works" className="text-sm font-medium text-black/70 transition hover:text-black uppercase tracking-wide">{t.howItWorks}</a>
          <a href="#testimonials" className="text-sm font-medium text-black/70 transition hover:text-black uppercase tracking-wide">{t.testimonials}</a>
          <a href="#pricing" className="text-sm font-medium text-black/70 transition hover:text-black uppercase tracking-wide">{t.pricing}</a>
          <a href="#blog" className="text-sm font-medium text-black/70 transition hover:text-black uppercase tracking-wide">{t.blog}</a>
          <a href="#about" className="text-sm font-medium text-black/70 transition hover:text-black uppercase tracking-wide">{t.ourStory}</a>
          <a href="#contact" className="text-sm font-medium text-black/70 transition hover:text-black uppercase tracking-wide">{t.getInTouch}</a>
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6 shrink-0">
          {/* Currency Selector */}
          <div className="hidden sm:flex items-center">
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="text-xs font-medium text-black/70 bg-transparent cursor-pointer transition hover:text-black appearance-none px-1"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="hidden sm:flex items-center">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="text-xs font-medium text-black/70 bg-transparent cursor-pointer transition hover:text-black appearance-none px-1"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing Button */}
          <button className="rounded-full border-2 border-black bg-black px-5 py-2 text-xs font-semibold text-white transition duration-300 hover:bg-white hover:text-black hover:shadow-lg uppercase tracking-wide">
            {t.pricingBtn}
          </button>
        </div>
      </div>
    </header>
  );
}
