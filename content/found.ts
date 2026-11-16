export type FoundPrompt = {
  ref: string;
  title: string;
  body: string;
  note: string;
};

export const foundIntro = {
  title: "The FOUND Prompt Library",
  count: 35,
  lede: "Thirty-five AI prompts built for South African owner-run service businesses. Legal, dental, aesthetics, HVAC, security. Written to survive a POPIA audit, a regulator, and a sceptical client.",
  openNote: "This page is deliberately not a PDF and not gated. A PDF cannot be read by ChatGPT, Gemini or Google's AI Overviews.",
};

export const foundRules = [
  "AI does not know your business. Every bracketed field is a real fact you supply. If you cannot verify it, do not publish it. That includes years in business, registration numbers, response times and anything that looks like a result.",
  "No ranking promises, ever. Nobody can guarantee a Google position. Promise your method, your deliverables and your reporting. Those you control.",
  "POPIA applies to your marketing, not just your database. Consent must be specific, informed and voluntary. Opt-out must be as easy as opt-in.",
  "Regulated sector? A human signs off. Health, legal, financial and aesthetics copy carries real regulatory exposure in South Africa. AI drafts. A qualified person approves.",
];

export const foundPrompts: FoundPrompt[] = [
  {
    ref: "F.01",
    title: "Service page that answers the question first",
    body: "Act as an SEO copywriter for a [business type] in [suburb], Johannesburg. Write an 800-word service page for [service] in UK English.\n\nStructure:\n- One H1 naming the service and the suburb.\n- A 50-word answer-first summary directly under the H1 that answers \"What is [service] and who is it for?\" in plain language. It must make sense read on its own, with no surrounding context.\n- Three to five H2 sections covering: what the problem feels like, what we actually do, what it costs to leave it, what happens next.\n- Integrate these terms naturally, no stuffing: [keyword 1], [keyword 2].\n\nHard rules:\n- No guaranteed outcomes, timelines, savings or results.\n- No superlatives I cannot prove (\"best\", \"leading\", \"number one\").\n- Reading level: a stressed adult skimming on a phone.\n- End your response with a list titled \"VERIFY BEFORE PUBLISHING\" containing every factual claim you made that I need to confirm.",
    note: "Why it is written this way: the answer-first block is what an AI engine lifts when it summarises. Bury it and you do not get quoted.",
  },
  {
    ref: "F.02",
    title: "Meta titles and descriptions",
    body: "Write 5 meta titles (under 60 characters) and 5 meta descriptions (under 155 characters) in UK English for a [business type] in [suburb], Johannesburg, focused on [primary service].\n\nRules:\n- Include the suburb in at least three of the five.\n- Lead with the customer's problem, not our company name.\n- No unprovable superlatives. No \"#1\", \"best in\", \"trusted by thousands\".\n- Count and display the exact character count next to each one.",
    note: "",
  },
  {
    ref: "F.03",
    title: "Jargon to plain English",
    body: "Rewrite the text below for a [stressed homeowner / anxious patient / time-poor business owner] reading on a phone.\n\nRules:\n- Lead with the outcome and the relief, not the process.\n- Grade 8 reading level. Short sentences. UK English.\n- Strip all industry jargon, but keep any legally required or regulated wording exactly as written and list what you kept and why.\n- Do not add benefits, claims or figures that are not in the original.\n\nText: [paste text]",
    note: "",
  },
  {
    ref: "F.04",
    title: "\"Why choose us\" without the cringe",
    body: "Write a \"Why work with us\" section for a [business type] in Johannesburg, UK English, roughly 150 words.\n\nUse only these verified facts:\n- Years operating: [number]\n- Registration or accreditation: [body and number]\n- Areas genuinely serviced: [list]\n- One thing we do differently: [specific, checkable]\n\nBanned phrases: cutting-edge, one-stop shop, passionate about, world-class, second to none, game-changing, take your business to the next level.\n\nDo not invent any fact not listed above. If a section feels thin, say so rather than padding it.",
    note: "",
  },
  {
    ref: "F.05",
    title: "Question keywords, sorted by intent",
    body: "List 20 long-tail, question-based searches that [target audience] in Johannesburg are likely to type before booking a [business type].\n\nGroup them into three buckets:\n1. Problem-aware (they know something is wrong, not what to do)\n2. Solution-aware (they know the service, not the provider)\n3. Provider-aware (they are comparing us to someone else)\n\nFor each, state where it should be answered: service page, FAQ block, or standalone article.\n\nBe explicit that these are informed guesses, not search-volume data, and tell me which ones I should validate in Google Search Console or Keyword Planner before I build anything.",
    note: "Watch it: AI cannot see search volume. It guesses. Treat the output as a hypothesis list, not a keyword report.",
  },
  {
    ref: "F.06",
    title: "Service area page, honestly",
    body: "Write a service-area page introduction (200 words, UK English) for a [business type] based in [suburb], Johannesburg.\n\nSuburbs we genuinely service: [list them]\n\nRules:\n- Do not add a single suburb I have not listed.\n- Do not invent a response time, a call-out fee, or coverage I have not given you.\n- If you want to state a response time, leave it as [CONFIRM RESPONSE TIME] and I will fill it in.\n- Explain the practical reason we cover these areas well. Traffic, depot location, technician base. Ask me for it if I have not said.",
    note: "",
  },
  {
    ref: "F.07",
    title: "Alt text that describes reality",
    body: "Write alt text for 10 photographs. For each, I will describe what is actually in the frame.\n\nRules:\n- Describe what is visibly in the photo first. Accessibility comes before SEO.\n- Add the location or service term only where it is genuinely true of that image.\n- Under 125 characters each. UK English. No keyword stuffing, no \"image of\".\n\nPhoto list: [describe each photo in one line]",
    note: "",
  },
  {
    ref: "O.01",
    title: "Google Business Profile updates",
    body: "Write 5 Google Business Profile update posts for a [business type] in [suburb], Johannesburg. UK English.\n\nEach post:\n- Under 750 characters.\n- One useful, specific idea. A seasonal tip, a common mistake, a question we get weekly.\n- One clear next step, ending in a WhatsApp enquiry.\n- A genuine local reference where it is natural. Do not force it.\n\nRules:\n- No discounts, specials or prices unless I have given them to you.\n- No fabricated urgency. No \"limited slots\" unless slots are genuinely limited and I have said so.",
    note: "",
  },
  {
    ref: "O.02",
    title: "Replying to a positive review",
    body: "Write 3 reply variations to a 5-star Google review, UK English, each under 60 words.\n\nReviewer's first name: [name]\nWhat they praised: [quote or paraphrase from the public review]\n\nRules:\n- Refer only to what the reviewer chose to make public. Do not add detail about their treatment, matter, property or circumstances.\n- Do not confirm, imply or deny that they are a client or patient. That is their disclosure to make, not ours.\n- Warm and specific. Not corporate. Not a template with a name slotted in.\n- One soft invitation to return or refer. No hard sell.",
    note: "POPIA and confidentiality: a reply confirming \"thanks for trusting us with your root canal\" is a disclosure. Even to a happy reviewer. Especially in healthcare and legal.",
  },
  {
    ref: "O.03",
    title: "Replying to a critical review",
    body: "Write 2 reply variations to a [2 or 3]-star review complaining about [issue]. UK English, under 70 words each.\n\nRules:\n- Acknowledge the frustration without admitting fault, liability or breach.\n- Do not confirm or deny whether this person is a client or patient.\n- Do not argue the facts in public, even if they are wrong. Especially if they are wrong.\n- Move it offline within two steps: one line of empathy, one direct route to resolve it (WhatsApp or a named person).\n- No defensiveness, no sarcasm, no \"we have no record of you\".",
    note: "",
  },
  {
    ref: "O.04",
    title: "Genuine local relevance",
    body: "List 10 landmarks, precincts, routes or recurring community events near [suburb], Johannesburg, that a local business could naturally reference on an About or Service Area page.\n\nCritical: split your answer into two lists.\n1. HIGH CONFIDENCE: things you are confident exist and are correctly located.\n2. VERIFY: things you are less sure about, or that may have closed, moved or been renamed.\n\nDo not blend the two. Local detail is where you hallucinate most, and a wrong landmark makes us look like we are not from here.",
    note: "Watch it: AI is confidently wrong about suburbs, road names and which mall closed. Check every one against a map before it goes live.",
  },
  {
    ref: "O.05",
    title: "30-day GBP content calendar",
    body: "Build a 30-day Google Business Profile content calendar for a [business type] in Johannesburg. UK English.\n\nRotate through four post types:\n1. A practical tip that saves the reader money or hassle\n2. A question we are genuinely asked, answered properly\n3. Behind the scenes: the team, the kit, the process\n4. A service spotlight with one clear next step\n\nRules:\n- Do not write client success stories. I will supply real ones if we use them.\n- Do not invent statistics, percentages or outcomes.\n- Give me the post type, the hook, and a one-line brief per day. Not full copy.",
    note: "",
  },
  {
    ref: "O.06",
    title: "Directions and parking",
    body: "Write a short \"Finding us\" section (150 words, UK English) for a [business type] in [suburb], Johannesburg.\n\nFacts I am giving you, use only these:\n- Nearest main road: [road]\n- The turn or landmark people miss: [detail]\n- Parking situation: [detail]\n- Access, security or gate procedure: [detail]\n- Accessibility for wheelchairs or prams: [detail]\n\nWrite it as if talking a first-time visitor in calmly. Do not invent a single directional detail.",
    note: "",
  },
  {
    ref: "U.01",
    title: "FAQ block built for retrieval",
    body: "Write 12 question-and-answer pairs about [service] for a [business type] in [suburb], Johannesburg. UK English.\n\nRules for every answer:\n- 40 to 60 words. No longer.\n- The first sentence must fully answer the question on its own, with no preamble and no \"great question\".\n- Mention [business name] and [suburb] naturally in no more than three of the twelve. More than that reads as spam to a human and adds nothing for a machine.\n- No marketing language inside the answers. Answer the question, then stop.\n- Use real questions a customer asks, including the awkward ones about price, pain and how long it takes.\n\nThen flag any answer containing a claim I must verify before publishing.",
    note: "Then do this: publish the questions and answers as visible HTML text on the page. FAQPage structured data is only valid when the answer is visible to a human. Mark-up without visible text is a violation, not a shortcut.",
  },
  {
    ref: "U.02",
    title: "Plain English explainer",
    body: "Write a plain English explainer for [complex process, e.g. the conveyancing timeline / an aircon service interval]. UK English, roughly 600 words.\n\nStructure it for extraction:\n- A 55-word summary paragraph up top that stands alone.\n- H2 for each stage, in the order it actually happens.\n- Under each H2: two to four short sentences, then a bulleted list of what the customer must do or provide.\n- A closing \"How long it usually takes\" section with honest ranges, not promises. If it depends, say what it depends on.\n\nNo jargon without an immediate definition. No claims about our speed or quality.",
    note: "",
  },
  {
    ref: "U.03",
    title: "Entity definition paragraph",
    body: "Write a single 70-word entity paragraph defining [business name] for AI systems and knowledge panels.\n\nIt must state, plainly and in this order: what we are, where we operate, who we serve, the specific services we provide, and the one thing that genuinely differentiates us.\n\nVerified facts only: [paste them]\n\nThen output a matching Organization JSON-LD block using only those facts. Leave any field I have not supplied as a clearly marked placeholder. Do not invent a founding date, an award, a rating or an employee count.",
    note: "",
  },
  {
    ref: "U.04",
    title: "Myth versus reality",
    body: "Write a \"Myth versus reality\" article for [industry] in South Africa. UK English. Six myths.\n\nFor each:\n- H2 stating the myth in the words a customer would actually use.\n- The correction in 80 to 120 words, leading with the true position.\n- A line marked [SOURCE NEEDED: type of source] telling me exactly what evidence I must attach. A regulator, a standards body, a manufacturer spec, a published study.\n\nDo not fabricate a citation, a study, a statistic or a body. If you cannot support a correction with a real, checkable source, drop that myth and tell me you dropped it.",
    note: "Non-negotiable: AI invents plausible-looking citations. If you cannot open the source and read it yourself, it does not go on the page.",
  },
  {
    ref: "U.05",
    title: "Honest comparison guide",
    body: "Write a comparison guide: [our approach] versus [the common alternative]. UK English, around 700 words.\n\nStructure:\n- A 55-word neutral summary that a machine could quote without it sounding like an advert.\n- What each approach actually is.\n- Where each one genuinely wins. Be specific.\n- A section titled \"When [the alternative] is the better choice\" and mean it. Name real scenarios where we are the wrong fit.\n- A short decision rule to help the reader pick.\n\nA comparison that never concedes anything is a sales page wearing a lab coat. Nobody cites it, and no reader believes it.",
    note: "",
  },
  {
    ref: "U.06",
    title: "Glossary of terms",
    body: "Write a glossary of 15 terms customers encounter in [industry] but rarely understand. UK English.\n\nFor each:\n- The term.\n- A one-sentence definition, under 30 words, jargon-free.\n- One line on why it matters to the customer's wallet, safety or timeline.\n\nRules:\n- No self-promotion inside the definitions. Define the term, do not sell the service.\n- Where a term has a specific South African meaning, regulation or standard attached, note it and mark it [VERIFY].",
    note: "",
  },
  {
    ref: "N.01",
    title: "Hero section",
    body: "Write 3 hero section options for a landing page targeting [audience] who need [service] in [suburb]. UK English.\n\nEach option:\n- H1 under 10 words, naming the problem or the outcome, not the company.\n- Subheadline of 20 to 25 words explaining who it is for and what happens next.\n- One primary call to action leading to WhatsApp. Say what happens when they press it.\n- One line of trust microcopy under the button: a factual expectation, not a promise.\n\nBanned: countdown timers, fake scarcity, \"limited spots\", \"act now\", exclamation marks.",
    note: "",
  },
  {
    ref: "N.02",
    title: "WhatsApp welcome message",
    body: "Write 3 WhatsApp welcome messages for a new enquiry from our website. UK English.\n\nEach one:\n- Under 160 characters.\n- Names the business so they know who is replying.\n- Ends with a simple multiple-choice question that qualifies them in one tap. Example shape: \"Is this about A, B or C?\"\n- Sounds like a person, not a bot with a personality setting.\n\nNo emoji storms. One, at most, if it genuinely helps.",
    note: "",
  },
  {
    ref: "N.03",
    title: "Friction-reducer microcopy",
    body: "Write a friction-reducer block to sit directly above the \"Get a quote\" button for a [business type] in Johannesburg. UK English, 25 words maximum.\n\nIt must defuse the three real anxieties:\n1. \"I am going to be sold to.\"\n2. \"I have no idea what this costs and I will look stupid asking.\"\n3. \"This will waste an hour of my day.\"\n\nGive me 5 options. Plain, calm, specific. No exclamation marks. No \"no obligation!\" energy.",
    note: "",
  },
  {
    ref: "N.04",
    title: "A lead magnet worth an email address",
    body: "Propose 3 lead magnets for a [business type] in [suburb], Johannesburg. Not a newsletter. Not a generic ebook.\n\nEach must be:\n- Specific to a local problem this audience genuinely has.\n- Useful in under 10 minutes.\n- Something they would send to a friend.\n\nFor the strongest one, write the opt-in copy. It must state plainly: exactly what they get, when they get it, what else we will send them, and how to opt out. Consent must be specific and voluntary, and the tick box must not be pre-ticked.\n\nNo forced gates. If the content is good, ungate it and put the offer at the end.",
    note: "",
  },
  {
    ref: "N.05",
    title: "What happens next",
    body: "Write a 3-step \"What happens next\" sequence for someone who has just messaged us on WhatsApp. UK English, under 15 words per step.\n\nHonest inputs, use only these:\n- Our real reply time in office hours: [e.g. under 2 hours]\n- Our real reply time after hours: [e.g. next working morning]\n- What we ask for first: [detail]\n- When they get a price: [detail]\n\nDo not shorten our real response times to sound impressive. A broken promise in step one costs more than a slow promise kept.",
    note: "",
  },
  {
    ref: "N.06",
    title: "Buttons that say what they do",
    body: "Write 8 call-to-action button labels for a [service] landing page. UK English.\n\nRules:\n- Say exactly what happens when it is pressed. \"Send a WhatsApp\", not \"Submit\".\n- Active voice, sentence case, under 4 words.\n- The label must match the outcome. If the button says \"Book a call\", a call gets booked, not a form gets emailed.\n- No manufactured urgency, no \"Claim\", no \"Unlock\", no \"Get started\" (started with what?).\n\nFor each, tell me in one line what a person expects to happen next.",
    note: "",
  },
  {
    ref: "D.01",
    title: "WhatsApp decision tree",
    body: "Design a WhatsApp automated flow for a [business type] in Johannesburg. UK English.\n\nStructure:\n- Step 1: greeting that identifies the business and sets a reply expectation.\n- Step 2: three branches for the three enquiries we actually get: [branch A], [branch B], [branch C].\n- Steps 3 to 5: the exact automated reply for each branch, ending in a booking, a quote request, or a human handover.\n\nNon-negotiable: every single step must include a visible way to reach a human. \"Reply HUMAN at any time.\" Nobody should ever be trapped in a menu, least of all someone with an emergency.\n\nAlso write the message that fires when the customer types something the flow does not recognise. That is the message that decides whether they stay or leave.",
    note: "",
  },
  {
    ref: "D.02",
    title: "The 24-hour follow-up",
    body: "Write a WhatsApp follow-up to someone who asked for a quote and has not replied in 24 hours. UK English, under 50 words.\n\nRules:\n- One ask. Not three.\n- Helpful, not needy. Assume they are busy, not uninterested.\n- Include one genuinely useful thing: a link to a real resource of ours, not a case study we do not have.\n- Give them a graceful exit: \"If the timing is wrong, just say so and I will leave you be.\"\n\nThen write a second, final message for day five. After that, we stop. Nobody was ever pestered into buying.",
    note: "",
  },
  {
    ref: "D.03",
    title: "Qualification without the interrogation",
    body: "Write a 4-question WhatsApp qualification sequence for a [business type], mapped to Budget, Authority, Need and Timeline. UK English.\n\nRules:\n- It must read as a conversation, not a form. Each question earns the right to the next.\n- Ask about budget by framing the cost of the problem, not by demanding their number.\n- Ask about authority without asking \"are you the decision-maker\", which insults half the people you ask.\n- One question per message. Never stack them.\n- After each question, tell me what a good answer, a weak answer and a disqualifying answer look like.",
    note: "",
  },
  {
    ref: "D.04",
    title: "After-hours auto-reply",
    body: "Write an after-hours WhatsApp auto-reply for a [business type]. UK English, under 60 words.\n\nMust include:\n- Acknowledgement that a human will read this.\n- Our actual operating hours: [hours]\n- The honest time they will get a real reply.\n- Two self-service options that work right now: [e.g. FAQ link, online booking link]\n- If we handle genuine emergencies, the emergency route. If we do not, say so plainly so nobody sits waiting.",
    note: "",
  },
  {
    ref: "D.05",
    title: "Re-engaging a past client, lawfully",
    body: "Write a one-to-one WhatsApp message to a past client we have not seen in [6 months], offering a [seasonal service / check-up]. UK English, under 70 words.\n\nPOPIA conditions, apply them:\n- This goes only to people with an existing relationship and a lawful basis for contact. It is not a broadcast, and it never goes to a purchased or scraped list.\n- It must identify us immediately.\n- It must include a plain opt-out in the message itself. \"Reply STOP and I will not message again.\"\n- One ask. No pressure, no false deadline, no \"we miss you\".\n\nAlso tell me what I must log to prove lawful contact if this is ever queried.",
    note: "The line: an existing client with a lawful basis is fine. A bulk broadcast to strangers is a POPIA problem and a reputation problem, in that order.",
  },
  {
    ref: "V.01",
    title: "Strip the fake guarantees",
    body: "Review the marketing copy below for a South African business and rewrite it to be defensible. UK English.\n\nCheck specifically for:\n- Guarantees of rankings, results, savings or outcomes that cannot be substantiated.\n- Superlatives (\"best\", \"leading\", \"number one\") with no evidence behind them.\n- Implied results, fabricated statistics, or dashboard-style numbers presented as ours.\n- Anything that could be a false or misleading representation under the Consumer Protection Act, or a breach of the ARB Code of Advertising Practice.\n\nOutput three things: the rewritten copy, a list of every claim you removed and why, and a list of claims I could keep IF I supply evidence, stating exactly what evidence is needed.\n\nYou are not giving legal advice. You are flagging risk for a human to check.\n\nCopy: [paste]",
    note: "",
  },
  {
    ref: "V.02",
    title: "POPIA consent request",
    body: "Draft a POPIA-compliant consent request for a [website form / WhatsApp opt-in]. UK English.\n\nIt must clearly state:\n- What personal information we collect.\n- The specific purpose we will use it for.\n- Whether it is shared with anyone, and who.\n- How long we keep it.\n- How to withdraw consent, and that withdrawal is as easy as giving it.\n- Our Information Officer's contact details: [name and email]\n\nRules:\n- Consent must be specific, informed and voluntary. It cannot be bundled with the terms and conditions.\n- The box must not be pre-ticked.\n- Do not make marketing consent a condition of receiving the thing they actually asked for.\n\nWrite it in language a normal person reads in ten seconds, not a privacy policy nobody opens.",
    note: "",
  },
  {
    ref: "V.03",
    title: "Regulated sector risk check",
    body: "Review this South African [aesthetics clinic / dental practice / law firm / financial advisory] marketing copy and flag regulatory risk. UK English.\n\nApply the correct South African regime, not the UK or US one:\n- Health, aesthetics and medicines: SAHPRA rules on advertising medicines and scheduled substances to the public, and HPCSA ethical rules on practitioner advertising, including restrictions around testimonials, comparative claims and claims of superiority.\n- Legal: Legal Practice Council rules on advertising and touting.\n- Financial services: FSCA and the FAIS Act.\n- All sectors: the Consumer Protection Act and the ARB Code of Advertising Practice.\n\nFor each risk, output: the exact line, the concern, the likely regime it touches, and a compliant rewrite.\n\nDo not give me a legal opinion, and do not tell me the copy is \"fine\". Flag it. A qualified person signs off, not you.\n\nCopy: [paste]",
    note: "Fixed from the original library: the old version of this prompt cited the MHRA, which is the United Kingdom's regulator. In South Africa it is SAHPRA and the HPCSA. That single word would have cost you a clinic's trust.",
  },
  {
    ref: "V.04",
    title: "How we measure success",
    body: "Write a \"How we measure success\" section for a [business type] website. UK English, around 250 words.\n\nIt must state plainly:\n- We do not guarantee rankings, traffic or AI citations, because nobody honestly can.\n- What we do guarantee: the defined deliverables, built on published best practice, measured from a baseline taken before we start.\n- The baseline we take, the metrics we report, and how often we report them.\n- What the client is expected to do, and what happens if they do not.\n\nTone: confident, plain, slightly dry. This section wins trust precisely because it refuses to overpromise. Do not undo that by sneaking optimism back in at the end.",
    note: "",
  },
  {
    ref: "V.05",
    title: "Permission-first outreach",
    body: "Write a first-contact outreach message to a Johannesburg business owner, offering a free visibility check. UK English, under 80 words.\n\nRules:\n- Identify who I am and how I found them, honestly, in the first line.\n- One ask only: permission to send it. Do not attach it, do not send it, do not assume.\n- Give a specific reason I contacted them, not a mail-merge compliment.\n- Make \"no\" easy and costless. One line.\n- No flattery, no fake urgency, no \"I noticed your website has issues\" scare opener.\n- No bulk broadcast. This is one message, to one person, that a human would be comfortable receiving.\n\nThen give me two variations: one for WhatsApp, one for email.",
    note: "",
  },
];

export const foundGroups = [
  { letter: "F", blurb: "Findable. Traditional search. When people search, you appear.", refs: ["F.01", "F.02", "F.03", "F.04", "F.05", "F.06", "F.07"] },
  { letter: "O", blurb: "On the map. Local search. When someone nearby searches for a business, the profile has to be alive.", refs: ["O.01", "O.02", "O.03", "O.04", "O.05", "O.06"] },
  { letter: "U", blurb: "Understood by AI. Answer engines and assistants need a clear description of the business.", refs: ["U.01", "U.02", "U.03", "U.04", "U.05", "U.06"] },
  { letter: "N", blurb: "Nudged to act. Visitors need one obvious next step.", refs: ["N.01", "N.02", "N.03", "N.04", "N.05", "N.06"] },
  { letter: "D", blurb: "Done by systems. Follow-up should not depend on memory.", refs: ["D.01", "D.02", "D.03", "D.04", "D.05"] },
  { letter: "V", blurb: "The compliance vault. Five prompts that keep you out of trouble. South African regulators, not American ones.", refs: ["V.01", "V.02", "V.03", "V.04", "V.05"] },
] as const;
