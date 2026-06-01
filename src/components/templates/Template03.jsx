"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Music2, Pause, ChevronRight } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import Image from 'next/image';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Template03({ formData = {}, template = {}, embedded = false, fullscreen = false }) {
    const containerRef = useRef(null);
    const audioStartedRef = useRef(false);
    const audioUrl = formData?.musicLink || '/assets/template/03/kesariya-rang.mp3';
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

    // Force ScrollTrigger refresh on layout changes
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            ScrollTrigger.refresh();
        });
        resizeObserver.observe(document.body);

        const timeout = setTimeout(() => ScrollTrigger.refresh(), 500);

        return () => {
            resizeObserver.disconnect();
            clearTimeout(timeout);
        };
    }, []);

    // Derived values from formData (fall back to defaults)
    const brideName = (formData?.bride || "Meera").trim();
    const groomName = (formData?.groom || "Aarav").trim();
    const reverseOrder = formData?.nameOrder === "groomFirst";
    const firstName = reverseOrder ? groomName : brideName;
    const secondName = reverseOrder ? brideName : groomName;

    const displayDate = formData?.date
        ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(formData.date))
        : "21 February 2027";

    const venue = formData?.venue || "The Grand Raj Palace, Jaipur";
    const whatsappNumber = formData?.whatsapp || "1234567890";

    // Parents
    const brideParents = [formData?.brideFather, formData?.brideMother].filter(Boolean).join(" & ") || "MR. RAJEEV SHARMA & MRS. NEETA SHARMA";
    const groomParents = [formData?.groomFather, formData?.groomMother].filter(Boolean).join(" & ") || "MR. ANIL KAPOOR & MRS. POOJA KAPOOR";
    const firstParents = reverseOrder ? groomParents : brideParents;
    const secondParents = reverseOrder ? brideParents : groomParents;

    // Blessing
    const blessingText = formData?.blessing || "May He remove all obstacles and shower His divine grace upon Aarav & Meera as they embark on their journey of love and togetherness.";

    // Events summary (Scene 4) and Scene 5
    const defaultEvts = [
        { name: 'Mehendi', date: '19 FEB 2027 • 11:00 AM', time: 'FRIDAY | 11:00 AM ONWARDS', dress: 'Green & Vibrant', icon: 'fruits-icon.png', quote: 'Hands decorated with love, heart filled with joy.' },
        { name: 'Haldi', date: '20 FEB 2027 • 11:00 AM', time: 'SATURDAY | 11:00 AM ONWARDS', dress: 'Yellow & Sunny', icon: 'diya-icon.png', quote: 'A golden glow for a bright beginning.' },
        { name: 'Sangeet', date: '20 FEB 2027 • 7:00 PM', time: 'SATURDAY | 7:00 PM ONWARDS', dress: 'Glitz & Glamour', icon: 'music-icon.png', quote: 'Where hearts sing, feet dance, and joy knows no end.' },
        { name: 'Wedding', date: '21 FEB 2027 • 4:30 PM', time: 'SUNDAY | 4:30 PM ONWARDS', dress: 'Royal Neutrals & Pastels', icon: 'mandap-icon.png', quote: 'Two hearts, two families, one timeless promise.' },
        { name: 'Reception', date: '21 FEB 2027 • 8:30 PM', time: 'SUNDAY | 8:30 PM ONWARDS', dress: 'Elegant Evening Wear', icon: 'wine-cheers.png', quote: 'An evening of celebration and toasts to the new couple.' }
    ];

    const getEventIcon = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('mehendi')) return 'fruits-icon.png';
        if (lower.includes('haldi')) return 'diya-icon.png';
        if (lower.includes('sangeet')) return 'music-icon.png';
        if (lower.includes('wedding') || lower.includes('shaadi') || lower.includes('pheras')) return 'mandap-icon.png';
        return 'wine-cheers.png';
    };

    const eventsList = Array.isArray(formData?.selectedEvents) && formData.selectedEvents.length > 0
        ? formData.selectedEvents.map((ev) => {
            const detail = formData.eventDetails?.[ev] || {};
            const evDate = detail.date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(detail.date)) : displayDate;
            const evTime = detail.time ? detail.time : "11:00 AM";
            return {
                name: ev,
                date: `${evDate.toUpperCase()} • ${evTime}`,
                time: `${evDate.toUpperCase()} | ${evTime} ONWARDS`,
                venue: detail.venue || venue,
                dress: formData.dressCode || "Vibrant & Festive",
                icon: getEventIcon(ev),
                quote: detail.oneLiner || "Join us in celebrating this beautiful moment."
            };
        })
        : defaultEvts;

    // Gallery
    const galleryPhotos = Array.isArray(formData?.galleryImages) && formData.galleryImages.filter(Boolean).length > 0
        ? formData.galleryImages.filter(Boolean)
        : [
            '/assets/template/03/sample-gallery1.jpeg',
            '/assets/template/03/sample-gallery2.jpg',
            '/assets/template/03/sample-gallery3.jpeg'
        ];

    const storyText = formData?.story || "Two souls, best friends, and now life partners. We met, we laughed, we dreamt — and now we promise forever.";

    // RSVP families line
    const rsvpFamilies = (formData?.brideFather || formData?.groomFather)
        ? `THE ${formData.brideFather ? formData.brideFather.split(" ").slice(-1)[0].toUpperCase() : ""} & ${formData.groomFather ? formData.groomFather.split(" ").slice(-1)[0].toUpperCase() : ""} FAMILIES`
        : "THE SHARMA & KAPOOR FAMILIES";

    const rsvpDeadline = formData?.rsvpDeadline
        ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(formData.rsvpDeadline))
        : "15 January 2027";

    // Refs
    const scene1ContainerRef = useRef(null);
    const scene1BgRef = useRef(null);
    const archRef = useRef(null);
    const heroTextRef = useRef(null);

    const scene2ContainerRef = useRef(null);
    const ganpatiRef = useRef(null);
    const scene2TextRef = useRef(null);
    const s2TopLeftFloralRef = useRef(null);
    const s2TopRightFloralRef = useRef(null);
    const s2BottomLeftFloralRef = useRef(null);
    const s2BottomRightFloralRef = useRef(null);

    const scene3ContainerRef = useRef(null);
    const scene3FrameRef = useRef(null);
    const scene3TextRef = useRef(null);
    const s3TopRightFloralRef = useRef(null);
    const s3BottomLeftFloralRef = useRef(null);

    const scene4ContainerRef = useRef(null);
    const scene4CardsRef = useRef(null);

    const scene5ContainerRef = useRef(null);
    const scene5ContentRef = useRef(null);
    const s5FloralLeftRef = useRef(null);
    const s5FloralRightRef = useRef(null);

    const scene6ContainerRef = useRef(null);
    const coupleImgRef = useRef(null);
    const galleryRef = useRef(null);
    const s6FloralLeftRef = useRef(null);
    const s6FloralRightRef = useRef(null);

    const scene7ContainerRef = useRef(null);

    useGSAP(() => {
        // --- Scene 1: Hero ---
        const tl1 = gsap.timeline();
        tl1.from(archRef.current, { scale: 1.1, opacity: 0, duration: 1.5, ease: 'power2.out' }, 0)
            .from(heroTextRef.current.children, { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: 'power2.out' }, 0.8);

        // Pin and zoom scroll for Scene 1
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: scene1ContainerRef.current,
                start: 'top top',
                end: '+=150%',
                scrub: 1,
                pin: true,
            }
        });

        scrollTl.to(scene1BgRef.current, { scale: 1.5, duration: 1 }, 0)
            .to(archRef.current, { scale: 1.4, y: -50, duration: 1 }, 0)
            .to(heroTextRef.current, { y: -100, opacity: 0, duration: 1 }, 0);

        // --- Scene 2: Blessings ---
        if (s2TopLeftFloralRef.current) gsap.to(s2TopLeftFloralRef.current, { rotation: 6, transformOrigin: "top left", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
        if (s2TopRightFloralRef.current) gsap.to(s2TopRightFloralRef.current, { rotation: -6, transformOrigin: "top right", duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
        if (s2BottomLeftFloralRef.current) gsap.to(s2BottomLeftFloralRef.current, { rotation: -4, transformOrigin: "bottom left", duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
        if (s2BottomRightFloralRef.current) gsap.to(s2BottomRightFloralRef.current, { rotation: 4, transformOrigin: "bottom right", duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.from(ganpatiRef.current, {
            scrollTrigger: { trigger: scene2ContainerRef.current, start: 'top 60%', toggleActions: 'play none none reverse' },
            scale: 0.8, opacity: 0, duration: 1.5, ease: 'back.out(1.2)'
        });
        gsap.from(scene2TextRef.current.children, {
            scrollTrigger: { trigger: scene2ContainerRef.current, start: 'top 50%', toggleActions: 'play none none reverse' },
            y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: 'power2.out'
        });

        // --- Scene 3: Invitation Details ---
        if (s3TopRightFloralRef.current) gsap.to(s3TopRightFloralRef.current, { rotation: -6, transformOrigin: "top right", duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
        if (s3BottomLeftFloralRef.current) gsap.to(s3BottomLeftFloralRef.current, { rotation: -4, transformOrigin: "bottom left", duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.from(scene3FrameRef.current, {
            scrollTrigger: { trigger: scene3ContainerRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
            y: 50, opacity: 0, duration: 1.2, ease: 'power2.out'
        });
        gsap.from(scene3TextRef.current.children, {
            scrollTrigger: { trigger: scene3ContainerRef.current, start: 'top 50%', toggleActions: 'play none none reverse' },
            y: 20, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', delay: 0.4
        });

        // --- Scene 4: Events List ---
        gsap.from(scene4ContainerRef.current.querySelector('h1'), {
            scrollTrigger: { trigger: scene4ContainerRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
            y: 30, opacity: 0, duration: 0.8, ease: 'power2.out'
        });

        const cards = scene4CardsRef.current.children;
        Array.from(cards).forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
                y: 40, opacity: 0, rotationX: -10, duration: 0.6, ease: 'power2.out'
            });
        });

        // --- Scene 5: Detailed Events (Pinned) ---
        if (s5FloralLeftRef.current) gsap.to(s5FloralLeftRef.current, { y: -10, scale: 1.05, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
        if (s5FloralRightRef.current) gsap.to(s5FloralRightRef.current, { y: -10, scale: 1.05, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });

        if (scene5ContentRef.current) {
            const contentBlocks = Array.from(scene5ContentRef.current.children);

            const tl5 = gsap.timeline({
                scrollTrigger: {
                    trigger: scene5ContainerRef.current,
                    start: 'top top',
                    end: '+=400%',
                    scrub: 1,
                    pin: true,
                }
            });

            // Initial state
            contentBlocks.forEach((block, i) => {
                if (i !== 0) gsap.set(block, { opacity: 0, y: 50 });
            });

            // Transitions
            contentBlocks.forEach((block, i) => {
                if (i !== 0) {
                    tl5.to(contentBlocks[i - 1], { opacity: 0, y: -50, duration: 1 }, `+=${0.5}`);
                    tl5.to(block, { opacity: 1, y: 0, duration: 1 }, `<`);
                }
            });
        }

        // --- Scene 6: Meet the Couple (Pinned Gallery) ---
        if (s6FloralLeftRef.current) gsap.to(s6FloralLeftRef.current, { rotation: 8, transformOrigin: "top left", duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
        if (s6FloralRightRef.current) gsap.to(s6FloralRightRef.current, { rotation: -8, transformOrigin: "top right", duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1 });

        gsap.from(scene6ContainerRef.current.querySelector('h1'), {
            scrollTrigger: { trigger: scene6ContainerRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
            y: 30, opacity: 0, duration: 0.8, ease: 'power2.out'
        });

        if (coupleImgRef.current) {
            const galleryImages = Array.from(coupleImgRef.current.children);

            const tl6 = gsap.timeline({
                scrollTrigger: {
                    trigger: scene6ContainerRef.current,
                    start: 'top top',
                    end: '+=200%',
                    scrub: 1,
                    pin: true,
                }
            });

            // Initial state
            galleryImages.forEach((img, i) => {
                if (i !== 0) gsap.set(img, { opacity: 0 });
            });

            // Crossfade transitions
            galleryImages.forEach((img, i) => {
                if (i !== 0) {
                    tl6.to(galleryImages[i - 1], { opacity: 0, duration: 1 }, `+=${0.5}`);
                    tl6.to(img, { opacity: 1, duration: 1 }, `<`);
                }
            });
        }

        // --- Scene 7: RSVP ---
        gsap.from(scene7ContainerRef.current.children, {
            scrollTrigger: { trigger: scene7ContainerRef.current, start: 'top 60%', toggleActions: 'play none none reverse' },
            y: 40, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'power2.out'
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full min-h-screen bg-[#F4F0EA] font-sans">
            {audioNode}
            <button
                onClick={toggleAudio}
                className="fixed bottom-6 right-6 z-100 size-12 rounded-full border border-[#8A7350]/30 bg-[#F4F0EA]/80 text-[#8A7350] shadow-lg backdrop-blur flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Toggle audio"
            >
                {isPlaying ? <Pause size={18} /> : <Music2 size={18} />}
            </button>

            {/* === SCENE 1: Hero === */}
            <div ref={scene1ContainerRef} className="max-w-md mx-auto w-full h-dvh relative overflow-hidden bg-[#F4F0EA] text-[#4A3B2C]">
                <div className="absolute inset-0 z-0">
                    <Image ref={scene1BgRef} src="/assets/template/03/scene1/bg-palace.png" alt="Palace" className="w-full h-full object-cover opacity-60" width={400} height={800} />
                </div>

                <div ref={archRef} className="absolute inset-0 z-10">
                    <Image src="/assets/template/03/scene1/entrance.png" alt="Arch" className="w-[130%] h-full object-contain" width={400} height={800} />
                </div>

                <div ref={heroTextRef} className="relative z-30 flex flex-col items-center pt-52 px-8 text-center h-full">
                    <p className="text-[9px] font-sans tracking-[0.2em] uppercase text-[#8A7350] mb-6 font-semibold">
                        Together with<br />their families
                    </p>
                    <h1 className="text-6xl font-serif text-[#4A3B2C] mb-2">{firstName}</h1>
                    <div className="flex items-center space-x-3 my-2 opacity-70">
                        <div className="w-6 h-[1px] bg-[#8A7350]" />
                        <p className="text-[10px] font-serif italic text-[#8A7350]">weds</p>
                        <div className="w-6 h-[1px] bg-[#8A7350]" />
                    </div>
                    <h1 className="text-6xl font-serif text-[#4A3B2C] mb-8">{secondName}</h1>

                    <p className="text-[10px] font-sans font-bold tracking-widest text-[#8A7350] uppercase mb-3">
                        {displayDate}
                    </p>
                    <p className="text-[9px] font-sans tracking-widest text-[#4A3B2C] uppercase opacity-80">
                        {venue}
                    </p>

                    <div className="absolute bottom-32 flex flex-col items-center">
                        <div className="w-3 h-6 border border-[#8A7350] rounded-full flex justify-center mb-2">
                            <div className="w-[2px] h-2 bg-[#8A7350] rounded-full mt-1 animate-bounce" />
                        </div>
                        <p className="text-[8px] tracking-widest uppercase text-[#8A7350]">Scroll to begin</p>
                    </div>
                </div>
            </div>

            {/* === SCENE 2: Blessings === */}
            <div ref={scene2ContainerRef} className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#F4F0EA] flex flex-col items-center justify-center p-8">
                <div className="absolute inset-0 z-0">
                    <Image src="/assets/template/03/scene2/background.png" alt="Bg" className="w-full h-full object-cover mix-blend-multiply opacity-50" width={400} height={800} />
                </div>

                <Image ref={s2TopLeftFloralRef} src="/assets/template/03/scene2/leftfloraltop.png" alt="Floral" className="absolute top-0 left-0 w-32 object-contain z-10" width={128} height={128} />
                <Image ref={s2TopRightFloralRef} src="/assets/template/03/scene2/toprightfloral.png" alt="Floral" className="absolute top-0 right-0 w-32 object-contain z-10" width={128} height={128} />
                <Image ref={s2BottomLeftFloralRef} src="/assets/template/03/scene2/leftfloral.png" alt="Floral" className="absolute bottom-0 left-0 w-40 object-contain z-10" width={160} height={160} />
                <Image ref={s2BottomRightFloralRef} src="/assets/template/03/scene2/rightfloral.png" alt="Floral" className="absolute bottom-0 right-0 w-32 object-contain z-10" width={128} height={128} />

                <div className="relative z-20 flex flex-col items-center text-center">
                    <div ref={ganpatiRef} className="relative w-40 h-40 mb-10 flex items-center justify-center">
                        <Image src="/assets/template/03/scene2/circle.png" alt="Circle" className="absolute inset-0 w-full h-full object-contain" width={160} height={160} />
                        <Image src="/assets/template/03/scene2/ganpati.png" alt="Ganpati" className="w-20 h-20 object-contain relative z-10" width={80} height={80} />
                    </div>

                    <div ref={scene2TextRef} className="flex flex-col items-center">
                        <p className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#8A7350] font-semibold mb-1">
                            With the blessings of
                        </p>
                        <h2 className="text-xl font-serif text-[#4A3B2C] mb-8">LORD GANESHA</h2>

                        <p className="text-[11px] font-serif leading-relaxed text-[#4A3B2C] max-w-[240px] opacity-90">
                            {blessingText}
                        </p>
                    </div>
                </div>
            </div>

            {/* === SCENE 3: Invitation Details === */}
            <div ref={scene3ContainerRef} className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#F4F0EA] flex items-center justify-center p-6">
                <div className="absolute inset-0 z-0">
                    <Image src="/assets/template/03/scene3/background.png" alt="Bg" className="w-full h-full object-cover opacity-50" width={400} height={800} />
                </div>

                <div ref={scene3FrameRef} className="relative z-10 w-full h-[88vh] flex items-center justify-center">
                    <Image src="/assets/template/03/scene3/foregroundcanvas.png" alt="Canvas" className="absolute inset-0 w-full h-full object-fill drop-shadow-xl" width={360} height={700} />

                    <Image src="/assets/template/03/scene3/topleftsketch.png" alt="Decor" className="absolute top-4 left-4 w-16 object-contain opacity-60" width={64} height={64} />
                    <Image ref={s3TopRightFloralRef} src="/assets/template/03/scene3/toprightfloral.png" alt="Decor" className="absolute top-0 right-0 w-32 object-contain" width={128} height={128} />
                    <Image src="/assets/template/03/scene3/bottomsketch.png" alt="Decor" className="absolute bottom-4 left-4 w-16 object-contain opacity-60" width={64} height={64} />
                    <Image ref={s3BottomLeftFloralRef} src="/assets/template/03/scene3/bottomfloral.png" alt="Decor" className="absolute bottom-0 left-0 w-32 object-contain" width={128} height={128} />
                    <Image src="/assets/template/03/scene3/rightbottomsketch.png" alt="Decor" className="absolute bottom-4 right-4 w-16 object-contain opacity-60" width={64} height={64} />

                    <div ref={scene3TextRef} className="relative z-20 flex flex-col items-center text-center px-8 w-full h-full py-16 justify-between">
                        <div className="space-y-1 mt-8">
                            <p className="text-[8px] font-sans tracking-[0.15em] font-semibold text-[#4A3B2C] uppercase">{firstParents}</p>
                            <p className="text-[7px] font-sans tracking-widest text-[#8A7350] my-2">TOGETHER WITH</p>
                            <p className="text-[8px] font-sans tracking-[0.15em] font-semibold text-[#4A3B2C] uppercase">{secondParents}</p>
                        </div>

                        <p className="text-[8px] font-serif uppercase tracking-widest text-[#4A3B2C] opacity-80 my-6">
                            REQUEST THE PLEASHOURE OF YOUR<br />GRACIOUS PRESENCE AT THE<br />WEDDING OF THEIR CHILDREN
                        </p>

                        <div className="my-2">
                            <h2 className="text-5xl font-serif text-[#4A3B2C] leading-none">{firstName}</h2>
                            <p className="text-xl font-serif italic text-[#8A7350] my-1">&amp;</p>
                            <h2 className="text-5xl font-serif text-[#4A3B2C] leading-none">{secondName}</h2>
                        </div>

                        <div className="w-36 my-6">
                            <Image src="/assets/template/03/scene3/seprator.png" alt="Separator" className="w-full object-contain" width={164} height={120} />
                        </div>

                        <div className="space-y-2 mb-8">
                            <p className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#8A7350]">{displayDate}</p>
                            <p className="text-[8px] font-sans tracking-widest uppercase text-[#4A3B2C] opacity-90">
                                {venue}
                            </p>
                            <p className="text-[7px] font-sans tracking-widest text-[#8A7350] pt-2">CELEBRATION TO FOLLOW</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* === SCENE 4: Events Summary === */}
            <div ref={scene4ContainerRef} className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#F4F0EA] flex flex-col items-center pt-24 pb-16 px-6">
                <div className="absolute inset-0 z-0">
                    <Image src="/assets/template/03/scene4/background.png" alt="Bg" className="w-full h-full object-cover mix-blend-multiply opacity-30" width={400} height={800} />
                </div>

                <div className="relative z-10 w-full text-center mb-10">
                    <p className="text-[9px] font-sans tracking-[0.2em] text-[#8A7350] uppercase font-semibold mb-1">Wedding</p>
                    <h1 className="text-4xl font-serif text-[#4A3B2C]">Celebrations</h1>
                </div>

                <div ref={scene4CardsRef} className="relative z-10 w-full space-y-4 [perspective:1000px]">
                    {eventsList.map((evt, idx) => (
                        <div key={idx} className="w-full bg-[#FCFBF8]/80 backdrop-blur-sm border border-[#8A7350]/20 rounded-2xl p-4 flex items-center shadow-[0_4px_20px_rgba(138,115,80,0.05)]">
                            <div className="w-12 h-12 flex items-center justify-center border-r border-[#8A7350]/20 pr-4 mr-4 shrink-0">
                                <Image src={`/assets/template/03/scene4/${evt.icon}`} alt={evt.name} className="w-10 h-10 object-contain" width={32} height={32} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[11px] font-sans font-bold tracking-[0.15em] uppercase text-[#4A3B2C] mb-1">{evt.name}</h3>
                                <p className="text-[9px] font-sans tracking-widest text-[#8A7350] uppercase">{evt.date}</p>
                            </div>
                            <ChevronRight size={16} className="text-[#8A7350]/60 shrink-0" />
                        </div>
                    ))}
                </div>

                <div className="relative z-10 w-26 mt-12">
                    <Image src="/assets/template/03/scene3/seprator.png" alt="Separator" className="w-full object-contain" width={164} height={120} />
                </div>
            </div>

            {/* === SCENE 5: Detailed Events (Pinned) === */}
            <div ref={scene5ContainerRef} className="max-w-md mx-auto w-full h-dvh relative overflow-hidden bg-[#F4F0EA] flex items-center justify-center p-6">
                {/* Background Pinned Frame */}
                <div className="absolute inset-0 z-0 bg-[#F4F0EA]">
                    <Image src="/assets/template/03/scene4/background.png" alt="Bg" className="w-full h-full object-cover mix-blend-multiply opacity-20" width={400} height={800} />
                </div>

                <div className="relative z-10 w-full h-[88vh] flex items-center justify-center">
                    <Image src="/assets/template/03/scene5/foregroundcanvas.png" alt="Canvas" className="absolute inset-0 w-full h-full object-fill drop-shadow-xl" width={360} height={700} />

                    {/* Bottom Decorations */}
                    <div className="absolute bottom-6 inset-x-4 h-24 pointer-events-none">
                        <Image src="/assets/template/03/scene5/bottomrack.png" alt="Rack" className="absolute bottom-0 w-full object-contain" width={320} height={80} />
                        <Image src="/assets/template/03/scene5/floralpot.png" alt="Pot" className="absolute bottom-2 left-2 w-16 object-contain" width={64} height={64} />
                        <Image src="/assets/template/03/scene5/floralpot2.png" alt="Pot" className="absolute bottom-2 right-2 w-16 object-contain" width={64} height={64} />
                        <Image src="/assets/template/03/scene5/left diya.png" alt="Diya" className="absolute bottom-4 left-16 w-8 object-contain" width={32} height={32} />
                        <Image src="/assets/template/03/scene5/rightdiya.png" alt="Diya" className="absolute bottom-4 right-16 w-8 object-contain" width={32} height={32} />
                    </div>

                    <div ref={scene5ContentRef} className="relative z-20 w-full h-full">
                        {eventsList.map((evt, idx) => (
                            <div key={idx} className="absolute inset-0 w-full h-full flex flex-col items-center pt-20 px-8 text-center">
                                <div className="w-16 h-16 mt-5 mb-4 flex items-center justify-center">
                                    <Image src={`/assets/template/03/scene4/${evt.icon}`} alt="Icon" className="w-30 h-30 object-contain" width={40} height={40} />
                                </div>

                                <p className="text-[8px] font-sans tracking-[0.2em] uppercase text-[#8A7350] mb-1 font-semibold">The</p>
                                <h2 className="text-2xl font-serif text-[#4A3B2C] mb-6 uppercase tracking-wider">{evt.name}</h2>

                                <p className="text-[10px] font-sans font-bold tracking-[0.15em] text-[#8A7350] uppercase mb-1">{evt.date.split(' • ')[0]}</p>
                                <p className="text-[8px] font-sans tracking-widest text-[#4A3B2C] uppercase opacity-80 mb-6">{evt.date.split(' • ')[1] || '11:00 AM'} ONWARDS</p>

                                <div className="w-4 h-4 mb-4">
                                    <Image src="/assets/template/03/scene7/icon.png" alt="Pin" className="w-full h-full object-contain" width={16} height={16} />
                                </div>
                                <p className="text-[9px] font-sans tracking-widest uppercase text-[#4A3B2C] font-semibold mb-1">{evt.venue.split(',')[0] || evt.venue}</p>
                                <p className="text-[8px] font-sans tracking-widest uppercase text-[#4A3B2C] opacity-80 mb-6">{evt.venue.split(',').slice(1).join(',') || ''}</p>

                                <p className="text-[9px] font-sans tracking-widest uppercase text-[#8A7350] font-semibold mb-1">Dress Code</p>
                                <p className="text-[9px] font-sans text-[#4A3B2C] opacity-90 mb-8">{evt.dress}</p>

                                <div className="w-16 mb-4">
                                    <Image src="/assets/template/03/scene3/seprator.png" alt="Separator" className="w-full object-contain" width={64} height={20} />
                                </div>

                                <p className="text-[10px] font-serif italic text-[#4A3B2C] opacity-90 max-w-[200px]">
                                    {evt.quote}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* === SCENE 6: Meet the Couple (Pinned Gallery) === */}
            <div ref={scene6ContainerRef} className="max-w-md mx-auto w-full h-dvh relative overflow-hidden bg-[#F4F0EA] flex flex-col items-center pt-20 pb-10">
                <div className="absolute inset-0 z-0">
                    <Image src="/assets/template/03/scene6/background.png" alt="Bg" className="w-full h-full object-cover mix-blend-multiply opacity-50" width={400} height={800} />
                </div>

                <div className="absolute bottom-0 inset-x-0 z-10 pointer-events-none">
                    <Image src="/assets/template/03/scene6/desk.png" alt="Desk" className="w-full object-contain object-bottom" width={400} height={200} />
                </div>

                <Image ref={s6FloralLeftRef} src="/assets/template/03/scene6/leftfloral.png" alt="Floral" className="absolute top-0 left-0 w-32 object-contain z-10" width={128} height={128} />
                <Image ref={s6FloralRightRef} src="/assets/template/03/scene6/rightfloral.png" alt="Floral" className="absolute top-0 right-0 w-32 object-contain z-10" width={128} height={128} />

                <div className="relative z-20 flex flex-col items-center w-full px-6 text-center h-full">
                    <p className="text-[9px] font-sans tracking-[0.2em] text-[#8A7350] uppercase font-semibold mb-1">Meet The</p>
                    <h1 className="text-4xl font-serif text-[#4A3B2C] mb-8">Couple</h1>

                    <div ref={coupleImgRef} className="w-[85%] aspect-[3/4] max-h-[50vh] bg-[#E5DCC5] rounded-t-full border-4 border-white shadow-xl overflow-hidden mb-6 relative">
                        {galleryPhotos.map((src, idx) => (
                            <Image key={idx} src={src} alt={`Gallery ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" width={300} height={400} />
                        ))}
                    </div>

                    <h2 className="text-2xl font-serif text-[#4A3B2C] mb-2 mt-auto">{firstName} &amp; {secondName}</h2>
                    <p className="text-[10px] font-sans leading-relaxed text-[#4A3B2C] opacity-80 max-w-[260px] mb-12">
                        {storyText}
                    </p>
                </div>
            </div>

            {/* === SCENE 7: RSVP === */}
            <div ref={scene7ContainerRef} className="max-w-md mx-auto w-full min-h-dvh relative overflow-hidden bg-[#F4F0EA] flex flex-col items-center pt-24 pb-0 text-center">
                <div className="absolute inset-0 z-0">
                    <Image src="/assets/template/03/scene7/background.png" alt="Bg" className="w-full h-full object-cover opacity-60" width={400} height={800} />
                </div>

                <div className="absolute inset-0 z-10 pointer-events-none">
                    <Image src="/assets/template/03/scene7/entrance.png" alt="Arch" className="w-full h-full object-contain" width={400} height={800} />
                </div>

                <div className="absolute bottom-0 inset-x-0 z-10 pointer-events-none">
                    <Image src="/assets/template/03/scene7/stairs.png" alt="Stairs" className="w-full object-contain" width={400} height={200} />
                    <Image src="/assets/template/03/scene7/floralpot.png" alt="Pot" className="absolute bottom-4 left-4 w-20 object-contain" width={80} height={80} />
                    <Image src="/assets/template/03/scene7/floralpot2.png" alt="Pot" className="absolute bottom-6 right-4 w-20 object-contain" width={80} height={80} />
                    <Image src="/assets/template/03/scene7/diya.png" alt="Diya" className="absolute bottom-8 left-20 w-8 object-contain" width={32} height={32} />
                    <Image src="/assets/template/03/scene7/diya.png" alt="Diya" className="absolute bottom-8 right-20 w-8 object-contain" width={32} height={32} />
                </div>

                <div className="relative z-20 flex flex-col items-center mt-4 px-8 w-full">
                    <div className="w-22 h-22 mb-6">
                        <Image src="/assets/template/03/scene7/icon.png" alt="Icon" className="w-full h-full object-contain" width={48} height={48} />
                    </div>

                    <p className="text-[11px] font-sans tracking-widest text-[#4A3B2C] uppercase leading-relaxed font-semibold mb-10">
                        We would be honoured<br />
                        to celebrate this<br />
                        special day with you.
                    </p>

                    <p className="text-[9px] font-sans tracking-widest text-[#8A7350] uppercase mb-2">With love & gratitude,</p>
                    <p className="text-sm font-serif text-[#4A3B2C] font-semibold mb-12">{rsvpFamilies}</p>

                    <a
                        href={`https://wa.me/${whatsappNumber}?text=Hello!%20I%20would%20love%20to%20attend%20the%20wedding%20of%20${firstName}%20%26%20${secondName}!`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 border border-[#8A7350] bg-[#8A7350]/10 text-[#8A7350] rounded-full font-sans tracking-widest text-[10px] font-bold hover:bg-[#8A7350] hover:text-white transition-all shadow-md mb-8"
                    >
                        RSVP ON WHATSAPP
                    </a>

                    <p className="text-[8px] font-sans tracking-[0.1em] text-[#4A3B2C] uppercase opacity-80 mb-1">Kindly respond by</p>
                    <p className="text-[9px] font-sans font-bold tracking-[0.1em] text-[#8A7350] uppercase">{rsvpDeadline}</p>

                    <div className="w-12 mt-6 mb-24">
                        <Image src="/assets/template/03/scene3/seprator.png" alt="Separator" className="w-full object-contain" width={48} height={16} />
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
}
