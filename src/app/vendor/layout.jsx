import "../(site)/globals.css";
export const metadata = {
  title: "Vendor — EnviteYou",
  icons:{
    icon: "/icon2.png",
    apple: "/icon.png",
  }
};

export default function VendorLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#fcfbfa] text-stone-900 font-sans antialiased">
      {children}
    </div>
  );
}
