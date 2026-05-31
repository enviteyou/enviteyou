"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { getRecaptchaToken } from "@/lib/recaptcha";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";

export default function SignupPage() {
	// role selection removed — default to normal "user" role
	const router = useRouter();
	const { isUser, loading } = useAuth();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		number: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const role = "user";

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// role selection removed; kept for compatibility

	useEffect(() => {
		if (isUser) {
			router.replace("/my-account");
		}
	}, [isUser, router]);

	if (loading) {
		return (
			<main
				className="relative isolate min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8"
				style={{
					backgroundImage: "url('/form_background.jpeg')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				<section className="relative mx-auto w-full max-w-md rounded-xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
					<p className="text-sm font-medium text-black/60">Checking your session...</p>
				</section>
			</main>
		);
	}

	const handleSubmit = async (event) => {
		try {
			const captchaToken = await getRecaptchaToken("signup");
			const payload = {
				...formData,
				role,
				captchaToken,
			};

			const response = await api.post("/auth/register", payload);
			const message = response?.data?.message || "Registration successful.";
			setSuccess(message);
			toast.success(message);
			window.dispatchEvent(new Event("authChange"));
			setFormData({
				name: "",
				email: "",
				password: "",
				number: "",
			});
			router.replace("/my-account");
		} catch (requestError) {
			const message =
				requestError?.response?.data?.message || "Unable to register right now. Please try again.";
			setError(message);
			toast.error(message);
			console.error("Registration error:", requestError.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main
			className="relative isolate flex min-h-screen w-full py-20 px-4 items-center justify-center"
		>
			<Image
				src="/form_background.jpeg"
				alt="Background"
				fill
				priority
				className="object-cover fixed! inset-0!"
				style={{ zIndex: -1 }}
			/>


			<section className="relative mx-auto w-full max-w-lg rounded-lg border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(70,35,25,0.12)] sm:p-8">
				<div className="flex items-center gap-3 mb-2">
					<Image src="/icon.png" alt="EnviteYou" width={40} height={40} />
					<span className="text-sm font-semibold uppercase tracking-[0.24em] text-black/85">ENVITEYOU</span>
				</div>
				<h1 className="mt-2 text-4xl font-bold tracking-tight text-black">Create an account</h1>
				<p className="mt-1 text-sm text-black/65">Create a normal EnviteYou account.</p>

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
					<div>
						<label htmlFor="name" className="mb-1 block text-sm font-medium text-black/75">
							Full Name
						</label>
						<div className="relative">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black/40">
								<User className="h-5 w-5" />
							</div>
							<input
								id="name"
								name="name"
								type="text"
								required
								value={formData.name}
								onChange={handleChange}
								className="h-11 w-full rounded-md border border-black/12 bg-[#f8f9fc] pl-10 pr-3 text-sm outline-none transition focus:border-black/30"
								placeholder="Your full name"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="email" className="mb-1 block text-sm font-medium text-black/75">
							Email
						</label>
						<div className="relative">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black/40">
								<Mail className="h-5 w-5" />
							</div>
							<input
								id="email"
								name="email"
								type="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="h-11 w-full rounded-md border border-black/12 bg-[#f8f9fc] pl-10 pr-3 text-sm outline-none transition focus:border-black/30"
								placeholder="you@example.com"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="number" className="mb-1 block text-sm font-medium text-black/75">
							Phone Number
						</label>
						<div className="relative">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black/40">
								<Phone className="h-5 w-5" />
							</div>
							<input
								id="number"
								name="number"
								type="tel"
								required
								value={formData.number}
								onChange={handleChange}
								className="h-11 w-full rounded-md border border-black/12 bg-[#f8f9fc] pl-10 pr-3 text-sm outline-none transition focus:border-black/30"
								placeholder="Your phone number"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="password" className="mb-1 block text-sm font-medium text-black/75">
							Password
						</label>
						<div className="relative">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black/40">
								<Lock className="h-5 w-5" />
							</div>
							<input
								id="password"
								name="password"
								type={showPassword ? "text" : "password"}
								required
								minLength={6}
								value={formData.password}
								onChange={handleChange}
								className="h-11 w-full rounded-md border border-black/12 bg-[#f8f9fc] pl-10 pr-10 text-sm outline-none transition focus:border-black/30"
								placeholder="Minimum 6 characters"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-0 flex items-center pr-3 text-black/40 hover:text-black/70 focus:outline-none"
							>
								{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
							</button>
						</div>
					</div>

					{/* role is fixed to `user` — no selection UI */}

					{error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
					{success ? <p className="text-sm font-medium text-emerald-700"></p> : null}

					<button
						type="submit"
						disabled={isSubmitting}
						className="h-11 w-full rounded-md bg-black text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "Creating account..." : "Sign Up"}
					</button>

				</form>

				<p className="mt-5 text-center text-sm text-black/65">
					Already have an account?{" "}
					<Link href="/signin" className="font-semibold text-black underline decoration-black/35 underline-offset-4">
						Sign in
					</Link>
				</p>
			</section>
		</main>
	);
}
