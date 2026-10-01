import type { Job, TeamMember } from "./types";

export const story = {
  intro:
    "GRITZNOVA was founded on a simple idea: businesses deserve engineering partners who are as invested in the outcome as they are.",
  paragraphs: [
    "[Tell your founding story in two or three short paragraphs: why the company exists, what problem you saw and what you do differently.]",
    "Today we help startups, growing businesses and established organisations build software, adopt AI and move to the cloud, with small senior teams, transparent delivery and code they fully own.",
  ],
  mission:
    "Help businesses build, scale and transform with modern software, AI and cloud, delivered with craft, honesty and accountability.",
};

export const values = [
  {
    title: "Outcomes over output",
    body: "We measure success by the impact on your business, not by lines of code.",
  },
  {
    title: "Radical clarity",
    body: "Honest estimates, plain language and no surprises, even when the news is bad.",
  },
  {
    title: "Craft that lasts",
    body: "Software that is tested, documented and pleasant to maintain for years.",
  },
  {
    title: "Own the result",
    body: "We take responsibility from the first workshop to production and beyond.",
  },
];

/** Replace with your real team. Add photos to /public/team and set `photo`. */
export const team: TeamMember[] = [
  { placeholder: true, name: "[Name]", role: "Founder & CEO", bio: "[One-line bio]" },
  { placeholder: true, name: "[Name]", role: "CTO", bio: "[One-line bio]" },
  { placeholder: true, name: "[Name]", role: "Head of AI", bio: "[One-line bio]" },
  { placeholder: true, name: "[Name]", role: "Lead Cloud Engineer", bio: "[One-line bio]" },
];

/** Open roles. Leave the array empty to show a general "send us your CV" message. */
export const jobs: Job[] = [
  {
    slug: "senior-full-stack-engineer",
    title: "[Senior Full-Stack Engineer]",
    location: "[Remote / City]",
    type: "Full-time",
    summary: "[Short role summary. Replace or delete this example role.]",
  },
];
