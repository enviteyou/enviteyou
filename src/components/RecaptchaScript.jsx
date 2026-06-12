"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function RecaptchaScript({ siteKey }) {
  const pathname = usePathname();

  // Prevent loading Google reCAPTCHA on preview and invite pages
  const isPreview = pathname === "/preview";
  const isInvite = pathname.startsWith("/invite/");

  if (isPreview || isInvite || !siteKey) {
    return null;
  }

  return (
    <Script
      id="recaptcha-v3"
      src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
      strategy="afterInteractive"
    />
  );
}
