"use client";

import api from "@/api/axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const tabs = ["Essentials", "Invitation", "Events", "Story", "Gallery", "Info", "RSVP", "Music"];
const eventOptions = ["Mehendi", "Haldi", "Sagan", "Cocktail", "Sangeet", "Baraat", "Shaadi", "Reception"];
const defaultEventDetail = {
  functionName: "",
  date: "",
  time: "",
  venue: "",
  oneLiner: "",
  mapsLink: "",
};
const eventIcons = {
  Mehendi: "🌸",
  Haldi: "🌼",
  Sagan: "🪔",
  Cocktail: "🥂",
  Sangeet: "🎶",
  Baraat: "🐎",
  Shaadi: "🌺",
  Reception: "🕊️",
};
const infoCards = [
  "Dress Code",
  "Parking",
  "Wedding Hashtag",
  "Venue",
  "Gift Registry",
  "Stay Options",
  "Food",
  "Weather",
  "Transport",
  "Kids Welcome",
  "Photography",
  "WhatsApp Group",
];
const personalityGroups = [
  {
    title: "How did you meet your partner?",
    options: ["Through family / arranged", "At work or college", "Through common friends", "A spontaneous moment"],
  },
  {
    title: "What best describes you together?",
    options: ["Foodies — always hunting the next meal", "Wanderers — travel is our love language", "Movie-buffs — cozy evenings are our thing", "Social butterflies — we love a good party"],
  },
  {
    title: "How would friends describe your love?",
    options: ["Hopeless romantics", "Best friends who fell in love", "Opposites who complete each other", "Power couple"],
  },
];

const initialForm = {
  bride: "",
  groom: "",
  date: "",
  venue: "",
  whatsapp: "",
  hashtag: "",
  nameOrder: "brideFirst",
  countdown: true,
  invitation: true,
  blessing: "With the blessings of the divine and the love of our families",
  brideFather: "",
  brideMother: "",
  groomFather: "",
  groomMother: "",
  grandparentsEnabled: false,
  brideGrandfather: "",
  brideGrandmother: "",
  groomGrandfather: "",
  groomGrandmother: "",
  parentsOrder: "Bride's family first",
  selectedEvents: ["Mehendi", "Shaadi", "Reception"],
  eventDetails: {
    Mehendi: { ...defaultEventDetail, functionName: "Mehendi" },
    Haldi: { ...defaultEventDetail, functionName: "Haldi" },
    Sagan: { ...defaultEventDetail, functionName: "Sagan" },
    Cocktail: { ...defaultEventDetail, functionName: "Cocktail" },
    Sangeet: { ...defaultEventDetail, functionName: "Sangeet" },
    Baraat: { ...defaultEventDetail, functionName: "Baraat" },
    Shaadi: { ...defaultEventDetail, functionName: "Shaadi" },
    Reception: { ...defaultEventDetail, functionName: "Reception" },
  },
  eventDate: "",
  eventTime: "",
  eventVenue: "",
  eventNotes: "",
  storyEnabled: true,
  storyTitle: "Our Story",
  story: "",
  personalityAnswers: {},
  generatedTags: "",
  customHashtags: "",
  extraTags: "",
  galleryEnabled: true,
  coverImage: "",
  galleryLayout: 4,
  galleryImages: [],
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
      <span className="relative inline-flex h-8 w-14 items-center shrink-0">
        <input
          className="peer absolute inset-0 z-10 cursor-pointer opacity-0"
          type="checkbox"
          name={name}
          checked={Boolean(checked)}
          onChange={onChange}
        />
        <span className="pointer-events-none absolute inset-0 rounded-full border border-black/15 bg-black/10 transition peer-checked:border-black/35 peer-checked:bg-black/55" />
        <span className="pointer-events-none absolute left-1 h-6 w-6 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-transform duration-200 peer-checked:translate-x-6" />
      </span>
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

export { initialForm };

export default function TemplateForm({ template, onPreviewChange, activeTab, setActiveTab }) {
  const router = useRouter();
  const formRef = useRef(null);
  const [selectedInfoCard, setSelectedInfoCard] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState("Mehendi");
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customEventName, setCustomEventName] = useState("");
  const [storySubTab, setStorySubTab] = useState("Personality Tags");
  const [form, setForm] = useState(initialForm);

  // ensure infoCardsMap exists in state
  useEffect(() => {
    setForm((current) => ({
      ...current,
      infoCardsMap: current.infoCardsMap || Object.fromEntries(infoCards.map((c) => [c, ""])),
    }));
  }, []);
    
  useEffect(() => {
    if (template?.name) document.title = `${template.name} - Customize`;
  }, [template]);

  useEffect(() => {
    onPreviewChange?.(form);
  }, [form, onPreviewChange]);

  const activeTabIndex = tabs.indexOf(activeTab);
  const isFirstTab = activeTabIndex === 0;
  // Treat MUSIC as the final step for saving details (show Save on MUSIC tab), even though Gallery and Info come after it for users to edit those sections if they want
  const isLastTab = activeTab === tabs[tabs.length - 1] || activeTab === "Music";
  console.log("isLastTab:", isLastTab);

  function update(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function updateInfoCardValue(cardTitle, value) {
    setForm((current) => {
      const map = { ...(current.infoCardsMap || {}) };
      map[cardTitle] = value;

      const out = { ...current, infoCardsMap: map };
      // keep legacy fields in sync for a few known keys
      if (cardTitle === "Dress Code") out.dressCode = value;
      if (cardTitle === "Parking") out.parking = value;
      if (cardTitle === "Wedding Hashtag") out.hashtag = value;

      return out;
    });
  }

  function toggleEvent(eventName) {
    setForm((current) => {
      const isSelected = current.selectedEvents.includes(eventName);
      const selectedEvents = isSelected
        ? current.selectedEvents.filter((item) => item !== eventName)
        : [...current.selectedEvents, eventName];

      const eventDetails = {
        ...(current.eventDetails || {}),
      };

      if (!eventDetails[eventName]) {
        eventDetails[eventName] = { ...defaultEventDetail, functionName: eventName };
      }

      setSelectedEvent((openEvent) => {
        if (isSelected && openEvent === eventName) {
          return selectedEvents[0] || "";
        }
        if (!isSelected) {
          return eventName;
        }
        return openEvent;
      });

      return { ...current, selectedEvents, eventDetails };
    });
  }

  function updateEventDetail(eventName, field, value) {
    setForm((current) => ({
      ...current,
      eventDetails: {
        ...(current.eventDetails || {}),
        [eventName]: {
          ...defaultEventDetail,
          functionName: eventName,
          ...(current.eventDetails?.[eventName] || {}),
          [field]: value,
        },
      },
    }));
  }

  function addCustomEvent(eventNameInput) {
    const eventName = eventNameInput.trim();
    if (!eventName) return;

    setForm((current) => {
      const alreadyExists = current.selectedEvents.some(
        (item) => item.toLowerCase() === eventName.toLowerCase(),
      );

      if (alreadyExists) {
        const existingEvent = current.selectedEvents.find(
          (item) => item.toLowerCase() === eventName.toLowerCase(),
        );
        setSelectedEvent(existingEvent || eventName);
        return current;
      }

      const selectedEvents = [...current.selectedEvents, eventName];
      const eventDetails = {
        ...(current.eventDetails || {}),
        [eventName]: {
          ...defaultEventDetail,
          functionName: eventName,
        },
      };

      setSelectedEvent(eventName);
      return { ...current, selectedEvents, eventDetails };
    });
  }

  function selectPersonalityOption(groupTitle, option) {
    setForm((current) => {
      const answers = { ...(current.personalityAnswers || {}) };
      if (answers[groupTitle] === option) {
        // deselect if same clicked
        delete answers[groupTitle];
      } else {
        answers[groupTitle] = option;
      }

      const selected = Object.values(answers || []);
      const generatedTags = (selected || []).slice(0, 5).map((t) => t.split(' ').slice(0,3).join('_')).join(', ');

      return { ...current, personalityAnswers: answers, generatedTags };
    });
  }

  function openCustomEventPrompt() {
    setCustomEventName("");
    setShowCustomModal(true);
  }

  function closeCustomEventModal() {
    setShowCustomModal(false);
    setCustomEventName("");
  }

  function confirmCustomEvent() {
    addCustomEvent(customEventName || "");
    closeCustomEventModal();
  }

  async function handleGalleryUpload(e, idx) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await api.post("/invitations/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.url || res.data?.secure_url || res.data?.data || res.data?.result?.secure_url;
      if (!url) throw new Error("Upload failed");
      setForm((current) => {
        const images = [...(current.galleryImages || [])];
        images[idx] = url;
        return { ...current, galleryImages: images };
      });
    } catch (err) {
      console.error("Gallery upload error", err?.message || err);
      alert("Failed to upload image. Try again.");
    }
  }

  function goToPreviousTab() {
    if (!isFirstTab) {
      navigateToTab(tabs[activeTabIndex - 1]);
    }
  }

  function goToNextTab() {
    if (!isLastTab) {
      navigateToTab(tabs[activeTabIndex + 1]);
    }
  }

  function navigateToTab(tabName) {
    setActiveTab(tabName);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

 async function handleSubmit () {

    if (!form.bride || !form.groom || !form.date) {
      alert("Please add both names and the wedding date.");
      setActiveTab("Essentials");
      return;
    } 
    const res = await api.post("/invitations/create", {
      ...form,
      templateId: template?.id,
    });
    console.log(res.data);
    if (res.data?.success) {
      const created = res.data.data;
      const slug = created?.slug;
      const invitePath = slug ? `/invite/${encodeURIComponent(slug)}` : null;
      const fullUrl = invitePath ? `${window.location.origin}${invitePath}` : null;

      // Open the generated invite in a new tab and navigate the current window there as well
      if (fullUrl) {
        try {
          window.open(fullUrl, "_blank");
        } catch (e) {
          // ignore
        }
        router.push(invitePath);
      } else {
        alert("Invitation created successfully. Unable to determine invite URL.");
      }
    } else {
      alert("Failed to create invitation. Please try again.");
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={(event) => event.preventDefault()}
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
        <div className="flex flex-wrap gap-x-7 gap-y-0.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => navigateToTab(tab)}
              className={`border-b-2 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] transition ${
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
            </div>
            <div className="flex items-center justify-between gap-4 border border-black/10 bg-white p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">Name display order</p>
                <p className="mt-2 text-sm font-medium text-black">
                  {form.nameOrder === "groomFirst" ? "Groom & Bride" : "Bride & Groom"}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    nameOrder: current.nameOrder === "brideFirst" ? "groomFirst" : "brideFirst",
                  }))
                }
                className="border border-black bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white"
              >
                Switch
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="flex items-center justify-between gap-4 border border-black/10 bg-white px-4 py-4 sm:px-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/45">Parents display order</p>
                <p className="mt-2 text-sm font-medium text-black">{form.parentsOrder}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    parentsOrder:
                      current.parentsOrder === "Bride's family first"
                        ? "Groom's family first"
                        : "Bride's family first",
                  }))
                }
                className="border border-black bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white"
              >
                Switch
              </button>
            </div>
            <ToggleRow
              title="Include Grandparents' Names"
              note="Shows grandparents on the invite card."
              name="grandparentsEnabled"
              checked={form.grandparentsEnabled}
              onChange={update}
            />
            {form.grandparentsEnabled ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Bride's grandfather">
                  <input className={inputClass} name="brideGrandfather" value={form.brideGrandfather} onChange={update} placeholder="Late Shri Mohan Sharma" />
                </Field>
                <Field label="Bride's grandmother">
                  <input className={inputClass} name="brideGrandmother" value={form.brideGrandmother} onChange={update} placeholder="Late Smt Kamla Sharma" />
                </Field>
                <Field label="Groom's grandfather">
                  <input className={inputClass} name="groomGrandfather" value={form.groomGrandfather} onChange={update} placeholder="Late Shri Vijay Kapoor" />
                </Field>
                <Field label="Groom's grandmother">
                  <input className={inputClass} name="groomGrandmother" value={form.groomGrandmother} onChange={update} placeholder="Late Smt Radha Kapoor" />
                </Field>
              </div>
            ) : null}
          </>
        ) : null}

        {activeTab === "Events" ? (
          <>
            <SectionTitle icon="3" title="Celebration Events" />
            <p className="border-l-2 border-black bg-black/3 px-4 py-3 text-sm text-black/60">
              Choose events for your celebration, then open any one section below to edit details.
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
                      selected ? "border-black bg-black/5 text-black" : "border-black/10 bg-white text-black hover:border-black"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{eventIcons[eventName] || "✨"}</span>
                      <span>{eventName}</span>
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                        selected ? "border-black bg-black text-white" : "border-black/20 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={openCustomEventPrompt}
              className="w-full border border-dashed border-black/30 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:border-black"
            >
              + Add Custom Event
            </button>

            {showCustomModal ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40" onClick={closeCustomEventModal} />
                <div className="relative w-full max-w-md rounded bg-white p-6 shadow-lg">
                  <h4 className="text-sm font-semibold text-black">Add custom event</h4>
                  <p className="mt-2 text-xs text-black/60">Give your event a name (e.g. "Reception Afterparty").</p>
                  <div className="mt-4">
                    <input
                      className={inputClass}
                      value={customEventName}
                      onChange={(e) => setCustomEventName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmCustomEvent();
                        if (e.key === "Escape") closeCustomEventModal();
                      }}
                      placeholder="Event name"
                      autoFocus
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button type="button" onClick={closeCustomEventModal} className="border px-4 py-2 text-sm">
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmCustomEvent}
                      className="border border-black bg-black px-4 py-2 text-sm font-semibold text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">Event details - open one section</p>
            <div className="grid gap-3">
              {form.selectedEvents.map((eventName) => {
                const isOpen = selectedEvent === eventName;
                const detail = form.eventDetails?.[eventName] || { ...defaultEventDetail, functionName: eventName };
                return (
                  <div key={eventName} className="border border-black/10 bg-white">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent((current) => (current === eventName ? "" : eventName))}
                      className="flex w-full items-center justify-between bg-black/5 px-4 py-3 text-sm font-medium text-black"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-black/35">☰</span>
                        <span>{eventIcons[eventName] || "✨"}</span>
                        <span>{eventName}</span>
                      </span>
                      <span className="text-black/55">{isOpen ? "▴" : "▾"}</span>
                    </button>

                    {isOpen ? (
                      <div className="grid gap-4 p-4">
                        <Field label="Function name">
                          <input
                            className={inputClass}
                            value={detail.functionName || eventName}
                            onChange={(event) => updateEventDetail(eventName, "functionName", event.target.value)}
                            placeholder={eventName}
                          />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Date">
                            <input
                              className={inputClass}
                              type="date"
                              value={detail.date || ""}
                              onChange={(event) => updateEventDetail(eventName, "date", event.target.value)}
                            />
                          </Field>
                          <Field label="Time">
                            <input
                              className={inputClass}
                              type="time"
                              value={detail.time || ""}
                              onChange={(event) => updateEventDetail(eventName, "time", event.target.value)}
                            />
                          </Field>
                        </div>
                        <Field label="Venue">
                          <input
                            className={inputClass}
                            value={detail.venue || ""}
                            onChange={(event) => updateEventDetail(eventName, "venue", event.target.value)}
                            placeholder="e.g. Garden Pavilion"
                          />
                        </Field>
                        <Field label="One-liner">
                          <input
                            className={inputClass}
                            value={detail.oneLiner || ""}
                            onChange={(event) => updateEventDetail(eventName, "oneLiner", event.target.value)}
                            placeholder="Write one short line for this function"
                          />
                        </Field>
                        <Field label="Google maps link (optional)">
                          <input
                            className={inputClass}
                            value={detail.mapsLink || ""}
                            onChange={(event) => updateEventDetail(eventName, "mapsLink", event.target.value)}
                            placeholder="https://maps.google.com/..."
                          />
                        </Field>
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {form.selectedEvents.length === 0 ? (
                <p className="border border-dashed border-black/20 px-4 py-5 text-sm text-black/50">
                  Select at least one event above to add details.
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        {activeTab === "Story" ? (
          <>
            <SectionTitle icon="4" title="Couple Story" />
            <ToggleRow title="Show story section" note="Tell guests how your journey began." name="storyEnabled" checked={form.storyEnabled} onChange={update} />

            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStorySubTab("Personality Tags")}
                  className={`px-3 py-1 text-xs font-semibold border-b-2 transition ${
                    storySubTab === "Personality Tags" ? "border-black text-black" : "border-transparent text-black/45 hover:text-black"
                  }`}
                >
                  Personality Tags
                </button>
                <button
                  type="button"
                  onClick={() => setStorySubTab("Our Story")}
                  className={`px-3 py-1 text-xs font-semibold border-b-2 transition ${
                    storySubTab === "Our Story" ? "border-black text-black" : "border-transparent text-black/45 hover:text-black"
                  }`}
                >
                  Our Story
                </button>
              </div>
            </div>

            {storySubTab === "Personality Tags" ? (
              <>
                <p className="mt-3 text-sm text-black/60">Answer these questions — we'll generate personality tags automatically.</p>
                <div className="grid gap-4 mt-3">
                  {personalityGroups.map((group) => (
                    <div key={group.title} className="border border-black/10 bg-white">
                      <div className="p-4">
                        <p className="text-sm italic text-black/70">{group.title}</p>
                        <div className="mt-3 grid gap-2">
                          {group.options.map((opt) => {
                            const selected = (form.personalityAnswers || {})[group.title] === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => selectPersonalityOption(group.title, opt)}
                                className={`flex items-center text-sm text-left border px-4 py-3 transition ${
                                  selected ? "border-black bg-black/5 text-black" : "border-black/10 bg-white text-black hover:border-black"
                                }`}
                              >
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white mr-3">
                                  {selected ? <span className="h-2 w-2 rounded-full bg-black" /> : null}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div>
                    <p className="text-xs font-semibold text-black/60">Generated tags</p>
                    <div className="mt-2 border p-3">
                      {form.generatedTags ? (
                        <div className="flex flex-wrap gap-2">
                          {form.generatedTags.split(",").map((tag) => (
                            <span key={tag} className="rounded border border-black/10 bg-white px-3 py-1 text-sm text-black/70">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-black/60">Answer the quiz above to see your tags</div>
                      )}
                    </div>
                  </div>

                  <Field label="Custom hashtag (overrides main in story)">
                    <input className={inputClass} name="customHashtags" value={form.customHashtags} onChange={update} placeholder="#YourCustomHashtag" />
                  </Field>

                  <Field label="Extra tags (comma-separated)">
                    <input className={inputClass} name="extraTags" value={form.extraTags} onChange={update} placeholder="e.g. Chai lovers, Foodies" />
                  </Field>
                </div>
              </>
            ) : null}

            {storySubTab === "Our Story" ? (
              <>
                <Field label="Story title">
                  <input className={inputClass} name="storyTitle" value={form.storyTitle} onChange={update} />
                </Field>
                <Field label="Story text">
                  <textarea className={`${textAreaClass} min-h-36`} name="story" value={form.story} onChange={update} placeholder="Write your love story here..." />
                </Field>
              </>
            ) : null}
          </>
        ) : null}

        {activeTab === "Gallery" ? (
          <>
            <SectionTitle icon="5" title="Photo Gallery" />
            <ToggleRow title="Show gallery section" note="Add a cover image and notes for your photo gallery." name="galleryEnabled" checked={form.galleryEnabled} onChange={update} />
            <p className="mt-3 text-sm text-black/60">Photo layout</p>
            <div className="mt-2 flex gap-3">
              {[0,1,2,4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((c)=>({...c, galleryLayout: n}))}
                  className={`border p-3 text-xs ${form.galleryLayout===n? 'border-black bg-black/5 text-black':'border-black/10 bg-white text-black'}`} 
                >
                  {n===0? 'Skip' : `${n} Photo${n>1?'s':''}`}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <Field label="Gallery images">
                <div className={`grid gap-3 ${form.galleryLayout===1? 'grid-cols-1': form.galleryLayout===2? 'grid-cols-2': form.galleryLayout===4? 'grid-cols-2 sm:grid-cols-2': 'hidden'}`}>
                  {Array.from({length: form.galleryLayout===0?0: form.galleryLayout===1?1: form.galleryLayout===2?2:4}).map((_, idx) => (
                    <div key={idx} className="border border-dashed border-black/20 p-6 text-center">
                      {form.galleryImages?.[idx] ? (
                        <img src={form.galleryImages[idx]} className="mx-auto h-40 object-cover" alt={`photo-${idx+1}`} />
                      ) : (
                        <>
                          <label className="cursor-pointer text-sm text-black/60">
                            <input type="file" accept="image/*" className="hidden" onChange={(e)=>handleGalleryUpload(e, idx)} />
                            Click to upload photo {idx+1}
                          </label>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </Field>

              <Field label="Gallery note">
                <textarea className={textAreaClass} name="galleryNote" value={form.galleryNote} onChange={update} placeholder="A small note above your memories..." />
              </Field>
            </div>
          </>
        ) : null}

        {activeTab === "Info" ? (
          <>
            <SectionTitle icon="6" title="Things to Know" />
            <ToggleRow title="Show things to know section" note="Helpful info cards for your guests." name="infoEnabled" checked={form.infoEnabled} onChange={update} />
            <p className="border-l-2 border-black bg-black/3 px-4 py-3 text-sm text-black/60">Select info cards for guests. Click a selected chip to edit its value.</p>
            <div className="mt-4 grid gap-3">
              <div className="grid gap-2 sm:grid-cols-2">
                {infoCards.map((card) => {
                  const active = Boolean(form.infoCardsMap?.[card]);
                  const selected = selectedInfoCard === card;
                  return (
                    <div key={card}>
                      <button
                        type="button"
                        onClick={() => setSelectedInfoCard(card)}
                        className={`flex w-full items-center justify-between border px-4 py-3 text-sm transition ${
                          selected ? "border-black bg-black/5 text-black" : active ? "border-black/10 bg-white text-black" : "border-black/10 bg-white text-black"
                        }`}
                      >
                        <span>{card}</span>
                        <span className={`h-4 w-4 rounded-full border ${active ? "bg-black text-white border-black" : "border-black/20 bg-white text-transparent"}`}>
                          ✓
                        </span>
                      </button>

                      {selected ? (
                        <div className="mt-2 border border-black/10 bg-white p-3">
                          <p className="text-xs font-semibold text-black/60">Edit value</p>
                          <textarea
                            className={`${textAreaClass} mt-2`}
                            value={form.infoCardsMap?.[card] || ""}
                            onChange={(e) => updateInfoCardValue(card, e.target.value)}
                            placeholder={`Enter ${card} details`}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
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

        <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-5">
          <button
            type="button"
            onClick={goToPreviousTab}
            disabled={isFirstTab}
            className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:border-black disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
          >
            Previous
          </button>

          {isLastTab ? (
            <button type="button" onClick={handleSubmit} className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5">
              Save Details
            </button>
          ) : (
            <button
              type="button"
              onClick={goToNextTab}
              className="rounded-full border border-black bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
