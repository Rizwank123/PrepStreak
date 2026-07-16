import type { TopicContent } from '../../types';

export const recursionContent: TopicContent = {
  slug: 'dsa/recursion', title: 'Recursion', category: 'dsa',
  theory: `# Recursion\n\nA function that calls itself with a smaller subproblem. Two components:\n1. **Base case** — stop condition\n2. **Recursive case** — reduce to smaller subproblem\n\n## Recurrence Relations\n\n| Recurrence | Complexity |\n|------------|----------|\n| T(n) = T(n-1) + O(1) | O(n) |\n| T(n) = T(n-1) + O(n) | O(n²) |\n| T(n) = 2T(n/2) + O(n) | O(n log n) (merge sort) |\n| T(n) = T(n/2) + O(1) | O(log n) (binary search) |\n\n## Memoisation vs Recursion\n\nPure recursion recomputes subproblems. Memoisation caches results.\n\n\`\`\`go\nmemo := make(map[int]int)\nvar fib func(int) int\nfib = func(n int) int {\n    if n <= 1 { return n }\n    if v, ok := memo[n]; ok { return v }\n    memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]\n}\n\`\`\`\n\n## Tail Recursion\n\nRecursive call is the last operation. Can be optimised to iteration by compiler.`,
  examples: `# Recursion — Examples\n\n## Fibonacci (Naive vs Memoised)\n\n\`\`\`go\n// Naive: O(2^n)\nfunc fib(n int) int {\n    if n <= 1 { return n }\n    return fib(n-1) + fib(n-2)\n}\n// Memoised: O(n)\nmemo := map[int]int{}\nfunc fibMemo(n int) int {\n    if n <= 1 { return n }\n    if v, ok := memo[n]; ok { return v }\n    memo[n] = fibMemo(n-1) + fibMemo(n-2)\n    return memo[n]\n}\n\`\`\`\n\n## Tower of Hanoi\n\n\`\`\`go\nfunc hanoi(n int, from, to, via string) {\n    if n == 0 { return }\n    hanoi(n-1, from, via, to)\n    fmt.Printf("Move disk %d from %s to %s\\n", n, from, to)\n    hanoi(n-1, via, to, from)\n}\n// T(n) = 2T(n-1) + 1 → O(2^n)\n\`\`\``,
  patterns: `# Recursion Patterns\n\n## 1. Divide and Conquer — split, recurse, combine\n## 2. Tree Recursion — recurse on left and right children\n## 3. Linear Recursion — recurse with n-1, accumulate\n## 4. Tail Recursion — use accumulator, enable iteration conversion\n## 5. Memoised Recursion — cache with hash map`,
  interviewTips: `# Interview Tips — Recursion\n\n1. Identify base case first — the simplest instance with a known answer.\n2. Trust the recursion — assume recursive calls work correctly for smaller inputs.\n3. Trace with a small example (n=2 or n=3) to verify.\n4. Always consider: is this being called with overlapping subproblems? → Add memoization.`,
  commonMistakes: `# Common Mistakes — Recursion\n\n1. Missing base case — infinite recursion, stack overflow.\n2. Wrong base case — returns wrong value for n=0 or n=1.\n3. Not reducing the problem size — infinite recursion.\n4. Recomputing same subproblems — exponential time. Add memoization.\n5. Too deep recursion — consider iterative approach for depth > 10⁴.`,
  revision: `# Recursion — Quick Revision\n\n| Pattern | Complexity |\n|---------|----------|\n| Linear recursion | O(n) |\n| Binary recursion | O(2^n) naive / O(n) memo |\n| Binary split | O(n log n) |\n| Memoised | O(states × time per state) |\n`,
  codeExamples: [{ language: 'go', label: 'Fibonacci with Memoization', code: `var memo = map[int]int{}

func fib(n int) int {
	if n <= 1 { return n }
	if v, ok := memo[n]; ok { return v }
	memo[n] = fib(n-1) + fib(n-2)
	return memo[n]
}` }],
  resources: [
    { title: 'Recursion — GfG', url: 'https://www.geeksforgeeks.org/recursion/', type: 'article', free: true },
    { title: 'Recursion — CS50', url: 'https://cs50.harvard.edu/', type: 'course', free: true },
    { title: 'LeetCode Recursion Tag', url: 'https://leetcode.com/tag/recursion/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'rec-q1', question: 'What are the two required components of a correct recursive function?', options: ['Loop + counter', 'Base case + recursive case', 'Input + output', 'Stack + queue'], correctIndex: 1, explanation: 'Base case stops the recursion (simplest known answer). Recursive case reduces the problem toward the base case.' },
    { id: 'rec-q2', question: 'Naive Fibonacci (no memoization) has what time complexity?', options: ['O(n)', 'O(n log n)', 'O(2^n)', 'O(n²)'], correctIndex: 2, explanation: 'fib(n) calls fib(n-1) and fib(n-2), forming a binary tree of calls with depth n — approximately 2^n total calls.' },
    { id: 'rec-q3', question: 'Memoized recursion trades what for time?', options: ['Correctness', 'Stack space for heap space', 'Space (cache storage)', 'Simplicity'], correctIndex: 2, explanation: 'Memoization stores computed results in a hash map — O(n) space — to avoid recomputation and reduce time from exponential to polynomial.' },
    { id: 'rec-q4', question: 'Tower of Hanoi with n disks requires how many moves?', options: ['n²', 'n log n', '2^n - 1', 'n!'], correctIndex: 2, explanation: 'T(n) = 2T(n-1) + 1 solves to T(n) = 2^n - 1. This is also the minimum possible number of moves.' },
  ],
  questions: [
    {
      id: 'lc-509',
      title: "Fibonacci Number",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Recursion',
      companies: ["Amazon", "Google", "Microsoft"],
      tags: ["recursion", "dp"],
      problemStatement: "The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1. Given n, return the nth Fibonacci number.",
      examples: [{"input": "n = 2", "output": "1"}, {"input": "n = 4", "output": "3"}],
      constraints: ["0 <= n <= 30"],
      hints: ["Base case: fib(0)=0, fib(1)=1", "Recursive: fib(n) = fib(n-1) + fib(n-2)"],
      bruteForce: "Naive recursion \u2014 O(2^n).",
      optimizedSolution: "Memoization or iterative. O(n)/O(1) iterative.",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func fib(n int) int {
    if n <= 1 { return n }
    a, b := 0, 1
    for i := 2; i <= n; i++ {
        a, b = b, a+b
    }
    return b
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/fibonacci-number/"},
      related: ["Climbing Stairs", "Tribonacci"],
      dryRun: {
        title: "Fibonacci \u2014 Iterative",
        input: "n = 6",
        result: "fib(6) = 8",
        steps: [
          { line: 2, description: "n=6 > 1. Initialize a=fib(0)=0, b=fib(1)=1", variables: [{"name": "a", "value": "0"}, {"name": "b", "value": "1"}], dataState: "a = 0 (fib 0)\nb = 1 (fib 1)" },
          { line: 4, description: "i=2: a,b = 1, 0+1=1. Now a=fib(1)=1, b=fib(2)=1", variables: [{"name": "i", "value": "2"}, {"name": "a", "value": "1"}, {"name": "b", "value": "1"}], dataState: "i=2: a=1, b=1\nfib(2) = 1" },
          { line: 4, description: "i=3: a,b = 1, 1+1=2. Now a=fib(2)=1, b=fib(3)=2", variables: [{"name": "i", "value": "3"}, {"name": "a", "value": "1"}, {"name": "b", "value": "2"}], dataState: "i=3: a=1, b=2\nfib(3) = 2" },
          { line: 4, description: "i=4: a,b = 2, 1+2=3. b=fib(4)=3", variables: [{"name": "i", "value": "4"}, {"name": "a", "value": "2"}, {"name": "b", "value": "3"}], dataState: "i=4: a=2, b=3\nfib(4) = 3" },
          { line: 4, description: "i=5: a,b = 3, 2+3=5. b=fib(5)=5", variables: [{"name": "i", "value": "5"}, {"name": "a", "value": "3"}, {"name": "b", "value": "5"}], dataState: "i=5: a=3, b=5\nfib(5) = 5" },
          { line: 4, description: "i=6: a,b = 5, 3+5=8. b=fib(6)=8", variables: [{"name": "i", "value": "6"}, {"name": "a", "value": "5"}, {"name": "b", "value": "8"}], dataState: "i=6: a=5, b=8\nfib(6) = 8" },
          { line: 6, description: "Return b = 8", variables: [{"name": "result", "value": "8"}], dataState: "Result: fib(6) = 8 \u2713" },
        ],
      },
    },
    {
      id: 'lc-21',
      title: "Merge Two Sorted Lists (Recursive)",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Recursion',
      companies: ["Amazon", "Google", "Meta"],
      tags: ["recursion", "linked-list"],
      problemStatement: "Merge two sorted linked lists recursively and return the merged list.",
      examples: [{"input": "l1 = [1,2,4], l2 = [1,3,4]", "output": "[1,1,2,3,4,4]"}],
      constraints: ["0 <= list length <= 50", "Both sorted non-decreasing"],
      hints: ["Compare heads, attach smaller, recurse on rest", "Base case: if one list is null, return the other"],
      bruteForce: "Iterative \u2014 O(n+m).",
      optimizedSolution: "Recursive: compare and recurse. O(n+m)/O(n+m) stack.",
      timeComplexity: 'O(n+m)',
      spaceComplexity: 'O(n+m)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func mergeTwoLists(l1, l2 *ListNode) *ListNode {
    if l1 == nil { return l2 }
    if l2 == nil { return l1 }
    if l1.Val <= l2.Val {
        l1.Next = mergeTwoLists(l1.Next, l2)
        return l1
    } else {
        l2.Next = mergeTwoLists(l1, l2.Next)
        return l2
    }
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/merge-two-sorted-lists/"},
      related: ["Merge K Lists", "Sort List"],
      dryRun: {
        title: "Merge Two Sorted Lists \u2014 Recursive",
        input: "l1 = 1\u21922\u21924, l2 = 1\u21923\u21924",
        result: "Merged: 1\u21921\u21922\u21923\u21924\u21924",
        steps: [
          { line: 3, description: "l1.val=1 <= l2.val=1. Keep l1. Recurse on l1.Next and l2.", variables: [{"name": "l1", "value": "2\u21924"}, {"name": "l2", "value": "1\u21923\u21924"}], dataState: "l1: 1 \u2192 2 \u2192 4\nl2: 1 \u2192 3 \u2192 4\n1 <= 1, keep l1(1)\nRecurse: merge(2\u21924, 1\u21923\u21924)" },
          { line: 7, description: "l1.val=2 > l2.val=1. Keep l2. Recurse on l1 and l2.Next.", variables: [{"name": "l1", "value": "2\u21924"}, {"name": "l2", "value": "3\u21924"}], dataState: "l1: 2 \u2192 4\nl2: 1 \u2192 3 \u2192 4\n2 > 1, keep l2(1)\nRecurse: merge(2\u21924, 3\u21924)" },
          { line: 4, description: "l1.val=2 <= l2.val=3. Keep l1. Recurse on l1.Next and l2.", variables: [{"name": "l1", "value": "4"}, {"name": "l2", "value": "3\u21924"}], dataState: "l1: 2 \u2192 4\nl2: 3 \u2192 4\n2 <= 3, keep l1(2)\nRecurse: merge(4, 3\u21924)" },
          { line: 7, description: "l1.val=4 > l2.val=3. Keep l2. Recurse on l1 and l2.Next.", variables: [{"name": "l1", "value": "4"}, {"name": "l2", "value": "4"}], dataState: "l1: 4\nl2: 3 \u2192 4\n4 > 3, keep l2(3)\nRecurse: merge(4, 4)" },
          { line: 4, description: "l1.val=4 <= l2.val=4. Keep l1. Recurse on l1.Next(nil) and l2.", variables: [{"name": "l1", "value": "nil"}, {"name": "l2", "value": "4"}], dataState: "l1: 4\nl2: 4\n4 <= 4, keep l1(4)\nRecurse: merge(nil, 4)" },
          { line: 2, description: "l1 is nil. Return l2 (4). Unwind all calls.", variables: [{"name": "result", "value": "1\u21921\u21922\u21923\u21924\u21924"}], dataState: "Base case: l1=nil, return l2(4)\nUnwinding:\n1\u21921\u21922\u21923\u21924\u21924 \u2713" },
        ],
      },
    },
  ],
};
