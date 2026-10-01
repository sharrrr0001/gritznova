import type { CaseStudy } from "./types";

/**
 * Case studies. These are SAMPLE STRUCTURES. Client names and result metrics are placeholders.
 * Replace each one with a real project (and set `placeholder: false`) before launch.
 * Never publish invented clients or numbers.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "fintech-payments-platform",
    placeholder: true,
    client: "[Client name]",
    industry: "Fintech",
    title: "Rebuilding a payments back-office for scale",
    summary:
      "A growing payments company replaced a fragile legacy back-office with a modern, event-driven platform.",
    problem:
      "Manual reconciliation and a monolithic legacy system meant slow settlements and frequent errors at month-end.",
    solution:
      "An event-driven reconciliation service on AWS, a new operations dashboard and automated reporting.",
    result: { metric: "[X]%", label: "less manual reconciliation time" },
    tech: ["TypeScript", "Node.js", "PostgreSQL", "AWS", "Terraform"],
    services: ["custom-software-development", "cloud-solutions"],
    coverVariant: 0,
    year: "[YYYY]",
    body: [
      {
        heading: "The challenge",
        paragraphs: [
          "[Describe the client's situation in two or three sentences: what wasn't working, who it affected and what it cost the business.]",
          "[Add any constraints: regulatory requirements, deadlines, legacy systems that had to stay online.]",
        ],
      },
      {
        heading: "Our approach",
        paragraphs: [
          "[Explain how discovery shaped the solution. Which options did you consider, and why did you pick this one?]",
          "[Describe the architecture and delivery approach: phases, team shape, how risk was managed.]",
        ],
      },
      {
        heading: "The outcome",
        paragraphs: [
          "[State the measurable results with real numbers the client has approved, e.g. time saved, error rate, cost.]",
        ],
      },
    ],
  },
  {
    slug: "retail-ai-support-assistant",
    placeholder: true,
    client: "[Client name]",
    industry: "Retail & e-commerce",
    title: "An AI assistant that resolves support tickets",
    summary:
      "An online retailer used an AI assistant grounded in its own catalogue and policies to handle routine customer questions.",
    problem:
      "Support volume doubled during peak season, and most tickets were repetitive order, return and sizing questions.",
    solution:
      "A Claude-powered assistant with retrieval over product data and policies, plus human handoff and an evaluation suite.",
    result: { metric: "[X]%", label: "of routine tickets resolved automatically" },
    tech: ["Python", "Claude API", "pgvector", "Next.js", "Google Cloud"],
    services: ["ai-machine-learning", "web-mobile-apps"],
    coverVariant: 1,
    year: "[YYYY]",
    body: [
      {
        heading: "The challenge",
        paragraphs: [
          "[Describe the support load, response times and the impact on customers and staff.]",
        ],
      },
      {
        heading: "Our approach",
        paragraphs: [
          "[Explain the retrieval design, guardrails, evaluation set and how humans stay in the loop.]",
          "[Mention the rollout: shadow mode, gradual traffic increase, feedback loops.]",
        ],
      },
      {
        heading: "The outcome",
        paragraphs: [
          "[Share approved metrics: resolution rate, CSAT, response time, cost per ticket.]",
        ],
      },
    ],
  },
  {
    slug: "healthcare-cloud-devops",
    placeholder: true,
    client: "[Client name]",
    industry: "Healthcare",
    title: "Cloud migration and zero-downtime releases",
    summary:
      "A healthcare software provider moved off ageing servers to a secure, automated cloud platform.",
    problem:
      "Releases needed overnight downtime, infrastructure was hand-configured and audits took weeks to prepare.",
    solution:
      "Containerised services on Kubernetes, infrastructure-as-code, CI/CD with automated checks and audit-ready logging.",
    result: { metric: "[X]×", label: "more frequent releases" },
    tech: ["Kubernetes", "Terraform", "GitHub Actions", "Azure", "Grafana"],
    services: ["devops-automation", "cloud-solutions"],
    coverVariant: 2,
    year: "[YYYY]",
    body: [
      {
        heading: "The challenge",
        paragraphs: ["[Describe the operational pain: downtime, risk, compliance overhead.]"],
      },
      {
        heading: "Our approach",
        paragraphs: [
          "[Outline the migration strategy, security controls and how you avoided disruption to patients and staff.]",
        ],
      },
      {
        heading: "The outcome",
        paragraphs: [
          "[Share approved metrics: deploy frequency, downtime, audit preparation time, cost.]",
        ],
      },
    ],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
