import type { TopicContent } from '../../types';

export const salaryNegotiationContent: TopicContent = {
  slug: 'interview/salary-negotiation',
  title: 'Salary Negotiation',
  category: 'interview',
  theory: `# Salary Negotiation

## Key Principles

1. **Never give the first number** — whoever names first anchors the conversation.
2. **Anchor high** — your first number should be 15–25% above your target.
3. **BATNA** — Best Alternative to Negotiated Agreement. Know your walk-away point.
4. **Silence is power** — after making your ask, wait. Don't fill the silence.
5. **Negotiate total comp** — base, equity, signing bonus, performance bonus, benefits.

## Total Compensation Components

| Component | Negotiable? |
|-----------|-------------|
| Base salary | Yes |
| Equity (RSUs/options) | Yes |
| Signing bonus | Yes |
| Performance bonus | Sometimes |
| Start date | Yes |
| Remote work | Yes |
| PTO | Sometimes |

## Script Templates

**When asked for salary expectation:**
"I'd like to understand the full scope of the role before discussing compensation. What's the budgeted range for this position?"

**When you have an offer:**
"I'm very excited about this opportunity. Based on my research and my experience with X, I was expecting something in the range of [HIGHER NUMBER]. Is there flexibility there?"

**With a competing offer:**
"I have another offer at [X]. [COMPANY] is my preferred choice — is there any room to move closer to [X]?"

## Levelling

At large tech companies, the compensation difference between levels can be 2-3x. Push for the right level, not just higher comp at the same level.
`,

  examples: `# Salary Negotiation — Examples

## Counter-Offer Script

**Company:** "We're offering $150,000 base."

**You:** "Thank you — I'm really excited about this role. I was expecting something in the range of $170,000 based on my experience leading distributed systems teams and the market data I've seen. Is there flexibility to move closer to that?"

**Company:** "We can do $160,000."

**You:** "That's much closer. Could we also discuss the signing bonus to bridge the gap?"

## Equity Negotiation

"I'm comparing the equity across both offers. Can you tell me: what was the last 409A valuation? What are the vesting terms? Is there an acceleration clause?"
`,

  patterns: `# Negotiation Patterns

## 1. The Delay — "I need to discuss with my family / think it over"
## 2. The Anchor — name a high number first to set expectations
## 3. The Exploding Offer Counter — "I have until Friday, can we discuss today?"
## 4. The Multiple Components — negotiate one item at a time
## 5. The Competing Offer — use real or pending offers as leverage
`,

  interviewTips: `# Tips — Salary Negotiation

1. Research: Levels.fyi, Glassdoor, LinkedIn Salary, Blind for market data.
2. Never lie about competing offers — the tech world is small.
3. Negotiate in writing where possible — verbal agreements are easily forgotten.
4. Get the full offer in writing before accepting.
5. Remember: the worst they can say is no. Negotiating never kills offers.
`,

  commonMistakes: `# Common Mistakes — Salary Negotiation

1. Giving salary history when asked — redirect to "what's the role budgeted for?"
2. Accepting first offer — companies expect negotiation.
3. Negotiating only base — equity and bonus often have more flexibility.
4. Not considering total comp — $20K more base might mean less equity.
5. Burning the bridge — always negotiate gracefully, you'll work with these people.
`,

  revision: `# Salary Negotiation — Quick Revision

## Preparation Checklist
- [ ] Research market rate (Levels.fyi, Glassdoor, LinkedIn)
- [ ] Know your BATNA (minimum acceptable + walk-away)
- [ ] Understand total comp at target company
- [ ] Prepare your value proposition (why you deserve the number)
- [ ] Script responses to common negotiation scenarios
`,

  codeExamples: [],

  resources: [
    { title: 'Levels.fyi — Compensation Data', url: 'https://www.levels.fyi/', type: 'docs', free: true },
    { title: 'Salary Negotiation — Patrick McKenzie', url: 'https://www.kalzumeus.com/2012/01/23/salary-negotiation/', type: 'article', free: true },
    { title: 'Ten Rules for Negotiating a Job Offer', url: 'https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/', type: 'article', free: true },
  ],

  quiz: [
    { id: 'sal-q1', question: 'What does BATNA stand for?', options: ['Best Alternative To Negotiated Agreement', 'Basic Agreed Total Net Amount', 'Benefits And Total Net Allowance', 'Best Average Total Negotiated Amount'], correctIndex: 0, explanation: 'BATNA — Best Alternative to Negotiated Agreement — is your fallback if this negotiation fails. Knowing your BATNA gives you confidence and a clear walk-away point.' },
    { id: 'sal-q2', question: 'When should you give the first number in a salary negotiation?', options: ['Always, to set the anchor', 'Never if possible — let the employer name first', 'Only after the technical interview', 'Before the offer call'], correctIndex: 1, explanation: 'Whoever names first anchors the negotiation. Try to get the company\'s budget range first. If you must give a number, anchor 15-25% above your target.' },
    { id: 'sal-q3', question: 'Which resource gives the most accurate big-tech compensation data?', options: ['LinkedIn', 'Glassdoor', 'Levels.fyi', 'Indeed'], correctIndex: 2, explanation: 'Levels.fyi has self-reported compensation by level at major tech companies (Google, Meta, Apple, Amazon, Microsoft, etc.) — most detailed and accurate for tech roles.' },
    { id: 'sal-q4', question: 'Signing bonuses are particularly useful when:', options: ['Company can\'t raise base salary', 'You have no other offers', 'You want higher equity', 'The company is pre-IPO'], correctIndex: 0, explanation: 'Many companies have base salary bands. Signing bonuses come from a different budget and can bridge the gap when the company can\'t flex on base.' },
  ],

  questions: [],
};
