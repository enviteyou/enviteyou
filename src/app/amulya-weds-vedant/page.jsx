"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";

const WEDDING_TIME = Date.parse("2026-11-26T19:30:00+05:30");

const PETAL_PATHS = [9, 24, 39, 57, 74, 91, 48];

const PHOTOS = [


  {
    src: "/amulya-weds-vedant/assets/couple-engagement.webp",
    alt: "Amulya and Vedant at their engagement celebration",
    position: "50% 28%",
  },
  {
    src: "/amulya-weds-vedant/assets/image.png",
    alt: "Amulya and Vedant sharing a meal together",
    position: "50% 42%",
  },
  {
    src: "/amulya-weds-vedant/assets/couple-selfie.webp",
    alt: "Amulya and Vedant taking a mirror photograph together",
    position: "50% 30%",
  },
  {
    src: "/amulya-weds-vedant/assets/couple-ghats.webp",
    alt: "Amulya and Vedant at the Varanasi ghats",
    position: "50% 32%",
  },
];

export default function VedAmInvitationPage() {
  // State
  const [isReady, setIsReady] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    isStarted: false,
  });
  const [tickSeconds, setTickSeconds] = useState(false);
  const [activeEventTab, setActiveEventTab] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPhotoChanging, setIsPhotoChanging] = useState(false);

  // Refs
  const invitationRef = useRef(null);
  const openingRef = useRef(null);
  const radianceRef = useRef(null);
  const controlsRef = useRef(null);
  const navDialogRef = useRef(null);
  const shareDialogRef = useRef(null);
  const eventsTrackRef = useRef(null);
  const galleryStageRef = useRef(null);
  const toastTimerRef = useRef(null);
  const audioTimerRef = useRef(null);
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const musicGainRef = useRef(null);
  const phraseIndexRef = useRef(0);
  const musicOnRef = useRef(false);
  const openedRef = useRef(false);

  // Toast notification
  const notify = useCallback((msg) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage("");
    }, 3500);
  }, []);

  // Web Audio ambient synthesizer
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return false;
      const ctx = new AudioCtx();
      const master = ctx.createGain();
      master.gain.value = 0.24;
      master.connect(ctx.destination);

      const music = ctx.createGain();
      music.gain.value = 0;
      music.connect(master);

      audioContextRef.current = ctx;
      masterGainRef.current = master;
      musicGainRef.current = music;
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => { });
    }
    return true;
  }, []);

  const playNote = useCallback(
    (frequency, at, duration, gainValue, type = "sine", dest = null) => {
      const ctx = audioContextRef.current;
      if (!ctx) return;
      const targetDest = dest || musicGainRef.current;
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      amp.gain.setValueAtTime(0.0001, at);
      amp.gain.exponentialRampToValueAtTime(gainValue, at + 0.04);
      amp.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      osc.connect(amp).connect(targetDest);
      osc.start(at);
      osc.stop(at + duration + 0.05);
      osc.onended = () => {
        osc.disconnect();
        amp.disconnect();
      };
    },
    []
  );

  const softBell = useCallback(() => {
    if (!initAudio()) return;
    const ctx = audioContextRef.current;
    const at = ctx.currentTime;
    [523.25, 784.88, 1046.5, 1569.75].forEach((freq, i) => {
      playNote(freq, at + i * 0.018, 2.2 + i * 0.12, 0.23 / (i + 1), "sine", masterGainRef.current);
    });
  }, [initAudio, playNote]);

  const instrumentalPhrase = useCallback(() => {
    if (!musicOnRef.current || document.hidden || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const at = ctx.currentTime + 0.06;
    [130.81, 196.0, 261.63].forEach((freq, i) => {
      playNote(freq, at, 8, 0.07 / (i + 1));
    });
    const melodies = [
      [392, 440, 523.25, 587.33],
      [523.25, 440, 392, 349.23],
      [392, 523.25, 587.33, 523.25],
      [440, 392, 349.23, 392],
    ];
    melodies[phraseIndexRef.current++ % 4].forEach((freq, i) => {
      playNote(freq, at + i * 1.65 + 0.6, 2.6, 0.13);
      playNote(freq * 2, at + i * 1.65 + 0.6, 1.5, 0.025);
    });
  }, [playNote]);

  const setMusic = useCallback(
    (on, { announce = true } = {}) => {
      if (on && !initAudio()) {
        notify("Audio is not supported by this browser.");
        return;
      }
      musicOnRef.current = on;
      setMusicOn(on);
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);

      if (audioContextRef.current && musicGainRef.current) {
        const ctx = audioContextRef.current;
        musicGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        musicGainRef.current.gain.setTargetAtTime(on ? 0.72 : 0, ctx.currentTime, 0.3);
      }

      if (on) {
        instrumentalPhrase();
        audioTimerRef.current = setInterval(instrumentalPhrase, 8000);
      }
      if (announce) {
        notify(on ? "Music on" : "Music paused");
      }
    },
    [initAudio, instrumentalPhrase, notify]
  );

  // Smooth scroll to an invitation section
  const goTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({
        behavior: prefersReduced ? "instant" : "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", "#" + id);
    }
  }, []);

  // Show a specific ceremony tab
  const showEvent = useCallback((index) => {
    const newIdx = (index + 3) % 3;
    setActiveEventTab(newIdx);
    if (eventsTrackRef.current) {
      const card = eventsTrackRef.current.querySelector(".event-card");
      if (card) {
        const step = card.getBoundingClientRect().width + 16;
        setTrackOffset(-newIdx * step);
      }
    }
  }, []);

  // Show a specific gallery photo
  const showPhoto = useCallback((index) => {
    const newIdx = (index + PHOTOS.length) % PHOTOS.length;
    setIsPhotoChanging(true);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(
      () => {
        setPhotoIndex(newIdx);
        setIsPhotoChanging(false);
      },
      prefersReduced ? 0 : 180
    );
  }, []);

  // Open the envelope with radiance animation
  const openEnvelope = useCallback(
    async ({ silent = false } = {}) => {
      if (openedRef.current) return;
      openedRef.current = true;
      setIsOpened(true);

      const light = radianceRef.current;
      const opening = openingRef.current;
      const invitation = invitationRef.current;
      const controls = controlsRef.current;

      if (!silent) softBell();

      const handover = () => {
        if (opening) {
          opening.hidden = true;
          opening.setAttribute("inert", "");
        }
        if (invitation) {
          invitation.hidden = false;
          invitation.removeAttribute("inert");
          invitation.scrollTop = 0;
        }
        document.body.classList.remove("invitation-closed");
        window.history.replaceState(null, "", "#welcome");
        showEvent(0);
      };

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced || silent || !light || !light.animate) {
        handover();
        if (controls) controls.classList.add("visible");
        if (invitation) invitation.focus({ preventScroll: true });
        if (!silent) setMusic(true, { announce: false });
        return;
      }

      document.body.classList.add("opening-is-active");
      let animation;
      try {
        animation = light.animate(
          [
            { opacity: 0, transform: "scale(.4)" },
            { opacity: 1, transform: "scale(1)" },
          ],
          { duration: 520, easing: "ease-in-out", fill: "forwards" }
        );
        await animation.finished;
        light.style.opacity = "1";
        light.style.transform = "scale(1)";
        animation.cancel();

        handover();

        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        );

        animation = light.animate(
          [
            { opacity: 1, transform: "scale(1)" },
            { opacity: 0, transform: "scale(1.06)" },
          ],
          { duration: 650, easing: "ease-out", fill: "forwards" }
        );
        await animation.finished;
      } catch {
        // Animation fallback
      } finally {
        if (light) light.style.opacity = "0";
        if (animation) animation.cancel();
        if (opening && !opening.hidden) handover();
        document.body.classList.remove("opening-is-active");
        if (controls) controls.classList.add("visible");
        if (invitation) invitation.focus({ preventScroll: true });
        if (!silent) setMusic(true, { announce: false });
      }
    },
    [setMusic, showEvent, softBell]
  );

  const getShareUrl = useCallback(() => {
    return typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "https://enviteyou.com/amulya-weds-vedant";
  }, []);

  // Copy invitation link
  const copyInvitation = useCallback(async () => {
    let copied = false;
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch {
      const input = document.getElementById("share-url");
      if (input) {
        input.focus();
        input.select();
        try {
          copied = document.execCommand("copy");
        } catch {
          copied = false;
        }
      }
    }
    if (copied) {
      notify("Invitation link copied");
      if (shareDialogRef.current && shareDialogRef.current.open) {
        shareDialogRef.current.close();
      }
    } else {
      if (shareDialogRef.current && !shareDialogRef.current.open) {
        shareDialogRef.current.showModal();
      }
      notify("Select and copy the invitation link.");
    }
  }, [getShareUrl, notify]);

  // Share invitation button
  const handleShare = useCallback(async () => {
    const url = getShareUrl();
    const data = {
      title: "Amulya & Vedant · You’re invited",
      text: "Join us for our wedding celebrations in Varanasi, 24–26 November 2026. With love and blessings, Agrawal Family.",
      url: url,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
    if (shareDialogRef.current) {
      shareDialogRef.current.showModal();
    }
  }, [getShareUrl]);

  // Initial mount and listeners
  useEffect(() => {
    document.body.classList.add("vedam-page", "invitation-closed");
    document.body.setAttribute("data-lenis-prevent", "true");

    // Loader ready
    const timer = setTimeout(() => {
      setIsReady(true);
      document.body.classList.add("ready");
    }, 400);

    // Visibility listener for audio
    const handleVisibility = () => {
      if (!audioContextRef.current) return;
      const ctx = audioContextRef.current;
      if (document.hidden) {
        musicGainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.15);
      } else if (musicOnRef.current) {
        musicGainRef.current.gain.setTargetAtTime(0.72, ctx.currentTime, 0.4);
        instrumentalPhrase();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Countdown interval
    const updateCountdown = () => {
      const remaining = Math.max(0, WEDDING_TIME - Date.now());
      const d = Math.floor(remaining / 86400000);
      const h = Math.floor(remaining / 3600000) % 24;
      const m = Math.floor(remaining / 60000) % 60;
      const s = Math.floor(remaining / 1000) % 60;
      setCountdown({
        days: String(d).padStart(2, "0"),
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
        isStarted: remaining === 0,
      });
      setTickSeconds(true);
      setTimeout(() => setTickSeconds(false), 350);
    };
    updateCountdown();
    const cdInterval = setInterval(updateCountdown, 1000);

    // Resize handler for event track
    const handleResize = () => {
      showEvent(activeEventTab);
    };
    window.addEventListener("resize", handleResize);

    // Scroll reveal observer
    let revealObserver, sceneObserver;
    if ("IntersectionObserver" in window) {
      document.body.classList.add("motion-enabled");
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -12px 0px" }
      );
      document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

      sceneObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle("is-active", entry.isIntersecting);
          });
        },
        { threshold: 0.05 }
      );
      document.querySelectorAll(".scene").forEach((el) => sceneObserver.observe(el));
    }

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearInterval(cdInterval);
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
      if (revealObserver) revealObserver.disconnect();
      if (sceneObserver) sceneObserver.disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => { });
      }
      document.body.removeAttribute("data-lenis-prevent");
      document.body.classList.remove(
        "vedam-page",
        "invitation-closed",
        "opening-is-active",
        "motion-enabled",
        "ready"
      );
    };
  }, [activeEventTab, instrumentalPhrase, showEvent]);

  // Forward wheel events from window/margins to invitation container
  useEffect(() => {
    if (!isOpened) return;
    const handleWindowWheel = (e) => {
      const inv = invitationRef.current;
      if (!inv) return;
      if (!inv.contains(e.target)) {
        inv.scrollTop += e.deltaY;
      }
    };
    window.addEventListener("wheel", handleWindowWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWindowWheel);
  }, [isOpened]);

  // Touch and pointer swipe handlers (does not capture pointer to allow vertical scrolling)
  const attachSwipe = useCallback((element, onPrev, onNext) => {
    if (!element) return;
    let start = null;

    const move = (x, y) => {
      if (!start) return;
      const dx = x - start.x;
      const dy = y - start.y;
      if (Math.abs(dy) > 18 && Math.abs(dy) > Math.abs(dx)) {
        start = null;
        return;
      }
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        start = null;
        if (dx < 0) onNext();
        else onPrev();
      }
    };

    const handlePointerDown = (e) => {
      if ((e.pointerType === "mouse" && e.button !== 0) || e.target.closest("button,a")) return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
    };

    const handlePointerMove = (e) => {
      if (start && e.pointerId === start.id) move(e.clientX, e.clientY);
    };

    const handlePointerUp = (e) => {
      if (start && e.pointerId === start.id) {
        move(e.clientX, e.clientY);
        start = null;
      }
    };

    const handlePointerCancel = () => {
      start = null;
    };

    element.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("pointercancel", handlePointerCancel);

    return () => {
      element.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("pointercancel", handlePointerCancel);
    };
  }, []);

  // Attach swipe to ceremonies track
  useEffect(() => {
    if (eventsTrackRef.current) {
      return attachSwipe(
        eventsTrackRef.current,
        () => showEvent(activeEventTab - 1),
        () => showEvent(activeEventTab + 1)
      );
    }
  }, [activeEventTab, attachSwipe, showEvent]);

  // Keep ceremonies slider aligned on window resize
  useEffect(() => {
    const handleResize = () => {
      if (eventsTrackRef.current) {
        const card = eventsTrackRef.current.querySelector(".event-card");
        if (card) {
          const step = card.getBoundingClientRect().width + 16;
          setTrackOffset(-activeEventTab * step);
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeEventTab]);

  // Attach swipe to gallery
  useEffect(() => {
    if (galleryStageRef.current) {
      return attachSwipe(
        galleryStageRef.current,
        () => showPhoto(photoIndex - 1),
        () => showPhoto(photoIndex + 1)
      );
    }
  }, [attachSwipe, photoIndex, showPhoto]);

  return (
    <div className="vedam-root">
      {/* Falling petals stream */}
      <div id="live-petals" className="live-petals" aria-hidden="true">
        {PETAL_PATHS.map((left, i) => (
          <span
            key={i}
            className="petal-flight"
            style={{
              "--petal-left": `${left}%`,
              "--petal-duration": `${12 + (i % 4) * 1.7}s`,
              "--petal-delay": `${-i * 2.1 - 0.5}s`,
              "--petal-drift": `${(i % 2 ? 1 : -1) * (16 + i * 2)}px`,
              "--petal-size": `${(i % 3) + 9}px`,
            }}
          >
            <svg
              className="live-petal-shape"
              width="24"
              height="36"
              viewBox="0 0 24 36"
              focusable="false"
            >
              <defs>
                <linearGradient id={`petal-shade-${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#f4cfbe" />
                  <stop offset=".55" stopColor="#d58a8b" />
                  <stop offset="1" stopColor="#bd666f" />
                </linearGradient>
              </defs>
              <path
                d="M20 2C24 14 18 31 3 34C-3 20 2 7 20 2Z"
                fill={`url(#petal-shade-${i})`}
                stroke="#b36b66"
                strokeWidth=".5"
              />
              <path
                d="M18 6C13 16 8 25 4 31"
                fill="none"
                stroke="#ffe6d5"
                strokeWidth=".7"
                opacity=".55"
              />
            </svg>
          </span>
        ))}
      </div>

      {/* SVG Definitions */}
      <svg className="svg-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <symbol id="lotus" viewBox="0 0 64 48">
            <path d="M32 36C20 29 21 17 32 5c11 12 12 24 0 31ZM30 36C17 37 9 26 10 15c13 2 21 9 22 21ZM34 36c13 1 21-10 20-21-13 2-21 9-22 21ZM31 39C17 46 5 37 3 29c12-2 23 3 28 10Zm2 0c14 7 26-2 28-10-12-2-23 3-28 10Z" />
          </symbol>
          <symbol id="arrow" viewBox="0 0 24 24">
            <path d="m9 5 7 7-7 7" />
          </symbol>
          <symbol id="map" viewBox="0 0 24 24">
            <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" fill="currentColor" stroke="none" />
            <circle cx="12" cy="10" r="2.3" fill="#f3c8b7" stroke="none" />
          </symbol>
          <symbol id="calendar" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M7 2v6m10-6v6M3 11h18m-13 4h2m4 0h2m-8 3h2" />
          </symbol>
          <symbol id="share" viewBox="0 0 24 24">
            <circle cx="18" cy="4" r="3" fill="currentColor" />
            <circle cx="5" cy="12" r="3" fill="currentColor" />
            <circle cx="18" cy="20" r="3" fill="currentColor" />
            <path d="m8 10 7-4M8 14l7 4" />
          </symbol>
          <symbol id="heart" viewBox="0 0 24 24">
            <path d="M20.5 4.5a5 5 0 0 0-7 0L12 6l-1.5-1.5a5 5 0 0 0-7 7L12 20l8.5-8.5a5 5 0 0 0 0-7Z" />
          </symbol>
          <symbol id="ring" viewBox="0 0 24 24">
            <circle cx="12" cy="15" r="7" />
            <path d="m8 3 4-2 4 2-4 5-4-5Z" />
          </symbol>
          <clipPath id="story-clip" clipPathUnits="objectBoundingBox">
            <path d="M.5 0C.47 .05 .41 .07 .38 .12C.32 .105 .27 .13 .25 .18C.18 .165 .12 .19 .12 .25C.05 .25 0 .32 0 .39V1H1V.39C1 .32 .95 .25 .88 .25C.88 .19 .82 .165 .75 .18C.73 .13 .68 .105 .62 .12C.59 .07 .53 .05 .5 0Z" />
          </clipPath>
          <clipPath id="gallery-clip" clipPathUnits="objectBoundingBox">
            <path d="M.055 0H.945Q.945 .025 .97 .025Q1 .025 1 .06V.94Q1 .975 .97 .975Q.945 .975 .945 1H.055Q.055 .975 .03 .975Q0 .975 0 .94V.06Q0 .025 .03 .025Q.055 .025 .055 0Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Loader */}
      <div className={`loader ${isReady ? "ready" : ""}`} aria-hidden="true">
        <span>#VedAm</span>
        <small>A celebration awaits</small>
      </div>

      {/* Opening Envelope Screen */}
      <section
        className={`opening ${isOpened ? "is-hidden" : ""}`}
        id="opening"
        ref={openingRef}
        aria-labelledby="opening-title"
        hidden={isOpened}
        style={isOpened ? { display: "none", pointerEvents: "none" } : undefined}
      >
        <div className="opening-stage">
          <img
            className="opening-art"
            src="/amulya-weds-vedant/assets/v3-opening.webp"
            width="945"
            height="1680"
            alt="Blush floral envelope with an embossed gold lotus seal"
          />
          <img
            className="botanical opening-flower-left"
            src="/amulya-weds-vedant/assets/lotus-branch.webp"
            width="500"
            height="750"
            alt=""
            aria-hidden="true"
          />
          <img
            className="botanical opening-flower-right"
            src="/amulya-weds-vedant/assets/lotus-branch.webp"
            width="500"
            height="750"
            alt=""
            aria-hidden="true"
          />
          <div className="petal-field" aria-hidden="true"></div>
          <p className="envelope-monogram">#VedAm</p>
          <button
            id="open-envelope"
            className="seal-trigger"
            aria-label="Tap the golden seal to open Amulya and Vedant’s wedding invitation"
            onClick={() => openEnvelope()}
            disabled={isOpened}
          >
            <span className="seal-light" aria-hidden="true"></span>
          </button>
          <h1 id="opening-title">A celebration awaits</h1>
          <button className="tap-open" onClick={() => openEnvelope()} disabled={isOpened}>
            Tap to open
          </button>
        </div>
        <a
          className="skip-link"
          href="#welcome"
          onClick={(e) => {
            e.preventDefault();
            openEnvelope({ silent: true });
          }}
        >
          Skip opening
        </a>
      </section>

      {/* Radiance overlay */}
      <div className="opening-radiance" ref={radianceRef} aria-hidden="true"></div>

      {/* Main Invitation */}
      <main
        className="invitation"
        id="invitation"
        ref={invitationRef}
        hidden={!isOpened}
        tabIndex="-1"
        aria-label="Amulya and Vedant’s wedding invitation"
        data-lenis-prevent="true"
        data-lenis-prevent-wheel="true"
        data-lenis-prevent-touch="true"
      >
        {/* Scene 1: Hero */}
        <section className="scene hero" id="welcome" aria-labelledby="couple-names">
          <img
            className="screen-art"
            src="/amulya-weds-vedant/assets/v3-hero.webp"
            width="945"
            height="1680"
            alt=""
            loading="lazy"
          />
          <p className="eyebrow hero-eyebrow reveal">Together with their families</p>
          <h2 className="couple-names" id="couple-names">
            <span className="name-bride reveal">Amulya</span>
            <span className="name-connector reveal">AND</span>
            <span className="name-groom reveal">Vedant</span>
          </h2>
          <div className="hero-information reveal">
            <p className="hero-date">26 November 2026</p>
            <p className="venue-name">Hotel De Paris</p>
            <p className="address">The Mall Road, Varanasi Cantonment</p>
          </div>
          <a
            className="pill primary hero-cta reveal"
            href="#blessings"
            onClick={(e) => {
              e.preventDefault();
              goTo("blessings");
            }}
          >
            <span>Begin the celebration</span>
          </a>
          <img
            className="hero-foreground ambient"
            src="/amulya-weds-vedant/assets/v3-herons.webp"
            width="1000"
            height="495"
            alt="White herons among painted pink lotus flowers"
            loading="lazy"
          />
          <span className="water-shimmer hero-water" aria-hidden="true"></span>
        </section>

        {/* Scene 2: Blessings */}
        <section className="scene blessings" id="blessings" aria-labelledby="blessing-title">
          <img
            className="screen-art"
            src="/amulya-weds-vedant/assets/illustration-v2-3.webp"
            width="945"
            height="1680"
            alt="Lord Ganesha seated on a lotus within a delicate lotus-vine wreath"
            loading="lazy"
          />
          <div className="ganesha-halo" aria-hidden="true"></div>
          <h2 id="blessing-title" className="sanskrit reveal" lang="sa">
            श्री गणेशाय नमः
          </h2>
          <p className="blessing-copy reveal">
            With divine blessings,
            <br />a beautiful new chapter begins.
          </p>
        </section>

        {/* Scene 3: Formal Invitation */}
        <section className="scene formal" id="wedding-invitation" aria-labelledby="formal-title">
          <img
            className="screen-art"
            src="/amulya-weds-vedant/assets/v5-formal.webp"
            width="1000"
            height="1778"
            alt=""
            loading="lazy"
          />
          <div className="formal-copy">
            <p className="eyebrow reveal">Together with their families</p>
            <div className="compact-parents reveal">
              <p>Mrs. Shilpi &amp; Mr. Yogesh Agrawal</p>
              <small>and</small>
              <p>Mrs. Ritu &amp; Mr. Pradeep Jain</p>
            </div>
            <p className="family-request reveal">
              request the pleasure of your company
              <br />
              at the wedding celebration of
            </p>
            <h2 className="compact-names reveal" id="formal-title">
              Amulya <i>&amp;</i> Vedant
            </h2>
            <div className="formal-date reveal">
              <p>Thursday, 26 November 2026</p>
              <p>7:30 PM</p>
            </div>
            <div className="formal-venue reveal">
              <h3>Hotel De Paris</h3>
              <p className="address">
                The Mall Road,
                <br />
                Varanasi Cantonment
              </p>
            </div>
          </div>

          {/* Peacocks Left SVG Rig */}
          <svg className="peacock peacock-left peacock-rig" viewBox="0 0 500 491" aria-hidden="true" focusable="false">
            <defs>
              <clipPath id="p-left-head">
                <path d="M278 0H440V128L375 205L305 182L294 110Z" />
              </clipPath>
              <clipPath id="p-left-tail">
                <path d="M0 215L195 152L292 231L232 360L130 491H0Z" />
              </clipPath>
              <mask id="p-left-body" maskUnits="userSpaceOnUse" x="0" y="0" width="500" height="491">
                <rect width="500" height="491" fill="white" stroke="none" />
                <path d="M278 0H440V128L375 205L305 182L294 110Z" fill="black" stroke="none" />
                <path d="M0 215L195 152L292 231L232 360L130 491H0Z" fill="black" stroke="none" />
              </mask>
            </defs>
            <g className="peacock-tail" clipPath="url(#p-left-tail)">
              <image href="/amulya-weds-vedant/assets/v3-peacocks.webp" x="0" y="0" width="1000" height="491" />
            </g>
            <g mask="url(#p-left-body)">
              <image href="/amulya-weds-vedant/assets/v3-peacocks.webp" x="0" y="0" width="1000" height="491" />
            </g>
            <g className="peacock-neck" clipPath="url(#p-left-head)">
              <image href="/amulya-weds-vedant/assets/v3-peacocks.webp" x="0" y="0" width="1000" height="491" />
            </g>
          </svg>

          {/* Peacocks Right SVG Rig */}
          <svg className="peacock peacock-right peacock-rig" viewBox="0 0 500 491" aria-hidden="true" focusable="false">
            <defs>
              <clipPath id="p-right-head">
                <path d="M222 0H60V128L125 205L195 182L206 110Z" />
              </clipPath>
              <clipPath id="p-right-tail">
                <path d="M500 215L305 152L208 231L268 360L370 491H500Z" />
              </clipPath>
              <mask id="p-right-body" maskUnits="userSpaceOnUse" x="0" y="0" width="500" height="491">
                <rect width="500" height="491" fill="white" stroke="none" />
                <path d="M222 0H60V128L125 205L195 182L206 110Z" fill="black" stroke="none" />
                <path d="M500 215L305 152L208 231L268 360L370 491H500Z" fill="black" stroke="none" />
              </mask>
            </defs>
            <g className="peacock-tail" clipPath="url(#p-right-tail)">
              <image href="/amulya-weds-vedant/assets/v3-peacocks.webp" x="-500" y="0" width="1000" height="491" />
            </g>
            <g mask="url(#p-right-body)">
              <image href="/amulya-weds-vedant/assets/v3-peacocks.webp" x="-500" y="0" width="1000" height="491" />
            </g>
            <g className="peacock-neck" clipPath="url(#p-right-head)">
              <image href="/amulya-weds-vedant/assets/v3-peacocks.webp" x="-500" y="0" width="1000" height="491" />
            </g>
          </svg>

          <span className="water-shimmer formal-water" aria-hidden="true"></span>
        </section>

        {/* Scene 4: Countdown */}
        <section className="scene countdown-scene" id="countdown" aria-labelledby="countdown-title">
          <img
            className="screen-art"
            src="/amulya-weds-vedant/assets/v3-countdown.webp"
            width="945"
            height="1680"
            alt="Four illustrated lotus medallions suspended from a gold chain"
            loading="lazy"
          />
          <h2 className="section-heading countdown-title reveal" id="countdown-title">
            Until we celebrate
            <br />
            together
          </h2>
          <div className="countdown" role="timer" aria-label="Time remaining until the wedding">
            <div className="time-unit">
              <img src="/amulya-weds-vedant/assets/v3-medallion.webp" width="661" height="1000" alt="" loading="lazy" />
              <b id="days">{countdown.days}</b>
              <small>Days</small>
            </div>
            <div className="time-unit">
              <img src="/amulya-weds-vedant/assets/v3-medallion.webp" width="661" height="1000" alt="" loading="lazy" />
              <b id="hours">{countdown.hours}</b>
              <small>Hours</small>
            </div>
            <div className="time-unit">
              <img src="/amulya-weds-vedant/assets/v3-medallion.webp" width="661" height="1000" alt="" loading="lazy" />
              <b id="minutes">{countdown.minutes}</b>
              <small>Minutes</small>
            </div>
            <div className="time-unit">
              <img src="/amulya-weds-vedant/assets/v3-medallion.webp" width="661" height="1000" alt="" loading="lazy" />
              <b id="seconds" className={tickSeconds ? "tick" : ""}>
                {countdown.seconds}
              </b>
              <small>Seconds</small>
            </div>
          </div>
          <span className="riverboat boat-one ambient" aria-hidden="true"></span>
          <span className="riverboat boat-two ambient" aria-hidden="true"></span>
          <p className="countdown-date reveal">26 November 2026 · 7:30 PM</p>
          <p className="countdown-note" hidden={!countdown.isStarted}>
            The celebration has begun.
          </p>
        </section>

        {/* Scene 5: Celebrations / Ceremonies */}
        <section className="scene celebrations" id="celebrations" aria-labelledby="events-title">
          <img
            className="screen-art"
            src="/amulya-weds-vedant/assets/v3-events.webp"
            width="945"
            height="1680"
            alt=""
            loading="lazy"
          />
          <img
            className="botanical event-flower-left"
            src="/amulya-weds-vedant/assets/lotus-branch.webp"
            width="500"
            height="750"
            alt=""
            aria-hidden="true"
          />
          <img
            className="botanical event-flower-right"
            src="/amulya-weds-vedant/assets/lotus-branch.webp"
            width="500"
            height="750"
            alt=""
            aria-hidden="true"
          />
          <h2 className="section-heading events-title reveal" id="events-title">
            The Celebrations
          </h2>
          <div className="event-tabs" role="tablist" aria-label="Wedding ceremonies">
            {["Mehendi", "Haldi", "Wedding"].map((name, i) => (
              <button
                key={name}
                id={`tab-${i}`}
                role="tab"
                aria-controls={`event-${i}`}
                aria-selected={activeEventTab === i}
                tabIndex={activeEventTab === i ? 0 : -1}
                onClick={() => showEvent(i)}
                onKeyDown={(e) => {
                  const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
                  if (!keys.includes(e.key)) return;
                  e.preventDefault();
                  showEvent(e.key === "Home" ? 0 : e.key === "End" ? 2 : activeEventTab + (e.key === "ArrowRight" ? 1 : -1));
                }}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="event-carousel">
            <div
              className="events-track"
              ref={eventsTrackRef}
              style={{ transform: `translateX(${trackOffset}px)` }}
            >
              {/* Event 0: Mehendi */}
              <article className="event-card" id="event-0" role="tabpanel" aria-labelledby="tab-0">
                <img className="event-frame" src="/amulya-weds-vedant/assets/event-frame-v2.webp" width="900" height="1200" alt="" loading="lazy" />
                <div className="ceremony-art mehendi-art" role="img" aria-label="Decorated bowl with lotus flowers"></div>
                <h3>Mehendi Ceremony</h3>
                <p className="event-date">
                  Tuesday, 24 November 2026<br />
                  <span>10:30 AM</span>
                </p>
                <h4>Shakuntala Niwas</h4>
                <p className="event-address">Sunderpur, Varanasi</p>
                <a
                  className="pill directions"
                  href="https://www.google.com/maps/search/?api=1&query=Shakuntala+Niwas%2C+Sunderpur%2C+Varanasi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg><use href="#map" /></svg>View Directions
                </a>
              </article>

              {/* Event 1: Haldi */}
              <article className="event-card" id="event-1" role="tabpanel" aria-labelledby="tab-1">
                <img className="event-frame" src="/amulya-weds-vedant/assets/event-frame-v2.webp" width="900" height="1200" alt="" loading="lazy" />
                <div className="ceremony-art haldi-art" role="img" aria-label="Turmeric bowl and marigold flowers"></div>
                <h3>Haldi Ceremony</h3>
                <p className="event-date">
                  Thursday, 26 November 2026<br />
                  <span>9:00 AM</span>
                </p>
                <h4>Hotel De Paris</h4>
                <p className="event-address">
                  The Mall Road,<br />
                  Varanasi Cantonment
                </p>
                <a
                  className="pill directions"
                  href="https://www.google.com/maps/search/?api=1&query=Hotel+De+Paris%2C+The+Mall+Road%2C+Varanasi+Cantonment"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg><use href="#map" /></svg>View Directions
                </a>
              </article>

              {/* Event 2: Wedding */}
              <article className="event-card" id="event-2" role="tabpanel" aria-labelledby="tab-2">
                <img className="event-frame" src="/amulya-weds-vedant/assets/event-frame-v2.webp" width="900" height="1200" alt="" loading="lazy" />
                <div className="ceremony-art wedding-art" role="img" aria-label="Floral wedding mandap with a sacred flame"></div>
                <h3>Wedding Ceremony</h3>
                <p className="event-date">
                  Thursday, 26 November 2026<br />
                  <span>7:30 PM</span>
                </p>
                <h4>Hotel De Paris</h4>
                <p className="event-address">
                  The Mall Road,<br />
                  Varanasi Cantonment
                </p>
                <a
                  className="pill directions"
                  href="https://www.google.com/maps/search/?api=1&query=Hotel+De+Paris%2C+The+Mall+Road%2C+Varanasi+Cantonment"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg><use href="#map" /></svg>View Directions
                </a>
              </article>
            </div>

            <button
              className="round-arrow event-prev"
              aria-label="Previous ceremony"
              onClick={() => showEvent(activeEventTab - 1)}
            >
              <svg><use href="#arrow" /></svg>
            </button>
            <button
              className="round-arrow event-next"
              aria-label="Next ceremony"
              onClick={() => showEvent(activeEventTab + 1)}
            >
              <svg><use href="#arrow" /></svg>
            </button>
          </div>

          <div className="carousel-status">
            <div className="event-dots">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  className={activeEventTab === i ? "active" : ""}
                  aria-label={`Show ${["Mehendi", "Haldi", "Wedding"][i]}`}
                  aria-pressed={activeEventTab === i}
                  onClick={() => showEvent(i)}
                ></button>
              ))}
            </div>
            <p className="event-count" aria-live="polite">
              {activeEventTab + 1} of 3
            </p>
          </div>
        </section>

        {/* Scene 6: Our Story */}
        <section className="scene story" id="our-story" aria-labelledby="story-title">
          <div className="story-arch">
            <img
              className="story-arch-art"
              src="/amulya-weds-vedant/assets/illustration-v2-7.webp"
              width="1000"
              height="1778"
              alt=""
              loading="lazy"
            />
            <figure className="story-photo reveal">
              <img
                src="/amulya-weds-vedant/assets/couple-engagement.webp"
                width="958"
                height="1280"
                alt="Amulya and Vedant at their engagement celebration"
                loading="lazy"
              />
            </figure>
            <img
              className="botanical story-bloom-left"
              src="/amulya-weds-vedant/assets/lotus-branch.webp"
              width="500"
              height="750"
              alt=""
              aria-hidden="true"
            />
            <img
              className="botanical story-bloom-right"
              src="/amulya-weds-vedant/assets/lotus-branch.webp"
              width="500"
              height="750"
              alt=""
              aria-hidden="true"
            />
          </div>
          <h2 className="section-heading story-title reveal" id="story-title">
            Our Story
          </h2>
          <div className="person person-bride reveal">
            <img src="/amulya-weds-vedant/assets/v3-rabbit.webp" width="300" height="300" alt="" loading="lazy" />
            <p>
              <strong>Amulya</strong> — A perfect blend of bubbly, cute and beautifully rebellious! Meet the “Bride to Be”.
            </p>
          </div>
          <div className="person person-groom reveal">
            <img src="/amulya-weds-vedant/assets/v3-horse.webp" width="300" height="300" alt="" loading="lazy" />
            <p>
              <strong>Vedant</strong> — The one with the Brightest mind and warmest heart. Meet the “Groom to Be”.
            </p>
          </div>
          <ol className="milestones">
            <li className="reveal">
              <svg><use href="#heart" /></svg>
              <p><strong>Our beginning</strong> · Two hearts, one journey</p>
            </li>
            <li className="reveal">
              <svg><use href="#ring" /></svg>
              <p><strong>Engaged</strong> · 25 January 2026</p>
            </li>
            <li className="reveal">
              <svg><use href="#calendar" /></svg>
              <p><strong>Wedding</strong> · 26 November 2026</p>
            </li>
          </ol>
        </section>

        {/* Scene 7: Gallery */}
        <section className="scene gallery" id="gallery" aria-labelledby="gallery-title">
          <img
            className="screen-art"
            src="/amulya-weds-vedant/assets/illustration-v2-8.webp"
            width="945"
            height="1680"
            alt=""
            loading="lazy"
          />
          <h2 className="section-heading gallery-title reveal" id="gallery-title">
            A few frames of us
          </h2>
          <div className="gallery-stage reveal" ref={galleryStageRef}>
            <figure
              className={`gallery-photo ${isPhotoChanging ? "is-changing" : ""}`}
              tabIndex="0"
              aria-label="Photograph gallery. Use left and right arrow keys to browse."
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                  e.preventDefault();
                  showPhoto(photoIndex + (e.key === "ArrowRight" ? 1 : -1));
                }
              }}
            >
              <img
                id="gallery-image"
                src={PHOTOS[photoIndex].src}
                width="1000"
                height="1300"
                alt={PHOTOS[photoIndex].alt}
                loading="lazy"
                style={{
                  objectPosition: PHOTOS[photoIndex].position || "50% 40%",
                }}
              />
            </figure>
            <svg
              className="gallery-frame"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              style={{ width: "100%", height: "100%" }}
            >
              <path d="M6 1H94Q94 3 97 3Q99 3 99 6V94Q99 97 97 97Q94 97 94 99H6Q6 97 3 97Q1 97 1 94V6Q1 3 3 3Q6 3 6 1Z" />
            </svg>
            <button
              className="round-arrow gallery-prev"
              aria-label="Previous photograph"
              onClick={() => showPhoto(photoIndex - 1)}
            >
              <svg><use href="#arrow" /></svg>
            </button>
            <button
              className="round-arrow gallery-next"
              aria-label="Next photograph"
              onClick={() => showPhoto(photoIndex + 1)}
            >
              <svg><use href="#arrow" /></svg>
            </button>
          </div>

          <div className="gallery-dots">
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                className={photoIndex === i ? "active" : ""}
                aria-label={`Show photograph ${i + 1}`}
                aria-pressed={photoIndex === i}
                onClick={() => showPhoto(i)}
              ></button>
            ))}
          </div>
          <p className="gallery-count" aria-live="polite">
            {photoIndex + 1} of 4
          </p>
          <p className="swipe-hint">Swipe to see more</p>

          <div className="gallery-thumbnails" aria-label="More photographs">
            {PHOTOS.map((photo, i) => {
              if (i === photoIndex) return null;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show photograph ${i + 1}`}
                  onClick={() => showPhoto(i)}
                >
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Scene 8: Closing & Wedding Information */}
        <section className="scene closing" id="wedding-information" aria-labelledby="closing-title">
          <img
            className="screen-art"
            src="/amulya-weds-vedant/assets/illustration-v2-9.webp"
            width="945"
            height="1680"
            alt="Ornamental monogram frame, lotus vines and two ivory cows"
            loading="lazy"
          />
          <p className="closing-monogram reveal">#VedAm</p>
          <h2 className="section-heading closing-title reveal" id="closing-title">
            We cannot wait to
            <br />
            celebrate with you.
          </h2>
          <img
            className="closing-mark painted-lotus ambient"
            src="/amulya-weds-vedant/assets/v3-lotus.webp"
            width="1000"
            height="678"
            alt=""
            loading="lazy"
          />
          <p className="family-blessing reveal">
            With love and blessings,
            <br />
            <strong>Agrawal Family</strong>
          </p>
          <div className="closing-actions reveal">
            <a
              className="pill primary"
              id="add-calendar"
              href="/amulya-weds-vedant/assets/Amulya-and-Vedant-Celebrations.ics"
              download="Amulya-and-Vedant-Celebrations.ics"
              onClick={() => notify("Open the calendar file to save all three celebrations.")}
            >
              <svg><use href="#calendar" /></svg>
              <span>Add to Calendar</span>
              <svg className="action-chevron"><use href="#arrow" /></svg>
            </a>
            <a
              className="pill"
              href="https://www.google.com/maps/search/?api=1&query=Hotel+De+Paris%2C+The+Mall+Road%2C+Varanasi+Cantonment"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg><use href="#map" /></svg>
              <span>View Directions</span>
              <svg className="action-chevron"><use href="#arrow" /></svg>
            </a>
            <button className="pill share-button" id="share-invitation" onClick={handleShare}>
              <svg><use href="#share" /></svg>
              <span>Share Invitation</span>
              <svg className="action-chevron"><use href="#arrow" /></svg>
            </button>
          </div>
          <img
            className="botanical closing-bloom-left"
            src="/amulya-weds-vedant/assets/lotus-branch.webp"
            width="500"
            height="750"
            alt=""
            aria-hidden="true"
          />
          <img
            className="botanical closing-bloom-right"
            src="/amulya-weds-vedant/assets/lotus-branch.webp"
            width="500"
            height="750"
            alt=""
            aria-hidden="true"
          />
          <div className="closing-petals" aria-hidden="true"></div>
        </section>
      </main>

      {/* Floating Controls */}
      <div className="floating-controls" ref={controlsRef} aria-label="Invitation controls">
        <button
          id="music-toggle"
          aria-label={musicOn ? "Pause instrumental music" : "Play instrumental music"}
          aria-pressed={musicOn}
          className={musicOn ? "music-playing" : ""}
          onClick={() => setMusic(!musicOn)}
        >
          <span className="music-disc" aria-hidden="true"></span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 18V5l11-2v13M9 8l11-2" />
            <ellipse cx="6" cy="18" rx="3" ry="2" />
            <ellipse cx="17" cy="16" rx="3" ry="2" />
          </svg>
          <span className="music-slash"></span>
        </button>
        <button
          id="navigation-toggle"
          aria-label="Open section navigation"
          aria-haspopup="dialog"
          onClick={() => {
            if (navDialogRef.current) navDialogRef.current.showModal();
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 6h14M5 12h14M5 18h14" />
          </svg>
        </button>
      </div>

      {/* Navigation Slide-Over Modal */}
      <dialog
        className="navigation-dialog"
        ref={navDialogRef}
        aria-labelledby="navigation-title"
        onClick={(e) => {
          if (navDialogRef.current && e.target === navDialogRef.current) {
            const rect = navDialogRef.current.getBoundingClientRect();
            if (e.clientX < rect.left) navDialogRef.current.close();
          }
        }}
      >
        <div className="navigation-inner">
          <button
            className="close-nav"
            aria-label="Close navigation"
            onClick={() => navDialogRef.current && navDialogRef.current.close()}
          >
            ×
          </button>
          <p className="eyebrow">AMULYA &amp; VEDANT</p>
          <h2 id="navigation-title">The celebration</h2>
          <svg className="lotus-mark" viewBox="0 0 64 48" aria-hidden="true">
            <use href="#lotus" />
          </svg>
          <nav>
            {[
              { href: "welcome", label: "Welcome" },
              { href: "blessings", label: "Blessings" },
              { href: "wedding-invitation", label: "Invitation" },
              { href: "countdown", label: "Countdown" },
              { href: "celebrations", label: "Celebrations" },
              { href: "our-story", label: "Our Story" },
              { href: "gallery", label: "Gallery" },
              { href: "wedding-information", label: "Wedding Information" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={`#${href}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (navDialogRef.current) navDialogRef.current.close();
                  goTo(href);
                }}
              >
                {label}
              </a>
            ))}
          </nav>
          <p className="nav-date">26 NOVEMBER 2026 · VARANASI</p>
        </div>
      </dialog>

      {/* Share Dialog */}
      <dialog
        className="share-dialog"
        ref={shareDialogRef}
        aria-labelledby="share-title"
        onClick={(e) => {
          if (shareDialogRef.current && e.target === shareDialogRef.current) {
            const r = shareDialogRef.current.getBoundingClientRect();
            if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
              shareDialogRef.current.close();
            }
          }
        }}
      >
        <button
          className="close-share"
          aria-label="Close sharing"
          onClick={() => shareDialogRef.current && shareDialogRef.current.close()}
        >
          ×
        </button>
        <h2 id="share-title">Share the celebration</h2>
        <p>Send a little love to someone you’d like to celebrate with.</p>
        <input id="share-url" aria-label="Invitation link" value={getShareUrl()} readOnly />
        <button className="pill primary" id="copy-link" onClick={copyInvitation}>
          Copy invitation link
        </button>
      </dialog>

      {/* Toast */}
      <div className={`toast ${toastMessage ? "show" : ""}`} role="status" aria-live="polite">
        {toastMessage}
      </div>
    </div>
  );
}
