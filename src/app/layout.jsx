
import { Toaster } from "sonner";

export default function RootLayout({ children }) {
  return (
   <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  )
}