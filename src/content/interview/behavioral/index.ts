import type { TopicContent } from '../../types';

export const behavioralContent: TopicContent = {
  slug: 'interview/behavioral',
  title: 'Behavioral Interviews',
  category: 'interview',
  theory: `# Behavioral Interviews

## The STAR Method

Structure every answer with:
- **S**ituation — set the context
- **T**ask — what was your responsibility
- **A**ction — what YOU specifically did (not "we")
- **R**esult — quantify the outcome

## Amazon Leadership Principles (16)

1. Customer Obsession
2. Ownership
3. Invent and Simplify
4. Are Right, A Lot
5. Learn and Be Curious
6. Hire and Develop the Best
7. Insist on the Highest Standards
8. Think Big
9. Bias for Action
10. Frugality
11. Earn Trust
12. Dive Deep
13. Have Backbone; Disagree and Commit
14. Deliver Results
15. Strive to be Earth's Best Employer
16. Success and Scale Bring Broad Responsibility

## Most Common Questions

1. Tell me about yourself
2. Why this company/role?
3. Tell me about a challenge you overcame
4. Describe a conflict with a teammate
5. Tell me about a time you failed
6. What's your greatest strength/weakness?
7. Tell me about a time you showed initiative
8. Describe your biggest achievement
9. How do you handle tight deadlines?
10. Where do you see yourself in 5 years?

## Story Bank Strategy

Prepare 5–8 versatile stories. Map each to multiple leadership principles.

| Story | Principles It Covers |
|-------|---------------------|
| Led migration to microservices | Ownership, Think Big, Deliver Results |
| Fixed production bug at 2am | Bias for Action, Customer Obsession |
| Disagreed with tech decision | Backbone, Earn Trust |
`,

  examples: `# Behavioral — Example Answers

## STAR: Tell me about a time you failed

**S:** "In Q3 2022, I was leading a migration of our payment service to a new provider."

**T:** "My responsibility was to ensure zero downtime during the cutover."

**A:** "I underestimated the load on the new provider's API. I didn't run a load test at production scale. The cutover caused 15 minutes of errors for 5% of users."

**R:** "We rolled back within 20 minutes. I then ran proper load tests, discovered the provider's rate limit, added retry logic, and re-attempted two weeks later with zero issues. I also documented the load testing checklist that became our team standard."

## STAR: Conflict with teammate

Use "Disagree and Commit" framing — show you raised concerns, advocated with data, then committed to the team decision.
`,

  patterns: `# Behavioral Patterns

## 1. Own the outcome — use "I", not "we". Show your specific contribution.
## 2. Quantify results — "reduced latency by 40%", "increased throughput by 3x"
## 3. Show learning — every failure story needs a lesson and what you changed
## 4. Be specific — vague answers signal lack of experience
## 5. Match to the role — choose stories relevant to what the company values
`,

  interviewTips: `# Interview Tips — Behavioral

1. Prepare 5–8 stories covering different domains (leadership, failure, conflict, success, innovation).
2. Use the STAR structure — interviewers are trained to look for it.
3. Be concise — 2–3 minutes per answer is ideal.
4. Ask for clarification if needed — better than answering the wrong question.
5. Research company values before the interview — Google: OKRs, Amazon: LPs, Meta: "Move Fast".
`,

  commonMistakes: `# Common Mistakes — Behavioral

1. Using "we" instead of "I" — interviewers can't assess your contribution.
2. No measurable result — "things got better" is weak.
3. Negative framing of colleagues — always show empathy and professionalism.
4. Rambling — prep answers so they're 2–3 minutes max.
5. Not preparing failure stories — every interviewer asks about failure.
`,

  revision: `# Behavioral — Quick Revision

## STAR Checklist
- [ ] Specific situation (time, place, context)
- [ ] Clear task (my responsibility was...)
- [ ] Actions using "I" (I did X, Y, Z)
- [ ] Quantified result (reduced by X%, saved Y hours)
- [ ] Lesson learned (what I'd do differently)

## Top Stories to Prepare
- [ ] Biggest achievement
- [ ] Biggest failure + lesson
- [ ] Conflict with teammate/manager
- [ ] Tight deadline pressure
- [ ] Took initiative / went above role
- [ ] Changed a process for the better
`,

  codeExamples: [],

  resources: [
    { title: 'Amazon Leadership Principles', url: 'https://www.amazon.jobs/content/en/our-workplace/leadership-principles', type: 'docs', free: true },
    { title: 'Behavioral Interview — TechInterviewHandbook', url: 'https://www.techinterviewhandbook.org/behavioral-interview/', type: 'article', free: true },
    { title: 'STAR Method Guide', url: 'https://www.themuse.com/advice/star-interview-method', type: 'article', free: true },
  ],

  quiz: [
    { id: 'beh-q1', question: 'In the STAR method, what does "A" stand for?', options: ['Ability', 'Action (what YOU specifically did)', 'Achievement', 'Analysis'], correctIndex: 1, explanation: 'Action — describe the specific steps YOU took. Focus on your individual contribution, not the team\'s.' },
    { id: 'beh-q2', question: 'Why should you use "I" instead of "we" in behavioral answers?', options: ['Grammar preference', 'Interviewers assess your individual contribution, not the team', 'It\'s more polite', 'Standard company policy'], correctIndex: 1, explanation: 'Interviewers can only evaluate you. "We" makes it unclear what your specific role was. Own your contributions.' },
    { id: 'beh-q3', question: 'How long should a STAR behavioral answer be?', options: ['30 seconds', '2–3 minutes', '5–10 minutes', 'As long as needed'], correctIndex: 1, explanation: '2–3 minutes is the sweet spot. Long enough to be specific, short enough to stay engaging and leave time for follow-up questions.' },
    { id: 'beh-q4', question: 'When asked about a failure, the most important part is:', options: ['Blaming circumstances', 'The lesson learned and what you changed', 'Minimising the failure', 'Avoiding the question'], correctIndex: 1, explanation: 'Interviewers know everyone fails. They want to see self-awareness, learning agility, and evidence you grew from the experience.' },
  ],

  questions: [],
};
