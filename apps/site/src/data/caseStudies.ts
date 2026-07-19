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
      "I shipped a physics battler with zero art budget. Every sprite, arena and sound came out of code, nothing else.",
    hero: "/images/case-studies/spintop/shot-2.png",
    liveUrl: "https://parastoner.itch.io/spintop-arena",
    liveLabel: "Play on itch.io",
    facts: [
      ["Role", "Everything: design, code, audio, balancing"],
      ["Stack", "TypeScript · Phaser 3 · Vite · WebAudio"],
      ["Ships as", "Browser game on itch.io + Electron desktop build"],
      ["Art budget", "€0 (fully procedural rendering)"],
    ],
    sections: [
      {
        heading: "The constraint",
        body: [
          "It started as a bet with myself: build a spinning-top battler that feels like the anime, without a single art asset. No sprite packs, no commissioned art, no recorded audio. Everything the player sees and hears has to come out of code. That's not a gimmick for its own sake. For a solo developer it's the fastest way to get a consistent look, and it keeps the whole game under a few hundred kilobytes.",
        ],
      },
      {
        heading: "The build",
        body: [
          "Rendering is a layered vector pipeline. Each top gets assembled from silhouettes, gradient annulus bands, wedges and specular highlights, all drawn with Phaser Graphics and then cached per-part as textures, so mixed part builds get cache hits for free. Physics is fully custom: pointer steering, a dish-bowl centering force, gyroscopic drift as the spin decays, and a multi-stage clash pipeline that turns hits into knockbacks, bursts or ring-outs.",
          "Audio runs through a WebAudio synthesizer. The metallic clash sound is stacked, detuned square waves through a high-Q bandpass filter. The crowd noise is just filtered noise. A pooled particle system ties into hit-stop time scaling for the game feel, so a freeze-frame actually holds sparks mid-air instead of just pausing the screen.",
        ],
      },
      {
        heading: "What was hard",
        body: [
          "The hardest interaction problem was making 'circle the pointer to wind up a launch' feel readable. That took a velocity-sampling gesture recognizer that behaves the same on mouse and touch. Balancing five stat archetypes against an AI that plays by the same physics as the player (no cheating) meant building a headless playtest harness that runs matches in CI and reports win rates back to me.",
        ],
      },
    ],
    gallery: [
      { src: "/images/case-studies/spintop/shot-1.png", caption: "Story mode: pre-match dialogue in the Metro Dome" },
      { src: "/images/case-studies/spintop/shot-2.png", caption: "Live clash: motion trails, aura and HUD, all procedural" },
    ],
    takeaway:
      "This is proof I can take a real-time, physics-heavy product from an empty repo all the way to shipped and hosted, including the parts most studios staff separately: rendering, audio, AI, balance tooling.",
  },
  {
    slug: "linguapop",
    projectSlug: "linguapop",
    title: "LinguaPop",
    subtitle:
      "A Japanese reading app that turns real news and novels into graded study material: tokenized, color-coded, dictionary-backed, and fully offline.",
    hero: "/images/case-studies/linguapop/shot-3.png",
    liveUrl: "https://faultless.github.io/linguapop-extension",
    liveLabel: "See the product site",
    facts: [
      ["Role", "Everything: product, Flutter app, NLP pipeline"],
      ["Stack", "Flutter · Dart · Riverpod · MeCab · Hive"],
      ["Ships as", "Android app + web build"],
      ["Data", "On-device tokenizer + JMdict dictionary, no server"],
    ],
    sections: [
      {
        heading: "The problem",
        body: [
          "Learners hit a wall between textbooks and real Japanese. Native material has no furigana, no glossary, no sense of what's actually at your level. Most readers I found either want you to paste text into a website, or stream everything through their own server. I wanted the opposite. Import anything, an EPUB novel, today's NHK article, and read it like a proper learner's edition, entirely on your own device.",
        ],
      },
      {
        heading: "The build",
        body: [
          "The core is an on-device NLP pipeline. MeCab tokenizes raw Japanese into words, each token gets JLPT-graded and underlined in its level color, and tapping any word opens a JMdict dictionary sheet with readings, senses and frequency tags. A paired-translation mode lines up the original against an English version paragraph by paragraph. 原, EN, or Both, one toggle away.",
          "Around that sits a proper reader: a library with reading progress, eleven typography-tuned themes from Paper to E-ink to Forest, adjustable line height and column width, chapter navigation, and text-to-speech. Everything persists locally in Hive. The app never phones home.",
        ],
      },
      {
        heading: "What was hard",
        body: [
          "Running MeCab, a native C++ tokenizer, inside a Flutter app across Android and desktop meant wrangling FFI, dictionary packaging and platform-specific builds. Token-level color coding also had to survive text selection, font scaling and line spacing without wrecking the reading flow. The underline treatment you see now came after a lot of failed attempts at background highlighting.",
        ],
      },
    ],
    gallery: [
      { src: "/images/case-studies/linguapop/shot-5.png", caption: "Library: imported news feeds and novels, with progress tracked", portrait: true },
      { src: "/images/case-studies/linguapop/shot-3.png", caption: "Reading view: JLPT color-graded tokens, Forest theme", portrait: true },
      { src: "/images/case-studies/linguapop/shot-4.png", caption: "Tap any word for an offline JMdict lookup with JLPT tags", portrait: true },
      { src: "/images/case-studies/linguapop/shot-2.png", caption: "Eleven reader themes with full typography control", portrait: true },
      { src: "/images/case-studies/linguapop/shot-1.png", caption: "Chapter navigation over a live news feed", portrait: true },
    ],
    takeaway:
      "This is end-to-end product work in a genuinely hard domain: native NLP integration, offline-first architecture, and the hundreds of small reading-comfort decisions that make something feel like a real product instead of a demo.",
  },
  {
    slug: "chronomap",
    projectSlug: "chronomap",
    title: "Chronomap",
    subtitle:
      "Four thousand years of history on one map. Scrub the epoch slider and watch borders morph, events surface, and journeys replay.",
    hero: "/images/case-studies/chronomap/shot-1.png",
    liveUrl: "https://faultless.github.io/chronomap/",
    liveLabel: "See the product site",
    facts: [
      ["Role", "Everything: design, data pipeline, Flutter app"],
      ["Stack", "Flutter · Dart · Riverpod · flutter_map · Wikidata SPARQL"],
      ["Ships as", "Android app + web build"],
      ["Data", "Bundled seed dataset + live Wikidata queries"],
    ],
    sections: [
      {
        heading: "The idea",
        body: [
          "History apps are timelines. Geography apps are maps. The actual understanding lives where they cross: what was happening here, back then? Chronomap puts an epoch slider under a world map. Drag it anywhere from 2000 BCE to today and the borders morph between historical snapshots, events fade in around their dates, and the whole map re-tints from parchment to modern the closer you get to the present.",
        ],
      },
      {
        heading: "The build",
        body: [
          "Content is organized into modes: military history, philosophy, literature, medicine, disasters, plus a live geography mode. Each one pulls from a bundled seed dataset merged with live Wikidata queries, ranked by real-world prominence, so zooming out shows you Magellan and not some random trivia. Every event card links out to Wikipedia, and journeys like a circumnavigation or a military campaign replay as animated routes with a Play button.",
          "The cartography is hand-rolled wherever it actually matters. Zoom-dependent clustering groups 86 philosophers into readable bubbles over Meiji-era Japan. Border morphing is built to survive a mapping library that keeps changing under me. Region chips let you slice results down by prefecture.",
        ],
      },
      {
        heading: "What was hard",
        body: [
          "Historical geodata is messy and huge. Getting the border morphing smooth meant normalizing wildly inconsistent polygon sources and interpolating between snapshots without any visual tearing. The Wikidata pipeline needed aggressive caching and prominence ranking just to stay responsive on a phone. A naive query hands you back thousands of unranked entities and calls it a day.",
        ],
      },
    ],
    gallery: [
      { src: "/images/case-studies/chronomap/shot-1.png", caption: "1500 CE: the First Circumnavigation, replayed as a journey", portrait: true },
      { src: "/images/case-studies/chronomap/shot-3.png", caption: "Philosophy mode: clustered thinkers across Meiji-era Japan", portrait: true },
      { src: "/images/case-studies/chronomap/shot-2.png", caption: "Every figure gets a sourced card, Wikipedia one tap away", portrait: true },
    ],
    takeaway:
      "This is data-heavy product engineering: external knowledge-graph integration, custom map rendering under real performance limits, and information design that keeps 4,000 years of history navigable on a phone screen.",
  },
];
