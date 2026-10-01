import { Gauge, Layers, MessagesSquare, ShieldCheck } from "lucide-react";
import type { ClientLogo, Differentiator, ProcessStep, StackGroup, Stat } from "./types";

/** Client logos. Add real logos to /public/logos and set `logo` + `placeholder: false`. */
export const clientLogos: ClientLogo[] = Array.from({ length: 8 }, (_, i) => ({
  name: `[CLIENT LOGO ${i + 1}]`,
  placeholder: true,
}));

export const differentiators: Differentiator[] = [
  {
    icon: Layers,
    title: "Senior engineers, end to end",
    body: "The people who scope your project are the people who build it. No hand-offs to a junior bench.",
    proof: "Small, senior teams per engagement",
  },
  {
    icon: Gauge,
    title: "Working software every two weeks",
    body: "Short delivery cycles with a live demo each sprint, so you always know where things stand.",
    proof: "Fortnightly demos and written progress reports",
  },
  {
    icon: ShieldCheck,
    title: "Built to be owned",
    body: "Clean code, tests, infrastructure-as-code and documentation. You keep full IP and are never locked in.",
    proof: "Full IP ownership transferred to you",
  },
  {
    icon: MessagesSquare,
    title: "Plain-English communication",
    body: "Clear trade-offs, honest estimates and a shared channel with the team. No surprises.",
    proof: "Dedicated point of contact and a shared Slack/Teams channel",
  },
];

export const processSteps: ProcessStep[] = [
  {
    title: "Discover",
    duration: "1–2 weeks",
    body: "We dig into your goals, users and constraints, and agree what success looks like.",
    outputs: ["Goals & success metrics", "Scope & risks", "Estimate"],
  },
  {
    title: "Design",
    duration: "1–3 weeks",
    body: "Architecture, UX and a delivery plan, validated with prototypes before we write production code.",
    outputs: ["Architecture", "Prototypes", "Roadmap"],
  },
  {
    title: "Build",
    duration: "Iterative",
    body: "Two-week sprints with working software at every demo. You see progress and steer priorities.",
    outputs: ["Sprint demos", "Tested code", "CI/CD"],
  },
  {
    title: "Launch",
    duration: "1–2 weeks",
    body: "Hardening, performance and security checks, then a controlled release with monitoring in place.",
    outputs: ["Go-live plan", "Monitoring", "Handover"],
  },
  {
    title: "Scale",
    duration: "Ongoing",
    body: "Support, optimisation and new features as your product and team grow.",
    outputs: ["SLA support", "Optimisation", "New features"],
  },
];

export const techStack: StackGroup[] = [
  { name: "Frontend", items: ["React", "Next.js", "TypeScript", "React Native", "Tailwind CSS"] },
  { name: "Backend", items: ["Node.js", "Python", "Go", "PostgreSQL", "GraphQL", "Redis"] },
  { name: "Cloud", items: ["AWS", "Google Cloud", "Azure", "Cloudflare", "Vercel"] },
  { name: "AI & Data", items: ["Claude API", "LangGraph", "pgvector", "PyTorch", "dbt"] },
  { name: "DevOps", items: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "Grafana"] },
];

/**
 * Stats band. REAL NUMBERS ONLY. Leave `value: null` until you have a figure you can stand behind.
 * While a value is null the counter renders a dashed placeholder instead of a number.
 */
export const stats: Stat[] = [
  { value: null, suffix: "+", label: "Projects delivered", placeholder: true },
  { value: null, suffix: "+", label: "Years of experience", placeholder: true },
  { value: null, suffix: "", label: "Countries served", placeholder: true },
  { value: null, suffix: "%", label: "Client retention", placeholder: true },
];
