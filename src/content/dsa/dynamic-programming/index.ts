import type { TopicContent } from '../../types';

export const dynamicProgrammingContent: TopicContent = {
  slug: 'dsa/dynamic-programming', title: 'Dynamic Programming', category: 'dsa',
  theory: `# Dynamic Programming\n\nSolve complex problems by breaking them into overlapping subproblems and caching results.\n\n## Two Conditions for DP\n\n1. **Optimal substructure** — optimal solution uses optimal solutions of subproblems.\n2. **Overlapping subproblems** — same subproblems computed repeatedly.\n\n## Approaches\n\n**Memoization (top-down):** recursive + cache.\n\`\`\`go\nmemo := make(map[int]int)\nvar fib func(int) int\nfib = func(n int) int {\n    if n <= 1 { return n }\n    if v, ok := memo[n]; ok { return v }\n    memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]\n}\n\`\`\`\n\n**Tabulation (bottom-up):** iterative + array.\n\`\`\`go\ndp := make([]int, n+1)\ndp[0], dp[1] = 0, 1\nfor i := 2; i <= n; i++ { dp[i] = dp[i-1] + dp[i-2] }\n\`\`\`\n\n## Common DP Patterns\n\n| Pattern | Example |\n|---------|---------|\n| 1D DP | Climbing stairs, house robber |\n| Grid DP | Unique paths, min path sum |\n| String DP | LCS, edit distance, palindromes |\n| Knapsack | 0/1 knapsack, partition equal subset |\n| Interval DP | Burst balloons, matrix chain |\n`,
  examples: `# DP — Examples\n\n## Coin Change\n\n\`\`\`go\nfunc coinChange(coins []int, amount int) int {\n    dp := make([]int, amount+1)\n    for i := range dp { dp[i] = amount+1 } // infinity\n    dp[0] = 0\n    for i := 1; i <= amount; i++ {\n        for _, c := range coins {\n            if c <= i && dp[i-c]+1 < dp[i] { dp[i] = dp[i-c]+1 }\n        }\n    }\n    if dp[amount] > amount { return -1 }\n    return dp[amount]\n}\n\`\`\`\n\n## Longest Common Subsequence\n\n\`\`\`go\nfunc longestCommonSubsequence(text1, text2 string) int {\n    m, n := len(text1), len(text2)\n    dp := make([][]int, m+1)\n    for i := range dp { dp[i] = make([]int, n+1) }\n    for i := 1; i <= m; i++ {\n        for j := 1; j <= n; j++ {\n            if text1[i-1] == text2[j-1] { dp[i][j] = dp[i-1][j-1]+1 } else {\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n            }\n        }\n    }\n    return dp[m][n]\n}\n\`\`\``,
  patterns: `# DP Patterns\n\n## 1. Linear DP — dp[i] depends on dp[i-1] or dp[i-k]\n## 2. Grid DP — dp[r][c] from top or left\n## 3. Two-String DP — dp[i][j] for prefixes of two strings\n## 4. 0/1 Knapsack — include or exclude item\n## 5. Unbounded Knapsack — can reuse items (coin change)\n## 6. Bitmask DP — track subsets with bits\n\n**Decision template:**\n\`\`\`\ndp[i] = min/max(\n    dp[i-1] + cost of not including i,\n    dp[i-k] + cost of including i\n)\n\`\`\``,
  interviewTips: `# Interview Tips — DP\n\n1. Identify: what is the subproblem? What parameters define its state?\n2. Write the recurrence relation before coding.\n3. Start with top-down (memoization) — easier to verify correctness.\n4. Optimise to bottom-up for better constants and stack safety.\n5. Space optimisation: often dp[i] only needs dp[i-1] → reduce to O(1) or O(n).`,
  commonMistakes: `# Common Mistakes — DP\n\n1. Wrong state definition — missing a parameter that affects the answer.\n2. Wrong base case — off-by-one or wrong initial value.\n3. Off-by-one in transitions — dp[i-1] vs dp[i].\n4. Not initialising with "infinity" for minimisation problems.\n5. Using greedy when DP is needed (e.g., 0/1 knapsack can't be solved greedily).`,
  revision: `# DP — Quick Revision\n\n| Problem | Pattern | State |\n|---------|---------|-------|\n| Fibonacci | Linear | dp[i] |\n| Climbing stairs | Linear | dp[i] |\n| Coin change | Unbounded knapsack | dp[amount] |\n| LCS | 2-string | dp[i][j] |\n| Edit distance | 2-string | dp[i][j] |\n| 0/1 Knapsack | Include/exclude | dp[i][w] |\n| Unique paths | Grid | dp[r][c] |\n| Longest palindrome | Interval | dp[l][r] |\n`,
  codeExamples: [{ language: 'go', label: 'Coin Change', code: `func coinChange(coins []int, amount int) int {
	dp := make([]int, amount+1)
	for i := range dp { dp[i] = amount + 1 }
	dp[0] = 0
	for i := 1; i <= amount; i++ {
		for _, c := range coins {
			if c <= i && dp[i-c]+1 < dp[i] {
				dp[i] = dp[i-c] + 1
			}
		}
	}
	if dp[amount] > amount { return -1 }
	return dp[amount]
}` }],
  resources: [
    { title: 'DP — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'DP — Atcoder Educational DP', url: 'https://atcoder.jp/contests/dp', type: 'course', free: true },
    { title: 'DP — GfG', url: 'https://www.geeksforgeeks.org/dynamic-programming/', type: 'article', free: true },
    { title: 'LeetCode DP Tag', url: 'https://leetcode.com/tag/dynamic-programming/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'dp-q1', question: 'What are the two conditions required for DP to be applicable?', options: ['Greedy choice + sorted input', 'Optimal substructure + overlapping subproblems', 'Divide & conquer + memoization', 'Linear recurrence + base case'], correctIndex: 1, explanation: 'DP requires optimal substructure (optimal solution builds on optimal subproblems) and overlapping subproblems (same states computed multiple times).' },
    { id: 'dp-q2', question: 'Bottom-up tabulation has what advantage over top-down memoization?', options: ['Easier to write', 'Avoids call stack overflow + better cache performance', 'Fewer states', 'Fewer transitions'], correctIndex: 1, explanation: 'Iterative tabulation avoids recursion stack depth limits and benefits from sequential memory access patterns.' },
    { id: 'dp-q3', question: 'In the coin change problem, dp[i] is initialised to amount+1 (infinity). What does dp[0] equal?', options: ['amount+1', '-1', '1', '0'], correctIndex: 3, explanation: 'dp[0] = 0: zero coins are needed to make amount 0. This is the base case.' },
    { id: 'dp-q4', question: 'The 0/1 knapsack must use DP (not greedy) because:', options: ['Items have fractional sizes', 'Items cannot be reused and each has value/weight', 'The input is unsorted', 'The table is 2D'], correctIndex: 1, explanation: 'Greedy (sort by value/weight ratio) fails for 0/1 knapsack. Taking the highest ratio item may prevent fitting higher total value.' },
    { id: 'dp-q5', question: 'LCS of "ABCDE" and "ACE" has what length?', options: ['2', '3', '4', '5'], correctIndex: 1, explanation: 'LCS is "ACE" — length 3. dp[5][3] = 3 in the standard 2D LCS table.' },
  ],
  questions: [
    {
      id: 'lc-70',
      title: "Climbing Stairs",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'DP',
      companies: ["Amazon", "Google", "Microsoft", "Apple"],
      tags: ["dynamic-programming", "fibonacci"],
      problemStatement: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      examples: [{"input": "n = 2", "output": "2", "explanation": "1+1 or 2"}, {"input": "n = 3", "output": "3", "explanation": "1+1+1, 1+2, 2+1"}],
      constraints: ["1 <= n <= 45"],
      hints: ["dp[i] = dp[i-1] + dp[i-2] (like Fibonacci)", "Base cases: dp[1]=1, dp[2]=2"],
      bruteForce: "Recursion without memo \u2014 O(2^n).",
      optimizedSolution: "DP: bottom-up, dp[i] = dp[i-1] + dp[i-2]. O(n)/O(1) with two vars.",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func climbStairs(n int) int {
    if n <= 2 { return n }
    prev, cur := 1, 2
    for i := 3; i <= n; i++ {
        prev, cur = cur, prev+cur
    }
    return cur
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/climbing-stairs/"},
      related: ["Min Cost Climbing Stairs", "Fibonacci Number"],
      dryRun: {
        title: "Climbing Stairs \u2014 Bottom-up DP",
        input: "n = 5",
        result: "Result = 8 ways",
        steps: [
          { line: 2, description: "n=5 > 2. Initialize prev=dp[1]=1, cur=dp[2]=2", variables: [{"name": "prev", "value": "1"}, {"name": "cur", "value": "2"}], dataState: "dp[1] = 1 (1 step)\ndp[2] = 2 (1+1 or 2)\nprev = 1, cur = 2" },
          { line: 4, description: "i=3: dp[3] = 1+2 = 3. prev=2, cur=3", variables: [{"name": "i", "value": "3"}, {"name": "prev", "value": "2"}, {"name": "cur", "value": "3"}], dataState: "dp[3] = dp[2] + dp[1] = 2+1 = 3\n(1+1+1, 1+2, 2+1)\nprev = 2, cur = 3" },
          { line: 4, description: "i=4: dp[4] = 2+3 = 5. prev=3, cur=5", variables: [{"name": "i", "value": "4"}, {"name": "prev", "value": "3"}, {"name": "cur", "value": "5"}], dataState: "dp[4] = dp[3] + dp[2] = 3+2 = 5\nprev = 3, cur = 5" },
          { line: 4, description: "i=5: dp[5] = 3+5 = 8. prev=5, cur=8", variables: [{"name": "i", "value": "5"}, {"name": "prev", "value": "5"}, {"name": "cur", "value": "8"}], dataState: "dp[5] = dp[4] + dp[3] = 5+3 = 8\nprev = 5, cur = 8" },
          { line: 6, description: "Return cur = 8", variables: [{"name": "result", "value": "8"}], dataState: "Result: 8 ways \u2713" },
        ],
      },
    },
    {
      id: 'lc-322',
      title: "Coin Change",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'DP',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["dynamic-programming"],
      problemStatement: "You are given an integer array coins representing coin denominations and an integer amount. Return the fewest number of coins needed to make up that amount. Return -1 if impossible.",
      examples: [{"input": "coins = [1,2,5], amount = 11", "output": "3", "explanation": "11 = 5+5+1"}, {"input": "coins = [2], amount = 3", "output": "-1"}],
      constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31-1", "0 <= amount <= 10^4"],
      hints: ["dp[i] = min coins to make amount i", "For each amount, try each coin: dp[i] = min(dp[i], dp[i-coin]+1)"],
      bruteForce: "Try all combinations \u2014 exponential.",
      optimizedSolution: "DP: dp[i] = min(dp[i-coin]+1) for each coin. O(n*amount)/O(amount).",
      timeComplexity: 'O(n*amount)',
      spaceComplexity: 'O(amount)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func coinChange(coins []int, amount int) int {
    dp := make([]int, amount+1)
    for i := 1; i <= amount; i++ {
        dp[i] = amount + 1
    }
    for i := 1; i <= amount; i++ {
        for _, c := range coins {
            if c <= i && dp[i-c]+1 < dp[i] {
                dp[i] = dp[i-c] + 1
            }
        }
    }
    if dp[amount] > amount { return -1 }
    return dp[amount]
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/coin-change/"},
      related: ["Coin Change II", "Perfect Squares"],
      dryRun: {
        title: "Coin Change \u2014 Bottom-up DP",
        input: "coins = [1,2,5], amount = 11",
        result: "Min coins = 3 (5+5+1)",
        steps: [
          { line: 4, description: "Initialize dp[0..11]. dp[0]=0, dp[1..11]=12 (impossible).", variables: [{"name": "dp", "value": "[0,12,12,12,12,12,12,12,12,12,12,12]"}], dataState: "dp = [0, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]\n      0   1   2   3   4   5   6   7   8   9  10  11" },
          { line: 7, description: "i=1: coins 1<=1. dp[1]=min(12, dp[0]+1)=1.", variables: [{"name": "dp", "value": "[0,1,12,12,12,12,12,12,12,12,12,12]"}], dataState: "dp = [0, 1, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]\n            ^\n dp[1] = dp[0]+1 = 1 (use coin 1)" },
          { line: 7, description: "i=2: coin 1: dp[2]=min(12,dp[1]+1)=2. coin 2: dp[2]=min(2,dp[0]+1)=1.", variables: [{"name": "dp", "value": "[0,1,1,12,12,12,12,12,12,12,12,12]"}], dataState: "dp = [0, 1, 1, 12, 12, 12, 12, 12, 12, 12, 12, 12]\n               ^\n dp[2] = dp[0]+1 = 1 (use coin 2)" },
          { line: 7, description: "i=5: coin 5: dp[5]=min(12,dp[0]+1)=1. One coin of 5!", variables: [{"name": "dp", "value": "[0,1,1,2,2,1,12,12,12,12,12,12]"}], dataState: "dp = [0, 1, 1, 2, 2, 1, 12, 12, 12, 12, 12, 12]\n                        ^\n dp[5] = dp[0]+1 = 1 (use coin 5)" },
          { line: 7, description: "i=10: coin 5: dp[10]=min(12,dp[5]+1)=2. Two coins of 5!", variables: [{"name": "dp", "value": "[0,1,1,2,2,1,2,2,3,3,2,12]"}], dataState: "dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 12]\n                                          ^\n dp[10] = dp[5]+1 = 2" },
          { line: 7, description: "i=11: coin 1: dp[11]=min(12,dp[10]+1)=3. coin 2: dp[11]=min(3,dp[9]+1)=3. coin 5: dp[11]=min(3,dp[6]+1)=3.", variables: [{"name": "dp", "value": "[0,1,1,2,2,1,2,2,3,3,2,3]"}], dataState: "dp = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]\n                                              ^\n dp[11] = dp[10]+1 = 3\n (5+5+1 = 11)" },
          { line: 11, description: "dp[11]=3 <= 11. Return 3", variables: [{"name": "result", "value": "3"}], dataState: "Result: 3 coins (5+5+1) \u2713" },
        ],
      },
    },
  ],
};
