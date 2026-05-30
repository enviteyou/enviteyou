
import { Toaster } from "sonner";

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