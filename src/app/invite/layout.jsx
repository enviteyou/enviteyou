import "../(site)/globals.css"
export default function InviteLayout({ children }) {
	return (
		<div className="min-h-screen text-black">
			<div className=" flex min-h-screen w-full mx-auto max-w-120 items-start justify-center">
				{children}
			</div>
		</div>
	);
}
