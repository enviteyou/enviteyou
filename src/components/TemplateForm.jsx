"use client";

import { useEffect, useState } from "react";

const initialForm = {
  bride: "",
  groom: "",
  date: "",
  venue: "",
  whatsapp: "",
  hashtag: "",
  countdown: true,
  message: "",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black focus:ring-4 focus:ring-black/5";

function Field({ label, children }) {
  return (
    <label className="block text-sm font-medium text-black">
      {label}
      {children}
    </label>
  );
}

export default function TemplateForm({ template }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (template?.name) document.title = `${template.name} - Customize`;
  }, [template]);

  function update(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function submit(event) {
    event.preventDefault();

    if (!form.bride || !form.groom || !form.date) {
      alert("Please add both names and the wedding date.");
      return;
    }

    const payload = { templateId: template?.id || null, ...form };
    console.log("Saving template data:", payload);
    alert("Saved demo details. Check the console for the payload.");
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.08)] sm:p-6"
    >
      <div className="border-b border-black/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
          Customize template
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">
          {template?.name || "Wedding Website"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-black/55">
          Add the couple details once. We will use this to personalize your wedding website.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Bride's name">
            <input
              className={inputClass}
              name="bride"
              value={form.bride}
              onChange={update}
              placeholder="e.g. Priya"
            />
          </Field>

          <Field label="Groom's name">
            <input
              className={inputClass}
              name="groom"
              value={form.groom}
              onChange={update}
              placeholder="e.g. Arjun"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Wedding date">
            <input className={inputClass} name="date" type="date" value={form.date} onChange={update} />
          </Field>

          <Field label="Venue">
            <input
              className={inputClass}
              name="venue"
              value={form.venue}
              onChange={update}
              placeholder="Umaid Bhawan"
            />
          </Field>
        </div>

        <Field label="WhatsApp number">
          <input
            className={inputClass}
            name="whatsapp"
            value={form.whatsapp}
            onChange={update}
            placeholder="+91 98..."
          />
        </Field>

        <Field label="Wedding hashtag">
          <input
            className={inputClass}
            name="hashtag"
            value={form.hashtag}
            onChange={update}
            placeholder="#PriyaWedsArjun"
          />
        </Field>

        <Field label="Hero message">
          <textarea
            className={`${inputClass} min-h-28 resize-none`}
            name="message"
            value={form.message}
            onChange={update}
            placeholder="With the blessings of our families..."
          />
        </Field>

        <label className="flex items-center justify-between rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium text-black">
          <span>Show countdown timer</span>
          <input
            className="h-5 w-5 accent-black"
            type="checkbox"
            name="countdown"
            checked={form.countdown}
            onChange={update}
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
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
    </form>
  );
}
