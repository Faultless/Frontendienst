export type ProjectMedia = {
  // Path relative to /public. Ships as an SVG placeholder — replace with a
  // real screenshot (.png/.jpg) recorded from the app and update the path.
  image: string;
  // Path relative to /public, or undefined if you haven't recorded one yet.
  // Drop an .mp4/.webm/.gif into /public/video and point this at it.
  video?: string;
};

export type CategoryId = "business" | "mobile" | "gaming";

export type Category = {
  id: CategoryId;
  /** Anchor id used in the work section and linked from service cards. */
  anchor: string;
  title: string;
  blurb: string;
};

export const categories: Category[] = [
  {
    id: "business",
    anchor: "work-business",
    title: "Business",
    blurb:
      "Web apps that run on data: dashboards, domain-heavy workflows, and the API plumbing underneath them — backed by ten years of production React/TypeScript/NodeJS work. Local-first where it fits, tested where it counts.",
  },
  {
    id: "mobile",
    anchor: "work-mobile",
    title: "Mobile",
    blurb:
      "Flutter apps that ship to Android, iOS, web, and desktop from one codebase — custom rendering and offline-first data included. Both apps below grew out of a daily practice of studying Japanese language, history, and culture.",
  },
  {
    id: "gaming",
    anchor: "work-gaming",
    title: "Gaming",
    blurb:
      "Gaming is the passion lane: browser games and real-time interactive builds with custom physics, procedural art, synthesized audio, and the game-feel polish in between.",
  },
];

export type Project = {
  slug: string;
  category: CategoryId;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  platform: "Mobile app" | "Browser game" | "Browser extension / app" | "Web app";
  accent: string; // CSS color used for this project's card accent
  media: ProjectMedia;
  // Live destination (store listing, itch.io page, hosted demo). Hidden if undefined.
  link?: string;
  // Slug of a case study under /case-studies/. Hidden if undefined.
  caseStudy?: string;
};

export const projects: Project[] = [
  {
    slug: "kakeibo",
    category: "business",
    name: "kakeibo 家計簿",
    tagline: "Manage your money and learn real accounting while you do it.",
    description:
      "A local-first personal finance app built on genuine double-entry bookkeeping. Every simple 'money moved from X to Y' you record is shown as the journal entry it really is — debits, credits, and all — and the Learn section teaches accounting principles live from your own books instead of textbook examples.",
    highlights: [
      "A real double-entry engine: normal balances, entry validation, trial balance, and the accounting equation — fully unit-tested and impossible to unbalance from the UI",
      "The entry form doubles as a teacher: it previews the journal entry your transaction generates and explains why each side is debited or credited",
      "Lessons computed from your live data — watch Assets = Liabilities + Equity hold over your actual finances",
      "Local-first: everything lives in your browser (IndexedDB) with one-click JSON export/import — no accounts, no cloud",
    ],
    stack: ["TypeScript", "React 19", "Vite", "TanStack Router", "Dexie (IndexedDB)", "Tailwind CSS v4", "Vitest", "Playwright"],
    platform: "Web app",
    accent: "#34d399",
    media: {
      image: "/images/projects/kakeibo/new-entry.png",
    },
    link: "./apps/kakeibo/",
  },
  {
    slug: "chronomap",
    category: "mobile",
    caseStudy: "chronomap",
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
      image: "/images/projects/chronomap/gameplay.png",
    },
    link: "https://faultless.github.io/chronomap/",
  },
  {
    slug: "linguapop",
    category: "mobile",
    caseStudy: "linguapop",
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
      image: "/images/projects/linguapop/gameplay.png",
    },
    link: "https://faultless.github.io/linguapop-extension",
  },
  {
    slug: "spintop",
    category: "gaming",
    caseStudy: "spintop",
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
      image: "/images/projects/spintop/gameplay.png",
    },
    link: "https://parastoner.itch.io/spintop-arena",
  },
  {
    slug: "kotodama",
    category: "gaming",
    name: "Kotodama 言霊剣",
    tagline: "A Japanese-typing samurai game — your keyboard is the sword.",
    description:
      "Type romaji to slash your way through Edo-period Japan. Words fly at you as enemies close in; every correctly typed kana is a sword stroke. A journey mode walks you from JLPT N5 vocabulary in the Edo countryside toward Kyoto, dojo by dojo, era by era.",
    highlights: [
      "An NFA-based romaji matcher that accepts every valid romanization of a kana sequence as you type it",
      "JLPT-graded progression (N5 upward) with a journey map, dojos, and roadside encounters",
      "Sprite-sheet art with graceful procedural fallbacks — the game stays playable even if an asset fails to load",
      "Hybrid audio: sampled instruments with a per-slot synth fallback on the hirajoshi scale",
    ],
    stack: ["TypeScript", "Phaser 3", "Vite", "WebAudio", "Custom NFA matcher"],
    platform: "Browser game",
    accent: "#b23a48",
    media: {
      image: "/images/projects/kotodama/title.png",
    },
  },
  {
    slug: "grimoire",
    category: "gaming",
    name: "Grimoire",
    tagline: "A 2D magic-slinging arena brawler where every spell casts differently.",
    description:
      "A platform-arena brawl between mages, installable as a PWA. The core idea: each spell family has its own cast mechanic — holds, flicks, slings, channels — so switching loadouts changes how your hands play the game, not just the numbers. Fight AI mages across arenas or warm up in the practice range.",
    highlights: [
      "Data-driven spell registry: every spell implements lifecycle hooks and a cast mode, dispatched by one casting system",
      "One entity class serves player and AI alike, driven through the same movement-intent interface",
      "Fully procedural textures and particle juice — soft-dot glows, shockwaves, hit-stop — generated at boot",
      "Intent-based input layer with a parallel touch scheme; installable offline-first PWA",
    ],
    stack: ["TypeScript", "Phaser 3", "Vite", "Arcade Physics", "PWA"],
    platform: "Browser game",
    accent: "#7c6ff0",
    media: {
      image: "/images/projects/grimoire/gameplay.png",
    },
  },
];
