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
      "Web apps built around data: dashboards, workflows, the API plumbing underneath. Ten years of production React, TypeScript and Node behind it. I go local-first where it makes sense and test the parts that actually matter.",
  },
  {
    id: "mobile",
    anchor: "work-mobile",
    title: "Mobile",
    blurb:
      "Flutter apps that ship to Android, iOS, web and desktop from one codebase, custom rendering and offline-first data included. Both apps below came out of my own daily habit of studying Japanese, its history and its culture.",
  },
  {
    id: "gaming",
    anchor: "work-gaming",
    title: "Gaming",
    blurb:
      "Gaming is where I do this for fun as much as for work. Browser games and real-time builds with custom physics, procedural art, synthesized audio, and all the small game-feel details in between.",
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
    tagline: "Manage your money and actually learn accounting while you do it.",
    description:
      "A local-first finance app built on real double-entry bookkeeping. Every simple 'money moved from X to Y' you log gets shown as the actual journal entry behind it, debits and credits included. The Learn section teaches accounting straight from your own numbers instead of a textbook example.",
    highlights: [
      "A real double-entry engine underneath: normal balances, entry validation, trial balance, the accounting equation. Fully unit-tested, and the UI won't let you post an unbalanced entry.",
      "The entry form doubles as a teacher: it previews the journal entry your transaction generates and explains why each side gets debited or credited.",
      "Lessons run on your live data. Watch Assets = Liabilities + Equity hold true across your actual finances.",
      "Local-first: everything lives in your browser (IndexedDB), one-click JSON export and import. No account, no cloud.",
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
    slug: "karakuri",
    category: "business",
    name: "karakuri からくり",
    tagline: "Programming, one block at a time.",
    description:
      "A Scratch-style block-programming environment that teaches real programming concepts through turtle graphics. Snap blocks together and watch your program run as an actual process: a sandboxed interpreter executes it step by step, lighting up each block as the turtle draws it out. Loops, nesting and abstraction, made visible instead of abstract.",
    highlights: [
      "Stepped execution with live block highlighting. A speed slider turns 'the computer runs your code' into something you can actually watch, and pause.",
      "Custom turtle blocks alongside Blockly's loops, math, logic, variables and functions.",
      "Lessons are just data with a geometric validator behind them. 'The square' teaches loops, 'The staircase' teaches nesting, and the app checks what you actually drew, not which blocks you used.",
      "Workspace auto-saves locally, JSON export and import included. No account, no cloud.",
    ],
    stack: ["TypeScript", "React 19", "Vite", "Blockly", "JS-Interpreter", "Canvas", "Tailwind CSS v4", "Vitest"],
    platform: "Web app",
    accent: "#f59e0b",
    media: {
      image: "/images/projects/karakuri/editor.png",
    },
    link: "./apps/karakuri/",
  },
  {
    slug: "chronomap",
    category: "mobile",
    caseStudy: "chronomap",
    name: "Chronomap",
    tagline: "An interactive history and geography map you can scrub through time.",
    description:
      "A full-screen, mobile-first Flutter app for exploring history and geography across about 4,000 years. Drag the epoch slider anywhere from 2000 BCE to today and the map morphs its borders, fades events in and out around their date, and shifts its whole color mood from parchment-warm in the deep past to crisp and modern today.",
    highlights: [
      "Five knowledge modes (military history, literature, philosophy, medicine, natural disasters), plus a live geography mode covering nature, wonders, cities and culture.",
      "Live event data pulled from Wikidata and merged with a bundled seed dataset, ranked by how prominent each event actually was.",
      "Hand-rolled zoom clustering and historical border morphing, built to survive a mapping library that changes fast.",
      "Procedural 2.5D wonders: 14 architecture archetypes rendered entirely in code, animating their own construction and collapse as you scrub through their era.",
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
      "Import an EPUB or plain text file (or a paired original and translation) and read it with per-token JLPT color coding, tap-to-look-up dictionary entries, select-to-translate, switchable view modes, custom reading themes and text-to-speech. Built for people who'd rather read real Japanese fiction than another textbook dialogue.",
    highlights: [
      "Per-token JLPT-level color coding so you can gauge a page's difficulty at a glance.",
      "Tap any word for an instant dictionary lookup, or select a passage to translate.",
      "Switchable reading view modes and custom themes for long reading sessions.",
      "Built-in text-to-speech for listening practice alongside reading.",
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
      "A top-down spinning-top battler with almost no art assets. Every spinner, spark, arena and aura effect gets drawn procedurally in code, and every sound is synthesized live with WebAudio. Wind up your launch by circling the pointer, flick your top into the dish, and out-maneuver an AI opponent running the exact same physics you are.",
    highlights: [
      "Custom physics: pointer steering, dish-bowl force, gyroscopic drift, and a multi-stage clash pipeline with three finish types.",
      "Five stat archetypes with their own AI behaviour, a full parts system (blades, discs, drivers), and five archetype-specific legendary special moves.",
      "A builder/spender 'aura' system: play precisely and you charge a visible flame aura you can cash in for a harder hit.",
      "Best-of-3 matches, an unlockable roster, adjustable AI difficulty, and a JRPG-style story mode with branching dialogue.",
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
    tagline: "A Japanese-typing samurai game where your keyboard is the sword.",
    description:
      "Type romaji to slash your way through Edo-period Japan. Words fly at you as enemies close in, and every kana you type correctly lands as a sword stroke. A journey mode walks you from JLPT N5 vocabulary in the Edo countryside toward Kyoto, dojo by dojo, era by era.",
    highlights: [
      "An NFA-based romaji matcher that accepts every valid romanization of a kana sequence as you type it.",
      "JLPT-graded progression (N5 upward) with a journey map, dojos, and roadside encounters.",
      "Sprite-sheet art with a procedural fallback built in, so the game stays playable even if an asset fails to load.",
      "Hybrid audio: sampled instruments with a per-slot synth fallback on the hirajoshi scale.",
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
      "A platform-arena brawl between mages, installable as a PWA. The core idea: every spell family has its own cast mechanic (holds, flicks, slings, channels), so switching loadouts changes how your hands play the game, not just the numbers behind it. Fight AI mages across different arenas, or warm up alone in the practice range.",
    highlights: [
      "Data-driven spell registry: every spell implements lifecycle hooks and a cast mode, dispatched by one casting system.",
      "One entity class serves player and AI alike, driven through the same movement-intent interface.",
      "Fully procedural textures and particle effects (soft-dot glows, shockwaves, hit-stop) generated at boot.",
      "Intent-based input layer with a matching touch scheme, installable as an offline-first PWA.",
    ],
    stack: ["TypeScript", "Phaser 3", "Vite", "Arcade Physics", "PWA"],
    platform: "Browser game",
    accent: "#7c6ff0",
    media: {
      image: "/images/projects/grimoire/gameplay.png",
    },
  },
];
