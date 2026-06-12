
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import RecaptchaScript from "@/components/RecaptchaScript";

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
            <RecaptchaScript siteKey={recaptchaSiteKey} />
            {children}
          </SmoothScrollProvider>
        </AuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}