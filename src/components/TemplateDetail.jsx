import Image from "next/image";
import Link from "next/link";

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

export default function TemplateDetail({ template, formData }) {
  if (!template) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 text-black shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
          Template not found
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Choose a design from the gallery.</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-black/60">
          This template link does not match the current temporary data. Go back to the homepage and select one
          of the available wedding website templates.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
        >
          View Templates
        </Link>
      </div>
    );
  }

  const brideName = getValue(formData?.bride, "Bride");
  const groomName = getValue(formData?.groom, "Groom");
  const coupleNames =
    formData?.bride || formData?.groom
      ? `${brideName} & ${groomName}`
      : "Bride & Groom";
  const hasEventDetails = formData?.eventDate || formData?.eventTime || formData?.eventVenue || formData?.eventNotes;
  const eventLine = [
    formData?.eventDate ? formatDate(formData.eventDate) : null,
    formData?.eventTime || null,
    formData?.eventVenue || null,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <article className="sticky top-6 overflow-hidden rounded border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[4/3] bg-black">
        {template.preview ? (
          <Image
            src={template.preview}
            alt={`${template.name} wedding website preview`}
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-white">
            Preview coming soon
          </div>
        )}
        <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-black">
          {template.tag}
        </div>
        <div className="absolute left-1/2 top-1/2 flex w-[58%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center bg-[#e7ddcf]/90 px-4 py-8 text-center shadow-[0_0_45px_35px_rgba(231,221,207,0.82)] backdrop-blur-[1px] sm:py-10">
          <p className="max-w-full break-words font-serif text-[clamp(2rem,5vw,4.5rem)] leading-none text-[#554534]">
            {brideName}
          </p>
          <p className="mt-3 font-serif text-[clamp(1.25rem,2.8vw,2.5rem)] italic leading-none text-[#554534]">
            Weds
          </p>
          <p className="mt-3 max-w-full break-words font-serif text-[clamp(2rem,5vw,4.5rem)] leading-none text-[#554534]">
            {groomName}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Live preview</p>
          <p className="mt-2 text-sm font-medium text-white/85">{formatDate(formData?.date)}</p>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
              Selected template
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">{template.name}</h1>
          </div>
          <div className="w-fit rounded-full border border-black bg-black px-5 py-2 text-sm font-semibold text-white">
            {template.price}
          </div>
        </div>

        <section className="mt-6 border-b border-black/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Invitation details</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-black">{coupleNames}</h3>
          <p className="mt-3 text-sm leading-6 text-black/65">
            {getValue(formData?.blessing, "With the blessings of our families, we invite you to celebrate with us.")}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="border border-black/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Wedding date</p>
              <p className="mt-2 text-sm font-medium text-black">{formatDate(formData?.date)}</p>
            </div>
            <div className="border border-black/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Venue</p>
              <p className="mt-2 text-sm font-medium text-black">{getValue(formData?.venue, "Wedding venue")}</p>
            </div>
            <div className="border border-black/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">WhatsApp</p>
              <p className="mt-2 text-sm font-medium text-black">{getValue(formData?.whatsapp, "Contact number")}</p>
            </div>
            <div className="border border-black/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Hashtag</p>
              <p className="mt-2 text-sm font-medium text-black">{getValue(formData?.hashtag, "#WeddingHashtag")}</p>
            </div>
          </div>
        </section>

        {formData?.invitation ? (
          <section className="mt-6 border-b border-black/10 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Families</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="border border-black/10 p-4">
                <p className="text-sm font-semibold text-black">Bride family</p>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  {getValue(formData?.brideFather, "Bride father")}
                  <br />
                  {getValue(formData?.brideMother, "Bride mother")}
                </p>
              </div>
              <div className="border border-black/10 p-4">
                <p className="text-sm font-semibold text-black">Groom family</p>
                <p className="mt-2 text-sm leading-6 text-black/60">
                  {getValue(formData?.groomFather, "Groom father")}
                  <br />
                  {getValue(formData?.groomMother, "Groom mother")}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-6 border-b border-black/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Events</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(formData?.selectedEvents?.length ? formData.selectedEvents : ["Mehendi", "Shaadi", "Reception"]).map((eventName) => (
              <span key={eventName} className="border border-black/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-black">
                {eventName}
              </span>
            ))}
          </div>
          {hasEventDetails ? (
            <div className="mt-4 border border-black/10 p-4">
              <p className="text-sm font-semibold text-black">Selected event detail</p>
              <p className="mt-2 text-sm leading-6 text-black/60">{eventLine || "Event date, time and venue"}</p>
              {formData?.eventNotes ? <p className="mt-2 text-sm leading-6 text-black/60">{formData.eventNotes}</p> : null}
            </div>
          ) : null}
        </section>

        {formData?.storyEnabled ? (
          <section className="mt-6 border-b border-black/10 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">{getValue(formData?.storyTitle, "Our Story")}</p>
            <p className="mt-3 text-sm leading-6 text-black/65">
              {getValue(formData?.story, "Your story will appear here as soon as you write it.")}
            </p>
          </section>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {formData?.infoEnabled ? (
            <>
              <div className="border border-black/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Dress code</p>
                <p className="mt-2 text-sm font-medium leading-5 text-black">{getValue(formData?.dressCode, "Dress code details")}</p>
              </div>
              <div className="border border-black/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Parking</p>
                <p className="mt-2 text-sm font-medium leading-5 text-black">{getValue(formData?.parking, "Parking details")}</p>
              </div>
            </>
          ) : null}
          {formData?.rsvpEnabled ? (
            <div className="border border-black/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">RSVP deadline</p>
              <p className="mt-2 text-sm font-medium text-black">{formatDate(formData?.rsvpDeadline)}</p>
            </div>
          ) : null}
          {formData?.musicEnabled ? (
            <div className="border border-black/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Music</p>
              <p className="mt-2 text-sm font-medium text-black">{getValue(formData?.songTitle, "Wedding music")}</p>
            </div>
          ) : null}
        </div>

        <p className="mt-7 max-w-2xl text-base leading-7 text-black/65">{template.description}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Palette</p>
            <p className="mt-2 text-sm font-medium text-black">{template.palette}</p>
          </div>
          <div className="rounded-2xl border border-black/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/45">Best for</p>
            <p className="mt-2 text-sm font-medium leading-5 text-black">{template.bestFor}</p>
          </div>
        </div>

        <div className="mt-7">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-black/45">What is included</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {template.features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm font-medium text-black">
                <span className="h-2 w-2 rounded-full bg-black" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
