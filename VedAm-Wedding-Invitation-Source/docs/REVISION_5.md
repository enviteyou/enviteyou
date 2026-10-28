# Revision 5 — approved opening and visual refinements

## Scope

- Correct envelope → full golden light → invitation handover, with no envelope flashback.
- Music above menu in one bottom-right column. 50px circular touch targets; rotating music disc stops when paused.
- Centred formal-invitation arch with balanced lobes, without moving the centred wording.
- Peacock neck animation 2.5–2.8 seconds per direction; independent feather ruffle every 4.6 seconds. Torso and feet retain their position. Reduced motion remains respected.
- Original couple photographs, content, petals, boats and other approved sections remain unchanged.

## Artwork

Built-in image-generation tool, edit mode (`precise-object-edit`). Source: `dist/assets/v3-formal.webp`. Final optimised project asset: `dist/assets/v5-formal.webp` (WebP, quality 92). The image is only decorative background; invitation text stays native and responsive.

Final edit prompt:

> Use case: precise-object-edit. Asset type: background illustration for the existing premium Indian wedding invitation website. Input image 1 is the edit target. Correct ONLY the gold scalloped Mughal arch outline at the top: the tip currently sits left of center. Redraw that arch into an elegant perfectly centered, bilaterally symmetrical scalloped outline, its sharp apex at EXACTLY 50% of image width (not 45%). Its left and right curved lobes must be mirror-symmetric, equally spaced from the center axis and the outer borders, with smooth, refined cusps. Preserve the same thin warm antique-gold watercolor/painted line style and original arch height; left and right outline descend to roughly the same height. Keep unchanged: original full portrait composition/aspect ratio, warm beige textured handmade-paper background, pink lotus floral side branches with muted olive-brown leaves and gold hanging beads, bottom Varanasi temple riverfront boat/lotus pond illustration, abundant empty center for native website text. Do NOT add text, lettering, peacocks, people, watermarks, extra symbols, extra frames, white patches or new decorative elements. Keep every other element as close to the original as possible. High-quality seamless background asset, not website mockup.

## Verification

`node --check dist/app.js`, `node verify-opening.mjs`, `node verify.mjs`, `git diff --check`. Browser review at 390px and 320px. No original couple-photo changes. Native OS calendar import and sharing remain platform-controlled, not re-certified in this focused correction pass.
