"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/api/axios";

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
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-black">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <section className="grid w-full overflow-hidden border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-black/10 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
              Envite Admin
            </p>
            <h1 className="mt-5 max-w-md text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              Manage invitations with focused admin access.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-black/60">
              Sign in to review templates, update catalog details, and keep the invitation
              collection ready for customers.
            </p>

            <div className="mt-10 grid gap-3">
              {["Template catalog", "User overview", "Admin dashboard"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border border-black/10 bg-[#fbfbfa] px-4 py-3"
                >
                  <span className="h-2 w-2 rounded-full bg-black" />
                  <span className="text-sm font-medium text-black">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center p-8 sm:p-10 lg:p-12">
            <div className="w-full">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
                Secure access
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Admin sign in</h2>
              <p className="mt-3 text-sm leading-6 text-black/55">
                Enter your admin email and password to continue.
              </p>

              {message ? (
                <div className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {message}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                  Email
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-black outline-none transition placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5"
                    placeholder="admin@envite.com"
                    autoComplete="email"
                  />
                </label>

                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                  Password
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-black outline-none transition placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
