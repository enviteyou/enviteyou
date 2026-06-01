"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
export default function SigninPage() {
  // role selection removed — default to normal "user" role
  const router = useRouter();
  const { isUser, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      <main className="relative isolate min-h-screen overflow-hidden bg-white px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative mx-auto w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-black/60">
            Checking your session...
          </p>
        </section>
      </main>
    );
  }

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
      const message = token
        ? "Login successful."
        : response?.data?.message || "Login successful.";
      setSuccess(message);
      window.dispatchEvent(new Event("authChange"));
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        "Unable to login right now. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative isolate flex py-20 px-4 items-center justify-center">
      <Image
        src="/form_background.jpeg"
        alt="Background"
        width={2000}
        height={2000}
        priority
        className="absolute object-cover"
        style={{ zIndex: -1 }}
      />

      <section className="relative mx-auto w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(70,35,25,0.12)] sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <Image
            src="/icon.png"
            alt="EnviteYou"
            width={20}
            height={40}
            priority
          />
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-black/85">
            ENVITEYOU
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-black">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-black/65">
          Sign in to your EnviteYou account.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

          {error ? (
            <p className="text-sm font-medium text-red-600">{error}</p>
          ) : null}
          {success ? (
            <p className="text-sm font-medium text-emerald-700">{success}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-black text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-3 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-300"></div>

          <span className="text-sm text-gray-500">or</span>

          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <div className="mt-4 flex justify-center">
          <GoogleLogin
            theme="outline"
            onSuccess={async (credentialResponse) => {
              try {
                const token = credentialResponse?.credential;
                if (!token) return;
                const res = await api.post("/auth/google", {
                  token,
                  role,
                });
                const data = res?.data || {};
                setSuccess(data?.message || "Google login successful.");
                window.dispatchEvent(new Event("authChange"));
                setTimeout(() => {
                  router.push("/");
                }, 2000);
              } catch (error) {
                console.error("Google login error:", error);
                setError(
                  error.response?.data?.message ||
                    "An error occurred during Google login. Please try again.",
                );
                setSuccess("");
                return;
              }
            }}
            onError={() => {
              setError("Google login failed. Please try again.");
              setSuccess("");
            }}
            width="320"
            size="large"
            shape="rectangular"
          />
        </div>

        <p className="mt-5 text-center text-sm text-black/65">
          New here?{" "}
          <Link
            href="/signup"
            className="font-semibold text-black underline decoration-black/35 underline-offset-4"
          >
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}
