import { BrainCircuit, Cloud, Code2, Compass, GitBranch, Smartphone } from "lucide-react";
import type { Service } from "./types";

export const services: Service[] = [
  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    shortTitle: "Custom Software",
    icon: Code2,
    value: "Software built around how your business actually works, not the other way round.",
    capabilities: [
      "Product discovery & architecture",
      "Web platforms, APIs & integrations",
      "Legacy modernisation",
    ],
    headline: "Ship the software your business runs on",
    intro:
      "Off-the-shelf tools stop fitting the moment you grow. We design and build software that matches your workflows, connects to your existing systems, and stays maintainable as you scale.",
    outcomes: [
      {
        title: "Ship faster",
        body: "Small, senior teams working in two-week increments. You see working software early and often.",
      },
      {
        title: "Own your platform",
        body: "Clean, documented code and infrastructure-as-code you fully own. No lock-in.",
      },
      {
        title: "Fewer manual steps",
        body: "We automate the spreadsheets, copy-paste and email chains slowing your team down.",
      },
    ],
    deliverables: [
      "Discovery workshop and technical roadmap",
      "System architecture and data model",
      "Production-ready web application and APIs",
      "Automated test suite and CI/CD pipeline",
      "Documentation and handover sessions",
    ],
    stack: ["TypeScript", "Next.js", "Node.js", "Python", "Go", "PostgreSQL", "GraphQL"],
    idealFor: [
      "Teams outgrowing spreadsheets and off-the-shelf tools",
      "Companies modernising a legacy system",
      "Founders building a new product",
    ],
  },
  {
    slug: "ai-machine-learning",
    title: "AI & Machine Learning",
    shortTitle: "AI & ML",
    icon: BrainCircuit,
    value:
      "Put AI to work on real business problems, with measurable results and proper guardrails.",
    capabilities: [
      "LLM assistants & RAG over your data",
      "Workflow automation with AI agents",
      "Predictive models & analytics",
    ],
    headline: "Automate with AI, without the hype",
    intro:
      "We start from the business problem, not the model. Then we build AI features that are evaluated, observable and safe, so they hold up in production rather than only in a demo.",
    outcomes: [
      {
        title: "Automate repetitive work",
        body: "AI agents that triage tickets, extract documents and draft responses, with a human in the loop where it matters.",
      },
      {
        title: "Answers from your own data",
        body: "Retrieval-augmented assistants grounded in your documents, with citations and access control.",
      },
      {
        title: "Measured, not guessed",
        body: "Every AI feature ships with an evaluation set, so quality is tracked and regressions are caught.",
      },
    ],
    deliverables: [
      "AI opportunity assessment and ROI estimate",
      "Proof of concept with an evaluation benchmark",
      "Production integration (API, app or internal tool)",
      "Monitoring, cost controls and safety guardrails",
      "Team enablement and documentation",
    ],
    stack: ["Claude API", "Python", "LangGraph", "pgvector", "PyTorch", "scikit-learn", "MLflow"],
    idealFor: [
      "Operations teams buried in repetitive work",
      "Companies with large document or knowledge bases",
      "Products that want AI features customers will actually use",
    ],
  },
  {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    shortTitle: "Cloud",
    icon: Cloud,
    value: "Cloud infrastructure that is secure, scalable and sized to what you actually use.",
    capabilities: [
      "Cloud migration & architecture",
      "Cost optimisation & FinOps",
      "Security, compliance & reliability",
    ],
    headline: "Cut cloud costs. Scale with confidence.",
    intro:
      "Whether you're moving to the cloud or already there and paying too much, we design infrastructure that's reliable, secure and right-sized for your workload.",
    outcomes: [
      {
        title: "Lower monthly spend",
        body: "We find idle resources, oversized instances and missing commitments, then fix them.",
      },
      {
        title: "Built to scale",
        body: "Autoscaling, multi-zone architecture designed for the traffic you expect, and for the spikes you don't.",
      },
      {
        title: "Secure by default",
        body: "Least-privilege access, encrypted data, audit logging and guardrails from day one.",
      },
    ],
    deliverables: [
      "Cloud readiness and cost assessment",
      "Target architecture and migration plan",
      "Infrastructure-as-code (Terraform / CDK)",
      "Monitoring, alerting and runbooks",
      "Cost dashboards and optimisation report",
    ],
    stack: ["AWS", "Google Cloud", "Azure", "Terraform", "Kubernetes", "Cloudflare"],
    idealFor: [
      "Companies migrating from on-premise servers",
      "Teams with rising, unpredictable cloud bills",
      "Products preparing for rapid growth",
    ],
  },
  {
    slug: "devops-automation",
    title: "DevOps & Automation",
    shortTitle: "DevOps",
    icon: GitBranch,
    value: "Release several times a day with confidence instead of dreading release night.",
    capabilities: [
      "CI/CD pipelines & release automation",
      "Containers & Kubernetes",
      "Observability & incident response",
    ],
    headline: "Release faster, break less",
    intro:
      "Slow, manual releases cost you speed and sleep. We automate the path from commit to production so your team can ship small changes safely and often.",
    outcomes: [
      {
        title: "Faster delivery",
        body: "Automated build, test and deploy pipelines replace manual, error-prone release steps.",
      },
      {
        title: "Fewer incidents",
        body: "Preview environments, automated checks and safe rollbacks catch problems before users do.",
      },
      {
        title: "See what's happening",
        body: "Logs, metrics and traces in one place, with alerts that are actionable rather than noisy.",
      },
    ],
    deliverables: [
      "Delivery pipeline assessment",
      "CI/CD pipelines with automated testing",
      "Containerisation and orchestration setup",
      "Observability stack and alerting",
      "Runbooks and on-call playbooks",
    ],
    stack: [
      "GitHub Actions",
      "GitLab CI",
      "Docker",
      "Kubernetes",
      "Argo CD",
      "Grafana",
      "OpenTelemetry",
    ],
    idealFor: [
      "Teams with slow or manual release processes",
      "Products suffering frequent production incidents",
      "Companies adopting containers and Kubernetes",
    ],
  },
  {
    slug: "web-mobile-apps",
    title: "Web & Mobile Apps",
    shortTitle: "Web & Mobile",
    icon: Smartphone,
    value: "Fast, accessible web and mobile apps that customers enjoy using.",
    capabilities: [
      "Web apps & marketing sites",
      "iOS & Android with React Native",
      "UX/UI design & design systems",
    ],
    headline: "Apps your customers come back to",
    intro:
      "We design and build web and mobile experiences that load fast, work for everyone and turn visitors into customers, from first sketch to the app stores.",
    outcomes: [
      {
        title: "Faster experiences",
        body: "Performance budgets and modern rendering keep pages quick, even on slow networks.",
      },
      {
        title: "One codebase, every screen",
        body: "Shared design systems and React Native mean consistent experiences across web, iOS and Android.",
      },
      {
        title: "Accessible by default",
        body: "WCAG 2.1 AA from the first component, so nobody is locked out.",
      },
    ],
    deliverables: [
      "UX research, wireframes and prototypes",
      "UI design and component library",
      "Web application and/or iOS & Android apps",
      "App store submission and release management",
      "Analytics and conversion tracking",
    ],
    stack: ["React", "Next.js", "React Native", "Expo", "Tailwind CSS", "Figma"],
    idealFor: [
      "Businesses launching a customer-facing product",
      "Teams replacing a slow or outdated app",
      "Brands that need web and mobile in sync",
    ],
  },
  {
    slug: "digital-transformation-consulting",
    title: "Digital Transformation & Consulting",
    shortTitle: "Consulting",
    icon: Compass,
    value: "A clear, practical technology roadmap and the senior expertise to deliver it.",
    capabilities: [
      "Technology strategy & roadmaps",
      "Architecture & code reviews",
      "Fractional CTO & team augmentation",
    ],
    headline: "Make better technology decisions",
    intro:
      "Not every problem needs new software. We help leadership teams decide what to build, buy or retire, then support delivery with senior engineers who've done it before.",
    outcomes: [
      {
        title: "Clarity on priorities",
        body: "A roadmap ranked by business impact, with honest effort and risk estimates.",
      },
      {
        title: "De-risked delivery",
        body: "Independent architecture and code reviews surface problems before they become expensive.",
      },
      {
        title: "Senior capacity, on demand",
        body: "Fractional CTO and embedded engineers who strengthen your team without a long hiring cycle.",
      },
    ],
    deliverables: [
      "Current-state assessment",
      "Technology strategy and prioritised roadmap",
      "Architecture or code review report",
      "Vendor and build-vs-buy evaluation",
      "Ongoing advisory or embedded engineering",
    ],
    stack: ["Architecture reviews", "Process design", "Vendor evaluation", "Team coaching"],
    idealFor: [
      "Leadership teams planning a modernisation programme",
      "Companies without in-house technical leadership",
      "Investors and boards needing technical due diligence",
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
