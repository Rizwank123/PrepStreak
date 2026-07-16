import type { TopicContent, QuizQuestion, Resource, CodeExample, ContentQuestion } from '../types';

export function makeTopic(
  slug: string,
  title: string,
  category: TopicContent['category'],
  theory: string,
  examples: string,
  patterns: string,
  interviewTips: string,
  commonMistakes: string,
  revision: string,
  codeExamples: CodeExample[],
  resources: Resource[],
  quiz: QuizQuestion[],
  questions: ContentQuestion[] = [],
): TopicContent {
  return { slug, title, category, theory, examples, patterns, interviewTips, commonMistakes, revision, codeExamples, resources, quiz, questions };
}

export function defaultTips(title: string): string {
  return `# Interview Tips — ${title}

1. **Clarify before coding:** constraints, edge cases, return type.
2. **State brute force first**, then optimise step by step.
3. **Announce complexity** for every approach you discuss.
4. **Walk through an example** before and after coding.
5. **Test edge cases:** empty input, single element, duplicates, overflow.
6. **Communicate trade-offs:** extra space vs. time, recursion vs. iteration.
`;
}

export function defaultMistakes(title: string): string {
  return `# Common Mistakes — ${title}

1. **Not handling empty input** — always guard against zero-length inputs.
2. **Off-by-one errors** — trace loop boundaries carefully.
3. **Integer overflow** — use int64 when values or sums can be large.
4. **Forgetting to update state** — infinite loops from missed pointer increments.
5. **Wrong base case** in recursion — causes stack overflow or incorrect results.
6. **Assuming sorted input** when the problem doesn't guarantee it.
`;
}

export function defaultRevision(title: string, rows: string[][]): string {
  const tableRows = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return `# ${title} — Quick Revision

## Checklist
- [ ] Understand the core concept
- [ ] Know time & space complexities
- [ ] Can implement from scratch in 10 minutes
- [ ] Solved 3+ classic problems
- [ ] Handled all edge cases

## Complexity Summary

| Operation | Time | Space |
|-----------|------|-------|
${tableRows}
`;
}

export const stdResources: Record<string, Resource> = {
  neetcode: { title: 'NeetCode Roadmap', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
  gfg: { title: 'GeeksForGeeks', url: 'https://www.geeksforgeeks.org/', type: 'article', free: true },
  leetcode: { title: 'LeetCode', url: 'https://leetcode.com/', type: 'docs', free: true },
  cpAlgo: { title: 'CP-Algorithms', url: 'https://cp-algorithms.com/', type: 'article', free: true },
  mit: { title: 'MIT OCW 6.006', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/', type: 'course', free: true },
};
