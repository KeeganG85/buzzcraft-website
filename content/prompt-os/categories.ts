import type { PromptCategoryId } from "@/content/prompt-os/catalogue";

export const promptCategories: { id: PromptCategoryId; name: string; blurb: string }[] = [
  {
    id: "foundations",
    name: "Business Foundations",
    blurb: "Positioning, niches, customer avatars, value propositions, competitive gaps and business models.",
  },
  {
    id: "visibility",
    name: "Audience Growth and Visibility",
    blurb: "SEO strategy, content systems, social, newsletters, LinkedIn, community and local visibility.",
  },
  {
    id: "offers",
    name: "Offers and Products",
    blurb: "Validation, packages, ebooks, courses, workshops, memberships and launch planning.",
  },
  {
    id: "conversion",
    name: "Marketing, Sales and Conversion",
    blurb: "Sales pages, landing pages, funnels, calls to action, pricing, objections and testimonials.",
  },
  {
    id: "agents",
    name: "AI Agents",
    blurb: "Business strategist, content strategist, sales copywriter, operations, research and insights agents.",
  },
  {
    id: "automation",
    name: "AI Automation",
    blurb: "Workflow builders, brand-voice systems, social operations, research assistants and support.",
  },
  {
    id: "decisions",
    name: "Decision Making",
    blurb: "Eisenhower, RICE, OODA, pre-mortems, pricing decisions, sunk-cost checks and launch checks.",
  },
  {
    id: "learning",
    name: "Learning and Skill Development",
    blurb: "Skill plans, trend research, case studies, expert simulations and tool evaluation.",
  },
  {
    id: "ops",
    name: "Productivity and Operations",
    blurb: "Weekly planning, SOPs, time audits, prioritisation and operating cadence.",
  },
];
