export const templates = [
  {
    id: "1",
    templateId: "1",
    name: "City Lights",
    price: "INR 3,999",
    tag: "Modern reception",
    description:
      "A polished wedding website for couples who want a clean city-style invite with RSVP, venue details, and a premium mobile-first feel.",
    preview: "/1.png",
    palette: "Black, ivory, champagne",
    bestFor: "Cocktail nights, receptions, destination city weddings",
    features: ["RSVP ready", "Event schedule", "Google Maps venue link", "Photo gallery"],
  },
  {
    id: "2",
    templateId: "2",
    name: "Coastal Vows",
    price: "INR 3,999",
    tag: "Soft and romantic",
    description:
      "A breezy digital wedding website designed for warm, intimate celebrations with story sections, countdown, and easy guest sharing.",
    preview: "/2.png",
    palette: "White, sand, charcoal",
    bestFor: "Beach weddings, brunch ceremonies, intimate family events",
    features: ["Countdown timer", "Couple story", "WhatsApp sharing", "Guest-friendly layout"],
    // category , verndor pricing ,regular price ,sell price , vendor price,title description,featuredImage
  },
  {
    id: "3",
    templateId: "3",
    name: "Heritage Mahal",
    price: "INR 3,999",
    tag: "Classic Indian wedding",
    description:
      "A graceful wedding website for traditional celebrations, built to present rituals, venues, dates, and family details beautifully.",
    preview: "/3.png",
    palette: "Black, white, muted gold",
    bestFor: "Haldi, mehendi, sangeet, wedding ceremony",
    features: ["Multiple event blocks", "Family notes", "Save-the-date", "Forever online link"],
  },
  {
    id: "4",
    templateId: "4",
    name: "Royal Crescent",
    price: "INR 3,999",
    tag: "Luxury palace invite",
    description:
      "A regal wedding invitation with animated scenes, ceremony cards, and a grand palace-style presentation for premium celebrations.",
    preview: "/4.png",
    palette: "Gold, midnight blue, ivory",
    bestFor: "Grand weddings, palace venues, multi-day celebrations",
    features: ["Animated storytelling", "Ceremony timeline", "Audio ambience", "Luxury visual style"],
  },
];

export function getTemplateById(id) {
  if (!id) return null;
  const normalized = String(id).toLowerCase().trim();
  return templates.find((template) => String(template.templateId || template.id).toLowerCase() === normalized) || null;
}
