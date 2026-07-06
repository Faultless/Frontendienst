export type ProjectMedia = {
  // Path relative to /public. Ships as an SVG placeholder — replace with a
  // real screenshot (.png/.jpg) recorded from the app and update the path.
  image: string;
  // Path relative to /public, or undefined if you haven't recorded one yet.
  // Drop an .mp4/.webm/.gif into /public/video and point this at it.
  video?: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  platform: "Mobile app" | "Browser game" | "Browser extension / app";
  accent: string; // CSS color used for this project's card accent
  media: ProjectMedia;
  // TODO: fill in once you have somewhere to point people — an app store
  // listing, an itch.io page, a GitHub repo, etc. Leave undefined to hide the link.
  link?: string;
};

export const projects: Project[] = [
  {
    slug: "chronomap",
    name: "Chronomap",
    tagline: "An interactive history & geography map you can scrub through time.",
    description:
      "A full-screen, mobile-first Flutter app for exploring history and geography across roughly 4,000 years. Drag an epoch slider from 2000 BCE to today and the map morphs its borders, fades events in and out around their date, and re-tints itself from parchment-warm in the deep past to crisp and modern today.",
    highlights: [
      "Five knowledge modes — military history, literature, philosophy, medicine, natural disasters — plus a live geography mode (nature, wonders, cities, culture)",
      "Live event data pulled from the Wikidata Query Service and merged with a bundled seed dataset, ranked by real-world prominence",
      "Hand-rolled zoom clustering and historical border morphing, built version-proof against a fast-moving mapping library",
      "Procedural 2.5D wonders — 14 architecture archetypes rendered entirely in code, animating construction and collapse as you scrub through their era",
    ],
    stack: ["Flutter", "Dart", "Riverpod", "flutter_map", "Wikidata SPARQL", "OpenStreetMap"],
    platform: "Mobile app",
    accent: "#d99a4e",
    media: {
      image: "/images/projects/chronomap/placeholder-1.svg",
    },
  },
  {
    slug: "linguapop",
    name: "LinguaPop",
    tagline: "A Japanese language-learning novel reader.",
    description:
      "Import an EPUB or plain text file — or a paired original + translation — and read it with per-token JLPT color coding, tap-for-dictionary lookups, select-to-translate, switchable view modes, custom reading themes, and text-to-speech. Built for learners who want to read real Japanese fiction instead of textbook dialogues.",
    highlights: [
      "Per-token JLPT-level color coding so you can gauge a page's difficulty at a glance",
      "Tap any word for an instant dictionary lookup, or select a passage to translate",
      "Switchable reading view modes and custom themes for long reading sessions",
      "Built-in text-to-speech for listening practice alongside reading",
    ],
    stack: ["Flutter", "Dart", "Riverpod", "go_router", "Hive", "MeCab tokenizer", "TTS"],
    platform: "Mobile app",
    accent: "#e0698e",
    media: {
      image: "/images/projects/linguapop/placeholder-1.svg",
    },
  },
  {
    slug: "spintop",
    name: "SpinTop Arena",
    tagline: "A beyblade-style physics battler, built for the browser.",
    description:
      "A top-down spinning-top battler with almost no art assets — every spinner, spark, arena and aura effect is drawn procedurally in code, and every sound effect is synthesized with WebAudio. Wind up your launch by circling the pointer, flick your top into the dish, and out-maneuver an AI opponent with custom gyroscopic physics.",
    highlights: [
      "Custom physics: pointer steering, dish-bowl force, gyroscopic drift, and a multi-stage clash pipeline with three finish types",
      "Five stat archetypes with unique AI behaviour, a full parts system (blades / discs / drivers), and five archetype-specific legendary special moves",
      "A builder/spender 'aura' system — precise play charges a visible flame aura you can cash in for a harder hit",
      "Best-of-3 matches, an unlockable roster, adjustable AI difficulty, and a JRPG-style story mode with branching dialogue",
    ],
    stack: ["TypeScript", "Phaser 3", "Vite", "WebAudio", "Electron (desktop packaging)"],
    platform: "Browser game",
    accent: "#e2543b",
    media: {
      image: "/images/projects/spintop/placeholder-1.svg",
      video: "/video/spintop-placeholder.mp4",
    },
  },
];
