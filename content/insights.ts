/**
 * Insights drafts. They stay unpublished until a person publishes them in Studio.
 *
 * TODO_VERIFY: replace the generic team byline with a named author, role and
 * short bio before launch. Named authorship materially improves GEO/AEO trust.
 */

export interface InsightFaq {
  question: string;
  answer: string;
}

export interface InsightSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface Insight {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  modifiedAt: string;
  author: string;
  authorRole: string;
  authorBio: string;
  coverImage: string;
  coverImageAlt: string;
  category: string;
  relatedServices: { label: string; href: string }[];
  directAnswer: string;
  sections: InsightSection[];
  faq: InsightFaq[];
  published: boolean;
}

export const insights: Insight[] = [
  {
    slug: "what-is-a-growth-system",
    title: "What is a growth system, and why do South African SMEs need one?",
    description:
      "A plain-English explanation of growth systems: how strategy, visibility and conversion connect into one measurable engine, and why disconnected marketing tactics quietly burn SME budgets.",
    publishedAt: "2026-07-01",
    modifiedAt: "2026-07-01",
    author: "BuzzCraft", // TODO_VERIFY named author
    authorRole: "Growth Systems Team",
    authorBio:
      "BuzzCraft is a Johannesburg growth systems agency helping South African SMEs connect strategy, visibility and conversion.",
    coverImage: "/brand/mascot-reading.webp",
    coverImageAlt: "Buzz, the BuzzCraft mascot, in a tailored suit adjusting his glasses",
    category: "Strategy",
    relatedServices: [
      { label: "Services", href: "/services/" },
      { label: "The BuzzCraft Sprint", href: "/sprint/" },
    ],
    directAnswer:
      "A growth system is the deliberate connection between three things: a clear strategy (who you serve and why you win), visibility (how the right people find you) and conversion (how interest becomes revenue). When these run as one connected engine with shared measurement, marketing stops being a monthly expense and starts compounding. Most SMEs don't lack activity; they lack the connections between activities.",
    sections: [
      {
        heading: "Why disconnected tactics feel busy but stay broke",
        paragraphs: [
          "Most South African SMEs are not short of marketing activity. There's a social media page, a website someone's cousin built in 2021, the occasional boosted post and a WhatsApp number that rings. Each piece exists. None of them talk to each other.",
          "The result is a leaky pipeline: the boosted post reaches people who were never going to buy, the website doesn't answer the questions a real buyer has, and the enquiries that do arrive land in a personal inbox where they wait three days for a reply. Every tactic looks like it's working in isolation. The business feels the truth at month-end.",
        ],
      },
      {
        heading: "The three parts of a working growth system",
        paragraphs: [
          "Strategy answers who your ideal client is, what you offer them that a competitor can't easily copy, and which channels deserve your limited budget. Without it, every other decision is a guess.",
          "Visibility is how that ideal client finds you: search, local search, AI assistants, social content and referrals. In 2026, that includes being understandable to answer engines and AI search, not just Google's ten blue links.",
          "Conversion is everything between the click and the payment: the landing page, the WhatsApp journey, the follow-up, the proposal. This is usually where South African SMEs lose the most money, because traffic they already paid for goes nowhere.",
        ],
      },
      {
        heading: "How to tell if you have a system or a pile of tactics",
        paragraphs: [
          "Ask three questions. Can you say, in one sentence, who your best customer is and why they choose you? Do you know which channel produced your last ten paying customers? When a lead comes in, does the same thing happen every time, regardless of who is on duty?",
          "If any answer is fuzzy, you have tactics, not a system. That's fixable, and the fix usually costs less than another quarter of disconnected ad spend.",
        ],
        list: [
          "One sentence that defines your ideal client and your edge",
          "Channel-level knowledge of where paying customers come from",
          "A repeatable lead journey that doesn't depend on memory",
          "One set of numbers reviewed on the same day every month",
        ],
      },
    ],
    faq: [
      {
        question: "Is a growth system only for big companies?",
        answer:
          "No. Small teams benefit most, because a system removes the dependence on one person remembering to follow up. A growth system can be as simple as a clear positioning statement, one well-built landing page, a WhatsApp response flow and a monthly numbers review.",
      },
      {
        question: "How long does it take to build a growth system?",
        answer:
          "The direction-setting work takes days, not months. The BuzzCraft Sprint produces a diagnosis and prioritised roadmap in ten business days. Implementation then happens in phases based on what will move revenue first.",
      },
    ],
    published: false,
  },
  {
    slug: "local-seo-johannesburg-guide",
    title: "How does local SEO work for Johannesburg businesses in 2026?",
    description:
      "A practical guide to local search visibility for Johannesburg and Gauteng businesses: Google Business Profile, local landing pages, reviews and how AI answer engines change the game.",
    publishedAt: "2026-07-01",
    modifiedAt: "2026-07-01",
    author: "BuzzCraft", // TODO_VERIFY named author
    authorRole: "Growth Systems Team",
    authorBio:
      "BuzzCraft is a Johannesburg growth systems agency helping South African SMEs connect strategy, visibility and conversion.",
    coverImage: "/brand/mascot-reading.webp",
    coverImageAlt: "Buzz, the BuzzCraft mascot, in a tailored suit adjusting his glasses",
    category: "Visibility",
    relatedServices: [
      { label: "Search visibility", href: "/services/search-visibility/" },
      { label: "Search Visibility Scorecard", href: "/scorecard/" },
    ],
    directAnswer:
      "Local SEO for a Johannesburg business rests on four pillars: a complete, accurate Google Business Profile; a website that names your real service areas naturally; a steady flow of genuine customer reviews; and content that answers the exact questions local buyers ask. In 2026, a fifth pillar matters: being clearly understandable to AI assistants, which increasingly answer 'best X near me' questions before a person ever sees a search results page.",
    sections: [
      {
        heading: "Start with the profile most businesses half-finish",
        paragraphs: [
          "Your Google Business Profile is often the first and only impression a local searcher gets. Complete every field: primary category, secondary categories, service areas, real photos of your work and accurate hours. Inconsistent name, address and phone details across the web quietly erode trust with both Google and customers.",
          "Then treat reviews as an operating rhythm, not a favour. Ask every satisfied customer, make it a one-tap link, and reply to every review, including the awkward ones. A considered reply to a two-star review often builds more trust than ten unanswered five-star ones.",
        ],
      },
      {
        heading: "Make your website locally legible without keyword stuffing",
        paragraphs: [
          "Search engines and AI assistants both need to understand where you operate. That means naming Johannesburg, your suburbs and Gauteng naturally in your service pages, contact section and about copy, backed by LocalBusiness structured data where the facts are verified.",
          "What it does not mean is repeating 'plumber Johannesburg plumber Sandton plumber Randburg' until the page reads like a taxi rank chalkboard. One clear, well-structured service-area page beats twenty thin duplicated suburb pages.",
        ],
      },
      {
        heading: "Answer engines are the new front door",
        paragraphs: [
          "A growing share of local discovery now happens inside AI assistants and search features that answer the question directly. These systems favour businesses whose websites state plainly what they do, where they operate, what they charge (or how pricing works) and what real customers say.",
          "The practical move: answer your most common customer questions on your own site, in plain language, near the top of the relevant page. If a human can get the answer in the first two sentences, so can an answer engine.",
        ],
      },
    ],
    faq: [
      {
        question: "Do I need a physical address to rank locally?",
        answer:
          "No. Service-area businesses can rank well using a Google Business Profile configured with service areas instead of a storefront address. What matters is consistency and genuine local relevance, not a plaque on a wall.",
      },
      {
        question: "How long before local SEO shows results?",
        answer:
          "Profile and website fixes can influence visibility within weeks; competitive positions take months of consistent reviews and content. Anyone promising page-one rankings in days is selling you airtime, not outcomes.",
      },
    ],
    published: false,
  },
  {
    slug: "whatsapp-lead-conversion-sme",
    title: "Why do WhatsApp leads go cold, and how do you fix it?",
    description:
      "WhatsApp is where South African buying conversations happen. Here's why enquiries die in the chat, and the simple journey design that turns messages into paying customers.",
    publishedAt: "2026-07-01",
    modifiedAt: "2026-07-01",
    author: "BuzzCraft", // TODO_VERIFY named author
    authorRole: "Growth Systems Team",
    authorBio:
      "BuzzCraft is a Johannesburg growth systems agency helping South African SMEs connect strategy, visibility and conversion.",
    coverImage: "/brand/mascot-reading.webp",
    coverImageAlt: "Buzz, the BuzzCraft mascot, in a tailored suit adjusting his glasses",
    category: "Conversion",
    relatedServices: [
      { label: "Lead systems", href: "/services/lead-systems/" },
      { label: "The BuzzCraft Sprint", href: "/sprint/" },
    ],
    directAnswer:
      "WhatsApp leads go cold for three reasons: slow first response, conversations that make the customer do all the work, and no follow-up when someone goes quiet. The fix is a designed journey: respond within minutes with a message that moves the conversation forward, ask one qualifying question at a time, and follow up twice on a schedule. None of this needs expensive software; it needs a decided process.",
    sections: [
      {
        heading: "The first five minutes decide most deals",
        paragraphs: [
          "In South Africa, WhatsApp is not a support channel; it's the deal room. When someone messages a business, they're usually messaging two or three competitors at the same time. The business that responds first, with something useful, sets the frame for the whole decision.",
          "A fast response doesn't require someone glued to a phone. A well-written instant reply that confirms receipt, sets response expectations and asks the first qualifying question keeps the lead warm while a human gets there.",
        ],
      },
      {
        heading: "Design the conversation before it happens",
        paragraphs: [
          "Map the five questions you ask every serious enquiry, and the order that qualifies fastest. Prepare honest answers to the five questions customers always ask you, including the pricing question everyone dreads. A saved-reply library turns a twenty-minute typing session into a two-tap answer that's better written than anything typed in traffic on the M1.",
          "Then decide what happens when a lead goes quiet. Two respectful follow-ups, spaced over a few days, recover a meaningful share of stalled conversations. Silence isn't rejection; it's usually just load shedding of attention.",
        ],
      },
      {
        heading: "Connect the chat to the rest of the system",
        paragraphs: [
          "A WhatsApp conversation that lives only on one phone is a liability. Log outcomes somewhere shared, even a simple spreadsheet: who enquired, where they came from, what happened. That's how you learn which channel sends talkers and which sends buyers.",
          "This is also where your website earns its keep. Prefilled WhatsApp links from specific pages tell you exactly what the lead was looking at, so the conversation starts halfway down the funnel instead of at 'hi, how can we help?'",
        ],
      },
    ],
    faq: [
      {
        question: "Should I use WhatsApp Business or the regular app?",
        answer:
          "WhatsApp Business, without question. Catalogues, saved replies, labels and away messages exist precisely for this job, and it's free. The API tier only becomes relevant once volume outgrows what one or two people can handle.",
      },
      {
        question: "Can WhatsApp journeys be automated without feeling robotic?",
        answer:
          "Yes, if automation handles logistics and humans handle judgement. Automate the instant acknowledgement, the qualifying question and the follow-up nudge. Keep pricing conversations and objection handling human.",
      },
    ],
    published: false,
  },
];

export function getPublishedInsights(): Insight[] {
  return insights
    .filter((i) => i.published)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getInsight(slug: string): Insight | undefined {
  return insights.find((i) => i.slug === slug && i.published);
}
