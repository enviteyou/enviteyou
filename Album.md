Build a complete interactive Digital Photo Album web application from scratch.

PROJECT IDEA:
I have a folder containing photos selected by a photography client. I want to use all photos from that selected photos folder and automatically create a beautiful digital album.

The final album should feel like a premium physical wedding/photo album converted into an interactive web experience.

ALBUM OPENING EXPERIENCE:
When the user opens the album link, do NOT directly show the photos.

First show a premium full-screen album cover.

The album should look like a closed physical photo album/book placed in the center of the screen.

Add an elegant ribbon wrapped around the album.

On the ribbon, display:

"Tap to Open"

The ribbon should have a subtle premium animation.

When the user clicks or taps the ribbon:

1. Animate the ribbon opening/untying.
2. Smoothly remove the ribbon from the album.
3. Play a premium album-opening animation.
4. The closed book cover should open like a real physical book.
5. Reveal the first album pages.

DIGITAL BOOK EXPERIENCE:
After opening, display all photos as pages of a realistic book/album.

The album must behave like a physical photo album.

Use realistic page flip animations.

When the user clicks Next:

* The right page should lift.
* Rotate in 3D.
* Flip from right to left.
* Reveal the next album pages.

When the user clicks Previous:

* Flip the page from left to right.

Add:

* Page shadows
* Page bending feel
* 3D perspective
* Dynamic shadow during page flip
* Smooth transitions
* Realistic book spine
* Proper page stacking effect

The animation should feel like turning pages of a real premium wedding album.

PHOTO LOADING:
Photos should be loaded automatically from a selected album folder.

Create a folder structure such as:

public/albums/[albumId]/photos/

Example:

public/albums/wedding-001/photos/
photo-001.jpg
photo-002.jpg
photo-003.jpg
photo-004.jpg

The application should automatically use these photos for the album.

Do not manually hardcode every photo inside the UI component.

Create an album configuration/data system.

Example album data should contain:

* albumId
* album title
* client name
* event name
* cover photo
* photos
* created date

Create the architecture so albums can later be generated dynamically by the vendor software.

ALBUM LAYOUT:
Do NOT simply show one image on every page.

Create multiple premium album page layouts.

Examples:

Layout 1:
One full-page photo.

Layout 2:
One large photo + two small photos.

Layout 3:
Two vertical photos side by side.

Layout 4:
Three-photo collage.

Layout 5:
One center photo with elegant whitespace.

Layout 6:
Full spread panoramic photo across left and right pages.

Layout 7:
Four-photo grid.

Automatically rotate between these layouts based on the available photos.

Maintain image aspect ratio.

Do not stretch photos.

Use object-fit: cover or contain intelligently based on the page layout.

DESIGN:
The UI should look premium, cinematic, elegant, and minimal.

This is NOT a normal image gallery.

It must visually feel like a luxury digital wedding album.

Use:

* Dark cinematic background
* Soft ambient lighting
* Premium typography
* Smooth animations
* Subtle gradients
* Realistic book shadows
* Elegant album cover
* High-quality page textures

Avoid:

* Basic cards
* Normal gallery grids
* Bootstrap-looking UI
* Cheap animations
* Excessive buttons

CONTROLS:
Add minimal controls.

Desktop:

* Left arrow key = previous page
* Right arrow key = next page
* Click left page = previous
* Click right page = next

Mobile:

* Swipe left = next page
* Swipe right = previous page
* Tap page edges for navigation

Add a small page indicator such as:

12 / 40

Controls should automatically fade when the user is not interacting.

MOBILE EXPERIENCE:
The album must be fully responsive.

On desktop:
Show a realistic two-page book spread.

On mobile:
Show one album page at a time while maintaining the page flip animation.

Support touch gestures.

Animations must remain smooth on mobile devices.

PERFORMANCE:
The album may contain 500 to 2000 photos.

Do NOT load all photos at once.

Implement:

* Lazy loading
* Image preloading for upcoming pages
* Load only current pages and nearby pages
* Memory-efficient rendering
* Image compression support
* Thumbnail/optimized image support

Preload approximately the next 2-4 album pages for smooth page flipping.

TECH STACK:
Use:

* Next.js with App Router
* React
* Tailwind CSS
* TypeScript

For animation use Framer Motion.

For realistic book page flipping, use a suitable page flip library if required. Prefer react-pageflip or an equivalent maintained solution.

If the library creates limitations, build a custom CSS 3D page flip system.

Use CSS:

* perspective
* transform-style: preserve-3d
* rotateY
* backface-visibility

PROJECT ARCHITECTURE:
Create clean reusable components.

Suggested structure:

app/
album/
[albumId]/
page.tsx

components/
album/
AlbumCover.tsx
Ribbon.tsx
AlbumBook.tsx
AlbumPage.tsx
AlbumSpread.tsx
AlbumControls.tsx
PhotoLayout.tsx

lib/
albumLoader.ts
albumLayoutGenerator.ts

types/
album.ts

public/
albums/
wedding-001/
cover.jpg
photos/

IMPORTANT:
Write the complete working code.

Do not only explain the approach.

Create all required files and components.

Install and configure all required dependencies.

Handle errors and empty album folders gracefully.

Keep the code modular and production-ready.

First inspect the existing project structure and package.json if a project already exists.

Do not overwrite existing important functionality unnecessarily.

Then implement the Digital Photo Album feature step by step.

After implementation:

1. Check TypeScript errors.
2. Check build errors.
3. Fix dependency issues.
4. Run lint if configured.
5. Verify desktop responsiveness.
6. Verify mobile responsiveness.
7. Ensure page flip animations work correctly.
8. Ensure photos are not all loaded into memory at once.

The final result should feel like opening and viewing a real premium physical wedding photo album inside a web browser.
