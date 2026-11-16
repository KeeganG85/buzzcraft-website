export type PromptCategoryId =
  | "foundations"
  | "visibility"
  | "offers"
  | "conversion"
  | "agents"
  | "automation"
  | "decisions"
  | "learning"
  | "ops";

export type PublicPrompt = {
  id: string;
  category: PromptCategoryId;
  title: string;
  purpose: string;
};

/** Titles and purposes only. Full instructions live in bodies.server.ts. */
export const publicPrompts: PublicPrompt[] = [
  {
    "id": "avatar",
    "category": "foundations",
    "title": "Ideal Customer Avatar Builder",
    "purpose": "Build a specific, local, behaviour-true picture of who actually buys  -  not a generic persona."
  },
  {
    "id": "gap",
    "category": "foundations",
    "title": "Competitor Gap Analysis",
    "purpose": "Find the gap an owner-run business can actually occupy  -  not a fantasy category."
  },
  {
    "id": "positioning",
    "category": "foundations",
    "title": "Positioning Statement Builder",
    "purpose": "Write a positioning line a staff member could repeat on a call."
  },
  {
    "id": "niche",
    "category": "foundations",
    "title": "Niche Tightener",
    "purpose": "Stop serving everyone in Gauteng. Name a tighter, richer niche."
  },
  {
    "id": "jtb",
    "category": "foundations",
    "title": "Jobs-To-Be-Done Interview",
    "purpose": "Get past demographics into the job the customer is hiring the business to do."
  },
  {
    "id": "vpc",
    "category": "foundations",
    "title": "Value Proposition Canvas",
    "purpose": "Match pains, gains and jobs to a real offer  -  in language the market uses."
  },
  {
    "id": "category-design",
    "category": "foundations",
    "title": "Category Design Prompt",
    "purpose": "Decide whether to compete in an existing category or name a clearer one."
  },
  {
    "id": "origin",
    "category": "foundations",
    "title": "Origin Story Narrative",
    "purpose": "Turn the founder story into a trust asset, not a biography."
  },
  {
    "id": "voice",
    "category": "foundations",
    "title": "Brand Voice Guardrails",
    "purpose": "Give AI (and staff) a voice they can actually write in."
  },
  {
    "id": "offer-arch",
    "category": "foundations",
    "title": "Offer Architecture Map",
    "purpose": "See the ladder from first job to flagship offer."
  },
  {
    "id": "pricing-phil",
    "category": "foundations",
    "title": "Pricing Philosophy",
    "purpose": "Replace gut-feel discounts with a philosophy the owner can defend."
  },
  {
    "id": "model-stress",
    "category": "foundations",
    "title": "Business Model Stress Test",
    "purpose": "See where the model breaks if the owner gets sick for two weeks."
  },
  {
    "id": "one-pager",
    "category": "foundations",
    "title": "One-Page Strategy Memo",
    "purpose": "Put the whole business on one page the owner can revisit on Monday."
  },
  {
    "id": "founder-time",
    "category": "foundations",
    "title": "Founder Time Audit for Positioning",
    "purpose": "See whether the calendar matches the positioning the owner claims."
  },
  {
    "id": "seo-map",
    "category": "visibility",
    "title": "SEO Keyword Opportunity Map",
    "purpose": "Find South African search demand the business can honestly serve."
  },
  {
    "id": "gbp",
    "category": "visibility",
    "title": "Google Business Profile Optimiser",
    "purpose": "Turn GBP into a working shopfront, not a neglected listing."
  },
  {
    "id": "near-me",
    "category": "visibility",
    "title": "Near Me Visibility Plan",
    "purpose": "Win the searches that happen with a suburb or \"near me\" attached."
  },
  {
    "id": "pillars",
    "category": "visibility",
    "title": "Content Pillar System",
    "purpose": "Stop random posts. Install 4 pillars that compound."
  },
  {
    "id": "engine",
    "category": "visibility",
    "title": "Weekly Content Engine",
    "purpose": "A realistic weekly engine for an owner who still delivers the work."
  },
  {
    "id": "linkedin",
    "category": "visibility",
    "title": "LinkedIn Authority Cadence",
    "purpose": "Use LinkedIn as a professional trust channel, not a ghost town."
  },
  {
    "id": "newsletter",
    "category": "visibility",
    "title": "Newsletter Welcome Sequence",
    "purpose": "A POPIA-aware welcome that teaches and earns the next click."
  },
  {
    "id": "shortform",
    "category": "visibility",
    "title": "Short-Form Script System",
    "purpose": "Turn one idea into Reels / Shorts / TikTok without dancing."
  },
  {
    "id": "community",
    "category": "visibility",
    "title": "Community Building Playbook",
    "purpose": "Decide if a community is real leverage or unpaid babysitting."
  },
  {
    "id": "pr",
    "category": "visibility",
    "title": "Local Media Pitch",
    "purpose": "Earn a local story without a PR firm."
  },
  {
    "id": "reviews",
    "category": "visibility",
    "title": "Review Generation System",
    "purpose": "Ask for reviews the consented, non-awkward way."
  },
  {
    "id": "aeo",
    "category": "visibility",
    "title": "AI Visibility Entity Pack",
    "purpose": "Make the business easier for answer engines to describe accurately."
  },
  {
    "id": "linking",
    "category": "visibility",
    "title": "Internal Linking Architecture",
    "purpose": "Connect service, location and proof pages so neither humans nor crawlers get lost."
  },
  {
    "id": "clusters",
    "category": "visibility",
    "title": "Topic Cluster Builder",
    "purpose": "Turn one money page into a cluster that can rank and convert."
  },
  {
    "id": "validate",
    "category": "offers",
    "title": "Offer Validation Interview",
    "purpose": "Test an offer with conversations before building a whole funnel."
  },
  {
    "id": "packages",
    "category": "offers",
    "title": "Good / Better / Best Package Builder",
    "purpose": "Replace one shapeless quote with three clear packages."
  },
  {
    "id": "workshop",
    "category": "offers",
    "title": "Workshop Outline",
    "purpose": "Turn expertise into a half-day workshop a local room would pay for."
  },
  {
    "id": "course",
    "category": "offers",
    "title": "Course Curriculum Architect",
    "purpose": "See if a course is justified  -  then structure it if it is."
  },
  {
    "id": "membership",
    "category": "offers",
    "title": "Membership Offer Design",
    "purpose": "Design a retainer or membership that is not just unpaid Slack."
  },
  {
    "id": "ebook-pos",
    "category": "offers",
    "title": "Ebook Positioning",
    "purpose": "Position a digital product so it is a tool, not a PDF graveyard."
  },
  {
    "id": "launch",
    "category": "offers",
    "title": "Launch Sequence Planner",
    "purpose": "A small, honest launch an owner can run without a 30-person team."
  },
  {
    "id": "bundle",
    "category": "offers",
    "title": "Irresistible Bundle Builder",
    "purpose": "Bundle only what increases completion, not cart padding."
  },
  {
    "id": "guarantee",
    "category": "offers",
    "title": "Guarantee / Risk Reversal",
    "purpose": "Write a guarantee the owner can honour in South African consumer law reality."
  },
  {
    "id": "pricing-page",
    "category": "offers",
    "title": "Pricing Page Narrative",
    "purpose": "Explain rands in a way that reduces back-and-forth quoting."
  },
  {
    "id": "menu",
    "category": "offers",
    "title": "Service Menu Rewrite",
    "purpose": "Rewrite the service list so a first-time visitor knows what to buy."
  },
  {
    "id": "retainer",
    "category": "offers",
    "title": "Retainers vs Projects",
    "purpose": "Choose the commercial shape that matches delivery capacity."
  },
  {
    "id": "productised",
    "category": "offers",
    "title": "Productised Service Blueprint",
    "purpose": "Turn a custom job into a named, repeatable service."
  },
  {
    "id": "sales-page",
    "category": "conversion",
    "title": "Sales Page Architecture",
    "purpose": "Structure a long-form sales page without American hype."
  },
  {
    "id": "landing",
    "category": "conversion",
    "title": "Landing Page Copy Writer",
    "purpose": "Write a landing page that asks for one action."
  },
  {
    "id": "wa-scripts",
    "category": "conversion",
    "title": "WhatsApp First-Response Scripts",
    "purpose": "Answer the first WhatsApp like a professional front desk."
  },
  {
    "id": "funnel",
    "category": "conversion",
    "title": "Funnel Blueprint Designer",
    "purpose": "Draw a funnel that matches how South African buyers actually move."
  },
  {
    "id": "cta-audit",
    "category": "conversion",
    "title": "CTA Clarity Audit",
    "purpose": "Make every page ask for one obvious next step."
  },
  {
    "id": "objections",
    "category": "conversion",
    "title": "Objection Handling Library",
    "purpose": "Answer the real objections without becoming a haggler."
  },
  {
    "id": "testimonials",
    "category": "conversion",
    "title": "Testimonial Request + Edit",
    "purpose": "Collect usable proof without putting words in a client's mouth."
  },
  {
    "id": "case-study",
    "category": "conversion",
    "title": "Case Study Interview",
    "purpose": "Capture a case study that is operationally specific, not a vanity quote."
  },
  {
    "id": "price-talk",
    "category": "conversion",
    "title": "Pricing Conversation Guide",
    "purpose": "Talk rands on a call without flinching or over-explaining."
  },
  {
    "id": "discovery",
    "category": "conversion",
    "title": "Discovery Call Agenda",
    "purpose": "Run a discovery call that diagnoses, not pitches for 40 minutes."
  },
  {
    "id": "followup",
    "category": "conversion",
    "title": "Seven-Day Follow-up Sequence",
    "purpose": "Follow up like a professional, not a pest."
  },
  {
    "id": "upsell",
    "category": "conversion",
    "title": "Upsell / Cross-sell Map",
    "purpose": "Offer the next useful thing, not a random add-on."
  },
  {
    "id": "recovery",
    "category": "conversion",
    "title": "Abandoned Enquiry Recovery",
    "purpose": "Recover the WhatsApp that went quiet without guilt-tripping."
  },
  {
    "id": "proposal",
    "category": "conversion",
    "title": "Proposal / Quote Narrative",
    "purpose": "Write a quote that reads like a decision document, not a price dump."
  },
  {
    "id": "agent-strategist",
    "category": "agents",
    "title": "AI Business Strategist",
    "purpose": "Install a strategist agent that asks hard questions before giving advice."
  },
  {
    "id": "agent-content",
    "category": "agents",
    "title": "AI Content Strategist",
    "purpose": "An agent that plans content from search and sales questions, not trends."
  },
  {
    "id": "agent-copy",
    "category": "agents",
    "title": "AI Sales Copywriter",
    "purpose": "A copywriter agent that stays specific and refuses fake urgency."
  },
  {
    "id": "agent-ops",
    "category": "agents",
    "title": "AI Operations Manager",
    "purpose": "Turn messy delivery into checklists and cadences."
  },
  {
    "id": "agent-research",
    "category": "agents",
    "title": "AI Research Analyst",
    "purpose": "Research that cites what it was given and flags what it was not."
  },
  {
    "id": "agent-insights",
    "category": "agents",
    "title": "AI Customer Insights Agent",
    "purpose": "Mine WhatsApp, reviews and calls (pasted, consented) for patterns."
  },
  {
    "id": "agent-pm",
    "category": "agents",
    "title": "AI Product Manager",
    "purpose": "Prioritise what to build or productise next."
  },
  {
    "id": "agent-local-seo",
    "category": "agents",
    "title": "AI Local SEO Agent",
    "purpose": "A specialist agent for GBP, pages, and near-me  -  without ranking promises."
  },
  {
    "id": "agent-popia",
    "category": "agents",
    "title": "AI Compliance Reviewer (POPIA-aware)",
    "purpose": "Review marketing drafts for consent, over-collection, and reckless claims  -  not a substitute for legal advice."
  },
  {
    "id": "agent-desk",
    "category": "agents",
    "title": "AI Front-Desk Drafts",
    "purpose": "Draft replies a human still sends."
  },
  {
    "id": "agent-proposal",
    "category": "agents",
    "title": "AI Proposal Writer",
    "purpose": "Turn discovery notes into a draft proposal."
  },
  {
    "id": "agent-prep",
    "category": "agents",
    "title": "AI Meeting Prep Agent",
    "purpose": "Walk into a meeting with a one-pager, not a panic."
  },
  {
    "id": "agent-weekly",
    "category": "agents",
    "title": "AI Weekly Review Partner",
    "purpose": "A Friday agent that turns the week into next week's plan."
  },
  {
    "id": "workflow",
    "category": "automation",
    "title": "AI Automation Workflow Builder",
    "purpose": "Design a workflow the owner can keep, with a human in the loop."
  },
  {
    "id": "brand-system",
    "category": "automation",
    "title": "Brand Voice System",
    "purpose": "A repeatable way to run any draft through voice before it ships."
  },
  {
    "id": "social-ops",
    "category": "automation",
    "title": "Social Media Management OS",
    "purpose": "Run social as an operating system, not a daily panic."
  },
  {
    "id": "research-pipe",
    "category": "automation",
    "title": "Research Assistant Pipeline",
    "purpose": "A pipeline from question → sources → brief → decision."
  },
  {
    "id": "support-macros",
    "category": "automation",
    "title": "Customer Support Macro Library",
    "purpose": "Macros a human still sends, written in the house voice."
  },
  {
    "id": "data-brief",
    "category": "automation",
    "title": "Data Analysis Brief",
    "purpose": "Ask AI to analyse only the numbers you paste."
  },
  {
    "id": "intake",
    "category": "automation",
    "title": "Lead Intake → WhatsApp → Calendar",
    "purpose": "Stop losing the Monday enquiry in the chat list."
  },
  {
    "id": "invoice-flow",
    "category": "automation",
    "title": "Invoice + Follow-up Flow",
    "purpose": "Get paid without becoming a collections department."
  },
  {
    "id": "repurpose",
    "category": "automation",
    "title": "Content Repurposing Machine",
    "purpose": "One idea, many assets, one afternoon."
  },
  {
    "id": "loom-sop",
    "category": "automation",
    "title": "SOP from Loom Transcript",
    "purpose": "Turn a screen recording transcript into a SOP a stand-in could follow."
  },
  {
    "id": "recipe",
    "category": "automation",
    "title": "Automation Recipe Designer",
    "purpose": "Describe Make/Zapier-style recipes without marrying a vendor."
  },
  {
    "id": "hitl",
    "category": "automation",
    "title": "Human-in-the-loop QA Checklist",
    "purpose": "Decide what AI may draft and what a human must sign."
  },
  {
    "id": "stack",
    "category": "automation",
    "title": "Tool Stack Simplifier",
    "purpose": "Cut tools until the stack fits an owner-run team."
  },
  {
    "id": "eisenhower",
    "category": "decisions",
    "title": "Eisenhower Matrix Week",
    "purpose": "Sort the week so urgent noise does not eat the business."
  },
  {
    "id": "rice",
    "category": "decisions",
    "title": "RICE Scoring Workshop",
    "purpose": "Score a backlog without fake precision."
  },
  {
    "id": "ooda",
    "category": "decisions",
    "title": "OODA Loop Decision",
    "purpose": "Move a stuck decision through observe-orient-decide-act."
  },
  {
    "id": "premortem",
    "category": "decisions",
    "title": "Pre-Mortem Analysis",
    "purpose": "Imagine the project failed in 90 days  -  then prevent the obvious."
  },
  {
    "id": "price-decision",
    "category": "decisions",
    "title": "Pricing Decision Brief",
    "purpose": "Decide a price without a 40-tab spreadsheet fantasy."
  },
  {
    "id": "sunk",
    "category": "decisions",
    "title": "Sunk-Cost Interrogation",
    "purpose": "Stop funding a dead offer because of last year's effort."
  },
  {
    "id": "launch-ready",
    "category": "decisions",
    "title": "Launch Readiness Check",
    "purpose": "A go/no-go that cares about operations, not vibes."
  },
  {
    "id": "hire-ai",
    "category": "decisions",
    "title": "Hire vs Outsource vs AI",
    "purpose": "Pick the capacity move that matches the bottleneck."
  },
  {
    "id": "opp-cost",
    "category": "decisions",
    "title": "Opportunity Cost Narrative",
    "purpose": "See what saying yes actually costs."
  },
  {
    "id": "meetings",
    "category": "decisions",
    "title": "Meeting Load Audit",
    "purpose": "Cut meetings that do not decide anything."
  },
  {
    "id": "yes-no",
    "category": "decisions",
    "title": "Yes/No Filter for New Offers",
    "purpose": "A fast filter so not every idea becomes a new SKU."
  },
  {
    "id": "risk-reg",
    "category": "decisions",
    "title": "Practical Risk Register",
    "purpose": "A living list, not a corporate PDF."
  },
  {
    "id": "journal",
    "category": "decisions",
    "title": "Decision Journal Template",
    "purpose": "Write the decision down so future-you can learn."
  },
  {
    "id": "skill-plan",
    "category": "learning",
    "title": "90-Day Skill Plan",
    "purpose": "Learn one skill that unlocks revenue or time  -  not a course binge."
  },
  {
    "id": "trends",
    "category": "learning",
    "title": "Trend Research Brief",
    "purpose": "Separate a real shift from a Twitter fad."
  },
  {
    "id": "case-decon",
    "category": "learning",
    "title": "Case Study Deconstruction",
    "purpose": "Learn from someone else's business without cargo-culting Silicon Valley."
  },
  {
    "id": "sim",
    "category": "learning",
    "title": "Expert Simulation (role-play)",
    "purpose": "Practice a hard conversation before it is real."
  },
  {
    "id": "tool-eval",
    "category": "learning",
    "title": "Tool Evaluation Scorecard",
    "purpose": "Choose tools with a scorecard, not a demo hangover."
  },
  {
    "id": "sprint-learn",
    "category": "learning",
    "title": "Accelerated Learning Sprint",
    "purpose": "A 14-day sprint to become dangerous enough to decide."
  },
  {
    "id": "competitor-uni",
    "category": "learning",
    "title": "Competitor Content University",
    "purpose": "Study competitors as a curriculum, not an insecurity spiral."
  },
  {
    "id": "podcast-prep",
    "category": "learning",
    "title": "Podcast / Talk Prep",
    "purpose": "Show up on a podcast or stage with 5 stories, not a brochure."
  },
  {
    "id": "book-play",
    "category": "learning",
    "title": "Book-to-Playbook Distillation",
    "purpose": "Turn a business book into a 1-page playbook for this company."
  },
  {
    "id": "mentor",
    "category": "learning",
    "title": "Mentorship Agenda",
    "purpose": "Stop wasting a mentor with updates they could read."
  },
  {
    "id": "cert",
    "category": "learning",
    "title": "Certification vs Practice",
    "purpose": "Decide if a course is leverage or delay."
  },
  {
    "id": "teach",
    "category": "learning",
    "title": "Teaching-to-Learn Outline",
    "purpose": "Learn a topic by teaching it in a 20-minute internal session."
  },
  {
    "id": "weekly",
    "category": "ops",
    "title": "Weekly Planning Prompt",
    "purpose": "Plan a week an owner can finish, not a fantasy calendar."
  },
  {
    "id": "sop",
    "category": "ops",
    "title": "SOP Generator",
    "purpose": "Write a SOP a stand-in could follow on a Tuesday."
  },
  {
    "id": "time-audit",
    "category": "ops",
    "title": "Time Audit",
    "purpose": "See where the hours actually went."
  },
  {
    "id": "prioritise",
    "category": "ops",
    "title": "Task Prioritisation",
    "purpose": "Rank today's list by business effect, not inbox volume."
  },
  {
    "id": "os",
    "category": "ops",
    "title": "Personal Operating System",
    "purpose": "Give the owner a light OS: capture, plan, do, review."
  },
  {
    "id": "wf-opt",
    "category": "ops",
    "title": "Workflow Optimisation",
    "purpose": "Shorten a painful workflow without buying software first."
  },
  {
    "id": "agenda",
    "category": "ops",
    "title": "Meeting Agenda + Notes",
    "purpose": "Every meeting ends with owners and dates."
  },
  {
    "id": "handover",
    "category": "ops",
    "title": "Handover Document",
    "purpose": "Hand work over so it does not bounce back in two days."
  },
  {
    "id": "capacity",
    "category": "ops",
    "title": "Capacity Planning",
    "purpose": "See how many jobs fit a month without heroics."
  },
  {
    "id": "triage",
    "category": "ops",
    "title": "Inbox / WhatsApp Triage",
    "purpose": "Triage messages twice a day instead of living in the bubble."
  },
  {
    "id": "q-review",
    "category": "ops",
    "title": "Quarterly Review",
    "purpose": "A quarterly review that changes the next 90 days."
  },
  {
    "id": "shutdown",
    "category": "ops",
    "title": "End-of-Day Shutdown Ritual",
    "purpose": "Close the laptop so the business does not follow the owner home."
  },
  {
    "id": "cadence",
    "category": "ops",
    "title": "Team Cadence Design",
    "purpose": "A cadence for a small team that is not enterprise theatre."
  },
  {
    "id": "docs-habit",
    "category": "ops",
    "title": "Documentation Habit Builder",
    "purpose": "Document as you go, 10 minutes at a time."
  }
];
