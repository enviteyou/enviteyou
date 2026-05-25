"use client";

import Link from "next/link";
import { useState } from "react";
import api from "@/api/axios";
import { useRouter } from "next/navigation";

export default function VendorSigninPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

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
			const response = await api.post("/auth/vendor/login", formData);
			const token = response?.data?.token;
			const message = token ? "Vendor login successful." : response?.data?.message || "Vendor login successful.";
			setSuccess(message);
			setTimeout(() => {
				router.push("/");
			}, 2000);
		} catch (requestError) {
			const message = requestError?.response?.data?.message || "Unable to login vendor right now. Please try again.";
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="w-full max-w-xl rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-8 lg:ml-auto">
			<div>
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">EnviteYou Vendor</p>
				<h1 className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">Welcome back</h1>
				<p className="mt-1 text-sm text-black/65">Sign in to your vendor account.</p>
			</div>

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
							value={formData.password}
							onChange={handleChange}
							className="h-11 w-full rounded-xl border border-black/12 bg-white px-3 text-sm outline-none transition focus:border-black/30"
							placeholder="Enter your password"
						/>
					</div>

					{error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
					{success ? <p className="text-sm font-medium text-emerald-700">{success}</p> : null}

					<button
						type="submit"
						disabled={isSubmitting}
						className="h-11 w-full rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "Signing in..." : "Sign In"}
					</button>
				</form>

				<p className="mt-5 text-center text-sm text-black/65">
					New here?{" "}
					<Link href="/vendor/signup" className="font-semibold text-black underline decoration-black/35 underline-offset-4">
						Create vendor account
					</Link>
				</p>
		</main>
	);
}
