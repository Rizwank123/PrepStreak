import type { TopicContent } from '../../types';

export const codingInterviewsContent: TopicContent = {
  slug: 'interview/coding-interviews',
  title: 'Coding Interview Strategy',
  category: 'interview',
  theory: `# Coding Interview Strategy

## The 45-Minute Framework

| Time | Activity |
|------|----------|
| 0–5 min | Understand + clarify + examples |
| 5–10 min | Brute force + discuss approach |
| 10–30 min | Code optimal solution |
| 30–40 min | Test + debug |
| 40–45 min | Complexity + follow-ups |

## Step 1: Clarify

Before writing a single line:
- What are the input constraints? (size, type, range)
- Can input be null/empty?
- Are there duplicates?
- What should be returned? (index vs value?)
- Can I modify input?

## Step 2: Brute Force First

State the O(n²) solution first, then optimise:
"A brute force would be... but we can improve to O(n) by..."

## Step 3: Talk Through Approach

Before coding: "I'm going to use a hash map. The key insight is..."
Get interviewer buy-in before implementing.

## Step 4: Code Clearly

- Use meaningful variable names
- Write helper functions if needed
- Handle edge cases as you go

## Step 5: Test

- Trace through your example
- Test edge cases: empty, single element, all same, negative
- Test the complex case

## Handling Stuck Moments

1. Simplify: solve for n=1 or n=2
2. Draw examples / diagrams
3. Think about related problems you know
4. Ask: "Can I get a small hint?"
`,

  examples: `# Coding Interview — Example Walk-Through

## Problem: Two Sum

**Clarify:** "Can nums have duplicates? Exactly one solution always exists?"

**Brute force:** "Nested loops, O(n²). Check every pair."

**Optimise:** "I'll use a hash map. For each number, check if its complement exists. O(n) time, O(n) space."

**Code:**
\`\`\`go
func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, v := range nums {
        if j, ok := seen[target-v]; ok {
            return []int{j, i}
        }
        seen[v] = i
    }
    return nil
}
\`\`\`

**Test:** "[2,7,11,15], t=9: i=0, need 7 not seen. i=1, need 2 found at 0. Return [0,1]. ✓"

**Complexity:** "Time O(n), Space O(n)."
`,

  patterns: `# Coding Interview Patterns

## Communication Checkpoints
1. After understanding: "Does this match your understanding?"
2. After brute force: "Should I optimise?"
3. After approach: "Does this make sense before I code?"
4. After coding: "Let me trace through an example to verify."

## Edge Cases Checklist
- [ ] Empty input
- [ ] Single element
- [ ] All same values
- [ ] Integer overflow
- [ ] Negative numbers
- [ ] Already sorted
- [ ] No solution exists
`,

  interviewTips: `# Interview Tips — Coding

1. **Never go silent** — think out loud even when stuck.
2. **State assumptions** — don't assume, verify.
3. **Discuss trade-offs** — time vs space, readability vs performance.
4. **Clean code** — bad naming hurts even if logic is correct.
5. **Don't rush** — a clean O(n²) beats a buggy O(n).
`,

  commonMistakes: `# Common Mistakes — Coding Interviews

1. Coding before understanding — wastes time on wrong solution.
2. Silent thinking — interviewers can't help you.
3. No edge case testing — "works for the example" isn't enough.
4. Forgetting to handle empty input.
5. Not mentioning complexity — interviewers explicitly look for this.
`,

  revision: `# Coding Interview — Quick Revision

## Before Coding
- [ ] Confirmed constraints
- [ ] Stated brute force
- [ ] Agreed on optimised approach

## While Coding
- [ ] Meaningful names
- [ ] Edge cases handled
- [ ] Talking through logic

## After Coding
- [ ] Trace through example
- [ ] Test edge cases
- [ ] State time + space complexity
`,

  codeExamples: [],

  resources: [
    { title: 'Tech Interview Handbook', url: 'https://www.techinterviewhandbook.org/', type: 'docs', free: true },
    { title: 'NeetCode 150', url: 'https://neetcode.io/practice', type: 'course', free: true },
    { title: 'Cracking the Coding Interview', url: 'https://www.crackingthecodinginterview.com/', type: 'book', free: false },
  ],

  quiz: [
    { id: 'ci-q1', question: 'What should you do in the first 5 minutes of a coding interview?', options: ['Start coding immediately', 'Clarify requirements, constraints, and examples', 'Describe your experience', 'Write all test cases first'], correctIndex: 1, explanation: 'Clarifying saves time — coding the wrong thing is the most common mistake. Verify input constraints, edge cases, and expected output before touching code.' },
    { id: 'ci-q2', question: 'When stuck in a coding interview, you should:', options: ['Stay silent and think', 'Ask for the answer', 'Think out loud, simplify the problem, mention related patterns', 'Skip to the next problem'], correctIndex: 2, explanation: 'Thinking out loud lets the interviewer guide you. Simplifying (what if n=2?) often reveals the pattern. Mentioning related problems shows pattern recognition.' },
    { id: 'ci-q3', question: 'The brute force solution should be stated:', options: ['Never — only optimal', 'At the very end', 'Before coding the optimal solution', 'Only if asked'], correctIndex: 2, explanation: 'State brute force first — it shows you understand the problem, gives a baseline, and demonstrates the improvement when you optimise.' },
    { id: 'ci-q4', question: 'After coding a solution, you should always:', options: ['Submit immediately', 'Trace through examples and test edge cases before claiming it\'s correct', 'Refactor for style', 'Delete and rewrite cleaner'], correctIndex: 1, explanation: 'Tracing through examples reveals bugs. Interviewers respect candidates who find their own bugs before claiming correctness.' },
  ],

  questions: [],
};
