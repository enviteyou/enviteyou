"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { IMG, ORN, MUSIC } from "./assets";

const INVITATION_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Arya:wght@400;700&display=swap');

/* Hide EnviteYou platform header and footer on this standalone invitation page */
header.sticky { display: none !important; }
footer.relative { display: none !important; }

/* Ensure base invitation typography wins over globals.css */
.invitation-root,
.invitation-root p,
.invitation-root span:not(.hi),
.invitation-root a,
.invitation-root button,
.invitation-root input,
.invitation-root textarea,
.invitation-root select {
  font-family: var(--ui);
}
.invitation-root .hi,
.invitation-root .hi * {
  font-family: var(--deva) !important;
}

:root{
 --ivory:#F8F0E5;--sage:#A6AD8A;--sage-l:#DCDFCA;--olive:#777D55;--rose:#D9A5A5;--blush:#E8C7C4;--blush-l:#F4E3DE;--gold:#C6A15B;--gold-d:#8A6A2C;--champ:#E8D6AE;--brown:#594333;--brown-d:#3F2F23;--burg:#7E4651;--peach:#F3E0CB;
 --maroon:#594333;--maroon-d:#3F2F23;--gold-l:#E8D6AE;--ink:#594333;
 --bg:#F8F0E5;--bg2:#F2E7D6;--card:#FDF8F0;--text:#594333;--muted:#7A6552;--line:rgba(198,161,91,.65);--head:#594333;--btn:#594333;--btn-t:#F8F0E5;
 --serif:'Playfair Display',Georgia,'Times New Roman',serif;
 --deva:'Arya','Noto Serif Devanagari','Mangal','Kohinoor Devanagari',serif;
 --ui:'Playfair Display',Georgia,'Times New Roman',serif;
 --tex:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='a' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.012' numOctaves='3' seed='6' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .55 0 0 0 0 .42 0 0 0 0 .25 1.5 0 0 0 -.62'/%3E%3C/filter%3E%3Cfilter id='b' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.022' numOctaves='3' seed='13' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 .98 0 0 0 0 .94 0 1.3 0 0 -.6'/%3E%3C/filter%3E%3Cfilter id='c' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .4 0 0 0 0 .3 0 0 0 0 .2 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='600' height='600' filter='url(%23a)' opacity='.4'/%3E%3Crect width='600' height='600' filter='url(%23b)' opacity='.55'/%3E%3Crect width='600' height='600' filter='url(%23c)'/%3E%3C/svg%3E");
 color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);
}
*,*::before,*::after{box-sizing:border-box}
html{height:100%;scroll-padding-top:calc(env(safe-area-inset-top,0px) + 64px);-webkit-text-size-adjust:100%}
@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
body{margin:0;min-height:100%;background:var(--bg);color:var(--text);font-family:var(--ui);font-size:1rem;line-height:1.65;overflow-x:hidden;background-image:var(--tex)}

#root{position:relative;z-index:1}
img{max-width:100%}
.hi{font-family:var(--deva);font-weight:400;line-height:1.5}
h1,h2,h3,p{margin:0}
a{color:inherit}
button{font-family:inherit}
:focus-visible{outline:2px solid var(--gold);outline-offset:3px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.wrap{width:min(1120px,100% - 40px);margin-inline:auto}
section{position:relative;padding:clamp(64px,10vw,110px) 0;scroll-margin-top:60px}
.sec-head{text-align:center;margin-bottom:clamp(32px,6vw,56px)}
.sec-head h2{font-family:var(--serif);font-weight:500;font-size:clamp(2.1rem,6vw,3.3rem);color:var(--head);line-height:1.1}
.sec-head .hi{display:block;margin-top:6px;color:var(--gold-d);font-size:clamp(1.15rem,3.4vw,1.5rem)}
.sec-head p.sub{max-width:560px;margin:14px auto 0;color:var(--muted)}
.alt{background:var(--bg2)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:48px;padding:10px 22px;border-radius:999px;border:1.5px solid var(--btn);background:var(--btn);color:var(--btn-t);font-size:1rem;font-weight:600;text-decoration:none;cursor:pointer;transition:transform .2s,box-shadow .2s,background .2s;text-align:center;line-height:1.2}
.btn:hover{transform:translateY(-1px);box-shadow:0 8px 20px -10px rgba(70,9,26,.6)}
.btn.ghost{background:transparent;color:var(--head)}
.btn.gold{background:linear-gradient(180deg,#D9C08A,#B08A4E);border-color:#9B7740;color:#3A0E19}
.btn.sm{min-height:44px;padding:8px 16px;font-size:.95rem}
.btn svg{width:19px;height:19px;flex:none}
.ic{fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.row{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
/* ---------- NAV ---------- */
.nav{position:sticky;top:env(safe-area-inset-top,0px);z-index:50;background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}
.nav .in{width:min(1180px,100% - 24px);margin:auto;display:flex;align-items:center;justify-content:space-between;min-height:58px}
.brand{font-family:var(--serif);font-style:italic;font-size:1.6rem;color:var(--head);text-decoration:none;font-weight:600}
.links{display:none;gap:4px;align-items:center}
.links a{padding:8px 12px;text-decoration:none;font-size:.95rem;color:var(--text);border-radius:999px}
.links a:hover{background:rgba(176,138,78,.16)}
.nav .tools{display:flex;gap:4px;align-items:center}
.ib{width:44px;height:44px;display:grid;place-items:center;border:0;background:none;color:var(--head);cursor:pointer;border-radius:50%}
.ib:hover{background:rgba(176,138,78,.16)}
.ib svg{width:23px;height:23px}
.sheet{position:absolute;left:0;right:0;top:100%;background:var(--card);border-bottom:1px solid var(--line);box-shadow:0 20px 30px -20px rgba(0,0,0,.4);padding:8px 20px 18px}
.sheet a{display:flex;align-items:center;justify-content:space-between;min-height:50px;text-decoration:none;border-bottom:1px solid var(--line);font-size:1.05rem}
.sheet a .hi{color:var(--gold-d);font-size:.95rem}
@media(min-width:960px){.links{display:flex}.menu-b{display:none}}
/* ---------- petals ---------- */
.petals{position:fixed;inset:0;pointer-events:none;z-index:2;overflow:hidden}
.petal{position:absolute;top:-30px;width:var(--s);height:var(--s);border-radius:80% 0 80% 0;background:var(--c);opacity:.55;animation:fall var(--d) linear var(--dl) infinite}
@keyframes fall{0%{transform:translate3d(0,-5vh,0) rotate(0)}50%{transform:translate3d(var(--x),55vh,0) rotate(180deg)}100%{transform:translate3d(calc(var(--x)*-.6),110vh,0) rotate(360deg)}}
/* ---------- HERO ---------- */
.hero{padding:clamp(28px,6vw,70px) 0 clamp(56px,8vw,90px);background:radial-gradient(ellipse at 50% 0,var(--bg2),transparent 70%)}
.hero .wrap{display:grid;gap:30px;align-items:center;justify-items:center}
.hero-txt{text-align:center;display:flex;flex-direction:column;align-items:center;gap:12px}
.ganesh{font-family:var(--deva);font-size:clamp(1.4rem,5vw,2rem);color:var(--gold-d)}
.kicker{font-family:var(--serif);letter-spacing:.32em;font-size:.95rem;color:var(--muted);font-weight:600}
.names{font-family:var(--serif);font-weight:500;color:var(--head);line-height:1.02;font-size:clamp(2.2rem,9.2vw,4.4rem);letter-spacing:.04em}
.names .amp{display:block;font-style:italic;font-size:.6em;color:var(--gold-d);margin:6px 0;letter-spacing:0}
.hdate{font-family:var(--serif);letter-spacing:.3em;font-size:clamp(1.15rem,4vw,1.5rem);font-weight:600;color:var(--text);padding:8px 0;border-block:1px solid var(--line)}
.quote{font-family:var(--serif);font-style:italic;font-size:clamp(1.2rem,3.6vw,1.45rem);max-width:30ch;color:var(--muted)}
.frame{position:relative;padding:12px;background:var(--card);border:1px solid var(--line);box-shadow:0 30px 60px -28px rgba(70,9,26,.55),0 0 0 6px color-mix(in srgb,var(--maroon) 92%,transparent),0 0 0 7px var(--gold-l)}
.frame .cn{position:absolute;width:44px;height:44px;color:var(--gold-d);z-index:2}
.frame .c1{top:-16px;left:-16px}.frame .c2{top:-16px;right:-16px;transform:scaleX(-1)}.frame .c3{bottom:-16px;left:-16px;transform:scaleY(-1)}.frame .c4{bottom:-16px;right:-16px;transform:scale(-1,-1)}
.hero-photo{width:min(78vw,380px);margin:14px}
.hero-photo img{display:block;width:100%;height:auto}
.hero-photo .imgbox{overflow:hidden}
.hero-photo img{opacity:0;transform:scale(1.12)}
.revealed .hero-photo img{opacity:1;transform:none;transition:opacity 1.8s ease .2s,transform 2.6s cubic-bezier(.2,.7,.2,1) .2s}
@media(prefers-reduced-motion:reduce){.hero-photo img{opacity:1;transform:none}.revealed .hero-photo img{transition:none}}
@media(min-width:900px){.hero .wrap{grid-template-columns:1.1fr .9fr;gap:70px}.hero-photo{order:2;width:min(100%,400px);justify-self:center}.hero-txt{order:1}}
.cue{margin-top:14px;color:var(--gold-d);font-size:.9rem}
/* ---------- invitation ---------- */
.paper{position:relative;max-width:720px;margin:auto;padding:clamp(34px,7vw,64px) clamp(24px,6vw,64px);background:var(--card);background-image:var(--tex);border:1px solid var(--line);text-align:center;box-shadow:0 1px 0 var(--line),0 22px 40px -26px rgba(70,9,26,.5)}
.paper::before,.paper::after{content:'';position:absolute;inset:0;z-index:-1;background:var(--card);border:1px solid var(--line)}
.paper::before{transform:rotate(-1.6deg) translateY(4px);}
.paper::after{transform:rotate(1.4deg) translateY(7px);background:color-mix(in srgb,var(--blush) 40%,var(--card))}
.paper .inb{position:absolute;inset:12px;border:1.5px solid var(--gold);pointer-events:none}
.paper .inb::after{content:'';position:absolute;inset:5px;border:1px solid var(--line)}
.paper .cn{position:absolute;width:52px;height:52px;color:var(--gold-d)}
.paper .c1{top:14px;left:14px}.paper .c2{top:14px;right:14px;transform:scaleX(-1)}.paper .c3{bottom:14px;left:14px;transform:scaleY(-1)}.paper .c4{bottom:14px;right:14px;transform:scale(-1,-1)}
.paper p{font-family:var(--serif);font-size:clamp(1.25rem,3.8vw,1.55rem);line-height:1.6;margin:0 auto 1.1em;max-width:34ch;position:relative}
.paper .sig{font-style:italic;color:var(--head);margin-top:1.4em}
.paper .sig b{display:block;font-size:1.5em;font-weight:600;font-style:normal}
.ornate{display:block;margin:0 auto 18px;width:150px;color:var(--gold-d)}
.save{max-width:520px;margin:clamp(48px,7vw,80px) auto 0;text-align:center}
.save h3{font-family:var(--serif);font-weight:500;font-size:clamp(1.7rem,5vw,2.2rem);color:var(--head)}
.save .hi{color:var(--gold-d)}
.scratch{position:relative;width:min(300px,76vw);aspect-ratio:300/272;margin:18px auto 14px}
.sdate{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding-top:14%}
.sdate b{font-family:var(--serif);font-size:clamp(2.4rem,9vw,3.2rem);line-height:1;color:var(--head);font-weight:600}
.sdate span{font-family:var(--serif);letter-spacing:.2em;color:var(--muted);font-size:1.05rem}
.heartbg{position:absolute;inset:0;width:100%;height:100%}
.scratch canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab;transition:opacity .9s}
.scratch.done canvas{opacity:0;pointer-events:none}
.conf{position:absolute;left:50%;top:45%;width:10px;height:14px;border-radius:50% 0 50% 0;background:var(--c);opacity:0;animation:burst 1.8s ease-out forwards;pointer-events:none}
@keyframes burst{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r))}}
/* ---------- family ---------- */
.fam{display:grid;gap:28px;max-width:960px;margin:auto}
@media(min-width:760px){.fam{grid-template-columns:1fr 1fr;gap:36px}}
.fcard{background:var(--card);border:1px solid var(--line);padding:30px 24px 30px;text-align:center;position:relative;box-shadow:0 20px 40px -30px rgba(70,9,26,.5)}
.fcard::before{content:'';position:absolute;inset:8px;border:1px solid var(--line);pointer-events:none}
.fcard .tag{font-family:var(--serif);font-size:1.4rem;color:var(--gold-d);font-style:italic}
.fcard .tag .hi{font-size:1.05rem;margin-left:8px;font-style:normal}
.arch{width:min(210px,64%);margin:16px auto 18px;padding:7px;border:1px solid var(--gold);border-radius:999px 999px 6px 6px}
.arch img{display:block;width:100%;height:auto;border-radius:999px 999px 3px 3px}
.fcard h3{font-family:var(--serif);font-weight:600;font-size:clamp(1.7rem,5vw,2.1rem);color:var(--head);line-height:1.15}
.fcard dl{margin:18px 0 0;display:grid;gap:12px}
.fcard dt{font-size:.85rem;color:var(--muted);letter-spacing:.06em}
.fcard dt .hi{color:var(--gold-d)}
.fcard dd{margin:0;font-family:var(--serif);font-size:1.4rem;font-weight:500;line-height:1.2}
.famphoto{max-width:880px;margin:clamp(40px,6vw,70px) auto 0}
.photo{padding:8px;background:var(--card);border:1px solid var(--line);box-shadow:0 22px 40px -26px rgba(70,9,26,.6);display:block;width:100%}
.photo img{display:block;width:100%;height:auto}
.famphoto .t{font-family:var(--serif);font-style:italic;color:var(--head);text-align:center;font-size:1.4rem;margin-top:14px}
/* ---------- timeline ---------- */
.tl{position:relative;max-width:1020px;margin:auto}
.tl::before{content:'';position:absolute;top:10px;bottom:10px;left:22px;width:2px;background:linear-gradient(var(--gold-l),var(--gold),var(--gold-l))}
.tl-item{position:relative;padding-left:56px;margin-bottom:34px}
.tl-dot{position:absolute;left:10px;top:30px;width:26px;height:26px;border-radius:50%;background:var(--bg);border:2px solid var(--gold);display:grid;place-items:center;color:var(--gold-d)}
.tl-dot::after{content:'';width:8px;height:8px;border-radius:50%;background:var(--maroon)}
@media(min-width:900px){
 .tl::before{left:50%;margin-left:-1px}
 .tl-item{padding:0;display:flex;margin-bottom:46px}
 .tl-item:nth-child(even){justify-content:flex-end}
 .tl-dot{left:50%;margin-left:-13px}
 .tl-item .ev{width:calc(50% - 46px)}
}
.rv{opacity:0;transform:translateY(22px);transition:opacity .9s ease,transform .9s ease}
.rv.in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;transition:none}}
.ev{--evb:#FFFBF0;--evi:#3A1F26;--eva:#E9B52E;--evart:#FBF0C9;--evl:rgba(176,138,78,.5);width:100%;background:var(--evb);color:var(--evi);border:1px solid var(--evl);box-shadow:0 24px 40px -28px rgba(70,9,26,.6);position:relative}
.ev::after{content:'';position:absolute;inset:6px;border:1px solid var(--evl);pointer-events:none;opacity:.7}
.ev.haldi{--evb:#FFF8E0;--evi:#4A3200;--eva:#D99A06;--evart:#FBE9A8;--evl:rgba(217,154,6,.55)}
.ev.mehendi{--evb:#F8E8E4;--evi:#4A2430;--eva:#7F9070;--evart:#E8C4C4;--evl:rgba(127,144,112,.6)}
.ev.wedding{--evb:#5A0E20;--evi:#F6E6C4;--eva:#D9C08A;--evart:#470A18;--evl:rgba(217,192,138,.6)}
.ev.reception{--evb:#FBF4E6;--evi:#33202A;--eva:#B08A4E;--evart:#2E1E33;--evl:rgba(176,138,78,.6)}
.ev-art{background:var(--evart);padding:14px 10px 4px}
.ev-art svg{display:block;width:100%;height:120px}
.ev-body{padding:20px 22px 26px;text-align:center}
.ev-body .day{font-size:.9rem;color:var(--eva);font-weight:600;letter-spacing:.08em}
.wedding .day{color:var(--gold-l)}
.ev-body h3{font-family:var(--serif);font-weight:600;font-size:clamp(1.7rem,5vw,2.1rem);line-height:1.1;margin:4px 0 2px}
.ev-body .hi{display:block;font-size:1.15rem;color:var(--eva);margin-bottom:12px}
.ev .date{font-family:var(--serif);font-size:1.45rem;font-weight:600}
.ev .time{font-size:1.02rem;margin:2px 0 4px}
.ev .time strong{font-weight:600}
.ev .at{font-size:.95rem;opacity:.85;margin:8px 0 14px}
.ev .warn{display:inline-block;background:rgba(176,138,78,.18);border:1px dashed var(--eva);padding:2px 10px;border-radius:999px;font-size:.8rem;margin-bottom:8px}
.ev .btn{background:var(--eva);border-color:var(--eva);color:#2a1319}
.ev.wedding .btn{color:#3A0E19}
/* ---------- countdown ---------- */
.cd-sec{background:linear-gradient(180deg,#5a0f20,#3a0813);color:#F6E6C4;text-align:center;overflow:hidden}
.cd-sec .sec-head h2{color:#F8E8C6}.cd-sec .sec-head .hi{color:var(--gold-l)}
.cd-sec .m{position:absolute;left:50%;top:50%;width:min(900px,160vw);transform:translate(-50%,-50%);color:var(--gold-l);opacity:.1;pointer-events:none}
.cd{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(8px,2.4vw,20px);max-width:620px;margin:0 auto;position:relative}
.cd .u{border:1px solid rgba(217,192,138,.55);padding:clamp(14px,3vw,24px) 4px 12px;background:rgba(255,255,255,.04);position:relative}
.cd .u b{display:block;font-family:var(--serif);font-weight:500;font-size:clamp(2rem,9vw,3.6rem);line-height:1;font-variant-numeric:tabular-nums}
.cd .u span{display:block;margin-top:6px;font-size:.82rem;letter-spacing:.1em;color:var(--gold-l)}
.cd .u .hi{font-size:.85rem;color:#e7cf9d;letter-spacing:0}
.cd-note{max-width:520px;margin:18px auto 0;font-size:.9rem;color:#d9c39a;position:relative}
.cd-done{font-family:var(--serif);font-style:italic;font-size:clamp(1.7rem,5vw,2.4rem);padding:20px 0}
.cd-tabs{display:flex;justify-content:center;gap:8px;margin:0 auto 26px;position:relative}
.cd-tabs button{min-height:44px;padding:8px 18px;border:1px solid rgba(217,192,138,.6);background:transparent;color:#F6E6C4;border-radius:999px;cursor:pointer;font-size:.98rem}
.cd-tabs button[aria-pressed=true]{background:var(--gold-l);color:#3A0E19;font-weight:600}
/* ---------- venue ---------- */
.venues{display:grid;gap:28px;max-width:1080px;margin:auto}
@media(min-width:760px){.venues{grid-template-columns:1fr 1fr}}
@media(min-width:1060px){.venues{grid-template-columns:repeat(3,1fr)}}
.venues>.rv{display:flex}.venues .vcard{width:100%}
.vcard{background:var(--card);border:1px solid var(--line);padding:32px 24px;text-align:center;position:relative;display:flex;flex-direction:column;align-items:center;gap:6px}
.vcard::before{content:'';position:absolute;inset:8px;border:1px solid var(--line);pointer-events:none}
.vcard .pin{width:46px;height:46px;color:var(--gold-d)}
.vcard h3{font-family:var(--serif);font-weight:600;font-size:clamp(1.7rem,5vw,2.1rem);color:var(--head);line-height:1.12}
.vcard .lbl{font-family:var(--serif);font-style:italic;color:var(--gold-d);font-size:1.25rem}
.vcard .addr{color:var(--muted);max-width:30ch;margin:4px 0 14px}
.vcard .btns{display:flex;flex-direction:column;gap:10px;width:100%;max-width:300px;margin-top:auto}
.badge{display:inline-block;margin:6px 0 2px;background:rgba(201,143,148,.2);border:1px dashed var(--rose);color:var(--head);padding:4px 14px;border-radius:999px;font-size:.85rem}
.caution{font-size:.88rem;color:var(--muted);max-width:32ch;margin:6px 0 12px}
/* ---------- gallery ---------- */
.gal{display:grid;grid-template-columns:1fr 1fr;gap:clamp(18px,3.4vw,40px) clamp(12px,3vw,36px);max-width:880px;margin:auto;align-items:start}
.gal .wide{grid-column:1/-1;max-width:860px;width:100%;justify-self:center}
.gal .span{grid-column:1/-1;text-align:center;margin-top:10px}
.gal .drop{margin-top:clamp(24px,9vw,100px)}
.gt{font-family:var(--serif);font-style:italic;color:var(--head);font-size:clamp(1.15rem,3.6vw,1.6rem);margin-bottom:8px;line-height:1.2}
.gt .hi{display:none}
.gbtn{display:block;width:100%;padding:0;border:0;background:none;cursor:zoom-in;position:relative;text-align:left}
.gbtn .photo{transition:transform .5s,box-shadow .5s}
@media(hover:hover){.gbtn:hover .photo{transform:translateY(-4px);box-shadow:0 30px 44px -26px rgba(70,9,26,.7)}}
.gbtn .zoom{position:absolute;right:16px;bottom:16px;width:38px;height:38px;border-radius:50%;background:rgba(58,14,25,.78);color:#F6E6C4;display:grid;place-items:center}
.gbtn .zoom svg{width:18px;height:18px}
/* lightbox */
.lb{position:fixed;inset:0;z-index:200;background:rgba(20,6,10,.96);display:flex;align-items:center;justify-content:center;touch-action:pan-y;animation:lbin .3s}
@keyframes lbin{from{opacity:0}to{opacity:1}}
.lb figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:10px;max-width:100vw;padding:calc(env(safe-area-inset-top,0px) + 56px) 56px calc(env(safe-area-inset-bottom,0px) + 62px)}
.lb img{max-width:min(92vw,1400px);max-height:calc(100svh - 150px);width:auto;height:auto;object-fit:contain;box-shadow:0 20px 60px rgba(0,0,0,.6);animation:lbimg .45s ease}
@keyframes lbimg{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}
.lb figcaption{position:absolute;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 14px);text-align:center;color:#EAD7B1;font-family:var(--serif);font-size:1.15rem;font-style:italic}
.lb .x,.lb .pv,.lb .nx{position:absolute;width:48px;height:48px;border-radius:50%;border:1px solid rgba(217,192,138,.6);background:rgba(58,14,25,.7);color:#F6E6C4;display:grid;place-items:center;cursor:pointer}
.lb .x{top:calc(env(safe-area-inset-top,0px) + 12px);right:12px}
.lb .pv{left:8px;top:50%;margin-top:-24px}.lb .nx{right:8px;top:50%;margin-top:-24px}
.lb svg{width:22px;height:22px}
@media(max-width:600px){.lb figure{padding-left:8px;padding-right:8px}.lb .pv,.lb .nx{top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 8px);margin:0}.lb .pv{left:12px}.lb .nx{right:12px}.lb figcaption{bottom:calc(env(safe-area-inset-bottom,0px) + 22px);padding:0 70px}}
/* ---------- RSVP ---------- */
.rsvp{max-width:980px;margin:auto;display:grid;gap:30px}
@media(min-width:860px){.rsvp{grid-template-columns:1.25fr .75fr;align-items:start}}
.form{background:var(--card);border:1px solid var(--line);padding:clamp(22px,5vw,38px);position:relative}
.form::before{content:'';position:absolute;inset:8px;border:1px solid var(--line);pointer-events:none}
.field{margin-bottom:18px;position:relative}
.field label,.field legend{display:block;font-weight:600;font-size:.95rem;margin-bottom:6px;color:var(--head)}
.field legend{padding:0}
.field small{color:var(--muted);font-weight:400}
.field input,.field textarea,.field select{width:100%;min-height:48px;padding:10px 14px;border:1.5px solid var(--line);background:var(--bg);color:var(--text);font:inherit;border-radius:4px}
.field textarea{min-height:96px;resize:vertical}
.field input:focus,.field textarea:focus,.field select:focus{border-color:var(--gold-d);outline:2px solid color-mix(in srgb,var(--gold) 40%,transparent);outline-offset:1px}
.field .err{color:#B3261E;font-size:.88rem;margin-top:4px}
[data-theme=dark] .field .err{color:#ff9d94}
.seg{display:grid;grid-template-columns:1fr 1fr;gap:10px;border:0;margin:0;padding:0}
.seg label{position:relative;margin:0;font-weight:500;color:var(--text)}
.seg input{position:absolute;opacity:0;inset:0;width:100%;height:100%;cursor:pointer;min-height:0}
.seg span{display:flex;align-items:center;justify-content:center;text-align:center;min-height:52px;padding:8px;border:1.5px solid var(--line);border-radius:4px;background:var(--bg);line-height:1.25;font-size:.98rem}
.seg input:checked+span{background:var(--btn);color:var(--btn-t);border-color:var(--btn)}
.seg input:focus-visible+span{outline:2px solid var(--gold);outline-offset:2px}
.stepper{display:flex;align-items:center;gap:0;width:max-content}
.stepper button{width:48px;height:48px;border:1.5px solid var(--line);background:var(--bg);color:var(--head);font-size:1.4rem;cursor:pointer}
.stepper output{min-width:64px;height:48px;display:grid;place-items:center;border-block:1.5px solid var(--line);font-size:1.15rem;font-weight:600}
.note{font-size:.88rem;color:var(--muted);background:rgba(176,138,78,.12);border-left:3px solid var(--gold);padding:10px 14px;margin:14px 0}
.ok{border:1.5px solid var(--sage);background:rgba(143,159,131,.16);padding:18px;margin-top:16px}
.ok h4{font-family:var(--serif);font-size:1.5rem;margin:0 0 6px;color:var(--head)}
.ok pre{white-space:pre-wrap;font-family:var(--ui);font-size:.92rem;background:var(--bg);padding:12px;border:1px solid var(--line);margin:10px 0}
.ctc{background:var(--card);border:1px solid var(--line);padding:26px 22px;text-align:center;position:relative}
.ctc::before{content:'';position:absolute;inset:8px;border:1px solid var(--line);pointer-events:none}
.ctc h3{font-family:var(--serif);font-weight:600;font-size:1.8rem;color:var(--head)}
.ctc .p{border-top:1px solid var(--line);margin-top:16px;padding-top:16px}
.ctc .num{font-family:var(--serif);font-size:1.7rem;font-weight:600;letter-spacing:.04em}
.ctc .lab{font-size:.85rem;color:var(--muted)}
.ctc .row{margin-top:10px}
/* ---------- closing ---------- */
.closing{background:radial-gradient(ellipse at 50% 0,#6b1426,#3a0813 75%);color:#F6E6C4;text-align:center;overflow:hidden}
.closing .m{position:absolute;left:50%;top:30%;width:min(1000px,170vw);transform:translate(-50%,-50%);color:var(--gold-l);opacity:.09;pointer-events:none}
.closing .photo{background:#2a0610;border-color:rgba(217,192,138,.6);width:min(78vw,360px);margin:0 auto;position:relative;box-shadow:0 30px 60px -20px rgba(0,0,0,.7),0 0 0 6px #4a0c1a,0 0 0 7px var(--gold-l)}
.closing .msg{font-family:var(--serif);font-size:clamp(1.6rem,5.4vw,2.5rem);line-height:1.3;max-width:24ch;margin:36px auto 12px;font-weight:500;position:relative}
.closing .l2{font-family:var(--serif);font-style:italic;font-size:clamp(1.25rem,4vw,1.6rem);color:var(--gold-l);position:relative}
.closing .wl{margin-top:26px;font-family:var(--serif);font-size:1.3rem;position:relative}
.closing .wl b{display:block;font-size:2.1rem;font-style:italic;font-weight:500}
.closing .btn.ghost{color:#F6E6C4;border-color:var(--gold-l)}
.closing .btn.gold{margin:6px}
footer{padding:22px 20px 40px;text-align:center;font-size:.85rem;color:var(--muted)}
/* ---------- music + toast ---------- */
.music{position:fixed;right:max(14px,env(safe-area-inset-right));bottom:calc(env(safe-area-inset-bottom,0px) + 14px);z-index:60;display:flex;align-items:center;gap:8px}
.music button{width:54px;height:54px;border-radius:50%;border:1.5px solid var(--gold);background:var(--maroon);color:#F6E6C4;display:grid;place-items:center;cursor:pointer;box-shadow:0 10px 24px -8px rgba(70,9,26,.7)}
.music .lab{background:var(--card);border:1px solid var(--line);padding:4px 12px;border-radius:999px;font-size:.82rem;box-shadow:0 6px 14px -8px rgba(0,0,0,.4);max-width:56vw}
.eq{display:flex;gap:3px;align-items:flex-end;height:18px}
.eq i{width:3px;height:6px;background:currentColor;border-radius:2px}
.playing .eq i{animation:eq 1s ease-in-out infinite}
.playing .eq i:nth-child(2){animation-delay:.2s}.playing .eq i:nth-child(3){animation-delay:.4s}.playing .eq i:nth-child(4){animation-delay:.1s}
@keyframes eq{0%,100%{height:5px}50%{height:18px}}
@media(prefers-reduced-motion:reduce){.playing .eq i{animation:none;height:12px}.petal{display:none}.conf{display:none}.seal{animation:none}}
.toast{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 84px);transform:translateX(-50%);z-index:300;background:var(--maroon-d);color:#F6E6C4;padding:12px 20px;border-radius:999px;border:1px solid var(--gold);max-width:90vw;font-size:.95rem;box-shadow:0 14px 30px -10px rgba(0,0,0,.6);text-align:center}

.gal figure{margin:0}

.cardtxt{justify-content:space-between;padding:9% 0 9%}
.cardtxt .sm{width:34%;color:var(--gold-l);opacity:.85}
.seal{display:grid;place-items:center}
.seal .sealm{width:78%;height:78%;color:var(--maroon-d);opacity:.8}
.inner .gn{position:relative;width:min(46%,150px);color:var(--gold-d)}
.inner .gn svg{display:block;width:100%;height:auto}
.inner .gnt{margin-top:16px;font-size:clamp(1.5rem,6vw,2.1rem)!important;color:var(--maroon)}
.sdate{padding-top:12%}
.sdate b{font-size:clamp(4.6rem,22vw,6.4rem);font-weight:700}
.sdate span{font-size:clamp(1.25rem,5vw,1.6rem);font-weight:600;color:var(--head)}

/* cover: ivory-blush paper with gold foil */
.face{background:var(--tex),radial-gradient(circle at 50% 28%,#FBEFE4,#F0D6CC 70%,#E8C9C0);color:#B08A4E;box-shadow:0 30px 60px -20px rgba(0,0,0,.7),inset 0 0 40px rgba(176,138,78,.18)}
.door.l .face,.door.r .face{border-color:rgba(176,138,78,.7)}
.face::before{border-color:#B08A4E;opacity:1;box-shadow:0 0 0 1px rgba(255,248,230,.6)}
.face::after{border-color:rgba(176,138,78,.55)}
.face .hm{opacity:.75;color:#B08A4E;filter:drop-shadow(0 1px 0 rgba(255,250,235,.8))}
.face .cn{color:#B08A4E}.cardtxt .sm{color:#B08A4E;opacity:1;filter:drop-shadow(0 1px 0 rgba(255,250,235,.8))}
.seal{border:2px solid #F3DC9C;background:radial-gradient(circle at 32% 26%,#FFF4CC 0,#EBCF86 20%,#B98B3C 58%,#6F4E17 100%);box-shadow:0 10px 22px rgba(60,20,10,.55),inset 0 2px 3px rgba(255,248,220,.9),inset 0 -4px 6px rgba(80,50,10,.5),inset 0 0 0 6px rgba(150,105,40,.35)}
.seal .sealm{color:#5E3F0E;opacity:.85;filter:drop-shadow(0 1px 0 rgba(255,240,200,.8))}
.inner .ic{position:absolute;width:44px;height:44px;color:var(--gold-d)}
.inner .c1{top:14px;left:14px}.inner .c2{top:14px;right:14px;transform:scaleX(-1)}.inner .c3{bottom:14px;left:14px;transform:scaleY(-1)}.inner .c4{bottom:14px;right:14px;transform:scale(-1,-1)}
.fdiv{display:block;width:54px;height:54px;margin:14px auto 0;color:var(--gold-d);opacity:.8}
.sdate b{color:var(--head)}.sdate span{letter-spacing:.14em;font-size:clamp(1.05rem,4.4vw,1.4rem)}


/* ---------- OPENING: sealed envelope ---------- */
.open{position:fixed;inset:0;z-index:100;display:grid;place-items:center;background:radial-gradient(ellipse at 30% 20%,rgba(166,173,138,.3),transparent 55%),radial-gradient(ellipse at 75% 80%,rgba(232,199,196,.5),transparent 55%),var(--tex),#F3E6D3;overflow:hidden;transition:opacity .9s ease,visibility .9s;touch-action:manipulation}
.open.s-leaving{opacity:0;visibility:hidden}
.stage{position:relative;width:min(100vw,520px);height:min(100svh,960px);perspective:1900px;box-shadow:0 30px 80px -30px rgba(89,67,51,.5)}
.orn{position:absolute;pointer-events:none;user-select:none;-webkit-user-drag:none;height:auto}
.inner{position:absolute;inset:0;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(10px,2.2svh,20px);padding:max(26px,env(safe-area-inset-top)) 16px max(26px,env(safe-area-inset-bottom));background:radial-gradient(circle at 18% 34%,rgba(166,173,138,.3),transparent 46%),radial-gradient(circle at 82% 26%,rgba(232,199,196,.45),transparent 50%),var(--tex),linear-gradient(#FCF6EA,#F4E8D5)}
.inner .io-l{top:0;left:0;width:clamp(64px,19vw,100px)}.inner .io-r{top:0;right:0;width:clamp(64px,19vw,100px)}
.inner .io-bl{bottom:0;left:0;width:clamp(70px,22vw,110px)}.inner .io-br{bottom:0;right:0;width:clamp(64px,19vw,98px)}
.arch{position:relative;width:min(84vw,360px,calc((100svh - 190px)/1.433));aspect-ratio:300/430;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:7%;z-index:1;filter:drop-shadow(0 10px 18px rgba(89,67,51,.18))}
.archsvg{position:absolute;inset:0;width:100%;height:100%}
.gimg{position:relative;width:74%;aspect-ratio:952/1158}
.gimg img{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 8px 10px rgba(89,67,51,.25))}
.gtext{position:relative;font-family:var(--deva);color:var(--brown);font-size:clamp(1.15rem,4.6vw,1.5rem);margin-top:6px;text-align:center}
.cont{position:relative;z-index:2}
.inner .arch,.inner .cont,.inner .orn{opacity:0}
.s-open .inner .arch,.s-open .inner .cont,.s-open .inner .orn,.s-leaving .inner .arch,.s-leaving .inner .cont,.s-leaving .inner .orn{opacity:1}
@media(prefers-reduced-motion:no-preference){
 .inner .arch{transform:translateY(18px) scale(.97);transition:opacity 1.3s ease .5s,transform 1.5s cubic-bezier(.2,.7,.2,1) .5s}
 .s-open .inner .arch,.s-leaving .inner .arch{transform:none}
 .inner .orn{transition:opacity 1.6s ease 1s}
 .inner .cont{transition:opacity 1s ease 1.7s}
}
.flap{position:absolute;top:0;bottom:0;width:50%;z-index:4;transition:transform 1.8s cubic-bezier(.62,.02,.2,1),box-shadow 1.8s;backface-visibility:hidden;-webkit-backface-visibility:hidden;will-change:transform}
.flap.l{left:0;transform-origin:0 50%}.flap.r{right:0;transform-origin:100% 50%}
.s-open .flap.l,.s-leaving .flap.l{transform:rotateY(-115deg)}
.s-open .flap.r,.s-leaving .flap.r{transform:rotateY(115deg)}
.s-open .flap,.s-leaving .flap{pointer-events:none}
.fface{position:absolute;inset:0;overflow:hidden;background:var(--tex),linear-gradient(160deg,#FBEAD3,#F5E1C5 60%,#F1DABB)}
.flap.l .fface{box-shadow:inset 3px 0 0 rgba(255,255,255,.35)}
.fold{position:absolute;top:0;bottom:0}
.flap.l .fold{right:0;width:34px;background:linear-gradient(90deg,transparent,rgba(120,80,35,.2))}
.flap.r .fold{left:0;width:14px;background:linear-gradient(90deg,rgba(120,80,35,.3),rgba(255,255,255,.2),transparent)}
.fv1{top:0;left:0;width:116%;max-width:none;opacity:.95}.fv2{right:0;bottom:3%;width:114%;max-width:none}.fv3{top:20%;right:0;width:38%}
.wax{display:block;width:100%;height:auto}
.seal-btn{position:absolute;z-index:6;left:50%;top:47%;width:clamp(170px,54vw,240px);aspect-ratio:1;transform:translate(-50%,-50%);border:0;background:none;padding:0;cursor:pointer;filter:drop-shadow(0 12px 12px rgba(90,60,20,.4));transition:transform .7s ease,opacity .6s ease,filter .6s ease;border-radius:50%;-webkit-tap-highlight-color:transparent}
.seal-btn:disabled{cursor:default}
@media(prefers-reduced-motion:no-preference){.s-closed .seal-btn{animation:breathe 3.4s ease-in-out infinite}}
@keyframes breathe{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.035)}}
.s-glow .seal-btn{filter:drop-shadow(0 0 20px rgba(255,226,140,.95)) drop-shadow(0 0 54px rgba(255,214,110,.75)) brightness(1.2) saturate(1.1);transform:translate(-50%,-50%) scale(1.06)}
.s-lift .seal-btn,.s-open .seal-btn,.s-leaving .seal-btn{opacity:0;transform:translate(-50%,-66%) scale(1.18);pointer-events:none}
.hintbar{position:absolute;z-index:6;left:0;right:0;bottom:max(26px,env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:6px;transition:opacity .5s}
.s-glow .hintbar,.s-lift .hintbar,.s-open .hintbar,.s-leaving .hintbar{opacity:0;pointer-events:none}
.hint{font-style:italic;color:var(--brown);font-size:.95rem}
.skip{background:none;border:0;color:var(--muted);text-decoration:underline;font-family:var(--ui);font-size:.85rem;cursor:pointer;min-height:44px;padding:0 12px}
@media(prefers-reduced-motion:reduce){.flap,.seal-btn,.inner .arch{transition-duration:.01s!important}}
/* ---------- pastel page system ---------- */
section{background-image:var(--tex)}
.alt{background-color:var(--bg2);background-image:var(--tex)}
section.sage{background-color:var(--sage-l)}
section.peach{background-color:var(--blush-l)}
.sage,.peach,.hero,.cd-sec,.closing,.invite{overflow:hidden}
.wrap{position:relative;z-index:1}
.sec-head h2{font-size:clamp(1.6rem,5.2vw,2.6rem);line-height:1.2;font-weight:500;color:var(--brown)}
.sec-head .hi{font-size:clamp(1.05rem,3.4vw,1.35rem);color:var(--gold-d)}
.nav{background:color-mix(in srgb,var(--ivory) 94%,transparent)}
.brand{font-size:1.4rem;color:var(--brown)}.links a{font-size:.9rem}.ib{color:var(--brown)}
.btn{font-weight:500}
.btn.gold{background:linear-gradient(180deg,#E3C98B,#C6A15B);border-color:#A9843F;color:#3F2F23}
.btn.ghost{color:var(--brown)}
.o-leafL{top:0;left:0;width:clamp(56px,11vw,120px)}.o-leafR{top:0;right:0;width:clamp(56px,11vw,120px)}
.o-lotBL{bottom:0;left:0;width:clamp(64px,12vw,140px)}.o-lotBR{bottom:0;right:0;width:clamp(60px,10vw,120px)}
.o-lotL{left:0;bottom:6%;width:clamp(60px,11vw,130px)}.o-lotR{right:0;top:8%;width:clamp(60px,11vw,130px)}
.o-vineA{display:none;left:0;top:8%;width:clamp(100px,13vw,190px)}.o-vineB{display:none;right:0;bottom:6%;width:clamp(100px,13vw,190px)}
@media(min-width:900px){.o-vineA,.o-vineB{display:block}}
/* hero */
.hero{background-color:var(--bg);background-image:radial-gradient(ellipse at 50% 10%,rgba(232,199,196,.45),transparent 65%),radial-gradient(ellipse at 15% 80%,rgba(166,173,138,.3),transparent 55%),var(--tex);padding-top:clamp(56px,9vw,90px)}
.hero .ganesh{color:var(--gold-d);font-size:clamp(1.25rem,4.4vw,1.7rem)}
.hero .kicker{color:var(--muted);font-size:.8rem}
.hero .names{color:var(--brown);font-size:clamp(1.9rem,8.4vw,3.7rem);letter-spacing:.01em;font-weight:500;line-height:1.12;text-transform:none}
.hero .names .amp{color:var(--rose);font-style:italic;font-size:.7em;margin:2px 0}
.hero .hdate{color:var(--brown);border-color:var(--line);font-size:clamp(.95rem,3.5vw,1.2rem);letter-spacing:.22em}
.hero .quote{color:var(--muted);font-size:clamp(1rem,3.4vw,1.2rem)}
.frame{background:var(--card);box-shadow:0 30px 50px -28px rgba(89,67,51,.55),0 0 0 6px #EAD7B0,0 0 0 7px var(--gold)}
/* invitation */
.invite{padding:clamp(100px,14vw,150px) 0 clamp(120px,22vw,200px)}
.paper{background-color:var(--card);background-image:var(--tex);padding:clamp(44px,8vw,72px) clamp(22px,6vw,64px) clamp(36px,6vw,56px);border-color:var(--line)}
.paper::before,.paper::after{z-index:-1}
.paper::after{background:var(--blush)}
.paper::before{background:var(--sage)}
.paper .l1{font-style:italic;font-size:clamp(.98rem,3.3vw,1.18rem);line-height:1.8;max-width:34ch;margin:0 auto 22px;color:var(--text)}
.paper .l1.last{margin:22px auto 0}
.paper .pn{font-weight:600;color:var(--brown);font-size:clamp(1.55rem,6.4vw,2.6rem);line-height:1.2}
.paper .and{font-style:italic;color:var(--rose);font-size:1.3rem;margin:4px 0}
.paper .pm{display:block;width:58px;height:58px;margin:26px auto 0;color:var(--gold)}
.ornate{width:130px;color:var(--gold)}
/* save the date */
#save{padding:clamp(70px,10vw,110px) 0 clamp(90px,14vw,130px)}
.save h3{font-size:clamp(1.6rem,5vw,2.2rem);font-weight:500;color:var(--brown)}
.save .hi{color:var(--gold-d);font-size:1.15rem;display:block;margin-top:2px}
.scratch{width:min(310px,80vw)}
.sdate{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 0 12% 0;text-align:center}
.sdate b{font-size:clamp(4rem,19vw,5.2rem);line-height:.95;font-weight:600;color:var(--burg)}
.sdate span{font-size:clamp(.78rem,3.2vw,.95rem);letter-spacing:.1em;color:var(--brown);font-weight:500;margin-top:8px;padding-top:8px;border-top:1px solid var(--gold);width:62%;text-align:center}
/* family */
.fam{max-width:1040px;display:grid;gap:12px;grid-template-columns:minmax(0,1fr)}
@media(min-width:760px){.fam{grid-template-columns:minmax(0,1fr) 64px minmax(0,1fr);gap:0;align-items:stretch}.fam>.rv{height:100%}.fam .fcard{height:100%}}
.fdivider{display:flex;align-items:center;justify-content:center;position:relative;min-height:70px}
.fdivider::before{content:'';position:absolute;left:12%;right:12%;top:50%;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
.fdivider svg{position:relative;width:52px;height:52px;color:var(--gold-d);background:var(--bg2);border-radius:50%;padding:3px}
@media(min-width:760px){.fdivider::before{left:50%;right:auto;top:6%;bottom:6%;width:1px;height:auto;background:linear-gradient(transparent,var(--gold),transparent)}}
.fcard{background:var(--card)}
.fcard:first-child,.fam>.rv:first-child .fcard{background:linear-gradient(var(--card),var(--card))}
.fam>.rv:first-child .fcard{box-shadow:inset 0 0 0 100vmax rgba(166,173,138,.14)}
.fam>.rv:last-child .fcard{box-shadow:inset 0 0 0 100vmax rgba(232,199,196,.2)}
.fcard h3{font-size:clamp(1.35rem,4.4vw,1.75rem);font-weight:600;color:var(--brown)}
.fcard dd{font-size:1.15rem}.fcard .tag{font-size:1.2rem;color:var(--gold-d)}.fcard .tag .hi{font-size:1rem}.fcard dt{font-size:.82rem}
.fcard dt .hi{color:var(--gold-d)}
.fdiv{display:none}.famphoto .t{font-size:1.2rem;color:var(--brown)}
/* events */
.ev.haldi{--evb:#FBF3DF;--evi:#4A3828;--eva:#8E6516;--evart:#EBD9A8;--evl:rgba(198,161,91,.75)}
.ev.mehendi{--evb:#EDEFE0;--evi:#46442F;--eva:#5F6540;--evart:#E8C7C4;--evl:rgba(119,125,85,.45)}
.ev.wedding{--evb:#F8E7E3;--evi:#5A3A3A;--eva:#7E4651;--evart:#D9A5A5;--evl:rgba(126,70,81,.4)}
.ev.reception{--evb:#F7EEDA;--evi:#4A3828;--eva:#7B6A2A;--evart:#A6AD8A;--evl:rgba(198,161,91,.8)}
.ev .btn{background:var(--brown);border-color:var(--brown);color:var(--ivory)}
.wedding .day{color:var(--eva)}
.ev-body h3{font-size:clamp(1.35rem,4.2vw,1.7rem);font-weight:600}
.ev .date{font-size:1.2rem}.ev-body .day{font-size:.82rem}.ev-body .hi{font-size:1.05rem}
.tl::before{background:linear-gradient(var(--gold),var(--rose),var(--gold))}
.tl-dot{background:var(--ivory)}.tl-dot::after{background:var(--burg)}
/* countdown */
.cd-sec{background-color:var(--sage);background-image:var(--tex);color:var(--brown-d);padding-bottom:clamp(110px,18vw,170px)}
.cd-sec .sec-head h2{color:var(--brown-d)}.cd-sec .sec-head .hi{color:var(--brown)}
.cd .u{background:var(--ivory);border:1.5px solid var(--gold);color:var(--brown);box-shadow:0 0 0 3px rgba(248,240,229,.35)}
.cd .u b{font-size:clamp(1.7rem,8vw,3rem);font-weight:600;color:var(--burg)}
.cd .u span{color:var(--gold-d);font-size:.72rem;letter-spacing:.08em}.cd .u .hi{color:var(--brown);font-size:.8rem}
.cd-note{color:var(--brown-d)}.cd-done{font-size:clamp(1.4rem,4.6vw,2rem);color:var(--brown-d)}
.cd-tabs button{border-color:var(--brown);color:var(--brown-d)}.cd-tabs button[aria-pressed=true]{background:var(--brown);color:var(--ivory)}
/* venue / gallery / rsvp */
.vcard h3{font-size:clamp(1.4rem,4.4vw,1.75rem);color:var(--brown)}.vcard .lbl{font-size:1.1rem;color:var(--gold-d)}.vcard .pin{color:var(--rose)}
.gt{font-size:clamp(1.05rem,3.4vw,1.4rem);color:var(--brown)}
.lb{background:rgba(63,47,35,.94)}
.ctc h3{font-size:1.5rem;color:var(--brown);margin-top:2px}.ctc .wlb{font-style:italic;color:var(--gold-d)}
.ctc .num{display:block;font-size:1.35rem;text-decoration:none;color:var(--brown);font-weight:600}.ctc .num:hover{text-decoration:underline}
.ok{border-color:var(--sage);background:rgba(166,173,138,.2)}
/* closing */
.closing{background-color:var(--bg);background-image:radial-gradient(ellipse at 50% 0,rgba(232,199,196,.5),transparent 65%),var(--tex);color:var(--brown);padding-bottom:clamp(150px,24vw,230px)}
.closing .cm{position:absolute;left:50%;top:34%;width:min(900px,160vw);transform:translate(-50%,-50%);color:var(--gold);opacity:.22;pointer-events:none}
.closing .msg{font-size:clamp(1.4rem,4.8vw,2.2rem);color:var(--brown);max-width:22ch;font-weight:500}
.closing .l2{font-size:clamp(1.05rem,3.6vw,1.35rem);color:var(--gold-d)}
.closing .wl{display:none}
.closing .photo{background:var(--card);border-color:var(--gold);box-shadow:0 30px 50px -24px rgba(89,67,51,.55),0 0 0 6px #EAD7B0,0 0 0 7px var(--gold)}
.closing .btn.ghost{color:var(--brown);border-color:var(--brown)}
footer{background:var(--bg);color:var(--muted)}
.toast{background:var(--brown)}
.music button{background:var(--brown);border-color:var(--gold)}

/* ---- final fixes: icons, timeline, address ---- */
.fcard dt{display:flex;align-items:center;justify-content:center;gap:8px;font-size:.85rem;letter-spacing:.06em;color:var(--muted)}
.fcard dt .fi{width:26px;height:26px;color:var(--gold-d);flex:none}
.tl-dot{width:38px;height:38px;left:3px;top:24px;background:var(--ivory);border:1.5px solid var(--gold);box-shadow:0 0 0 4px rgba(232,214,174,.55)}
.tl-dot::after{display:none}.tl-dot svg{width:24px;height:24px}
@media(min-width:900px){.tl-dot{margin-left:-19px}}
.tl::before{width:0;background:none;border-left:2px dotted var(--gold);opacity:.9}
.ev-art{position:relative;overflow:hidden}
.ev-art .sp{position:absolute;bottom:0;width:54px;height:80px;color:var(--eva);opacity:.55;pointer-events:none}
.ev-art .sp.l{left:4px}.ev-art .sp.r{right:4px;transform:scaleX(-1)}
.ev-art svg:not(.sp){position:relative}
.ev .at{display:flex;flex-direction:column;gap:2px}.ev .at b{font-weight:600}.ev .at small{font-size:.82rem;opacity:.85;line-height:1.4}
.ev .at .warn{align-self:center}

/* ---------- v6: smoother seal + envelope ---------- */
.seal-btn{transition:transform 1.1s cubic-bezier(.22,.8,.24,1),opacity 1s cubic-bezier(.4,0,.2,1),filter .9s ease;will-change:transform,opacity}
.seal-btn:active:not(:disabled){transform:translate(-50%,-50%) scale(.965);transition-duration:.15s}
.seal-btn .wax{position:relative}
.sheen{position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 38%,rgba(255,255,255,0) 42%,rgba(255,252,235,.95) 50%,rgba(255,255,255,0) 58%,transparent 62%);background-size:300% 100%;background-position:130% 0;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;mix-blend-mode:soft-light;opacity:0}
.s-glow .sheen{opacity:1;animation:sweep 1.05s cubic-bezier(.4,.1,.3,1) forwards}
@keyframes sweep{from{background-position:130% 0}to{background-position:-30% 0}}
.s-glow .seal-btn{filter:drop-shadow(0 0 16px rgba(255,226,140,.8)) drop-shadow(0 0 38px rgba(255,214,110,.55)) brightness(1.1) saturate(1.05);transform:translate(-50%,-50%) scale(1.05) rotate(-1.2deg);animation:none}
.s-lift .seal-btn,.s-open .seal-btn,.s-leaving .seal-btn{opacity:0;transform:translate(-50%,-60%) scale(1.12) rotate(-3deg);transition:transform 1.3s cubic-bezier(.3,.6,.2,1),opacity 1.1s cubic-bezier(.4,0,.6,1) .1s,filter 1s ease;filter:drop-shadow(0 0 20px rgba(255,226,140,.6))}
.flap{transition:transform 2.4s cubic-bezier(.45,.05,.2,1);backface-visibility:hidden;-webkit-backface-visibility:hidden}
.flap.r{transition-delay:.07s}
.s-open .flap.l,.s-leaving .flap.l{transform:rotateY(-116deg)}
.s-open .flap.r,.s-leaving .flap.r{transform:rotateY(116deg)}
.cast{position:absolute;inset:0;z-index:3;pointer-events:none;opacity:0;background:linear-gradient(90deg,rgba(80,55,30,.2),transparent 24%,transparent 76%,rgba(80,55,30,.2))}
.s-open .cast{animation:castin 2.4s ease forwards}.s-leaving .cast{opacity:0}
@keyframes castin{0%{opacity:0}35%{opacity:1}100%{opacity:0}}
.inner{transform:scale(.97);transition:transform 2.6s cubic-bezier(.22,.8,.24,1)}
.s-open .inner,.s-leaving .inner{transform:none}
.inner .cont{transition:opacity 1.2s ease 2.2s}
.inner .arch{transition:opacity 1.6s ease .9s,transform 1.9s cubic-bezier(.22,.8,.24,1) .9s}
.inner .orn{transition:opacity 1.8s ease 1.4s}
@media(prefers-reduced-motion:reduce){.sheen{display:none}.s-glow .seal-btn{transform:translate(-50%,-50%)}.inner{transform:none}.cast{display:none}.flap,.seal-btn,.inner .arch,.inner .cont,.inner .orn{transition-duration:.01s!important;transition-delay:0s!important}}
.inner{padding-bottom:clamp(80px,17svh,150px)}
.arch{width:min(84vw,360px,calc((100svh - 300px)/1.433))}
.inner .io-l{top:0;left:0;width:clamp(64px,20vw,104px)}
.inner .io-r{top:0;right:0;left:auto;width:clamp(64px,20vw,104px);transform:scaleX(-1)}
.inner .io-br{bottom:0;right:0;left:auto;width:clamp(120px,40vw,190px)}
.inner .io-bl{bottom:0;left:0;right:auto;width:clamp(100px,32vw,150px);transform:scaleX(-1)}
/* ---------- v6: shloka, names, family, countdown ---------- */
.shloka{display:flex;flex-direction:column;align-items:center;gap:6px;margin:4px 0 2px}
.shloka .shm{width:46px;height:46px;color:var(--gold)}
.shloka .sh{font-family:var(--deva);font-size:clamp(1.15rem,4.6vw,1.6rem);line-height:1.75;color:var(--gold-d);text-align:center}
.hero .ganesh{font-size:clamp(1rem,3.6vw,1.3rem);color:var(--muted)}
.hero .names{color:#6B2C3C}.hero .names .amp{color:var(--gold)}
.paper .pn{color:#6B2C3C}.paper .and{color:var(--gold-d)}
.fcard h3{color:#6B2C3C}
.fcard .rel{font-size:clamp(1rem,3.4vw,1.2rem);line-height:1.7;max-width:26ch;margin:6px auto 0;color:var(--text)}
.fcard .rel .so{display:block;font-size:.8rem;letter-spacing:.18em;color:var(--gold-d);margin-bottom:2px}
.fcard .fdiv2{display:block;width:40px;height:40px;margin:12px auto 8px;color:var(--gold)}
.arch2{width:min(210px,64%);margin:16px auto 18px;padding:7px;border:1px solid var(--gold);border-radius:999px 999px 6px 6px}
.arch2 img{display:block;width:100%;height:auto;border-radius:999px 999px 3px 3px}
.cd-sec{background-color:#E2EBCF;background-image:radial-gradient(ellipse at 50% 0,rgba(244,227,222,.8),transparent 60%),var(--tex);color:var(--brown)}
.cd-sec .sec-head h2{color:var(--brown)}.cd-sec .sec-head .hi{color:var(--gold-d)}
.cd-date{position:relative;display:flex;flex-direction:column;align-items:center;margin:2px auto 26px}
.cd-date b{font-size:clamp(4.4rem,22vw,6.4rem);font-weight:600;line-height:.95;color:#6B2C3C}
.cd-date span{margin-top:8px;padding-top:9px;border-top:1px solid var(--gold);font-size:clamp(.9rem,3.6vw,1.15rem);letter-spacing:.18em;color:var(--brown);font-weight:500}
.cd .u{background:#FBF5EA;box-shadow:0 8px 18px -14px rgba(89,67,51,.4);border-color:var(--gold)}.cd .u b{color:#6B2C3C}
.cd-note{color:var(--muted)}
.cd-tabs button{border-color:var(--gold);color:var(--brown)}.cd-tabs button[aria-pressed=true]{background:var(--blush);color:var(--brown);border-color:var(--gold)}

/* ---------- v7 ---------- */
.o-leafR,.o-lotBL,.o-vineB,.fv2{transform:scaleX(-1)}
.o-vineB{transform:scaleX(-1)}
.inner .io-br{width:clamp(70px,22vw,112px)}
.inner .io-bl{width:clamp(58px,18vw,92px)}
.gsym{display:block;width:clamp(64px,17vw,92px);height:auto;margin:0 auto 2px}
.hero{padding-bottom:clamp(96px,14vw,150px)}
.hero .ganesh{color:var(--gold-d);font-size:clamp(1.15rem,4.2vw,1.5rem)}
.shloka{margin:2px 0}
.fcard .fdiv2{display:none}

/* ---------- v8: four-flap envelope, blur-in reveal ---------- */
.flap{display:none}
.tf{position:absolute;z-index:4;filter:drop-shadow(0 6px 9px rgba(90,60,25,.28));transition:transform 2.3s cubic-bezier(.45,.05,.2,1);backface-visibility:hidden;-webkit-backface-visibility:hidden;will-change:transform}
.tf .tfi{position:absolute;inset:0;overflow:hidden}
.tf.l{left:0;top:0;width:50.4%;height:100%;transform-origin:0 50%;z-index:4}
.tf.r{right:0;top:0;width:50.4%;height:100%;transform-origin:100% 50%;z-index:4}
.tf.b{left:0;bottom:0;width:100%;height:54%;transform-origin:50% 100%;z-index:5}
.tf.t{left:0;top:0;width:100%;height:55%;transform-origin:50% 0;z-index:6}
.tf.l .tfi{clip-path:polygon(0 0,100% 50%,0 100%);background:var(--tex),linear-gradient(100deg,#F7E6CE,#F2DDC0)}
.tf.r .tfi{clip-path:polygon(100% 0,0 50%,100% 100%);background:var(--tex),linear-gradient(260deg,#F5E2C8,#EFD8B9)}
.tf.b .tfi{clip-path:polygon(0 100%,100% 100%,50% 0);background:var(--tex),linear-gradient(0deg,#FAEBD6,#F1DCC0)}
.tf.t .tfi{clip-path:polygon(0 0,100% 0,50% 100%);background:var(--tex),linear-gradient(180deg,#F8E9D3,#F2DEC3)}
.tf .tl1{top:4%;left:-6%;width:84%;max-width:none;opacity:.95}
.tf .tr1{bottom:2%;right:-6%;width:84%;max-width:none;transform:scaleX(-1);opacity:.95}
.s-open .tf.l,.s-leaving .tf.l{transform:rotateY(-122deg)}
.s-open .tf.r,.s-leaving .tf.r{transform:rotateY(122deg)}
.s-open .tf.b,.s-leaving .tf.b{transform:rotateX(122deg)}
.s-open .tf.t,.s-leaving .tf.t{transform:rotateX(-122deg)}
.tf.b{transition-delay:0s}.tf.l,.tf.r{transition-delay:.22s}.tf.t{transition-delay:.48s}
.s-open .tf,.s-leaving .tf{pointer-events:none}
.seal-btn{--tilt:perspective(700px) rotateX(0) rotateY(0)}
.s-glow .seal-btn{transform:translate(-50%,-50%) perspective(700px) rotateX(9deg) rotateY(-11deg) scale(1.06)}
@media(prefers-reduced-motion:no-preference){.s-closed .sheen{animation:sweepLoop 5s ease-in-out 1.2s infinite}}
@keyframes sweepLoop{0%{opacity:0;background-position:130% 0}8%{opacity:1}30%{opacity:1;background-position:-30% 0}34%,100%{opacity:0;background-position:-30% 0}}
/* content reveal: blur-in with stagger (inspired by the reference video) */
.inner .arch{opacity:0;filter:blur(12px) drop-shadow(0 10px 18px rgba(89,67,51,.18));transform:translateY(14px) scale(.96);transition:opacity 1.7s ease .9s,filter 2s ease .9s,transform 2.2s cubic-bezier(.22,.8,.24,1) .9s}
.s-open .inner .arch,.s-leaving .inner .arch{opacity:1;filter:blur(0) drop-shadow(0 10px 18px rgba(89,67,51,.18));transform:none}
.inner .gtext{letter-spacing:.38em;opacity:0;filter:blur(7px);transition:letter-spacing 2.6s cubic-bezier(.22,.8,.24,1) 1.7s,opacity 1.6s ease 1.7s,filter 1.8s ease 1.7s}
.s-open .inner .gtext,.s-leaving .inner .gtext{letter-spacing:.03em;opacity:1;filter:blur(0)}
.inner .orn{transform:translateY(14px);transition:opacity 1.8s ease 1.3s,transform 2.2s cubic-bezier(.22,.8,.24,1) 1.3s}
.inner .io-l,.inner .io-r{transform:translateY(-14px)}.inner .io-r{transform:translateY(-14px) scaleX(-1)}
.inner .io-bl{transform:translateY(14px) scaleX(-1)}
.s-open .inner .orn,.s-leaving .inner .orn{transform:none}
.s-open .inner .io-r,.s-leaving .inner .io-r{transform:scaleX(-1)}
.s-open .inner .io-bl,.s-leaving .inner .io-bl{transform:scaleX(-1)}
.inner .cont{transition:opacity 1.3s ease 2.5s}
@media(prefers-reduced-motion:reduce){.tf{transition-duration:.01s!important;transition-delay:0s!important}.inner .arch,.inner .gtext,.inner .orn{transition-duration:.01s!important;transition-delay:0s!important;filter:none!important;letter-spacing:.03em!important}}
/* event art */
.ev-art{padding:12px 10px 8px}
.ev-art svg:not(.sp){height:132px}
/* hero spacing */
.shloka{margin:2px 0 clamp(16px,3.4vw,26px)}
.hero .names{margin-top:4px}

/* ================= v9: contrast + timeline redesign ================= */
:root{--gold-d:#6B4F16;--muted:#554232;--text:#3A2B1F;--head:#3A2B1F;--brown:#3A2B1F}
body{color:var(--text)}
.sec-head h2{color:#3A2B1F}
.sec-head .hi,section .sec-head .hi{color:#5E4310}
section:not(.alt):not(.cd-sec):not(.hero) .sec-head .hi{color:#4A2A2A}
.hero .ganesh,.hero .shloka .sh{color:#5E4310}
.hero .quote{color:#4B3A2C}.hero .hdate{color:#3A2B1F}
.hint{color:#3A2B1F}.skip{color:#4B3A2C}
.fcard .tag,.fcard .rel .so,.vcard .lbl,.ctc .wlb,.famphoto .t,.paper .and{color:#5E4310}
.fcard dt,.fcard .rel{color:#3A2B1F}
.cd-note{color:#3A2B1F}.cd .u span{color:#5E4310;font-size:.78rem}.cd .u .hi{color:#4A2A2A}
.closing .l2{color:#4A2A12}.closing .msg{color:#3A1C26}
.ctc .lab{color:#554232}.gt{color:#4A2A2A}
footer{color:#554232}
.vcard .addr,.field small{color:#554232}
/* timeline */
.tl::before{border-left:0;width:3px;background:linear-gradient(#C6A15B,#D9A5A5,#A6AD8A,#C6A15B);border-radius:3px;opacity:.85}
.tl-item .tl-dot{width:50px;height:50px;border-radius:50%;left:-3px;top:18px;display:grid;place-items:center;background:var(--dotbg,#FFF6DA);border:2px solid var(--dotbd,#C6A15B);box-shadow:0 0 0 5px rgba(255,251,242,.85),0 8px 14px -8px rgba(60,40,20,.5)}
.tl-item .tl-dot svg{width:30px;height:30px}
.tl-item.haldi{--dotbg:#FFF1C2;--dotbd:#D9A92E}.tl-item.mehendi{--dotbg:#E3EAC9;--dotbd:#8B9B55}.tl-item.wedding{--dotbg:#F8D9D4;--dotbd:#C97B85}.tl-item.reception{--dotbg:#F0DEBC;--dotbd:#B58A3C}
@media(min-width:900px){.tl-item .tl-dot{left:50%;margin-left:-25px}}
.ev{border-radius:30px 30px 16px 16px;border:1.5px solid var(--evl);box-shadow:0 24px 36px -26px rgba(58,43,31,.7);background:var(--evb);color:var(--evi);overflow:hidden}
.ev::after{display:none}
.ev.haldi{--evb:#FFF7DE;--evart:#F8E3A0;--evi:#44330A;--eva:#7A5207;--evl:#DDB752;--evbt:#7A5207}
.ev.mehendi{--evb:#F0F3E2;--evart:#CDD7AE;--evi:#26331A;--eva:#4F5E27;--evl:#A5B47A;--evbt:#4F5E27}
.ev.wedding{--evb:#FDECE8;--evart:#F2C3BD;--evi:#4E1F2B;--eva:#7D2C3F;--evl:#D9A0A6;--evbt:#7D2C3F}
.ev.reception{--evb:#F8EEDB;--evart:#E6D0A6;--evi:#3A2812;--eva:#6F4A17;--evl:#C9A663;--evbt:#6F4A17}
.ev-arch{background:linear-gradient(var(--evart),color-mix(in srgb,var(--evart) 55%,var(--evb)));padding:16px 12px 0;border-bottom:1.5px solid var(--evl)}
.ev-arch svg{display:block;width:100%;height:auto;max-height:158px}
.ev-body{padding:20px 20px 26px}
.ev-date{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:6px}
.ev-date b{font-family:var(--serif);font-size:3.4rem;font-weight:600;line-height:1;color:var(--eva)}
.ev-date>div{display:flex;flex-direction:column;align-items:flex-start;text-align:left;border-left:2px solid var(--evl);padding-left:14px}
.ev-date .mon{font-size:.9rem;letter-spacing:.14em;font-weight:600;color:var(--evi)}
.ev-date .wd{font-style:italic;font-size:.95rem;color:var(--evi);opacity:1}
.ev-body h3{font-size:clamp(1.45rem,4.6vw,1.85rem);font-weight:600;color:var(--evi);margin:10px 0 0}
.ev-body .hi{color:var(--eva);display:block;font-size:1.1rem;margin-bottom:12px}
.ev-time{display:inline-flex;align-items:center;gap:8px;padding:8px 18px;border-radius:999px;border:1.5px solid var(--eva);background:color-mix(in srgb,var(--evart) 40%,transparent);color:var(--evi);font-weight:600;font-size:1rem;margin-bottom:14px}
.ev-time .ci{width:18px;height:18px;color:var(--eva)}
.ev .at{display:flex;flex-direction:column;gap:2px;margin:0 0 16px;color:var(--evi);opacity:1}
.ev .at b{font-weight:600;font-size:1.05rem}.ev .at small{font-size:.9rem;opacity:1;color:var(--evi);line-height:1.45}
.ev .btn{background:var(--evbt);border-color:var(--evbt);color:#FFF8EA}
.ev .warn{align-self:center;background:rgba(255,255,255,.5);border:1px dashed var(--eva);color:var(--evi)}

/* v10: directions button text */
.ev .btn,.vcard .btn:not(.ghost){color:#FFFFFF;font-weight:600;letter-spacing:.01em;text-shadow:0 1px 1px rgba(0,0,0,.25)}
.ev .btn svg,.vcard .btn:not(.ghost) svg{color:#FFFFFF}
.ev.wedding .btn,.ev.haldi .btn,.ev.mehendi .btn,.ev.reception .btn{color:#FFFFFF}

/* v11: hero names, glitter scratch, bigger date */
.hero .names{font-size:clamp(1.5rem,6.6vw,2.9rem)}
.scratch{width:min(340px,88vw)}
.glit{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2}
.gp{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3}
.tw{animation:twinkle 2.4s ease-in-out infinite;opacity:0}
@keyframes twinkle{0%,100%{opacity:0;transform:scale(.2) rotate(0)}45%{opacity:1;transform:scale(1.25) rotate(45deg)}70%{opacity:.4;transform:scale(.7) rotate(60deg)}}
.shim{animation:shimmer 3.4s ease-in-out infinite;mix-blend-mode:soft-light}
@keyframes shimmer{0%{transform:translateX(0) rotate(18deg)}60%,100%{transform:translateX(520px) rotate(18deg)}}
@media(prefers-reduced-motion:reduce){.tw{animation:none;opacity:.7;transform:none}.shim{animation:none;display:none}}
.sdate{padding-bottom:9%}
.sdate b{font-family:var(--serif);font-style:italic;font-weight:700;font-size:clamp(5.2rem,27vw,7.4rem);line-height:.9;background:linear-gradient(160deg,#7A2F43 10%,#A0603A 60%,#6B2C3C);-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;padding:0 .08em}
.sdate span{font-size:clamp(.82rem,3.3vw,1rem);letter-spacing:.14em;font-weight:600;color:#3A2B1F;width:64%;margin-top:6px;padding-top:8px}
.scratch canvas.gp{pointer-events:none;cursor:default;touch-action:auto}
`;

const CONFIG = {
  couple: { groom: 'Pushpshekhar Gupta', bride: 'Chandani Maddheshiya' },
  hostFamily: 'Maddheshiya Family',
  dateLabel: '12 December 2026',
  families: {
    groom: { mother: 'Pushpa Gupta', father: 'Late Chandra Shekhar Gupta', line: ['S/O', 'Pushpa Gupta & Late Chandra Shekhar Gupta'] },
    bride: { mother: 'Kushum Devi', father: 'Kishori Lal Maddheshiya', line: ['D/O', 'Kushum Devi & Kishori Lal Maddheshiya'] }
  },
  venues: {
    wedding: {
      name: 'Ambika Marriage House',
      label: 'Wedding Venue',
      short: 'Pipiganj, Gorakhpur, Uttar Pradesh 273165',
      address: 'Ambika Marriage House, Pipiganj, Gorakhpur, Uttar Pradesh, India',
      mapsUrl: 'https://www.google.com/maps/dir//Ambika+Marriage+House,+W8M3%2BX5,+Peppeganj,+Uttar+Pradesh+273165/@28.585675,77.1830238,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x39914bf964e15bf1:0x2823da8e90d62182!2m2!1d83.302906!2d26.9349055?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D',
      verified: true
    },
    haldiMehendi: {
      label: 'Haldi & Mehendi Venue',
      name: 'Sachidanand Bhavan',
      short: 'D-135, Sector 5, GIDA, Gorakhpur, Uttar Pradesh 273209',
      address: 'Sachidanand Bhavan, D-135, Sector 5, GIDA, Gorakhpur, Uttar Pradesh 273209',
      mapsUrl: 'https://google.com/maps?sca_esv=e7222caca06c9bd0&rlz=1C5GCEM_enIN1182IN1185&sxsrf=APpeQntHhnNbfPVJPO-tN1NdShSfOZr-tg:1791805821770&biw=1512&bih=861&uact=5&gs_lp=Egxnd3Mtd2l6LXNlcnAiGGNyZWF0aXZlIHRoZWthIGdvcmFraHB1cjIFECEYoAEyBRAhGKABSLgjUOYGWMkicAF4AJABAJgBwQGgAdUKqgEDMC45uAEDyAEA-AEBmAIKoAL8CsICCBAAGIAEGLADwgIOEAAYgAQYigUYhgMYsAPCAggQABjvBRiwA8ICCxAAGIAEGKIEGLADwgIGEAAYFhgewgILEAAYgAQYigUYhgPCAgUQABjvBcICCBAAGIAEGKIEwgIFECEYnwWYAwCIBgGQBgiSBwMxLjmgB7ocsgcDMC45uAf5CsIHBTAuOS4xyAcSgAgB&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KfH2hwbzR5E5MaeaF3vNhAK9&daddr=D+135,+Sector+5,+Gida,+Gorakhpur,+Uttar+Pradesh+273209',
      verified: true
    },
    reception: {
      name: 'Mangalam Marriage House',
      label: 'Reception Venue',
      short: 'Saraya, Gorakhpur, Uttar Pradesh 273209',
      address: 'Mangalam Marriage House, Saraya, Gorakhpur, Uttar Pradesh 273209',
      // Edit this URL if the reception location changes:
      mapsUrl: 'https://maps.app.goo.gl/8neAxUcnaAxVKALB7',
      verified: true
    }
  },
  events: [
    { id: 'haldi', theme: 'haldi', title: 'Haldi', hi: 'हल्दी रस्म', date: '2026-12-10', dateLabel: '10 December 2026', time: '10:00 AM onwards', venue: 'haldiMehendi' },
    { id: 'mehendi', theme: 'mehendi', title: 'Mehendi & Sangeet', hi: 'मेहंदी एवं संगीत', date: '2026-12-10', dateLabel: '10 December 2026', time: '5:00 PM onwards', venue: 'haldiMehendi' },
    { id: 'wedding', theme: 'wedding', title: 'Wedding', hi: 'विवाह समारोह', date: '2026-12-12', dateLabel: '12 December 2026', time: '3:00 PM onwards', venue: 'wedding' },
    { id: 'reception', theme: 'reception', title: 'Reception', hi: 'स्वागत समारोह', date: '2026-12-14', dateLabel: '14 December 2026', time: '7:00 PM onwards', venue: 'reception' }
  ],
  // Countdown targets are ISO strings with the +05:30 (IST) offset, so they are identical for every viewer.
  // The exact ceremony / pheras time was NOT supplied: the wedding countdown uses 
  // time for 12 Dec. Change `target` if you prefer another moment.
  countdown: {
    wedding: { tab: 'Wedding', day: '12', month: 'DECEMBER 2026', target: '2026-12-12T15:00:00+05:30', caption: 'Counting down to Saturday, 12 December 2026, 3:00 PM IST.' },
    reception: { tab: 'Reception', day: '14', month: 'DECEMBER 2026', target: '2026-12-14T19:00:00+05:30', caption: 'Counting down to the Reception — 14 December 2026, 7:00 PM IST.' }
  },
  contacts: [
    { label: 'Contact 1', display: '96488 64881', number: '9648864881' },
    { label: 'Contact 2', display: '95597 10782', number: '9559710782' }
  ],
  // Put a direct URL to an .mp3/.m4a you have rights to use here (must be allowed by the page's content-security policy).
  // The supplied track is embedded; set to '' to fall back to the generated placeholder drone.
  music: { src: MUSIC, placeholderLabel: 'Ambient drone (placeholder)' },
  shareUrl: '', // leave empty to share the page's own address
  messages: {
    hero: 'Together with our families, we invite you to celebrate our wedding.',
    inviteIntro: 'With the blessings of Lord Ganesha and the love of our families, we invite you to celebrate the wedding of',
    inviteOutro: 'Join us as we begin a beautiful new chapter together.',
    closing1: 'Two hearts, one journey, a lifetime of memories.',
    closing2: 'Thank you for being a part of our celebration.',
    done: 'Our celebration, our forever memories.'
  }
};
const PHOTOS = {
  bride: { ...IMG.bride, alt: 'Chandani with eyes closed, adjusting her hair, in an embroidered outfit with green jewellery and henna against a red backdrop', section: "Bride's Portraits" },
  groom: { ...IMG.groom, alt: 'Pushpshekhar seated cross-legged in a light pink kurta with a white head cloth, holding marigold petals during a ritual', section: "Groom's Moments" },
  walking: { ...IMG.walking, alt: 'Pushpshekhar and Chandani walking together hand in hand, she smiling down, he glancing at her', section: "Couple's Story" },
  editorial: { ...IMG.editorial, alt: 'Pushpshekhar and Chandani standing together in coordinated blush and champagne outfits against a dark backdrop', section: "Couple's Story" },
  hands: { ...IMG.hands, alt: 'Close-up of the couple holding hands, her hand decorated with henna and bangles', section: 'Wedding Details' },
  family: { ...IMG.family, alt: 'The couple seated on a golden sofa with family members in front of a floral backdrop', section: 'Family Memories' }
};
const GALLERY_ORDER = ['walking', 'editorial', 'hands', 'family'];

/* ===================================================================== */
// React hooks imported at top
const h = React.createElement;
const Hi = ({ children, className = '' }) => h('span', { className: 'hi ' + className, lang: 'hi' }, children);
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const waLink = (num, text) => 'https://wa.me/91' + num + (text ? '?text=' + encodeURIComponent(text) : '');
const venueOf = (k) => CONFIG.venues[k];

async function copyText(t) {
  try { await navigator.clipboard.writeText(t); return true; }
  catch (e) {
    try { const ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0;top:0'; document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok; }
    catch (e2) { return false; }
  }
}

/* ---------- icons ---------- */
const P = {
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  chat: 'M4 20l1.3-4A8 8 0 1 1 8 18.7z M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  copy: 'M9 9h11v11H9z M5 15V5a2 2 0 0 1 2-2h8',
  share: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M8.6 13.5l6.8 4 M15.4 6.5l-6.8 4',
  left: 'M15 5l-7 7 7 7', right: 'M9 5l7 7-7 7', close: 'M5 5l14 14M19 5L5 19', menu: 'M4 7h16M4 12h16M4 17h16',
  note: 'M9 18V6l10-2v12 M9 18a3 3 0 1 1-3-3 M19 16a3 3 0 1 1-3-3',
  pause: 'M8 5v14M16 5v14', cal: 'M4 6h16v14H4z M4 10h16 M8 3v4M16 3v4', zoom: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-5-5 M11 8v6M8 11h6', send: 'M3 11l18-8-8 18-2-8z'
};
const Ic = ({ n, size }) => h('svg', { className: 'ic', viewBox: '0 0 24 24', 'aria-hidden': true, width: size, height: size }, P[n].split(' M').map((d, i) => h('path', { key: i, d: (i ? 'M' : '') + d })));

/* ---------- ornaments ---------- */
const mandalaPaths = (rings = 4) => {
  const els = [];
  [[8, 14, 30, 7], [12, 26, 52, 10], [16, 44, 74, 12], [24, 62, 94, 12]].slice(0, rings).forEach(([n, r0, r1, w], ri) => {
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i + (ri % 2 ? 360 / n / 2 : 0); const m = r0 + (r1 - r0) * 0.38;
      els.push(h('path', { key: ri + '-' + i, transform: 'rotate(' + a + ')', d: `M0 ${-r0} C ${w} ${-m} ${w * 0.55} ${-(r1 - 6)} 0 ${-r1} C ${-w * 0.55} ${-(r1 - 6)} ${-w} ${-m} 0 ${-r0}Z` }));
    }
  });
  return els;
};
function Mandala({ className, rings = 4, sw = 0.8 }) {
  return h('svg', { className, viewBox: '-100 -100 200 200', fill: 'none', stroke: 'currentColor', strokeWidth: sw, 'aria-hidden': true },
    h('circle', { r: 98 }), h('circle', { r: 5 }), h('circle', { r: 96.5, strokeDasharray: '1 3' }), mandalaPaths(rings));
}
const MandalaG = ({ rings = 4, sw = .8, scale = 1, color = '#C6A15B', opacity = 1 }) => h('g', { transform: 'scale(' + scale + ')', fill: 'none', stroke: color, strokeWidth: sw, opacity },
  h('circle', { r: 98 }), h('circle', { r: 5 }), h('circle', { r: 96.5, strokeDasharray: '1 3' }), mandalaPaths(rings));
const Corner = ({ className }) => h('svg', { className: 'cn ' + className, viewBox: '0 0 60 60', fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', 'aria-hidden': true },
  h('path', { d: 'M3 57V22C3 11 11 3 22 3h35' }), h('path', { d: 'M9 57V24C9 14 14 9 24 9h33', opacity: .6 }),
  h('path', { d: 'M3 22c0-8 8-12 14-8s2 12-5 10' }), h('circle', { cx: 15, cy: 15, r: 2.2, fill: 'currentColor', stroke: 'none' }),
  h('circle', { cx: 30, cy: 6, r: 1.2, fill: 'currentColor' }), h('circle', { cx: 6, cy: 30, r: 1.2, fill: 'currentColor' }));
const Lotus = ({ className, style }) => h('svg', { className, style, viewBox: '0 0 160 30', fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', 'aria-hidden': true },
  h('path', { d: 'M2 15h56M102 15h56' }), h('circle', { cx: 64, cy: 15, r: 1.5, fill: 'currentColor' }), h('circle', { cx: 96, cy: 15, r: 1.5, fill: 'currentColor' }),
  h('path', { d: 'M80 5c5 4 8 9 0 20-8-11-5-16 0-20z' }), h('path', { d: 'M80 25c-9-1-15-6-16-12 6 0 12 3 16 12z M80 25c9-1 15-6 16-12-6 0-12 3-16 12z' }));
const Orn = ({ k, className }) => h('img', { className: 'orn ' + className, src: ORN[k], alt: '', 'aria-hidden': true, draggable: false, decoding: 'async' });
const Frame = ({ children, className = '' }) => h('div', { className: 'frame ' + className },
  ['c1', 'c2', 'c3', 'c4'].map(c => h(Corner, { key: c, className: c })), children);

/* event illustrations */
function Marigold({ cx, cy, r, c1, c2 }) {
  const ps = []; for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; ps.push(h('circle', { key: i, cx: cx + Math.cos(a) * r * .62, cy: cy + Math.sin(a) * r * .62, r: r * .4, fill: i % 2 ? c1 : c2 })); }
  return h('g', null, ps, h('circle', { cx, cy, r: r * .5, fill: c1 }), h('circle', { cx, cy, r: r * .22, fill: '#8a4b00' }));
}
const FamIcon = ({ k }) => h('svg', { className: 'fi', viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
  h('circle', { cx: 16, cy: 16, r: 14.5, strokeWidth: .8, opacity: .7 }),
  k === 'Mother'
    ? [h('path', { key: 1, d: 'M16 6c3 3 4.6 6.4 0 12-4.6-5.6-3-9 0-12z', fill: 'rgba(217,165,165,.35)' }), h('path', { key: 2, d: 'M16 19c-5-.4-8.4-3.2-9.4-7 4 .2 7.4 2.4 9.4 7zM16 19c5-.4 8.4-3.2 9.4-7-4 .2-7.4 2.4-9.4 7z', fill: 'rgba(217,165,165,.22)' }), h('path', { key: 3, d: 'M16 19v7M12 26h8' }), h('circle', { key: 4, cx: 16, cy: 12, r: .9, fill: 'currentColor', stroke: 'none' })]
    : [h('path', { key: 1, d: 'M11 13h10c.8 2 1.6 4 1.6 6.4 0 3.4-3 5.6-6.6 5.6s-6.6-2.2-6.6-5.6C9.4 17 10.2 15 11 13z', fill: 'rgba(166,173,138,.3)' }), h('path', { key: 2, d: 'M12.6 13c-.6-1-1-2-1-3M19.4 13c.6-1 1-2 1-3M16 13V8' }), h('path', { key: 3, d: 'M16 8c-3-2-5-1.4-6 .4 2 1.6 4.4 1.4 6-.4zM16 8c3-2 5-1.4 6 .4-2 1.6-4.4 1.4-6-.4z', fill: 'rgba(166,173,138,.45)' }), h('path', { key: 4, d: 'M10 19h12', opacity: .6 }), h('circle', { key: 5, cx: 16, cy: 21.5, r: 1.3, fill: 'currentColor', stroke: 'none' })]);
const Sprig = ({ className }) => h('svg', { className: 'sp ' + className, viewBox: '0 0 60 90', fill: 'none', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round', 'aria-hidden': true },
  h('path', { d: 'M8 88C10 60 14 40 26 6' }),
  [[12, 70, 1], [14, 54, -1], [18, 40, 1], [21, 26, -1], [24, 14, 1]].map(([x, y, s], i) => h('path', { key: i, d: `M${x} ${y} q${11 * s} -4 ${15 * s} -13 q${-11 * s} 1 ${-15 * s} 13z`, fill: 'rgba(198,161,91,.18)' })),
  h('circle', { cx: 26, cy: 5, r: 2.2, fill: 'currentColor', stroke: 'none' }));
const LotusDot = () => h('svg', { viewBox: '0 0 32 32', 'aria-hidden': true, fill: 'none', stroke: '#C6A15B', strokeWidth: 1.1, strokeLinejoin: 'round' },
  h('path', { d: 'M16 5c3.4 3.2 4.6 8 0 15-4.6-7-3.4-11.8 0-15z', fill: '#F4D9D5' }),
  h('path', { d: 'M16 20C10 20 5.6 16.6 4.6 12c4.8.2 9.2 2.8 11.4 8zM16 20c6 0 10.4-3.4 11.4-8-4.8.2-9.2 2.8-11.4 8z', fill: '#E8C7C4' }),
  h('path', { d: 'M16 21c-4 .2-7.4 2.2-9 5 3.6.2 7-1.2 9-5zM16 21c4 .2 7.4 2.2 9 5-3.6.2-7-1.2-9-5z', fill: '#DCDFCA' }), h('circle', { cx: 16, cy: 13, r: 1.2, fill: '#C6A15B', stroke: 'none' }));
const GOLD = '#C6A15B';
const Marigold2 = ({ x, y, r, c1 = '#F4CF7E', c2 = '#EBB164', rot = 0 }) => {
  const outer = [], inner = [];
  for (let i = 0; i < 14; i++) { const t = i * 360 / 14; outer.push(h('ellipse', { key: 'o' + i, cx: r * .6, cy: 0, rx: r * .34, ry: r * .17, transform: `rotate(${t})`, fill: c1, stroke: GOLD, strokeWidth: .45 })); }
  for (let i = 0; i < 9; i++) { const t = i * 360 / 9 + 10; inner.push(h('ellipse', { key: 'i' + i, cx: r * .32, cy: 0, rx: r * .22, ry: r * .12, transform: `rotate(${t})`, fill: c2, stroke: GOLD, strokeWidth: .35 })); }
  return h('g', { transform: `translate(${x} ${y}) rotate(${rot})` }, outer, inner, h('circle', { r: r * .15, fill: '#B8741E' }), h('circle', { r: r * .06, fill: '#F9E2A0' }));
};
const Leaf = ({ rot = 0, len = 28, x = 0, y = 0, fill = '#B9C09E', stroke = '#8E9A72' }) => h('g', { transform: `translate(${x} ${y}) rotate(${rot}) scale(${len / 30})` },
  h('path', { d: 'M0 0C7-8 7-21 0-30 -7-21 -7-8 0 0Z', fill, stroke, strokeWidth: .9 }), h('path', { d: 'M0 -2V-26', stroke, strokeWidth: .6 }));
const Diya = ({ x, y, s = 1 }) => h('g', { transform: `translate(${x} ${y}) scale(${s})` },
  h('path', { d: 'M-9 0q9 10 18 0z', fill: '#E8D6AE', stroke: GOLD, strokeWidth: 1 }), h('path', { d: 'M0-1c-4-4-1-9 0-12 1 3 4 8 0 12z', fill: '#F7C75A', stroke: '#C98F1F', strokeWidth: .6 }));
const Sparkle = ({ x, y, s = 1 }) => h('path', { d: `M${x} ${y - 4 * s}L${x + 1.1 * s} ${y - 1.1 * s}L${x + 4 * s} ${y}L${x + 1.1 * s} ${y + 1.1 * s}L${x} ${y + 4 * s}L${x - 1.1 * s} ${y + 1.1 * s}L${x - 4 * s} ${y}L${x - 1.1 * s} ${y - 1.1 * s}Z`, fill: GOLD, opacity: .9 });
function Art({ id }) {
  const s = { viewBox: '0 0 240 120', role: 'img', 'aria-hidden': true, preserveAspectRatio: 'xMidYMid meet' };
  const side = (dir) => h('g', { key: dir, transform: dir < 0 ? 'translate(240 0) scale(-1 1)' : undefined, fill: 'none', stroke: GOLD, strokeWidth: .9, strokeLinecap: 'round' },
    h('path', { d: 'M12 96H56' }), h('path', { d: 'M8 96l4-3 4 3-4 3z', fill: GOLD }), h('circle', { cx: 61, cy: 96, r: 1.5, fill: GOLD, stroke: 'none' }),
    h('path', { d: 'M18 130C20 112 28 98 44 84' }),
    [[22, 118, 1], [26, 106, -1], [32, 96, 1], [38, 88, -1]].map(([x, y, sg], k) => h('path', { key: k, d: `M${x} ${y} q${8 * sg} -2 ${11 * sg} -9 q${-8 * sg} 1 ${-11 * sg} 9z`, fill: 'rgba(198,161,91,.22)' })),
    h('circle', { cx: 46, cy: 82, r: 2.2, fill: GOLD, stroke: 'none' }));
  const AP = 'M62 130V56C62 24 90 6 120 6S178 24 178 56V130Z';
  const frame = (scene) => h('svg', { ...s, viewBox: '0 0 240 134' },
    h('defs', null, h('linearGradient', { id: 'ag' + id, x1: 0, y1: 0, x2: 0, y2: 1 }, h('stop', { offset: 0, stopColor: '#FFFDF7' }), h('stop', { offset: 1, stopColor: '#FBF0E2' }))),
    h('g', { transform: 'translate(120 72)', opacity: .15 }, h(MandalaG, { rings: 4, sw: .7, scale: .64 })),
    side(-1), side(1),
    h('path', { d: AP, fill: 'url(#ag' + id + ')', stroke: GOLD, strokeWidth: 1.8 }),
    h('path', { d: AP, fill: 'none', stroke: GOLD, strokeWidth: .7, transform: 'translate(120 130) scale(.925) translate(-120 -130)' }),
    h('path', { d: AP, fill: 'none', stroke: GOLD, strokeWidth: 1.4, strokeDasharray: '.1 3.3', strokeLinecap: 'round', transform: 'translate(120 130) scale(.86) translate(-120 -130)' }),
    h('g', { transform: 'translate(120 76) scale(.84)' }, scene));
  if (id === 'haldi') return frame(h('g', null,
    [-44, -22, 0, 22, 44].map((r, i) => h(Leaf, { key: i, rot: r, len: 30, x: 0, y: -4 })),
    h(Marigold2, { x: -27, y: -8, r: 13 }), h(Marigold2, { x: 27, y: -8, r: 13, rot: 20 }), h(Marigold2, { x: 0, y: -31, r: 9.5, rot: 10, c1: '#F7DA92' }),
    h('path', { d: 'M-26 6h52c0 16-11 26-26 26S-26 22-26 6z', fill: '#FAEBC0', stroke: GOLD, strokeWidth: 1.3 }),
    h('path', { d: 'M-23 15H23M-20 22H20', stroke: GOLD, strokeWidth: .8, opacity: .8 }),
    [-14, -7, 0, 7, 14].map(x => h('circle', { key: x, cx: x, cy: 18.5, r: 1, fill: GOLD })),
    h('path', { d: 'M0 31q-5-5 0-11q5 6 0 11z', fill: '#F0C9C3', stroke: GOLD, strokeWidth: .6 }),
    h('ellipse', { cx: 0, cy: 6, rx: 26, ry: 5.2, fill: '#F2C54E', stroke: GOLD, strokeWidth: 1.1 }),
    h('path', { d: 'M-17 6C-11-8 11-8 17 6C8 9-8 9-17 6z', fill: '#E7AB2B', stroke: '#B8821C', strokeWidth: .6 }),
    [[-36, 14], [34, 18], [-30, 28], [31, 29]].map(([x, y], i) => h('ellipse', { key: i, cx: x, cy: y, rx: 3.2, ry: 1.7, fill: '#F4CF7E', stroke: GOLD, strokeWidth: .4, transform: `rotate(${i * 40 - 20} ${x} ${y})` }))));
  if (id === 'mehendi') {
    const finger = (x, ang, len, w) => h('path', { key: x, transform: `translate(${x} -2) rotate(${ang})`, d: `M${-w / 2} 0V${-len + w / 2}A${w / 2} ${w / 2} 0 0 1 ${w / 2} ${-len + w / 2}V0Z`, fill: 'rgba(240,206,199,.85)', stroke: GOLD, strokeWidth: 1 });
    const henna = '#8E4A38';
    return frame(h('g', { transform: 'translate(0 4)' },
      finger(-10.5, -9, 25, 7.6), finger(-3.5, -3, 29, 7.8), finger(3.5, 4, 26, 7.6), finger(10.5, 12, 20, 6.8),
      h('path', { d: 'M-14 8C-19 4-22 -2-20 -9 -18 -12-15 -11-14 -8 -12-2-12 2-10 6Z', transform: 'translate(-3 8) rotate(-18 -14 4)', fill: 'rgba(240,206,199,.85)', stroke: GOLD, strokeWidth: 1 }),
      h('path', { d: 'M-15 32C-19 20-20 8-17 -2L17 -2C20 8 19 20 15 32Z', fill: 'rgba(240,206,199,.92)', stroke: GOLD, strokeWidth: 1.1 }),
      h('g', { fill: 'none', stroke: henna, strokeWidth: .8, strokeLinecap: 'round' },
        h('g', { transform: 'translate(0 12) scale(.12)' }, h(MandalaG, { rings: 3, sw: 5, color: henna })),
        h('path', { d: 'M-12 25C-6 21 6 21 12 25M-10 28C-4 25 4 25 10 28' }), h('path', { d: 'M-10.5 -4V-20M-3.5 -4V-24M3.5 -4V-21M10.5 -4V-14', strokeDasharray: '.1 2.6' }),
        [-9, -3, 3, 9].map((x, i) => h('circle', { key: x, cx: x + (i < 1 ? -1 : i > 2 ? 1.5 : 0), cy: -4, r: 1, fill: henna, stroke: 'none' }))),
      h('g', { fill: 'none', stroke: GOLD, strokeWidth: 1.3, strokeLinecap: 'round' }, h('path', { d: 'M-40 -6V-20l8-2V-8M-40-6a3 3 0 1 1-3-3', transform: 'translate(0 2)' }), h('path', { d: 'M32-14V-28l8-2V-16M32-14a3 3 0 1 1-3-3', transform: 'translate(2 8)' }))));
  }
  if (id === 'wedding') return frame(h('g', null,
    h('g', { transform: 'translate(0 30)' }, [-60, -30, 0, 30, 60].map((r, i) => h('path', { key: i, transform: `rotate(${r})`, d: 'M0 0C-7-8-7-17 0-25 7-17 7-8 0 0Z', fill: i % 2 ? '#F0C9C3' : '#FBE9E5', stroke: GOLD, strokeWidth: .8 }))),
    [-52, -26, 0, 26, 52].map((r, i) => h(Leaf, { key: i, rot: r, len: 26, x: 0, y: -9 })),
    h('path', { d: 'M-10 -9h20l5 7H-15z', fill: '#F0C9C3', stroke: GOLD, strokeWidth: 1.1 }),
    h('path', { d: 'M-15 -2C-31 4-31 24-14 30H14C31 24 31 4 15 -2Z', fill: '#F3D3CD', stroke: GOLD, strokeWidth: 1.3 }),
    h('path', { d: 'M-24 8Q0 14 24 8M-23 20Q0 26 23 20', fill: 'none', stroke: GOLD, strokeWidth: .9 }),
    [-18, -12, -6, 6, 12, 18].map(x => h('circle', { key: x, cx: x, cy: 11.5 + Math.abs(x) * .02, r: 1, fill: GOLD })),
    h('path', { d: 'M0 22c-5-3-6-8 0-12 6 4 5 9 0 12z', fill: '#FBE9E5', stroke: GOLD, strokeWidth: .7 }),
    h('circle', { cx: 0, cy: -21, r: 8, fill: '#D8B48A', stroke: '#9B7440', strokeWidth: 1 }), [-2.6, 0, 2.6].map((x, i) => h('circle', { key: i, cx: x, cy: -20 + (i === 1 ? 2 : 0), r: .9, fill: '#7A5730' })),
    h('path', { d: 'M-4 -29l4-6 4 6', fill: 'none', stroke: '#9B7440', strokeWidth: 1 }),
    h('path', { d: 'M-9 -9q9 4 18 0', stroke: '#B84A57', strokeWidth: 1.6, fill: 'none' }),
    h(Diya, { x: -35, y: 30, s: .85 }), h(Diya, { x: 35, y: 30, s: .85 })));
  return frame(h('g', null,
    h('g', { transform: 'translate(0 -4)' }, h('path', { d: 'M9 -34A24 24 0 1 0 22 6A19 19 0 1 1 9 -34Z', fill: '#F6E4B2', stroke: GOLD, strokeWidth: 1.3 }), h('path', { d: 'M-1 -22A13 13 0 0 0 4 -4', fill: 'none', stroke: GOLD, strokeWidth: .6, opacity: .7 })),
    h(Sparkle, { x: 24, y: -26, s: 1.4 }), h(Sparkle, { x: 34, y: -10, s: 1 }), h(Sparkle, { x: -32, y: -22, s: 1.1 }), h(Sparkle, { x: 30, y: 10, s: .8 }), h(Sparkle, { x: -36, y: -4, s: .8 }),
    h('g', { transform: 'translate(0 32)' }, [-72, -48, -24, 0, 24, 48, 72].map((r, i) => h('path', { key: i, transform: `rotate(${r})`, d: 'M0 0C-8-8-8-19 0-28 8-19 8-8 0 0Z', fill: i % 2 ? '#F0C9C3' : '#FBE9E5', stroke: GOLD, strokeWidth: .8 })), h('circle', { r: 3, fill: '#F2C54E', stroke: GOLD, strokeWidth: .5 })),
    h('path', { d: 'M-40 18Q0 28 40 18', fill: 'none', stroke: GOLD, strokeWidth: .8, opacity: .8 })));
}

/* ---------- hooks ---------- */
function useNow(ms) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}
function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null); const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setOn(true); return; }
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setOn(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return h('div', { ref, className: 'rv ' + (on ? 'in ' : '') + className, style: { transitionDelay: delay + 'ms' } }, children);
}
function SecHead({ title, hi, sub }) {
  return h('div', { className: 'sec-head' }, h(Lotus, { className: 'ornate' }), h('h2', null, title), hi && h(Hi, null, hi), sub && h('p', { className: 'sub' }, sub));
}

/* ---------- music ---------- */
function useMusic(toast) {
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null), ctx = useRef(null), master = useRef(null), timer = useRef(null), buf = useRef(null), node = useRef(null), mode = useRef('');
  const toBytes = (uri) => { const bin = atob(uri.split(',')[1]); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
  const ensureCtx = () => { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) throw new Error('no audio'); if (!ctx.current) { ctx.current = new AC(); master.current = ctx.current.createGain(); master.current.gain.value = 0; master.current.connect(ctx.current.destination); } return ctx.current.resume(); };
  const fade = (v, s) => { const g = master.current.gain, t = ctx.current.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(v, t + s); };
  const pluck = (freq, when, vol) => {
    const c = ctx.current; const g = c.createGain(); const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1700;
    g.gain.setValueAtTime(0, when); g.gain.linearRampToValueAtTime(vol, when + 0.03); g.gain.exponentialRampToValueAtTime(0.0008, when + 4.2);
    [[1, 'triangle', 1], [2, 'sine', .35], [3, 'sine', .15]].forEach(([m, t, a]) => { const o = c.createOscillator(); const og = c.createGain(); o.type = t; o.frequency.value = freq * m; og.gain.value = a; o.connect(og); og.connect(g); o.start(when); o.stop(when + 4.4); });
    g.connect(f); f.connect(master.current);
  };
  const startDrone = async () => { await ensureCtx(); fade(.5, 1.5); const Sa = 146.83, seq = [Sa * .75, Sa, Sa, Sa / 2]; let i = 0; const step = () => { pluck(seq[i % 4], ctx.current.currentTime + .05, i % 4 === 3 ? .16 : .13); i++; }; step(); timer.current = setInterval(step, 1250); mode.current = 'drone'; };
  const startFile = async () => {
    const src = CONFIG.music.src;
    if (/^data:/.test(src) || /^blob:/.test(src)) {
      // 1) normal <audio> element from an in-memory blob; 2) fall back to Web Audio decoding if the host blocks media blobs
      try {
        if (!audio.current) { const url = URL.createObjectURL(new Blob([toBytes(src)], { type: 'audio/mpeg' })); const el = new Audio(url); el.loop = true; el.preload = 'auto'; audio.current = el; }
        await audio.current.play(); mode.current = 'audio'; return;
      } catch (e) { audio.current = null; }
      await ensureCtx();
      if (!buf.current) buf.current = await ctx.current.decodeAudioData(toBytes(src).buffer);
      if (!node.current) { const s = ctx.current.createBufferSource(); s.buffer = buf.current; s.loop = true; s.connect(master.current); s.start(0); node.current = s; }
      fade(.8, 1.2); mode.current = 'buffer'; return;
    }
    if (!audio.current) { audio.current = new Audio(src); audio.current.loop = true; }
    await audio.current.play(); mode.current = 'audio';
  };
  const stopAll = () => {
    if (audio.current) audio.current.pause();
    clearInterval(timer.current); timer.current = null;
    if (ctx.current && master.current) { fade(0, .5); setTimeout(() => { if (ctx.current && !playingRef.current) ctx.current.suspend(); }, 650); }
  };
  const playingRef = useRef(false), manualPause = useRef(false);
  const startPlay = async () => {
    try {
      playingRef.current = true;
      if (CONFIG.music.src) await startFile(); else { await startDrone(); toast('Playing a placeholder ambient drone. Add your own track in CONFIG.music.src.'); }
      if (mode.current === 'buffer' && ctx.current) { await ctx.current.resume(); fade(.8, 1.2); }
      setPlaying(true);
    } catch (e) { playingRef.current = false; }
  };
  const toggle = async () => {
    if (playingRef.current) { manualPause.current = true; playingRef.current = false; stopAll(); setPlaying(false); return; }
    manualPause.current = false; await startPlay();
    if (!playingRef.current) toast('Music could not start on this device. The invitation works fine without it.');
  };
  // starts the music from the visitor's first tap (seal, skip, or anywhere) unless they paused it themselves
  const start = () => { if (!playingRef.current && !manualPause.current) startPlay(); };
  useEffect(() => () => { clearInterval(timer.current); if (audio.current) audio.current.pause(); if (ctx.current) ctx.current.close(); }, []);
  return [playing, toggle, start];
}
function MusicButton({ playing, toggle }) {
  return h('div', { className: 'music' + (playing ? ' playing' : '') },
    playing && h('span', { className: 'lab' }, CONFIG.music.src ? 'Playing music' : CONFIG.music.placeholderLabel),
    h('button', { type: 'button', onClick: toggle, 'aria-pressed': playing, 'aria-label': playing ? 'Pause background music' : 'Play background music' },
      playing ? h('span', { className: 'eq', 'aria-hidden': true }, h('i'), h('i'), h('i'), h('i')) : h(Ic, { n: 'note', size: 24 })));
}

/* ---------- opening ---------- */
const WaxSeal = () => h('img', { className: 'wax', src: ORN.seal, alt: '', draggable: false, decoding: 'async' });
function Opening({ stage, onOpen, onContinue, onSkip }) {
  const open = stage === 'open';
  const tri = (side) => h('div', { key: side, className: 'tf ' + side }, h('div', { className: 'tfi' }, side === 'l' ? h(Orn, { k: 'lineLotus', className: 'tl1' }) : side === 'r' ? h(Orn, { k: 'lineLotus', className: 'tr1' }) : null));
  return h('div', { className: 'open s-' + stage, role: 'dialog', 'aria-label': 'Wedding invitation' },
    h('div', { className: 'stage' },
      h('div', { className: 'inner', 'aria-hidden': !open }, h(Orn, { k: 'hangL', className: 'io-l' }), h(Orn, { k: 'hangL', className: 'io-r' }), h(Orn, { k: 'lotCl', className: 'io-br' }), h(Orn, { k: 'lotCl', className: 'io-bl' }),
        h('div', { className: 'arch' },
          h('svg', { className: 'archsvg', viewBox: '0 0 300 430', 'aria-hidden': true, preserveAspectRatio: 'xMidYMax meet' },
            h('path', { d: 'M18 424V196Q18 156 46 136Q72 118 84 92Q96 64 120 46Q140 32 150 6Q160 32 180 46Q204 64 216 92Q228 118 254 136Q282 156 282 196V424Z', fill: 'rgba(232,199,196,.5)', stroke: '#C6A15B', strokeWidth: 2.2 }),
            h('path', { d: 'M18 424V196Q18 156 46 136Q72 118 84 92Q96 64 120 46Q140 32 150 6Q160 32 180 46Q204 64 216 92Q228 118 254 136Q282 156 282 196V424Z', fill: 'none', stroke: '#C6A15B', strokeWidth: .8, transform: 'translate(150 424) scale(.945) translate(-150 -424)' })),
          h('div', { className: 'gimg' }, h('img', { src: ORN.ganesha, alt: 'Lord Ganesha seated on a lotus', decoding: 'async' })),
          h('div', { className: 'gtext', lang: 'hi' }, '॥ श्री गणेशाय नमः ॥')),
        h('button', { className: 'btn gold cont', type: 'button', onClick: onContinue, tabIndex: open ? 0 : -1 }, 'Enter the Invitation')),
      ['l', 'r', 'b', 't'].map(tri),
      h('button', { className: 'seal-btn', type: 'button', onClick: onOpen, 'aria-label': 'Open the invitation by tapping the golden seal', disabled: stage !== 'closed' }, h(WaxSeal), h('span', { className: 'sheen', 'aria-hidden': true, style: { WebkitMaskImage: 'url(' + ORN.seal + ')', maskImage: 'url(' + ORN.seal + ')' } })),
      h('div', { className: 'cast', 'aria-hidden': true }),
      h('div', { className: 'hintbar' }, h('p', { className: 'hint' }, 'Tap the seal to open'),
        h('button', { className: 'btn gold sm', type: 'button', onClick: onOpen, tabIndex: stage === 'closed' ? 0 : -1 }, 'Open Invitation'),
        h('button', { className: 'skip', type: 'button', onClick: onSkip }, 'Skip intro'))));
}

/* ---------- nav ---------- */
const NAV = [['home', 'Home', 'मुख्य'], ['invite', 'Invitation', 'निमंत्रण'], ['family', 'Family', 'परिवार'], ['events', 'Events', 'कार्यक्रम'], ['venue', 'Venue', 'स्थल'], ['gallery', 'Gallery', 'यादें'], ['rsvp', 'RSVP', 'उपस्थिति']];
function Nav({ onShare }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!open) return; const k = (e) => e.key === 'Escape' && setOpen(false); document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, [open]);
  return h('header', { className: 'nav' }, h('div', { className: 'in' },
    h('a', { className: 'brand', href: '#home', 'aria-label': 'P and C — back to top' }, 'P & C'),
    h('nav', { className: 'links', 'aria-label': 'Sections' }, NAV.map(([id, l]) => h('a', { key: id, href: '#' + id }, l))),
    h('div', { className: 'tools' },
      h('button', { className: 'ib', type: 'button', onClick: onShare, 'aria-label': 'Share this invitation' }, h(Ic, { n: 'share' })),
      h('button', { className: 'ib menu-b', type: 'button', 'aria-expanded': open, 'aria-controls': 'sheet', 'aria-label': open ? 'Close menu' : 'Open menu', onClick: () => setOpen(!open) }, h(Ic, { n: open ? 'close' : 'menu' })))),
    open && h('nav', { id: 'sheet', className: 'sheet', 'aria-label': 'Sections' }, NAV.map(([id, l, hi]) => h('a', { key: id, href: '#' + id, onClick: () => setOpen(false) }, h('span', null, l), h(Hi, null, hi)))));
}

function Petals() {
  const items = useMemo(() => Array.from({ length: 11 }, (_, i) => ({ l: (i * 9.3 + 4) % 100, s: 9 + (i * 5) % 9, d: 16 + (i * 3) % 12, dl: -((i * 4.7) % 20), x: ((i % 2 ? 1 : -1) * (30 + (i * 11) % 60)) + 'px', c: ['#D9A5A5', '#E8D6AE', '#E8C7C4', '#A6AD8A'][i % 4] })), []);
  return h('div', { className: 'petals', 'aria-hidden': true }, items.map((p, i) => h('span', { key: i, className: 'petal', style: { left: p.l + '%', '--s': p.s + 'px', '--d': p.d + 's', '--dl': p.dl + 's', '--x': p.x, '--c': p.c } })));
}

/* ---------- hero ---------- */
function Hero() {
  const c = CONFIG.couple, p = PHOTOS.walking;
  return h('section', { id: 'home', className: 'hero', 'aria-label': 'Wedding invitation' }, h(Orn, { k: 'leafL', className: 'o-leafL' }), h(Orn, { k: 'leafR', className: 'o-leafR' }), h(Orn, { k: 'lotBL', className: 'o-lotBL' }), h(Orn, { k: 'lotBR', className: 'o-lotBR' }), h('div', { className: 'wrap' },
    h('div', { className: 'hero-txt' },
      h('img', { className: 'gsym', src: ORN.gSym, alt: 'Lord Ganesha', decoding: 'async' }),
      h('div', { className: 'ganesh', lang: 'hi' }, '॥ श्री गणेशाय नमः ॥'),
      h('div', { className: 'shloka' }, h('p', { className: 'sh', lang: 'hi' }, 'वक्रतुंड महाकाय सूर्यकोटि समप्रभ।', h('br'), 'निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥')),
      h('h1', { className: 'names' }, c.groom, h('span', { className: 'amp' }, '&'), c.bride),
      h('div', { className: 'hdate' }, '12 DECEMBER 2026'),
      h('p', { className: 'quote' }, '“' + CONFIG.messages.hero + '”'),
      h('a', { className: 'btn ghost sm', href: '#invite' }, 'Open the invitation')),
    h(Frame, { className: 'hero-photo' }, h('div', { className: 'imgbox' }, h('img', { src: p.uri, width: p.w, height: p.h, alt: p.alt, decoding: 'async' })))));
}

/* ---------- invitation + scratch ---------- */
function ScratchDate({ toast }) {
  const cv = useRef(null), drawing = useRef(false), last = useRef(null);
  const [done, setDone] = useState(false);
  const gp = useRef(null), parts = useRef([]), raf = useRef(0);
  const confetti = useMemo(() => Array.from({ length: 26 }, (_, i) => { const a = (i / 26) * Math.PI * 2; const r = 90 + (i * 37) % 80; return { dx: Math.cos(a) * r + 'px', dy: Math.sin(a) * r - 20 + 'px', r: (i * 53) % 360 + 'deg', c: ['#B08A4E', '#C98F94', '#6B1426', '#8F9F83', '#D9C08A'][i % 5] }; }), []);
  const heart = (ctx, w, ht) => { ctx.beginPath(); const x = w / 2, t = ht * .22; ctx.moveTo(x, ht * .94); ctx.bezierCurveTo(-w * .08, ht * .6, w * .02, t * .1, x * .62, t * .32); ctx.bezierCurveTo(x * .86, t * .05, x * .98, t * .45, x, t * 1.05); ctx.bezierCurveTo(x * 1.02, t * .45, x * 1.14, t * .05, x * 1.38, t * .32); ctx.bezierCurveTo(w * .98, t * .1, w * 1.08, ht * .6, x, ht * .94); ctx.closePath(); };
  const paint = useCallback(() => {
    const c = cv.current; if (!c) return; const dpr = Math.min(window.devicePixelRatio || 1, 2); const W = 300, H = 272;
    c.width = W * dpr; c.height = H * dpr; const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    heart(ctx, W, H); const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#C9CDB0'); g.addColorStop(.5, '#E8D6AE'); g.addColorStop(1, '#C9CDB0'); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = '#C6A15B'; ctx.stroke();
    ctx.save(); heart(ctx, W, H); ctx.clip(); ctx.globalAlpha = .18; ctx.fillStyle = '#fff'; for (let i = 0; i < 70; i++) { ctx.beginPath(); ctx.arc((i * 47) % W, (i * 31) % H, 2 + (i % 3), 0, 7); ctx.fill(); } ctx.restore();
    for (let i = 0; i < 260; i++) { const x = (i * 83) % W, y = (i * 47) % H; ctx.globalAlpha = .35 + ((i * 13) % 10) / 16; ctx.fillStyle = ['#FFFFFF', '#FFF2C0', '#E8B4B0', '#F4D27A'][i % 4]; ctx.beginPath(); ctx.arc(x, y, .7 + (i % 3) * .6, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#594333'; ctx.textAlign = 'center'; ctx.font = 'italic 22px "Playfair Display",Georgia,serif'; ctx.fillText('Scratch to Reveal', W / 2, H * .53);
    
  }, []);
  useEffect(() => { paint(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!drawing.current) paint(); }); }, [paint]);
  const pt = (e) => { const r = cv.current.getBoundingClientRect(); return { x: (e.clientX - r.left) * 300 / r.width, y: (e.clientY - r.top) * 272 / r.height }; };
  const spawn = (x, y) => {
    if (prefersReduced()) return;
    for (let i = 0; i < 4; i++) parts.current.push({ x, y, vx: (Math.random() - .5) * 2.2, vy: -Math.random() * 1.8 - .2, g: .05, life: 1, s: 1.2 + Math.random() * 2.2, c: ['#FFF3C4', '#F2D27A', '#E8B4B0', '#FFFFFF', '#C6A15B'][i % 5] });
    if (!raf.current) raf.current = requestAnimationFrame(loop);
  };
  const loop = () => {
    const c = gp.current; if (!c) { raf.current = 0; return; }
    const ctx = c.getContext('2d'); ctx.clearRect(0, 0, c.width, c.height); const k = c.width / 300;
    parts.current = parts.current.filter(p => p.life > .02);
    parts.current.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += p.g; p.life *= .955; ctx.globalAlpha = p.life; ctx.fillStyle = p.c; const s = p.s * k; ctx.save(); ctx.translate(p.x * k, p.y * k); ctx.rotate(p.x); ctx.beginPath(); ctx.moveTo(0, -s * 1.6); ctx.lineTo(s * .5, -s * .5); ctx.lineTo(s * 1.6, 0); ctx.lineTo(s * .5, s * .5); ctx.lineTo(0, s * 1.6); ctx.lineTo(-s * .5, s * .5); ctx.lineTo(-s * 1.6, 0); ctx.lineTo(-s * .5, -s * .5); ctx.closePath(); ctx.fill(); ctx.restore(); });
    ctx.globalAlpha = 1;
    raf.current = parts.current.length ? requestAnimationFrame(loop) : 0;
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const sparkles = useMemo(() => Array.from({ length: 46 }, (_, i) => { const r1 = (i * 53 % 97) / 97, r2 = (i * 31 % 89) / 89; return { x: 20 + r1 * 260, y: 20 + r2 * 230, s: .7 + ((i * 17) % 10) / 6, d: ((i * 37) % 30) / 10, t: 1.8 + ((i * 13) % 20) / 10, c: ['#FFFFFF', '#FFF0B8', '#F4D27A', '#F2C4BE'][i % 4] }; }), []);
  const scratch = (a, b) => {
    spawn(b.x, b.y); const ctx = cv.current.getContext('2d'); ctx.globalCompositeOperation = 'destination-out'; ctx.lineCap = 'round'; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.globalCompositeOperation = 'source-over'; };
  const check = () => { try { const c = cv.current; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let tot = 0, clr = 0; for (let i = 3; i < d.length; i += 4 * 37) { tot++; } let k = 0; for (let i = 3; i < d.length; i += 4 * 37) { if (d[i] < 30) clr++; k++; } /* ratio of cleared among sampled; heart covers ~60% of canvas */ if (clr / tot > 0.52) setDone(true); } catch (e) { setDone(true); } };
  const down = (e) => { drawing.current = true; cv.current.setPointerCapture && cv.current.setPointerCapture(e.pointerId); const p = pt(e); last.current = p; scratch(p, p); };
  const move = (e) => { if (!drawing.current) return; const p = pt(e); scratch(last.current, p); last.current = p; };
  const up = () => { if (!drawing.current) return; drawing.current = false; check(); };
  const q = encodeURIComponent;
  const gcal = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + q('Wedding of Pushpshekhar & Chandani') + '&dates=20261212/20261213&location=' + q(CONFIG.venues.wedding.address) + '&details=' + q('Wedding celebration. Wedding celebration on Saturday, from 3:00 PM onwards.');
  return h('div', { className: 'save' },
    h(Lotus, { className: 'ornate' }), h('h3', null, 'Save the Date'),
    h('div', { className: 'scratch' + (done ? ' done' : '') },
      h('svg', { className: 'heartbg', viewBox: '0 0 300 272', 'aria-hidden': true }, h('path', { d: 'M150 256C-10 160 10 6 92 14c27 3 46 20 58 40 12-20 31-37 58-40 82-8 102 146-58 242z', fill: '#FBF1EA', stroke: '#C6A15B', strokeWidth: 3 })),
      h('div', { className: 'sdate', role: 'img', 'aria-label': '12 December 2026' }, h('b', null, '12'), h('span', null, 'DECEMBER 2026')),
      h('canvas', { ref: cv, 'aria-hidden': true, onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up }),
      !done && h('svg', { className: 'glit', viewBox: '0 0 300 272', 'aria-hidden': true },
        h('defs', null, h('clipPath', { id: 'hclip' }, h('path', { d: 'M150 256C-10 160 10 6 92 14c27 3 46 20 58 40 12-20 31-37 58-40 82-8 102 146-58 242z' })),
          h('linearGradient', { id: 'shim', x1: 0, y1: 0, x2: 1, y2: 0 }, h('stop', { offset: 0, stopColor: '#fff', stopOpacity: 0 }), h('stop', { offset: .5, stopColor: '#fff', stopOpacity: .65 }), h('stop', { offset: 1, stopColor: '#fff', stopOpacity: 0 }))),
        h('g', { clipPath: 'url(#hclip)' }, h('rect', { className: 'shim', x: -120, y: -20, width: 90, height: 320, fill: 'url(#shim)', transform: 'rotate(18 150 136)' }),
          sparkles.map((p, i) => h('path', { key: i, className: 'tw', style: { animationDelay: p.d + 's', animationDuration: p.t + 's', transformOrigin: p.x + 'px ' + p.y + 'px' }, fill: p.c, d: `M${p.x} ${p.y - 4 * p.s}L${p.x + p.s} ${p.y - p.s}L${p.x + 4 * p.s} ${p.y}L${p.x + p.s} ${p.y + p.s}L${p.x} ${p.y + 4 * p.s}L${p.x - p.s} ${p.y + p.s}L${p.x - 4 * p.s} ${p.y}L${p.x - p.s} ${p.y - p.s}Z` })))),
      h('canvas', { ref: gp, className: 'gp', width: 600, height: 544, 'aria-hidden': true }),
      done && confetti.map((p, i) => h('span', { key: i, className: 'conf', style: { '--dx': p.dx, '--dy': p.dy, '--r': p.r, '--c': p.c } }))),
    h('div', { className: 'row' },
      !done && h('button', { className: 'btn ghost sm', type: 'button', onClick: () => setDone(true) }, 'Reveal the date'),
      h('a', { className: 'btn sm', href: gcal, target: '_blank', rel: 'noopener noreferrer' }, h(Ic, { n: 'cal' }), 'Add to Google Calendar')));
}
function Invitation() {
  const M = CONFIG.messages, c = CONFIG.couple;
  return h('section', { id: 'invite', className: 'sage invite' }, h(Orn, { k: 'leafL', className: 'o-leafL' }), h(Orn, { k: 'leafR', className: 'o-leafR' }), h(Orn, { k: 'vineA', className: 'o-vineA' }), h(Orn, { k: 'vineB', className: 'o-vineB' }), h(Orn, { k: 'lotBL', className: 'o-lotBL' }), h(Orn, { k: 'lotBR', className: 'o-lotBR' }),
    h('div', { className: 'wrap' }, h(Reveal, null, h('div', { className: 'paper' }, h('div', { className: 'inb' }), ['c1', 'c2', 'c3', 'c4'].map(k => h(Corner, { key: k, className: k })),
      h(Lotus, { className: 'ornate' }),
      h('div', { className: 'l1' }, M.inviteIntro),
      h('div', { className: 'pn' }, c.groom), h('div', { className: 'and' }, 'and'), h('div', { className: 'pn' }, c.bride),
      h('div', { className: 'l1 last' }, M.inviteOutro),
      h(Mandala, { className: 'pm', rings: 3, sw: 2 })))));
}
function SaveDate({ toast }) {
  return h('section', { id: 'save', className: 'peach' }, h(Orn, { k: 'lotBL', className: 'o-lotBL' }), h(Orn, { k: 'lotBR', className: 'o-lotBR' }),
    h('div', { className: 'wrap' }, h(ScratchDate, { toast })));
}

/* ---------- family ---------- */
function Family() {
  const f = CONFIG.families, c = CONFIG.couple;
  const card = (tag, name, photo, line) => h('div', { className: 'fcard' }, h('div', { className: 'tag' }, tag),
    h('div', { className: 'arch2' }, h('img', { src: photo.uri, width: photo.w, height: photo.h, alt: photo.alt, loading: 'lazy', decoding: 'async' })),
    h('h3', null, name),
    h('p', { className: 'rel' }, h('span', { className: 'so' }, line[0]), ' ', line[1]));
  return h('section', { id: 'family', className: 'alt' }, h('div', { className: 'wrap' },
    h(SecHead, { title: 'Our Families' }),
    h('div', { className: 'fam' },
      h(Reveal, null, card("Groom's Family", c.groom, PHOTOS.groom, f.groom.line)),
      h('div', { className: 'fdivider', 'aria-hidden': true }, h(Mandala, { rings: 3, sw: 2 })),
      h(Reveal, { delay: 120 }, card("Bride's Family", c.bride, PHOTOS.bride, f.bride.line)))));
}

const EvIcon = ({ id }) => {
  const p = { viewBox: '-14 -14 28 28', 'aria-hidden': true };
  if (id === 'haldi') return h('svg', p, h(Marigold2, { x: 0, y: 0, r: 13, c1: '#F4CF7E', c2: '#E8A94E' }));
  if (id === 'mehendi') return h('svg', p, h('g', { transform: 'scale(.135)' }, h(MandalaG, { rings: 3, sw: 7, color: '#7D3A2F' })), h('circle', { r: 1.6, fill: '#7D3A2F' }));
  if (id === 'wedding') return h('svg', p, h('g', { transform: 'translate(0 1)' }, [-40, 0, 40].map((r, i) => h(Leaf, { key: i, rot: r, len: 15, x: 0, y: -5, fill: '#B9C09E' })), h('path', { d: 'M-5.5 -4h11l3 4C13 4 12 11 0 12C-12 11-13 4-8.5 0z', fill: '#F3C5BE', stroke: '#8E3447', strokeWidth: 1 }), h('circle', { cx: 0, cy: -9, r: 3.6, fill: '#D8B48A', stroke: '#8E5E2E', strokeWidth: .7 })));
  return h('svg', p, h('path', { d: 'M3 -11A11 11 0 1 0 9 4A9 9 0 1 1 3 -11Z', fill: '#F0D58C', stroke: '#8A5A1E', strokeWidth: 1 }), h(Sparkle, { x: 8, y: -8, s: 1.6 }));
};
const ClockIc = () => h('svg', { className: 'ci', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', 'aria-hidden': true }, h('circle', { cx: 12, cy: 12, r: 9 }), h('path', { d: 'M12 7v5l3 2' }));
/* ---------- events ---------- */
const weekday = (d) => { try { return new Date(d + 'T12:00:00+05:30').toLocaleDateString('en-IN', { weekday: 'long', timeZone: 'Asia/Kolkata' }); } catch (e) { return ''; } };
function Events() {
  return h('section', { id: 'events', className: 'sage' }, h(Orn, { k: 'leafL', className: 'o-leafL' }), h(Orn, { k: 'leafR', className: 'o-leafR' }), h('div', { className: 'wrap' },
    h(SecHead, { title: 'Celebrations & Timeline', hi: 'विवाह के कार्यक्रम' }),
    h('div', { className: 'tl' }, CONFIG.events.map((ev, i) => {
      const v = venueOf(ev.venue); const day = String(+ev.date.slice(8, 10));
      const mon = new Date(ev.date + 'T12:00:00+05:30').toLocaleDateString('en-IN', { month: 'long', timeZone: 'Asia/Kolkata' }).toUpperCase();
      return h('div', { key: ev.id, className: 'tl-item ' + ev.theme }, h('span', { className: 'tl-dot', 'aria-hidden': true }, h(EvIcon, { id: ev.id })),
        h(Reveal, { className: 'ev ' + ev.theme, delay: 60 },
          h('div', { className: 'ev-arch' }, h(Art, { id: ev.id })),
          h('div', { className: 'ev-body' },
            h('div', { className: 'ev-date' }, h('b', null, day), h('div', null, h('span', { className: 'mon' }, mon + ' 2026'), h('span', { className: 'wd' }, weekday(ev.date)))),
            h('h3', null, ev.title), h(Hi, null, ev.hi),
            h('div', { className: 'ev-time' }, h(ClockIc), ev.time),
            h('div', { className: 'at' }, h('b', null, v.name), h('small', null, v.short || v.address), !v.verified && h('div', { className: 'warn' }, 'Venue provisional — to be confirmed')),
            h('a', { className: 'btn sm', href: v.mapsUrl, target: '_blank', rel: 'noopener noreferrer' }, h(Ic, { n: 'pin' }), ev.venue === 'reception' ? 'Get Reception Directions' : 'Get Directions'))));
    }))));
}

/* ---------- countdown ---------- */
function Countdown() {
  const [which, setWhich] = useState('wedding'); const now = useNow(1000);
  const cd = CONFIG.countdown[which]; const diff = Date.parse(cd.target) - now;
  const left = diff > 0 ? { d: Math.floor(diff / 864e5), h: Math.floor(diff % 864e5 / 36e5), m: Math.floor(diff % 36e5 / 6e4), s: Math.floor(diff % 6e4 / 1e3) } : null;
  const U = [['Days', 'दिन', 'd'], ['Hours', 'घंटे', 'h'], ['Minutes', 'मिनट', 'm'], ['Seconds', 'सेकंड', 's']];
  const pad = (n) => String(n).padStart(2, '0');
  return h('section', { id: 'countdown', className: 'cd-sec' }, h(Orn, { k: 'lotBL', className: 'o-lotBL' }), h(Orn, { k: 'lotBR', className: 'o-lotBR' }), h('div', { className: 'wrap' },
    h(SecHead, { title: 'Counting Down to Forever', hi: 'शुभ घड़ी की प्रतीक्षा' }),
    h('div', { className: 'cd-tabs', role: 'group', 'aria-label': 'Choose countdown' }, Object.entries(CONFIG.countdown).map(([k, v]) => h('button', { key: k, type: 'button', 'aria-pressed': which === k, onClick: () => setWhich(k) }, v.tab))),
    h('div', { className: 'cd-date', 'aria-label': cd.day + ' ' + cd.month }, h('b', null, cd.day), h('span', null, cd.month)),
    left ? h('div', { className: 'cd', role: 'timer', 'aria-label': 'Time remaining' }, U.map(([l, hi, k]) => h('div', { key: k, className: 'u' }, h('b', null, k === 'd' ? left[k] : pad(left[k])), h('span', null, l), h(Hi, null, hi))))
      : h('p', { className: 'cd-done' }, CONFIG.messages.done),
    h('p', { className: 'cd-note' }, cd.caption)));
}

/* ---------- venue ---------- */
function Venue({ toast }) {
  const V = CONFIG.venues;
  const cp = async (v) => toast((await copyText(v.address)) ? 'Address copied' : 'Could not copy — please select the address manually');
  const card = (key, i) => {
    const v = V[key];
    return h(Reveal, { key, delay: i * 100 }, h('div', { className: 'vcard' }, h('span', { className: 'pin' }, h(Ic, { n: 'pin', size: 46 })),
      h('div', { className: 'lbl' }, v.label), h('h3', null, v.name), h('p', { className: 'addr' }, v.short || v.address),
      !v.verified && h('span', { className: 'badge' }, 'Provisional — address not verified'),
      !v.verified && h('p', { className: 'caution' }, 'The location description and map link may not match. Please confirm with the family before travelling.'),
      h('div', { className: 'btns' },
        h('a', { className: 'btn', href: v.mapsUrl, target: '_blank', rel: 'noopener noreferrer' }, h(Ic, { n: 'pin' }), 'Get Directions'),
        h('button', { className: 'btn ghost sm', type: 'button', onClick: () => cp(v) }, h(Ic, { n: 'copy' }), 'Copy address'))));
  };
  return h('section', { id: 'venue', className: 'alt' }, h('div', { className: 'wrap' },
    h(SecHead, { title: 'Venues' }),
    h('div', { className: 'venues' }, ['haldiMehendi', 'wedding', 'reception'].map(card))));
}

/* ---------- gallery ---------- */
function GItem({ k, i, open, className = '', title }) {
  const p = PHOTOS[k];
  return h('figure', { className: className },
    title && h('h3', { className: 'gt' }, title),
    h('button', { className: 'gbtn', type: 'button', onClick: () => open(i), 'aria-label': 'Open photo: ' + p.alt },
      h('div', { className: 'photo' }, h('img', { src: p.uri, width: p.w, height: p.h, alt: p.alt, loading: 'lazy', decoding: 'async' })),
      h('span', { className: 'zoom', 'aria-hidden': true }, h(Ic, { n: 'zoom' }))));
}
function Gallery() {
  const [idx, setIdx] = useState(null);
  const open = (i) => setIdx(i);
  const ix = (k) => GALLERY_ORDER.indexOf(k);
  return h('section', { id: 'gallery', className: 'sage' }, h('div', { className: 'wrap' },
    h(SecHead, { title: 'Our Beautiful Memories', hi: 'हमारी खूबसूरत यादें' }),
    h('div', { className: 'gal' },
      h('h3', { className: 'gt span' }, "Couple's Story"),
      h(GItem, { k: 'walking', i: ix('walking'), open }),
      h(GItem, { k: 'editorial', i: ix('editorial'), open, className: 'drop' }),
      h(GItem, { k: 'hands', i: ix('hands'), open, className: 'wide', title: 'Wedding Details' }),
      h(GItem, { k: 'family', i: ix('family'), open, className: 'wide', title: 'Family Memories' }))),
    idx !== null && h(Lightbox, { idx, setIdx, onClose: () => setIdx(null) }));
}
function Lightbox({ idx, setIdx, onClose }) {
  const n = GALLERY_ORDER.length, p = PHOTOS[GALLERY_ORDER[idx]];
  const ref = useRef(null), x0 = useRef(null), closeB = useRef(null);
  const go = useCallback((d) => setIdx((i) => (i + d + n) % n), [n, setIdx]);
  useEffect(() => {
    const prev = document.activeElement; const ov = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden';
    closeB.current && closeB.current.focus();
    const k = (e) => {
      if (e.key === 'Escape') onClose(); else if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'Tab' && ref.current) { const f = ref.current.querySelectorAll('button'); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
    };
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('keydown', k); document.documentElement.style.overflow = ov; prev && prev.focus && prev.focus(); };
  }, [go, onClose]);
  return h('div', { className: 'lb', ref, role: 'dialog', 'aria-modal': true, 'aria-label': 'Photo viewer', onClick: (e) => { if (e.target === e.currentTarget || e.target.tagName === 'FIGURE') onClose(); },
    onTouchStart: (e) => { x0.current = e.touches[0].clientX; }, onTouchEnd: (e) => { if (x0.current == null) return; const dx = e.changedTouches[0].clientX - x0.current; x0.current = null; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); } },
    h('button', { className: 'x', ref: closeB, type: 'button', onClick: onClose, 'aria-label': 'Close photo viewer' }, h(Ic, { n: 'close' })),
    h('button', { className: 'pv', type: 'button', onClick: () => go(-1), 'aria-label': 'Previous photo' }, h(Ic, { n: 'left' })),
    h('figure', null, h('img', { key: idx, src: p.uri, alt: p.alt }), h('figcaption', null, p.section + '  ·  ' + (idx + 1) + ' / ' + n)),
    h('button', { className: 'nx', type: 'button', onClick: () => go(1), 'aria-label': 'Next photo' }, h(Ic, { n: 'right' })));
}

/* ---------- RSVP ---------- */
function Rsvp({ toast }) {
  const [f, setF] = useState({ name: '', phone: '', attend: '', guests: 1, msg: '', to: 0 });
  const [err, setErr] = useState({}); const [sent, setSent] = useState(false);
  const set = (k, v) => { setF((s) => ({ ...s, [k]: v })); setSent(false); };
  const validate = () => {
    const e = {}; if (f.name.trim().length < 2) e.name = 'Please enter your name.';
    const ph = f.phone.replace(/[\s\-()]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
    if (f.phone.trim() && !/^[6-9]\d{9}$/.test(ph)) e.phone = 'Enter a valid 10-digit Indian mobile number, or leave it blank.';
    if (!f.attend) e.attend = 'Please tell us if you can join.';
    if (f.attend === 'yes' && (f.guests < 1 || f.guests > 20)) e.guests = 'Guests must be between 1 and 20.';
    setErr(e); return Object.keys(e).length === 0;
  };
  const text = () => ['Namaste ' + CONFIG.hostFamily + '! RSVP for the wedding of ' + CONFIG.couple.groom + ' & ' + CONFIG.couple.bride + ' (' + CONFIG.dateLabel + ').', 'Name: ' + f.name.trim(), 'Attending: ' + (f.attend === 'yes' ? 'Yes, joyfully' : 'Sorry, unable to attend'), f.attend === 'yes' ? 'Guests: ' + f.guests : null, f.phone.trim() ? 'Phone: ' + f.phone.trim() : null, f.msg.trim() ? 'Message: ' + f.msg.trim() : null].filter(Boolean).join('\n');
  const confirm = (e) => { e.preventDefault(); if (validate()) { setSent(true); toast('RSVP prepared — send it on WhatsApp so the family receives it.'); } else toast('Please fix the highlighted fields.'); };
  const wa = () => { if (!validate()) { toast('Please fix the highlighted fields.'); return; } window.open(waLink(CONFIG.contacts[f.to].number, text()), '_blank', 'noopener,noreferrer'); };
  const E = (k) => err[k] && h('div', { className: 'err', id: 'e-' + k, role: 'alert' }, err[k]);
  return h('section', { id: 'rsvp', className: 'alt' }, h('div', { className: 'wrap' },
    h(SecHead, { title: 'We look forward to celebrating with you.', hi: 'आपकी उपस्थिति हमारे लिए अनमोल है।' }),
    h('div', { className: 'rsvp' },
      h('form', { className: 'form', onSubmit: confirm, noValidate: true },
        h('div', { className: 'field' }, h('label', { htmlFor: 'r-name' }, 'Guest name'), h('input', { id: 'r-name', value: f.name, autoComplete: 'name', maxLength: 80, 'aria-invalid': !!err.name, 'aria-describedby': err.name ? 'e-name' : undefined, onChange: (e) => set('name', e.target.value) }), E('name')),
        h('div', { className: 'field' }, h('label', { htmlFor: 'r-ph' }, 'Phone number ', h('small', null, '(optional)')), h('input', { id: 'r-ph', type: 'tel', inputMode: 'tel', autoComplete: 'tel', value: f.phone, maxLength: 16, 'aria-invalid': !!err.phone, 'aria-describedby': err.phone ? 'e-phone' : undefined, onChange: (e) => set('phone', e.target.value) }), E('phone')),
        h('fieldset', { className: 'field seg' }, h('legend', null, 'Attendance'),
          [['yes', 'Joyfully accept'], ['no', 'Regretfully decline']].map(([v, l]) => h('label', { key: v }, h('input', { type: 'radio', name: 'att', value: v, checked: f.attend === v, onChange: () => set('attend', v) }), h('span', null, l))), E('attend')),
        f.attend !== 'no' && h('div', { className: 'field' }, h('label', { htmlFor: 'r-g' }, 'Number of guests (including you)'),
          h('div', { className: 'stepper' }, h('button', { type: 'button', 'aria-label': 'Fewer guests', onClick: () => set('guests', Math.max(1, f.guests - 1)) }, '−'), h('output', { id: 'r-g', 'aria-live': 'polite' }, f.guests), h('button', { type: 'button', 'aria-label': 'More guests', onClick: () => set('guests', Math.min(20, f.guests + 1)) }, '+')), E('guests')),
        h('div', { className: 'field' }, h('label', { htmlFor: 'r-m' }, 'Message ', h('small', null, '(optional)')), h('textarea', { id: 'r-m', value: f.msg, maxLength: 300, onChange: (e) => set('msg', e.target.value) })),
        h('div', { className: 'field' }, h('label', { htmlFor: 'r-to' }, 'Send WhatsApp RSVP to'), h('select', { id: 'r-to', value: f.to, onChange: (e) => set('to', +e.target.value) }, CONFIG.contacts.map((c, i) => h('option', { key: i, value: i }, CONFIG.hostFamily + ' — ' + c.display)))),
        h('div', { className: 'row', style: { justifyContent: 'flex-start' } }, h('button', { className: 'btn', type: 'submit' }, 'Confirm Attendance'), h('button', { className: 'btn gold', type: 'button', onClick: wa }, h(Ic, { n: 'chat' }), 'WhatsApp RSVP')),
        h('p', { className: 'note' }, 'This invitation has no database: “Confirm Attendance” only prepares your reply on this screen and does not store or send it. Please tap “WhatsApp RSVP” to send it to the family — nothing is sent automatically.'),
        sent && h('div', { className: 'ok', role: 'status' }, h('h4', null, f.attend === 'yes' ? 'Thank you, ' + f.name.trim() + '!' : 'Thank you for letting us know, ' + f.name.trim() + '.'),
          h('p', null, 'Your reply is ready. Send it on WhatsApp so the family receives it:'), h('pre', null, text()),
          h('div', { className: 'row', style: { justifyContent: 'flex-start' } }, h('button', { className: 'btn sm', type: 'button', onClick: wa }, h(Ic, { n: 'send' }), 'Send on WhatsApp'), h('button', { className: 'btn ghost sm', type: 'button', onClick: async () => toast((await copyText(text())) ? 'Message copied' : 'Could not copy') }, h(Ic, { n: 'copy' }), 'Copy message')))),
      h('aside', { className: 'ctc', 'aria-label': 'Contact the family' }, h('p', { className: 'wlb' }, 'With love and blessings,'), h('h3', null, CONFIG.hostFamily), h(Hi, null, 'संपर्क करें'),
        CONFIG.contacts.map((c, i) => h('div', { key: i, className: 'p' }, h('div', { className: 'lab' }, c.label), h('a', { className: 'num', href: 'tel:+91' + c.number }, c.display),
          h('div', { className: 'row' }, h('a', { className: 'btn sm', href: 'tel:+91' + c.number }, h(Ic, { n: 'phone' }), 'Call'), h('a', { className: 'btn gold sm', href: waLink(c.number, 'Namaste! I have a question about the wedding invitation.'), target: '_blank', rel: 'noopener noreferrer' }, h(Ic, { n: 'chat' }), 'WhatsApp'))))))));
}

/* ---------- closing ---------- */
function Closing({ onShare }) {
  const p = PHOTOS.editorial;
  return h('section', { id: 'closing', className: 'closing sage' }, h(Orn, { k: 'leafL', className: 'o-leafL' }), h(Orn, { k: 'leafR', className: 'o-leafR' }), h(Orn, { k: 'lotBL', className: 'o-lotBL' }), h(Orn, { k: 'lotBR', className: 'o-lotBR' }), h(Mandala, { className: 'cm', rings: 4, sw: .4 }), h('div', { className: 'wrap' },
    h(Reveal, null, h('div', { className: 'photo' }, h('img', { src: p.uri, width: p.w, height: p.h, alt: p.alt, loading: 'lazy', decoding: 'async' }))),
    h(Reveal, null, h('p', { className: 'msg' }, '“' + CONFIG.messages.closing1 + '”'), h('p', { className: 'l2' }, '“' + CONFIG.messages.closing2 + '”'),
      h('p', { className: 'wl' }, 'With love,', h('b', null, CONFIG.hostFamily)),
      h('div', { className: 'row', style: { marginTop: 28 } }, h('button', { className: 'btn gold', type: 'button', onClick: onShare }, h(Ic, { n: 'share' }), 'Share this invitation'), h('a', { className: 'btn ghost', href: '#home' }, 'Back to top')))));
}

/* ---------- app ---------- */
function App() {
  const [stage, setStage] = useState('closed');
  const [toastMsg, setToastMsg] = useState(''); const tt = useRef(null); const timers = useRef([]);
  const toast = useCallback((m) => { setToastMsg(m); clearTimeout(tt.current); tt.current = setTimeout(() => setToastMsg(''), 3600); }, []);
  const [playing, toggleMusic, startMusic] = useMusic(toast);
  useEffect(() => { const go = () => { startMusic(); }; const ev = ['pointerdown', 'touchend', 'keydown', 'click']; ev.forEach(e => window.addEventListener(e, go, { once: true, passive: true })); return () => ev.forEach(e => window.removeEventListener(e, go)); }, []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const open = () => {
    if (stage !== 'closed') return;
    startMusic();
    if (prefersReduced()) { setStage('open'); return; }
    setStage('glow'); later(() => setStage('lift'), 1050); later(() => setStage('open'), 1600);
  };
  const cont = () => { timers.current.forEach(clearTimeout); setStage('leaving'); later(() => setStage('done'), prefersReduced() ? 150 : 900); };
  const skip = () => { startMusic(); cont(); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { document.documentElement.style.overflow = stage === 'done' || stage === 'leaving' ? '' : 'hidden'; return () => { document.documentElement.style.overflow = ''; }; }, [stage]);
  const share = async () => {
    const url = CONFIG.shareUrl || window.location.href;
    const data = { title: 'Wedding of Pushpshekhar & Chandani', text: 'You are warmly invited to the wedding of Pushpshekhar Gupta and Chandani Maddheshiya — 12 December 2026.', url };
    if (navigator.share) { try { await navigator.share(data); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    toast((await copyText(url)) ? 'Invitation link copied' : 'Could not copy — please copy the address from your browser');
  };
  const revealed = stage === 'leaving' || stage === 'done';
  return h('div', { className: revealed ? 'revealed' : '' },
    stage !== 'done' && h(Opening, { stage, onOpen: open, onContinue: cont, onSkip: skip }),
    h('div', { 'aria-hidden': stage !== 'done' && stage !== 'leaving' ? true : undefined },
      h(Petals), h(Nav, { onShare: share }),
      h('main', null, h(Hero), h(Invitation), h(SaveDate, { toast }), h(Family), h(Events), h(Countdown), h(Venue, { toast }), h(Gallery), h(Rsvp, { toast }), h(Closing, { onShare: share })),
      h('footer', null, 'Made with love for Pushpshekhar & Chandani · ' + CONFIG.dateLabel)),
    h(MusicButton, { playing, toggle: toggleMusic }),
    toastMsg && h('div', { className: 'toast', role: 'status', 'aria-live': 'polite' }, toastMsg));
}

export default function PushpshekharWedsChandani() {
  useEffect(() => {
    document.title = "Pushpshekhar & Chandani — Wedding Invitation";
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Arya:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: INVITATION_CSS }} />
      <div id="root" className="invitation-root">
        <App />
      </div>
    </>
  );
}
