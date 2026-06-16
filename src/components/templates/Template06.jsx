"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Music2, Pause } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import Image from 'next/image';

// ─── Register GSAP plugins ────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    // KEY FIX: prevents mobile browser address-bar resize from
    // triggering ScrollTrigger recalculations → eliminates flicker
    ScrollTrigger.config({ ignoreMobileResize: true });
}

// ─── Asset base paths ─────────────────────────────────────────────────────────
const B = '/assets/template/06';
const S1 = `${B}/Scene 1 `;   // note trailing space
const S2 = `${B}/Scene 2`;
const S3 = `${B}/Scene 3`;
const S4 = `${B}/scene 4`;
const S5 = `${B}/scene 5`;
const S6 = `${B}/scene 6`;
const S7 = `${B}/scene 7`;

const defaultEvts = [
    { title: "MEHENDI CEREMONY", label: "MEHENDI", date: "15 MARCH 2027", time: "MONDAY · 10:00 AM ONWARDS", venue: "THE POOLSIDE PAVILION", venueSub: "GULAB BAGH PALACE, UDAIPUR", dress: "Vibrant & Floral", quote: "Henna hands, happy hearts, and a courtyard full of color.", icon: `${B}/scene 4/mehendi icon.png`, detailedIcon: `${B}/scene 4/mehendi icon.png`, iw: 60, ih: 71 },
    { title: "HALDI CEREMONY", label: "HALDI", date: "16 MARCH 2027", time: "TUESDAY · 10:30 AM ONWARDS", venue: "THE COURTYARD LAWN", venueSub: "GULAB BAGH PALACE, UDAIPUR", dress: "Shades of Yellow", quote: "Drenched in yellow, showered with love.", icon: `${B}/scene 5/haldi1 icon.png`, detailedIcon: `${B}/scene 5/haldi1 icon.png`, iw: 60, ih: 61 },
    { title: "SANGEET NIGHT", label: "SANGEET", date: "17 MARCH 2027", time: "WEDNESDAY · 7:00 PM ONWARDS", venue: "THE PALACE BALLROOM", venueSub: "GULAB BAGH PALACE, UDAIPUR", dress: "Royal Indo-Western", quote: "A night of dance, music, and glittering celebration.", icon: `${B}/scene 5/sangeet icon.png`, detailedIcon: `${B}/scene 5/sangeet icon.png`, iw: 60, ih: 70 },
    { title: "WEDDING CEREMONY", label: "WEDDING", date: "18 MARCH 2027", time: "THURSDAY · 4:30 PM ONWARDS", venue: "GULAB BAGH PALACE GARDENS", venueSub: "UDAIPUR, RAJASTHAN", dress: "Pastel Elegance", quote: "Witness sacred vows in a garden blooming with love.", icon: `${B}/scene 5/wedding icon.png`, detailedIcon: `${B}/scene 5/wedding icon.png`, iw: 60, ih: 72 },
    { title: "WEDDING RECEPTION", label: "RECEPTION", date: "18 MARCH 2027", time: "THURSDAY · 8:00 PM ONWARDS", venue: "THE MEWAR BANQUET LAWNS", venueSub: "GULAB BAGH PALACE, UDAIPUR", dress: "Gowns & Tuxedos", quote: "Raise a toast to a lifetime of love and laughter.", icon: `${B}/scene 5/reception icon.png`, detailedIcon: `${B}/scene 5/reception icon.png`, iw: 60, ih: 75 }
];

export default function Template06({ formData = {}, template = {}, embedded = false, fullscreen = false }) {
    const brideName = (formData?.bride || "Radhika").trim();
    const groomName = (formData?.groom || "Kabir").trim();
    const reverseOrder = formData?.nameOrder === "groomFirst";
    const firstName = reverseOrder ? groomName : brideName;
    const secondName = reverseOrder ? brideName : groomName;
    const coupleNames = `${firstName} & ${secondName}`;

    const displayDate = formData?.date
        ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(formData.date))
        : "18 MARCH 2027";
    const displayDateShort = formData?.date
        ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(formData.date))
        : "18 MAR 2027";

    const venue = formData?.venue || "Gulab Bagh Palace Gardens, Udaipur";
    const whatsappNumber = formData?.whatsapp || "919999999999";
    const storyText = formData?.story || "Two hearts, one journey, countless dreams. Together we celebrate love, laughter and a lifetime of togetherness.";
    const blessingText = formData?.blessing || "May Lord Ganesha bless this union with joy, grace and endless love. May your hearts be gentle, your journey be beautiful, and your togetherness be a source of light.";

    const rsvpFamilies = (formData?.brideFather || formData?.groomFather)
        ? `The ${formData.brideFather ? formData.brideFather.split(" ").slice(-1)[0] : ""} & ${formData.groomFather ? formData.groomFather.split(" ").slice(-1)[0] : ""} Families`
        : "The Bansal & Rao Families";

    const brideFatherLine = (formData?.brideFather || formData?.brideMother)
        ? `D/O ${formData.brideFather ? `MR. ${formData.brideFather.toUpperCase()}` : ''} ${formData.brideFather && formData.brideMother ? '&' : ''} ${formData.brideMother ? `MRS. ${formData.brideMother.toUpperCase()}` : ''}`
        : "D/O MR. SURESH BANSAL & MRS. NEETA BANSAL";
    
    const groomFatherLine = (formData?.groomFather || formData?.groomMother)
        ? `S/O ${formData.groomFather ? `MR. ${formData.groomFather.toUpperCase()}` : ''} ${formData.groomFather && formData.groomMother ? '&' : ''} ${formData.groomMother ? `MRS. ${formData.groomMother.toUpperCase()}` : ''}`
        : "S/O MR. ANIL RAO & MRS. POORNIMA RAO";

    const getEventIcon = (name) => {
        const lower = name.toLowerCase();
        if (lower.includes('mehendi')) return { icon: `${S4}/mehendi icon.png`, detailedIcon: `${B}/scene 4/mehendi icon.png`, iw: 60, ih: 71 };
        if (lower.includes('haldi')) return { icon: `${S4}/haldi icon.png`, detailedIcon: `${B}/scene 5/haldi1 icon.png`, iw: 60, ih: 61 };
        if (lower.includes('sangeet')) return { icon: `${S4}/sangeet icon.png`, detailedIcon: `${B}/scene 5/sangeet icon.png`, iw: 60, ih: 70 };
        if (lower.includes('wedding') || lower.includes('shaadi') || lower.includes('marriage') || lower.includes('pheras')) return { icon: `${S4}/wedding icon.png`, detailedIcon: `${B}/scene 5/wedding icon.png`, iw: 60, ih: 72 };
        if (lower.includes('reception')) return { icon: `${S4}/reception icon.png`, detailedIcon: `${B}/scene 5/reception icon.png`, iw: 60, ih: 75 };
        return { icon: `${S4}/wedding icon.png`, detailedIcon: `${B}/scene 5/wedding icon.png`, iw: 60, ih: 72 };
    };

    const eventsList = Array.isArray(formData?.selectedEvents) && formData.selectedEvents.length > 0
        ? formData.selectedEvents.map((ev, i) => {
            const detail = formData.eventDetails?.[ev] || {};
            const icons = getEventIcon(ev);
            return {
                label: ev.toUpperCase(),
                title: ev.toUpperCase(),
                date: detail.date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(detail.date)).toUpperCase() : displayDateShort.toUpperCase(),
                fullDate: detail.date ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(detail.date)).toUpperCase() : displayDate.toUpperCase(),
                time: detail.time ? detail.time.toUpperCase() : "10:00 AM ONWARDS",
                venue: (detail.venue || venue).toUpperCase(),
                venueSub: detail.venueSub || "VENUE DETAILS AS PER CARD",
                dress: detail.dressCode || "Royal Indo-Western",
                quote: detail.oneLiner || "Join us in celebrating this beautiful moment.",
                icon: icons.icon,
                detailedIcon: icons.detailedIcon,
                iw: icons.iw,
                ih: icons.ih
            };
        })
        : defaultEvts;

    const defaultCouplePhotos = [
        '/assets/couples/indian-couples1.jpg',
        '/assets/couples/indian-couples2.jpg',
        '/assets/couples/indian-couples3.jpg'
    ];

    const couplePhotos = Array.isArray(formData?.galleryImages) && formData.galleryImages.filter(Boolean).length > 0
        ? formData.galleryImages.filter(Boolean)
        : defaultCouplePhotos;

    const wrapRef = useRef(null);
    const audioStartedRef = useRef(false);
    const { isPlaying, toggleAudio, playAudio, audioNode } =
        useAudio(formData?.musicLink || `${B}/kesariya-rang.mp3`);

    // ── Audio: fire on first scroll/touch interaction ─────────────────
    const startAudio = useCallback(() => {
        if (audioStartedRef.current || isPlaying) return;
        audioStartedRef.current = true;
        const p = playAudio();
        if (p?.catch) p.catch(() => { audioStartedRef.current = false; });
    }, [playAudio, isPlaying]);

    useEffect(() => {
        const handle = () => { if (!isPlaying) startAudio(); };
        const evts = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'scroll'];
        if (!isPlaying)
            evts.forEach(e => window.addEventListener(e, handle, { passive: true }));
        return () => evts.forEach(e => window.removeEventListener(e, handle));
    }, [startAudio, isPlaying]);

    // ── ScrollTrigger refresh after initial render ────────────────────────
    useEffect(() => {
        const t = setTimeout(() => ScrollTrigger.refresh(), 500);
        return () => clearTimeout(t);
    }, []);

    const scrollerTarget = embedded
        ? "#preview-scroller-container"
        : window;

    // ═══════════════════════════════════════════════════════════════════
    //  REFS
    // ═══════════════════════════════════════════════════════════════════

    // Scene 1
    const s1Ref = useRef(null);
    const s1BgRef = useRef(null);
    const s1ArcRef = useRef(null);
    const s1UpFlwRef = useRef(null);
    const s1BelBgRef = useRef(null);
    const s1FlwLRef = useRef(null);
    const s1FlwRRef = useRef(null);
    const s1PeaLRef = useRef(null);
    const s1PeaRRef = useRef(null);
    const s1DivRef = useRef(null);
    const s1TxtRef = useRef(null);
    const s1ScrRef = useRef(null);

    // Scene 2
    const s2Ref = useRef(null);
    const s2CirRef = useRef(null);
    const s2GanRef = useRef(null);
    const s2LotRef = useRef(null);
    const s2FlwLRef = useRef(null);
    const s2FlwRRef = useRef(null);
    const s2BgLRef = useRef(null);
    const s2BgRRef = useRef(null);
    const s2TxtRef = useRef(null);

    // Scene 3
    const s3Ref = useRef(null);
    const s3FrmRef = useRef(null);
    const s3FlwLRef = useRef(null);
    const s3FlwRRef = useRef(null);
    const s3TxtRef = useRef(null);

    // Scene 4
    const s4Ref = useRef(null);
    const s4TxtRef = useRef(null);
    const s4FlwLRef = useRef(null);
    const s4FlwRRef = useRef(null);

    // Scene 5
    const s5Ref = useRef(null);
    const s5FrmRef = useRef(null);
    const s5PanRef = useRef(null);
    const s5FlwLRef = useRef(null);
    const s5FlwRRef = useRef(null);
    const s5DiyLRef = useRef(null);
    const s5DiyRRef = useRef(null);
    const s5TxtRef = useRef(null);

    // Scene 6
    const s6Ref = useRef(null);
    const s6BoxRef = useRef(null);
    const s6FlwLRef = useRef(null);
    const s6FlwRRef = useRef(null);
    const s6TxtRef = useRef(null);

    // Scene 7
    const s7Ref = useRef(null);
    const s7PeaLRef = useRef(null);
    const s7PeaRRef = useRef(null);
    const s7LtLRef = useRef(null);
    const s7LtRRef = useRef(null);
    const s7DiyLRef = useRef(null);
    const s7DiyRRef = useRef(null);
    const s7TxtRef = useRef(null);

    // ═══════════════════════════════════════════════════════════════════
    //  ANIMATIONS
    // ═══════════════════════════════════════════════════════════════════
    useGSAP(() => {
        const scrollerTarget = embedded
            ? '#preview-scroller-container'
            : window;

        // ── SCENE 1: entrance ─────────────────────────────────────────
        const tl1 = gsap.timeline();
        tl1
            .from(s1BgRef.current, { opacity: 0, duration: 1 }, 0)
            .from(s1ArcRef.current, { y: -60, opacity: 0, duration: 1.2, ease: 'power3.out' }, 0.1)
            .from(s1UpFlwRef.current, { y: -40, opacity: 0, duration: 1, ease: 'power2.out' }, 0.2)
            .from(s1BelBgRef.current, { y: 60, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.2)
            .from(s1FlwLRef.current, { x: -70, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.4)
            .from(s1FlwRRef.current, { x: 70, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0.4)
            .from(s1PeaLRef.current, { x: -50, y: 20, opacity: 0, duration: 1.3, ease: 'back.out(1.3)' }, 0.6)
            .from(s1PeaRRef.current, { x: 50, y: 20, opacity: 0, duration: 1.3, ease: 'back.out(1.3)' }, 0.6)
            .from(s1DivRef.current, { scaleX: 0, opacity: 0, duration: 0.8, ease: 'power2.out' }, 1)
            .from(s1ScrRef.current, { opacity: 0, y: 10, duration: 0.8 }, 1.3);

        // Text children start hidden
        gsap.set(s1TxtRef.current.children, { opacity: 0, y: 20 });

        // Idle: peacocks gently bob
        gsap.to(s1PeaLRef.current, { y: '-=6', duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(s1PeaRRef.current, { y: '-=6', duration: 3.1, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.4 });
        // Idle: floral sway
        gsap.to(s1FlwLRef.current, { rotation: 1.5, transformOrigin: 'bottom center', duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(s1FlwRRef.current, { rotation: -1.5, transformOrigin: 'bottom center', duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });

        // Scene 1 scroll-pin: reveal text → exit everything
        const sc1 = gsap.timeline({
            scrollTrigger: {
                trigger: s1Ref.current,
                start: 'top top',
                end: '+=100%',
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
                scroller: scrollerTarget,
            }
        });
        sc1
            .to(s1ScrRef.current, { opacity: 0, y: -15, duration: 0.2 }, 0)
            .to(s1TxtRef.current.children, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.05)
            // Exit: using fromTo to handle reverse scroll correctly
            .fromTo(s1TxtRef.current, { y: 0, opacity: 1 }, { y: -60, opacity: 0, duration: 1 }, 1.5)
            .fromTo(s1ArcRef.current, { y: 0, opacity: 1 }, { y: -80, opacity: 0, duration: 1 }, 1.5)
            .fromTo(s1UpFlwRef.current, { y: 0, opacity: 1 }, { y: -50, opacity: 0, duration: 1 }, 1.6)
            .fromTo(s1PeaLRef.current, { x: 0, opacity: 1 }, { x: -70, opacity: 0, duration: 1 }, 1.6)
            .fromTo(s1PeaRRef.current, { x: 0, opacity: 1 }, { x: 70, opacity: 0, duration: 1 }, 1.6)
            .fromTo(s1FlwLRef.current, { x: 0, opacity: 1 }, { x: -60, opacity: 0, duration: 1 }, 1.7)
            .fromTo(s1FlwRRef.current, { x: 0, opacity: 1 }, { x: 60, opacity: 0, duration: 1 }, 1.7)
            .fromTo(s1BelBgRef.current, { y: 0, opacity: 1 }, { y: 60, opacity: 0, duration: 1 }, 1.8);

        // ── SCENE 2: Ganesh blessings ─────────────────────────────────
        const s2ST = { trigger: s2Ref.current, start: 'top 65%', toggleActions: 'play none none reverse', scroller: scrollerTarget };
        gsap.fromTo(s2CirRef.current, { scale: 0, rotation: -120, opacity: 0 }, { scrollTrigger: s2ST, scale: 1, rotation: 0, opacity: 1, duration: 1.4, ease: 'back.out(1.3)' });
        gsap.fromTo(s2GanRef.current, { scale: 0.6, opacity: 0 }, { scrollTrigger: { ...s2ST, start: 'top 58%' }, scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.25 });
        gsap.fromTo(s2LotRef.current, { y: 30, opacity: 0, scale: 0.85 }, { scrollTrigger: { ...s2ST, start: 'top 52%' }, y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power2.out', delay: 0.4 });
        gsap.fromTo(s2FlwLRef.current, { x: -50, opacity: 0 }, { scrollTrigger: s2ST, x: 0, opacity: 1, duration: 1.1, ease: 'power2.out' });
        gsap.fromTo(s2FlwRRef.current, { x: 50, opacity: 0 }, { scrollTrigger: s2ST, x: 0, opacity: 1, duration: 1.1, ease: 'power2.out' });
        gsap.fromTo(s2TxtRef.current.children, { y: 20, opacity: 0 }, { scrollTrigger: { ...s2ST, start: 'top 50%' }, y: 0, opacity: 1, duration: 0.9, stagger: 0.14, ease: 'power2.out', delay: 0.3 });

        // BG floral parallax
        gsap.to(s2BgLRef.current, { scrollTrigger: { trigger: s2Ref.current, start: 'top bottom', end: 'bottom top', scrub: 1, scroller: scrollerTarget }, y: -25, ease: 'none' });
        gsap.to(s2BgRRef.current, { scrollTrigger: { trigger: s2Ref.current, start: 'top bottom', end: 'bottom top', scrub: 1, scroller: scrollerTarget }, y: -25, ease: 'none' });

        // Idle: Ganesh glow pulse + lotus float
        gsap.to(s2GanRef.current, { filter: 'brightness(1.12)', duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(s2LotRef.current, { y: '-=7', duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });

        // ── SCENE 3: Invitation card ──────────────────────────────────
        const s3ST = { trigger: s3Ref.current, start: 'top 72%', toggleActions: 'play none none reverse', scroller: scrollerTarget };
        gsap.fromTo(s3FrmRef.current, { y: 70, opacity: 0, scale: 0.94 }, { scrollTrigger: s3ST, y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' });
        gsap.fromTo(s3FlwLRef.current, { x: -45, opacity: 0 }, { scrollTrigger: { ...s3ST, start: 'top 65%' }, x: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.3 });
        gsap.fromTo(s3FlwRRef.current, { x: 45, opacity: 0 }, { scrollTrigger: { ...s3ST, start: 'top 65%' }, x: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.3 });
        gsap.fromTo(s3TxtRef.current.children, { y: 18, opacity: 0 }, { scrollTrigger: { ...s3ST, start: 'top 55%' }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.5 });

        // Idle sway
        gsap.to(s3FlwLRef.current, { rotation: 2, transformOrigin: 'bottom center', duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(s3FlwRRef.current, { rotation: -2, transformOrigin: 'bottom center', duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });

        // ── SCENE 4: Wedding celebrations list ────────────────────────
        const s4ST = { trigger: s4Ref.current, start: 'top 70%', toggleActions: 'play none none reverse', scroller: scrollerTarget };
        gsap.fromTo(s4FlwLRef.current, { x: -45, opacity: 0 }, { scrollTrigger: s4ST, x: 0, opacity: 1, duration: 1, ease: 'power2.out' });
        gsap.fromTo(s4FlwRRef.current, { x: 45, opacity: 0 }, { scrollTrigger: s4ST, x: 0, opacity: 1, duration: 1, ease: 'power2.out' });
        gsap.fromTo(s4TxtRef.current.children, { y: 25, opacity: 0 }, { scrollTrigger: { ...s4ST, start: 'top 65%' }, y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power2.out' });

        // 3-Phase Entry/Exit card-style scrub animation (Template04 style)
        const evRows = s4Ref.current?.querySelectorAll('.t06-ev-row') ?? [];
        evRows.forEach(row => {
            const inner = row.querySelector('.t06-ev-card-inner');
            if (!inner) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: row,
                    start: 'top 95%',
                    end: 'bottom 15%',
                    scrub: 1,
                    scroller: scrollerTarget,
                }
            });
            tl.fromTo(inner,
                { y: 70, opacity: 0, scale: 0.85, rotationX: -12 },
                { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.3, ease: 'power2.out' }
            )
                .to(inner, { y: 0, duration: 0.4 }) // hold in middle
                .to(inner,
                    { y: -70, opacity: 0, scale: 0.85, rotationX: 12, duration: 0.3, ease: 'power2.in' }
                );
        });

        gsap.to(s4FlwLRef.current, { rotation: 2.5, transformOrigin: 'bottom left', duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(s4FlwRRef.current, { rotation: -2.5, transformOrigin: 'bottom right', duration: 3.7, yoyo: true, repeat: -1, ease: 'sine.inOut' });

        // ── SCENE 5: Wedding ceremony (pinned slideshow) ──────────────
        const s5ST = { trigger: s5Ref.current, start: 'top 70%', toggleActions: 'play none none reverse', scroller: scrollerTarget };
        gsap.fromTo(s5FrmRef.current, { y: 50, opacity: 0, scale: 0.95 }, { scrollTrigger: s5ST, y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' });
        gsap.fromTo(s5PanRef.current, { rotation: -18, scale: 0.7, opacity: 0 }, { scrollTrigger: { ...s5ST, start: 'top 62%' }, rotation: 0, scale: 1, opacity: 1, duration: 1.3, ease: 'back.out(1.5)' });
        gsap.fromTo(s5FlwLRef.current, { x: -55, opacity: 0 }, { scrollTrigger: s5ST, x: 0, opacity: 1, duration: 1.2, ease: 'power2.out' });
        gsap.fromTo(s5FlwRRef.current, { x: 55, opacity: 0 }, { scrollTrigger: s5ST, x: 0, opacity: 1, duration: 1.2, ease: 'power2.out' });

        const slides = s5Ref.current?.querySelectorAll('.t06-ev-slide') ?? [];
        const bgSlides = s5Ref.current?.querySelectorAll('.t06-ev-bg-slide') ?? [];
        if (slides.length > 0) {
            const sc5 = gsap.timeline({
                scrollTrigger: {
                    trigger: s5Ref.current,
                    start: 'top top',
                    end: `+=${slides.length * 100}%`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    scroller: scrollerTarget,
                }
            });

            slides.forEach((slide, idx) => {
                if (idx > 0) {
                    gsap.set(slide, { opacity: 0, y: 30, scale: 0.95 });
                }
            });

            bgSlides.forEach((slide, idx) => {
                if (idx > 0) {
                    gsap.set(slide, { opacity: 0, scale: 1.05 });
                }
            });

            slides.forEach((slide, idx) => {
                const bgSlide = bgSlides[idx];
                // Transition in
                if (idx > 0) {
                    sc5.to(slide, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power2.out'
                    }, idx * 2);

                    if (bgSlide) {
                        sc5.to(bgSlide, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.8,
                            ease: 'power2.out'
                        }, idx * 2);
                    }
                }

                // Transition out
                if (idx < slides.length - 1) {
                    sc5.to(slide, {
                        opacity: 0,
                        y: -30,
                        scale: 0.95,
                        duration: 0.8,
                        ease: 'power2.in'
                    }, idx * 2 + 1.2);

                    if (bgSlide) {
                        sc5.to(bgSlide, {
                            opacity: 0,
                            scale: 1.05,
                            duration: 0.8,
                            ease: 'power2.in'
                        }, idx * 2 + 1.2);
                    }
                }
            });
        }

        // Peacock feather idle rotation
        gsap.to(s5PanRef.current, { rotation: 3, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.2 });
        gsap.to(s5FlwLRef.current, { rotation: 2, transformOrigin: 'bottom center', duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(s5FlwRRef.current, { rotation: -2, transformOrigin: 'bottom center', duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });

        // ── SCENE 6: Meet the couple (pinned gallery slideshow) ───────
        const s6ST = { trigger: s6Ref.current, start: 'top 72%', toggleActions: 'play none none reverse', scroller: scrollerTarget };
        gsap.fromTo(s6BoxRef.current, { y: 55, opacity: 0, scale: 0.94 }, { scrollTrigger: s6ST, y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' });
        gsap.fromTo(s6FlwLRef.current, { x: -40, opacity: 0 }, { scrollTrigger: { ...s6ST, start: 'top 65%' }, x: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.25 });
        gsap.fromTo(s6FlwRRef.current, { x: 40, opacity: 0 }, { scrollTrigger: { ...s6ST, start: 'top 65%' }, x: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.25 });
        gsap.fromTo(s6TxtRef.current.children, { y: 20, opacity: 0 }, { scrollTrigger: { ...s6ST, start: 'top 60%' }, y: 0, opacity: 1, duration: 0.85, stagger: 0.12, ease: 'power2.out', delay: 0.4 });

        const couplePhotosList = s6Ref.current?.querySelectorAll('.t06-couple-photo') ?? [];
        const thumbsList = s6Ref.current?.querySelectorAll('.t06-thumb-active') ?? [];
        if (couplePhotosList.length > 0) {
            const sc6 = gsap.timeline({
                scrollTrigger: {
                    trigger: s6Ref.current,
                    start: 'top top',
                    end: `+=${couplePhotosList.length * 80}%`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    scroller: scrollerTarget,
                }
            });

            couplePhotosList.forEach((photo, idx) => {
                if (idx > 0) {
                    gsap.set(photo, { opacity: 0, scale: 1.05 });
                }
            });

            couplePhotosList.forEach((photo, idx) => {
                // Transition active photo in (skip first)
                if (idx > 0) {
                    sc6.to(photo, {
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: 'power2.out'
                    }, idx * 1.5 - 0.2);

                    // Highlight active thumbnail
                    sc6.to(thumbsList[idx], {
                        opacity: 1,
                        duration: 0.3
                    }, idx * 1.5 - 0.2);

                    // Un-highlight previous thumbnail
                    sc6.to(thumbsList[idx - 1], {
                        opacity: 0,
                        duration: 0.3
                    }, idx * 1.5 - 0.2);
                }

                // Transition active photo out (skip last)
                if (idx < couplePhotosList.length - 1) {
                    sc6.to(photo, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 1,
                        ease: 'power2.in'
                    }, idx * 1.5 + 0.8);
                }
            });
        }

        gsap.to(s6FlwLRef.current, { rotation: 1.8, transformOrigin: 'bottom left', duration: 4.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(s6FlwRRef.current, { rotation: -1.8, transformOrigin: 'bottom right', duration: 3.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });

        // ── SCENE 7: RSVP ─────────────────────────────────────────────
        const s7ST = { trigger: s7Ref.current, start: 'top 68%', toggleActions: 'play none none reverse', scroller: scrollerTarget };
        gsap.fromTo(s7LtLRef.current, { y: -35, opacity: 0 }, { scrollTrigger: { ...s7ST, start: 'top 72%' }, y: 0, opacity: 1, duration: 1, ease: 'power2.out' });
        gsap.fromTo(s7LtRRef.current, { y: -35, opacity: 0 }, { scrollTrigger: { ...s7ST, start: 'top 72%' }, y: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.15 });
        gsap.fromTo(s7PeaLRef.current, { x: -60, opacity: 0 }, { scrollTrigger: s7ST, x: 0, opacity: 1, duration: 1.3, ease: 'back.out(1.2)' });
        gsap.fromTo(s7PeaRRef.current, { x: 60, opacity: 0 }, { scrollTrigger: s7ST, x: 0, opacity: 1, duration: 1.3, ease: 'back.out(1.2)' });
        gsap.fromTo(s7TxtRef.current.children, { y: 25, opacity: 0 }, { scrollTrigger: { ...s7ST, start: 'top 60%' }, y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power2.out', delay: 0.3 });

        // Idle: peacock bob
        gsap.to(s7PeaLRef.current, { y: '-=8', duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(s7PeaRRef.current, { y: '-=8', duration: 2.9, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.5 });
        // Hanging lights swing
        gsap.to(s7LtLRef.current, { rotation: 3, transformOrigin: 'top center', duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(s7LtRRef.current, { rotation: -3, transformOrigin: 'top center', duration: 4.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    }, { scope: wrapRef });

    // ═══════════════════════════════════════════════════════════════════
    //  JSX – colours: ivory #faf5eb | deep brown #4a2c0a | rose-gold #c8956c
    // ═══════════════════════════════════════════════════════════════════
    return (
        <div ref={wrapRef} className="w-full bg-[#faf5eb]">
            {audioNode}

            {/* ── Music toggle ── */}
            <button
                onClick={toggleAudio}
                className="fixed bottom-6 right-6 z-999 size-11 rounded-full border border-[#c8956c]/60 bg-[#faf5eb]/85 text-[#c8956c] shadow-[0_4px_20px_rgba(74,44,10,0.2)] backdrop-blur-sm flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Toggle music"
            >
                {isPlaying ? <Pause size={16} /> : <Music2 size={16} />}
            </button>

            {/* ════════════════════════════════════════════════════════
                SCENE 1 — Hero Cover
                Assets: Background.png (full BG), arc.png (arch frame),
                Upper Flower.png (top floral garland), below bg .png (garden strip),
                floral side left/right.png (tall side florals),
                peakock left/right.png (peacocks at bottom),
                divider.png (ornamental divider between names & date)
            ════════════════════════════════════════════════════════ */}
            <div
                ref={s1Ref}
                className="max-w-[430px] mx-auto w-full h-dvh relative overflow-hidden"
                style={{ background: '#faf5eb' }}
            >
                {/* Full background texture */}
                <div ref={s1BgRef} className="absolute inset-0 z-0">
                    <Image src={`${B}/Background.png`} alt="" fill
                        sizes="(max-width: 430px) 100vw, 430px"
                        className="object-cover" priority />
                </div>

                {/* Garden / below-bg strip at bottom — raised z-index to z-[11] so it sits in front of peacock tails and columns */}
                <div ref={s1BelBgRef} className="absolute bottom-0 inset-x-0 z-2">
                    {/* aspect: 1679×1184 → width full, height auto ≈ 43% of width */}
                    <Image src={`${S1}/below bg .png`} alt="" width={430} height={303}
                        className="w-full h-auto object-cover"
                        style={{ height: 'auto' }} />
                </div>

                {/* Arch container — uses the exact aspect ratio of the arch image (1179/2051) to keep the peacocks, florals, and text perfectly aligned to the pillars across all screen heights */}
                <div className="absolute top-0 left-0 w-full aspect-1179/2051 z-5 pointer-events-none">
                    {/* Arch / frame */}
                    {/* arc.png: 1179×2051 → portrait */}
                    <div ref={s1ArcRef} className="absolute inset-0 z-9 opacity-20 pointer-events-none">
                        <Image src={`${S1}/arc.png`} alt="" fill
                            sizes="(max-width: 430px) 100vw, 430px"
                            className="object-contain object-top" />
                    </div>

                    {/* Upper floral garland — top of screen */}
                    {/* Upper Flower.png: 1229×786 → landscape */}
                    <div ref={s1UpFlwRef} className="absolute top-0 opacity-70 inset-x-0 z-6 pointer-events-none">
                        <Image src={`${S1}/Upper Flower.png`} alt="" width={430} height={275}
                            className="w-full h-auto"
                            style={{ height: 'auto' }} />
                    </div>

                    {/* Floral side LEFT — tall vertical strip on left edge */}
                    {/* floral side left.png: 389×2676 → very tall, ~15% wide of screen */}
                    <div ref={s1FlwLRef}
                        className="absolute left-0 bottom-[8%] z-7 w-[38%] pointer-events-none opacity-60">
                        <Image src={`${S1}/floral side left.png`} alt="" width={160} height={1100}
                            className="w-full h-auto"
                            style={{ height: 'auto' }} />
                    </div>

                    {/* Floral side RIGHT */}
                    <div ref={s1FlwRRef}
                        className="absolute right-0 bottom-[8%] z-7 w-[38%] opacity-60 pointer-events-none">
                        <Image src={`${S1}/floral side right.png`} alt="" width={160} height={1100}
                            className="w-full h-auto"
                            style={{ height: 'auto' }} />
                    </div>

                    {/* Peacock LEFT — sits on top of the pedestal */}
                    {/* peakock left.png: 520×1504 → ~0.345 aspect ratio → tall narrow */}
                    <div ref={s1PeaLRef}
                        className="absolute -left-5 bottom-[-5%] z-15 w-[26%] pointer-events-none drop-shadow-[0_4px_12px_rgba(74,44,10,0.18)]">
                        <Image src={`${S1}/peakock left.png`} alt="Peacock" width={112} height={324}
                            className="w-full h-auto"
                            style={{ height: 'auto' }} />
                    </div>

                    {/* Peacock RIGHT */}
                    <div ref={s1PeaRRef}
                        className="absolute -right-5 bottom-[-5%] z-9 w-[26%] pointer-events-none drop-shadow-[0_4px_12px_rgba(74,44,10,0.18)]">
                        <Image src={`${S1}/peakock right.png`} alt="Peacock" width={112} height={324}
                            className="w-full h-auto"
                            style={{ height: 'auto' }} />
                    </div>

                    {/* Text — centred over arch opening inside the aspect container to maintain consistent positioning relative to the frame */}
                    <div className="absolute inset-0 z-15 flex flex-col items-center justify-center
                                    pointer-events-none pb-[26%] pt-[22%] px-6 text-center">
                        <div ref={s1TxtRef} className="flex flex-col items-center gap-0">
                            <p className="font-serif text-[10px] tracking-[0.14em] text-[#6b3a1f] mb-2.5 opacity-90 font-medium">
                                Together with their families
                            </p>
                            <h1 className="font-serif text-[56px] leading-[0.95] text-[#4a2c0a] drop-shadow-[0_2px_4px_rgba(74,44,10,0.12)] font-light">
                                {firstName}
                            </h1>
                            <p className="font-serif text-[19px] italic text-[#c8956c] font-semibold my-1.5">
                                weds
                            </p>
                            <h1 className="font-serif text-[56px] leading-[0.95] text-[#4a2c0a] drop-shadow-[0_2px_4px_rgba(74,44,10,0.12)] font-light">
                                {secondName}
                            </h1>

                            {/* Ornamental divider */}
                            <div ref={s1DivRef} className="w-[58%] my-4 drop-shadow-[0_2px_6px_rgba(200,149,108,0.25)]">
                                <Image src={`${S1}/divider.png`} alt="" width={220} height={78}
                                    className="w-full h-auto"
                                    style={{ height: 'auto' }} />
                            </div>

                            <p className="font-serif text-[11px] tracking-[0.18em] text-[#4a2c0a] font-semibold">
                                {displayDate.toUpperCase()}
                            </p>
                            <p className="font-serif text-[9.5px] tracking-wide text-[#6b3a1f] opacity-85 mt-1">
                                {venue}.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div ref={s1ScrRef}
                    className="absolute bottom-[4%] left-1/2 -translate-x-1/2 z-20
                               flex flex-col items-center gap-[5px]">
                    <div className="size-7 rounded-full border border-[#c8956c]/70 flex items-center justify-center">
                        <span className="block w-[5px] h-[5px] border-r border-b border-[#c8956c]
                                         rotate-45 -translate-y-px animate-bounce" />
                    </div>
                    <span className="text-[7px] tracking-[0.2em] text-[#c8956c] uppercase font-semibold">
                        SCROLL TO BEGIN
                    </span>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                SCENE 2 — Ganesh Blessings
                Assets: circular frame outside ganesh ji.png (outer ring),
                ganesh ji mid.png (deity, centred inside ring),
                mid bottom lotus.png (lotus pool below),
                left/right below floral.png (foreground corner florals),
                left/right bg floral.png (background side florals),
                divider.png (ornamental rule)
            ════════════════════════════════════════════════════════ */}
            <div
                ref={s2Ref}
                className="max-w-[430px] mx-auto w-full min-h-dvh relative overflow-hidden
                           flex flex-col items-center justify-center pt-[12%] pb-[12%]"
            >
                {/* Full background texture */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image src={`${B}/Background.png`} alt="" fill
                        sizes="(max-width: 430px) 100vw, 430px"
                        className="object-cover" />
                </div>
                {/* Soft gradient overlay to boost contrast */}
                <div className="absolute inset-0 z-1 bg-linear-to-b from-white/30 via-transparent to-white/35 pointer-events-none" />

                {/* BG florals (far-back parallax) */}
                <div ref={s2BgLRef}
                    className="absolute left-0 top-0 z-2 w-[42%] opacity-65 pointer-events-none">
                    {/* left bg floral.png: 702×1293 */}
                    <Image src={`${S2}/left bg floral.png`} alt="" width={180} height={332}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>
                <div ref={s2BgRRef}
                    className="absolute right-0 top-0 z-2 w-[42%] opacity-65 pointer-events-none">
                    {/* right bg floral.png: 756×1298 */}
                    <Image src={`${S2}/right bg floral.png`} alt="" width={180} height={309}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Below-corner florals */}
                <div ref={s2FlwLRef}
                    className="absolute left-0 bottom-0 z-3 w-[44%] pointer-events-none">
                    {/* left below floral.png: 1041×1236 */}
                    <Image src={`${S2}/left below floral.png`} alt="" width={190} height={225}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>
                <div ref={s2FlwRRef}
                    className="absolute right-0 bottom-0 z-3 w-[44%] pointer-events-none">
                    {/* right below floral.png: 930×1192 */}
                    <Image src={`${S2}/right below floral.png`} alt="" width={190} height={243}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* ── Central stack: circular frame → Ganesh → lotus ── */}
                {/* Circular frame: 932×1002 ≈ square */}
                <div ref={s2CirRef} className="relative z-6 w-[58%] drop-shadow-[0_10px_20px_rgba(74,44,10,0.15)]">
                    <Image src={`${S2}/circular frame outside ganesh ji.png`} alt="" width={250} height={269}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                    {/* Ganesh ji centred inside frame: 593×828 → taller than wide */}
                    <div ref={s2GanRef}
                        className="absolute inset-0 p-5 flex items-center justify-center"
                        style={{ filter: 'drop-shadow(0 6px 16px rgba(200,149,108,0.4))' }}>
                        <Image src={`${S2}/ganesh ji mid.png`} alt="Ganesh Ji" width={150} height={210}
                            className="w-[60%] h-auto object-contain"
                            style={{ height: 'auto' }} />
                    </div>
                </div>

                {/* Mid bottom lotus: 1286×588 → wide landscape */}
                <div ref={s2LotRef} className="relative z-5 w-[70%] -mt-4 drop-shadow-[0_8px_16px_rgba(74,44,10,0.12)]">
                    <Image src={`${S2}/mid bottom lotus.png`} alt="" width={300} height={137}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Divider */}
                <div className="relative z-7 w-[65%] my-3 drop-shadow-[0_2px_4px_rgba(200,149,108,0.2)]">
                    {/* divider.png: 1145×148 */}
                    <Image src={`${S2}/divider.png`} alt="" width={270} height={35}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Text block */}
                <div ref={s2TxtRef}
                    className="relative z-8 flex flex-col items-center text-center px-[12%] gap-[5px]">
                    <p className="font-serif text-[11px] tracking-[0.18em] text-[#6b3a1f] font-semibold">
                        WITH BLESSINGS AND LOVE
                    </p>
                    <p className="font-serif text-[11px] text-[#4a2c0a] leading-[1.9] opacity-90 max-w-[270px] italic whitespace-pre-line">
                        {blessingText}
                    </p>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                SCENE 3 — Formal Invitation Card
                Assets: frame.png (ornamental card border),
                floral left/right.png (peaking side florals),
                big lotus.png (subtle BG lotus),
                lotus bg.png (faint bg lotus),
                above left bg floral.png & bg flower.png (bg decor)
            ════════════════════════════════════════════════════════ */}
            <div
                ref={s3Ref}
                className="max-w-[430px] mx-auto w-full min-h-dvh relative overflow-hidden
                           flex items-center justify-center py-[8%] px-[4%]"
            >
                {/* Full background texture */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image src={`${B}/Background.png`} alt="" fill
                        sizes="(max-width: 430px) 100vw, 430px"
                        className="object-cover" />
                </div>
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 z-1 bg-linear-to-b from-white/30 via-transparent to-white/30 pointer-events-none" />

                {/* Faint bg lotus bottom-right */}
                <div className="absolute bottom-0 right-0 z-2 w-[45%] opacity-25 pointer-events-none">
                    <Image src={`${S3}/lotus bg.png`} alt="" width={195} height={144}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>
                {/* bg flower top-left */}
                <div className="absolute bottom-[5%] left-[4%] z-2 w-[20%] opacity-100 pointer-events-none">
                    <Image src={`${S3}/bg flower.png`} alt="" width={88} height={92}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>
                {/* above left bg floral */}
                <div className="absolute bottom-0 left-0 z-2 w-[32%] opacity-30 pointer-events-none">
                    <Image src={`${S3}/above left bg floral.png`} alt="" width={138} height={147}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Card frame — frame.png: 1196×2133 ≈ phone-screen proportion */}
                <div ref={s3FrmRef} className="relative z-5 w-[92%] drop-shadow-[0_15px_35px_rgba(74,44,10,0.22)]">
                    <Image src={`${S3}/frame.png`} alt="Card Frame" width={392} height={700}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />

                    {/* Text content overlaid on frame */}
                    <div ref={s3TxtRef}
                        className="absolute inset-0 flex flex-col items-center justify-center
                                   text-center px-[12%] gap-[5px] pb-[4%]">

                        {/* Big lotus subtle bg inside card */}
                        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[55%] z-0 pointer-events-none">
                            <Image src={`${S3}/big lotus.png`} alt="" width={215} height={168}
                                className="w-full h-auto"
                                style={{ height: 'auto' }} />
                        </div>


                        <p className="relative z-1 font-serif text-[8.5px] text-[#4a2c0a] tracking-[0.07em] opacity-80 leading-relaxed mt-1">
                            REQUEST THE PLEASURE OF YOUR COMPANY<br />
                            TO CELEBRATE THE WEDDING OF
                        </p>

                        <h1 className="relative z-1 font-serif text-[46px] leading-none text-[#4a2c0a] mt-1.5 drop-shadow-[0_1px_3px_rgba(74,44,10,0.1)]">
                            {firstName}
                        </h1>
                        <p className="relative z-1 font-serif text-[8.5px] tracking-widest text-[#6b3a1f] leading-relaxed font-semibold">
                            {brideFatherLine}
                        </p>
                        <p className="relative z-1 font-serif text-[20px] text-[#c8956c] font-semibold leading-none">&amp;</p>
                        <h1 className="relative z-1 font-serif text-[46px] leading-none text-[#4a2c0a] mb-1.5 drop-shadow-[0_1px_3px_rgba(74,44,10,0.1)]">
                            {secondName}
                        </h1>
                        <p className="relative z-1 font-serif text-[8.5px] tracking-widest text-[#6b3a1f] leading-relaxed font-semibold">
                            {groomFatherLine}
                        </p>

                        <p className="relative z-1 font-serif text-[11px] font-bold tracking-[0.15em] text-[#4a2c0a] mt-1">
                            {displayDate.toUpperCase()}
                        </p>
                        <p className="relative z-1 font-serif text-[9.5px] tracking-wide text-[#6b3a1f] leading-relaxed">
                            {venue.toUpperCase()}
                        </p>
                        <p className="relative z-1 font-serif text-[8px] text-[#6b3a1f] opacity-75 font-medium mt-1">
                            CELEBRATION TO FOLLOW
                        </p>
                    </div>

                    {/* Floral LEFT peeking behind/over frame */}
                    <div ref={s3FlwLRef}
                        className="absolute left-[-10%] bottom-[3%] z-10 w-[36%] pointer-events-none drop-shadow-[-4px_4px_10px_rgba(74,44,10,0.15)]">
                        {/* floral left.png: 690×1000 */}
                        <Image src={`${S3}/floral left.png`} alt="" width={148} height={215}
                            className="w-full h-auto"
                            style={{ height: 'auto' }} />
                    </div>

                    {/* Floral RIGHT */}
                    <div ref={s3FlwRRef}
                        className="absolute right-[-14%] top-[6%] z-10 w-[36%] pointer-events-none drop-shadow-[4px_4px_10px_rgba(74,44,10,0.15)]">
                        {/* floral right.png: 700×936 */}
                        <Image src={`${S3}/floral right.png`} alt="" width={148} height={198}
                            className="w-full h-auto"
                            style={{ height: 'auto' }} />
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                SCENE 4 — Wedding Celebrations (events list)
                Assets: name box.png (header name strip),
                divider.png (ornamental rule),
                left/right floral.png (side tall florals),
                below floral left/right.png (bottom corner florals),
                below bg.png (garden bottom strip),
                mehendi/haldi/sangeet/wedding/reception icon.png
            ════════════════════════════════════════════════════════ */}
            <div
                ref={s4Ref}
                className="max-w-[430px] mx-auto w-full min-h-dvh relative overflow-hidden
                           flex flex-col items-center pt-[10%] pb-[8%]"
            >
                {/* Full background texture */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image src={`${B}/Background.png`} alt="" fill
                        sizes="(max-width: 430px) 100vw, 430px"
                        className="object-cover" />
                </div>
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 z-1 bg-linear-to-b from-white/30 via-transparent to-white/35 pointer-events-none" />

                {/* Garden strip bottom */}
                <div className="absolute bottom-0 inset-x-0 z-1 opacity-55 pointer-events-none">
                    {/* below bg.png: 1649×888 */}
                    <Image src={`${S4}/below bg.png`} alt="" width={430} height={232}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Side florals (tall vertical) */}
                <div ref={s4FlwLRef}
                    className="absolute left-0 top-[8%] z-3 w-[18%] pointer-events-none">
                    {/* left floral.png: 595×1106 */}
                    <Image src={`${S4}/left floral.png`} alt="" width={77} height={144}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>
                <div ref={s4FlwRRef}
                    className="absolute right-0 top-[8%] z-3 w-[18%] pointer-events-none">
                    {/* right floral.png: 608×1154 */}
                    <Image src={`${S4}/right floral.png`} alt="" width={77} height={146}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Below corner florals */}
                <div className="absolute left-0 bottom-[5%] z-4 w-[26%] pointer-events-none">
                    <Image src={`${S4}/below floral left.png`} alt="" width={112} height={154}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>
                <div className="absolute right-0 bottom-[5%] z-4 w-[26%] pointer-events-none">
                    <Image src={`${S4}/below floral right .png`} alt="" width={112} height={136}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* ── Content ── */}
                <div ref={s4TxtRef}
                    className="relative z-10 flex flex-col items-center w-full gap-0">

                    {/* Title */}
                    <h1 className="font-serif text-[30px] tracking-wider text-[#4a2c0a] text-center leading-tight mb-2 font-medium">
                        Wedding<br />Celebrations
                    </h1>

                    {/* Ornamental divider: 1498×193 */}
                    <div className="w-[58%] mb-3 drop-shadow-[0_2px_4px_rgba(200,149,108,0.2)]">
                        <Image src={`${S4}/divider.png`} alt="" width={248} height={32}
                            className="w-full h-auto"
                            style={{ height: 'auto' }} />
                    </div>

                    {/* Name box: 1851×497 → wide landscape strip */}


                    {/* Event rows inside perspective container */}
                    <div className="w-full flex flex-col items-center perspective-[1000px]">
                        {eventsList.map((ev, i) => (
                            <div key={i} className="t06-ev-row w-[86%] relative flex flex-col justify-center">
                                <div className="t06-ev-card-inner w-full relative flex items-center gap-3.5 px-4 py-3 cursor-pointer group">
                                    <div className="absolute inset-0  z-0">
                                        <Image src={`${S4}/name box.png`} alt="" fill
                                            sizes="(max-width: 430px) 100vw, 430px"
                                            className="object-fill" />
                                    </div>

                                    <div className="relative w-10 h-10 my-4 ml-2 z-1 shrink-0 bg-[#faf5eb]/85 rounded-full border border-[#c8956c]/15 flex items-center justify-center shadow-inner">
                                        <Image src={ev.icon} alt={ev.label}
                                            width={ev.iw} height={ev.ih}
                                            className="w-[62%] h-auto object-contain group-hover:scale-110 transition-transform duration-500"
                                            style={{ height: 'auto' }} />
                                    </div>
                                    <span className="relative z-1 font-serif text-[14px] font-semibold text-[#4a2c0a] flex-1 tracking-[0.06em] group-hover:text-[#6b3a1f] transition-colors">
                                        {ev.label}
                                    </span>
                                    <div className="relative mr-8 z-1 text-right shrink-0 flex flex-col justify-center">
                                        <p className="font-serif text-[8.5px] text-[#6b3a1f] tracking-[0.07em]">
                                            {ev.date}
                                        </p>
                                        <p className="font-serif text-[9.5px] font-bold text-[#4a2c0a]">
                                            {ev.time}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                SCENE 5 — The Wedding Ceremony
                Assets: frame bg.png (mandap/gazebo illustration),
                krishan pankh.png (peacock feather top-right),
                floral left/right.png (large side florals covering most of screen),
                diya left/right.png (small diyas at bottom),
                haldi1 icon / sangeet / wedding / reception icon.png (event list)
            ════════════════════════════════════════════════════════ */}
            <div
                ref={s5Ref}
                className="max-w-[430px] mx-auto w-full h-dvh relative overflow-hidden
                           flex flex-col items-center justify-center pt-[9%] pb-[7%]"
            >
                {/* Full background texture */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image src={`${B}/Background.png`} alt="" fill
                        sizes="(max-width: 430px) 100vw, 430px"
                        className="object-cover" />
                </div>
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 z-1 bg-linear-to-b from-white/30 via-transparent to-white/35 pointer-events-none" />

                {/* Event Illustrations in the background of all (behind the gazebo frame) */}
                {eventsList.map((ev, idx) => (
                    <div
                        key={idx}
                        className="t06-ev-bg-slide absolute top-44/100 left-1/2 -translate-x-1/2 translate-y-[-52%] z-1 w-[78%] aspect-4/5 overflow-hidden rounded-[24px] pointer-events-none"
                        style={{ opacity: idx === 0 ? 1 : 0 }}
                    >
                        <Image src={ev.detailedIcon} alt={ev.title} fill
                            sizes="(max-width: 430px) 100vw, 430px"
                            className="object-cover" />
                    </div>
                ))}

                {/* Tall floral LEFT covers ~half the screen height from bottom */}
                {/* floral left.png: 818×2966 → very tall */}
                <div ref={s5FlwLRef}
                    className="absolute left-0 bottom-0 z-5 w-[34%] pointer-events-none">
                    <Image src={`${S5}/floral left.png`} alt="" width={190} height={689}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Tall floral RIGHT */}
                {/* floral right.png: 676×2965 */}
                <div ref={s5FlwRRef}
                    className="absolute right-0 bottom-0 z-5 w-[34%] pointer-events-none">
                    <Image src={`${S5}/floral right.png`} alt="" width={190} height={832}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Peacock feather top-right: 675×1180 */}
                <div ref={s5PanRef}
                    className="absolute top-[2%] right-[4%] z-0 w-[28%] pointer-events-none drop-shadow-[0_4px_10px_rgba(74,44,10,0.15)]">
                    <Image src={`${S5}/krishan pankh.png`} alt="Feather" width={120} height={209}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Mandap/gazebo frame BG: 1053×1934 (Centred absolute behind the text to match screenshot layout) */}
                <div ref={s5FrmRef}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-52%] z-0 w-[62%] drop-shadow-[0_12px_28px_rgba(74,44,10,0.18)]">
                    <Image src={`${S5}/frame bg.png`} alt="Mandap" width={302} height={555}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Event details container — stacked absolute on top of each other, split between top header and bottom details */}
                <div ref={s5TxtRef} className="absolute inset-0 z-8 flex items-center justify-center pointer-events-none">
                    {eventsList.map((ev, idx) => (
                        <div
                            key={idx}
                            className="t06-ev-slide absolute inset-0 flex flex-col justify-between pt-[10%] pb-[9%] px-6 w-full h-full"
                            style={{ opacity: idx === 0 ? 1 : 0 }}
                        >
                            {/* Top: Header */}
                            <div className="flex flex-col items-center text-center mt-[2%]">
                                <p className="font-serif text-[9.5px] tracking-[0.25em] text-[#6b3a1f] uppercase font-semibold">THE</p>
                                <h1 className="font-serif text-[24px] tracking-[0.06em] text-[#4a2c0a] leading-[1.2] font-semibold drop-shadow-[0_1px_2px_rgba(74,44,10,0.05)] mt-1">
                                    {ev.title}
                                </h1>
                            </div>

                            {/* Center spacer: Empty as the illustration renders at z-[1] in the background */}
                            <div className="h-0 w-full" />

                            {/* Bottom: Details block */}
                            <div className="flex flex-col items-center text-center px-[12%] gap-[6px] mb-[3%]">
                                <p className="font-serif text-[13px] font-bold tracking-[0.12em] text-[#4a2c0a]">
                                    {ev.fullDate || ev.date}
                                </p>
                                <p className="font-serif text-[9px] text-[#6b3a1f] tracking-[0.14em] uppercase font-semibold">
                                    {ev.time}
                                </p>

                                {/* Venue with Location Pin */}
                                <div className="flex items-start justify-center gap-1.5 mt-1 max-w-[280px] mx-auto">
                                    <svg className="w-3.5 h-3.5 text-[#6b3a1f]/80 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="font-serif text-[9.5px] tracking-wide text-[#6b3a1f] leading-relaxed font-bold">
                                        {ev.venue}<br />
                                        <span className="text-[8px] font-medium tracking-normal text-[#6b3a1f]/80">{ev.venueSub}</span>
                                    </p>
                                </div>

                                {/* Dress Code */}
                                <div className="flex flex-col items-center mt-1">
                                    <div className="flex items-center gap-2">
                                        <span className="w-4 h-[0.5px] bg-[#c8956c]/40" />
                                        <span className="text-[8.5px] tracking-[0.2em] text-[#6b3a1f] uppercase font-semibold">DRESS CODE</span>
                                        <span className="w-4 h-[0.5px] bg-[#c8956c]/40" />
                                    </div>
                                    <p className="text-[11px] font-serif font-bold italic text-[#4a2c0a] mt-0.5">
                                        {ev.dress}
                                    </p>
                                </div>

                                {/* Lotus Divider */}
                                <div className="w-[30%] my-0.5 drop-shadow-[0_1px_3px_rgba(200,149,108,0.2)]">
                                    <Image src={`${S1}/divider.png`} alt="" width={100} height={35} className="w-full h-auto opacity-75" style={{ height: 'auto' }} />
                                </div>

                                {/* Quote */}
                                <p className="font-serif text-[9.5px] text-[#6b3a1f] italic opacity-90 max-w-[260px] leading-relaxed">
                                    {ev.quote}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Diyas bottom */}
                {/* diya left .png: 337×266 */}
                <div
                    className="absolute left-[16%] bottom-[4%] z-9 w-[11%] pointer-events-none">
                    <Image src={`${S5}/diya left .png`} alt="Diya" width={47} height={37}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>
                <div
                    className="absolute right-[16%] bottom-[4%] z-9 w-[11%] pointer-events-none">
                    <Image src={`${S5}/diya right.png`} alt="Diya" width={47} height={37}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                SCENE 6 — Meet the Couple
                Assets: box.png (couple photo area background),
                frame.png (decorative frame overlay on photos — NOTE: 0-byte, skip),
                floral.png / floral 2.png (left & right corner florals)
            ════════════════════════════════════════════════════════ */}
            <div
                ref={s6Ref}
                className="max-w-[430px] mx-auto w-full h-dvh relative overflow-hidden
                           flex flex-col items-center justify-center pt-[8%] pb-[8%]"
            >
                {/* Full background texture */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image src={`${B}/Background.png`} alt="" fill
                        sizes="(max-width: 430px) 100vw, 430px"
                        className="object-cover" />
                </div>
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 z-1 bg-linear-to-b from-white/30 via-transparent to-white/35 pointer-events-none" />

                {/* Floral LEFT: 694×1607 → very tall */}
                <div ref={s6FlwLRef}
                    className="absolute left-[-3%] top-[4%] z-3 w-[40%] pointer-events-none drop-shadow-[-4px_4px_10px_rgba(74,44,10,0.15)]">
                    <Image src={`${S6}/floral.png`} alt="" width={172} height={399}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Floral RIGHT: 697×1506 */}
                <div ref={s6FlwRRef}
                    className="absolute right-[-3%] top-[4%] z-3 w-[40%] pointer-events-none drop-shadow-[4px_4px_10px_rgba(74,44,10,0.15)]">
                    <Image src={`${S6}/floral 2.png`} alt="" width={172} height={372}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Title */}
                <div className="relative z-10 text-center mb-4">
                    <p className="font-serif text-[11px] tracking-[0.18em] text-[#6b3a1f] font-semibold">MEET THE</p>
                    <h1 className="font-serif text-[42px] text-[#4a2c0a] leading-[1.1] drop-shadow-[0_1px_3px_rgba(74,44,10,0.1)]">Couple</h1>
                    <div className="w-16 h-[1.5px] bg-linear-to-r from-transparent via-[#c8956c] to-transparent mx-auto mt-1" />
                </div>

                {/* Box / photo area: 1699×2197 → portrait */}
                <div ref={s6BoxRef} className="relative z-6 w-[70%] aspect-4/5 shrink-0 drop-shadow-[0_15px_35px_rgba(74,44,10,0.22)] overflow-hidden rounded-[24px]">
                    {/* The Couple Photos stacked absolute inside the frame */}
                    <div className="absolute inset-[3.8%] z-3 overflow-hidden rounded-[16px] pointer-events-none">
                        {couplePhotos.map((src, idx) => (
                            <Image
                                key={idx}
                                src={src}
                                alt={`Couple Photo ${idx + 1}`}
                                fill
                                sizes="(max-width: 430px) 100vw, 430px"
                                className="t06-couple-photo absolute inset-0 object-cover"
                                style={{ opacity: idx === 0 ? 1 : 0 }}
                            />
                        ))}
                    </div>

                    {/* The Frame Overlay */}
                    <Image src={`${S6}/box.png`} alt="Couple Frame" fill
                        sizes="(max-width: 430px) 100vw, 430px"
                        className="absolute inset-0 z-1 object-fill aspect-4/5 pointer-events-none" />
                </div>

                {/* Thumbnails indicator */}
                <div className="relative z-10 flex gap-3 justify-center mt-4">
                    {couplePhotos.map((src, idx) => (
                        <div
                            key={idx}
                            className="w-11 h-14 rounded-md overflow-hidden border border-[#c8956c]/30 relative cursor-pointer shadow-md active:scale-95 transition-all"
                        >
                            <Image
                                src={src}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                sizes="44px"
                                className="object-cover"
                            />
                            {/* Active indicator overlay */}
                            <div className="t06-thumb-active absolute inset-0 bg-[#c8956c]/35 border-2 border-[#c8956c] opacity-0 transition-opacity duration-300"
                                style={{ opacity: idx === 0 ? 1 : 0 }} />
                        </div>
                    ))}
                </div>

                {/* Couple text */}
                <div ref={s6TxtRef}
                    className="relative z-10 flex flex-col items-center text-center
                                px-[12%] mt-4 gap-[4px]">
                    <h2 className="font-serif text-[22px] text-[#4a2c0a] font-medium drop-shadow-[0_1px_3px_rgba(74,44,10,0.1)]">
                        {firstName} &amp; {secondName}
                    </h2>
                    <p className="font-serif text-[10.5px] text-[#6b3a1f] leading-[1.8] italic opacity-95 whitespace-pre-line">
                        {storyText}
                    </p>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                SCENE 7 — RSVP / Closing
                Assets: bg arch.png (full arch background),
                hanging light 1 / 2.png (pendants top corners),
                peakock left/right.png (peacocks bottom sides),
                diya left/right.png (diyas inner-bottom),
                below floral garden.png (garden strip bottom),
                lotus big.png (lotus icon centre),
                divider.png (ornamental rule),
                rsvp buttnon.png (pre-styled button — used as BG under our link)
            ════════════════════════════════════════════════════════ */}
            <div
                ref={s7Ref}
                className="max-w-[430px] mx-auto w-full min-h-dvh relative overflow-hidden
                           flex flex-col items-center pt-[10%] pb-[10%]"
            >
                {/* Full background texture */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <Image src={`${B}/Background.png`} alt="" fill
                        sizes="(max-width: 430px) 100vw, 430px"
                        className="object-cover" />
                </div>
                {/* Soft gradient overlay */}
                <div className="absolute inset-0 z-1 bg-linear-to-b from-white/30 via-transparent to-white/35 pointer-events-none" />

                {/* Arch background: 1043×1777 → portrait, covers full screen */}
                <div className="absolute inset-0 z-2 opacity-55 pointer-events-none">
                    <Image src={`${S7}/bg arch.png`} alt="" fill
                        sizes="(max-width: 430px) 100vw, 430px"
                        className="object-cover" />
                </div>

                {/* Hanging lights — narrow & tall (250×1114) — top corners */}
                <div ref={s7LtLRef}
                    className="absolute top-0 left-[6%] z-4 w-[12%] pointer-events-none">
                    <Image src={`${S7}/hanging light 1 .png`} alt="" width={52} height={231}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>
                <div ref={s7LtRRef}
                    className="absolute top-0 right-[6%] z-4 w-[12%] pointer-events-none">
                    <Image src={`${S7}/hanging light 2.png`} alt="" width={52} height={231}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Peacock LEFT: 670×1339 */}
                <div ref={s7PeaLRef}
                    className="absolute left-0 bottom-[10%] z-6 w-[32%] pointer-events-none drop-shadow-[-4px_4px_12px_rgba(74,44,10,0.18)]">
                    <Image src={`${S7}/peakock left.png`} alt="" width={138} height={276}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Peacock RIGHT: 789×1330 */}
                <div ref={s7PeaRRef}
                    className="absolute right-0 bottom-[10%] z-6 w-[32%] pointer-events-none drop-shadow-[4px_4px_12px_rgba(74,44,10,0.18)]">
                    <Image src={`${S7}/peakock right.png`} alt="" width={138} height={233}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Below floral garden: 2315×662 → wide landscape */}
                <div className="absolute bottom-0 inset-x-0 z-5 opacity-85 pointer-events-none">
                    <Image src={`${S7}/below floral garden.png`} alt="" width={430} height={123}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Lotus big: 534×444 — centred low */}
                <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-4 w-[22%] opacity-65 pointer-events-none">
                    <Image src={`${S7}/lotus big.png`} alt="" width={95} height={79}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Diya LEFT: 386×284 */}
                <div
                    className="absolute left-[18%] bottom-[7%] z-8 w-[10%] pointer-events-none">
                    <Image src={`${S7}/diya left.png`} alt="" width={43} height={32}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>
                {/* Diya RIGHT */}
                <div
                    className="absolute right-[18%] bottom-[7%] z-8 w-[10%] pointer-events-none">
                    <Image src={`${S7}/diya right.png`} alt="" width={43} height={32}
                        className="w-full h-auto"
                        style={{ height: 'auto' }} />
                </div>

                {/* Main text content */}
                <div ref={s7TxtRef}
                    className="relative z-10 flex flex-col items-center text-center
                               px-[14%] gap-[8px] mt-[6%]">

                    {/* Lotus icon */}
                    <div className="w-10 h-auto opacity-80">
                        <Image src={`${S7}/lotus big.png`} alt="" width={40} height={33}
                            className="w-full h-auto object-contain"
                            style={{ height: 'auto' }} />
                    </div>

                    <p className="font-serif text-[16px] text-[#4a2c0a] leading-[1.75] drop-shadow-[0_1px_2px_rgba(74,44,10,0.05)]">
                        We would be honoured<br />
                        to celebrate this<br />
                        beautiful day with you.
                    </p>

                    {/* Divider: 1359×156 */}
                    <div className="w-[60%] drop-shadow-[0_2px_4px_rgba(200,149,108,0.2)]">
                        <Image src={`${S7}/divider.png`} alt="" width={215} height={25}
                            className="w-full h-auto"
                            style={{ height: 'auto' }} />
                    </div>

                    <p className="font-serif text-[10.5px] text-[#6b3a1f] italic">
                        With love and gratitude,
                    </p>
                    <p className="font-serif text-[11.5px] font-semibold text-[#4a2c0a] tracking-wide">
                        {rsvpFamilies}
                    </p>

                    {/* RSVP button — use the supplied button image as background */}
                    <div className="relative mt-4 w-[72%] transition-transform duration-300 hover:scale-105 active:scale-95 rounded-full overflow-hidden">
                        {/* rsvp buttnon.png: 2007×452 → wide bar */}
                        <Image src={`${S7}/rsvp buttnon.png`} alt="" width={295} height={66}
                            className="w-full h-auto" />
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=Hello!%20I%20would%20love%20to%20attend%20the%20wedding%20of%20${firstName}%20%26%20${secondName}!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center gap-2
                                       font-serif text-[11px] font-bold tracking-[0.15em] text-white hover:text-[#fffefc] transition-colors"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                            RSVP ON WHATSAPP
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
