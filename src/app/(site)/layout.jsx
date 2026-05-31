import "./globals.css";
import Header from "../../components/Header";
import Footer from "@/components/Footer";
import { JetBrains_Mono, Inter, Roboto, Playwrite_CA, Cormorant_Garamond, DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Script from "next/script";
import { AuthProvider } from "@/context/AuthContext";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', preload: false });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ['latin'], variable: '--font-roboto', preload: false });
const playwriteCa = Playwrite_CA({ variable: '--font-playwrite-ca', preload: false });
const cormorantGaramond = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-playfair', preload: false });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dmsans', preload: false });

export const metadata = {
  metadataBase: new URL("https://enviteyou.com"),
  title: {
    default: "Digital Wedding Invitation Templates | EnviteYou",
    template: "%s | EnviteYou",
  },
  description:
    "Create premium digital wedding invitations with RSVP, event details, guest sharing, and elegant mobile-first templates from EnviteYou.",
  keywords: [
    "digital wedding invitations",
    "wedding invite website",
    "online wedding invitation",
    "RSVP wedding invitation",
    "Indian wedding invitation website",
    "EnviteYou",
  ],
  applicationName: "EnviteYou",
  authors: [{ name: "Elevate Ecommerce Synergies" }],
  creator: "Elevate Ecommerce Synergies",
  publisher: "Elevate Ecommerce Synergies",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Digital Wedding Invitation Templates | EnviteYou",
    description:
      "Premium mobile-first wedding invitation websites with RSVP, event details, guest sharing, and elegant digital delivery.",
    url: "/",
    siteName: "EnviteYou",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "EnviteYou digital wedding invitations",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Wedding Invitation Templates | EnviteYou",
    description:
      "Create premium digital wedding invitations with RSVP, event details, and elegant mobile-first templates.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
    >
      <div
        className={cn(
          "",
          jetbrainsMono.variable,
          inter.variable,
          roboto.variable,
          playwriteCa.variable,
          cormorantGaramond.variable,
          dmSans.variable
        )}
      >
        <AuthProvider>
          {recaptchaSiteKey ? (
            <Script
              id="recaptcha-v3"
              src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
              strategy="afterInteractive"
            />
          ) : null}

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "EnviteYou",
              }),
            }}
          />

          <Header />

          <main>
            {children}
          </main>

          <Footer />
        </AuthProvider>
      </div>
    </GoogleOAuthProvider>
  );

}
