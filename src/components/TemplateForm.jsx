"use client";

import { useEffect, useMemo, useState } from "react";

const tabs = ["Essentials", "Invitation", "Events", "Story", "Gallery", "Info", "RSVP", "Music"];
const eventOptions = ["Mehendi", "Haldi", "Sagan", "Cocktail", "Sangeet", "Baraat", "Shaadi", "Reception"];
const infoCards = ["Dress Code", "Parking", "Wedding Hashtag", "Venue"];

const initialForm = {
  bride: "",
  groom: "",
  date: "",
  venue: "",
  whatsapp: "",
  hashtag: "",
  countdown: true,
  invitation: true,
  blessing: "With the blessings of the divine and the love of our families",
  brideFather: "",
  brideMother: "",
  groomFather: "",
  groomMother: "",
  parentsOrder: "Bride family first",
  selectedEvents: ["Mehendi", "Shaadi", "Reception"],
  eventDate: "",
  eventTime: "",
  eventVenue: "",
  eventNotes: "",
  storyEnabled: true,
  storyTitle: "Our Story",
  story: "",
  galleryEnabled: true,
  coverImage: "",
  galleryNote: "",
  infoEnabled: true,
  dressCode: "",
  parking: "",
  mapsLink: "",
  rsvpEnabled: true,
  rsvpDeadline: "",
  mealPreference: true,
  guestQuestions: "",
  musicEnabled: false,
  songTitle: "",
  musicLink: "",
  autoplayMusic: false,
};

const inputClass =
  "mt-2 w-full rounded-none border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/30 focus:border-black focus:ring-4 focus:ring-black/5";
const textAreaClass = `${inputClass} min-h-24 resize-none leading-6`;

function Field({ label, children }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
      {label}
      {children}
    </label>
  );
}

function ToggleRow({ title, note, checked, name, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 border border-black/10 bg-white p-4">
      <span>
        <span className="block text-sm font-medium text-black">{title}</span>
        {note ? <span className="mt-1 block text-xs leading-5 text-black/45">{note}</span> : null}
      </span>
      <input className="h-5 w-5 accent-black" type="checkbox" name={name} checked={checked} onChange={onChange} />
    </label>
  );
}

function SectionTitle({ icon, title }) {
  return (
    <div className="border-b border-black/10 pb-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-sm text-black">
          {icon}
        </span>
        <h3 className="text-2xl font-semibold tracking-tight text-black">{title}</h3>
      </div>
    </div>
  );
}

export default function TemplateForm({ template }) {
  const [activeTab, setActiveTab] = useState("Essentials");
  const [selectedInfoCard, setSelectedInfoCard] = useState("Dress Code");
  const [selectedEvent, setSelectedEvent] = useState("Mehendi");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (template?.name) document.title = `${template.name} - Customize`;
  }, [template]);

  const activeEventIncluded = useMemo(
    () => form.selectedEvents.includes(selectedEvent),
    [form.selectedEvents, selectedEvent],
  );

  function update(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function toggleEvent(eventName) {
    setSelectedEvent(eventName);
    setForm((current) => {
      const selectedEvents = current.selectedEvents.includes(eventName)
        ? current.selectedEvents.filter((item) => item !== eventName)
        : [...current.selectedEvents, eventName];

      return { ...current, selectedEvents };
    });
  }

  function submit(event) {
    event.preventDefault();

    if (!form.bride || !form.groom || !form.date) {
      alert("Please add both names and the wedding date.");
      setActiveTab("Essentials");
      return;
    }

    const payload = { templateId: template?.id || null, ...form };
    console.log("Saving template data:", payload);
    alert("Saved demo details. Check the console for the payload.");
  }

  return (
    <form
      onSubmit={submit}
      className="overflow-hidden rounded border border-black/10 bg-white shadow-[0_24px_70px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">Template</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-black">{template?.name || "Wedding Website"}</h2>
        </div>
        <button
          type="button"
          className="border border-black px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white"
        >
          Change
        </button>
      </div>

      <div className="border-b border-black/10 px-5">
        <div className="flex flex-wrap gap-x-7 gap-y-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 py-4 text-xs font-semibold uppercase tracking-[0.22em] transition ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-black/35 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-6">
        {activeTab === "Essentials" ? (
          <>
            <SectionTitle icon="1" title="Wedding Essentials" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Bride name">
                <input className={inputClass} name="bride" value={form.bride} onChange={update} placeholder="e.g. Priya" />
              </Field>
              <Field label="Groom name">
                <input className={inputClass} name="groom" value={form.groom} onChange={update} placeholder="e.g. Arjun" />
              </Field>
              <Field label="Wedding date">
                <input className={inputClass} name="date" type="date" value={form.date} onChange={update} />
              </Field>
              <Field label="Venue">
                <input className={inputClass} name="venue" value={form.venue} onChange={update} placeholder="Umaid Bhawan" />
              </Field>
              <Field label="WhatsApp number">
                <input className={inputClass} name="whatsapp" value={form.whatsapp} onChange={update} placeholder="+91 98..." />
              </Field>
              <Field label="Wedding hashtag">
                <input className={inputClass} name="hashtag" value={form.hashtag} onChange={update} placeholder="#PriyaWedsArjun" />
              </Field>
            </div>
            <ToggleRow title="Show countdown timer" note="Display a live countdown on your website hero." name="countdown" checked={form.countdown} onChange={update} />
          </>
        ) : null}

        {activeTab === "Invitation" ? (
          <>
            <SectionTitle icon="2" title="Invitation Card" />
            <ToggleRow title="Show invitation section" note="Add blessing text and family names to the website." name="invitation" checked={form.invitation} onChange={update} />
            <Field label="Opening blessing">
              <textarea className={textAreaClass} name="blessing" value={form.blessing} onChange={update} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Bride father">
                <input className={inputClass} name="brideFather" value={form.brideFather} onChange={update} placeholder="Mr. Suresh Sharma" />
              </Field>
              <Field label="Bride mother">
                <input className={inputClass} name="brideMother" value={form.brideMother} onChange={update} placeholder="Mrs. Anita Sharma" />
              </Field>
              <Field label="Groom father">
                <input className={inputClass} name="groomFather" value={form.groomFather} onChange={update} placeholder="Mr. Ramesh Kapoor" />
              </Field>
              <Field label="Groom mother">
                <input className={inputClass} name="groomMother" value={form.groomMother} onChange={update} placeholder="Mrs. Sunita Kapoor" />
              </Field>
            </div>
            <Field label="Parents display order">
              <select className={inputClass} name="parentsOrder" value={form.parentsOrder} onChange={update}>
                <option>Bride family first</option>
                <option>Groom family first</option>
                <option>Both families together</option>
              </select>
            </Field>
          </>
        ) : null}

        {activeTab === "Events" ? (
          <>
            <SectionTitle icon="3" title="Celebration Events" />
            <p className="border-l-2 border-black bg-black/[0.03] px-4 py-3 text-sm text-black/60">
              Select events to include. Click a selected event to edit its detail card.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {eventOptions.map((eventName) => {
                const selected = form.selectedEvents.includes(eventName);
                return (
                  <button
                    key={eventName}
                    type="button"
                    onClick={() => toggleEvent(eventName)}
                    className={`flex items-center justify-between border px-4 py-3 text-left text-sm transition ${
                      selected ? "border-black bg-black text-white" : "border-black/10 bg-white text-black hover:border-black"
                    }`}
                  >
                    {eventName}
                    <span className={`h-5 w-5 rounded-full border ${selected ? "border-white bg-white text-black" : "border-black/20"}`}>
                      {selected ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="border border-black/10 p-4">
              <p className="text-sm font-semibold text-black">{selectedEvent} details</p>
              <p className="mt-1 text-xs text-black/45">
                {activeEventIncluded ? "This event is visible on the website." : "Select this event above to show it on the website."}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Date">
                  <input className={inputClass} name="eventDate" type="date" value={form.eventDate} onChange={update} />
                </Field>
                <Field label="Time">
                  <input className={inputClass} name="eventTime" type="time" value={form.eventTime} onChange={update} />
                </Field>
                <Field label="Venue">
                  <input className={inputClass} name="eventVenue" value={form.eventVenue} onChange={update} placeholder="Event venue" />
                </Field>
                <Field label="Notes">
                  <input className={inputClass} name="eventNotes" value={form.eventNotes} onChange={update} placeholder="Dress code, entry note, etc." />
                </Field>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "Story" ? (
          <>
            <SectionTitle icon="4" title="Couple Story" />
            <ToggleRow title="Show story section" note="Tell guests how your journey began." name="storyEnabled" checked={form.storyEnabled} onChange={update} />
            <Field label="Story title">
              <input className={inputClass} name="storyTitle" value={form.storyTitle} onChange={update} />
            </Field>
            <Field label="Story text">
              <textarea className={`${textAreaClass} min-h-36`} name="story" value={form.story} onChange={update} placeholder="Write your love story here..." />
            </Field>
          </>
        ) : null}

        {activeTab === "Gallery" ? (
          <>
            <SectionTitle icon="5" title="Photo Gallery" />
            <ToggleRow title="Show gallery section" note="Add a cover image and notes for your photo gallery." name="galleryEnabled" checked={form.galleryEnabled} onChange={update} />
            <Field label="Cover image link">
              <input className={inputClass} name="coverImage" value={form.coverImage} onChange={update} placeholder="https://..." />
            </Field>
            <Field label="Gallery note">
              <textarea className={textAreaClass} name="galleryNote" value={form.galleryNote} onChange={update} placeholder="A small note above your memories..." />
            </Field>
          </>
        ) : null}

        {activeTab === "Info" ? (
          <>
            <SectionTitle icon="6" title="Things to Know" />
            <ToggleRow title="Show things to know section" note="Helpful info cards for your guests." name="infoEnabled" checked={form.infoEnabled} onChange={update} />
            <p className="border-l-2 border-black bg-black/[0.03] px-4 py-3 text-sm text-black/60">
              Select an info card and edit its value below.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {infoCards.map((card) => (
                <button
                  key={card}
                  type="button"
                  onClick={() => setSelectedInfoCard(card)}
                  className={`flex items-center justify-between border px-4 py-3 text-sm transition ${
                    selectedInfoCard === card ? "border-black bg-black text-white" : "border-black/10 text-black hover:border-black"
                  }`}
                >
                  {card}
                  <span>{selectedInfoCard === card ? "✓" : ""}</span>
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Dress code">
                <textarea className={textAreaClass} name="dressCode" value={form.dressCode} onChange={update} placeholder="Ethnic Indian attire" />
              </Field>
              <Field label="Parking">
                <textarea className={textAreaClass} name="parking" value={form.parking} onChange={update} placeholder="Complimentary valet parking" />
              </Field>
              <Field label="Google maps link">
                <input className={inputClass} name="mapsLink" value={form.mapsLink} onChange={update} placeholder="https://maps.google.com/..." />
              </Field>
            </div>
          </>
        ) : null}

        {activeTab === "RSVP" ? (
          <>
            <SectionTitle icon="7" title="Guest RSVP" />
            <ToggleRow title="Collect RSVP responses" note="Let guests confirm attendance from your website." name="rsvpEnabled" checked={form.rsvpEnabled} onChange={update} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="RSVP deadline">
                <input className={inputClass} name="rsvpDeadline" type="date" value={form.rsvpDeadline} onChange={update} />
              </Field>
              <ToggleRow title="Ask meal preference" name="mealPreference" checked={form.mealPreference} onChange={update} />
            </div>
            <Field label="Guest questions">
              <textarea className={textAreaClass} name="guestQuestions" value={form.guestQuestions} onChange={update} placeholder="Any extra questions for guests?" />
            </Field>
          </>
        ) : null}

        {activeTab === "Music" ? (
          <>
            <SectionTitle icon="8" title="Website Music" />
            <ToggleRow title="Add background music" note="Use a hosted audio link or song reference." name="musicEnabled" checked={form.musicEnabled} onChange={update} />
            <Field label="Song title">
              <input className={inputClass} name="songTitle" value={form.songTitle} onChange={update} placeholder="Perfect wedding song" />
            </Field>
            <Field label="Music link">
              <input className={inputClass} name="musicLink" value={form.musicLink} onChange={update} placeholder="https://..." />
            </Field>
            <ToggleRow title="Autoplay music" note="Guests may still need to tap once depending on browser rules." name="autoplayMusic" checked={form.autoplayMusic} onChange={update} />
          </>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row">
          <button type="submit" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
            Save Details
          </button>
          <button
            type="button"
            onClick={() => setForm(initialForm)}
            className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:border-black"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}
