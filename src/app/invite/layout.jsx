import "./invite.css";
import { JetBrains_Mono, Inter, Roboto, Playwrite_CA, Cormorant_Garamond, DM_Sans } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', preload: false });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ['latin'], variable: '--font-roboto', preload: false });
const playwriteCa = Playwrite_CA({ variable: '--font-playwrite-ca', preload: false });
const cormorantGaramond = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-playfair', preload: false });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dmsans', preload: false });

export const metadata = {
	icons: {
		icon: "/icon2.png",
	},
};

export default function InviteLayout({ children }) {
	return (
		<div className={`min-h-screen text-black ${jetbrainsMono.variable} ${inter.variable} ${roboto.variable} ${playwriteCa.variable} ${cormorantGaramond.variable} ${dmSans.variable}`}>
			<div className=" flex min-h-screen w-full mx-auto max-w-120 items-start justify-center">
				{children}
			</div>
		</div>
	);
}

