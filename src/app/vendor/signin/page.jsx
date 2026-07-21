"use client";

import { useState } from "react";
import api from "@/api/axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import VendorAuthShell from "@/components/vendor/VendorAuthShell";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";

function Field({ id, label, icon: Icon, ...inputProps }) {
	return (
		<div>
			<label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#3c3840]">
				{label}
			</label>
			<div className="relative">
				{Icon ? (
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8a8590]">
						<Icon className="h-4 w-4" />
					</div>
				) : null}
				<input
					id={id}
					className="h-11 w-full rounded-xl border border-black/8 bg-white/80 pl-10 pr-3 text-sm text-[#17151a] outline-none transition placeholder:text-[#a7a0a9] focus:border-[#d7a57d] focus:bg-white"
					{...inputProps}
				/>
			</div>
		</div>
	);
}

export default function VendorSigninPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showForgotPassword, setShowForgotPassword] = useState(false);
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
			const message = response?.data?.message || "Vendor login successful.";
			toast.success(message);
			setSuccess(message);
			router.push("/vendor/dashboard");
		} catch (requestError) {
			const message = requestError?.response?.data?.message || "Unable to login vendor right now. Please try again.";
			setError(message);
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<VendorAuthShell
			title="Vendor Portal"
			subtitle="Manage your business profile, track approval status, and access the vendor dashboard from one place."
			footerText="Built for vendor sign up, sign in, and portal access."
		>
			<div className="space-y-5">
				<div>
					<h1 className="text-[1.8rem] font-semibold tracking-tight text-[#111111] sm:text-[2.1rem]">
						Welcome back
					</h1>
					<p className="mt-2 max-w-md text-sm leading-6 text-[#6f6861] sm:text-[0.94rem]">
						Sign in to your vendor account to manage your profile.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Field
						id="email"
						label="Email"
						icon={Mail}
						name="email"
						type="email"
						required
						value={formData.email}
						onChange={handleChange}
						placeholder="you@example.com"
					/>

					<div>
						<div className="flex items-center justify-between mb-2">
							<label htmlFor="password" className="block text-sm font-semibold text-[#3c3840]">
								Password
							</label>
							<button
								type="button"
								onClick={() => setShowForgotPassword(true)}
								className="text-xs font-semibold text-[#c07b55] hover:underline cursor-pointer"
							>
								Forgot password?
							</button>
						</div>
						<div className="relative">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8a8590]">
								<Lock className="h-4 w-4" />
							</div>
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								required
								value={formData.password}
								onChange={handleChange}
								className="h-11 w-full rounded-xl border border-black/8 bg-white/80 pl-10 pr-11 text-sm text-[#17151a] outline-none transition placeholder:text-[#a7a0a9] focus:border-[#d7a57d] focus:bg-white"
								placeholder="Enter your password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((current) => !current)}
								className="absolute inset-y-0 right-0 flex items-center px-3 text-[#8a8590] transition hover:text-[#2c2730]"
							>
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>

					{error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
					{success ? <p className="text-sm font-medium text-emerald-700">{success}</p> : null}

					<button
						type="submit"
						disabled={isSubmitting}
						className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0b1b33] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,27,51,0.25)] transition hover:bg-[#08162b] disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "Signing in..." : <>Sign In <ArrowRight className="h-4 w-4" /></>}
					</button>

					<p className="flex items-center gap-2 text-xs text-[#8b857f]">
						<Shield className="h-4 w-4 text-[#c89c74]" />
						Secure, encrypted connection.
					</p>
				</form>

				<p className="text-sm text-[#6f6861]">
					New here?{" "}
					<Link href="/vendor/signup" className="font-semibold text-[#c07b55] underline decoration-[#c07b55]/35 underline-offset-4 transition hover:text-[#a95f3c]">
						Create vendor account
					</Link>
				</p>

				<ForgotPasswordModal
					isOpen={showForgotPassword}
					onClose={() => setShowForgotPassword(false)}
					initialEmail={formData.email}
				/>
			</div>
		</VendorAuthShell>
	);
}
