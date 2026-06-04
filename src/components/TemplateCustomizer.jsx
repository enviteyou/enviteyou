"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Smartphone } from "lucide-react";
import TemplateDetail from "./TemplateDetail";
import TemplateForm, { initialForm } from "./TemplateForm";

function getPriceLabel(template) {
  const raw = template?.pricing || template?.sellPrice || "1499";
  const s = String(raw).trim();
  if (/₹/.test(s)) return s;
  if (/\bINR\b/i.test(s)) return s.replace(/\bINR\b/i, "₹");
  return `₹ ${s}`;
}

export default function TemplateCustomizer({ template }) {
  const formRef = useRef(null);
  const templateKey = useMemo(
    () => String(template?.templateId || template?.id || template?._id || template?.name || "").trim().toLowerCase(),
    [template?.templateId, template?.id, template?._id, template?.name],
  );

  const allowedTabs = useMemo(() => {
    const tabs = template?.allowedTabs || [];
    return tabs.length > 0 ? tabs : ["Essentials", "Invitation", "Events", "Story", "Gallery", "Info", "RSVP", "Music"];
  }, [template?.allowedTabs]);

  const [previewData, setPreviewData] = useState(initialForm);
  const [activeTab, setActiveTab] = useState(allowedTabs[0] || "Essentials");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); // "saving" | "saved"
  const isFirstRender = useRef(true);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    setPreviewData(initialForm);
    setActiveTab(allowedTabs[0] || "Essentials");
  }, [templateKey, allowedTabs]);

  // Track draft saving status animation
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus("saving");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus("saved");
    }, 800);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [previewData]);

  // Reset first render flag when template changes
  useEffect(() => {
    isFirstRender.current = true;
    setSaveStatus("saved");
  }, [templateKey]);

  const handleSaveDraft = () => {
    toast.success("Draft saved successfully!");
  };

  const priceLabel = getPriceLabel(template);
  const previewImage = template?.featuredImage || template?.preview || "";

  return (
    <div className="min-h-screen w-full bg-[#fcfaf8] text-black font-sans relative flex flex-col select-none">
      {/* Top Bar Header (Fixed, White with backdrop blur) */}
      <header className="fixed top-0 left-0 w-full h-14 bg-white/86 backdrop-blur-xl border-b border-black/8 flex items-center justify-between px-4 sm:px-6 z-[1000] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center transition hover:opacity-90">
            <Image
              src="/logo.png"
              alt="EnviteYou Logo"
              width={110}
              height={40}
              priority
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Autosave Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-black/50 pr-2 select-none min-w-[75px] justify-end">
            {saveStatus === "saving" ? (
              <>
                <div className="size-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#a26815] animate-pulse">Saving...</span>
              </>
            ) : (
              <>
                <div className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">Saved</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded bg-black/5 hover:bg-black/10 text-black/80 border border-black/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition duration-200 cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="rounded bg-black hover:bg-black/90 text-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition duration-200 shadow cursor-pointer"
          >
            Preview
          </button>
        </div>
      </header>

      {/* Main Split Pane Workspace */}
      <main className="w-full flex-1 flex flex-col lg:flex-row relative">
        {/* Left Column: Fixed/Scrollable Form Panel */}
        <section className="w-full lg:w-[480px] xl:w-[540px] lg:fixed lg:top-14 lg:left-0 lg:bottom-18 lg:h-[calc(100vh-3.5rem-4.5rem)] bg-white lg:border-r border-black/10 z-30 overflow-y-auto hide-scrollbar px-5 py-6 sm:px-6">
          <TemplateForm
            ref={formRef}
            key={templateKey || "template-form"}
            template={template}
            onPreviewChange={setPreviewData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            allowedTabs={allowedTabs}
          />
        </section>

        {/* Right Column: Live Preview Page Flow (Scrolls with main window for GSAP animations) */}
        <section className="w-full lg:ml-[480px] xl:ml-[540px] flex-1 bg-[#f6f3ef] flex flex-col items-center p-6 pt-24 pb-32 relative">
          <div className="w-full max-w-[375px] mb-4 flex justify-between items-center text-black/45 px-2 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Live Preview</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
              <Smartphone className="size-3.5" /> Mobile view
            </span>
          </div>

          {/* Clean Mobile-Sized Invitation Card (No thick device frame/border) */}
          <div className="w-full max-w-[375px] shadow-[0_22px_60px_rgba(0,0,0,0.12)] rounded-[24px] bg-white border border-black/10 overflow-hidden shrink-0">
            <TemplateDetail key={templateKey || "template-detail"} template={template} formData={previewData} fullscreen={true} />
          </div>
        </section>
      </main>

      {/* Bottom Bar Controls (Fixed, White with backdrop blur) */}
      <footer className="fixed bottom-0 left-0 w-full h-18 bg-white/86 backdrop-blur-xl border-t border-black/8 flex items-center justify-between px-4 sm:px-6 z-[1000] shadow-[0_-2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          {previewImage ? (
            <img
              src={previewImage}
              alt={template?.name}
              className="h-10 w-10 object-cover rounded border border-black/10 bg-black/5"
            />
          ) : (
            <div className="h-10 w-10 bg-black/5 rounded flex items-center justify-center text-[10px] font-semibold text-black/40 border border-black/10">
              Theme
            </div>
          )}
          <div>
            <p className="text-[9px] uppercase tracking-wider text-black/40">Selected Theme</p>
            <p className="text-xs font-semibold tracking-tight text-black">{template?.name || "Wedding Website"}</p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-black/80 font-medium">
            <span className="text-sm font-bold text-black">{priceLabel}</span>
            <span className="text-[10px] text-black/45">one-time</span>
          </div>
          <p className="text-[9px] text-black/40 tracking-wide mt-0.5">
            Personal Dashboard • Mobile Optimized • WhatsApp Sharing
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => formRef.current?.submit()}
            className="rounded bg-black hover:bg-black/90 text-white px-6 sm:px-8 py-2.5 text-xs font-bold uppercase tracking-wider transition duration-200 shadow-md cursor-pointer"
          >
            Publish
          </button>
        </div>
      </footer>

      {/* Floating Preview Button on Mobile Viewports */}
      <button
        type="button"
        onClick={() => setShowPreviewModal(true)}
        className="fixed bottom-22 left-1/2 z-1000 -translate-x-1/2 rounded-full bg-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_12px_36px_rgba(0,0,0,0.3)] lg:hidden transition hover:scale-105 active:scale-95 cursor-pointer"
      >
        Preview Invite
      </button>

      {/* Fullscreen Mobile Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[5000] bg-[#faf7f3] overflow-y-auto flex flex-col">
          <div className="sticky top-0 bg-white border-b border-black/10 px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between z-50 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#74313d] bg-[#74313d]/10 px-2.5 py-1 rounded">Live Preview</span>
              <h3 className="font-semibold text-sm sm:text-base text-black">{template?.name || "Wedding Website"}</h3>
            </div>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="bg-black text-white px-5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-full hover:bg-black/90 transition shadow cursor-pointer"
            >
              Close Preview
            </button>
          </div>
          <div className="flex-1 w-full max-w-[390px] mx-auto py-8 px-4 flex justify-center items-start">
            {/* Clean Mobile-Sized Invitation Card inside modal (No thick device frame/border) */}
            <div className="w-full max-w-[375px] shadow-[0_22px_60px_rgba(0,0,0,0.12)] rounded-[24px] bg-white border border-black/10 overflow-hidden">
              <TemplateDetail key={templateKey || "template-detail"} template={template} formData={previewData} fullscreen={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
