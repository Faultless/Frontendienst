// ---------------------------------------------------------------------------
// Central place to edit YOUR business details. Everything here shows up
// somewhere on the site — fill in the TODOs and you're most of the way done.
// ---------------------------------------------------------------------------

export const site = {
  name: "frontendienst",
  tagline: "Frontend web apps & Flutter mobile apps, built by a contractor who ships.",

  // TODO: swap in your real name / handle — shown in the footer and About section.
  ownerName: "Serge Kamel",

  // TODO: real contact email. Used for the mailto: link and shown as text.
  email: "faultless.git@gmail.com",

  // TODO: freeform location / availability line, e.g. "Based in Berlin · Remote, EU timezones"
  location: "Remote · Available for contract & freelance work",

  // TODO: fill in the profiles you actually want linked; delete any you don't use.
  socials: [
    { label: "GitHub", href: "https://github.com/Faultless" },
    { label: "LinkedIn", href: "https://linkedin.com/in/serge~kamel" },
  ],

  // Shown in <title> and meta description.
  seo: {
    title: "frontendienst — Frontend & Flutter contractor",
    description:
      "Independent contractor building frontend web apps, Flutter mobile apps, and browser games. See live projects: an interactive history map, a language-learning reader, and a physics battle game.",
  },
} as const;
