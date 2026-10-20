# Template Detail & Invitation Preview Engine Specification

> **Comprehensive Technical & Design Guide to Rebuild the Template Rendering Engine from Scratch.**

---

## 1. Executive Summary & Purpose

The **Template Detail Engine** (`TemplateDetail.jsx`) is the core presentation orchestration layer of the EnviteYou platform. It serves as a universal, polymorphic dispatcher responsible for:
1. **Dynamic Resolution & Lazy Loading**: Dynamically importing heavy client-side wedding invitation templates on-demand without server-side rendering (SSR) overhead.
2. **Dual-Mode Rendering**: Seamlessly switching between a **Device Phone Mockup Preview** (for admin/vendor configuration dashboards) and a **Full-Screen Responsive Website** (for the live published invite).
3. **Live Data Binding**: Ingesting and propagating real-time form mutations (`formData`) into the active template components without stutter or remount thrashing.
4. **Polished Micro-Interactions & Skeletons**: Providing a branded, animated loading state during bundle streaming.

---

## 2. Architecture & File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── TemplateDetail.jsx          # Polymorphic Template Orchestrator
│   │   └── templates/                  # Individual Template Implementations
│   │       ├── Template01.jsx          # Royal Classic Theme (Default)
│   │       ├── Template03.jsx          # Modern Minimalist Theme
│   │       ├── Template04.jsx          # Floral Pastel Elegance
│   │       ├── Template05.jsx          # Traditional Heritage Theme
│   │       └── Template06.jsx          # Luxury Gold & Cinematic Theme
```

---

## 3. Data Interface & Prop Contracts

### Component Signature
```typescript
interface TemplateDetailProps {
  template?: {
    id?: string | number;
    templateId?: string | number;
    slug?: string;
    previewComponent?: string;
    name?: string;
    category?: string;
    preview?: string;
    vendorPrice?: number;
    sellPrice?: number;
  };
  formData: Record<string, any>;
  fullscreen?: boolean;
  embedded?: boolean;
}
```

### Prop Breakdown
| Prop Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `template` | `Object` | `{}` | Metadata of the selected template. Used to determine which template component to load. |
| `formData` | `Object` | `{}` | Dynamic state containing groom/bride names, event dates, venues, timeline, gallery, story, audio track, etc. |
| `fullscreen` | `boolean` | `false` | When `true`, renders full-width invitation website. When `false`, renders within a phone mockup frame with custom elevation. |
| `embedded` | `boolean` | `false` | Indicates if the invitation is embedded inside an editor iframe or modal. |

---

## 4. Normalization & Dynamic Dispatch Pipeline

### 4.1. Template Normalization Algorithm
Input templates may supply identifiers in various formats (`"1"`, `"01"`, `"template01"`, `slug: "royal-ivory"`). The engine normalizes all incoming IDs to a lowercase string:

```javascript
const normalizedTemplateId = String(
  template?.templateId || 
  template?.id || 
  template?.slug || 
  template?.previewComponent || 
  template?.name || 
  "default"
).toLowerCase().trim();
```

### 4.2. Dispatch & Mapping Matrix
The registry maps numeric strings, prefixed names, and fallbacks to their respective dynamic components:

| Key Aliases | Target Component | Description |
| :--- | :--- | :--- |
| `"1"`, `"01"`, `"2"`, `"template01"` | `Template01` | Royal Classic & Gold Default Theme |
| `"3"`, `"03"`, `"template03"`, `"template3"` | `Template03` | Modern Contemporary Card Theme |
| `"4"`, `"04"`, `"template04"`, `"template4"` | `Template04` | Floral Watercolor & Elegance |
| `"5"`, `"05"`, `"template05"` | `Template05` | Rich Traditional Festive Theme |
| `"6"`, `"06"`, `"template06"`, `"template6"` | `Template06` | Cinematic Luxury Gold Theme |
| `default` | `Template01` | Safe fallback if no match is found |

---

## 5. Visual Design System & UI Specifications

### 5.1. Color Palette Tokens
| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Warm Alabaster / Sand** | `#faf7f3` | Main page backdrop, card container background |
| **Primary Royal Crimson** | `#7d2432` | Skeleton spinner borders, accents, loading badge |
| **Luxury Gold** | `#c8a24c` / `#b7882f` | Badges, borders, accents |
| **Deep Onyx / Phone Rim** | `#000000` / `bg-black` | Phone viewport backdrop and frame container |
| **Pure White** | `#ffffff` | Inner card background |
| **Subtle Stroke** | `rgba(0,0,0,0.10)` | `border-black/10` soft containment borders |

### 5.2. Elevation & Geometry
* **Outer Phone Frame Radius**: `rounded-[24px]` / `rounded-[28px]`
* **Outer Frame Elevation**: `shadow-[0_22px_60px_rgba(0,0,0,0.14)]`
* **Card Border**: `border border-black/10`
* **Responsive Dimensions**:
  * Preview Mode Max Width: `max-w-[390px]` (standard modern smartphone viewport).
  * Fullscreen Mode Width: `w-full min-h-screen`.

---

## 6. Component Implementations

### 6.1. Animated Skeleton Loader (`TemplateSkeleton`)
Used as the `loading` fallback while the chunk is dynamically loaded over the network:

```jsx
const TemplateSkeleton = () => (
  <div
    className="relative w-full min-h-screen bg-[#faf7f3] flex flex-col items-center justify-center p-6 animate-pulse"
    aria-busy="true"
    aria-live="polite"
  >
    {/* Concentric Animated Emblem */}
    <div className="size-24 rounded-full border border-[#7d2432]/20 bg-[#7d2432]/5 flex items-center justify-center mb-6">
      <div 
        className="size-16 rounded-full border border-dashed border-[#7d2432]/30 animate-spin-slow" 
        style={{ animationDuration: "8s" }} 
      />
    </div>

    {/* Content Placeholders */}
    <div className="h-4 w-48 bg-[#7d2432]/10 rounded mb-4" />
    <div className="h-8 w-64 bg-[#7d2432]/15 rounded mb-4" />
    <div className="h-4 w-36 bg-[#7d2432]/10 rounded" />
    
    <div className="mt-4 text-sm font-medium text-[#7d2432]/60">
      Lets go...
    </div>

    {/* Screen reader accessibility */}
    <span className="sr-only">Loading wedding invitation template...</span>
  </div>
);
```

### 6.2. Master Dispatcher Implementation (`TemplateDetail.jsx`)

```jsx
"use client";

import dynamic from "next/dynamic";

// 1. Loading Fallback
const TemplateSkeleton = () => (
  <div
    className="relative w-full min-h-screen bg-[#faf7f3] flex flex-col items-center justify-center p-6 animate-pulse"
    aria-busy="true"
    aria-live="polite"
  >
    <div className="size-24 rounded-full border border-[#7d2432]/20 bg-[#7d2432]/5 flex items-center justify-center mb-6">
      <div className="size-16 rounded-full border border-dashed border-[#7d2432]/30 animate-spin-slow" style={{ animationDuration: "8s" }} />
    </div>
    <div className="h-4 w-48 bg-[#7d2432]/10 rounded mb-4" />
    <div className="h-8 w-64 bg-[#7d2432]/15 rounded mb-4" />
    <div className="h-4 w-36 bg-[#7d2432]/10 rounded" />
    <div className="mt-4 text-sm font-medium text-[#7d2432]/60">
      Lets go...
    </div>
    <span className="sr-only">Loading wedding invitation template...</span>
  </div>
);

// 2. Dynamic Component Chunking (SSR: false for browser media/web-audio APIs)
const Template01 = dynamic(() => import("./templates/Template01"), { ssr: false, loading: TemplateSkeleton });
const Template03 = dynamic(() => import("./templates/Template03"), { ssr: false, loading: TemplateSkeleton });
const Template04 = dynamic(() => import("./templates/Template04"), { ssr: false, loading: TemplateSkeleton });
const Template05 = dynamic(() => import("./templates/Template05"), { ssr: false, loading: TemplateSkeleton });
const Template06 = dynamic(() => import("./templates/Template06"), { ssr: false, loading: TemplateSkeleton });

// 3. Identification Map
const templateComponentMap = {
  "1": Template01,
  "01": Template01,
  "2": Template01,
  "3": Template03,
  "03": Template03,
  template03: Template03,
  template3: Template03,
  "4": Template04,
  "04": Template04,
  template04: Template04,
  template4: Template04,
  template01: Template01,
  "5": Template05,
  "05": Template05,
  template05: Template05,
  "6": Template06,
  "06": Template06,
  template06: Template06,
  template6: Template06,
  default: Template01,
};

// 4. Main Component Export
export default function TemplateDetail({ template, formData, fullscreen = false, embedded = false }) {
  const normalizedTemplateId = String(
    template?.templateId || template?.id || template?.slug || template?.previewComponent || template?.name || "default"
  )
    .toLowerCase()
    .trim();

  const SelectedTemplate = templateComponentMap[normalizedTemplateId] || templateComponentMap.default;

  // View Mode A: Fullscreen Live Website
  if (fullscreen) {
    return (
      <article className="w-full bg-[#faf7f3]" aria-label="Wedding Invitation Website">
        <div className="relative w-full bg-black">
          <SelectedTemplate formData={formData} template={template} embedded={embedded} fullscreen />
        </div>
      </article>
    );
  }

  // View Mode B: Responsive Mobile Frame Preview
  return (
    <article
      className="overflow-hidden"
      aria-label="Wedding Invitation Preview Card"
    >
      <div className="">
        <div className="w-full overflow-visible rounded-[24px] bg-white shadow-[0_22px_60px_rgba(0,0,0,0.14)]">
          <div className="relative bg-black" role="region" aria-label="Phone Preview Frame">
            <SelectedTemplate formData={formData} template={template} embedded={embedded} />
          </div>
        </div>
      </div>
    </article>
  );
}
```

---

## 7. Step-by-Step Guide to Recreate from Scratch

### Step 1: Install Core Dependencies
Ensure the project has the required UI styling libraries and animation utilities:
```bash
npm install tailwindcss postcss autoprefixer clsx tailwind-merge lucide-react framer-motion canvas-confetti
```

### Step 2: Configure Custom Tailwind Keyframes (for Skeleton & Rotations)
In `tailwind.config.js` or CSS globals:
```javascript
module.exports = {
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
      },
    },
  },
};
```

### Step 3: Implement Template Subcomponents
Create individual template components under `src/components/templates/` with prop signature:
```jsx
export default function TemplateXX({ formData, template, embedded, fullscreen }) {
  // 1. Extract dynamic fields with sensible fallbacks
  const brideName = formData?.brideName || "Pooja";
  const groomName = formData?.groomName || "Rahul";
  const weddingDate = formData?.weddingDate || "2026-12-12";
  
  return (
    <div className={`template-container ${fullscreen ? 'min-h-screen' : 'max-w-md'}`}>
      {/* Template sections: Hero, Story, Timeline, RSVP, Gallery, Music */}
    </div>
  );
}
```

### Step 4: Plug into Dashboards and Routes
1. **In Vendor/Admin Dashboard (Preview Mode)**:
   ```jsx
   <TemplateDetail 
     template={selectedTemplate} 
     formData={liveFormData} 
     fullscreen={false} 
   />
   ```
2. **In Public Invitation Route (`/invite/[slug]` or `/album/[token]`)**:
   ```jsx
   <TemplateDetail 
     template={invitation.template} 
     formData={invitation.details} 
     fullscreen={true} 
   />
   ```

---

## 8. Key Technical Considerations

1. **Client-Side Rendering (`ssr: false`)**:
   - Invitation templates frequently make use of `window`, `HTMLAudioElement` (background music), `IntersectionObserver` (scroll animations), and HTML5 Canvas (confetti / petals).
   - Dynamic imports with `{ ssr: false }` prevent hydration mismatches during Next.js rendering.
2. **Performance Optimization**:
   - Chunk splitting ensures that users only download the specific template bundle they are viewing, keeping the initial page load lightweight.
3. **Accessibility (a11y)**:
   - Skeletons include `aria-busy="true"` and `aria-live="polite"`.
   - Preview wrappers use semantic `<article>` tags and `role="region"` with distinct labels (`"Phone Preview Frame"` vs `"Wedding Invitation Website"`).
