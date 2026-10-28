# Amulya & Vedant · Lotus Wedding Invitation

Public mobile-first invitation. This revision updates the existing Lotus Site; older blue invitation Sites are untouched. Prior source and deployments remain recoverable in version history.

## Current correction — #VedAm, revision 5

`dist/v5.css` adds vertically stacked bottom-right controls (music above menu), faster peacock neck motion and an independent feather-ruffle cycle. `dist/assets/v5-formal.webp` corrects the off-centre painted arch while retaining the existing beige/floral/riverfront direction. See `REVISION_5.md` for artwork provenance and the edit prompt.

The opening now uses a sequential Web Animations handover instead of unrelated timeouts: reach full golden light, wait for hero artwork decode, hide/inert the envelope and reveal the invitation, paint underneath full coverage, then fade light out. Controls only appear after the reveal. `verify-opening.mjs` checks this ordering, slow artwork readiness, duplicate taps, skip/reduced motion and cancellation recovery. Browser checks include 390×844 and 320×740, the centred arch, vertical 50px controls, changing plumage transforms and music pause.

## Revision 4 notes (historical)

Current overrides load `dist/v4.css` after `dist/v3.css`. The formal invitation restores the compact parent-led wording with Mrs./Mr. prefixes and removes all grandparents. Couple names share one line. The approved original photographs, wedding details and 25 January 2026 engagement date are unchanged.

Seven small live SVG petals fall continuously through the visible viewport from the opening envelope to the closing screen. This single non-interactive layer does not restart on section changes; it is disabled for reduced motion. Oversized fixed petals remain removed. Botanical branches sway at 3.8–4.3 seconds. Both countdown boats travel horizontally with their reflections. Peacock artwork is separated into a stationary torso/feet, gently nodding head/neck, and moving feather train using native SVG masks and clips. Offscreen decorative motion is paused.

All section masks, edge-fade filters and separator shadows are disabled, including the story artwork. Artwork meets at clean flush edges against the beige invitation canvas. There is no footer bar, hashtag strip or date strip. Only two circular bottom-right controls remain: music and navigation. The music disc revolves only while music is playing.

Revision 4 visual checks cover 390×844 and 320×740 layouts, clean section edges, compact parents, no horizontal overflow, moving peacock parts, changing boat coordinates and continuous petal positions. Music rotation and paused state, section navigation and photo navigation are checked in-browser. Calendar and authoritative content are validated locally. Native OS calendar import and phone share sheets remain platform-dependent.

## Previous revision 3 notes (historical)

Current overrides: `dist/v3.css`. Consistent exact-case #VedAm branding, centred opening heading and highlighted Tap to open. Loose petals and generic lotus ornaments removed. Hero has AND on its own middle line, lining date numerals and no pink venue wash. Full ancestry details are included without honorifics. Formal invitation grows naturally and keeps text above the peacocks. Engagement is 25 January 2026. Story and gallery use flow layouts, with no duplicate gallery ornament or draft copy.

Independent artwork layers: animated opening branches; moving white-heron/lotus foreground; two separately pivoting peacocks; four swaying countdown ornaments with native numbers/labels; two slowly translating boat-and-reflection layers; moving ceremony and story flowers; painted closing lotus and edge florals. Religious artwork stays respectful and mostly still. Cow artwork is unchanged. Motion pauses offscreen and respects reduced-motion preference. The architecture and text do not move with decorative artwork.

Gesture handlers recognise a deliberate horizontal drag during movement, preserve vertical scrolling, retain pointer tracking and include a legacy touch fallback. Visual QA at 390×844 and 320×740 includes the new family copy, story rows, gallery, countdown and closing. Browser checks cover opening/skip, nav, event tabs and keyboard, gallery thumbnails and deliberate swipe, music, and copy-link feedback. Actual boat movement was verified from rendered positions. Calendar data remains unchanged and is validated structurally. Original photo assets are unchanged.

Earlier implementation notes below are historical where superseded by this section.

## Current source

- `dist/index.html`: separate entrance followed by eight continuous semantic invitation sections. Text, dates, actions, tabs and photographs are native HTML.
- `dist/refined.css`: locally bundled Cormorant Garamond, Montserrat and Playfair Display italic ampersand; art-aligned responsive layouts, focus states, restrained motion and reduced-motion support.
- `dist/app.js`: seal-led opening, original locally synthesised instrumental audio, navigation, IST countdown, ceremony carousel, gallery, sharing and calendar definitions.
- `dist/assets/illustration-v2-1.webp` through `illustration-v2-9.webp`: approved paintings restored as illustration-only backgrounds. Lettering, controls, numbers and photographs were removed and rebuilt as live layers. Reference boards are not embedded.
- `dist/assets/event-frame-v2.webp`: ornate empty ceremony frame.
- `dist/assets/mehendi-bowl-v2.webp`: reference-derived flower-filled bowl, not the earlier cone substitute.
- `dist/assets/couple-*.webp`: the four original photographs. Faces are not generated, retouched or reinterpreted.
- `prepare.mjs`: produces the bundled three-event calendar.
- `verify.mjs`: content, assets, anchors, reduced-motion and RFC 5545 calendar checks.
- `ARTWORK.md`: artwork provenance and prompts.
- `.openai/hosting.json`: existing Site identity and static hosting configuration.

No npm dependencies, third-party runtime libraries, external font/CDN requests or external audio URLs. Run `node prepare.mjs`, `node --check dist/app.js` and `node verify.mjs` before packaging.

## Authoritative content

Wedding: Thursday, 26 November 2026, 19:30 Asia/Kolkata. Hotel De Paris, The Mall Road, Varanasi Cantonment.

Mehendi: Tuesday, 24 November 2026, 10:30 Asia/Kolkata. Shakuntala Niwas, Sunderpur, Varanasi.

Haldi: Thursday, 26 November 2026, 09:00 Asia/Kolkata. Hotel De Paris, The Mall Road, Varanasi Cantonment.

Parents: Mrs. Shilpi & Mr. Yogesh Agrawal; Mrs. Ritu & Mr. Pradeep Jain.

Engagement: 25 January 2026. The first milestone uses the agreed caption ‘Two hearts, one journey’; unfinished narrative placeholders are removed, without inventing a relationship story. No Sangeet, RSVP, Guest Essentials or contact form.

The calendar uses UTC timestamps representing the supplied IST moments: 20261124T050000Z, 20261126T033000Z, 20261126T140000Z. No invented ceremony end times.

## Experience and motion

The fixed entrance is independent of the scrolling document. The main content starts hidden and inert, even if the initial URL contains a fragment. The seal or Tap to open triggers a soft bell, warm bright radiance and hero reveal. The entrance is removed, and scrolling starts at the hero. Skip opening is silent; reduced motion is respected.

There is one native vertical scroll viewport, without scroll snapping. Two floating circular controls occupy the bottom right. Desktop gutters and dialogs retain the beige paper treatment.

Motion: a continuous viewport petal stream, seal glow, bright reveal, text entrances, river shimmer, Ganesha halo, live counter crossfade, carousel/gallery transitions, moving flowers, travelling boats and articulated peacock necks and feather trains. Rabbit, horse and cow artwork retains its approved composition.

Optional audio is original and locally synthesised. It starts only after an opening/control gesture, has a persistent pause button, and fades when the tab is hidden. Skipping does not start music.

The three ceremonies support tabs, arrows, dots, swipes and keyboard arrows/Home/End; no autoplay. Inactive cards are inert. The four-photo gallery supports arrows, swipes, thumbnails, dots and keyboard arrows. Sharing uses Web Share, then clipboard, legacy copy and manual-copy fallbacks.

## QA scope

Browser visual review: 390×844 and 320×740, plus centred desktop canvas; no horizontal page overflow. Checked entrance and hash non-bypass, skip, menu, live counter, ceremony tabs/keyboard/arrows, gallery navigation, music state and share fallback. Local tests verify assets, dates, exclusions and the bundled calendar. Maps links use the exact supplied venue/address queries.

Native phone sharing, WhatsApp preview caching and OS calendar import are platform-controlled and cannot be exhaustively verified in the desktop browser.
