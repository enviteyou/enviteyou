"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const Template01 = dynamic(() => import("./templates/Template01"), { ssr: false });
const templateComponentMap = {
  "1": Template01,
  "2": Template01,
  "3": Template01,
  template01: Template01,
  default: Template01,
};

function formatDate(date) {
  if (!date) return "Wedding date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function getValue(value, fallback) {
  return value?.trim() || fallback;
}

export default function TemplateDetail({ template, formData, activeTab }) {
  const previewScrollRef = useRef(null);
  const essentialsRef = useRef(null);
  const invitationRef = useRef(null);
  const eventsRef = useRef(null);
  const storyRef = useRef(null);
  const galleryRef = useRef(null);
  const infoRef = useRef(null);
  const rsvpRef = useRef(null);
  const musicRef = useRef(null);

  useEffect(() => {
    const sectionRefs = {
      Essentials: essentialsRef,
      Invitation: invitationRef,
      Events: eventsRef,
      Story: storyRef,
      Gallery: galleryRef,
      Info: infoRef,
      RSVP: rsvpRef,
      Music: musicRef,
    };
    const container = previewScrollRef.current;
    const target = sectionRefs[activeTab]?.current;

    if (!container || !target) return;

    const containerTop = container.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    container.scrollTo({
      top: container.scrollTop + targetTop - containerTop - 12,
      behavior: "smooth",
    });
  }, [activeTab]);

  // Ensure mouse-wheel / touchpad scrolls the preview container when pointer is over it.
  useEffect(() => {
    const el = previewScrollRef.current;
    if (!el) return;

    const onWheel = (e) => {
      // allow default if modifier keys used
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // prevent the page from scrolling and scroll the preview instead
      e.preventDefault();
      el.scrollTop += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  if (!template) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-black shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Template not found</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Choose a design from the gallery.</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/60">
          This invitation is not available right now. Please contact the host and ask them to resend the link.
        </p>
      </div>
    );
  }

  const brideName = getValue(formData?.bride, "Bride");
  const groomName = getValue(formData?.groom, "Groom");
  const reverseOrder = formData?.nameOrder === "groomFirst";
  const firstName = reverseOrder ? groomName : brideName;
  const secondName = reverseOrder ? brideName : groomName;
  const coupleNames = formData?.bride || formData?.groom ? `${firstName} & ${secondName}` : "Bride & Groom";
  const events = formData?.selectedEvents?.length ? formData.selectedEvents : ["Mehendi", "Shaadi", "Reception"];
  const firstEvent = events[0];
  const firstEventDetail = formData?.eventDetails?.[firstEvent] || {};
  const hasEventDetails =
    firstEventDetail?.date ||
    firstEventDetail?.time ||
    firstEventDetail?.venue ||
    firstEventDetail?.oneLiner ||
    formData?.eventDate ||
    formData?.eventTime ||
    formData?.eventVenue ||
    formData?.eventNotes;
  const showGrandparents =
    Boolean(formData?.grandparentsEnabled) ||
    Boolean(formData?.brideGrandfather || formData?.brideGrandmother || formData?.groomGrandfather || formData?.groomGrandmother);
  const eventLine = [
    firstEventDetail?.date ? formatDate(firstEventDetail.date) : formData?.eventDate ? formatDate(formData.eventDate) : null,
    firstEventDetail?.time || formData?.eventTime || null,
    firstEventDetail?.venue || formData?.eventVenue || null,
  ]
    .filter(Boolean)
    .join(" | ");

  const normalizedTemplateId = String(template?.templateId || template?.id || template?.slug || template?.previewComponent || template?.name || "default")
    .toLowerCase()
    .trim();
  const SelectedTemplate = templateComponentMap[normalizedTemplateId] || templateComponentMap.default;
 

  return (
    <article className="rounded border border-black/10 bg-white p-3 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-5 lg:sticky lg:top-6">
      <div
        ref={previewScrollRef}
        className="mx-auto w-full max-w-97.5  overflow-x-hidden rounded bg-white shadow-[0_22px_60px_rgba(0,0,0,0.14)] hide-scrollbar"
        style={{ overflowY: "auto", maxHeight: "calc(100vh - 96px)" }}
      >
        <section ref={essentialsRef} className="relative aspect-9/12 bg-black">
          <div className="min-h-full w-full">
            <SelectedTemplate formData={formData} template={template} embedded />
          </div>
        </section>
      </div>
    </article>
  );
}
