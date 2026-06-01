"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Music2, Pause } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import Image from 'next/image';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
}

export default function Template04({ formData = {}, template = {}, embedded = false, fullscreen = false }) {
    const containerRef = useRef(null);
    const audioStartedRef = useRef(false);
    const audioUrl = formData?.musicLink || '/assets/template/04/kesariya-rang.mp3';
    const { isPlaying, toggleAudio, playAudio, audioNode } = useAudio(audioUrl);

    const startAudio = useCallback(() => {
        if (audioStartedRef.current || isPlaying) return;
        audioStartedRef.current = true;
        const playPromise = playAudio();
        if (playPromise?.catch) {
            playPromise.catch(() => {
                // Browser blocked auto-play, reset so next interaction can try again
                audioStartedRef.current = false;
            });
        }
    }, [playAudio, isPlaying]);

    useEffect(() => {
        const handleInteraction = () => {
            if (!isPlaying) {
                startAudio();
            }
        };

        // We listen to multiple interaction events. 
        // We don't use `{ once: true }` because the first event (e.g. scroll) might be blocked by browser policies.
        // We keep trying on subsequent interactions until isPlaying becomes true.
        const events = ["wheel", "touchstart", "pointerdown", "keydown", "scroll"];

        if (!isPlaying) {
            events.forEach(event => window.addEventListener(event, handleInteraction, { passive: true }));
        }

        return () => {
            events.forEach(event => window.removeEventListener(event, handleInteraction));
        };
    }, [startAudio, isPlaying]);

    // Force ScrollTrigger refresh on layout changes (e.g. lazy loaded images)
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            ScrollTrigger.refresh();
        });
        resizeObserver.observe(document.body);
        
        // Also refresh after a small delay to catch initial render shifts
        const timeout = setTimeout(() => ScrollTrigger.refresh(), 500);

        return () => {
            resizeObserver.disconnect();
            clearTimeout(timeout);
        };
    }, []);

    // Derived values from formData (fall back to defaults)
    const brideName = (formData?.bride || "Priya").trim();
    const groomName = (formData?.groom || "Arjun").trim();
    const reverseOrder = formData?.nameOrder === "groomFirst";
    const firstName = reverseOrder ? groomName : brideName;
    const secondName = reverseOrder ? brideName : groomName;

    const displayDate = formData?.date
        ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(formData.date))
        : "14 December 2027";

    const venue = formData?.venue || "The Royal Crescent Palace, Udaipur";
    const whatsappNumber = formData?.whatsapp || "1234567890";

    const brideParents = [formData?.brideFather, formData?.brideMother].filter(Boolean).join(" & ") || "Mr. Rajeev Kapoor & Mrs. Kavita Kapoor";
    const groomParents = [formData?.groomFather, formData?.groomMother].filter(Boolean).join(" & ") || "Mr. Sanjay Kapoor & Mrs. Neeta Kapoor";
    const firstParents = reverseOrder ? groomParents : brideParents;
    const secondParents = reverseOrder ? brideParents : groomParents;

    const blessingText = formData?.blessing || "As the divine remover of obstacles blesses our path, Priya and Arjun begin their forever with love, gratitude and endless blessings.";

    // Events summary (Scene 4) and Scene 5
    const defaultEvts = [
        { name: 'SAGAN', date: '12 DEC 2027 | 6:00 PM', time: '6:00 PM', venue: 'PALACE COURTYARD', dress: 'FORMAL INDIAN', desc: 'Join us for the ring ceremony.', icon: 'ring-icon.png', scene5Icon: 'rings.png' },
        { name: 'MEHENDI', date: '13 DEC 2027 | 11:00 AM', time: '11:00 AM', venue: 'ROYAL GARDENS', dress: 'VIBRANT TRADITIONAL', desc: 'Colors, laughter, and mehendi.', icon: 'hand-icon.png', scene5Icon: 'handicon.png' },
        { name: 'SANGEET', date: '13 DEC 2027 | 7:00 PM', time: '7:00 PM', venue: 'GRAND BALLROOM', dress: 'GLAMOROUS', desc: 'A night of music and dance.', icon: 'music.png', scene5Icon: 'musics.png' },
        { name: 'SHAADI', date: '14 DEC 2027 | 7:15 PM', time: '7:15 PM', venue: 'PALACE COURTYARD MANDAP', dress: 'TRADITIONAL INDIAN', desc: 'Witness the sacred vows beneath a moonlit mandap.', icon: 'mandir-icon.png', scene5Icon: 'mandap.png' },
        { name: 'RECEPTION', date: '15 DEC 2027 | 8:00 PM', time: '8:00 PM', venue: 'THE LAKESIDE TERRACE', dress: 'BLACK TIE / ELEGANT', desc: 'An evening of celebration and toast.', icon: 'wine-icon.png', scene5Icon: 'wine.png' },
    ];

    const getEventIconsFor04 = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('sagan')) return { icon: 'ring-icon.png', scene5Icon: 'rings.png' };
        if (lower.includes('mehendi')) return { icon: 'hand-icon.png', scene5Icon: 'handicon.png' };
        if (lower.includes('sangeet')) return { icon: 'music.png', scene5Icon: 'musics.png' };
        if (lower.includes('wedding') || lower.includes('shaadi') || lower.includes('pheras')) return { icon: 'mandir-icon.png', scene5Icon: 'mandap.png' };
        return { icon: 'wine-icon.png', scene5Icon: 'wine.png' };
    };

    const eventsList = Array.isArray(formData?.selectedEvents) && formData.selectedEvents.length > 0
        ? formData.selectedEvents.map((ev) => {
            const detail = formData.eventDetails?.[ev] || {};
            const evDate = detail.date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(detail.date)) : displayDate;
            const evTime = detail.time ? detail.time : "11:00 AM";
            const icons = getEventIconsFor04(ev);
            return {
                name: ev.toUpperCase(),
                date: `${evDate.toUpperCase()} | ${evTime}`,
                time: evTime,
                venue: (detail.venue || venue).toUpperCase(),
                dress: (formData.dressCode || "VIBRANT & FESTIVE").toUpperCase(),
                desc: detail.oneLiner || "Join us in celebrating this beautiful moment.",
                icon: icons.icon,
                scene5Icon: icons.scene5Icon
            };
        })
        : defaultEvts;

    // Gallery (Scene 6)
    const galleryPhotos = Array.isArray(formData?.galleryImages) && formData.galleryImages.filter(Boolean).length > 0
        ? formData.galleryImages.filter(Boolean)
        : [
            '/assets/template/04/scene6/window.png',
            '/assets/template/04/scene6/window2.png',
            '/assets/template/04/scene6/window.png',
            '/assets/template/04/scene6/window2.png'
        ];

    const storyText = formData?.story || "Two souls, two journeys, one beautiful beginning. From laughter to dreams, from friendship to forever, our hearts chose each other.";

    // RSVP families line
    const rsvpFamilies = (formData?.brideFather || formData?.groomFather)
        ? `The ${formData.brideFather ? formData.brideFather.split(" ").slice(-1)[0] : ""} & ${formData.groomFather ? formData.groomFather.split(" ").slice(-1)[0] : ""} Families`
        : "The Malhotra & Mehra Families";

    const rsvpDeadline = formData?.rsvpDeadline
        ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(formData.rsvpDeadline))
        : "15 NOVEMBER 2027";

    // Refs for animating elements
    const skyRef = useRef(null);
    const moonRef = useRef(null);
    const moonImageRef = useRef(null);
    const palaceRef = useRef(null);
    const gateRef = useRef(null);
    const coupleRef = useRef(null);
    const leftLampRef = useRef(null);
    const rightLampRef = useRef(null);
    const textGroupRef = useRef(null);
    const scrollIndicatorRef = useRef(null);

    // Scene 2 Refs
    const scene2ContainerRef = useRef(null);
    const scene2ContentRef = useRef(null);
    const ganeshaIconRef = useRef(null);

    // Scene 3 Refs
    const scene3ContainerRef = useRef(null);
    const scene3ContentRef = useRef(null);
    const topFlowerRef = useRef(null);
    const bottomFlowerRef = useRef(null);
    const palaceSketchRef = useRef(null);

    // Scene 4 Refs
    const scene4ContainerRef = useRef(null);
    const scene4ContentRef = useRef(null);

    // Scene 5 Refs
    const scene5ContainerRef = useRef(null);
    const scene5EventsRef = useRef(null);

    // Scene 6 Refs
    const scene6ContainerRef = useRef(null);
    const scene6ImagesRef = useRef(null);
    const scene6DotsRef = useRef(null);

    // Scene 7 Refs
    const scene7ContainerRef = useRef(null);

    useGSAP(() => {
        // --- Initial Entrance Animation ---
        const tl = gsap.timeline();

        // Speed up initial animations
        tl.from(skyRef.current, { opacity: 0, scale: 1.05, duration: 1.5, ease: 'power2.out' }, 0)
            .from(moonRef.current, { opacity: 0, y: 30, scale: 0.9, duration: 1.5, ease: 'power3.out' }, 0.3)
            .from(palaceRef.current, { opacity: 0, y: 20, duration: 1.5, ease: 'power2.out' }, 0.5)
            .from(coupleRef.current, { opacity: 0, y: 20, duration: 1.5, ease: 'power2.out' }, 0.6)
            .from(gateRef.current, { opacity: 0, scale: 1.1, duration: 1.2, ease: 'power2.out' }, 0.7)
            .from([leftLampRef.current, rightLampRef.current], {
                opacity: 0,
                y: -50,
                duration: 1.2,
                stagger: 0.1,
                ease: 'back.out(1.2)'
            }, 0.9)
            .from(scrollIndicatorRef.current, { opacity: 0, duration: 1 }, 1.2);

        // Continuous ambient animations
        gsap.to(leftLampRef.current, {
            rotation: 8,
            transformOrigin: 'top center',
            duration: 2.5,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });

        gsap.to(rightLampRef.current, {
            rotation: -8,
            transformOrigin: 'top center',
            duration: 2.5,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });

        gsap.to(moonImageRef.current, {
            scale: 1.05,
            duration: 5,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });

        // Initially hide text
        gsap.set(textGroupRef.current.children, { opacity: 0, y: 30 });

        // --- Scroll Triggered Animations ---
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=100%', // Reduced distance so it feels faster
                scrub: 0.5, // Lower scrub for smoother/snappier response
                pin: true,
            }
        });

        scrollTl
            // 1. Fade out scroll indicator quickly
            .to(scrollIndicatorRef.current, { opacity: 0, y: -20, duration: 0.2 }, 0)

            // 2. Animate text in (faster stagger)
            .to(textGroupRef.current.children, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            }, 0.1)
            // Fade out the bride and groom image and slide them completely off-screen left
            .to(coupleRef.current, { opacity: 0, duration: 5, }, 0.1)

            // 3. Exit Scene 
            // Using fromTo fixes the issue where elements disappear on reverse scroll 
            // because ScrollTrigger won't rely on the opacity: 0 start state from the initial `.from()` tl.
            .to(textGroupRef.current, { y: -50, opacity: 0, duration: 1.5 }, 1.5)
            .fromTo(moonRef.current, { y: 0, scale: 1 }, { y: -100, scale: 0.8, duration: 1.5 }, 1.5)
            .fromTo(palaceRef.current, { y: 0, scale: 1, opacity: 1 }, { y: 50, scale: 1.1, opacity: 0.5, duration: 1.5 }, 1.5)
            .fromTo(gateRef.current, { scale: 1, opacity: 1 }, { scale: 1.8, opacity: 0, duration: 1.5 }, 1.5)
            .fromTo([leftLampRef.current, rightLampRef.current], { y: 0, opacity: 1 }, { y: -150, opacity: 0, duration: 2 }, 2.5)
            .fromTo(skyRef.current, { opacity: 1 }, { opacity: 0, duration: 2 }, 2.5);

        // --- Scene 2 Animations ---
        // Snappy entrance for content
        gsap.from(scene2ContentRef.current.children, {
            scrollTrigger: {
                trigger: scene2ContainerRef.current,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
            },
            y: 50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power2.out'
        });

        // Endless parallax scrolling for Ganesha
        gsap.to(ganeshaIconRef.current, {
            scrollTrigger: {
                trigger: scene2ContainerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            y: -50,
            scale: 1.08,
            rotation: 2,
            ease: 'none'
        });

        // --- Scene 3 Animations ---
        // Snappy entrance for content
        gsap.from(scene3ContentRef.current.children, {
            scrollTrigger: {
                trigger: scene3ContainerRef.current,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
            },
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power2.out'
        });

        // Parallax for flowers and sketch
        const scene3ScrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: scene3ContainerRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            }
        });

        scene3ScrollTl
            .fromTo(topFlowerRef.current, { y: -50, x: 20 }, { y: 20, x: 0, ease: 'none' }, 0)
            .fromTo(bottomFlowerRef.current, { y: 50, x: -20 }, { y: -20, x: 0, ease: 'none' }, 0)
            .fromTo(palaceSketchRef.current, { y: 30 }, { y: -10, ease: 'none' }, 0);

        // Continuous ambient sway for flowers
        gsap.to(topFlowerRef.current, {
            rotation: 2,
            scale: 1.03,
            transformOrigin: 'top right',
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });

        gsap.to(bottomFlowerRef.current, {
            rotation: -2,
            scale: 1.03,
            transformOrigin: 'bottom left',
            duration: 3.5,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });

        // --- Scene 4 Animations ---
        // Header
        gsap.from(scene4ContentRef.current.children[0], {
            scrollTrigger: {
                trigger: scene4ContainerRef.current,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
            },
            y: 30, opacity: 0, duration: 0.8, ease: 'power2.out'
        });

        // Individual Event Cards (Advanced scrub entry/exit)
        const eventCards = scene4ContainerRef.current.querySelectorAll('.event-card');
        eventCards.forEach((card, index) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: 'top 95%',  // Start animating when card enters bottom of screen
                    end: 'bottom 15%', // Finish animation when card reaches top of screen
                    scrub: 1,
                }
            });

            tl.fromTo(card,
                { y: 80, opacity: 0, scale: 0.8, rotationX: -15 },
                { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.3, ease: 'power2.out' }
            )
                .to(card, { y: 0, duration: 0.4 }) // Hold statically in the middle of scroll
                .to(card,
                    { y: -80, opacity: 0, scale: 0.8, rotationX: 15, duration: 0.3, ease: 'power2.in' }
                );
        });

        // Bottom Decorative Border
        gsap.from(scene4ContentRef.current.children[2], {
            scrollTrigger: {
                trigger: scene4ContentRef.current.children[2],
                start: 'top 95%',
                toggleActions: 'play none none reverse',
            },
            y: 20, opacity: 0, duration: 0.8, ease: 'power2.out'
        });

        // --- Scene 5 Animations ---
        if (scene5EventsRef.current) {
            const scene5Events = Array.from(scene5EventsRef.current.children);
            const tl5 = gsap.timeline({
                scrollTrigger: {
                    trigger: scene5ContainerRef.current,
                    start: 'top top',
                    end: '+=400%',
                    scrub: 1,
                    pin: true,
                }
            });

            scene5Events.forEach((event, i) => {
                if (i !== 0) {
                    tl5.fromTo(event, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 }, `+=${0.5}`);
                }
                if (i !== scene5Events.length - 1) {
                    tl5.to(event, { opacity: 0, scale: 1.2, duration: 1 }, `+=${1}`);
                }
            });
        }

        // --- Scene 6 Animations ---
        if (scene6ImagesRef.current && scene6DotsRef.current) {
            const scene6Images = Array.from(scene6ImagesRef.current.children);
            const scene6Dots = Array.from(scene6DotsRef.current.children);
            const tl6 = gsap.timeline({
                scrollTrigger: {
                    trigger: scene6ContainerRef.current,
                    start: 'top top',
                    end: '+=300%',
                    scrub: 1,
                    pin: true,
                }
            });

            scene6Images.forEach((img, i) => {
                if (i !== 0) {
                    tl6.fromTo(img, { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 1 }, `+=${0.5}`);
                    tl6.to(scene6Dots[i - 1], { opacity: 0.5, scale: 1, borderColor: 'rgba(212,175,55,0.5)', duration: 0.1 }, `<`);
                    tl6.to(scene6Dots[i], { opacity: 1, scale: 1.1, borderColor: 'rgba(212,175,55,1)', duration: 0.1 }, `<`);
                }
                if (i !== scene6Images.length - 1) {
                    tl6.to(img, { opacity: 0, x: -100, duration: 1 }, `+=${1}`);
                }
            });
        }

    }, { scope: containerRef });

    return (
        <div className="w-full min-h-screen bg-[#050B14]">
            {audioNode}
            <button
                onClick={toggleAudio}
                className="fixed bottom-6 right-6 z-100 size-12 rounded-full border border-[#D4AF37]/50 bg-[#050B14]/80 text-[#D4AF37] shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Toggle audio"
            >
                {isPlaying ? <Pause size={18} /> : <Music2 size={18} />}
            </button>
            {/* 
                Container for Scene 1. 
                Using pin: true in scrollTrigger so this container will stick while the user scrolls,
                and then it will scroll away. 
            */}
            <div
                ref={containerRef}
                className="max-w-md mx-auto w-full h-dvh relative overflow-hidden bg-[#050B14] text-[#D4AF37]"
            >
                {/* === Background Layers === */}
                <div ref={skyRef} className="absolute inset-0 z-0">
                    <Image
                        src="/assets/template/04/scene1/sky-background.png"
                        alt="Starry Sky"
                        className="w-full object-cover"
                        width={320}
                        height={800}
                    />
                </div>

                <div className="absolute inset-0 z-10 flex translate-x-4/7 pt-24">
                    <div ref={moonRef}>
                        <Image
                            ref={moonImageRef}
                            src="/assets/template/04/scene1/moon.png"
                            alt="Glowing Moon"
                            className="w-22 h-22 object-contain mix-blend-screen opacity-90"
                            width={100}
                            height={100}
                        />
                    </div>
                </div>

                <div className="absolute inset-0 z-20 flex flex-col justify-end">
                    <Image
                        ref={palaceRef}
                        src="/assets/template/04/scene1/palace-background.png"
                        alt="Palace Silhouette"
                        className="w-full object-contain h-[90%] object-bottom"
                        width={320}
                        height={800}
                    />
                </div>

                <div className="absolute inset-0 z-25 flex flex-col justify-end items-center pb-24">
                    <Image
                        ref={coupleRef}
                        src="/assets/template/04/scene1/groomsbride.png"
                        alt="Couple"
                        className="w-[55%] object-contain opacity-100"
                        width={300}
                        height={400}
                    />
                </div>

                {/* Ambient shadow/glow layer to ensure text readability */}
                <div className="absolute inset-0 z-25 bg-linear-to-t from-[#050B14] via-[#050B14]/40 to-transparent opacity-80" />
                <div className="absolute inset-0 z-10">
                    <Image
                        src="/assets/template/04/scene1/shadow-white.png"
                        alt="ambient glow"
                        className="w-full h-full object-cover mix-blend-overlay opacity-20"
                        width={300}
                        height={300}
                    />
                </div>

                {/* === Foreground Layers === */}
                <div ref={gateRef} className="absolute inset-0 z-30 pointer-events-none">
                    <Image
                        src="/assets/template/04/scene1/frontend-gate.png"
                        alt="Archway Gate"
                        className="w-full h-full object-cover"
                        width={320}
                        height={800}
                    />
                </div>

                {/* Lamps */}
                <div ref={leftLampRef} className="absolute top-0 left-6 z-40 w-16 md:w-20 pointer-events-none">
                    <Image
                        src="/assets/template/04/scene1/hanging-lamp.png"
                        alt="Hanging Lamp Left"
                        className="w-full object-contain"
                        width={100}
                        height={100}
                    />
                </div>
                <div ref={rightLampRef} className="absolute top-0 right-6 z-40 w-16 md:w-20 pointer-events-none">
                    <Image
                        src="/assets/template/04/scene1/hanging-lamp.png"
                        alt="Hanging Lamp Right"
                        width={100}
                        height={100}
                        className="w-full object-contain"
                    />
                </div>

                {/* === Content / Text === */}
                <div className="relative z-50 flex flex-col items-center justify-center h-full pt-32 pb-24 px-8 text-center pointer-events-none">

                    <div ref={textGroupRef} className="flex flex-col items-center justify-center w-full">
                        <p className="text-[10px] sm:text-xs tracking-[0.2em] font-serif uppercase text-[#E5C98F] mb-6">
                            Together with<br />their families
                        </p>

                        <div className="flex flex-col items-center space-y-2 mb-8">
                            <h1 className="text-5xl sm:text-6xl font-serif tracking-wide text-[#F3E2B5] font-light">
                                {firstName}
                            </h1>
                            <span className="text-sm italic font-serif text-[#E5C98F]">weds</span>
                            <h1 className="text-5xl sm:text-6xl font-serif tracking-wide text-[#F3E2B5] font-light">
                                {secondName}
                            </h1>
                        </div>

                        <div className="space-y-2 mt-4">
                            <p className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#E5C98F]">
                                {displayDate}
                            </p>
                            <p className="text-xs sm:text-sm font-serif text-[#E5C98F] opacity-90 leading-relaxed">
                                {venue}
                            </p>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div
                        ref={scrollIndicatorRef}
                        className="absolute bottom-9 flex flex-col items-center justify-center space-y-3 opacity-80"
                    >
                        <span className="text-[9px] tracking-[0.2em] uppercase text-[#E5C98F]">Scroll to begin</span>
                        <div className="w-px h-10 bg-linear-to-b from-[#E5C98F] to-transparent animate-pulse" />
                    </div>

                </div>
            </div>

            {/* === SCENE 2: Ganesha === */}
            <div
                ref={scene2ContainerRef}
                className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#050B14] text-[#D4AF37] flex flex-col items-center justify-center pt-16 pb-16 px-8 z-10"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/template/04/scene2/background.png"
                        alt="Pattern Background"
                        className="w-full h-full object-cover opacity-50 mix-blend-screen"
                        width={400}
                        height={800}
                    />
                </div>
                {/* Blend gradient at the top to merge seamlessly with Scene 1 */}
                <div className="absolute top-0 inset-x-0 h-48 bg-linear-to-b from-[#050B14] to-transparent z-10" />

                {/* Content */}
                <div ref={scene2ContentRef} className="relative z-20 flex flex-col items-center text-center w-full mt-4">
                    {/* Ganesha Icon */}
                    <div ref={ganeshaIconRef} className="w-56 h-56 relative mb-8">
                        <Image
                            src="/assets/template/04/scene2/ganpatiji-icon.png"
                            alt="Lord Ganesha"
                            className="w-full h-full object-contain drop-shadow-2xl"
                            width={300}
                            height={300}
                        />
                    </div>

                    {/* Headings */}
                    <div className="space-y-3 mb-6">
                        <h2 className="text-[10px] tracking-[0.25em] font-sans uppercase text-[#E5C98F]">
                            With the blessings of
                        </h2>
                        <h1 className="text-xl tracking-[0.15em] font-serif uppercase text-[#D4AF37]">
                            Lord Ganesha
                        </h1>
                    </div>

                    {/* Paragraph */}
                    <p className="text-xs font-serif text-[#E5C98F] opacity-90 leading-[1.8] max-w-[280px]">
                        {blessingText}
                    </p>

                    {/* Decorative Border */}
                    <div className="w-24 mt-10">
                        <Image
                            src="/assets/template/04/scene2/bottom-border.png"
                            alt="Decorative Border"
                            className="w-full object-contain opacity-80"
                            width={150}
                            height={30}
                        />
                    </div>
                </div>
            </div>

            {/* === SCENE 3: Invitation Details === */}
            <div
                ref={scene3ContainerRef}
                className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#F4EBD9] text-[#3d2c1d] flex flex-col items-center justify-center pt-16 pb-16 px-8 z-20"
            >
                {/* Background Texture */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/template/04/scene3/background.png"
                        alt="Vintage Paper Background"
                        className="w-full h-full object-cover"
                        width={400}
                        height={800}
                    />
                </div>

                {/* Top Right Flower */}
                <div ref={topFlowerRef} className="absolute top-0 right-0 z-10 w-40 pointer-events-none">
                    <Image
                        src="/assets/template/04/scene3/top-flower.png"
                        alt="Top Flower Decoration"
                        className="w-full object-contain"
                        width={160}
                        height={160}
                    />
                </div>

                {/* Bottom Left Flower */}
                <div ref={bottomFlowerRef} className="absolute bottom-0 left-0 z-10 w-40 pointer-events-none">
                    <Image
                        src="/assets/template/04/scene3/bottom-flower.png"
                        alt="Bottom Flower Decoration"
                        className="w-full object-contain"
                        width={160}
                        height={160}
                    />
                </div>

                {/* Bottom Palace Sketch */}
                <div ref={palaceSketchRef} className="absolute bottom-8 inset-x-0 flex justify-center z-9 pointer-events-none opacity-80">
                    <Image
                        src="/assets/template/04/scene3/bottom-palace-sketch.png"
                        alt="Palace Sketch"
                        className="w-[75%] object-contain mix-blend-multiply"
                        width={300}
                        height={150}
                    />
                </div>

                {/* Content */}
                <div ref={scene3ContentRef} className="relative z-20 flex flex-col items-center text-center w-full space-y-6 pt-10 pb-20">

                    {/* Logo Placeholder / Icon */}
                    <div className="w-25 h-25 flex items-center justify-center mb-2">
                        <Image
                            src="/assets/template/04/scene3/lotus-icon.png"
                            alt="Logo"
                            className="w-full h-full object-contain"
                            width={60}
                            height={60}
                        />
                    </div>

                    {/* Parents Details */}
                    <div className="space-y-3 font-serif text-[#5a432b] text-[10px] sm:text-xs tracking-wider leading-relaxed">
                        {/* Couple Names */}
                        <div className="py-3 space-y-3">
                            <h1 className="text-4xl sm:text-5xl font-serif text-[#8C6D46]">
                                {firstName}
                            </h1>
                            <p>{reverseOrder ? `S/o ${groomParents}` : `D/o ${brideParents}`}</p>
                        </div>
                        <p className="italic text-5xl text-[#8C6D46]">&amp;</p>
                        <div className="py-3 space-y-3">
                            <h1 className="text-4xl sm:text-5xl font-serif text-[#8C6D46]">
                                {secondName}
                            </h1>
                            <p>{reverseOrder ? `D/o ${brideParents}` : `S/o ${groomParents}`}</p>
                        </div>
                        <p className="mt-4 opacity-80 px-4 leading-[1.8]">
                            cordially invite you to the<br />wedding celebration of their children
                        </p>
                    </div>

                    {/* Date & Venue */}
                    <div className="space-y-2 mt-2">
                        <p className="text-[10px] sm:text-xs tracking-[0.2em] font-sans uppercase text-[#5a432b] font-semibold">
                            {displayDate}
                        </p>
                        <p className="text-[10px] sm:text-xs font-serif text-[#5a432b] opacity-90 leading-relaxed pt-2">
                            {venue}
                        </p>
                    </div>
                </div>
            </div>

            {/* === SCENE 4: Wedding Celebrations === */}
            <div
                ref={scene4ContainerRef}
                className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#050B14] text-[#D4AF37] flex flex-col items-center justify-center pt-20 pb-16 px-6 z-30"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/template/04/scene4/background.png"
                        alt="Pattern Background"
                        className="w-full h-full object-cover opacity-40 mix-blend-screen"
                        width={400}
                        height={800}
                    />
                </div>

                {/* Blend gradient at the top */}
                <div className="absolute top-0 inset-x-0 h-48 bg-linear-to-b from-[#050B14] to-transparent z-10" />

                <div ref={scene4ContentRef} className="relative z-20 flex flex-col items-center w-full mt-8">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-serif text-[#D4AF37]">
                            Wedding<br />Celebrations
                        </h1>
                    </div>

                    {/* Events List */}
                    <div className="w-full space-y-4 [perspective:1000px]">
                        {eventsList.map((event, index) => (
                            <div key={index} className="event-card flex items-center justify-between p-4 border border-[#D4AF37]/20 rounded-xl bg-[#050B14]/60 backdrop-blur-sm shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:scale-[1.02] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all duration-300 cursor-pointer group">
                                <div className="flex items-center space-x-4">
                                    {/* Icon */}
                                    <div className="w-20 h-20 shrink-0">
                                        <Image
                                            src={`/assets/template/04/scene4/${event.icon}`}
                                            alt={event.name}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                            width={60}
                                            height={60}
                                        />
                                    </div>
                                    {/* Text */}
                                    <div className="text-left">
                                        <h3 className="text-md font-sans tracking-[0.2em] text-[#D4AF37] mb-1">{event.name}</h3>
                                        <p className="text-sm font-sans tracking-widest text-[#E5C98F] opacity-70">{event.date}</p>
                                    </div>
                                </div>
                                {/* Chevron */}
                                <div className="text-[#D4AF37]/50 group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Decorative Border */}
                    <div className="w-full mt-12">
                        <Image
                            src="/assets/template/04/scene4/bottom-border.png"
                            alt="Decorative Border"
                            className="w-full object-contain opacity-80"
                            width={200}
                            height={100}
                        />
                    </div>
                </div>
            </div>

            {/* === SCENE 5: Detailed Events (Pinned Scroll) === */}
            <div
                ref={scene5ContainerRef}
                className="max-w-md mx-auto w-full h-dvh relative overflow-hidden bg-[#050B14] text-[#D4AF37]"
            >
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/template/04/scene5/background.png"
                        alt="Pattern Background"
                        className="w-full h-full object-cover opacity-40 mix-blend-screen"
                        width={400}
                        height={800}
                    />
                </div>

                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-10">
                    <div className="relative w-[100%] h-[80%] flex items-center justify-center">
                        <Image
                            src="/assets/template/04/scene5/entrancegate.png"
                            alt="Entrance Gate Frame"
                            className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none"
                            width={350}
                            height={600}
                        />

                        <div ref={scene5EventsRef} className="relative z-10 w-[80%] h-[60%] flex items-center justify-center mt-12">
                            {eventsList.map((evt, idx) => (
                                <div key={idx} className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-8 ${idx !== 0 ? 'opacity-0 scale-90' : ''}`}>
                                    <div className="w-100 h-20 mb-4 shrink-0">
                                        <Image
                                            src={`/assets/template/04/scene5/${evt.scene5Icon}`}
                                            alt={evt.name}
                                            className="w-full h-full object-contain"
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                    <h2 className="text-3xl font-serif text-[#D4AF37] mb-4">{evt.name}</h2>
                                    <div className="space-y-2 mb-4 w-full">
                                        <div className="flex items-center justify-center space-x-2 text-[8px] tracking-[0.2em] font-sans text-[#E5C98F] opacity-90">
                                            <span>📅</span> <span>{evt.date.split(' | ')[0]}</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2 text-[8px] tracking-[0.2em] font-sans text-[#E5C98F] opacity-90">
                                            <span>🕒</span> <span>{evt.time}</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2 text-[8px] tracking-[0.2em] font-sans text-[#E5C98F] opacity-90">
                                            <span>📍</span> <span>{evt.venue}</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2 text-[8px] tracking-[0.2em] font-sans text-[#E5C98F] opacity-90">
                                            <span>✨</span> <span>{evt.dress}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-serif text-[#E5C98F] opacity-80 leading-relaxed max-w-[200px]">
                                        {evt.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* === SCENE 6: Meet the Couple (Gallery) === */}
            <div
                ref={scene6ContainerRef}
                className="max-w-md mx-auto w-full h-dvh relative overflow-hidden bg-[#050B14] text-[#D4AF37]"
            >
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/template/04/scene6/background.png"
                        alt="Pattern Background"
                        className="w-full h-full object-cover opacity-40 mix-blend-screen"
                        width={400}
                        height={800}
                    />
                </div>

                <div className="relative z-10 w-full h-full flex flex-col items-center pt-20 pb-10">
                    <h1 className="text-3xl font-serif text-[#D4AF37] mb-8">Meet the Couple</h1>

                    <div className="relative w-[75%] aspect-3/4 mb-8">
                        <div className="w-full h-full relative rounded-t-full overflow-hidden border-2 border-[#D4AF37]/50 p-2">
                            <div ref={scene6ImagesRef} className="w-full h-full relative rounded-t-full overflow-hidden">
                                {galleryPhotos.map((src, idx) => (
                                    <div key={idx} className={`absolute inset-0 w-full h-full ${idx !== 0 ? 'opacity-0' : ''}`}>
                                        <Image
                                            src={src}
                                            alt="Couple"
                                            className="w-full h-full object-cover"
                                            width={300}
                                            height={400}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-serif text-[#D4AF37] mb-3">{firstName} &amp; {secondName}</h2>
                    <p className="text-[10px] font-sans text-[#E5C98F] opacity-80 text-center px-10 leading-relaxed mb-6">
                        {storyText}
                    </p>

                    <div ref={scene6DotsRef} className="flex space-x-2 mt-auto pb-4 z-20">
                        {galleryPhotos.map((src, idx) => (
                            <div key={idx} className={`w-10 h-10 rounded border overflow-hidden transition-all duration-300 ${idx === 0 ? 'opacity-100 scale-110 border-[#D4AF37]' : 'opacity-50 border-[#D4AF37]/50'}`}>
                                <Image src={src} alt="thumbnail" width={40} height={40} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* === SCENE 7: RSVP === */}
            <div
                ref={scene7ContainerRef}
                className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#050B14] text-[#D4AF37] flex flex-col items-center justify-center pt-20 pb-20 px-8"
            >
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/template/04/scene7/background.png"
                        alt="Night Palace Background"
                        className="w-full h-full object-cover"
                        width={400}
                        height={800}
                    />
                </div>
                <div className="absolute inset-0 z-10 bg-[#050B14]/40" />

                <div className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center mt-20">
                    <p className="text-xl font-serif text-[#E5C98F] leading-relaxed mb-10 px-4">
                        We would be honoured<br />
                        to celebrate this<br />
                        beautiful night with you.
                    </p>

                    <div className="space-y-2 mb-20">
                        <p className="text-xs font-serif text-[#E5C98F] opacity-90">With love and gratitude,</p>
                        <p className="text-sm font-serif text-[#D4AF37]">{rsvpFamilies}</p>
                    </div>

                    <a
                        href={`https://wa.me/${whatsappNumber}?text=Hello!%20I%20would%20love%20to%20attend%20the%20wedding%20of%20${firstName}%20%26%20${secondName}!`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-8 py-3 bg-[#E5C98F] text-[#050B14] rounded-full font-sans tracking-widest text-xs font-bold hover:bg-[#D4AF37] transition-colors mb-6 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    >
                        RSVP ON WHATSAPP
                    </a>

                    <p className="text-[10px] font-sans tracking-widest text-[#E5C98F] opacity-70 uppercase">
                        Kindly respond by<br />
                        {rsvpDeadline}
                    </p>
                </div>
            </div>
        </div>
    );
}
