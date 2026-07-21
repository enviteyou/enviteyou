"use client";

import { useState, useEffect } from "react";
import api from "@/api/axios";
import { toast } from "sonner";
import { X, Mail, KeyRound, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordModal({ isOpen, onClose, initialEmail = "" }) {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: New Password
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail || "");
      setStep(1);
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [isOpen, initialEmail]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  if (!isOpen) return null;

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/send-reset-otp", { email: email.trim() });
      if (res.data?.success) {
        toast.success(res.data.message || "OTP sent to your email!");
        setStep(2);
        setResendTimer(60); // 60s cooldown
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/send-reset-otp", { email: email.trim() });
      if (res.data?.success) {
        toast.success("A new OTP has been sent to your email.");
        setResendTimer(60);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-reset-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });
      if (res.data?.success) {
        toast.success("OTP verified! Set your new password.");
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      });

      if (res.data?.success) {
        toast.success("Password updated successfully! Please log in.");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-black/40 hover:bg-black/5 hover:text-black transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-black">
            {step === 1 && <Mail className="h-6 w-6" />}
            {step === 2 && <KeyRound className="h-6 w-6" />}
            {step === 3 && <Lock className="h-6 w-6" />}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-black">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h2>
          <p className="mt-1 text-xs text-black/50">
            {step === 1 && "Enter your registered email to receive a 6-digit OTP."}
            {step === 2 && `We sent a 6-digit code to ${email}`}
            {step === 3 && "Create a new strong password for your account."}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          <span className={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? "w-8 bg-black" : "w-2 bg-black/15"}`} />
          <span className={`h-2 rounded-full transition-all duration-300 ${step >= 2 ? "w-8 bg-black" : "w-2 bg-black/15"}`} />
          <span className={`h-2 rounded-full transition-all duration-300 ${step >= 3 ? "w-8 bg-black" : "w-2 bg-black/15"}`} />
        </div>

        {/* STEP 1 FORM */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                Registered Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black/40">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-black/10 bg-[#f8f9fc] pl-10 pr-3 text-sm text-black placeholder-black/30 outline-none transition focus:border-black"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-black hover:bg-black/90 disabled:opacity-60 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 FORM */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="reset-otp" className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                Enter 6-Digit OTP
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black/40">
                  <KeyRound className="h-4.5 w-4.5" />
                </div>
                <input
                  id="reset-otp"
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="h-11 w-full rounded-xl border border-black/10 bg-[#f8f9fc] pl-10 pr-3 text-base font-bold tracking-widest text-black placeholder-black/20 outline-none transition focus:border-black text-center"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-black hover:bg-black/90 disabled:opacity-60 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify OTP"}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-black/60 hover:text-black font-medium underline"
              >
                Change Email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || loading}
                className="text-black font-semibold disabled:text-black/30 hover:underline cursor-pointer"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 FORM */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="new-pass" className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black/40">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="new-pass"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="h-11 w-full rounded-xl border border-black/10 bg-[#f8f9fc] pl-10 pr-10 text-sm text-black outline-none transition focus:border-black"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-black/40 hover:text-black/70"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-pass" className="block text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black/40">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="confirm-pass"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="h-11 w-full rounded-xl border border-black/10 bg-[#f8f9fc] pl-10 pr-10 text-sm text-black outline-none transition focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-black hover:bg-black/90 disabled:opacity-60 text-white font-semibold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
