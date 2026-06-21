import type { LocationGuide } from "./types";

/**
 * Mock guide generator. Stands in for the real z.ai response so the UI is
 * fully explorable today. The shape here is exactly what `fetchGuide` will
 * receive from the live endpoint, so swapping in the real call is a one-liner.
 */
export function buildMockGuide(rawLocation: string): LocationGuide {
  const location = titleCase(rawLocation.trim()) || "Kyoto";

  return {
    location,
    country: "—",
    tagline: `Where every street in ${location} tells a story worth getting lost in.`,
    heroImage:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    attractions: [
      {
        name: `Old Town of ${location}`,
        blurb:
          "Lantern-lit lanes, artisan workshops and centuries of layered architecture. Go at golden hour when the crowds thin.",
        tag: "Historic core",
        bestTime: "Late afternoon",
      },
      {
        name: "The Grand Overlook",
        blurb:
          "A panoramic ridge above the city — the single best vantage point to understand how the place fits its landscape.",
        tag: "Viewpoint",
        bestTime: "Sunrise",
      },
      {
        name: "Riverside Market District",
        blurb:
          "A sprawl of covered stalls where locals actually shop. Spices, textiles, and the best people-watching in town.",
        tag: "Market",
        bestTime: "Morning",
      },
      {
        name: "National Museum of Heritage",
        blurb:
          "A thoughtfully curated walk through the region's art, conflict and craft. Free on the first Sunday of each month.",
        tag: "Museum",
        bestTime: "Midday",
      },
    ],
    cuisine: [
      {
        name: "Hand-pulled noodles",
        description:
          "Pulled to order in steaming broth with scallion and chili oil. The unofficial soul food of the region.",
        emoji: "🍜",
        kind: "Main",
      },
      {
        name: "Grilled street skewers",
        description:
          "Charcoal-blistered and dusted with a closely-guarded spice blend. Eat them standing, like the locals do.",
        emoji: "🍢",
        kind: "Street food",
      },
      {
        name: "Honey-soaked pastry",
        description:
          "Flaky, fragrant and almost too sweet — traditionally shared over long afternoon conversations.",
        emoji: "🍯",
        kind: "Dessert",
      },
      {
        name: "Spiced mountain tea",
        description:
          "Brewed strong and served scalding. Refusing a second cup is considered a small act of rudeness.",
        emoji: "🍵",
        kind: "Drink",
      },
    ],
    culture: {
      history: `${location} grew up at a crossroads of trade routes, and that meeting of cultures still shapes everything — the food, the festivals, the faces. Empires rose and receded here, each leaving a layer you can still read in the architecture if you slow down to look.`,
      norms: [
        {
          title: "Greetings matter",
          detail:
            "A warm, unhurried greeting opens every interaction. Rushing straight to business reads as cold.",
        },
        {
          title: "Remove your shoes",
          detail:
            "In homes and many temples, footwear comes off at the threshold. Watch for a lined-up row of shoes.",
        },
        {
          title: "Hospitality is a duty",
          detail:
            "Guests are offered food and drink almost immediately. Accepting graciously honors the host.",
        },
        {
          title: "Photograph people kindly",
          detail:
            "Always ask before photographing someone, especially at religious or ceremonial sites.",
        },
      ],
    },
    language: {
      primary: ["Regional dialect", "National language", "English (tourist areas)"],
      phrases: [
        {
          original: "Salaam / Namaste",
          pronunciation: "sa-LAAM / na-ma-STAY",
          meaning: "Hello / a respectful greeting",
        },
        {
          original: "Shukran",
          pronunciation: "SHOOK-ran",
          meaning: "Thank you",
        },
        {
          original: "Kam?",
          pronunciation: "kahm",
          meaning: "How much? (for markets)",
        },
        {
          original: "Laziz!",
          pronunciation: "la-ZEEZ",
          meaning: "Delicious! (a great compliment to a cook)",
        },
      ],
    },
  };
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
