"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Smartphone } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TemplateDetail from "./TemplateDetail";
import TemplateForm, { initialForm } from "./TemplateForm";

// Register ScrollTrigger at module level so it is guaranteed to be ready
// before any child templates run their useGSAP hook synchronously on mount
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function getPriceLabel(template) {
  const raw = template?.sellPrice;
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
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeTabIndex = allowedTabs.indexOf(activeTab);
  const isFirstTab = activeTabIndex === 0;
  const isLastTab = activeTabIndex === allowedTabs.length - 1;

  const goToPreviousTab = () => {
    if (activeTabIndex > 0) {
      setActiveTab(allowedTabs[activeTabIndex - 1]);
    }
  };

  const goToNextTab = () => {
    if (activeTabIndex < allowedTabs.length - 1) {
      setActiveTab(allowedTabs[activeTabIndex + 1]);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    <div className="h-screen w-full bg-[#fcfaf8] text-black font-sans relative flex flex-col select-none overflow-hidden">
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
          {/* Dynamic Auto-Saving Status Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saveStatus === "saving"}
            className={`rounded border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition duration-200 flex items-center gap-2 select-none cursor-pointer ${saveStatus === "saving"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70"
              }`}
          >
            {saveStatus === "saving" ? (
              <>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Saved</span>
              </>
            )}
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
      <main className="absolute top-14 bottom-18 left-0 right-0 flex flex-col lg:flex-row overflow-hidden bg-[#fcfaf8]">
        {/* Left Column: Fixed/Scrollable Form Panel */}
        <section className="w-full lg:w-[480px] xl:w-[540px] h-full bg-white lg:border-r border-black/10 z-30 overflow-y-auto hide-scrollbar ">
          <TemplateForm
            ref={formRef}
            key={templateKey || "template-form"}
            template={template}
            onPreviewChange={setPreviewData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            allowedTabs={allowedTabs}
            onSubmittingChange={setIsSubmitting}
          />
        </section>

        {/* Right Column: Live Preview Page Flow (Scrolls independently within its viewport boundary, hidden on mobile) */}
        <section
          id="preview-scroller-container"
          className="hidden lg:flex flex-1 h-full bg-[#f6f3ef] overflow-y-auto px-6 py-8 flex-col items-center relative select-none"
        >
          <div className="w-full max-w-[375px] mb-4 flex justify-between items-center text-black/45 px-2 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Live Preview</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider">
              <Smartphone className="size-3.5" /> Mobile view
            </span>
          </div>

          {/* Clean Mobile-Sized Invitation Card (No thick device frame/border) */}
          <div className="w-full max-w-[375px] shadow-[0_22px_60px_rgba(0,0,0,0.12)] rounded-[24px] bg-white border border-black/10 overflow-hidden shrink-0">
            {isMounted && (
              <TemplateDetail key={templateKey || "template-detail"} template={template} formData={previewData} fullscreen={true} />
            )}
          </div>
        </section>
      </main>

      {/* Bottom Bar Controls (Fixed, White with backdrop blur) */}
      <footer className="fixed bottom-0 left-0 w-full h-18 bg-white/86 backdrop-blur-xl border-t border-black/8 flex items-center justify-between px-4 sm:px-6 z-[1000] shadow-[0_-2px_12px_rgba(0,0,0,0.03)]">
        {/* Desktop View Bottom Bar (Original Theme Info & Direct Publish Button) */}
        <div className="hidden lg:flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="border border-black/15 px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#74313d] transition hover:bg-[#74313d] hover:text-white rounded shrink-0"
            >
              Change
            </Link>
            {template && (
              <div className="flex items-center gap-2 border-l border-black/10 pl-3">
                {previewImage && (
                  <div className="h-9 w-9 rounded overflow-hidden relative border border-black/5 shrink-0 bg-gray-100">
                    <img
                      src={previewImage}
                      alt={template.name || "Template Preview"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black/85 truncate max-w-[150px]">
                    {template.name}
                  </span>
                  <span className="text-[8px] text-black/45 uppercase tracking-widest">
                    Template Selected
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center text-center">
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
              disabled={isSubmitting}
              className="rounded bg-black hover:bg-black/90 text-white px-6 sm:px-8 py-2.5 text-xs font-bold uppercase tracking-wider transition duration-200 shadow-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              Publish
            </button>
          </div>
        </div>

        {/* Mobile View Bottom Bar (Wizard Navigation Flow) */}
        <div className="flex lg:hidden w-full items-center justify-between gap-2">
          <div>
            <button
              type="button"
              onClick={goToPreviousTab}
              disabled={isFirstTab}
              className="rounded border border-black/15 bg-white hover:bg-black/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              Previous
            </button>
          </div>

          {/* Template Info + Change button for Mobile View */}
          {template && (
            <div className="flex items-center gap-1.5 min-w-0 max-w-[120px] xs:max-w-[150px]">
              {previewImage && (
                <div className="h-6 w-6 rounded overflow-hidden relative border border-black/5 shrink-0 bg-gray-100">
                  <img
                    src={previewImage}
                    alt={template.name || "Preview"}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[9px] font-bold text-black/80 truncate">
                  {template.name}
                </span>
                <Link
                  href="/"
                  className="text-[8px] text-[#74313d] font-bold uppercase tracking-wider hover:underline"
                >
                  Change
                </Link>
              </div>
            </div>
          )}

          <div>
            {isLastTab ? (
              <button
                type="button"
                onClick={() => formRef.current?.submit()}
                disabled={isSubmitting}
                className="rounded bg-[#74313d] hover:bg-[#74313d]/90 text-white px-5 sm:px-8 py-2 text-xs font-bold uppercase tracking-wider transition duration-200 shadow-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                Publish
              </button>
            ) : (
              <button
                type="button"
                onClick={goToNextTab}
                className="rounded bg-black hover:bg-black/90 text-white px-5 sm:px-8 py-2 text-xs font-bold uppercase tracking-wider transition duration-200 shadow-md cursor-pointer"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Floating Preview Button on Mobile Viewports */}
      {/* <button
        type="button"
        onClick={() => setShowPreviewModal(true)}
        className="fixed bottom-22 left-1/2 z-1000 -translate-x-1/2 rounded-full bg-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_12px_36px_rgba(0,0,0,0.3)] lg:hidden transition hover:scale-105 active:scale-95 cursor-pointer"
      >
        Preview Invite
      </button> */}

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
