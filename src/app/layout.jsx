
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import Script from "next/script";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function RootLayout({ children }) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      </head>
      <body className="min-h-full overflow-x-hidden bg-white text-black ">
        <AuthProvider>
          <SmoothScrollProvider>
            {recaptchaSiteKey ? (
              <Script
                id="recaptcha-v3"
                src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
                strategy="afterInteractive"
              />
            ) : null}
            {children}
          </SmoothScrollProvider>
        </AuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}