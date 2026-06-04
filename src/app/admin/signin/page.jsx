"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";
import { Shield, KeyRound, Mail, AlertCircle } from "lucide-react";

export default function AdminSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/auth/login-admin", { email, password });

      if (res.status === 200) {
        router.push("/admin");
      }
    } catch (err) {
      const status = err?.response?.status;

      if (status === 403) {
        alert("Unauthorized access");
      } else if (status === 400) {
        setMessage(err?.response?.data?.message || "Invalid credentials");
      } else {
        setMessage("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf8f6] px-4 py-8 text-black flex items-center justify-center font-sans">
      <div className="w-full max-w-5xl">
        <section className="grid w-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.03)] lg:grid-cols-[0.95fr_1.05fr]">
          
          {/* Left Column - Presentation Panel */}
          <div className="border-b border-black/5 bg-[#faf6f3]/60 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#74313d] text-white shadow-md shadow-[#74313d]/15">
                  <Shield className="size-4.5" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-black font-heading">EnviteYou</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">Admin Portal</p>
                <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl font-heading leading-tight">
                  Manage invitations with focused admin access.
                </h1>
                <p className="max-w-md text-sm leading-relaxed text-black/55">
                  Sign in to review templates, update catalog details, authenticate vendors, and keep the invitation collections ready for customers.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-3">
              {["Template catalog management", "Vendor approvals console", "Platform overview metrics"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border border-black/5 bg-white/70 p-3.5 rounded-xl text-xs font-semibold text-black/70 shadow-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#74313d]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Form Panel */}
          <div className="flex items-center p-8 sm:p-10 lg:p-12">
            <div className="w-full space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">Secure Access</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black font-heading">Admin Sign In</h2>
                <p className="mt-2 text-sm text-black/50">
                  Enter your admin credentials below to log in to the studio workspace.
                </p>
              </div>

              {message ? (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50/50 p-4 text-xs font-semibold text-red-700">
                  <AlertCircle className="size-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{message}</span>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#74313d]/60 block">
                  Email Address
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-black/35" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 w-full border border-black/10 bg-[#fbf9f7] rounded-xl pl-11 pr-4 py-3.5 text-sm normal-case tracking-normal text-black outline-none transition-all placeholder:text-black/30 focus:border-[#74313d] focus:bg-white focus:ring-4 focus:ring-[#74313d]/5"
                      placeholder="admin@enviteyou.com"
                      autoComplete="email"
                    />
                  </div>
                </label>

                <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#74313d]/60 block">
                  Password Key
                  <div className="relative">
                    <KeyRound className="absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-black/35" />
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-2 w-full border border-black/10 bg-[#fbf9f7] rounded-xl pl-11 pr-4 py-3.5 text-sm normal-case tracking-normal text-black outline-none transition-all placeholder:text-black/30 focus:border-[#74313d] focus:bg-white focus:ring-4 focus:ring-[#74313d]/5"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#74313d] hover:bg-[#5a202a] text-white py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-[#74313d]/15 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Signing in..." : "Sign In to Workspace"}
                </button>
              </form>
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}
