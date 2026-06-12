import TemplateDetail from "@/components/TemplateDetail";
import { getTemplateById } from "@/lib/templateService";

// Fetch invitation details on the server with tagging for on-demand revalidation
async function getInvitationData(slug) {
	const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";
	if (!apiBase) {
		console.error("API base URL is not defined in environment variables.");
		return null;
	}

	try {
		const res = await fetch(`${apiBase}/invitations/${encodeURIComponent(slug)}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			next: {
				revalidate: 3600, // Cache for up to 1 hour, or revalidate on-demand via tag
				tags: ["invitation", `invitation-${slug}`],
			},
		});

		if (!res.ok) {
			if (res.status === 404) return null;
			throw new Error(`Failed to fetch invitation: ${res.statusText}`);
		}

		const data = await res.json();
		return data?.data || data;
	} catch (error) {
		console.error("Error fetching invitation details:", error);
		return null;
	}
}

// Generate dynamic Open Graph metadata for the invitation page
export async function generateMetadata({ params }) {
	const { slug } = await params;
	const invitation = await getInvitationData(slug);

	if (!invitation) {
		return {
			title: "Invitation Not Found | EnviteYou",
			description: "The digital wedding invitation you are looking for is unavailable.",
			robots: {
				index: false,
				follow: false,
			},
		};
	}

	const templateId = invitation?.templateId || invitation?.template || "";
	const template = await getTemplateById(templateId);

	const brideName = (invitation?.bride || "Janvi").trim();
	const groomName = (invitation?.groom || "Prateek").trim();
	const coupleNames = `${brideName} & ${groomName}`;
	const title = invitation.title || `${coupleNames}'s Wedding Invitation | EnviteYou`;
	const description = invitation.description || `You are cordially invited to celebrate the wedding of ${brideName} and ${groomName}. View event details, venue map, and RSVP online.`;

	// Extract OG Image
	const galleryPhotos = Array.isArray(invitation?.galleryImages) ? invitation.galleryImages.filter(Boolean) : [];
	const ogImage = invitation.ogImage || invitation.previewImage || galleryPhotos[0] || template?.featuredImage || template?.preview || "/logo.png";

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url: `https://enviteyou.com/invite/${slug}`,
			siteName: "EnviteYou",
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: `${coupleNames} Wedding Invitation Preview`,
				},
			],
			type: "article",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage],
		},
	};
}

export default async function InviteBySlugPage({ params }) {
	const { slug } = await params;
	const invitation = await getInvitationData(slug);

	if (!invitation) {
		return (
			<main className="w-full px-0 py-0 sm:px-6 sm:py-4 lg:px-0 lg:py-0">
				<div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-black/10 p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm bg-white">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Invitation unavailable</p>
					<p className="mt-3 text-base text-red-600">Invitation not found or has been disabled.</p>
				</div>
			</main>
		);
	}

	const templateId = invitation?.templateId || invitation?.template || "";
	const template = await getTemplateById(templateId);

	return (
		<main className="w-full px-0 py-0 sm:px-6 sm:py-4 lg:px-0 lg:py-0">
			<div className="mx-auto grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)]">
				<TemplateDetail template={template} formData={invitation} fullscreen />
			</div>
		</main>
	);
}
