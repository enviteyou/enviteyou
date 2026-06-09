"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, Copy, Link2 } from "lucide-react";
import api from "@/api/axios";
import { getTemplateById } from "@/lib/templateService";

function formatDate(value) {
	if (!value) return "-";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString(undefined, {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}

function formatMoney(value) {
	const amount = Number(value || 0);
	return `₹${amount.toLocaleString("en-IN")}`;
}

function buildInviteUrl(slug) {
	if (!slug) return "";
	if (typeof window === "undefined") return `/invite/${encodeURIComponent(slug)}`;
	return `${window.location.origin}/invite/${encodeURIComponent(slug)}`;
}

function WhatsAppIcon(props) {
	return (
		<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
			<path d="M20.5 11.9a8.45 8.45 0 0 1-12.7 7.3L4 20l.8-3.6A8.4 8.4 0 1 1 20.5 11.9Z" stroke="currentColor" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
			<path d="M9.2 8.9c.1-.3.3-.4.6-.4h.7c.2 0 .4.1.5.4l.9 2c.1.2.1.4 0 .6l-.5.6c.6 1 1.4 1.8 2.4 2.4l.6-.5c.2-.1.4-.1.6 0l2 .9c.3.1.4.3.4.5v.7c0 .3-.1.5-.4.6-.6.3-1.2.4-1.9.3-3.5-.4-6.4-3.3-6.8-6.8-.1-.7 0-1.3.3-1.9Z" fill="currentColor" />
		</svg>
	);
}

function iconPath(src) {
	return encodeURI(src);
}

function DetailRow({ iconSrc, iconAlt, label, value }) {
	return (
		<div className="flex items-center gap-3 border-b border-black/8 px-4 py-3.5 last:border-b-0 sm:px-5 sm:py-4">
			<div className="flex h-15 w-15 shrink-0 items-center justify-center">
				<Image src={iconPath(iconSrc)} alt={iconAlt} width={30} height={30} className="h-20 w-20 text-[#D6894E] object-contain" />
			</div>
			<div className="flex min-w-0 flex-1 items-center justify-between gap-4">
				<p className="min-w-0 whitespace-nowrap text-[12px] font-medium text-black/55 sm:text-sm">{label}</p>
				<div className="min-w-0 flex-1 truncate text-right text-[12px] text-black sm:text-sm">{value}</div>
			</div>
		</div>
	);
}

function ActionButton({ href, onClick, children, className = "", type = "button", external = false }) {
	const base = `flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition ${className}`;
	if (href) {
		return (
			<Link href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={base}>
				{children}
			</Link>
		);
	}

	return (
		<button type={type} onClick={onClick} className={base}>
			{children}
		</button>
	);
}

export default function ConfirmationPage() {
	const params = useParams();
	const router = useRouter();
	const id = params?.id;
	const [invitation, setInvitation] = useState(null);
	const [template, setTemplate] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!id) return;
		let ignore = false;

		const load = async () => {
			try {
				const response = await api.get(`/invitations/id/${encodeURIComponent(id)}`);
				if (ignore) return;
				const data = response?.data?.data || null;
				setInvitation(data);
				setError("");

				if (data?.templateId || data?.template) {
					const selectedTemplate = await getTemplateById(data.templateId || data.template || "");
					if (!ignore) setTemplate(selectedTemplate || null);
				}
			} catch (requestError) {
				if (!ignore) {
					setError(requestError?.response?.data?.message || requestError?.message || "Unable to load confirmation.");
				}
			} finally {
				if (!ignore) setLoading(false);
			}
		};

		load();
		return () => {
			ignore = true;
		};
	}, [id]);

	const inviteUrl = useMemo(() => buildInviteUrl(invitation?.slug), [invitation?.slug]);
	const coupleName = useMemo(() => {
		if (!invitation) return "";
		return [invitation.bride, invitation.groom].filter(Boolean).join(" & ") || "Invitation";
	}, [invitation]);
	const confirmationEmail = invitation?.createdBy?.email || invitation?.email || "[email]";
	const createdFor = invitation?.createdBy?.name || invitation?.createdBy?.email || "[Customer Name]";
	const styleName = template?.name || `Template ${invitation?.templateId || invitation?.template || "1"}`;
	const paymentAmount = invitation?.amountPaid || invitation?.paymentAmount || 2000;
	const orderId = invitation?.razorpayOrderId || invitation?.orderId || invitation?._id || "N/A";

	async function copyInviteLink() {
		if (!inviteUrl) return;
		try {
			await navigator.clipboard.writeText(inviteUrl);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		} catch {
			setCopied(false);
		}
	}

	function shareOnWhatsApp() {
		if (!inviteUrl) return;
		const text = `Your invitation is live: ${inviteUrl}`;
		window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
	}

	if (loading) {
		return <div className="flex min-h-dvh items-center justify-center px-4 text-black/55">Loading confirmation...</div>;
	}

	if (error) {
		return (
			<div className="mx-auto mt-10 w-full max-w-2xl rounded-[2rem] border border-black/10 bg-white p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">Invitation unavailable</p>
				<p className="mt-3 text-base text-red-600">{error}</p>
				<button onClick={() => router.back()} className="mt-5 rounded border border-black/10 px-4 py-2 text-sm font-semibold text-black">
					Go back
				</button>
			</div>
		);
	}

	return (
		<main className="relative min-h-dvh overflow-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
			<div className="fixed inset-0 -z-10">
				<Image src="/payment%20page%20bg.png" alt="Payment background" fill priority sizes="100vw" className="object-cover object-center" />
				<div className="absolute inset-0 bg-[#f7f1eb]/68" />
			</div>

			<div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[480px] flex-col items-center">
				<div className="w-full rounded-[2rem] bg-[#fbf6f0]/92 px-4 py-6 text-center shadow-[0_18px_50px_rgba(31,24,18,0.08)] backdrop-blur-[1px] sm:px-7 sm:py-8">
					<div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#94b08a] bg-white text-[#6d8f67] sm:h-12 sm:w-12">
						<Check className="h-6 w-6" />
					</div>
					<p className="mt-4 text-[17px] font-medium text-[#6d8f67] sm:text-[18px]">Payment Successful</p>
					<h1 className="mt-4 text-[2.1rem] font-semibold leading-[1.02] tracking-tight text-[#132038] sm:text-[2.45rem]">
						Your invitation
						<br />
						is now <span className="text-[#d6894e]">live.</span>
					</h1>
					<div className="mx-auto mt-5 flex items-center justify-center gap-3 text-[#d6894e]">
						<span className="h-px w-14 bg-[#d6894e]/45 sm:w-16" />
						<Image src="/divider.png" alt="Divider" width={18} height={18} className="h-4 w-4 object-contain" />
						<span className="h-px w-14 bg-[#d6894e]/45 sm:w-16" />
					</div>
					<p className="mx-auto mt-4 max-w-xs text-[14px] leading-6 text-black/55 sm:text-[15px]">Your wedding story now has a beautiful home online.</p>

					<div className="mt-6 overflow-hidden rounded border border-black/8 bg-white text-left shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
						<DetailRow iconSrc="/user icon.png" iconAlt="Invitation" label="Invitation" value={`${coupleName} Wedding`} />
						<DetailRow iconSrc="/calender icon.png" iconAlt="Date" label="Date" value={formatDate(invitation?.date)} />
						<DetailRow iconSrc="/diamond icon.png" iconAlt="Invitation Style" label="Invitation Style" value={styleName} />
						<DetailRow iconSrc="/user icon.png" iconAlt="Created for" label="Created for" value={createdFor} />
						<DetailRow iconSrc="/wallet icon.png" iconAlt="Payment Received" label="Payment Received" value={formatMoney(paymentAmount)} />
						<DetailRow
							iconSrc="/status icon.png"
							iconAlt="Status"
							label="Status"
							value={
								<span className="inline-flex items-center gap-2 rounded-full bg-[#eef7ed] px-3 py-1 text-[11px] font-semibold text-[#438251] sm:text-xs">
									<span>Live</span>
									<span className="h-2 w-2 rounded-full bg-[#4ba24f]" />
								</span>
							}
						/>
						<DetailRow iconSrc="/invoice icon.png" iconAlt="Order ID" label="Order ID" value={orderId} />
						<DetailRow iconSrc="/envelop icon.png" iconAlt="Confirmation sent to" label="Confirmation sent to" value={confirmationEmail} />
					</div>

					<div className="mt-4 rounded-[1.5rem] border border-black/8 bg-white px-4 py-4 text-left shadow-[0_12px_30px_rgba(0,0,0,0.04)] sm:px-5">
						<p className="text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-[#d6894e]">Your shareable invitation link</p>
						<div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
							<div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-black/10 bg-[#fffdfb] px-3 py-2.5">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white text-black/55">
									<Link2 className="h-4.5 w-4.5" />
								</div>
								<p className="min-w-0 flex-1 truncate text-[13px] text-black/70 sm:text-sm">{inviteUrl || "-"}</p>
							</div>
							<ActionButton href={`/invite/${encodeURIComponent(invitation?.slug || "")}`} external={false} className="border-[#0f2037] bg-[#11233d] px-4 text-white hover:bg-[#0c1a2e]">
								Open Live Invite
							</ActionButton>
						</div>

						<div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
							<ActionButton onClick={copyInviteLink} className="border-[#d6894e] text-[#d6894e] hover:bg-[#fff4eb]">
								<Copy className="h-4 w-4" />
								{copied ? "Copied" : "Invite Copy Link"}
							</ActionButton>
							<ActionButton onClick={shareOnWhatsApp} className="border-[#5aa16d] text-[#5aa16d] hover:bg-[#f1faf3]">
								<WhatsAppIcon className="h-5 w-5" />
								Share on WhatsApp
							</ActionButton>
						</div>
					</div>

					<div className="mt-6 text-center text-[#132038]">
						<p className="text-[18px] font-semibold sm:text-xl">Thank you for choosing EnviteYou.</p>
						<p className="mt-1 text-[14px] text-[#d6894e] sm:text-[15px]">Pay once. Share forever.</p>
					</div>
				</div>
			</div>
		</main>
	);
}