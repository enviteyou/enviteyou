"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const steps = [
  {
    step: "01",
    title: "Choose the invite style",
    copy:
      "Start with a template that matches your wedding vibe, from simple elegance to a more cinematic invitation look.",
  },
  {
    step: "02",
    title: "Add your event details",
    copy:
      "Enter the couple names, events, venue, schedule, gallery, and RSVP details in a guided setup flow.",
  },
  {
    step: "03",
    title: "Watch the mobile invite auto-type",
    copy:
      "The invite preview types itself on screen so guests can feel the flow of the story before they tap through.",
  },
  {
    step: "04",
    title: "Share the link instantly",
    copy:
      "Send the finished invite on WhatsApp, SMS, or email and update it later without rebuilding the whole page.",
  },
];

const inviteLines = [
  "Ananya & Kabir",
  "You are invited to our wedding celebration",
  "Saturday, 12 December 2026",
  "The Leela Palace, Udaipur",
  "Tap to view schedule, gallery, and RSVP",
];

function MobileTypingDemo() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentLine = inviteLines[lineIndex];
    let timeoutId;

    const tick = () => {
      if (!isDeleting) {
        if (charIndex < currentLine.length) {
          timeoutId = window.setTimeout(() => setCharIndex((value) => value + 1), 42);
          return;
        }

        if (lineIndex < inviteLines.length - 1) {
          timeoutId = window.setTimeout(() => {
            setLineIndex((value) => value + 1);
            setCharIndex(0);
          }, 620);
        } else {
          timeoutId = window.setTimeout(() => {
            setLineIndex(0);
            setCharIndex(0);
            setIsDeleting(true);
          }, 1100);
        }
        return;
      }

      if (charIndex > 0) {
        timeoutId = window.setTimeout(() => setCharIndex((value) => value - 1), 18);
        return;
      }

      timeoutId = window.setTimeout(() => {
        setIsDeleting(false);
        setLineIndex(0);
      }, 500);
    };

    tick();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [charIndex, isDeleting, lineIndex]);

  return (
    <div className="relative mx-auto w-full max-w-97.5 rounded-[2.25rem] border border-black/10 bg-white p-3 shadow-[0_30px_90px_rgba(0,0,0,0.14)]">
      <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-[1.25rem] bg-black" />
      <div className="overflow-hidden rounded-[1.8rem] bg-white">
        <div className="flex items-center justify-between bg-[#0f6658] px-4 pb-4 pt-5 text-white">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.35em] text-white/55">Mobile preview</p>
            <h3 className="mt-2 text-xl font-semibold">Invite that types itself</h3>
          </div>
          <span className="rounded-full border border-white/15 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/80">
            Live
          </span>
        </div>

        <div className="min-h-104 bg-[radial-gradient(circle_at_50%_0%,rgba(0,0,0,0.04),transparent_36%),linear-gradient(180deg,#ffffff,#f4f4f4)] px-4 py-5">
          <div className="rounded-[1.6rem] border border-black/8 bg-white p-4 shadow-[0_18px_55px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f6658] text-sm font-semibold text-white">
                A
              </div>
              <div className="flex-1 space-y-3 text-sm text-black/82">
                <p className="rounded-2xl rounded-tl-sm bg-black/4 px-4 py-3 leading-6 shadow-sm">
                  {inviteLines[0]}
                </p>
                <p className="rounded-2xl rounded-tl-sm bg-[#0f6658] px-4 py-3 leading-6 text-white shadow-sm">
                  {inviteLines[1]}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-black/8 bg-white p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-black/40">Auto typing invite</p>
              <div className="mt-3 space-y-2 text-[0.95rem] leading-6 text-black/78 sm:text-base">
                {inviteLines.slice(0, 3).map((line, index) => {
                  const isCurrent = index === lineIndex;
                  const text = isCurrent ? line.slice(0, charIndex) : index < lineIndex ? line : "";

                  return (
                    <p key={line} className="min-h-6">
                      {text}
                      {isCurrent ? <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-[#0f6658] align-middle animate-pulse" /> : null}
                    </p>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-black/50">
                <span className="rounded-full bg-black/5 px-3 py-1">Venue</span>
                <span className="rounded-full bg-black/5 px-3 py-1">Schedule</span>
                <span className="rounded-full bg-black/5 px-3 py-1">Gallery</span>
                <span className="rounded-full bg-black/5 px-3 py-1">RSVP</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-black/52">
            <div className="rounded-2xl border border-black/8 bg-white/72 px-2 py-3">Fast setup</div>
            <div className="rounded-2xl border border-black/8 bg-white/72 px-2 py-3">Mobile first</div>
            <div className="rounded-2xl border border-black/8 bg-white/72 px-2 py-3">Easy sharing</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="overflow-hidden bg-white text-black">
      <section className="relative border-b border-black/8">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#ffffff_0%,#f4f4f4_46%,#ffffff_100%)]" />
        <div className="absolute left-1/2 top-14 h-136 w-136 -translate-x-1/2 rounded-full border border-black/8 opacity-30 blur-0 animate-[spin_28s_linear_infinite]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/45">How it works</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              A wedding invite flow that feels beautiful on every phone.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-black/64 sm:text-lg">
              Build the invitation in a few guided steps, preview it on mobile, and share a polished digital experience your guests can open instantly.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/template"
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-black/90"
              >
                View pricing
              </Link>
              <Link
                href="/"
                className="rounded-full border border-black/12 bg-white/78 px-6 py-3 text-sm font-semibold text-black/76 shadow-[0_14px_34px_rgba(0,0,0,0.06)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-black/24 hover:text-black"
              >
                Back to home
              </Link>
            </div>
          </div>

          <div className="relative lg:justify-self-end">
            <MobileTypingDemo />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">Steps</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Everything happens in a few guided steps.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-black/58">
            The flow keeps the setup simple, while the final result stays premium enough to share with confidence.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {steps.map((step) => (
            <article
              key={step.step}
              className="rounded-[1.5rem] border border-black/8 bg-white p-6 shadow-[0_18px_55px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_65px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-black/62 sm:text-base">{step.copy}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-black/8 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/42">Mobile type</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">The invite types itself, so the preview feels alive.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-black/62 sm:text-base">
                This section is meant to show the auto-typing motion on mobile. It gives the page a more premium, app-like feeling before the guest even opens the full invite.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/8 bg-black/3 px-4 py-4 text-sm font-semibold text-black/72">Auto typing</div>
                <div className="rounded-2xl border border-black/8 bg-black/3 px-4 py-4 text-sm font-semibold text-black/72">Phone preview</div>
                <div className="rounded-2xl border border-black/8 bg-black/3 px-4 py-4 text-sm font-semibold text-black/72">Invite flow</div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <MobileTypingDemo />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}