// Full example answers per round archetype, shown after grading as a
// learning aid — not a script to memorize. Each is deliberately a
// *pattern* (fictional scenario, generic enough to adapt) rather than an
// answer to the exact question asked, so it teaches structure and
// specificity without inviting rote copy-paste.

export interface ModelAnswer {
  match: RegExp;
  title: string;
  example: string;
  whyItWorks: string[];
}

const MODEL_ANSWERS: ModelAnswer[] = [
  {
    match: /leadership|behavio|googleyness|culture|drive|value|conflict/i,
    title: "Behavioral / leadership pattern",
    example:
      "In my last role, I was leading the redesign of our seller onboarding flow, and three weeks before launch, my lead engineer flagged that our timeline was unrealistic given a scope change legal had just added. I had two choices: push the date or cut scope. I pulled the engineering and legal leads into a 30-minute call, laid out the trade-off explicitly — ship on time with a manual compliance check as a stopgap, or delay two weeks for the automated version — and let the room decide with the actual data in front of them. We chose the stopgap. I personally owned communicating the delay risk to my director before anyone asked. We shipped on time, and the manual check added maybe 10 extra minutes of ops work a day until the automated version landed three weeks later. Looking back, I should have flagged the scope risk earlier — that's the one thing I'd change.",
    whyItWorks: [
      "Names a specific, real-sounding constraint (three weeks out, a scope change) instead of a vague 'there was a challenge.'",
      "Shows a decision being made — not just describing the problem, but the actual trade-off and why that option won.",
      "Ends with a genuine self-critique, which signals maturity far more than pretending it went perfectly.",
    ],
  },
  {
    match: /metric|analytic|execution|data/i,
    title: "Execution / metrics pattern",
    example:
      "When I noticed activation rate had dropped from 42% to 36% over two weeks, I didn't jump straight to a fix. I first split the funnel by signup source and device, and found the drop was almost entirely mobile web, coinciding with a checkout redesign that had shipped nine days earlier. My hypothesis was that the new form's autofill was breaking on mobile Safari. I pulled session recordings for 20 mobile drop-offs to confirm it before writing a single line of a proposal, then took the finding to engineering with a specific ask: revert autofill on Safari only, ship same day. Activation recovered to 41% within 48 hours. The broader change I made afterward was adding a lightweight funnel-health alert so a 5%+ drop pages someone within an hour instead of being caught by a weekly review.",
    whyItWorks: [
      "Leads with the actual number and the drop, not a general statement about caring about metrics.",
      "Shows the diagnostic process (segment, hypothesize, verify) before proposing a fix — that's what's actually being evaluated.",
      "Closes with a systemic fix, not just the one-time save, which shows product thinking beyond firefighting.",
    ],
  },
  {
    match: /strategy|business|competit/i,
    title: "Strategy / business pattern",
    example:
      "If I were advising a mid-sized player facing a much larger competitor undercutting on price, I'd start by sizing where the actual overlap is — not the whole market, but the specific segment both companies are fighting for, since a 20% price gap matters enormously to a price-sensitive SMB segment and barely at all to an enterprise segment buying on reliability and support. I'd look at our win/loss data for that overlapping segment specifically before proposing anything. If the losses are concentrated in price-sensitive accounts we were never going to retain profitably anyway, I'd recommend not chasing price at all — instead doubling down on the segment where our support and integration depth are the actual differentiators, and being explicit internally that we're consciously ceding the low end rather than losing it by accident.",
    whyItWorks: [
      "Uses a simple, spoken-out-loud framework (segment the market → check the data → recommend) instead of jumping to a conclusion.",
      "The recommendation is a real trade-off with a stated reason, not a hedge that tries to have it both ways.",
      "Explicitly separates 'losing customers we were never going to keep' from 'losing customers we should fight for' — that distinction is what senior thinking sounds like.",
    ],
  },
  {
    match: /product sense|design|roadmap/i,
    title: "Product sense / design pattern",
    example:
      "Before designing anything, I'd want to know who specifically this is for — say, first-time users in tier-2 Indian cities on a budget Android phone with an unreliable connection, versus a power user on fast wifi; the right design is completely different for each. I'd assume the first-time, low-bandwidth user is the harder and more valuable case to get right. Their core problem probably isn't 'not enough features,' it's 'I don't trust this yet and I don't want to waste my data finding out.' So I'd design for trust and speed first: a lightweight preview before any heavy load, clear pricing or outcome shown upfront with no surprises, and graceful degradation rather than a spinner when the connection drops. I'd measure success not by feature adoption but by whether that first session completes without an abandon — that's the real signal this design worked.",
    whyItWorks: [
      "Picks one specific, realistic user segment instead of designing for an imaginary 'everyone.'",
      "Reasons from the user's actual underlying problem (trust, data cost) rather than jumping straight to a feature list.",
      "Defines success as a measurable behavior (session completion), not a vague 'users will like it.'",
    ],
  },
  {
    match: /technical|system|architecture|program management/i,
    title: "Technical / program-management pattern",
    example:
      "When two engineering teams disagreed on whether to build a shared service or let each team own its own implementation, I didn't try to arbitrate the technical merits myself — I asked each team to write down, in one page, what they'd be trading away under the other option. The shared-service team was trading away speed now for consistency later; the separate-implementation team was trading away long-term maintenance cost for shipping faster this quarter. Once it was framed as an explicit trade-off instead of 'my architecture is better,' the actual decision became about our real constraint: we had a hard compliance deadline in six weeks. I made the call to go with separate implementations to hit that date, with an explicit commitment logged to consolidate into a shared service in the following quarter, and I put that follow-up on the roadmap myself so it didn't quietly disappear.",
    whyItWorks: [
      "Names the concrete trade-off (speed vs. long-term consistency) instead of just listing 'considerations.'",
      "Ties the decision back to a real constraint (the compliance deadline), which is what actually resolves technical disagreements in the real world.",
      "Shows ownership of the follow-through, not just the decision — a common gap in weaker answers.",
    ],
  },
  {
    match: /recruiter|motivation|why|screen|background/i,
    title: "Motivation / \"why this company\" pattern",
    example:
      "I've spent the last three years owning products where the core challenge was earning trust from users who'd been burned by unreliable services before — mostly in fintech, mostly in tier-2/3 India. What draws me here specifically is that this team is solving the same trust problem but at a scale and with a resourcing depth I haven't had access to, and I want to see how the same instincts hold up against harder constraints. I'm not looking to leave what I've built — I'm looking to stress-test it against a bigger, harder version of the same problem.",
    whyItWorks: [
      "Connects a specific, real theme from their own background (earning trust, tier-2/3 India) to the company, instead of generic praise.",
      "States a genuine reason to move, not just flattery — interviewers can tell the difference immediately.",
      "Short and direct — this question rewards conviction, not a long resume recap.",
    ],
  },
];

const DEFAULT_MODEL_ANSWER: ModelAnswer = {
  match: /.*/,
  title: "General pattern",
  example:
    "Whatever the question, ground the answer in one specific, real example — a real project, a real number, a real decision you made. Set up the situation in one or two sentences, spend most of your time on what you specifically did (not what 'we' did), and close with a measurable outcome. If there's no clean number available, describe the outcome as concretely as you can — what changed, for whom, by when.",
  whyItWorks: [
    "Specificity is what separates a strong answer from a generic one, regardless of the question.",
    "\"I\", not \"we\", when describing your own contribution — interviewers are evaluating you, not your team.",
    "A concrete outcome (even without a hard number) beats a vague 'it went well.'",
  ],
};

export function getModelAnswer(roundFocus: string, roundEvaluates: string): ModelAnswer {
  const text = `${roundFocus} ${roundEvaluates}`;
  return MODEL_ANSWERS.find((m) => m.match.test(text)) ?? DEFAULT_MODEL_ANSWER;
}
