"use client";

import Link from "next/link";
import Image from "next/image";
const footerLinks = {
  Templates: ["Classic", "Modern", "Luxury", "Editorial"],
  Services: ["Custom invites", "Branding", "RSVP pages", "Guest support"],
  Studio: ["About", "Journal", "Contact", "Careers"],
};
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/8 bg-white text-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_68%)] blur-3xl" />
        <div className="absolute -right-32 -bottom-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.2),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black text-sm font-semibold tracking-[0.28em] text-white shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
                MP
              </div>
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.35em] text-black/45">Missing Piece</p>
                <p className="text-sm font-medium text-black/85">Wedding invitation templates</p>
              </div>
            </div>

            <p className="mt-6 max-w-md text-sm leading-7 text-black/58 sm:text-base">
              Crafted for couples who want a clean, premium wedding presence with elegant typography, refined motion,
              and a cinematic showcase of invitation designs.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-[0_18px_42px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-black/92">
                Choose a template
              </button>
              <button className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium text-black/75 shadow-[0_14px_34px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:text-black">
                Book a consultation
              </button>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-black/60 sm:grid-cols-2">
              <a href="mailto:care@enviteyou.com" className="rounded-2xl border border-black/8 bg-white px-4 py-3 transition hover:border-black/16 hover:text-black">
                <span className="block text-[0.7rem] uppercase tracking-[0.3em] text-black/40">Email</span>
                <span className="mt-1 block font-medium">care@enviteyou.com</span>
              </a>
              <a href="tel:+918828287278" className="rounded-2xl border border-black/8 bg-white px-4 py-3 transition hover:border-black/16 hover:text-black">
                <span className="block text-[0.7rem] uppercase tracking-[0.3em] text-black/40">Phone</span>
                <span className="mt-1 block font-medium">+91 8828287278</span>
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:gap-14">
            {Object.entries(footerLinks).map(([title, items]) => (
              <div key={title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-black/45">{title}</h2>
                <ul className="mt-5 space-y-3 text-sm text-black/70">
                  {items.map((item) => (
                    <li key={item}>
                      <a href="#" className="transition duration-200 hover:text-black">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-linear-to-r from-transparent via-black/12 to-transparent" />

        <div className="mt-6 flex flex-col gap-4 text-sm text-black/48 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Missing Piece Invites. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="flex items-center gap-2 transition hover:text-black">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M16 11.99a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="18.2" cy="5.8" r="0.6" fill="currentColor" />
                </svg>
                <span className="text-sm">Instagram</span>
              </a>

              <a href="#" aria-label="Pinterest" className="flex items-center gap-2 transition hover:text-black">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 3.05 1.79 5.03 3.04 5.03.29 0 .51-.18.6-.4l.62-2.39c-.16-.64-.28-1.8.08-2.5.45-.9 1.62-1.6 2.66-1.6 3.2 0 5.02 2.27 5.02 5.27 0 2.22-1.02 3.9-2.53 3.9-.86 0-1.5-.72-1.28-1.58.25-.99.74-2.06.74-2.78 0-.64-.34-1.12-1.05-1.12-.8 0-1.44.83-1.44 1.95 0 .71.24 1.18.24 1.18s-.8 3.4-.94 4.02c-.28 1.13-.04 2.51-.03 2.65A7.5 7.5 0 1 0 12 2z" fill="currentColor" />
                </svg>
                <span className="text-sm">Pinterest</span>
              </a>

              <a href="#" aria-label="YouTube" className="flex items-center gap-2 transition hover:text-black">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M23 7.5a3 3 0 0 0-2.12-2.12C19.12 5 12 5 12 5s-7.12 0-8.88.38A3 3 0 0 0 .99 7.5 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .99 4.5 3 3 0 0 0 2.13 2.12C4.88 19 12 19 12 19s7.12 0 8.88-.38A3 3 0 0 0 23 16.5 31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-1-4.5z" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round" />
                  <path d="M10 15V9l5 3-5 3z" fill="currentColor" />
                </svg>
                <span className="text-sm">YouTube</span>
              </a>
            </div>

            <Link href="/policy" className="text-sm font-medium transition hover:text-black">Policies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
