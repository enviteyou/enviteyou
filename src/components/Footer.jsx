"use client";

import { InstagramLogoIcon, PinterestLogoIcon, YoutubeLogoIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Templates: ["Classic", "Modern", "Luxury", "Editorial"],
  Services: ["Custom invites", "Branding", "RSVP pages", "Guest support"],
  Information: [
    { label: "Privacy Policy", href: "/policy" },
    { label: "Refund Policy", href: "/refund_policy" },
    { label: "Shipping Policy", href: "/shipping_policy" },
    { label: "Cookie Policy", href: "/cookie_policy" },
    { label: "Terms of Service", href: "/tems" },
    { label: "About Us", href: "/about" },
    { label: "Contact us", href: "mailto:care@enviteyou.com" },

  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-black/8 bg-white text-black">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.05),transparent_68%)] blur-3xl" />
        <div className="absolute -right-32 -bottom-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(230,200,165,0.2),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-5 sm:px-8 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <div className="flex flex-col items-start gap-3 min-[420px]:flex-row min-[420px]:items-center">
              <Link href="/" className="flex shrink-0 items-center" aria-label="EnviteYou home">
                <Image
                  src="/logo.png"
                  alt="EnviteYou"
                  width={160}
                  height={80}
                  className="h-12 w-auto max-w-[150px]"
                />
              </Link>
            </div>

            <p className="mt-6 max-w-md text-sm leading-7 text-black/58 sm:text-base">
              Crafted for couples who want a clean, premium wedding presence with elegant typography, refined motion,
              and a cinematic showcase of invitation designs.
            </p>

            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
              <Link href="/pricing" className="rounded bg-black px-6 py-3 text-center text-sm font-medium text-white shadow-[0_18px_42px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-black/90">
                Choose a template
              </Link>
              <a href="mailto:care@enviteyou.com" className="rounded border border-black/10 bg-white px-6 py-3 text-center text-sm font-medium text-black/75 shadow-[0_14px_34px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:text-black">
                Book a consultation
              </a>
            </div>

            <div className="mt-6 grid gap-1 text-sm text-black/60">
              <a href="mailto:care@enviteyou.com" className="rounded border border-black/8 bg-white px-4 py-3 transition hover:border-black/16 hover:text-black">
                <span className="block text-[0.7rem] uppercase tracking-[0.3em] text-black/40">Email</span>
                <span className="mt-1 block font-medium">care@enviteyou.com</span>
              </a>
              <a href="tel:+918828287278" className="rounded border border-black/8 bg-white px-4 py-3 transition hover:border-black/16 hover:text-black">
                <span className="block text-[0.7rem] uppercase tracking-[0.3em] text-black/40">Phone</span>
                <span className="mt-1 block font-medium">+91 8828287278</span>
              </a>
            </div>
          </div>

          <div className="grid gap-10 grid-cols-2 md:grid-cols-3 lg:gap-14">
            {Object.entries(footerLinks).map(([title, items]) => (
              <div key={title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.35em] text-black/45">{title}</h2>
                <ul className="mt-5 space-y-3 text-sm text-black/70">
                  {items.map((item) => (
                    <li key={typeof item === "string" ? item : item.label}>
                      {typeof item === "string" ? (
                        <a href="#" className="transition duration-200 hover:text-black">
                          {item}
                        </a>
                      ) : (
                        <Link href={item.href} className="transition duration-200 hover:text-black">
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-linear-to-r from-transparent via-black/12 to-transparent" />

        <div className="mt-6 flex flex-col gap-4 text-sm text-black/48 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EnviteYou. All rights reserved.</p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <a href="#" aria-label="Instagram" className="flex items-center gap-2 transition hover:text-black">
                <InstagramLogoIcon size={18} color="black" />
                <span className="text-sm">Instagram</span>
              </a>

              <a href="#" aria-label="Pinterest" className="flex items-center gap-2 transition hover:text-black">
                <PinterestLogoIcon size={18} color="black" />
                <span className="text-sm">Pinterest</span>
              </a>

              <a href="#" aria-label="YouTube" className="flex items-center gap-2 transition hover:text-black">
                <YoutubeLogoIcon size={18} color="black" />
                <span className="text-sm">YouTube</span>
              </a>
            </div>

            {/* <Link href="/policy" className="text-sm font-medium transition hover:text-black">Policies</Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
