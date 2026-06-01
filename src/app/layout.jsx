
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import Script from "next/script";



export default function RootLayout({ children }) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
      </head>
      <body className="min-h-full overflow-x-hidden bg-white text-black ">
        <AuthProvider>
          {recaptchaSiteKey ? (
            <Script
              id="recaptcha-v3"
              src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
              strategy="afterInteractive"
            />
          ) : null}
          {children}
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}