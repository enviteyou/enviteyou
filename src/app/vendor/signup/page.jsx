"use client";

import { useState } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import VendorAuthShell from "@/components/vendor/VendorAuthShell";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function VendorSignupPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		number: "",
		googleMyBusinessLink: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const router = useRouter();

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setSuccess("");
		setIsSubmitting(true);

		try {
			const response = await api.post("/auth/vendor/register", {
				...formData,
				role: "vendor",
			});
			if(response?.data?.success) {
				setSuccess(response.data.message || "Vendor registration successful.");
				router.push("/vendor/signin");
			} else {
				setError(response?.data?.message || "Unable to register vendor right now. Please try again.");
				return;
			}
			const message = response?.data?.message || "Vendor registration successful.";
			toast.success(message);
			setFormData({
				name: "",
				email: "",
				password: "",
				number: "",
				googleMyBusinessLink: "",
			});
		} catch (requestError) {
			const message = requestError?.response?.data?.message || "Unable to register vendor right now. Please try again.";
			setError(message);
			console.error("Vendor registration error:", requestError.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<VendorAuthShell
			title="Vendor Portal"
			subtitle="Manage your business profile, track approval status, and access the vendor dashboard from one place."
			footerText="Built for vendor sign up, sign in, and portal access."
			footerLinkHref="/vendor/signin"
			footerLinkText="Sign in"
		>
			<main className="w-full max-w-xl rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-8 lg:ml-auto">
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">EnviteYou Vendor</p>
					<h1 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">Create vendor account</h1>
					<p className="mt-1 text-sm text-black/65">
						Register your business to start managing vendor access.
					</p>
				</div>

			<form onSubmit={handleSubmit} className="mt-6 space-y-4">
				<div>
					<label htmlFor="name" className="mb-1 block text-sm font-medium text-black/75">
						Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						value={formData.name}
						onChange={handleChange}
						className="h-11 w-full rounded-xl border border-black/12 bg-white px-3 text-sm outline-none transition focus:border-black/30"
						placeholder="Your name"
					/>
				</div>

				<div>
					<label htmlFor="email" className="mb-1 block text-sm font-medium text-black/75">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						value={formData.email}
						onChange={handleChange}
						className="h-11 w-full rounded-xl border border-black/12 bg-white px-3 text-sm outline-none transition focus:border-black/30"
						placeholder="you@example.com"
					/>
				</div>

				<div>
					<label htmlFor="password" className="mb-1 block text-sm font-medium text-black/75">
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						required
						minLength={6}
						value={formData.password}
						onChange={handleChange}
						className="h-11 w-full rounded-xl border border-black/12 bg-white px-3 text-sm outline-none transition focus:border-black/30"
						placeholder="Minimum 6 characters"
					/>
				</div>

				<div>
					<label htmlFor="number" className="mb-1 block text-sm font-medium text-black/75">
						Phone number
					</label>
					<input
						id="number"
						name="number"
						type="tel"
						required
						value={formData.number}
						onChange={handleChange}
						className="h-11 w-full rounded-xl border border-black/12 bg-white px-3 text-sm outline-none transition focus:border-black/30"
						placeholder="Your phone number"
					/>
				</div>

				<div>
					<label htmlFor="googleMyBusinessLink" className="mb-1 block text-sm font-medium text-black/75">
						Google My Business Link
					</label>
					<input
						id="googleMyBusinessLink"
						name="googleMyBusinessLink"
						type="url"
						required
						value={formData.googleMyBusinessLink}
						onChange={handleChange}
						className="h-11 w-full rounded-xl border border-black/12 bg-white px-3 text-sm outline-none transition focus:border-black/30"
						placeholder="https://g.page/..."
					/>
				</div>

				{error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
				{success ? <p className="text-sm font-medium text-emerald-700">{success}</p> : null}

				<button
					type="submit"
					disabled={isSubmitting}
					className="h-11 w-full rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{isSubmitting ? "Creating vendor account..." : "Sign Up"}
				</button>
			</form>

				<Link href="/vendor/signin" className="mt-5 text-center text-sm text-black/65">
					Already have a vendor account? Sign in
				</Link>
			</main>
		</VendorAuthShell>
	);
}
