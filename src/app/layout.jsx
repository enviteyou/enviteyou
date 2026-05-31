
import { Toaster } from "sonner";

export const metadata = {
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full overflow-x-hidden bg-white text-black ">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}