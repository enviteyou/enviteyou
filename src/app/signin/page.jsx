"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import api from "@/api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

const ROLES = {
	customer: "user",
	wholesaler: "wholesaler",
};

export default function SigninPage() {
	const [activeTab, setActiveTab] = useState("customer");
  const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const role = useMemo(() => ROLES[activeTab], [activeTab]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const switchTab = (tabKey) => {
		setActiveTab(tabKey);
		setError("");
		setSuccess("");
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setSuccess("");
		setIsSubmitting(true);

		try {
			const payload = {
				...formData,
				role,
			};

			const response = await api.post("/auth/login", payload);
			const token = response?.data?.token;
			const message = token ? "Login successful." : response?.data?.message || "Login successful.";
			setSuccess(message);
     setTimeout(() => {
        router.push("/");
      }, 2000);
		} catch (requestError) {
			const message = requestError?.response?.data?.message || "Unable to login right now. Please try again.";
			setError(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="relative isolate min-h-screen overflow-hidden bg-white px-4 py-10 sm:px-6 lg:px-8">

			<section className="relative mx-auto w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
				<p className="text-xs font-semibold uppercase tracking-[0.24em] text-black">EnviteYou Account</p>
				<h1 className="mt-2 text-3xl font-bold tracking-tight text-black">Welcome back</h1>
				<p className="mt-1 text-sm text-black/65">Select your account type and continue.</p>

				<div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-black/10 bg-white p-1.5">
					<button
						type="button"
						onClick={() => switchTab("customer")}
						className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
							activeTab === "customer"
								? "bg-black text-white shadow"
								: "text-black/70 hover:bg-black/5"
						}`}
					>
						Customer
					</button>
					<button
						type="button"
						onClick={() => switchTab("wholesaler")}
						className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
							activeTab === "wholesaler"
								? "bg-black text-white shadow"
								: "text-black/70 hover:bg-black/5"
						}`}
					>
						Wholesaler
					</button>
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

					<div className="rounded-xl border border-dashed border-black/15 bg-black/3 px-3 py-2 text-xs font-medium text-black/70">
						Selected role: <span className="font-bold uppercase">{role}</span>
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

        <div className="p-4">
        <GoogleLogin
        theme="outline"
        onSuccess={async (credentialResponse)=>{
          try {
            const token = credentialResponse?.credential;
            if(!token) return;
            const res = await api.post("/auth/google",{
              token,
              role
            });
            const data = res?.data || {};
            setSuccess(data?.message || "Google login successful.");
            setTimeout(() => {
              router.push("/");
            }, 2000);
          } catch (error) {
            console.error("Google login error:", error);
           setError(error.response?.data?.message || "An error occurred during Google login. Please try again.");
           setSuccess("");
           return;
          }
        }}
        onError={()=>{
          setError("Google login failed. Please try again.");
          setSuccess("");
        }}
         width="100%"
         size="large"
         shape="rectangular"
         />
        </div>

				<p className="mt-5 text-center text-sm text-black/65">
					New here?{" "}
					<Link href="/signup" className="font-semibold text-black underline decoration-black/35 underline-offset-4">
						Create account
					</Link>
				</p>
			</section>
		</main>
	);
}
