import "./globals.css";
import Header from "../../components/Header";
import Footer from "@/components/Footer";
import { JetBrains_Mono, Inter, Roboto, Playwrite_CA } from "next/font/google";
import { cn } from "@/lib/utils";
import { GoogleOAuthProvider } from "@react-oauth/google";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ['latin'], variable: '--font-roboto' });
const playwriteCa = Playwrite_CA({ variable: '--font-playwrite-ca' });

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
    icon: "/icon.png",
    apple: "/icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-mono", jetbrainsMono.variable, inter.variable, roboto.variable, playwriteCa.variable)}
    >
    
      <body className="min-h-full overflow-x-hidden bg-white text-black font-inter">
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "EnviteYou",
              legalName: "Elevate Ecommerce Synergies",
              url: "https://enviteyou.com",
              logo: "https://enviteyou.com/logo.png",
              email: "care@enviteyou.com",
              telephone: "+91 8828287278",
            }),
          }}
        />
        <Header />
        <div className="min-h-screen">{children}</div>
        <Footer />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
