"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

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

  if (!template) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-black shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Template not found</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Choose a design from the gallery.</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/60">
          This template link does not match the current temporary data. Go back to the homepage and select one
          of the available wedding website templates.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">
          View Templates
        </Link>
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

  return (
    <article className="rounded border border-black/10 bg-white p-3 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-5">
      <div
        ref={previewScrollRef}
        className="mx-auto max-h-[calc(100vh-3rem)] w-full max-w-97.5 overflow-y-auto rounded bg-white shadow-[0_22px_60px_rgba(0,0,0,0.14)] scrollbar-thin scrollbar-track-white scrollbar-thumb-black [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black"
      >
        <section ref={essentialsRef} className="relative aspect-9/12 overflow-hidden bg-black">
          {template.preview ? (
            <img
              src={template.preview}
              alt={`${template.name} wedding website preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm font-semibold text-white">
              Preview coming soon
            </div>
          )}

          <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-black">
            {template.tag}
          </div>

          <div className="absolute left-1/2 top-1/2 flex w-[66%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center bg-[#e7ddcf]/90 px-3 py-7 text-center shadow-[0_0_36px_28px_rgba(231,221,207,0.78)] backdrop-blur-[1px]">
            <p className="max-w-full wrap-break-word font-serif text-[clamp(2rem,9vw,3.35rem)] leading-none text-[#554534]">
              {firstName}
            </p>
            <p className="mt-2 font-serif text-[clamp(1.1rem,4.8vw,1.9rem)] italic leading-none text-[#554534]">
              Weds
            </p>
            <p className="mt-2 max-w-full wrap-break-word font-serif text-[clamp(2rem,9vw,3.35rem)] leading-none text-[#554534]">
              {secondName}
            </p>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-4 text-white">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/70">Live preview</p>
            <p className="mt-1 text-xs font-medium text-white/90">{formatDate(formData?.date)}</p>
          </div>
        </section>

        <section className="bg-white px-5 py-5 text-left text-black">
          <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-5">
            <div>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black/45">Selected template</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">{template.name}</h2>
            </div>
            <div className="rounded-full bg-black px-4 py-2 text-[0.65rem] font-semibold text-white">{template.price}</div>
          </div>

          <section ref={invitationRef} className="border-b border-black/10 py-5">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black/45">Invitation details</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-black">{coupleNames}</h3>
            <p className="mt-3 text-xs leading-5 text-black/60">
              {getValue(formData?.blessing, "With the blessings of our families, we invite you to celebrate with us.")}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <InfoBox label="Wedding date" value={formatDate(formData?.date)} />
              <InfoBox label="Venue" value={getValue(formData?.venue, "Wedding venue")} />
              <InfoBox label="WhatsApp" value={getValue(formData?.whatsapp, "Contact number")} />
              <InfoBox label="Hashtag" value={getValue(formData?.hashtag, "#WeddingHashtag")} />
            </div>
          </section>

          {formData?.invitation ? (
            <section className="border-b border-black/10 py-5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black/45">Families</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {reverseOrder ? (
                  <>
                    <InfoBox label="Groom family" value={`${getValue(formData?.groomFather, "Groom father")} / ${getValue(formData?.groomMother, "Groom mother")}`} />
                    <InfoBox label="Bride family" value={`${getValue(formData?.brideFather, "Bride father")} / ${getValue(formData?.brideMother, "Bride mother")}`} />
                  </>
                ) : (
                  <>
                    <InfoBox label="Bride family" value={`${getValue(formData?.brideFather, "Bride father")} / ${getValue(formData?.brideMother, "Bride mother")}`} />
                    <InfoBox label="Groom family" value={`${getValue(formData?.groomFather, "Groom father")} / ${getValue(formData?.groomMother, "Groom mother")}`} />
                  </>
                )}
              </div>
              {showGrandparents ? (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <InfoBox
                    label="Bride's grandparents"
                    value={`${getValue(formData?.brideGrandfather, "Bride's grandfather")} / ${getValue(formData?.brideGrandmother, "Bride's grandmother")}`}
                  />
                  <InfoBox
                    label="Groom's grandparents"
                    value={`${getValue(formData?.groomGrandfather, "Groom's grandfather")} / ${getValue(formData?.groomGrandmother, "Groom's grandmother")}`}
                  />
                </div>
              ) : null}
            </section>
          ) : null}

          <section ref={eventsRef} className="border-b border-black/10 py-5">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black/45">Events</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {events.map((eventName) => (
                <span key={eventName} className="border border-black/10 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-black/65">
                  {eventName}
                </span>
              ))}
            </div>
            {hasEventDetails ? (
              <div className="mt-3 border border-black/10 p-3">
                <p className="text-xs font-semibold text-black">{firstEvent || "Selected"} event detail</p>
                <p className="mt-1 text-xs leading-5 text-black/60">{eventLine || "Event date, time and venue"}</p>
                {firstEventDetail?.oneLiner || formData?.eventNotes ? (
                  <p className="mt-1 text-xs leading-5 text-black/60">{firstEventDetail?.oneLiner || formData?.eventNotes}</p>
                ) : null}
              </div>
            ) : null}
          </section>

          {formData?.storyEnabled ? (
            <section ref={storyRef} className="border-b border-black/10 py-5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black/45">{getValue(formData?.storyTitle, "Our Story")}</p>
              <p className="mt-2 text-xs leading-5 text-black/60">
                {getValue(formData?.story, "Your story will appear here as soon as you write it.")}
              </p>
              {formData?.generatedTags || formData?.customHashtags || formData?.extraTags ? (
                <div className="mt-4 grid gap-2">
                  {formData?.generatedTags ? (
                    <div>
                      <p className="text-xs font-semibold text-black/45">Generated tags</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {formData.generatedTags.split(",").map((tag) => (
                          <span key={tag} className="rounded border border-black/10 bg-white px-3 py-1 text-sm text-black/70">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {formData?.customHashtags ? (
                    <div>
                      <p className="text-xs font-semibold text-black/45">Custom hashtag</p>
                      <div className="mt-1">
                        <span className="rounded border border-black/10 bg-white px-3 py-1 text-sm text-black/70">{formData.customHashtags}</span>
                      </div>
                    </div>
                  ) : null}

                  {formData?.extraTags ? (
                    <div>
                      <p className="text-xs font-semibold text-black/45">Extra tags</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {formData.extraTags.split(",").map((tag) => (
                          <span key={tag} className="rounded border border-black/10 bg-white px-3 py-1 text-sm text-black/70">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          ) : null}

          {formData?.galleryEnabled ? (
            <section ref={galleryRef} className="border-b border-black/10 py-5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black/45">Gallery</p>
              <p className="mt-2 text-xs leading-5 text-black/60">{getValue(formData?.galleryNote, "Your photo gallery note will appear here.")}</p>
              <div className="mt-3 grid gap-3">
                {Array.isArray(formData?.galleryImages) && formData.galleryImages.length > 0 ? (
                  <div className={formData.galleryLayout === 1 ? "" : formData.galleryLayout === 2 ? "grid grid-cols-2 gap-3" : formData.galleryLayout === 4 ? "grid grid-cols-2 gap-3" : ""}>
                    {formData.galleryLayout === 1 && formData.galleryImages[0] ? (
                      <div className="relative aspect-[16/9] overflow-hidden border border-black/10">
                        <img src={formData.galleryImages[0]} alt="gallery-1" className="h-full w-full object-cover" />
                      </div>
                    ) : null}

                    {(formData.galleryLayout === 2 || formData.galleryLayout === 4) ? (
                      formData.galleryImages.slice(0, formData.galleryLayout).map((src, i) => (
                        <div key={i} className="relative aspect-[4/3] overflow-hidden border border-black/10">
                          {src ? <img src={src} alt={`gallery-${i}`} className="h-full w-full object-cover" /> : null}
                        </div>
                      ))
                    ) : null}
                  </div>
                ) : formData?.coverImage ? (
                  <div className="relative mt-3 aspect-4/3 overflow-hidden border border-black/10 bg-black">
                    <img src={formData.coverImage} alt="Wedding gallery cover" className="h-full w-full object-cover" />
                  </div>
                ) : null}
              </div>
            </section>
          ) : (
            <div ref={galleryRef} />
          )}

          <div ref={infoRef} className="grid grid-cols-2 gap-2 py-5">
            {formData?.infoEnabled ? (
              (() => {
                const infoMap = formData?.infoCards && typeof formData.infoCards === 'object'
                  ? formData.infoCards
                  : null;
                const entries = infoMap ? Object.entries(infoMap) : [];
                if (entries.length > 0) {
                  return entries.slice(0, 4).map(([k, v]) => <InfoBox key={k} label={k} value={getValue(v, "-")} />);
                }

                return (
                  <>
                    <InfoBox label="Dress code" value={getValue(formData?.dressCode, "Dress code details")} />
                    <InfoBox label="Parking" value={getValue(formData?.parking, "Parking details")} />
                  </>
                );
              })()
            ) : null}
          </div>

          {formData?.rsvpEnabled ? (
            <section ref={rsvpRef} className="border-t border-black/10 py-5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black/45">RSVP</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <InfoBox label="RSVP deadline" value={formatDate(formData?.rsvpDeadline)} />
                <InfoBox label="Meal preference" value={formData?.mealPreference ? "Enabled" : "Not requested"} />
              </div>
              {formData?.guestQuestions ? <p className="mt-3 text-xs leading-5 text-black/60">{formData.guestQuestions}</p> : null}
            </section>
          ) : (
            <div ref={rsvpRef} />
          )}

          {formData?.musicEnabled ? (
            <section ref={musicRef} className="border-t border-black/10 py-5">
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black/45">Music</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <InfoBox label="Song" value={getValue(formData?.songTitle, "Wedding music")} />
                <InfoBox label="Autoplay" value={formData?.autoplayMusic ? "Enabled" : "Tap to play"} />
              </div>
            </section>
          ) : (
            <div ref={musicRef} />
          )}

          <p className="border-t border-black/10 pt-5 text-xs leading-5 text-black/60">{template.description}</p>

          <div className="mt-5 grid grid-cols-2 gap-2">
            <InfoBox label="Palette" value={template.palette} rounded />
            <InfoBox label="Best for" value={template.bestFor} rounded />
          </div>

          <div className="mt-5">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-black/45">What is included</p>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {template.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-[0.68rem] font-medium text-black">
                  <span className="h-1.5 w-1.5 rounded-full bg-black" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

function InfoBox({ label, value, rounded = false }) {
  return (
    <div className={`border border-black/10 p-3 ${rounded ? "rounded-xl" : ""}`}>
      <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-black/45">{label}</p>
      <p className="mt-1 text-[0.68rem] font-medium leading-4 text-black">{value}</p>
    </div>
  );
}
