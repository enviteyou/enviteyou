
import { Toaster } from "sonner";



export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
      </head>
      <body className="min-h-full overflow-x-hidden bg-white text-black ">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}