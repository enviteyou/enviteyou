"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Building2, Check, Eye, EyeOff, Hash, Link2, Lock, Mail, Phone, Shield, User } from "lucide-react";
import api from "@/api/axios";
import VendorAuthShell from "@/components/vendor/VendorAuthShell";
import { getRecaptchaToken } from "@/lib/recaptcha";

function Field({ id, label, icon: Icon, optional, ...inputProps }) {
	return (
		<div>
			<label htmlFor={id} className="mb-2 block text-sm font-semibold text-[#3c3840]">
				{label}
				{optional ? <span className="ml-2 text-xs font-medium text-[#cb8d63]">Optional</span> : null}
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

export default function VendorSignupPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		businessName: "",
		email: "",
		password: "",
		number: "",
		googleMyBusinessLink: "",
		gstNumber: "",
	});
	const [showPassword, setShowPassword] = useState(false);
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
			const captchaToken = await getRecaptchaToken("vendor_signup");
			const response = await api.post("/auth/vendor/register", {
				...formData,
				role: "vendor",
				captchaToken,
			});

			if (response?.data?.success) {
				const message = response?.data?.message || "Vendor registration successful.";
				setSuccess(message);
				toast.success(message);
				setFormData({
					name: "",
					businessName: "",
					email: "",
					password: "",
					number: "",
					googleMyBusinessLink: "",
					gstNumber: "",
				});
				router.push("/vendor/signin");
				return;
			}

			const message = response?.data?.message || "Unable to register vendor right now. Please try again.";
			setError(message);
			toast.error(message);
		} catch (requestError) {
			const message = requestError?.response?.data?.message || "Unable to register vendor right now. Please try again.";
			setError(message);
			toast.error(message);
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
		>
			<div className="space-y-5">
				<div>
					<h1 className="text-[1.8rem] font-semibold tracking-tight text-[#111111] sm:text-[2.1rem]">
						Create vendor account
					</h1>
					<p className="mt-2 max-w-md text-sm leading-6 text-[#6f6861] sm:text-[0.94rem]">
						Register your business to start managing vendor access.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Field id="name" label="Name" icon={User} name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Your name" />

					<Field id="businessName" label="Business name" icon={Building2} name="businessName" type="text" required value={formData.businessName} onChange={handleChange} placeholder="Your business name" />

					<Field id="email" label="Email" icon={Mail} name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />

					<div>
						<label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#3c3840]">Password</label>
						<div className="relative">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#8a8590]">
								<Lock className="h-4 w-4" />
							</div>
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								required
								minLength={6}
								value={formData.password}
								onChange={handleChange}
								className="h-11 w-full rounded-xl border border-black/8 bg-white/80 pl-10 pr-11 text-sm text-[#17151a] outline-none transition placeholder:text-[#a7a0a9] focus:border-[#d7a57d] focus:bg-white"
								placeholder="Minimum 6 characters"
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

					<Field id="number" label="Phone number" icon={Phone} name="number" type="tel" required value={formData.number} onChange={handleChange} placeholder="Your phone number" />

					<Field id="googleMyBusinessLink" label="Google My Business Link" icon={Link2} name="googleMyBusinessLink" type="url" required value={formData.googleMyBusinessLink} onChange={handleChange} placeholder="https://g.page/your-business" />

					<Field id="gstNumber" label="GST number" icon={Hash} optional name="gstNumber" type="text" value={formData.gstNumber} onChange={handleChange} placeholder="GST number" />

					<div className="flex items-start gap-2 rounded-xl bg-white/70 px-1 py-1 text-xs text-[#7b756f]">
						<Check className="mt-0.5 h-4 w-4 shrink-0 text-[#c67e53]" />
						<span>Get faster chance of approval</span>
					</div>

					{error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
					{success ? <p className="text-sm font-medium text-emerald-700">{success}</p> : null}

					<button
						type="submit"
						disabled={isSubmitting}
						className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0b1b33] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(11,27,51,0.25)] transition hover:bg-[#08162b] disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "Creating vendor account..." : <>Sign Up <ArrowRight className="h-4 w-4" /></>}
					</button>
					<p className="flex items-center gap-2 text-xs text-[#8b857f]">
						<Shield className="h-4 w-4 text-[#c89c74]" />
						Protected by score-based reCAPTCHA.
					</p>
				</form>

				<p className="text-sm text-[#6f6861]">
					Already have a vendor account?{" "}
					<Link href="/vendor/signin" className="font-semibold text-[#c07b55] underline decoration-[#c07b55]/35 underline-offset-4 transition hover:text-[#a95f3c]">
						Sign in
					</Link>
				</p>
			</div>
		</VendorAuthShell>
	);
}
