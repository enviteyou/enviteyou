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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.06),transparent_28%),linear-gradient(135deg,#f7f6f3_0%,#ffffff_42%,#f3f4f6_100%)] text-black">
      {children}
    </div>
  );
}
