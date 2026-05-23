"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TemplateDetail from "@/components/TemplateDetail";
import api from "@/api/axios";
import { getTemplateById } from "@/lib/templateService";

export default function InviteBySlugPage() {
	const params = useParams();
	const slug = params?.slug;
	const [result, setResult] = useState({
		slug: null,
		invitation: null,
		error: "",
	});
	const [template, setTemplate] = useState(null);

	useEffect(() => {
		if (!slug) return;
		let ignore = false;

		api
			.get(`/invitations/${encodeURIComponent(slug)}`)
			.then((res) => {
				if (!ignore) {
					setResult({
						slug,
						invitation: res?.data?.data || null,
						error: "",
					});
				}
			})
			.catch((err) => {
				const message = err?.response?.data?.message || err.message || "Unable to load invitation";
				if (!ignore) {
					setResult({
						slug,
						invitation: null,
						error: message,
					});
				}
			});

		return () => {
			ignore = true;
		};
	}, [slug]);

	useEffect(() => {
		if (!result.invitation) return undefined;

		let ignore = false;
		const templateId = result.invitation?.templateId || result.invitation?.template || "";

		getTemplateById(templateId)
			.then((selectedTemplate) => {
				if (!ignore) {
					setTemplate(selectedTemplate);
				}
			})
			.catch(() => {
				if (!ignore) {
					setTemplate(null);
				}
			});

		return () => {
			ignore = true;
		};
	}, [result.invitation]);

	const loading = result.slug !== slug;
	const invitation = result.invitation;
	const error = result.error;

	return (
		<main className="w-full px-4 py-4 sm:px-6 lg:px-0 lg:py-0">
			{loading ? (
				<div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center text-center text-black/60">
					Loading invitation...
				</div>
			) : error ? (
				<div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-black/10  p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">Invitation unavailable</p>
					<p className="mt-3 text-base text-red-600">{error}</p>
				</div>
			) : invitation ? (
				<div className="mx-auto grid w-full  gap-8 lg:grid-cols-[minmax(0,1fr)]">
					<TemplateDetail template={template} formData={invitation} />
				</div>
			) : (
				<div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-black/10  p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-sm">
					<p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">Invitation unavailable</p>
					<p className="mt-3 text-base text-black/60">Invitation not found.</p>
				</div>
			)}
		</main>
	);
}
