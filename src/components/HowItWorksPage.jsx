"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  Sparkles, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Users, 
  Music, 
  Heart, 
  Camera, 
  Share2, 
  ChevronRight, 
  ArrowRight, 
  Lock, 
  Smartphone,
  Check,
  Mail
} from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Choose the invite style",
    copy: "Select a custom theme that matches your wedding vibe, from minimalist luxury to clean cinematic styles.",
  },
  {
    step: "02",
    title: "Add your event details",
    copy: "Enter couple details, events schedule, venue maps, gallery photos, and RSVP configurations in a guided workflow.",
  },
  {
    step: "03",
    title: "Interact with live previews",
    copy: "See your invitation format itself live. Guests experience animations, interactive tabs, and music natively on mobile.",
  },
  {
    step: "04",
    title: "Share and track RSVPs",
    copy: "Distribute your link instantly on WhatsApp or email, and view real-time guest RSVPs in your partner dashboard.",
  },
];

const features = [
  {
    icon: Calendar,
    title: "Multi-Event Schedules",
    desc: "Create separate cards for Haldi, Mehndi, Wedding, and Reception with direct Google Maps navigation links.",
  },
  {
    icon: Users,
    title: "Real-time RSVP Manager",
    desc: "Track attendance counts, food choices, and special messages instantly inside your vendor workspace.",
  },
  {
    icon: Camera,
    title: "Guest Photo Gallery",
    desc: "Upload pre-wedding shoots or wedding memories directly so guests can browse them in high quality.",
  },
  {
    icon: Music,
    title: "Background Soundtracks",
    desc: "Upload customized audio tracks or instrumental music that plays smoothly when guests view the invite.",
  },
  {
    icon: Lock,
    title: "Password Protection",
    desc: "Secure your wedding details by enabling a secure password screen so only invited guests can view details.",
  },
  {
    icon: Share2,
    title: "Instant Live Updates",
    desc: "Changed a venue or time? Edit details on the fly. Your invitation updates immediately without code rebuilds.",
  },
];

const inviteLines = [
  "Ananya & Kabir",
  "are getting married",
  "December 12, 2026",
  "The Leela Palace, Udaipur",
];

// Interactive Mobile Mockup Component
function InteractiveMobileMockup() {
  const [activeTab, setActiveTab] = useState("cover"); // "cover" | "events" | "gallery" | "rsvp"
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpCount, setRsvpCount] = useState(1);
  const [rsvpAttending, setRsvpAttending] = useState(true);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [currentLineIdx, setCurrentLineIdx] = useState(0);

  // Auto-typing animation for the cover page
  useEffect(() => {
    if (activeTab !== "cover") {
      setTypedText("");
      setCurrentLineIdx(0);
      return;
    }

    let timer;
    const currentLine = inviteLines[currentLineIdx];
    
    if (typedText.length < currentLine.length) {
      timer = setTimeout(() => {
        setTypedText(currentLine.slice(0, typedText.length + 1));
      }, 50);
    } else if (currentLineIdx < inviteLines.length - 1) {
      timer = setTimeout(() => {
        setCurrentLineIdx(prev => prev + 1);
        setTypedText("");
      }, 1000);
    } else {
      // Loop back after a delay
      timer = setTimeout(() => {
        setCurrentLineIdx(0);
        setTypedText("");
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [typedText, currentLineIdx, activeTab]);

  return (
    <div className="relative mx-auto w-full max-w-[320px] rounded-[3rem] border-8 border-[#1f2937] bg-white p-2.5 shadow-[0_30px_90px_rgba(0,0,0,0.18)] ring-1 ring-black/5 overflow-hidden">
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-30 h-5 w-24 -translate-x-1/2 rounded-b-xl bg-[#1f2937]" />
      
      {/* Phone Screen Container */}
      <div className="relative h-[530px] rounded-[2.3rem] overflow-hidden bg-[#faf8f5] flex flex-col justify-between select-none">
        
        {/* Mock Status Bar */}
        <div className="h-6 flex items-center justify-between px-6 pt-1 text-[10px] font-semibold text-[#1f2937]/60 z-20">
          <span>9:41 AM</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="h-3 w-5 rounded-xs border border-[#1f2937]/50 p-[1px]">
              <div className="h-full w-3.5 bg-[#1f2937]/75 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="flex-1 overflow-y-auto px-4 py-2 relative scrollbar-none">
          {activeTab === "cover" && (
            <div className="h-full flex flex-col justify-between text-center pt-8 pb-4 animate-fadeIn">
              <div className="space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full border border-[#c8a24c]/40 bg-[#fdf9ef] flex items-center justify-center text-[#c8a24c] font-serif italic text-lg shadow-xs">
                  A&K
                </div>
                <div className="h-[1px] w-20 bg-[#c8a24c]/30 mx-auto" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#c8a24c] font-bold">Save The Date</span>
              </div>

              {/* Typing Animation Area */}
              <div className="space-y-3 min-h-[140px] flex flex-col justify-center">
                {inviteLines.map((line, idx) => {
                  if (idx > currentLineIdx) return null;
                  const isCurrent = idx === currentLineIdx;
                  return (
                    <p 
                      key={line} 
                      className={`text-sm tracking-wide text-neutral-800 ${
                        idx === 0 ? "font-serif text-2xl italic text-[#7d2432]" : "font-medium"
                      }`}
                    >
                      {isCurrent ? typedText : line}
                      {isCurrent && (
                        <span className="ml-0.5 inline-block h-3 w-[1.5px] bg-[#7d2432] animate-ping" />
                      )}
                    </p>
                  );
                })}
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-widest">Formal Invitation to Follow</p>
                <div className="h-1 w-1 bg-[#c8a24c] rounded-full mx-auto mt-2" />
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-3 pt-3 pb-6 animate-fadeIn">
              <div className="text-center mb-4">
                <span className="text-[9px] uppercase tracking-widest text-[#c8a24c] font-bold">Schedule</span>
                <h4 className="text-base font-serif italic text-[#7d2432] font-semibold mt-1">Wedding Ceremonies</h4>
              </div>

              {/* Event Cards */}
              {[
                { name: "Haldi Ceremony", time: "10:00 AM", venue: "Courtyard Lawn" },
                { name: "Sangeet & Mehndi", time: "04:00 PM", venue: "Lakeside Deck" },
                { name: "Wedding Ceremony", time: "07:00 PM", venue: "Grand Ballroom" }
              ].map((ev, i) => (
                <div key={i} className="bg-white border border-[#c8a24c]/10 rounded-2xl p-3 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-neutral-800">{ev.name}</p>
                    <p className="text-[10px] text-[#7d2432] font-semibold">{ev.time}</p>
                    <p className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400" /> {ev.venue}
                    </p>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-[#fdf9ef] flex items-center justify-center text-[10px] font-bold text-[#c8a24c] border border-[#c8a24c]/20">
                    {i+1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="space-y-3 pt-3 pb-6 animate-fadeIn">
              <div className="text-center mb-4">
                <span className="text-[9px] uppercase tracking-widest text-[#c8a24c] font-bold">Gallery</span>
                <h4 className="text-base font-serif italic text-[#7d2432] font-semibold mt-1">Pre-Wedding Shoot</h4>
              </div>

              {/* Simulated Masonry Images */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { title: "The Proposal", grad: "from-[#dfc6a3] to-[#7d2432]/60" },
                  { title: "Udaipur Love", grad: "from-[#a3bcd8] to-[#111827]/60" },
                  { title: "By the Lake", grad: "from-[#d3a3d8] to-[#0f6658]/60" },
                  { title: "Golden Hour", grad: "from-[#d8a3a3] to-[#c8a24c]/60" }
                ].map((photo, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-xl bg-linear-to-tr ${photo.grad} p-3 flex flex-col justify-end text-left border border-white/20 shadow-xs relative group`}
                  >
                    <span className="text-[9px] font-bold text-white tracking-wide uppercase drop-shadow-md">{photo.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "rsvp" && (
            <div className="space-y-3 pt-3 pb-6 animate-fadeIn">
              <div className="text-center mb-3">
                <span className="text-[9px] uppercase tracking-widest text-[#c8a24c] font-bold">RSVP</span>
                <h4 className="text-base font-serif italic text-[#7d2432] font-semibold mt-1">Will You Attend?</h4>
              </div>

              {rsvpSubmitted ? (
                <div className="bg-white border border-emerald-100 rounded-2xl p-5 text-center space-y-3 shadow-xs animate-scaleUp">
                  <div className="mx-auto h-9 w-9 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <Check className="h-5 w-5" />
                  </div>
                  <h5 className="text-xs font-bold text-neutral-800">RSVP Confirmed</h5>
                  <p className="text-[10px] text-neutral-500 leading-normal">
                    Thank you! Your response has been logged and sent to Ananya & Kabir.
                  </p>
                  <button 
                    onClick={() => {
                      setRsvpSubmitted(false);
                      setRsvpName("");
                    }} 
                    className="text-[10px] font-semibold text-[#7d2432] hover:underline"
                  >
                    Edit Response
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-[#c8a24c]/10 rounded-2xl p-3.5 space-y-3 shadow-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      value={rsvpName} 
                      onChange={(e) => setRsvpName(e.target.value)}
                      className="w-full text-xs border border-neutral-200 rounded-lg p-2 outline-none focus:border-[#c8a24c]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Attendance</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setRsvpAttending(true)}
                        className={`text-[10px] font-bold py-1.5 rounded-lg border transition ${
                          rsvpAttending 
                            ? "bg-[#7d2432] text-white border-[#7d2432]" 
                            : "bg-white text-neutral-700 border-neutral-200"
                        }`}
                      >
                        Accepts
                      </button>
                      <button 
                        onClick={() => setRsvpAttending(false)}
                        className={`text-[10px] font-bold py-1.5 rounded-lg border transition ${
                          !rsvpAttending 
                            ? "bg-[#7d2432] text-white border-[#7d2432]" 
                            : "bg-white text-neutral-700 border-neutral-200"
                        }`}
                      >
                        Declines
                      </button>
                    </div>
                  </div>

                  {rsvpAttending && (
                    <div className="flex justify-between items-center border-t border-neutral-100 pt-2.5">
                      <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wide">Number of Guests</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setRsvpCount(prev => Math.max(1, prev - 1))}
                          className="h-5 w-5 bg-neutral-100 rounded flex items-center justify-center text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-neutral-800 w-4 text-center">{rsvpCount}</span>
                        <button 
                          onClick={() => setRsvpCount(prev => prev + 1)}
                          className="h-5 w-5 bg-neutral-100 rounded flex items-center justify-center text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      if (!rsvpName.trim()) return;
                      setRsvpSubmitted(true);
                    }}
                    disabled={!rsvpName.trim()}
                    className="w-full bg-[#7d2432] hover:bg-[#7d2432]/95 text-white disabled:bg-neutral-200 font-bold py-2 rounded-xl text-xs uppercase tracking-widest transition"
                  >
                    Submit RSVP
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-t border-[#c8a24c]/10 bg-white/95 backdrop-blur-md grid grid-cols-4 text-center py-2 z-10">
          {[
            { id: "cover", label: "Cover", icon: Heart },
            { id: "events", label: "Events", icon: Calendar },
            { id: "gallery", label: "Gallery", icon: Camera },
            { id: "rsvp", label: "RSVP", icon: Mail }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer transition ${
                  isActive ? "text-[#7d2432]" : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                <IconComp className="h-4 w-4" />
                <span className="text-[8px] font-bold uppercase tracking-wider">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="overflow-hidden bg-[#faf8f5] text-black">
      {/* 1. HERO SECTION */}
      <section className="relative border-b border-black/5 bg-linear-to-b from-[#fdfbf7] via-[#faf8f5] to-[#f5f1eb] py-20 lg:py-28">
        {/* Soft Ambient Background Circles */}
        <div className="absolute right-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[#c8a24c]/5 blur-[120px]" />
        <div className="absolute left-[-15%] bottom-[-10%] h-[400px] w-[400px] rounded-full bg-[#7d2432]/5 blur-[100px]" />
        
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:items-center lg:px-10">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 rounded border border-[#c8a24c]/30 bg-[#fdf9ef] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#c8a24c]">
              <Sparkles className="h-3.5 w-3.5" /> How EnviteYou Works
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif italic text-[#1f2937] leading-[1.08] tracking-tight">
              Create an invitation that <span className="text-[#7d2432]">feels alive</span>.
            </h1>
            
            <p className="max-w-2xl text-base sm:text-lg text-neutral-600 leading-relaxed">
              Design a premium mobile-first wedding experience. Gather details, upload beautiful photo collections, configure automated guest RSVPs, and share your unique wedding URL in minutes.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/template"
                className="rounded bg-black hover:bg-black/90 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 transition duration-300 shadow-md flex items-center gap-2"
              >
                Browse Templates <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/"
                className="rounded border border-black/10 hover:border-black/20 bg-white/70 backdrop-blur-sm text-neutral-800 font-bold text-xs uppercase tracking-widest px-8 py-4 transition duration-300 shadow-xs"
              >
                Back to Home
              </Link>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 relative flex justify-center">
            {/* Ambient gold ring behind the phone mockup */}
            <div className="absolute inset-0 max-w-[340px] aspect-square rounded-full border border-[#c8a24c]/10 bg-radial-gradient from-[#fdf9ef] to-[#faf8f5]/20 -translate-y-4 blur-xs scale-105" />
            <InteractiveMobileMockup />
          </div>
        </div>
      </section>

      {/* 2. TIMELINE STEPS SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28 text-center space-y-16">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-[#c8a24c]">Timeline</span>
          <h2 className="text-3xl sm:text-5xl font-serif italic text-neutral-800">Four simple steps to absolute perfection.</h2>
          <p className="text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
            From picking a theme to welcoming guests at the event, EnviteYou makes digital invitation building simple and high-end.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
          {steps.map((step, idx) => (
            <article
              key={step.step}
              className="group relative rounded border border-black/5 bg-white p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-md transition duration-300 flex flex-col justify-between h-64"
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fdf9ef] border border-[#c8a24c]/15 text-sm font-bold text-[#c8a24c] group-hover:bg-[#7d2432] group-hover:text-white transition duration-300">
                  {step.step}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-neutral-800 group-hover:text-[#7d2432] transition duration-300">{step.title}</h3>
                  <p className="text-xs text-neutral-500 leading-normal">{step.copy}</p>
                </div>
              </div>
              
              <div className="pt-4 flex items-center text-[10px] font-bold text-neutral-400 group-hover:text-[#7d2432] transition duration-300">
                Step Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE PRODUCT VALUES DEEP DIVE */}
      <section className="bg-neutral-950 text-white relative py-20 lg:py-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute right-[-15%] bottom-[-20%] h-[600px] w-[600px] rounded-full bg-[#7d2432]/20 blur-[150px]" />
        <div className="absolute left-[-15%] top-[-20%] h-[600px] w-[600px] rounded-full bg-[#c8a24c]/10 blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:grid lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-center lg:px-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#c8a24c]">
              <Smartphone className="h-3.5 w-3.5" /> Interactive Demonstration
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-serif italic leading-tight text-white">
              Try the RSVP form yourself on the <span className="text-[#c8a24c]">mock mobile preview</span>.
            </h2>
            
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xl">
              Tap the tabs on the mobile display (Cover, Events, Gallery, RSVP) to see how dynamic guest integrations behave. Fill out the RSVP form on the mockup, hit submit, and witness how clean the response interface looks.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-2 text-xs">
              <div className="flex items-start gap-3 bg-white/5 border border-white/5 rounded p-4.5">
                <CheckCircle className="h-5 w-5 text-[#c8a24c] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white">Dynamic RSVPs</p>
                  <p className="text-neutral-400 leading-normal text-[11px]">Responses write instantly to your coordinator dashboard database.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/5 rounded p-4.5">
                <CheckCircle className="h-5 w-5 text-[#c8a24c] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white">Elegant Galleries</p>
                  <p className="text-neutral-400 leading-normal text-[11px]">Fully scrollable pre-wedding photo cards loaded automatically.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0 flex justify-center">
            <InteractiveMobileMockup />
          </div>
        </div>
      </section>

      {/* 4. ALL INCLUSIVE CORE FEATURES GRID */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#c8a24c]">Included Features</span>
          <h2 className="text-3xl sm:text-5xl font-serif italic text-neutral-800">Packed with premium tools.</h2>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-md mx-auto">
            Everything you need to deliver an elegant invitation and seamlessly manage guest registrations.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const IconComp = feature.icon;
            return (
              <div 
                key={idx} 
                className="bg-white border border-neutral-100 p-6.5 rounded shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-xs transition duration-200 text-left space-y-4"
              >
                <div className="h-10 w-10 bg-[#fdf9ef] border border-[#c8a24c]/15 text-[#c8a24c] rounded flex items-center justify-center">
                  <IconComp className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-neutral-800">{feature.title}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CALL TO ACTION CTA BANNER */}
      <section className="bg-linear-to-r from-[#7d2432]/95 to-[#50131d] text-white py-16 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[400px] h-[300px] bg-[#c8a24c]/10 rounded-full blur-[100px]" />
        
        <div className="relative mx-auto max-w-5xl px-6 text-center space-y-8">
          <Heart className="h-8 w-8 text-[#c8a24c] mx-auto animate-pulse" />
          <h2 className="text-3xl sm:text-5xl font-serif italic leading-tight max-w-2xl mx-auto">
            Ready to design your digital story?
          </h2>
          <p className="text-sm text-neutral-200/80 max-w-md mx-auto leading-relaxed">
            Begin with a template today, design it to perfection, and receive immediate RSVPs from your loved ones.
          </p>
          <div className="pt-2">
            <Link
              href="/template"
              className="inline-flex items-center gap-1.5 bg-[#c8a24c] hover:bg-[#c8a24c]/95 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded transition duration-300 shadow-md"
            >
              Start Creating <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}