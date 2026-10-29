export const metadata = {
  metadataBase: new URL("https://enviteyou.com"),
  title: "Amulya & Vedant · Wedding Invitation | 26 Nov 2026, Varanasi",
  description:
    "With love and blessings, join Amulya Agrawal & Vedant Jain for their wedding celebrations on 26 November 2026 at Hotel De Paris, Varanasi. View events, schedule & directions.",
  keywords: [
    "Amulya and Vedant",
    "Amulya Weds Vedant",
    "VedAm",
    "Wedding Invitation",
    "Varanasi Wedding",
    "Agrawal Family",
    "Jain Family",
  ],
  alternates: {
    canonical: "https://enviteyou.com/amulya-weds-vedant",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://enviteyou.com/amulya-weds-vedant",
    siteName: "Amulya & Vedant · #VedAm",
    title: "Amulya & Vedant · Wedding Invitation",
    description:
      "26 November 2026 · Hotel De Paris, Varanasi. Join us to celebrate with love and blessings. Tap to open the invitation for ceremonies, schedule & directions.",
    images: [
      {
        url: "https://enviteyou.com/amulya-weds-vedant/open-graph.jpg",
        secureUrl: "https://enviteyou.com/amulya-weds-vedant/open-graph.jpg",
        width: 1200,
        height: 631,
        type: "image/jpeg",
        alt: "Amulya & Vedant Wedding Invitation — 26 November 2026, Varanasi",
      },
      {
        url: "https://enviteyou.com/amulya-weds-vedant/open-graph.png",
        secureUrl: "https://enviteyou.com/amulya-weds-vedant/open-graph.png",
        width: 1200,
        height: 631,
        type: "image/png",
        alt: "Amulya & Vedant Wedding Invitation — 26 November 2026, Varanasi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Amulya & Vedant · Wedding Invitation",
    description:
      "26 November 2026 · Hotel De Paris, Varanasi. Join us for the wedding celebrations of Amulya & Vedant.",
    images: ["https://enviteyou.com/amulya-weds-vedant/open-graph.jpg"],
  },
  icons: {
    icon: "/amulya-weds-vedant/assets/favicon.svg",
    shortcut: "/amulya-weds-vedant/assets/favicon.svg",
    apple: "/amulya-weds-vedant/assets/favicon.svg",
  },
};

export default function VedAmLayout({ children }) {
  return <>{children}</>;
}
