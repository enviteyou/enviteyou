"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Heart, Flower2, Shirt, Building2, Hash, Gift, Utensils, Camera, ExternalLink, Check, Calendar } from "lucide-react";
import { useAudio } from "../../hooks/useAudio";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    // Crucial for mobile: Prevents ScrollTrigger from recalculating wildly when the URL bar collapses/expands
    ScrollTrigger.config({ ignoreMobileResize: true });
    // Normalizes touch scroll on mobile devices to prevent iOS Safari jitter when pinning
    ScrollTrigger.normalizeScroll(true);
}

// Set this to true to display GSAP ScrollTrigger active regions on screen for debugging
const showGSAPMarkers = false;

// -------------------------------------------------------------
// Helper Components for Animations
// -------------------------------------------------------------

const FallingPetals = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const petals = [];

        const width = container.clientWidth;
        const height = window.innerHeight;

        // Create petal elements
        for (let i = 0; i < 25; i++) {
            const petal = document.createElement("div");
            petal.className = "absolute size-2 md:size-4 bg-[#e63946] rounded-tl-full rounded-br-full opacity-80 z-20 pointer-events-none shadow-sm";

            // Initial random styling
            gsap.set(petal, {
                x: Math.random() * width,
                y: -50,
                rotation: Math.random() * 360,
                scale: Math.random() * 0.5 + 0.5,
            });

            container.appendChild(petal);
            petals.push(petal);

            // Animate each petal continuously
            gsap.to(petal, {
                y: height + 100,
                x: `+=${Math.random() * 200 - 100}`,
                rotation: `+=${Math.random() * 360 + 180}`,
                duration: Math.random() * 5 + 5,
                ease: "none",
                repeat: -1,
                delay: Math.random() * 5,
            });
        }

        return () => {
            petals.forEach(p => p.remove());
        };
    }, []);

    return <div ref={containerRef} className="fixed top-0 bottom-0 w-full max-w-120 pointer-events-none z-50 overflow-hidden" />;
};

const TwinklingStars = () => {
    const [stars] = useState(() =>
        [...Array(50)].map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            duration: `${Math.random() * 3 + 2}s`,
            delay: `${Math.random() * 2}s`
        }))
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {stars.map((star, i) => (
                <div
                    key={i}
                    className="absolute size-0.75 bg-[#fdf9ef] rounded-full"
                    style={{
                        top: star.top,
                        left: star.left,
                        animation: `twinkle ${star.duration} ease-in-out infinite ${star.delay}`
                    }}
                />
            ))}
        </div>
    );
};

const AnimatedBird = ({ top, delay = 0 }) => {
    return (
        <div
            className={`absolute z-30 opacity-80 left-1/2 -ml-6.25 pointer-events-none ${top}`}
            style={{
                animation: `bird-fly-across 12s linear infinite ${delay}s`,
                width: '70px',
                height: '70px'
            }}
        >
            <div className="size-full overflow-hidden mix-blend-multiply" style={{ transform: 'scaleX(-1)' }}>
                <Image
                    src="/assets/template/01/bird-sprite.png"
                    alt="Bird"
                    width={3600}
                    height={804}
                    priority
                    className="h-full max-w-none mix-blend-multiply"
                    style={{
                        width: '600%',
                        height: '100%',
                        animation: `flap 0.5s steps(6) infinite`
                    }}
                />
            </div>
        </div>
    );
};

// -------------------------------------------------------------
// Main Template
// -------------------------------------------------------------

// -------------------------------------------------------------
// Static Data
// -------------------------------------------------------------

const defaultGalleryPhotos = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800",
        caption: "The First Glimpse",
        date: "30 JUN 2026",
        desc: "A moment suspended in time, where two paths converge into a single beautiful journey.",
        align: "start",
        width: "w-[65%]",
        aspect: "aspect-3/4",
        hangType: "double",
        hangHeight: "h-16",
        rotate: "-1.5deg"
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
        caption: "A Thousand Promises",
        date: "1 JUL 2026",
        desc: "Under the golden sky, whispers of forever are woven into the breeze.",
        align: "end",
        width: "w-[70%]",
        aspect: "aspect-4/3",
        hangType: "triangle",
        hangHeight: "h-20",
        rotate: "1.2deg"
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        caption: "Hand in Hand",
        date: "2 JUL 2026",
        desc: "Tracing paths of warmth, taking steps towards our forever home.",
        align: "start",
        width: "w-[62%]",
        aspect: "aspect-square",
        hangType: "double",
        hangHeight: "h-24",
        rotate: "-1deg"
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
        caption: "Forever & Always",
        date: "3 JUL 2026",
        desc: "The beginning of a beautiful forever, written in the stars.",
        align: "center",
        width: "w-[80%]",
        aspect: "aspect-16/10",
        hangType: "triangle",
        hangHeight: "h-16",
        rotate: "0.5deg"
    }
];

const defaultEvents = [
    { title: "Battisi & Mehendi", date: "30 JUN 2026 • 5:00 PM", venue: "Uttam Bhawan, Gzb", desc: "A celebration woven with family traditions, vibrant mehendi, and a sister's heartfelt invitation." },
    { title: "Ganesh Puja", date: "1 JUL 2026 • 11:00 AM", venue: "Home, Ghaziabad", desc: "Seeking divine blessings, celebrating love, and creating memories together." },
    { title: "Haldi & Carnival", date: "2 JUL 2026 • 10:30 AM", venue: "SNJ Laxmi Dham, Vrindavan", desc: "Golden hues, saffron paste, and laughter filling the morning air." },
    { title: "Baraat", date: "3 JUL 2026 • 2:30 PM", venue: "SNJ Laxmi Dham, Vrindavan", desc: "The groom's procession departures with music, dancing, and festive cheer." },
    { title: "Pheras", date: "3 JUL 2026 • 6:00 PM", venue: "SNJ Laxmi Dham, Vrindavan", desc: "The sacred fire witnesses seven rounds and eternal promises." },
    { title: "Reception", date: "3 JUL 2026 • 8:30 PM", venue: "SNJ Laxmi Dham, Vrindavan", desc: "Dance, dine, and celebrate as the newlyweds take the floor." }
];

export default function Template01({ formData = {}, template = {}, embedded = false }) {
    const { isPlaying: isAudioPlaying, toggleAudio, playAudio, audioNode } = useAudio("/assets/template/01/kesariya-rang.mp3");
    const [hasStarted, setHasStarted] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null); // 3D Lightbox selected image state
    const [copiedHashtag, setCopiedHashtag] = useState(false);

    // Derived values from formData (fall back to defaults)
    const brideName = (formData?.bride || "Janvi").trim();
    const groomName = (formData?.groom || "Prateek").trim();
    const reverseOrder = formData?.nameOrder === "groomFirst";
    const firstName = reverseOrder ? groomName : brideName;
    const secondName = reverseOrder ? brideName : groomName;
    const coupleNames = formData?.bride || formData?.groom ? `${firstName} & ${secondName}` : "PRATEEK & JANVI";

    const displayDate = formData?.date
        ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(formData.date))
        : "3 July 2026";

    const venue = formData?.venue || "SNJ Laxmi Dham, Vrindavan";
    const hashtag = formData?.hashtag || "#PrateekWedsJanvi";
    const whatsappNumber = formData?.whatsapp || "+919999999999";

    const galleryPhotosList = Array.isArray(formData?.galleryImages) && formData.galleryImages.length > 0
        ? formData.galleryImages.map((src, i) => ({ id: i + 1, src, caption: `Moment ${i + 1}`, date: displayDate, desc: "A captured memory.", align: i % 2 === 0 ? 'start' : 'end', aspect: 'aspect-4/3', hangType: 'double', hangHeight: 'h-16', rotate: '0deg' }))
        : defaultGalleryPhotos;

    const eventsList = Array.isArray(formData?.selectedEvents) && formData.selectedEvents.length > 0
        ? formData.selectedEvents.map((ev, i) => ({ title: ev, date: (formData?.eventDetails && formData.eventDetails[ev]?.date) || displayDate, venue: (formData?.eventDetails && formData.eventDetails[ev]?.venue) || venue, desc: (formData?.eventDetails && formData.eventDetails[ev]?.oneLiner) || "Event details coming soon." }))
        : defaultEvents;

    const familyLines = [
        formData?.brideFather && `Bride's father: ${formData.brideFather}`,
        formData?.brideMother && `Bride's mother: ${formData.brideMother}`,
        formData?.groomFather && `Groom's father: ${formData.groomFather}`,
        formData?.groomMother && `Groom's mother: ${formData.groomMother}`,
    ].filter(Boolean);

    const grandparentLines = formData?.grandparentsEnabled
        ? [
            formData?.brideGrandfather && `Bride's grandfather: ${formData.brideGrandfather}`,
            formData?.brideGrandmother && `Bride's grandmother: ${formData.brideGrandmother}`,
            formData?.groomGrandfather && `Groom's grandfather: ${formData.groomGrandfather}`,
            formData?.groomGrandmother && `Groom's grandmother: ${formData.groomGrandmother}`,
        ].filter(Boolean)
        : [];

    const infoCardEntries = Object.entries(formData?.infoCardsMap || {}).filter(([, value]) => Boolean(String(value || "").trim()));
    const personalityAnswers = Object.values(formData?.personalityAnswers || {}).filter(Boolean);
    const selectedEventDetails = Array.isArray(formData?.selectedEvents) ? formData.selectedEvents : [];
    const galleryImagesCount = Array.isArray(formData?.galleryImages) ? formData.galleryImages.filter(Boolean).length : 0;
    const storyText = (formData?.story || "").trim();
    const customHashtagText = (formData?.customHashtags || "").trim();
    const extraTagsText = (formData?.extraTags || "").trim();
    const guestQuestionsText = (formData?.guestQuestions || "").trim();
    const musicLinkText = (formData?.musicLink || "").trim();

    const handleCopyHashtag = useCallback(() => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(hashtag);
            setCopiedHashtag(true);
            setTimeout(() => setCopiedHashtag(false), 2000);
        }
    }, [hashtag]);

    const handleWhatsAppRSVP = useCallback(() => {
        const message = `Hello! I am confirming my attendance for ${coupleNames}'s wedding on ${displayDate}. Looking forward to celebrating at ${venue}.`;
        if (typeof window !== "undefined") {
            window.open(`https://api.whatsapp.com/send?phone=${encodeURIComponent(whatsappNumber)}&text=${encodeURIComponent(message)}`, "_blank");
        }
    }, [whatsappNumber, coupleNames, displayDate, venue]);

    const handleAppleCalendar = useCallback(() => {
        const dtstart = formData?.eventDate ? new Date(formData.eventDate).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z" : "20260703T123000Z";
        const dtend = formData?.eventDate ? new Date(formData.eventDate).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z" : "20260703T203000Z";
        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            `PRODID:-//${coupleNames}//Wedding Invite//EN`,
            "BEGIN:VEVENT",
            `UID:${(coupleNames).replace(/\s+/g, '-').toLowerCase()}-wedding@invite`,
            `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
            `DTSTART:${dtstart}`,
            `DTEND:${dtend}`,
            `SUMMARY:${coupleNames} Wedding Ceremony`,
            `DESCRIPTION:Celebrate the wedding ceremony of ${coupleNames} at ${venue}. Details and maps links are in the invite.`,
            `LOCATION:${venue}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");

        if (typeof window !== "undefined") {
            const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${(coupleNames).replace(/\s+/g, '_').toLowerCase()}_wedding.ics`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }, [formData?.eventDate, coupleNames, venue]);

    const heroRef = useRef(null);
    const eventsRef = useRef(null);

    // Entrance refs
    const gateLeftRef = useRef(null);
    const gateRightRef = useRef(null);
    const sealRef = useRef(null);

    const startExperience = useCallback(() => {
        if (hasStarted) return;

        playAudio();

        const tl = gsap.timeline({
            onComplete: () => {
                setHasStarted(true);
                gsap.set(".entrance-overlay", { display: "none" });

                gsap.fromTo(".hero-text-anim",
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
                );
            }
        });

        tl.to(sealRef.current, {
            scale: 1.5,
            opacity: 0,
            rotation: 180,
            duration: 0.8,
            ease: "power2.inOut"
        })
            .to(gateLeftRef.current, {
                xPercent: -100,
                rotationY: -45,
                duration: 1.5,
                ease: "power3.inOut"
            }, "-=0.3")
            .to(gateRightRef.current, {
                xPercent: 100,
                rotationY: 45,
                duration: 1.5,
                ease: "power3.inOut"
            }, "-=1.5")
            .to(".entrance-overlay", {
                backgroundColor: "rgba(0,0,0,0)",
                duration: 0.5
            }, "-=1");
    }, [hasStarted, playAudio]);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Scroll animations for event scrolls unrolling
            gsap.utils.toArray(".event-card-container").forEach((card, idx) => {
                const closedScroll = card.querySelector(".closed-scroll");
                const openScroll = card.querySelector(".open-scroll");
                const textContent = card.querySelector(".text-content");
                const cardGlow = card.querySelector(".card-bg-glow");
                const progressLine = card.querySelector(".timeline-progress-line");

                // Timeline nodes
                const nodePulse = card.querySelector(".timeline-node-pulse");
                const nodeDot = card.querySelector(".timeline-node-dot");
                const nodeCore = card.querySelector(".timeline-node-core");

                // Initialize starting states
                gsap.set(openScroll, { scaleY: 0.26, opacity: 0 });
                gsap.set(textContent, { opacity: 0, scale: 0.9, y: 15 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        end: "top 40%",
                        scrub: 1.2, // Adds smooth lag to absorb scroll jitter
                        markers: showGSAPMarkers,
                        id: `card-${idx}`
                    }
                });

                // Smooth morphing, unrolling, and item transitions
                tl.to(closedScroll, { opacity: 0, duration: 0.3 }, 0)
                    .fromTo(openScroll,
                        { scaleY: 0.26, opacity: 0 },
                        { scaleY: 1, opacity: 1, duration: 0.8, ease: "power3.out" },
                        0
                    )
                    .to(cardGlow, { opacity: 0.6, scale: 1, duration: 0.5 }, 0.2)

                    // Animate the corresponding timeline node dot
                    .to(nodePulse, { scale: 1, opacity: 1, duration: 0.3 }, 0.1)
                    .to(nodeDot, { borderColor: "#ffd79d", borderWidth: "2px", boxShadow: "0 0 12px rgba(209,171,117,0.7)", duration: 0.3 }, 0.1)
                    .to(nodeCore, { scale: 1.2, duration: 0.3 }, 0.1);

                // If this card has a progress line segment going to the next card, animate it filling up
                if (progressLine) {
                    tl.to(progressLine, { height: "100%", duration: 0.6, ease: "none" }, 0.2);
                }

                // Text content fades in beautifully after unrolling is mostly complete
                tl.fromTo(textContent,
                    { opacity: 0, scale: 0.9, y: 15 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" },
                    0.5
                );
            });

            // Horizontal Carousel on Scroll for Gallery
            // Unified approach: GSAP Pinned Scroll-Jacking across ALL devices
            const gallerySection = document.querySelector(".gallery-section");
            const galleryContainer = document.querySelector(".gallery-carousel");

            if (gallerySection && galleryContainer) {
                const getScrollAmount = () => {
                    const frames = galleryContainer.querySelectorAll(".gallery-frame-container");
                    if (!frames || frames.length === 0) return 0;
                    const lastFrame = frames[frames.length - 1];
                    const centerOfLastSlide = lastFrame.offsetLeft + (lastFrame.offsetWidth / 2);
                    return -(centerOfLastSlide - (window.innerWidth / 2));
                };

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: gallerySection,
                        pin: true,
                        anticipatePin: 1,
                        scrub: 1,
                        end: () => `+=${Math.abs(getScrollAmount())}`,
                        invalidateOnRefresh: true,
                        fastScrollEnd: true
                    }
                });

                tl.to(galleryContainer, {
                    x: getScrollAmount,
                    ease: "none"
                }, 0);

                // Add subtle 3D effects based on scroll
                gsap.utils.toArray(".gallery-frame-container").forEach((frame) => {
                    const innerFrame = frame.querySelector(".gallery-inner-frame");
                    const chain = frame.querySelector(".gallery-chain");
                    const photoImage = frame.querySelector(".gallery-photo-image");

                    gsap.set(frame, { transformPerspective: 900, transformStyle: "preserve-3d" });
                    gsap.set(innerFrame, { transformStyle: "preserve-3d", willChange: "transform, box-shadow" });
                    gsap.set(photoImage, { scale: 1.08, transformOrigin: "center center" });

                    tl.fromTo(photoImage, { scale: 1.08, xPercent: -3 }, { scale: 1, xPercent: 3, ease: "none" }, 0)
                        .fromTo(innerFrame, { xPercent: -2 }, { xPercent: 2, ease: "none" }, 0);

                    if (chain) {
                        tl.fromTo(chain, { opacity: 0.4, skewX: -1 }, { opacity: 0.8, skewX: 1, ease: "none" }, 0);
                    }
                });
            }

            // Things to Know staggered card entrances
            gsap.fromTo(".essentials-card",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".essentials-grid",
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                        markers: showGSAPMarkers,
                        id: "essentials-cards"
                    }
                }
            );

            // RSVP staggered entrances
            gsap.fromTo(".rsvp-anim",
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".rsvp-trigger",
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                        markers: showGSAPMarkers,
                        id: "rsvp-animations"
                    }
                }
            );

            // Awaiting Your Presence staggered entrances
            gsap.fromTo(".awaiting-anim",
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.22,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ".awaiting-trigger",
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                        markers: showGSAPMarkers,
                        id: "awaiting-animations"
                    }
                }
            );
        });

        return () => ctx.revert();
    }, []);


    const scrollToEvents = useCallback(() => {
        gsap.to(window, {
            duration: 1.5,
            scrollTo: eventsRef.current,
            ease: "power3.inOut"
        });
    }, []);



    return (
        <div className={`bg-white ${embedded ? 'w-full h-full' : 'min-h-screen'} flex justify-center`}>
            <div className={`w-full max-w-120 relative bg-[#fcf8f2] min-h-screen font-serif selection:bg-[#7d2432] selection:text-white shadow-2xl ring-1 ring-white/10 ${hasStarted ? "overflow-x-hidden" : "overflow-hidden h-screen"}`}>
                {audioNode}
                <FallingPetals />

                {/* 3D Entrance Overlay */}
                {!hasStarted && (
                    <div className="entrance-overlay absolute inset-0 z-100 flex bg-[#1f0d16] overflow-hidden" style={{ perspective: '1000px' }}>
                        {/* Left Gate */}
                        <div
                            ref={gateLeftRef}
                            className="absolute top-0 left-0 w-1/2 h-full bg-[#7d2432] border-r-4 border-[#d1ab75] shadow-[10px_0_30px_rgba(0,0,0,0.5)] origin-left flex items-center justify-end overflow-hidden"
                            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}
                        ></div>

                        {/* Right Gate */}
                        <div
                            ref={gateRightRef}
                            className="absolute top-0 right-0 w-1/2 h-full bg-[#7d2432] border-l-4 border-[#d1ab75] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] origin-right flex items-center justify-start overflow-hidden"
                            style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}
                        ></div>

                        {/* Center Seal */}
                        <div
                            ref={sealRef}
                            onClick={startExperience}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer flex flex-col items-center group"
                        >
                            <div className="size-24 bg-linear-to-br from-[#ffd79d] to-[#d1ab75] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(209,171,117,0.5)] border-4 border-[#1f0d16] group-hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-2 border border-[#7d2432]/30 border-dashed rounded-full animate-spin-slow" />
                                {/* <Flower2 size={36} className="text-[#7d2432] animate-pulse" /> */}
                                P&S
                            </div>

                            {/* <p className="mt-4 text-[#d1ab75] text-xs uppercase tracking-widest font-bold drop-shadow-md animate-pulse">Tap to Enter</p> */}
                        </div>
                    </div>
                )}

                {/* Fixed Floating Action Buttons */}
                <div className="fixed bottom-6 w-full max-w-120 z-50 flex flex-col gap-4 items-end pr-4 pointer-events-none">

                    <button
                        onClick={toggleAudio}
                        className="pointer-events-auto size-12 bg-[#fdf9ef] border border-[#d1ab75] rounded-full shadow-[0_0_15px_rgba(209,171,117,0.3)] flex items-center justify-center text-[#d1ab75] hover:scale-110 hover:bg-[#d1ab75] hover:text-white transition-all duration-300"
                    >
                        <Image
                            src="/assets/template/01/music-icon.png"
                            alt="Music"
                            width={50}
                            height={50}
                            className={`rounded-full ${isAudioPlaying ? "animate-spin-slow " : ""}`}
                        />
                    </button>
                    <button
                        className="pointer-events-auto size-12 bg-[#fdf9ef] border border-[#d1ab75] rounded-full shadow-[0_0_15px_rgba(209,171,117,0.3)] flex items-center justify-center text-[#d1ab75] hover:scale-110 hover:bg-[#d1ab75] hover:text-white transition-all duration-300"
                    >
                        <Image
                            src="/assets/template/01/nav-icon.png"
                            alt="Navigation"
                            width={50}
                            height={50}
                            className="rounded-full"
                        />
                    </button>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* HERO SECTION */}
                {/* ------------------------------------------------------------- */}
                <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
                    {/* Background Decor */}
                    <div className="absolute inset-0 pointer-events-none opacity-60">
                        <Image src="/assets/template/01/background-hero.webp" alt="Hero Background" fill priority className="object-cover object-center" sizes="(max-width: 480px) 100vw, 480px" />
                    </div>

                    {/* Arch Simulation */}
                    <div className="absolute inset-0 pointer-events-none bg-size-[125%_90%] bg-center bg-no-repeat md:bg-size-[100%_100%]"
                        style={{ backgroundImage: "url('/assets/template/01/bg-temple.webp')" }}>
                    </div>

                    <AnimatedBird top="top-20" delay={0} />
                    <AnimatedBird top="top-32" delay={6} />

                    {/* Content */}
                    <div className="relative z-10 text-center max-w-sm mx-auto mt-40 px-4 pb-12 flex-1 flex flex-col justify-center">
                        <div className="hero-text-anim mb-2">
                            <p className="text-[#c69c6d] text-[10px] tracking-widest uppercase mb-2 font-serif">
                                Om Shree Ganeshay Namah
                            </p>
                            <p className="text-[#5a3a31] italic text-sm leading-relaxed mb-2">
                                With the blessings of the divine<br />
                                and the love of our families
                            </p>
                            <p className="text-[#7d2432] text-[9px] tracking-[0.25em] uppercase mb-2 mt-2">
                                Together we invite you<br />
                                to celebrate
                            </p>

                            <div className="flex items-center justify-center gap-2 mb-2 opacity-50">
                                <div className="h-px w-20 bg-[#c69c6d]"></div>
                                <div className="size-1 rotate-45 bg-[#c69c6d]"></div>
                                <div className="h-px w-20 bg-[#c69c6d]"></div>
                            </div>
                        </div>

                        <h1 className="hero-text-anim text-[#c69c6d] mb-4 font-serif leading-none flex flex-col items-center">
                            <span className="text-3xl md:text-4xl italic font-light tracking-widest">{firstName.toUpperCase()}</span>
                            <span className="text-xl md:text-2xl italic font-light md:my-1 text-[#c69c6d]">WEDS</span>
                            <span className="text-3xl md:text-4xl italic font-light tracking-widest">{secondName.toUpperCase()}</span>
                        </h1>

                        <div className="hero-text-anim flex flex-col items-center mb-0 md:mb-4 md:mt-4">
                            <div className="flex items-center justify-center gap-2 mb-0 md:mb-4 opacity-50 w-full max-w-37.5">
                                <div className="h-px w-full bg-[#c69c6d]"></div>
                                <div className="size-1 rotate-45 bg-[#c69c6d]"></div>
                                <div className="h-px w-full bg-[#c69c6d]"></div>
                            </div>

                            <p className="text-[#5a3a31] italic text-[13px] mb-2 md:mb-3">
                                S/O Smt. Sheema Rathi &amp; Lt. Giriraj Rathi
                            </p>

                            <div className="flex items-center justify-center gap-2 mb-2 md:mb-3 opacity-40">
                                <div className="size-1 rotate-45 bg-[#7d2432]"></div>
                            </div>

                            <p className="text-[#5a3a31] italic text-[13px] px-2 leading-relaxed">
                                D/O Smt. Shweta Chandak &amp; Lt. Sureshji<br />Mundhra, Shri Nawal Kishore Chandak
                            </p>
                        </div>

                        <div className="hero-text-anim mb-8 mt-2">
                            <h2 className="text-2xl text-[#7d2432] mb-1 font-serif tracking-widest">{displayDate}</h2>
                            <p className="text-[#5a3a31] italic text-[13px]">{venue}</p>
                        </div>

                        <button
                            onClick={scrollToEvents}
                            className="hero-text-anim px-8 py-2.5 bg-[#7d2432]/90 border border-[#c69c6d]/40 text-[#fdf9ef] text-[9px] uppercase tracking-[0.3em] font-medium hover:bg-[#7d2432] transition-colors shadow-lg mx-auto"
                        >
                            View Events
                        </button>
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* EVENTS SECTION */}
                {/* ------------------------------------------------------------- */}
                <section ref={eventsRef} className="relative min-h-screen text-[#fdf9ef] py-32 px-4 md:px-12 overflow-hidden">
                    {/* Events Background Image */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <Image src="/assets/template/01/ourevent.png" alt="Events Background" fill priority className="object-cover object-center" sizes="(max-width: 480px) 100vw, 480px" />
                    </div>
                    <TwinklingStars />
                    {/* Hanging Lantern */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                        <div className="flex flex-col items-center origin-top"
                            style={{ animation: 'swing 5s ease-in-out infinite' }}>
                            <div className="w-[1.5px] h-5 md:h-10 bg-linear-to-b from-[#d1ab75] to-[#8a6538]"></div>
                            <Image
                                src="/assets/template/01/lamp.png"
                                alt="Hanging Lamp"
                                width={640}
                                height={640}
                                priority
                                className="w-30 md:w-28 h-auto drop-shadow-[0_15px_25px_rgba(209,171,117,0.3)] -mt-1"
                            />
                        </div>
                    </div>

                    <div className="text-center mb-10 relative z-10 pt-10">
                        <p className="text-[#d1ab75] uppercase tracking-[0.3em] text-xs mb-4">Celebration Journey</p>
                        <h2 className="text-5xl md:text-7xl mb-6 text-[#fdf9ef]">Our Events</h2>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-16 bg-linear-to-r from-transparent to-[#d1ab75]"></div>
                            <div className="size-2 rounded-full bg-[#c69c6d]"></div>
                            <div className="h-px w-16 bg-linear-to-l from-transparent to-[#d1ab75]"></div>
                        </div>
                    </div>

                    {/* Event Scrolls Grid with Timeline */}
                    <div className="relative z-10 max-w-112.5 mx-auto pl-7 pr-2 my-8">
                        <div className="space-y-12">
                            {eventsList.map((event, idx) => (
                                <div key={idx} className="relative w-full event-card-container py-2 group">
                                    {/* Timeline Node Dot */}
                                    <div className="absolute -left-4.75 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center">
                                        {/* Outer glowing pulsing ring */}
                                        <div className="absolute size-7 bg-[#d1ab75]/10 rounded-full scale-0 opacity-0 transition-all duration-500 ease-out timeline-node-pulse shadow-[0_0_12px_rgba(209,171,117,0.3)]"></div>
                                        {/* Inner border ring */}
                                        <div className="size-3 rounded-full bg-[#1f0d16] border border-[#d1ab75]/50 flex items-center justify-center transition-all duration-500 timeline-node-dot">
                                            {/* Core center dot */}
                                            <div className="size-1 bg-[#d1ab75] rounded-full scale-50 transition-transform duration-500 timeline-node-core"></div>
                                        </div>
                                    </div>

                                    {/* Timeline Link Line to next card (does not render for the last card) */}
                                    {idx < eventsList.length - 1 && (
                                        <div className="absolute -left-3.25 top-1/2 w-px bg-linear-to-b from-[#d1ab75]/35 to-[#d1ab75]/10 z-0 pointer-events-none"
                                            style={{ height: 'calc(100% + 48px)' }}>
                                            {/* Animated progress filling line */}
                                            <div className="absolute top-0 left-0 w-full bg-linear-to-b from-[#ffd79d] to-[#d1ab75] shadow-[0_0_8px_rgba(209,171,117,0.6)] timeline-progress-line" style={{ height: '0%' }}></div>
                                        </div>
                                    )}

                                    {/* Subtle radial background glow under the scroll */}
                                    <div className="absolute inset-0 opacity-0 scale-75 transition-all duration-1000 pointer-events-none z-0 card-bg-glow" style={{ backgroundImage: 'radial-gradient(circle, rgba(209,171,117,0.15) 0%, transparent 70%)' }}></div>

                                    {/* Open State (Dictates layout height, but starts visually scaled down) */}
                                    <div className="open-scroll w-full overflow-hidden z-10 origin-top relative"
                                        style={{ paddingBottom: '110.15%' }}>
                                        <Image src="/assets/template/01/scroller.png" alt="Open Scroll"
                                            width={2295}
                                            height={4080}
                                            className="absolute w-full h-auto left-0 top-0 max-w-none"
                                            style={{ transform: 'translateY(-30.61%)' }} />
                                    </div>

                                    {/* Closed State (Absolute overlay at the top) */}
                                    <div className="closed-scroll absolute top-0 left-0 w-full overflow-hidden z-20 pointer-events-none"
                                        style={{ paddingBottom: '28.67%' }}>
                                        <Image src="/assets/template/01/scroller.png" alt="Closed Scroll"
                                            width={2295}
                                            height={4080}
                                            className="absolute w-full h-auto left-0 top-0 max-w-none"
                                            style={{ transform: 'translateY(-8.97%)' }} />
                                    </div>

                                    {/* Text Content (Absolute overlay) */}
                                    <div className="text-content absolute inset-0 flex flex-col items-center justify-center px-8 text-center z-30 pointer-events-none">
                                        <div className="size-8 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3 text-[#d1ab75]">
                                            <Heart size={14} />
                                        </div>
                                        <h3 className="text-2xl mb-1 text-[#7d2432]" style={{ fontFamily: 'cursive' }}>{event.title}</h3>
                                        <p className="text-[9px] uppercase tracking-widest text-[#d1ab75] mb-1 font-sans font-bold">{event.date}</p>
                                        <p className="italic text-[11px] mb-3 text-[#7d2432] opacity-80">{event.venue}</p>
                                        <p className="text-[11px] text-[#7d2432] opacity-70 leading-relaxed mb-3 px-10">{event.desc}</p>

                                        <button className="text-[9px] uppercase tracking-widest text-[#7d2432] font-bold flex items-center justify-center gap-1.5 mx-auto hover:text-[#d1ab75] transition-colors pointer-events-auto mt-1">
                                            <MapPin size={12} /> Open in Maps
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* LOVE STORY / COUPLE SECTION */}
                {/* ------------------------------------------------------------- */}
                <section className="relative min-h-[80vh] flex flex-col items-center justify-center py-32 overflow-hidden border-t-2 border-[#d1ab75]">
                    {/* Palace/Lake Background */}
                    <div className="absolute inset-0 z-0">
                        <video
                            src="/assets/template/01/invitationvideo-01bg.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-90 filter saturate-50 sepia-[0.3]"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-[#fcf8f2] via-[#fcf8f2]/70 to-[#fcf8f2]/40"></div>
                    </div>

                    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                        <p className="text-[#d1ab75] uppercase tracking-[0.3em] text-xs mb-4 font-sans font-bold">A Love Story</p>
                        <h2 className="text-5xl md:text-7xl mb-12 text-[#7d2432]">Meet the Couple</h2>

                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="h-px w-20 bg-linear-to-r from-transparent to-[#d1ab75]"></div>
                            <div className="size-2 rounded-full bg-[#d1ab75]"></div>
                            <div className="h-px w-20 bg-linear-to-l from-transparent to-[#d1ab75]"></div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            {[
                                "Family Blessed", "Traditional Hearts", "Foodie Lovers",
                                "Biryani Believers", "Proud Late-Risers", "Sleep-in Sweethearts",
                                "Perfectly Mismatched"
                            ].map((tag, i) => (
                                <span
                                    key={i}
                                    className="px-6 py-2 border border-[#d1ab75]/40 bg-[#fdf9ef]/80 backdrop-blur-sm text-[#7d2432] text-xs uppercase tracking-widest hover:bg-[#d1ab75] hover:text-white transition-all duration-300 cursor-default shadow-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* GALLERY WALL SECTION */}
                {/* ------------------------------------------------------------- */}
                <section className="gallery-section relative h-screen w-full overflow-hidden border-t-2 border-[#d1ab75] bg-[#10070c] flex flex-col justify-center">
                    {/* Spotlight glow effect */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,215,160,0.16)_0%,rgba(255,215,160,0.05)_34%,transparent_66%)] pointer-events-none z-0"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,247,225,0.04)_0%,transparent_18%,rgba(0,0,0,0.18)_100%)] pointer-events-none z-0"></div>

                    {/* Classic panel lines (Wainscoting partition) */}
                    <div className="absolute inset-0 flex justify-around px-6 py-20 pointer-events-none z-0 opacity-10">
                        <div className="w-[30%] h-full border border-[#d1ab75]/35 shadow-inner rounded-lg"></div>
                        <div className="w-[30%] h-full border border-[#d1ab75]/35 shadow-inner rounded-lg"></div>
                        <div className="w-[30%] h-full border border-[#d1ab75]/35 shadow-inner rounded-lg"></div>
                    </div>

                    <div className="relative z-10 text-center mb-4 md:mb-8 px-4 shrink-0 mt-8">
                        <p className="text-[#d1ab75] uppercase tracking-[0.28em] text-[10px] mb-3 font-sans font-bold">Moments of Love</p>
                        <h2 className="text-4xl mb-5 text-[#fdf9ef] leading-tight">Gallery Wall</h2>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-14 bg-linear-to-r from-transparent to-[#d1ab75]"></div>
                            <Flower2 className="text-[#d1ab75]" size={15} />
                            <div className="h-px w-14 bg-linear-to-l from-transparent to-[#d1ab75]"></div>
                        </div>
                    </div>

                    {/* Horizontal Scroll Carousel Wrapper */}
                    <div className="relative z-10 w-full overflow-hidden flex-1 flex items-center">
                        <div className="gallery-carousel relative flex flex-nowrap items-center w-max gap-8 md:gap-20 px-[12.5vw] md:pl-[calc(50vw-160px)] md:pr-0 h-full will-change-transform">
                            {galleryPhotosList.map((photo) => {
                                // Horizontal staggered alignment mappings
                                const alignClass =
                                    photo.align === "start" ? "-mt-12 md:-mt-32" :
                                        photo.align === "end" ? "mt-12 md:mt-32" : "mt-0";

                                return (
                                    <div
                                        key={photo.id}
                                        className={`relative flex flex-col w-[75vw] md:w-[320px] shrink-0 ${alignClass} gallery-frame-container cursor-pointer`}
                                        onClick={() => setSelectedPhoto(photo)}
                                    >
                                        {/* Hanging chain/wire area absolute above the frame */}
                                        <div
                                            className="absolute bottom-full left-0 w-full overflow-visible pointer-events-none"
                                            style={{ height: photo.hangHeight === "h-16" ? "64px" : photo.hangHeight === "h-20" ? "80px" : "96px" }}
                                        >
                                            {/* Hook/Nail */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full bg-linear-to-br from-[#fff2c8] via-[#d1ab75] to-[#7c5428] border border-[#ffd79d]/40 shadow-[0_2px_6px_rgba(0,0,0,0.55)] z-20"></div>

                                            {/* Golden Wire Path */}
                                            {photo.hangType === "triangle" ? (
                                                <svg className="absolute top-0 left-0 size-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                                    <path d="M 50 0 L 5 100 M 50 0 L 95 100" className="gallery-chain stroke-[#d1ab75]/45 stroke-[1.2] fill-none" />
                                                </svg>
                                            ) : (
                                                <svg className="absolute top-0 left-0 size-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                                                    <line x1="15" y1="0" x2="15" y2="100" className="gallery-chain stroke-[#d1ab75]/45 stroke-[1.2] [stroke-dasharray:3,3]" />
                                                    <line x1="85" y1="0" x2="85" y2="100" className="gallery-chain stroke-[#d1ab75]/45 stroke-[1.2] [stroke-dasharray:3,3]" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* 3D Rotated Frame Inner container */}
                                        <div
                                            className="gallery-inner-frame w-full bg-[#fff9ed] border-4 border-[#d1ab75] shadow-[0_18px_38px_rgba(0,0,0,0.48),0_0_0_1px_rgba(255,215,157,0.18)] p-2.5 flex flex-col relative transition-shadow duration-500 hover:shadow-[0_22px_44px_rgba(0,0,0,0.55),0_0_24px_rgba(209,171,117,0.22)] z-10"
                                            style={{ transform: `rotate(${photo.rotate})` }}
                                        >
                                            {/* Passe-partout Inner Canvas shadow */}
                                            <div
                                                className={`relative w-full ${photo.aspect} overflow-hidden border border-[#d1ab75]/30 bg-[#e0d6c3]/10 shadow-inner`}
                                                style={{ aspectRatio: photo.aspect === "aspect-3/4" ? "3/4" : photo.aspect === "aspect-4/3" ? "4/3" : photo.aspect === "aspect-square" ? "1/1" : "16/10" }}
                                            >
                                                <Image
                                                    src={photo.src}
                                                    alt={photo.caption}
                                                    fill
                                                    sizes="(max-width: 480px) 80vw, 384px"
                                                    className="gallery-photo-image object-cover"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/20 pointer-events-none"></div>
                                            </div>

                                            {/* Vintage Brass Title Plate */}
                                            <div className="mt-3 px-3 py-1 bg-linear-to-r from-[#8a6538] via-[#ffd79d] to-[#8a6538] border border-[#d1ab75]/80 text-[#1f0d16] text-[8px] uppercase tracking-widest font-serif font-bold shadow-sm rounded-xs mx-auto text-center min-w-22.5">
                                                {photo.caption}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* THINGS TO KNOW (GUEST ESSENTIALS) SECTION */}
                {/* ------------------------------------------------------------- */}
                <section className="relative py-28 px-4 overflow-hidden border-t-8 border-[#d1ab75] bg-[#611b25]">
                    {/* Spotlight glow effect */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,215,160,0.15)_0%,transparent_60%)] pointer-events-none z-0"></div>

                    {/* Pichwai Cow Watermark Silhouette */}
                    <svg className="absolute -top-4 -right-4 size-40 pointer-events-none opacity-[0.06] text-[#ffd79d]" viewBox="0 0 120 120" fill="currentColor">
                        <path d="M95 65c0 7.2-5 20-10 20s-3-4-3-7c0-5-2-13-5-13s-3 3-3 7c0 8-3 13-6 13s-4-7-4-15c0-7-4-15-9-15s-7 5-7 13c0 10-3 17-6 17s-4-5-4-13c0-6-2-12-5-12s-3 3-3 8c0 10-3 17-6 17s-4-7-4-15c0-20 5-30 15-35 5-3 10-3 15 0 3 3 6 5 10 5s7-2 10-5c5-3 10-3 15 0 10 5 15 15 15 35M60 40c0-5 2-15 5-20 2-2 5-2 7 0 2 2 3 5 3 10M45 35c0-5-2-13-5-17-2-2-5-2-7 0-2 2-3 6-3 12" />
                    </svg>

                    {/* Criss-Cross Luxury Grid Pattern overlay */}
                    <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{
                        backgroundImage: `
                            linear-gradient(135deg, rgba(209, 171, 117, 0.15) 25%, transparent 25%),
                            linear-gradient(225deg, rgba(209, 171, 117, 0.15) 25%, transparent 25%),
                            linear-gradient(45deg, rgba(209, 171, 117, 0.15) 25%, transparent 25%),
                            linear-gradient(315deg, rgba(209, 171, 117, 0.15) 25%, transparent 25%)
                        `,
                        backgroundSize: '40px 40px',
                        backgroundPosition: '-20px 0, -20px 0, 0 0, 0 0'
                    }}></div>

                    <div className="relative z-10 text-center mb-16 px-4">
                        <p className="text-[#ffd79d] uppercase tracking-[0.3em] text-[10px] mb-3 font-sans font-bold">Guest Essentials</p>
                        <h2 className="text-4xl md:text-5xl mb-6 text-[#fdf9ef] font-serif italic tracking-wide" style={{ fontFamily: 'cursive' }}>Things to Know</h2>

                        {/* Decorative divider */}
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="h-px w-12 bg-linear-to-r from-transparent to-[#ffd79d]"></div>
                            <div className="size-1.5 rotate-45 bg-[#ffd79d]"></div>
                            <div className="h-px w-12 bg-linear-to-l from-transparent to-[#ffd79d]"></div>
                        </div>

                        <p className="text-[#ffd79d]/80 italic text-xs leading-relaxed max-w-xs mx-auto">A few thoughtful details to help you celebrate in ease.</p>
                    </div>

                    {/* Grid Cards Container */}
                    <div className="relative z-10 max-w-112.5 mx-auto px-2">
                        <div className="grid grid-cols-2 gap-4 essentials-grid">

                            {/* Card 1: Dress Code */}
                            <div className="essentials-card bg-[#fdf9ef] border border-[#d1ab75]/30 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                {/* Corner Bracket Accent Lines */}
                                <div className="absolute top-2.5 left-2.5 size-3 border-t border-l border-[#d1ab75]/60 rounded-tl-xs"></div>
                                <div className="absolute bottom-2.5 right-2.5 size-3 border-b border-r border-[#d1ab75]/60 rounded-br-xs"></div>

                                {/* Icon container */}
                                <div className="size-16 rounded-full border border-[#d1ab75]/40 flex items-center justify-center mb-4 bg-linear-to-br from-[#fdf9ef] to-[#ebdcb9] shadow-inner relative">
                                    <div className="absolute inset-1 rounded-full bg-[#7d2432]/5"></div>
                                    <Shirt size={26} className="text-[#7d2432] relative z-10" />
                                </div>
                                <h3 className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#7d2432] mb-2">Dress Code</h3>
                                <p className="text-[10px] text-[#5a3a31] leading-relaxed italic">Vibrant, colourful and festive that can add more sparkle to our celebration.</p>
                            </div>

                            {/* Card 2: Venue */}
                            <a
                                href="https://maps.google.com/?q=SNJ+Laxmi+Dham+Vrindavan"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="essentials-card bg-[#fdf9ef] border border-[#d1ab75]/30 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
                            >
                                <div className="absolute top-2.5 left-2.5 size-3 border-t border-l border-[#d1ab75]/60 rounded-tl-xs"></div>
                                <div className="absolute bottom-2.5 right-2.5 size-3 border-b border-r border-[#d1ab75]/60 rounded-br-xs"></div>

                                <div className="size-16 rounded-full border border-[#d1ab75]/40 flex items-center justify-center mb-4 bg-linear-to-br from-[#fdf9ef] to-[#ebdcb9] shadow-inner relative">
                                    <div className="absolute inset-1 rounded-full bg-[#7d2432]/5"></div>
                                    <MapPin size={26} className="text-[#7d2432] relative z-10" />
                                </div>
                                <h3 className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#7d2432] mb-2">Venue</h3>
                                <p className="text-[10px] text-[#5a3a31] leading-relaxed italic mb-2">SNJ Laxmi Dham, Vrindavan. Address &amp; Maps links are shared.</p>
                                <span className="text-[9px] uppercase tracking-wider text-[#7d2432] font-bold flex items-center gap-1 mt-auto hover:text-[#d1ab75] transition-colors">
                                    Open in Maps <ExternalLink size={10} />
                                </span>
                            </a>

                            {/* Card 3: Stay Options */}
                            <div className="essentials-card bg-[#fdf9ef] border border-[#d1ab75]/30 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                <div className="absolute top-2.5 left-2.5 size-3 border-t border-l border-[#d1ab75]/60 rounded-tl-xs"></div>
                                <div className="absolute bottom-2.5 right-2.5 size-3 border-b border-r border-[#d1ab75]/60 rounded-br-xs"></div>

                                <div className="size-16 rounded-full border border-[#d1ab75]/40 flex items-center justify-center mb-4 bg-linear-to-br from-[#fdf9ef] to-[#ebdcb9] shadow-inner relative">
                                    <div className="absolute inset-1 rounded-full bg-[#7d2432]/5"></div>
                                    <Building2 size={26} className="text-[#7d2432] relative z-10" />
                                </div>
                                <h3 className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#7d2432] mb-2">Stay Options</h3>
                                <p className="text-[10px] text-[#5a3a31] leading-relaxed italic">Rooms are booked in the venue and in Hotel Phoenix Grand.</p>
                            </div>

                            {/* Card 4: Wedding Hashtag */}
                            <div
                                onClick={handleCopyHashtag}
                                className="essentials-card bg-[#fdf9ef] border border-[#d1ab75]/30 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                            >
                                <div className="absolute top-2.5 left-2.5 size-3 border-t border-l border-[#d1ab75]/60 rounded-tl-xs"></div>
                                <div className="absolute bottom-2.5 right-2.5 size-3 border-b border-r border-[#d1ab75]/60 rounded-br-xs"></div>

                                <div className="size-16 rounded-full border border-[#d1ab75]/40 flex items-center justify-center mb-4 bg-linear-to-br from-[#fdf9ef] to-[#ebdcb9] shadow-inner relative">
                                    <div className="absolute inset-1 rounded-full bg-[#7d2432]/5"></div>
                                    {copiedHashtag ? (
                                        <Check size={26} className="text-green-700 animate-bounce relative z-10" />
                                    ) : (
                                        <Hash size={26} className="text-[#7d2432] relative z-10" />
                                    )}
                                </div>
                                <h3 className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#7d2432] mb-2">Wedding Hashtag</h3>
                                <p className="text-[10px] text-[#5a3a31] leading-relaxed italic mb-2">{hashtag} — tap to copy and tag all your lovely photos!</p>
                                <span className="text-[9px] uppercase tracking-wider text-[#7d2432] font-bold mt-auto">
                                    {copiedHashtag ? "Copied!" : "Tap to Copy"}
                                </span>
                            </div>

                            {/* Card 5: Gift Registry */}
                            <div className="essentials-card bg-[#fdf9ef] border border-[#d1ab75]/30 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                <div className="absolute top-2.5 left-2.5 size-3 border-t border-l border-[#d1ab75]/60 rounded-tl-xs"></div>
                                <div className="absolute bottom-2.5 right-2.5 size-3 border-b border-r border-[#d1ab75]/60 rounded-br-xs"></div>

                                <div className="size-16 rounded-full border border-[#d1ab75]/40 flex items-center justify-center mb-4 bg-linear-to-br from-[#fdf9ef] to-[#ebdcb9] shadow-inner relative">
                                    <div className="absolute inset-1 rounded-full bg-[#7d2432]/5"></div>
                                    <Gift size={26} className="text-[#7d2432] relative z-10" />
                                </div>
                                <h3 className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#7d2432] mb-2">Gift Registry</h3>
                                <p className="text-[10px] text-[#5a3a31] leading-relaxed italic mb-2">Your presence is the greatest gift.</p>
                                <span className="text-[9px] uppercase tracking-wider text-[#7d2432] font-bold flex items-center gap-1 mt-auto hover:text-[#d1ab75] transition-colors">
                                    View Registry <ExternalLink size={10} />
                                </span>
                            </div>

                            {/* Card 6: Food */}
                            <div className="essentials-card bg-[#fdf9ef] border border-[#d1ab75]/30 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                                <div className="absolute top-2.5 left-2.5 size-3 border-t border-l border-[#d1ab75]/60 rounded-tl-xs"></div>
                                <div className="absolute bottom-2.5 right-2.5 size-3 border-b border-r border-[#d1ab75]/60 rounded-br-xs"></div>

                                <div className="size-16 rounded-full border border-[#d1ab75]/40 flex items-center justify-center mb-4 bg-linear-to-br from-[#fdf9ef] to-[#ebdcb9] shadow-inner relative">
                                    <div className="absolute inset-1 rounded-full bg-[#7d2432]/5"></div>
                                    <Utensils size={26} className="text-[#7d2432] relative z-10" />
                                </div>
                                <h3 className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#7d2432] mb-2">Food</h3>
                                <p className="text-[10px] text-[#5a3a31] leading-relaxed italic">Vegetarian cuisine on wedding day. Non-veg will be served on sangeet night.</p>
                            </div>

                            {/* Card 7: Photography - Spans both columns to center beautifully */}
                            <div className="essentials-card col-span-2 bg-[#fdf9ef] border border-[#d1ab75]/30 rounded-xl p-4 flex flex-col items-center text-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] relative overflow-hidden group hover:scale-[1.01] transition-transform duration-300">
                                <div className="absolute top-2.5 left-2.5 size-3 border-t border-l border-[#d1ab75]/60 rounded-tl-xs"></div>
                                <div className="absolute bottom-2.5 right-2.5 size-3 border-b border-r border-[#d1ab75]/60 rounded-br-xs"></div>

                                <div className="size-16 rounded-full border border-[#d1ab75]/40 flex items-center justify-center mb-4 bg-linear-to-br from-[#fdf9ef] to-[#ebdcb9] shadow-inner relative">
                                    <div className="absolute inset-1 rounded-full bg-[#7d2432]/5"></div>
                                    <Camera size={26} className="text-[#7d2432] relative z-10" />
                                </div>
                                <h3 className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#7d2432] mb-2">Photography</h3>
                                <p className="text-[10px] text-[#5a3a31] leading-relaxed italic max-w-sm">Professional photographers are capturing every moment. Please avoid flash photography during the ceremony so everyone can enjoy the sacred rituals.</p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* RSVP / JOIN THE CELEBRATION SECTION */}
                {/* ------------------------------------------------------------- */}
                <section className="relative py-28 px-4 overflow-hidden border-t-8 border-[#d1ab75] bg-[#0a1120] rsvp-trigger">
                    {/* Background Palace Night Image */}
                    <div className="absolute inset-0 z-0 select-none pointer-events-none">
                        <Image
                            src="/assets/template/01/rsvp-bg.png"
                            alt="Palace at Night"
                            fill
                            sizes="480px"
                            className="object-cover opacity-100"
                        />
                        {/* Night gradient overlay */}
                        <div className="absolute inset-0 bg-linear-to-b from-[#080d19]/10 via-[#0a1120]/80 to-[#050810]"></div>
                    </div>

                    {/* Crescent Moon */}
                    <svg className="absolute top-12 left-10 size-10 text-[#ffd79d]/30 pointer-events-none opacity-40 select-none animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.75 16.25A9 9 0 0 1 12 3a9 9 0 0 0 0 18 9 9 0 0 0 9.75-4.75z" />
                    </svg>

                    {/* Glowing Stars / Fireworks overlay */}
                    <div className="absolute top-16 right-12 size-20 pointer-events-none opacity-20 select-none">
                        <svg className="size-full text-[#ffd79d]" viewBox="0 0 100 100" fill="currentColor">
                            <path d="M50 20 L52 35 L67 37 L52 39 L50 54 L48 39 L33 37 L48 35 Z" className="animate-pulse" />
                            <circle cx="30" cy="20" r="1" />
                            <circle cx="70" cy="50" r="1.5" />
                            <circle cx="20" cy="60" r="1" />
                            <circle cx="80" cy="15" r="1" />
                        </svg>
                    </div>

                    <div className="relative z-10 text-center max-w-sm mx-auto px-4">
                        <p className="rsvp-anim text-[#ffd79d] uppercase tracking-[0.3em] text-[10px] mb-3 font-sans font-bold">Join the Celebration</p>
                        <h2 className="rsvp-anim text-4xl md:text-5xl mb-6 text-[#fdf9ef] font-serif italic tracking-wide" style={{ fontFamily: 'cursive' }}>Will you join us?</h2>

                        <p className="rsvp-anim text-[#ffd79d]/80 italic text-[12px] leading-relaxed mb-10 px-2">
                            We&apos;ve saved a seat for you — at our table and in our hearts. Come celebrate with them as they begin this new chapter together.
                        </p>

                        {/* Primary RSVP Button */}
                        <div className="rsvp-anim mb-4 flex flex-col items-center">
                            <button
                                onClick={handleWhatsAppRSVP}
                                className="w-full max-w-70 py-4 bg-linear-to-r from-[#611b25] to-[#7d2432] border border-[#ffd79d]/50 text-[#fdf9ef] text-[11px] font-sans font-bold uppercase tracking-[0.25em] shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 rounded-md"
                            >
                                YES, I&apos;LL BE THERE
                            </button>
                            <p className="mt-3 text-[10px] text-[#ffd79d]/60 italic">
                                You&apos;ll be redirected to WhatsApp to confirm your attendance.
                            </p>
                        </div>

                        {/* Decorative Space Divider */}
                        <div className="rsvp-anim my-10 flex items-center justify-center gap-3">
                            <div className="h-px w-8 bg-linear-to-r from-transparent to-[#ffd79d]/40"></div>
                            <span className="text-[9px] uppercase tracking-[0.2em] text-[#ffd79d] font-semibold">SAVE THE DATE</span>
                            <div className="h-px w-8 bg-linear-to-l from-transparent to-[#ffd79d]/40"></div>
                        </div>

                        {/* Secondary Calendar Sync Buttons */}
                        <div className="rsvp-anim flex gap-3 justify-center w-full">
                            <a
                                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(coupleNames + "'s Wedding 💍")}&dates=${encodeURIComponent((formData?.eventDate ? new Date(formData.eventDate).toISOString().replace(/[-:]/g, "").split(".")[0] : '20260703T123000') + 'Z/' + (formData?.eventDate ? new Date(formData.eventDate).toISOString().replace(/[-:]/g, "").split(".")[0] : '20260703T203000') + 'Z')}&details=${encodeURIComponent("Celebrate the wedding ceremony of " + coupleNames + " at " + venue + ". Details and venue map links are inside your digital invite.")}&location=${encodeURIComponent(venue)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 border border-[#ffd79d]/40 text-[#ffd79d] hover:bg-[#ffd79d] hover:text-[#0a1120] active:scale-[0.97] transition-all duration-300 rounded-full px-4 py-2 text-[9px] uppercase tracking-wider font-semibold flex-1 max-w-42.5"
                            >
                                <Calendar size={12} /> Google Calendar
                            </a>
                            <button
                                onClick={handleAppleCalendar}
                                className="flex items-center justify-center gap-1.5 border border-[#ffd79d]/40 text-[#ffd79d] hover:bg-[#ffd79d] hover:text-[#0a1120] active:scale-[0.97] transition-all duration-300 rounded-full px-4 py-2 text-[9px] uppercase tracking-wider font-semibold flex-1 max-w-42.5 cursor-pointer"
                            >
                                <Calendar size={12} /> Apple Calendar
                            </button>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------- */}
                {/* FULL FORM DETAILS SECTION */}
                {/* ------------------------------------------------------------- */}
                <section className="border-t border-[#d1ab75]/50 bg-[radial-gradient(circle_at_top,rgba(255,250,243,0.96),rgba(253,249,239,1)_42%,rgba(246,236,220,0.96))] px-4 py-16 text-[#3c261f]">
                    <div className="mx-auto flex max-w-5xl flex-col gap-8">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-3 rounded-full border border-[#d1ab75]/40 bg-white/80 px-4 py-2 shadow-[0_10px_24px_rgba(125,36,50,0.06)]">
                                <span className="size-2 rounded-full bg-[#7d2432]"></span>
                                <p className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-[#7d2432]">All form details</p>
                            </div>
                            <h3 className="mx-auto mt-5 max-w-full text-2xl font-serif text-[#3c261f] leading-tight sm:text-3xl md:text-4xl whitespace-nowrap truncate">
                                Everything you added in the form
                            </h3>
                            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#5a3a31] sm:text-[15px]">
                                This section mirrors the remaining form data so the template shows the full invitation content.
                            </p>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-2 xl:gap-6">
                            <DetailCard title="Basics" icon="✦">
                                <DetailItem label="Countdown" value={formData?.countdown ? "Enabled" : "Disabled"} />
                                <DetailItem label="Invitation" value={formData?.invitation ? "Enabled" : "Disabled"} />
                                <DetailItem label="Wedding date" value={displayDate} />
                                <DetailItem label="Venue" value={venue} />
                                <DetailItem label="WhatsApp" value={formData?.whatsapp || whatsappNumber} />
                                <DetailItem label="Hashtag" value={formData?.hashtag || "Not set"} />
                                <DetailItem label="Custom hashtag" value={customHashtagText || "Not set"} />
                            </DetailCard>

                            <DetailCard title="Family" icon="❦">
                                <DetailItem label="Display order" value={formData?.nameOrder === "groomFirst" ? "Groom first" : "Bride first"} />
                                <DetailItem label="Parents order" value={formData?.parentsOrder || "Not set"} />
                                <DetailItem label="Couple names" value={coupleNames} />
                                {familyLines.map((line) => (
                                    <DetailItem key={line} value={line} />
                                ))}
                                {grandparentLines.map((line) => (
                                    <DetailItem key={line} value={line} />
                                ))}
                                {!familyLines.length && !grandparentLines.length ? <DetailItem value="No family names added yet" /> : null}
                            </DetailCard>

                            <DetailCard title="Events" icon="⟡">
                                <DetailItem label="Selected events" value={selectedEventDetails.length ? selectedEventDetails.join(", ") : "None selected"} />
                                <DetailItem label="Event date" value={formData?.eventDate ? formatDate(formData.eventDate) : "Not set"} />
                                <DetailItem label="Event time" value={formData?.eventTime || "Not set"} />
                                <DetailItem label="Event venue" value={formData?.eventVenue || "Not set"} />
                                <DetailItem label="Event notes" value={formData?.eventNotes || "Not set"} />
                                {selectedEventDetails.map((eventName) => {
                                    const detail = formData?.eventDetails?.[eventName] || {};
                                    return (
                                        <div key={eventName} className="mt-3 border-t border-[#d1ab75]/30 pt-3">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7d2432]">{eventName}</p>
                                            <p className="mt-1 text-sm text-[#5a3a31]">{detail.functionName || eventName}</p>
                                            <p className="text-sm text-[#5a3a31]">{detail.date ? formatDate(detail.date) : "Date not set"}{detail.time ? ` • ${detail.time}` : ""}</p>
                                            <p className="text-sm text-[#5a3a31]">{detail.venue || "Venue not set"}</p>
                                            <p className="text-sm text-[#5a3a31]">{detail.oneLiner || "No description added"}</p>
                                            <p className="text-sm text-[#5a3a31]">{detail.mapsLink || "No maps link"}</p>
                                        </div>
                                    );
                                })}
                            </DetailCard>

                            <DetailCard title="Story & Tags" icon="❧">
                                <DetailItem label="Story enabled" value={formData?.storyEnabled ? "Enabled" : "Disabled"} />
                                <DetailItem label="Story title" value={formData?.storyTitle || "Not set"} />
                                <DetailItem label="Story" value={storyText || "Not added yet"} />
                                <DetailItem label="Personality answers" value={personalityAnswers.length ? personalityAnswers.join(" • ") : "None selected"} />
                                <DetailItem label="Generated tags" value={formData?.generatedTags || "Not generated"} />
                                <DetailItem label="Extra tags" value={extraTagsText || "Not set"} />
                            </DetailCard>

                            <DetailCard title="Gallery" icon="◌">
                                <DetailItem label="Gallery enabled" value={formData?.galleryEnabled ? "Enabled" : "Disabled"} />
                                <DetailItem label="Layout" value={formData?.galleryLayout ? `${formData.galleryLayout} photos` : "Not set"} />
                                <DetailItem label="Uploaded photos" value={`${galleryImagesCount} selected`} />
                                <DetailItem label="Cover image" value={formData?.coverImage || "Not set"} />
                                <DetailItem label="Gallery note" value={formData?.galleryNote || "Not added yet"} />
                            </DetailCard>

                            <DetailCard title="Things to Know" icon="✤">
                                <DetailItem label="Info section" value={formData?.infoEnabled ? "Enabled" : "Disabled"} />
                                <DetailItem label="Dress code" value={formData?.dressCode || "Not set"} />
                                <DetailItem label="Parking" value={formData?.parking || "Not set"} />
                                <DetailItem label="Maps link" value={formData?.mapsLink || "Not set"} />
                                {infoCardEntries.map(([label, value]) => (
                                    <DetailItem key={label} label={label} value={value} />
                                ))}
                                {!infoCardEntries.length ? <DetailItem value="No info cards filled" /> : null}
                            </DetailCard>

                            <DetailCard title="RSVP" icon="☾">
                                <DetailItem label="RSVP enabled" value={formData?.rsvpEnabled ? "Enabled" : "Disabled"} />
                                <DetailItem label="RSVP deadline" value={formData?.rsvpDeadline ? formatDate(formData.rsvpDeadline) : "Not set"} />
                                <DetailItem label="Meal preference" value={formData?.mealPreference ? "Asked" : "Not asked"} />
                                <DetailItem label="Guest questions" value={guestQuestionsText || "No extra questions"} />
                            </DetailCard>

                            <DetailCard title="Music" icon="♪">
                                <DetailItem label="Music enabled" value={formData?.musicEnabled ? "Enabled" : "Disabled"} />
                                <DetailItem label="Song title" value={formData?.songTitle || "Not set"} />
                                <DetailItem label="Music link" value={musicLinkText || "Not set"} />
                                <DetailItem label="Autoplay" value={formData?.autoplayMusic ? "Enabled" : "Disabled"} />
                            </DetailCard>
                        </div>
                    </div>
                </section>

                {/* -------------------------------------------------------- */}
                {/* AWAITING YOUR PRESENCE SECTION */}
                {/* -------------------------------------------------------- */}
                <section className="relative overflow-hidden bg-[#060b14] awaiting-trigger" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    {/* Background Palace Night Image */}
                    <div className="absolute inset-0 z-0 select-none pointer-events-none">
                        <Image
                            src="https://images.unsplash.com/photo-1585250009581-20904d9e7d95?auto=format&fit=crop&q=80&w=2000"
                            alt="Palace at Night"
                            fill
                            sizes="480px"
                            className="object-cover"
                            style={{ opacity: 0.18, filter: 'brightness(0.3) saturate(0.4) contrast(1.3) sepia(0.15)' }}
                        />
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #06090f 0%, rgba(6,11,20,0.6) 40%, rgba(6,11,20,0.6) 60%, #06090f 100%)' }}></div>
                    </div>

                    {/* Corner Bracket Ornaments — Top Left */}
                    <div className="absolute top-8 left-6 z-10 pointer-events-none select-none">
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                            <path d="M44 2H2V44" stroke="#d1ab75" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
                        </svg>
                    </div>
                    {/* Corner Bracket — Top Right */}
                    <div className="absolute top-8 right-6 z-10 pointer-events-none select-none">
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                            <path d="M0 2H42V44" stroke="#d1ab75" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
                        </svg>
                    </div>
                    {/* Corner Bracket — Bottom Left */}
                    <div className="absolute bottom-8 left-6 z-10 pointer-events-none select-none">
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                            <path d="M44 42H2V0" stroke="#d1ab75" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
                        </svg>
                    </div>
                    {/* Corner Bracket — Bottom Right */}
                    <div className="absolute bottom-8 right-6 z-10 pointer-events-none select-none">
                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                            <path d="M0 42H42V0" stroke="#d1ab75" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
                        </svg>
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 text-center px-8 py-20 max-w-sm mx-auto flex flex-col items-center">

                        {/* Decorative top ornament line */}
                        <div className="awaiting-anim flex items-center justify-center gap-2 mb-8 opacity-60">
                            <div style={{ width: '24px', height: '1px', background: 'linear-gradient(to right, transparent, #d1ab75)' }}></div>
                            <svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill="#d1ab75" opacity="0.7" /></svg>
                            <div style={{ width: '24px', height: '1px', background: 'linear-gradient(to left, transparent, #d1ab75)' }}></div>
                        </div>

                        {/* Label */}
                        <p className="awaiting-anim text-[#ffd79d] uppercase tracking-[0.35em] text-[9px] font-sans font-bold mb-6">
                            Awaiting Your Presence
                        </p>

                        {/* Family Names — large cursive */}
                        <h2
                            className="awaiting-anim text-[#fdf9ef] leading-snug mb-8"
                            style={{ fontFamily: "var(--font-dancing-script), cursive, serif", fontSize: 'clamp(2rem, 9vw, 2.6rem)', fontWeight: 700, lineHeight: 1.3 }}
                        >
                            SS Ghosh, Sunita Ghosh,<br />
                            Sudhashree Ghosh &amp;<br />
                            Apurva
                        </h2>

                        {/* Gold Star Divider */}
                        <div className="awaiting-anim flex items-center justify-center mb-6">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#d1ab75" opacity="0.85">
                                <path d="M12 2l2.09 6.26H21l-5.47 3.97 2.09 6.26L12 14.52l-5.62 3.97 2.09-6.26L3 8.26h6.91z" />
                            </svg>
                        </div>

                        {/* Subtext */}
                        <p
                            className="awaiting-anim text-[#fdf9ef]/70 mb-8 px-2"
                            style={{ fontFamily: "var(--font-dancing-script), cursive, serif", fontSize: '1rem', fontStyle: 'italic' }}
                        >
                            You make this moment complete.
                        </p>

                        {/* Date */}
                        <p className="awaiting-anim text-[#ffd79d]/60 uppercase tracking-[0.3em] text-[9px] font-sans font-semibold">
                            27 · June · 2026
                        </p>

                    </div>
                </section>

                <style jsx global>{`
                    .animate-spin-slow {
                        animation: spin 8s linear infinite;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes bird-fly-across {
                        0% { transform: translate(300px, 0px); opacity: 0; }
                        10% { opacity: 1; transform: translate(240px, -15px); }
                        25% { opacity: 1; transform: translate(150px, 5px); }
                        50% { opacity: 1; transform: translate(0px, 20px); }
                        75% { opacity: 1; transform: translate(-150px, -5px); }
                        90% { opacity: 1; transform: translate(-240px, 15px); }
                        100% { transform: translate(-300px, 0px); opacity: 0; }
                    }
                    @keyframes flap {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-100%); }
                    }
                    @keyframes swing {
                        0% { transform: rotate(10deg); }
                        50% { transform: rotate(-10deg); }
                        100% { transform: rotate(10deg); }
                    }
                    @keyframes twinkle {
                        0%, 100% { opacity: 0.1; transform: scale(0.5); }
                        50% { opacity: 1; transform: scale(1.2); }
                    }
                    @keyframes lightbox-in {
                        from {
                            opacity: 0;
                            transform: scale(0.7) rotateX(-20deg) translateY(50px);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1) rotateX(0deg) translateY(0);
                        }
                    }
                    .animate-lightbox-in {
                        animation: lightbox-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    }
                `}</style>

                {/* 3D Lightbox Zoom Modal */}
                {selectedPhoto && (
                    <div
                        className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-500 ease-out"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        {/* Medallion Close Button */}
                        <button
                            className="absolute top-6 right-6 size-12 rounded-full border border-[#d1ab75]/60 bg-[#12050b] text-[#ffd79d] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform z-50 cursor-pointer"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Lightbox Frame */}
                        <div
                            className="relative w-full max-w-100 flex flex-col items-center animate-lightbox-in pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-full bg-[#fdf9ef] border-8 border-[#d1ab75] shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-4 flex flex-col">
                                <div
                                    className="relative w-full overflow-hidden border border-[#d1ab75]/35 bg-[#e0d6c3]/10"
                                    style={{ aspectRatio: selectedPhoto.aspect === "aspect-3/4" ? "3/4" : selectedPhoto.aspect === "aspect-4/3" ? "4/3" : selectedPhoto.aspect === "aspect-square" ? "1/1" : "16/10" }}
                                >
                                    <Image
                                        src={selectedPhoto.src}
                                        alt={selectedPhoto.caption}
                                        fill
                                        sizes="400px"
                                        className="object-cover"
                                    />
                                </div>

                                <div className="mt-4 px-4 py-1 bg-linear-to-r from-[#8a6538] via-[#ffd79d] to-[#8a6538] border border-[#d1ab75] text-[#1f0d16] text-[9px] uppercase tracking-widest font-serif font-bold shadow-md rounded-xs mx-auto text-center min-w-27.5">
                                    {selectedPhoto.caption}
                                </div>
                            </div>

                            <div className="mt-6 text-center max-w-85 px-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-[#d1ab75] mb-2 font-bold">{selectedPhoto.date}</p>
                                <p className="text-[12px] text-[#fdf9ef] leading-relaxed italic font-serif opacity-90">{selectedPhoto.desc}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailCard({ title, icon, children }) {
    return (
        <div className="group overflow-hidden rounded-3xl border border-[#d1ab75]/35 bg-white/90 shadow-[0_18px_50px_rgba(125,36,50,0.08)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
            <div className="border-b border-[#d1ab75]/25 bg-linear-to-r from-[#fffaf4] via-white to-[#fff7ef] px-5 py-4 text-center">
                <h4 className="mx-auto text-sm font-bold uppercase tracking-[0.25em] text-[#7d2432]">{title}</h4>
            </div>
            <div className="space-y-3 px-5 py-5">{children}</div>
        </div>
    );
}

function DetailItem({ label, value }) {
    if (!value) return null;

    return (
        <div className="rounded-2xl bg-[#fdf9ef]/60 px-3 py-3 text-sm leading-6 text-[#5a3a31]">
            {label ? (
                <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#7d2432]">{label}</span>
            ) : (
                <span className="block text-[#3c261f]">•</span>
            )}
            <span className="mt-1 block whitespace-normal wrap-break-word text-[#3c261f]">{value}</span>
        </div>
    );
}
