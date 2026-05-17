"use client";

import { useState } from "react";
import api from "@/api/axios";

export default function AdminSignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/signin", form);
      window.location.href = "/admin";
    } catch (err) {
      setError(err?.response?.data?.message || "Signin failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-5 py-8 text-black">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <section className="grid w-full overflow-hidden border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-black/10 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">EnviteYou Admin</p>
            <h1 className="mt-5 max-w-md text-4xl font-semibold tracking-tight text-black sm:text-5xl">
              Template control for premium invitations.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-black/60">
              Sign in to manage wedding template artwork, pricing, categories, and catalog details.
            </p>

            <div className="mt-10 grid gap-3">
              {["Create new templates", "Update catalog pricing", "Manage featured artwork"].map((item) => (
                <div key={item} className="flex items-center gap-3 border border-black/10 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-black" />
                  <span className="text-sm font-medium text-black">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center p-8 sm:p-10 lg:p-12">
            <div className="w-full">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Secure access</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Admin Signin</h2>
              <p className="mt-3 text-sm leading-6 text-black/55">
                Use your admin credentials to continue to the dashboard.
              </p>

              {error ? (
                <div className="mt-5 border border-black bg-black px-4 py-3 text-sm font-medium text-white">
                  {error}
                </div>
              ) : null}

              <form  className="mt-6 grid gap-4">
                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                  Email
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5"
                    placeholder="admin@enviteyou.com"
                  />
                </label>

                <label className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
                  Password
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="mt-2 w-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5"
                    placeholder="Enter password"
                  />
                </label>

                <button
                  disabled={loading}
                  className="mt-2 bg-black px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Signin"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
