export type CaseStudySection = {
  heading: string;
  body: string[];
};

export type CaseStudy = {
  slug: string;
  /** Must match a project slug — the card links here. */
  projectSlug: string;
  title: string;
  subtitle: string;
  hero: string;
  liveUrl?: string;
  liveLabel?: string;
  facts: Array<[string, string]>;
  sections: CaseStudySection[];
  gallery: Array<{ src: string; caption: string; portrait?: boolean }>;
  takeaway: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "spintop",
    projectSlug: "spintop",
    title: "SpinTop Arena",
    subtitle:
      "Shipping a physics battler with zero art budget — every sprite, arena, and sound generated in code.",
    hero: "/images/case-studies/spintop/shot-2.png",
    liveUrl: "https://parastoner.itch.io/spintop-arena",
    liveLabel: "Play on itch.io",
    facts: [
      ["Role", "Everything — design, code, audio, balancing"],
      ["Stack", "TypeScript · Phaser 3 · Vite · WebAudio"],
      ["Ships as", "Browser game on itch.io + Electron desktop build"],
      ["Art budget", "€0 — fully procedural rendering"],
    ],
    sections: [
      {
        heading: "The constraint",
        body: [
          "A game jam-style bet: build a spinning-top battler that feels like the anime without a single art asset. No sprite packs, no commissioned art, no recorded audio — everything the player sees and hears must come out of code. That constraint isn't a gimmick; it's the fastest path to a consistent look for a solo developer, and it keeps the entire game under a few hundred kilobytes.",
        ],
      },
      {
        heading: "The build",
        body: [
          "Rendering is a layered vector pipeline: each top is assembled from silhouettes, gradient annulus bands, wedges, and specular highlights drawn with Phaser Graphics, then cached per-part as textures — mixed part builds get cache hits for free. Physics is custom: pointer steering, a dish-bowl centering force, gyroscopic drift as spin decays, and a multi-stage clash pipeline that resolves hits into knockbacks, bursts, or ring-outs.",
          "Audio is a WebAudio synthesizer: the metallic clash is stacked detuned squares through a high-Q bandpass; the crowd is filtered noise. Game feel comes from a pooled particle system that participates in hit-stop time scaling, so freeze-frames hold sparks mid-air.",
        ],
      },
      {
        heading: "What was hard",
        body: [
          "Making 'circling the pointer to wind up a launch' readable was the hardest interaction problem — it took a velocity-sampling gesture recognizer that works identically for mouse and touch. Balancing five stat archetypes against an AI that uses the same physics as the player (no cheating) meant building a headless playtest harness that runs matches in CI and reports win rates.",
        ],
      },
    ],
    gallery: [
      { src: "/images/case-studies/spintop/shot-1.png", caption: "Story mode — pre-match dialogue in the Metro Dome" },
      { src: "/images/case-studies/spintop/shot-2.png", caption: "Live clash — motion trails, aura, and HUD, all procedural" },
    ],
    takeaway:
      "Proof that I can take a real-time, physics-driven product from empty repo to shipped and hosted — including the parts studios usually staff separately: rendering, audio, AI, and balance tooling.",
  },
  {
    slug: "linguapop",
    projectSlug: "linguapop",
    title: "LinguaPop",
    subtitle:
      "A Japanese reading app that turns real news and novels into graded study material — tokenized, color-coded, and dictionary-backed, fully offline.",
    hero: "/images/case-studies/linguapop/shot-3.png",
    liveUrl: "https://faultless.github.io/linguapop-extension",
    liveLabel: "See the product site",
    facts: [
      ["Role", "Everything — product, Flutter app, NLP pipeline"],
      ["Stack", "Flutter · Dart · Riverpod · MeCab · Hive"],
      ["Ships as", "Android app + web build"],
      ["Data", "On-device tokenizer + JMdict dictionary — no server"],
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Language learners hit a wall between textbooks and real Japanese: native material has no furigana, no glossary, and no sense of what's at your level. Existing readers either require pasting text into a website or stream everything through someone's server. I wanted the opposite: import anything — an EPUB novel, today's NHK article — and read it like a learner's edition, entirely on-device.",
        ],
      },
      {
        heading: "The build",
        body: [
          "The core is an on-device NLP pipeline: MeCab tokenizes raw Japanese into words, each token is JLPT-graded and underlined in its level color, and any tap opens a JMdict dictionary sheet with readings, senses, and frequency tags. A paired-translation mode aligns the original with an English version paragraph by paragraph — 原 / EN / Both at the flick of a toggle.",
          "Around that sits a real reader: a library with reading progress, eleven typography-tuned themes from Paper to E-ink to Forest, adjustable line height and column width, chapter navigation, and text-to-speech. Everything persists locally in Hive; the app never phones home.",
        ],
      },
      {
        heading: "What was hard",
        body: [
          "Running MeCab — a native C++ tokenizer — inside a Flutter app across Android and desktop meant wrangling FFI, dictionary packaging, and platform builds. Token-level color coding had to survive text selection, font scaling, and vertical rhythm without wrecking reading flow: the underline treatment came out of a lot of failed attempts at background highlighting.",
        ],
      },
    ],
    gallery: [
      { src: "/images/case-studies/linguapop/shot-5.png", caption: "Library — imported news feeds and novels with progress", portrait: true },
      { src: "/images/case-studies/linguapop/shot-3.png", caption: "Reading view — JLPT color-graded tokens, Forest theme", portrait: true },
      { src: "/images/case-studies/linguapop/shot-4.png", caption: "Tap any word — offline JMdict lookup with JLPT tags", portrait: true },
      { src: "/images/case-studies/linguapop/shot-2.png", caption: "Eleven reader themes with full typography control", portrait: true },
      { src: "/images/case-studies/linguapop/shot-1.png", caption: "Chapter navigation over a live news feed", portrait: true },
    ],
    takeaway:
      "Proof of end-to-end product work on a genuinely hard domain: native NLP integration, offline-first architecture, and the hundreds of small reading-comfort decisions that make an app feel like a product instead of a demo.",
  },
  {
    slug: "chronomap",
    projectSlug: "chronomap",
    title: "Chronomap",
    subtitle:
      "Four thousand years of history on one map — scrub an epoch slider and watch borders morph, events surface, and journeys replay.",
    hero: "/images/case-studies/chronomap/shot-1.png",
    liveUrl: "https://faultless.github.io/chronomap/",
    liveLabel: "See the product site",
    facts: [
      ["Role", "Everything — design, data pipeline, Flutter app"],
      ["Stack", "Flutter · Dart · Riverpod · flutter_map · Wikidata SPARQL"],
      ["Ships as", "Android app + web build"],
      ["Data", "Bundled seed dataset + live Wikidata queries"],
    ],
    sections: [
      {
        heading: "The idea",
        body: [
          "History apps are timelines; geography apps are maps. Understanding actually lives in the join: what was happening *here*, *then*? Chronomap puts an epoch slider under a world map — drag from 2000 BCE to today and borders morph between historical snapshots, events fade in around their dates, and the map re-tints from parchment to modern as you approach the present.",
        ],
      },
      {
        heading: "The build",
        body: [
          "Content is mode-based — military history, philosophy, literature, medicine, disasters, plus a live geography mode — each pulling from a bundled seed dataset merged with live Wikidata SPARQL queries, ranked by real-world prominence so zooming out shows Magellan, not trivia. Every event card links to Wikipedia; journeys (a circumnavigation, a campaign) replay as animated routes with a Play button.",
          "The cartography is hand-rolled where it matters: zoom-dependent clustering that groups 86 philosophers into readable bubbles over Meiji Japan, historical border morphing built version-proof against a fast-moving mapping library, and region chips that slice results by prefecture.",
        ],
      },
      {
        heading: "What was hard",
        body: [
          "Historical geodata is messy and gigantic. Getting border morphing smooth meant normalizing wildly inconsistent polygon sources and interpolating between snapshots without visual tearing. The Wikidata pipeline needed aggressive caching and prominence ranking to stay responsive on a phone — a naive query returns thousands of unranked entities.",
        ],
      },
    ],
    gallery: [
      { src: "/images/case-studies/chronomap/shot-1.png", caption: "1500 CE — the First Circumnavigation, with a replayable journey", portrait: true },
      { src: "/images/case-studies/chronomap/shot-3.png", caption: "Philosophy mode — clustered thinkers across Meiji-era Japan", portrait: true },
      { src: "/images/case-studies/chronomap/shot-2.png", caption: "Every figure gets a sourced card — Wikipedia one tap away", portrait: true },
    ],
    takeaway:
      "Proof of data-heavy product engineering: external knowledge-graph integration, custom map rendering under real performance constraints, and information design that keeps 4,000 years navigable on a phone screen.",
  },
];
