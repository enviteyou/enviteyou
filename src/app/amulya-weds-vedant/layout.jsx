export const metadata = {
  title: "Amulya & Vedant · The Wedding Invitation",
  description:
    "With love and blessings, join Amulya Agrawal and Vedant Jain for their wedding celebrations in Varanasi, 24–26 November 2026.",
  openGraph: {
    title: "Amulya & Vedant · You're Invited",
    description:
      "26 November 2026 · Hotel De Paris, Varanasi. With love and blessings, Agrawal Family.",
    url: "/amulya-weds-vedant",
    images: [
      {
        url: "/amulya-weds-vedant/open-graph.png",
        width: 1200,
        height: 630,
        alt: "Amulya & Vedant Wedding Invitation",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amulya & Vedant · You're Invited",
    description:
      "26 November 2026 · Hotel De Paris, Varanasi. With love and blessings, Agrawal Family.",
    images: ["/amulya-weds-vedant/open-graph.png"],
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
