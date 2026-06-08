"use client";

import { useState } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import { Send, Phone, Mail, MapPin, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactUsPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    number: "",
    enquiry: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const updateField = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await api.post("/enquiries/create", form);

      if (response.status === 201) {
        setStatus({
          type: "success",
          message: "Enquiry submitted successfully! Confirmation emails have been sent.",
        });
        toast.success("Enquiry submitted successfully!");
        setForm({ name: "", email: "", number: "", enquiry: "" });
      } else {
        throw new Error(response.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || error.message || "Failed to submit enquiry. Please try again.";
      setStatus({
        type: "error",
        message: errMsg,
      });
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfaf8] min-h-screen pt-28  text-black">
      <div className="mx-auto max-w-7xl mb-10 px-5 sm:px-10">
        
        
        {/* <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#74313d]">Get in Touch</p>
          <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl font-heading">
            Connect With EnviteYou
          </h1>
          <p className="text-sm sm:text-base text-black/55 font-sans leading-relaxed">
            Have questions about templates, customization options, pricing, or vendor services? Drop us an enquiry below and our design specialists will get back to you.
          </p>
        </div> */}

        {/* Form and Contact Detail Row */}
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] max-w-5xl mx-auto">
          
          {/* Enquiry Form */}
          <section className="border border-black/5 bg-white p-6 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-black font-heading">Send an Enquiry</h2>
              <p className="text-xs text-black/45 mt-1">Fill out the details below and we will reach out shortly.</p>
            </div>

            {status.message && (
              <div
                className={`flex items-start gap-3 rounded-xl border p-4 text-xs font-semibold ${
                  status.type === "success"
                    ? "border-emerald-100 bg-emerald-50/50 text-emerald-800"
                    : "border-red-100 bg-red-50/50 text-red-800"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle className="size-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-600" />
                )}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#74313d]/60 block">
                  Your Name
                  <input
                    required
                    disabled={loading}
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="mt-2 w-full border border-black/10 bg-[#fbf9f7] rounded-xl px-4 py-3.5 text-sm text-black outline-none transition-all placeholder:text-black/35 focus:border-[#74313d] focus:bg-white focus:ring-4 focus:ring-[#74313d]/5"
                  />
                </label>

                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#74313d]/60 block">
                  Email Address
                  <input
                    required
                    disabled={loading}
                    type="email"
                    placeholder="john.doe@example.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="mt-2 w-full border border-black/10 bg-[#fbf9f7] rounded-xl px-4 py-3.5 text-sm text-black outline-none transition-all placeholder:text-black/35 focus:border-[#74313d] focus:bg-white focus:ring-4 focus:ring-[#74313d]/5"
                  />
                </label>
              </div>

              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#74313d]/60 block">
                Contact Number
                <input
                  required
                  disabled={loading}
                  type="tel"
                  placeholder="+91 8828287278"
                  value={form.number}
                  onChange={(e) => updateField("number", e.target.value)}
                  className="mt-2 w-full border border-black/10 bg-[#fbf9f7] rounded-xl px-4 py-3.5 text-sm text-black outline-none transition-all placeholder:text-black/35 focus:border-[#74313d] focus:bg-white focus:ring-4 focus:ring-[#74313d]/5"
                />
              </label>

              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#74313d]/60 block">
                Enquiry Details
                <textarea
                  required
                  disabled={loading}
                  placeholder="Tell us what you're looking for (e.g., custom tab integrations, theme questions, payment configurations)..."
                  value={form.enquiry}
                  onChange={(e) => updateField("enquiry", e.target.value)}
                  className="mt-2 w-full border border-black/10 bg-[#fbf9f7] rounded-xl px-4 py-3.5 text-sm text-black outline-none transition-all placeholder:text-black/35 focus:border-[#74313d] focus:bg-white focus:ring-4 focus:ring-[#74313d]/5 min-h-36 resize-none leading-relaxed"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#74313d] hover:bg-[#5e232c] text-white py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-[#74313d]/15 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <Send className="size-4" />
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Sidebar details */}
          <aside className="space-y-6 flex flex-col justify-start">
            <div className="border border-black/5 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.015)] space-y-6">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-black font-heading">Support Channels</h3>
                <p className="text-xs text-black/45 mt-0.5">Reach out to our teams directly.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#74313d]/5 text-[#74313d] shrink-0 shadow-sm">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">Email Enquiries</p>
                    <a href="mailto:care@enviteyou.com" className="text-xs sm:text-sm font-semibold text-black hover:underline mt-0.5 block">
                      care@enviteyou.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#74313d]/5 text-[#74313d] shrink-0 shadow-sm">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">Whatsapp / Helpline</p>
                    <p className="text-xs sm:text-sm font-semibold text-black mt-0.5">
                     +91 8828287278
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-[#74313d]/5 text-[#74313d] shrink-0 shadow-sm">
                    <MapPin className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">Corporate Headquarters</p>
                    <p className="text-xs leading-relaxed text-black/60 mt-0.5 font-sans">
                      Elevate Ecommerce Synergies<br />
                      New Delhi, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#74313d]/10 bg-[#faf6f3] p-5 rounded-3xl shadow-xs">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#74313d]/60 font-sans">Corporate Promise</p>
              <h4 className="mt-1.5 text-sm font-semibold text-black">Rapid Response System</h4>
              <p className="mt-2 text-xs leading-relaxed text-black/50 font-sans">
                Our support agents audit submitted inquiries in real-time. We commit to a maximum response latency of 12 business hours.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
