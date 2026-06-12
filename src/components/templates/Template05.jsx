"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Music2, Pause, Calendar, Clock, MapPin, Shirt } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import Image from 'next/image';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Template05({ formData = {}, template = {}, embedded = false, fullscreen = false }) {
    const containerRef = useRef(null);
    const audioStartedRef = useRef(false);
    const audioUrl = formData?.musicLink || '/assets/template/05/kesariya-rang.mp3';
    const { isPlaying, toggleAudio, playAudio, audioNode } = useAudio(audioUrl);

    const startAudio = useCallback(() => {
        if (audioStartedRef.current || isPlaying) return;
        audioStartedRef.current = true;
        const playPromise = playAudio();
        if (playPromise?.catch) {
            playPromise.catch(() => {
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



        const events = ["wheel", "touchstart", "pointerdown", "keydown", "scroll"];

        if (!isPlaying) {
            events.forEach(event => window.addEventListener(event, handleInteraction, { passive: true }));
        }

        return () => {
            events.forEach(event => window.removeEventListener(event, handleInteraction));
        };
    }, [startAudio, isPlaying]);
    const scrollerTarget = embedded
        ? "#preview-scroller-container"
        : window;

    // Force ScrollTrigger refresh on layout changes
    useEffect(() => {
        const timeout = setTimeout(() => ScrollTrigger.refresh(), 500);

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    // Derived values from formData (fall back to defaults)
    const brideName = (formData?.bride || "Simran").trim();
    const groomName = (formData?.groom || "Harjot").trim();
    const reverseOrder = formData?.nameOrder === "groomFirst";
    const firstName = reverseOrder ? groomName : brideName;
    const secondName = reverseOrder ? brideName : groomName;

    const displayDate = formData?.date
        ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(formData.date))
        : "24 November 2027";

    const venue = formData?.venue || "Royal Heritage Palace, Ludhiana";
    const whatsappNumber = formData?.whatsapp || "1234567890";

    const brideParents = [formData?.brideFather, formData?.brideMother].filter(Boolean).join(" & ") || "S. Gurpreet Singh & Smt. Amanpreet Kaur";
    const groomParents = [formData?.groomFather, formData?.groomMother].filter(Boolean).join(" & ") || "Sardar Jaswinder Singh & Smt. Paramjit Kaur";

    const topParents = reverseOrder ? groomParents : brideParents;
    const bottomParents = reverseOrder ? brideParents : groomParents;
    const topRelation = reverseOrder ? "son" : "daughter";
    const bottomRelation = reverseOrder ? "Daughter of" : "Son of";

    const blessingText = formData?.blessing || "May the divine light guide us, bless our journey and fill our lives with love, harmony and joy.";

    const targetDateStr = formData?.date ? `${formData.date}T00:00:00` : "2027-11-24T00:00:00";

    // Events summary (Scene 5) and Scene 6
    const defaultEvts = [
        { name: 'Sagan', date: '19 NOV 2027', time: '10:00 AM', icon: 'sikhsymbol.png', quote: 'A promise of forever.', venue: 'Royal Heritage Palace', dress: 'Traditional Elegant', detailedIcon: 'poojathal.png' },
        { name: 'Mehendi', date: '20 NOV 2027', time: '04:00 PM', icon: 'mehandi.png', quote: 'Colors of love, intricate and deep.', venue: 'The Courtyard Gardens', dress: 'Vibrant Green/Yellow', detailedIcon: 'mehandi.png' },
        { name: 'Haldi', date: '21 NOV 2027', time: '10:00 AM', icon: 'haldi.png', quote: 'A golden glow for a bright beginning.', venue: 'Poolside Lawn', dress: 'Sunny Yellow', detailedIcon: 'haldiicon.png' },
        { name: 'Sangeet', date: '21 NOV 2027', time: '07:00 PM', icon: 'dholak.png', quote: 'Where hearts sing, feet dance and joy knows no end.', venue: 'Grand Ballroom', dress: 'Festive & Colorful', detailedIcon: 'dholak.png' },
        { name: 'Anand Karaj', date: '24 NOV 2027', time: '10:30 AM', icon: 'sikhsymbol.png', quote: 'Two souls blending into one light.', venue: 'Gurdwara Sahib', dress: 'Traditional Pastels', detailedIcon: 'weddingicon.png' },
        { name: 'Reception', date: '24 NOV 2027', time: '07:30 PM', icon: 'wine.png', quote: 'An evening of celebration and toast.', venue: 'The Crystal Hall', dress: 'Black Tie / Glamorous', detailedIcon: 'receptionicon.png' },
    ];

    const getEventIconsFor05 = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('sagan')) return { icon: 'sikhsymbol.png', detailedIcon: 'poojathal.png' };
        if (lower.includes('mehendi')) return { icon: 'mehandi.png', detailedIcon: 'mehandi.png' };
        if (lower.includes('haldi')) return { icon: 'haldi.png', detailedIcon: 'haldiicon.png' };
        if (lower.includes('sangeet')) return { icon: 'dholak.png', detailedIcon: 'dholak.png' };
        if (lower.includes('anand') || lower.includes('wedding') || lower.includes('shaadi') || lower.includes('pheras')) return { icon: 'sikhsymbol.png', detailedIcon: 'weddingicon.png' };
        return { icon: 'wine.png', detailedIcon: 'receptionicon.png' };
    };

    const eventsList = Array.isArray(formData?.selectedEvents) && formData.selectedEvents.length > 0
        ? formData.selectedEvents.map((ev) => {
            const detail = formData.eventDetails?.[ev] || {};
            const evDateStr = detail.date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(detail.date)) : displayDate;
            const evTimeStr = detail.time ? detail.time : "11:00 AM";
            const icons = getEventIconsFor05(ev);
            return {
                name: ev,
                date: evDateStr.toUpperCase(),
                time: evTimeStr,
                quote: detail.oneLiner || "Join us in celebrating this beautiful moment.",
                venue: detail.venue || venue,
                dress: formData.dressCode || "Vibrant & Festive",
                icon: icons.icon,
                detailedIcon: icons.detailedIcon
            };
        })
        : defaultEvts;

    const getEventBgFor05 = (name, idx) => {
        const lower = name.toLowerCase();
        if (lower.includes('sagan')) return '/assets/template/05/scene6/eventspoojathalbg.png';
        if (lower.includes('mehendi')) return '/assets/template/05/scene6/mehandibg.png';
        if (lower.includes('haldi')) return '/assets/template/05/scene6/haldibg.png';
        if (lower.includes('sangeet')) return '/assets/template/05/scene6/sangeetbg.png';
        if (lower.includes('anand') || lower.includes('wedding') || lower.includes('shaadi') || lower.includes('pheras')) return '/assets/template/05/scene6/weddingbg.png';
        if (lower.includes('reception')) return '/assets/template/05/scene6/receptionbg.png';

        const bgs = [
            '/assets/template/05/scene6/eventspoojathalbg.png',
            '/assets/template/05/scene6/mehandibg.png',
            '/assets/template/05/scene6/haldibg.png',
            '/assets/template/05/scene6/sangeetbg.png',
            '/assets/template/05/scene6/weddingbg.png',
            '/assets/template/05/scene6/receptionbg.png'
        ];
        return bgs[idx % 6];
    };

    // RSVP families line
    const rsvpFamilies = (formData?.brideFather || formData?.groomFather)
        ? `The ${formData.brideFather ? formData.brideFather.split(" ").slice(-1)[0] : ""} & ${formData.groomFather ? formData.groomFather.split(" ").slice(-1)[0] : ""} Families`
        : "The Kaur & Singh Families";

    // Scene 1 Refs
    const fabricRef = useRef(null);
    const templeRef = useRef(null);
    const bottomPalaceRef = useRef(null);
    const diyaRef = useRef(null);
    const textGroupRef = useRef(null);
    const scrollIndicatorRef = useRef(null);

    // Scene 2 Refs
    const scene2ContainerRef = useRef(null);
    const scene2ContentRef = useRef(null);
    const gateRef = useRef(null);
    const ikOnkarRef = useRef(null);
    const diya2Ref = useRef(null);

    // Scene 3 Refs
    const scene3ContainerRef = useRef(null);
    const scene3ContentRef = useRef(null);
    const cardRef = useRef(null);

    // Scene 4 Refs
    const scene4ContainerRef = useRef(null);
    const scene4ContentRef = useRef(null);
    const topLightsRef = useRef(null);
    const sideLightsRef = useRef(null);
    const countdownRef = useRef(null);

    // Scene 5 Refs
    const scene5ContainerRef = useRef(null);
    const scene5EventsRef = useRef(null);

    // Scene 6 Refs
    const scene6ContainerRef = useRef(null);
    const scene6ImagesRef = useRef(null);
    const scene6ContentRef = useRef(null);

    // Scene 7 Refs
    const scene7ContainerRef = useRef(null);
    const leftDiyaRef = useRef(null);
    const rightDiyaRef = useRef(null);

    // Countdown State
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date(targetDateStr).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, [targetDateStr]);

    useGSAP(() => {
        if (!containerRef.current) return;

        const scrollerTarget = embedded
            ? (containerRef.current.closest("#preview-scroller-container") || window)
            : window;

        // --- Scene 1: Entrance ---
        const tl = gsap.timeline();

        tl.from(fabricRef.current, { y: -100, opacity: 0, duration: 1.5, ease: 'power2.out' }, 0)
            .from(templeRef.current, { y: 50, opacity: 0, scale: 0.95, duration: 1.5, ease: 'power2.out' }, 0.2)
            .from(bottomPalaceRef.current, { y: 100, opacity: 0, duration: 1.5, ease: 'power2.out' }, 0.4)
            .from(diyaRef.current, { scale: 0, opacity: 0, duration: 1, ease: 'back.out(1.5)' }, 0.8)
            .from(scrollIndicatorRef.current, { opacity: 0, duration: 1 }, 1.2);

        // Diya flicker
        gsap.to(diyaRef.current, { opacity: 0.7, scale: 0.95, duration: 0.1, yoyo: true, repeat: -1, ease: 'rough' });

        gsap.set(textGroupRef.current.children, { opacity: 0, y: 30 });

        // Scroll Pinned Animation for Scene 1
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                scroller: scrollerTarget,
                start: 'top top',
                end: '+=100%',
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
            }
        });

        scrollTl
            .to(scrollIndicatorRef.current, { opacity: 0, y: -20, duration: 0.2 }, 0)
            .to(textGroupRef.current.children, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, 0.1)
            .to(textGroupRef.current, { y: -50, opacity: 0, duration: 1.5 }, 1.5)
            .to(fabricRef.current, { y: -100, opacity: 0, duration: 1.5 }, 1.5)
            .to(templeRef.current, { y: 50, opacity: 0, duration: 1.5 }, 1.5)
            .to(bottomPalaceRef.current, { y: 100, opacity: 0, duration: 1.5 }, 1.5)
            .to(diyaRef.current, { opacity: 0, duration: 1.5 }, 1.5);

        // --- Scene 2: Blessings ---
        gsap.to(diya2Ref.current, { opacity: 0.8, scale: 0.95, duration: 0.15, yoyo: true, repeat: -1, ease: 'rough' });

        gsap.from(ikOnkarRef.current, {
            scrollTrigger: {
                trigger: scene2ContainerRef.current,
                scroller: scrollerTarget,
                start: 'top 60%',
                toggleActions: 'play none none reverse',
            },
            scale: 0, rotation: 180, opacity: 0, duration: 1.5, ease: 'back.out(1.2)'
        });

        gsap.from(scene2ContentRef.current.children, {
            scrollTrigger: {
                trigger: scene2ContainerRef.current,
                scroller: scrollerTarget,
                start: 'top 50%',
                toggleActions: 'play none none reverse',
            },
            y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: 'power2.out'
        });

        // Parallax gate
        gsap.to(gateRef.current, {
            scrollTrigger: {
                trigger: scene2ContainerRef.current,
                scroller: scrollerTarget,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
            scale: 1.05,
            y: -20,
            ease: 'none'
        });

        // --- Scene 3: Invitation Details ---
        gsap.from(cardRef.current, {
            scrollTrigger: {
                trigger: scene3ContainerRef.current,
                scroller: scrollerTarget,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            y: 100, opacity: 0, duration: 1.2, ease: 'power2.out'
        });

        gsap.from(scene3ContentRef.current.children, {
            scrollTrigger: {
                trigger: scene3ContainerRef.current,
                scroller: scrollerTarget,
                start: 'top 50%',
                toggleActions: 'play none none reverse',
            },
            y: 20, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.3
        });

        // --- Scene 4: Countdown ---
        gsap.to(topLightsRef.current, {
            rotation: 2, transformOrigin: 'top center', duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut'
        });
        gsap.to(sideLightsRef.current, {
            rotation: -2, transformOrigin: 'top center', duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut'
        });

        gsap.from(scene4ContentRef.current.children, {
            scrollTrigger: {
                trigger: scene4ContainerRef.current,
                scroller: scrollerTarget,
                start: 'top 70%',
                toggleActions: 'play none none reverse',
            },
            y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: 'power2.out'
        });

        gsap.from(countdownRef.current.children, {
            scrollTrigger: {
                trigger: countdownRef.current,
                scroller: scrollerTarget,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
            scale: 0.8, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'back.out(1.5)'
        });

        // --- Scene 5: Events List ---
        gsap.from(scene5ContainerRef.current.querySelector('h1'), {
            scrollTrigger: {
                trigger: scene5ContainerRef.current,
                scroller: scrollerTarget,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
            },
            y: 30, opacity: 0, duration: 0.8, ease: 'power2.out'
        });

        const eventCards = scene5ContainerRef.current.querySelectorAll('.event-card');
        eventCards.forEach((card) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    scroller: scrollerTarget,
                    start: 'top 95%',
                    end: 'bottom 15%',
                    scrub: 1,
                }
            });

            tl.fromTo(card,
                { y: 80, opacity: 0, scale: 0.8, rotationX: -15 },
                { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.3, ease: 'power2.out' }
            )
                .to(card, { y: 0, duration: 0.4 })
                .to(card, { y: -80, opacity: 0, scale: 0.8, rotationX: 15, duration: 0.3, ease: 'power2.in' });
        });

        // --- Scene 6: Detailed Events (Pinned Scroll) ---
        if (scene6ImagesRef.current && scene6ContentRef.current) {
            const bgImages = Array.from(scene6ImagesRef.current.children);
            const contentBlocks = Array.from(scene6ContentRef.current.children);

            const tl6 = gsap.timeline({
                scrollTrigger: {
                    trigger: scene6ContainerRef.current,
                    scroller: scrollerTarget,
                    start: 'top top',
                    end: '+=400%',
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                }
            });

            // Initial state
            bgImages.forEach((img, i) => {
                if (i !== 0) gsap.set(img, { opacity: 0 });
            });
            contentBlocks.forEach((block, i) => {
                if (i !== 0) gsap.set(block, { opacity: 0, y: 50 });
            });

            // Transitions
            contentBlocks.forEach((block, i) => {
                if (i !== 0) {
                    // Fade out previous
                    tl6.to(bgImages[i - 1], { opacity: 0, duration: 1 }, `+=${0.5}`);
                    tl6.to(contentBlocks[i - 1], { opacity: 0, y: -50, duration: 1 }, `<`);

                    // Fade in next
                    tl6.to(bgImages[i], { opacity: 1, duration: 1 }, `<0.5`);
                    tl6.to(block, { opacity: 1, y: 0, duration: 1 }, `<`);
                }
            });
        }

        // --- Scene 7: RSVP ---
        const diyas = [leftDiyaRef.current, rightDiyaRef.current].filter(Boolean);
        if (diyas.length > 0) {
            gsap.to(diyas, {
                opacity: 0.6, scale: 0.9, duration: 0.2, yoyo: true, repeat: -1, ease: 'rough', stagger: 0.1
            });
        }

        gsap.from(scene7ContainerRef.current.children, {
            scrollTrigger: {
                trigger: scene7ContainerRef.current,
                scroller: scrollerTarget,
                start: 'top 60%',
                toggleActions: 'play none none reverse',
            },
            y: 40, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'power2.out'
        });

    }, { scope: containerRef });

    return (
        <div className="w-full min-h-screen bg-[#4A0E17]">
            {audioNode}
            <button
                onClick={toggleAudio}
                className="fixed bottom-6 right-6 z-100 size-12 rounded-full border border-[#D4AF37]/50 bg-[#4A0E17]/80 text-[#D4AF37] shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Toggle audio"
            >
                {isPlaying ? <Pause size={18} /> : <Music2 size={18} />}
            </button>

            {/* === SCENE 1: Hero Entrance === */}
            <div
                ref={containerRef}
                className="max-w-md mx-auto w-full h-dvh relative overflow-hidden bg-[#4A0E17] text-[#D4AF37]"
            >
                <div className="absolute inset-0 z-0">
                    <Image src="/assets/template/05/scene1/background.png" alt="Bg" className="w-full h-full object-cover" width={400} height={800} />
                </div>

                <div ref={fabricRef} className="absolute top-0 inset-x-0 z-20">
                    <Image src="/assets/template/05/scene1/top-fabric.png" alt="Fabric" className="w-full object-cover h-32 opacity-90" width={400} height={150} />
                </div>

                <div ref={templeRef} className="absolute inset-0 z-10 flex flex-col justify-end items-center mb-16">
                    <Image src="/assets/template/05/scene1/goldentemple.png" alt="Golden Temple" className="w-full object-contain" width={400} height={400} />
                </div>

                <div ref={bottomPalaceRef} className="absolute bottom-0 inset-x-0 z-15">
                    <Image src="/assets/template/05/scene1/bottom-palace.png" alt="Palace Bottom" className="w-full object-cover h-40 opacity-90" width={400} height={200} />
                </div>

                <div ref={diyaRef} className="absolute bottom-8 right-8 z-20">
                    <Image src="/assets/template/05/scene1/diya.png" alt="Diya" className="w-16 object-contain" width={64} height={64} />
                </div>

                {/* Gradient Overlay for text */}
                <div className="absolute inset-0 z-25 bg-gradient-to-t from-[#4A0E17]/80 via-[#4A0E17]/40 to-transparent" />

                <div className="relative z-30 flex flex-col items-center justify-center h-full pt-16 pb-32 px-8 text-center pointer-events-none">
                    <div ref={textGroupRef} className="flex flex-col items-center justify-center w-full">
                        <p className="text-[10px] sm:text-[11px] font-serif italic text-[#F4EBD9] mb-4 opacity-90">
                            Together with their families
                        </p>
                        <h1 className="text-6xl sm:text-7xl font-serif text-[#F4EBD9] mb-0 leading-none drop-shadow-lg">{firstName}</h1>
                        <div className="flex items-center space-x-4 my-2">
                            <div className="w-8 h-[1px] bg-[#D4AF37]/50" />
                            <p className="text-[10px] font-serif italic text-[#D4AF37]">weds</p>
                            <div className="w-8 h-[1px] bg-[#D4AF37]/50" />
                        </div>
                        <h1 className="text-6xl sm:text-7xl font-serif text-[#F4EBD9] mb-6 leading-none drop-shadow-lg">{secondName}</h1>

                        <p className="text-[9px] sm:text-[10px] tracking-widest font-sans uppercase text-[#F4EBD9] mb-1">
                            {displayDate}
                        </p>
                        <p className="text-[10px] sm:text-xs font-serif text-[#D4AF37] opacity-90">
                            {venue}
                        </p>
                    </div>

                    <div ref={scrollIndicatorRef} className="absolute bottom-10 flex flex-col items-center justify-center space-y-2 opacity-80">
                        <div className="w-8 h-8 rounded-full border border-[#D4AF37] flex items-center justify-center mb-1">
                            <Image src="/assets/template/05/scene1/downmark-icon.png" alt="Scroll" className="w-4 animate-bounce" width={16} height={16} />
                        </div>
                        <span className="text-[7px] tracking-[0.2em] uppercase text-[#D4AF37]">Scroll to explore</span>
                    </div>
                </div>
            </div>

            {/* === SCENE 2: Blessings === */}
            <div
                ref={scene2ContainerRef}
                className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#2D060E] text-[#D4AF37] flex flex-col items-center justify-center pt-20 pb-20 px-8"
            >
                <div className="absolute inset-0 z-0">
                    <Image src="/assets/template/05/scene2/darkbackground.png" alt="Dark Bg" className="w-full h-full object-cover opacity-80 mix-blend-multiply" width={400} height={800} />
                </div>

                <div className="absolute top-0 inset-x-0 z-10">
                    <Image src="/assets/template/05/scene2/toppattern.png" alt="Top Pattern" className="w-full object-contain opacity-50" width={400} height={100} />
                </div>
                <div className="absolute bottom-0 inset-x-0 z-10">
                    <Image src="/assets/template/05/scene2/bottompatter.png" alt="Bottom Pattern" className="w-full object-contain opacity-50" width={400} height={100} />
                </div>

                <div ref={gateRef} className="absolute inset-0 z-15 flex justify-center items-center opacity-40">
                    <Image src="/assets/template/05/scene2/entrancegate.png" alt="Gate" className="w-[90%] h-[90%] object-contain" width={360} height={700} />
                </div>

                <div className="relative z-20 flex flex-col items-center text-center w-full mt-4">
                    <div ref={ikOnkarRef} className="relative w-32 h-32 mb-12 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#D4AF37] blur-3xl opacity-20 rounded-full" />
                        <Image src="/assets/template/05/scene2/symbol-icon.png" alt="Waheguru Symbol" className="w-full h-full object-contain relative z-10" width={128} height={128} />
                    </div>

                    <div ref={scene2ContentRef} className="flex flex-col items-center space-y-6">
                        <p className="text-xs font-serif italic text-[#F4EBD9] opacity-90">With the blessings of</p>
                        <h2 className="text-4xl font-serif text-[#F4EBD9]">Waheguru</h2>
                        <div className="w-48 my-4">
                            <Image src="/assets/template/05/scene2/seperator.png" alt="Separator" className="w-full object-contain" width={200} height={20} />
                        </div>
                        <p className="text-xs font-serif text-[#F4EBD9] opacity-80 leading-loose max-w-[250px]">
                            {blessingText}
                        </p>
                    </div>

                    <div ref={diya2Ref} className="mt-16 w-16 h-16">
                        <Image src="/assets/template/05/scene2/diya.png" alt="Diya" className="w-full h-full object-contain" width={64} height={64} />
                    </div>
                </div>
            </div>

            {/* === SCENE 3: Invitation Details === */}
            <div
                ref={scene3ContainerRef}
                className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#4A0E17] text-[#4A0E17] flex items-center justify-center py-10 px-6"
            >
                <div className="absolute inset-0 z-0">
                    <Image src="/assets/template/05/scene3/background.png" alt="Bg" className="w-full h-full object-cover" width={400} height={800} />
                </div>

                <div ref={cardRef} className="relative z-10 w-[90%] h-[85vh] flex flex-col items-center justify-center">
                    <Image src="/assets/template/05/scene3/content-bg.png" alt="Texture" className="absolute inset-0 w-full h-full object-fill drop-shadow-2xl" width={350} height={600} />

                    <div ref={scene3ContentRef} className="relative z-10 flex flex-col items-center text-center w-full px-8 py-12 h-full justify-between">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 shrink-0 mt-6">
                            <Image src="/assets/template/05/scene3/sikhismsymbol.png" alt="Symbol" className="w-full h-full object-contain" width={80} height={80} />
                        </div>

                        <div className="space-y-1 mb-6">
                            <p className="text-[8px] sm:text-[9px] font-sans tracking-[0.15em] uppercase text-[#4A0E17] font-semibold">
                                {topParents}
                            </p>
                            <p className="text-[7px] sm:text-[8px] font-serif uppercase tracking-widest opacity-80 pt-2">
                                Request the honour of your presence<br />at the wedding celebrations of their {topRelation}
                            </p>
                        </div>

                        <div className="my-2">
                            <h1 className="text-5xl sm:text-6xl font-serif text-[#4A0E17] mb-0 leading-none">{firstName}</h1>
                            <p className="text-xl sm:text-2xl font-serif text-[#4A0E17] opacity-80 my-1">&amp;</p>
                            <h1 className="text-5xl sm:text-6xl font-serif text-[#4A0E17] mt-0 leading-none">{secondName}</h1>
                        </div>

                        <div className="space-y-1 mt-6 mb-4">
                            <p className="text-[8px] sm:text-[9px] font-sans tracking-[0.15em] uppercase text-[#4A0E17] font-semibold">
                                {bottomRelation}<br />{bottomParents}
                            </p>
                        </div>

                        <div className="w-32 sm:w-40 my-4">
                            <Image src="/assets/template/05/scene3/goldenseprator.png" alt="Separator" className="w-full object-contain" width={160} height={20} />
                        </div>

                        <div className="space-y-2 mb-4">
                            <p className="text-[10px] sm:text-xs font-sans tracking-widest font-bold uppercase text-[#4A0E17]">
                                {displayDate}
                            </p>
                            <p className="text-[8px] sm:text-[9px] font-sans tracking-widest uppercase text-[#4A0E17] opacity-80 leading-relaxed">
                                {venue}
                            </p>
                        </div>

                        <div className="w-24 sm:w-32 mt-auto mb-6">
                            <Image src="/assets/template/05/scene3/bottomflowerseperator.png" alt="Flowers" className="w-full object-contain" width={128} height={40} />
                        </div>
                    </div>
                </div>
            </div>

            {/* === SCENE 4: Countdown === */}
            <div
                ref={scene4ContainerRef}
                className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#2D060E] text-[#D4AF37] flex flex-col items-center justify-center pt-24 pb-16 px-8"
            >
                <div className="absolute inset-0 z-0">
                    <Image src="/assets/template/05/scene4/backgroundpalace.png" alt="Palace Bg" className="w-full h-full object-cover opacity-60 mix-blend-screen" width={400} height={800} />
                </div>

                <div ref={topLightsRef} className="absolute top-0 inset-x-0 z-10">
                    <Image src="/assets/template/05/scene4/tophangingfairylights.png" alt="Lights" className="w-full object-contain" width={400} height={100} />
                </div>
                <div ref={sideLightsRef} className="absolute top-10 inset-x-0 z-10">
                    <Image src="/assets/template/05/scene4/fairylightv2.png" alt="Lights" className="w-full object-contain" width={400} height={100} />
                </div>

                <div className="absolute inset-0 z-15 bg-gradient-to-t from-[#2D060E] via-[#2D060E]/50 to-transparent" />

                <div ref={scene4ContentRef} className="relative z-20 flex flex-col items-center text-center w-full">
                    <div className="w-24 h-24 mb-6">
                        <Image src="/assets/template/05/scene4/icon.png" alt="Icon" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" width={96} height={96} />
                    </div>

                    <p className="text-xs font-serif italic text-[#F4EBD9] mb-2 opacity-90">The</p>
                    <h1 className="text-4xl font-serif text-[#F4EBD9] mb-2">Celebration</h1>
                    <p className="text-xl font-serif italic text-[#D4AF37] mb-10">Begins In</p>

                    <div ref={countdownRef} className="flex space-x-3 sm:space-x-4 mb-16">
                        {Object.entries(timeLeft).map(([unit, value], idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <div className="relative w-16 h-20 sm:w-18 sm:h-22 flex items-center justify-center mb-2">
                                    <div className="absolute inset-0 z-0">
                                        <Image src="/assets/template/05/scene4/boxwithborder.png" alt="Box" className="w-full h-full object-fill" width={64} height={80} />
                                    </div>
                                    <span className="relative z-10 text-3xl font-serif text-[#F4EBD9]">{value.toString().padStart(2, '0')}</span>
                                </div>
                                <span className="text-[8px] tracking-widest uppercase font-sans text-[#D4AF37] opacity-80">{unit}</span>
                            </div>
                        ))}
                    </div>

                    <div className="w-48">
                        <Image src="/assets/template/05/scene4/goldenseprator.png" alt="Separator" className="w-full object-contain" width={200} height={20} />
                    </div>
                </div>
            </div>

            {/* === SCENE 5: Events Summary === */}
            <div
                ref={scene5ContainerRef}
                className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#F4EBD9] text-[#4A0E17] flex flex-col items-center justify-center pt-20 pb-16 px-4"
            >
                <div className="absolute inset-0 z-0">
                    <Image src="/assets/template/05/scene5/background.png" alt="Pattern" className="w-full h-full object-cover opacity-30" width={400} height={800} />
                </div>

                <div className="absolute top-0 inset-x-0 flex justify-center z-10 pointer-events-none opacity-20">
                    <Image src="/assets/template/05/scene5/mandala.png" alt="Mandala" className="w-[150%] max-w-none -translate-y-1/2 object-contain" width={600} height={600} />
                </div>

                <div className="absolute bottom-0 inset-x-0 z-10">
                    <Image src="/assets/template/05/scene5/bottom.png" alt="Bottom Decor" className="w-full object-cover h-24 opacity-80" width={400} height={100} />
                </div>

                <div className="relative z-20 flex flex-col items-center w-full mt-4">
                    <div className="text-center mb-8">
                        <div className="w-24 mx-auto mb-3">
                            <Image src="/assets/template/05/scene5/floralseperator.png" alt="Floral" className="w-full object-contain" width={96} height={30} />
                        </div>
                        <h1 className="text-3xl font-serif text-[#4A0E17]">Wedding Celebrations</h1>
                    </div>

                    <div ref={scene5EventsRef} className="w-[95%] space-y-4 [perspective:1000px] mb-12">
                        {eventsList.map((event, index) => (
                            <div key={index} className="event-card flex items-center justify-between py-3 px-1 border-b border-[#4A0E17]/10 hover:bg-[#4A0E17]/5 transition-colors cursor-pointer group">
                                <div className="flex items-center space-x-4 w-[55%]">
                                    <div className="w-10 h-10 shrink-0 p-1 rounded-full flex items-center justify-center bg-transparent">
                                        <Image src={`/assets/template/05/scene5/${event.icon}`} alt={event.name} className="w-full h-full object-contain" width={40} height={40} />
                                    </div>
                                    <h3 className="text-lg font-serif text-[#4A0E17] group-hover:text-[#D4AF37] transition-colors">{event.name}</h3>
                                </div>
                                <div className="w-[1px] h-10 bg-[#D4AF37]/40 shrink-0" />
                                <div className="text-right w-[40%] flex flex-col justify-center pr-2">
                                    <p className="text-[8px] font-sans tracking-widest text-[#4A0E17] opacity-80 uppercase leading-none mb-1">{event.date}</p>
                                    <p className="text-[9px] font-sans font-bold text-[#4A0E17] leading-none uppercase">{event.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* === SCENE 6: Detailed Events (Pinned) === */}
            <div
                ref={scene6ContainerRef}
                className="max-w-md mx-auto w-full h-dvh relative overflow-hidden bg-[#2D060E] text-[#D4AF37]"
            >
                {/* Arch Frame Overlay */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <Image src="/assets/template/05/scene6/entrance.png" alt="Arch" className="w-full h-full object-contain opacity-90" width={400} height={800} />
                </div>

                {/* Crossfading Foreground Images at Bottom */}
                <div ref={scene6ImagesRef} className="absolute bottom-0 inset-x-0 h-full z-20">
                    {eventsList.map((evt, idx) => (
                        <div key={idx} className="absolute bottom-0 w-full ">
                            <Image src={getEventBgFor05(evt.name, idx)} alt="Event Image" className="w-full h-full object-cover" width={400} height={400} />
                            {/* Gradient to blend the top edge into the maroon background */}
                            <div className="absolute top-0 inset-x-0 h-16 bg-linear-to-b from-[#2D060E] to-transparent" />
                        </div>
                    ))}
                </div>

                {/* Crossfading Content */}
                <div ref={scene6ContentRef} className="relative z-30 w-full h-full">
                    {eventsList.map((evt, idx) => (
                        <div key={idx} className="absolute inset-0 w-full h-full flex flex-col items-center pt-16 px-8 text-center">
                            <div className="w-16 h-16 mb-4 mt-2">
                                <Image src={`/assets/template/05/scene6/${evt.detailedIcon}`} alt={evt.name} className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" width={64} height={64} />
                            </div>

                            <h1 className="text-4xl font-serif text-[#F4EBD9] mb-2">{evt.name}</h1>
                            <p className="text-[10px] sm:text-xs font-serif italic text-[#D4AF37] opacity-90 leading-relaxed px-4 mb-6">
                                {evt.quote}
                            </p>

                            <div className="space-y-3 text-left w-full max-w-[280px] mx-auto">
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                                        <Calendar size={14} className="text-[#D4AF37]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-sans tracking-[0.15em] text-[#D4AF37] uppercase">Date</p>
                                        <p className="text-[10px] font-sans text-[#F4EBD9] opacity-90">{evt.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                                        <Clock size={14} className="text-[#D4AF37]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-sans tracking-[0.15em] text-[#D4AF37] uppercase">Time</p>
                                        <p className="text-[10px] font-sans text-[#F4EBD9] opacity-90">{evt.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                                        <MapPin size={14} className="text-[#D4AF37]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-sans tracking-[0.15em] text-[#D4AF37] uppercase">Venue</p>
                                        <p className="text-[10px] font-sans text-[#F4EBD9] opacity-90 leading-tight">{evt.venue}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center shrink-0">
                                        <Shirt size={14} className="text-[#D4AF37]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-sans tracking-[0.15em] text-[#D4AF37] uppercase">Dress Code</p>
                                        <p className="text-[10px] font-sans text-[#F4EBD9] opacity-90">{evt.dress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* === SCENE 7: RSVP === */}
            <div
                ref={scene7ContainerRef}
                className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#4A0E17] text-[#D4AF37] flex flex-col justify-between"
            >
                <div className="absolute inset-0 z-0 h-screen">
                    <Image src="/assets/template/05/scene7/background.png" alt="Bg" className=" object-cover" width={800} height={800} />
                </div>

                <div className="absolute top-0 inset-x-0 z-10">
                    <Image src="/assets/template/05/scene7/topb.png" alt="Top Pattern" className="w-full object-contain" width={400} height={100} />
                </div>

                {/* Content Top Half */}
                <div className="relative z-20 flex flex-col items-center text-center w-full pt-16 px-6">
                    <div className="w-16 h-16 mb-8 mt-4">
                        <Image src="/assets/template/05/scene3/sikhismsymbol.png" alt="Symbol" className="w-full h-full object-contain opacity-80" width={64} height={64} />
                    </div>

                    <p className="text-lg font-serif text-[#F4EBD9] leading-relaxed mb-10 px-4">
                        We would be honoured<br />
                        to celebrate this<br />
                        beautiful day with you.
                    </p>

                    <div className="space-y-3 mb-8">
                        <p className="text-xs font-serif italic text-[#D4AF37] opacity-90">With love and gratitude,</p>
                        <p className="text-sm font-serif text-[#F4EBD9]">{rsvpFamilies}</p>
                    </div>
                </div>

                {/* Solid Pink Bottom Block */}
                <div className="relative z-30 w-full bg-[#B21C42] flex flex-col items-center justify-center py-8 px-6 mt-[-1px]">
                    <div className="absolute inset-0 z-0  ">
                        <Image src="/assets/template/05/scene7/bottombg.png" alt="Pattern" className="w-full h-full object-cover" width={400} height={200} />
                    </div>

                    <a
                        href={`https://wa.me/${whatsappNumber}?text=Hello!%20I%20would%20love%20to%20attend%20the%20wedding%20of%20${firstName}%20%26%20${secondName}!`}
                        target="_blank" rel="noopener noreferrer"
                        className="relative z-10 inline-flex items-center justify-center space-x-2 px-8 py-3 border border-[#F4EBD9]/60 bg-transparent text-[#F4EBD9] rounded-full font-sans tracking-widest text-[10px] font-bold hover:bg-[#F4EBD9] hover:text-[#B21C42] transition-colors shadow-[0_0_15px_rgba(244,235,217,0.1)] mb-4"
                    >
                        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg></span>
                        <span>RSVP ON WHATSAPP</span>
                    </a>

                    <p className="relative z-10 text-[9px] font-sans tracking-widest text-[#F4EBD9] opacity-80 uppercase">
                        We look forward to celebrating with you!
                    </p>
                </div>
            </div>
        </div>
    );
}
