# Amulya & Vedant — wedding invitation source

Complete portable export of published revision 5, source commit 309c6760cc3a0db35ccc4c84e9555333ef3cdec0.
The live Site has not been changed by this export.

## Files

- index.html — editable semantic invitation markup.
- styles.css — all four published stylesheets combined in their original cascade order.
- app.js — complete published interactions, opening transition, music, countdown, ceremonies, gallery, sharing and calendar logic.
- assets/ — original artwork, original couple photos, locally bundled fonts, font licences, calendar and social preview.
- standalone.html — genuine self-contained single-file version with CSS, JavaScript, artwork, photos, fonts and calendar embedded.
- SOURCE_CODE.md — the full index.html, styles.css and app.js in fenced code blocks, without omissions.
- ASSET_MANIFEST.json — file sizes and SHA-256 hashes for the included original assets.
- docs/ — artwork provenance, edit prompts and historical build notes. Historical dist/ paths refer to the original build; this portable export runs from its root.
- verify.mjs and verify-opening.mjs — dependency-free Node.js validation scripts.

## Open and edit

For the easiest preview, open standalone.html in a modern browser. It requires no adjacent asset files or installation.
For development, keep index.html, styles.css, app.js and assets/ together. Start a local static server from this folder, for example:

    python3 -m http.server 8000

Then open http://localhost:8000/. No npm install, build step or framework is required.
Edit the three normal source files, not the generated embedded version. Regenerate the embedded version after edits if it is needed again.

## Hosting

Upload index.html, styles.css, app.js and the assets/ folder to any static host.
You can alternatively host standalone.html as the entry file. HTTPS is recommended for native sharing and clipboard APIs.
Share Invitation intentionally points to the current public invitation URL. If using a new domain, update SITE_URL near the top of app.js, the canonical/Open Graph URLs in index.html, and the URL fields inside assets/Amulya-and-Vedant-Celebrations.ics. Keep the social-preview.jpg image at a public HTTPS URL for social previews; embedded data URLs are unsuitable for WhatsApp/Open Graph crawlers.

## Behaviour and platform limits

- Seal-led golden opening uses a covered handover; the envelope cannot flash back as the light fades.
- Continuous falling petals, visible boat travel and peacock head/feather motion respect reduced-motion preferences.
- Music is original locally synthesised instrumental audio, not a missing external audio track.
- Music is above menu in a bottom-right column. Audio starts only after a guest action.
- The countdown targets 26 November 2026 at 7:30 PM IST.
- Three ceremonies only: Mehendi, Haldi and Wedding. No Sangeet, RSVP, Guest Essentials or contact form.
- Engagement date is 25 January 2026. Original couple photos are unchanged.
- Google Maps links need internet. Native sharing/clipboard and calendar import depend on the browser and operating system; local file previews can restrict clipboard/native-sharing APIs. Manual-copy fallback remains available.
- Calendar timestamps use UTC equivalents of the authoritative IST times. No ceremony end times were invented.

## Checks

    node --check app.js
    node verify-opening.mjs
    node verify.mjs

The export contains no Git repository metadata, authentication credentials or account-specific deployment configuration. Font licence files are included in assets/.
