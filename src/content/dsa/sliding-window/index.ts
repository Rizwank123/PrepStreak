import type { TopicContent } from '../../types';

export const slidingWindowContent: TopicContent = {
  slug: 'dsa/sliding-window',
  title: 'Sliding Window',
  category: 'dsa',
  theory: `# Sliding Window

## Core Idea

Maintain a window (subarray/substring) over sequential data and slide it by adding one element and removing one, instead of recomputing from scratch.

## Fixed Window

Window size k stays constant.

\`\`\`go
// Max sum of subarray size k
window := 0
for i := 0; i < k; i++ { window += nums[i] }
best := window
for i := k; i < len(nums); i++ {
    window += nums[i] - nums[i-k]
    if window > best { best = window }
}
\`\`\`

## Variable Window

Expand right, shrink left when constraint violated.

\`\`\`go
left := 0
for right := 0; right < len(s); right++ {
    // add s[right] to window
    for windowInvalid() {
        // remove s[left] from window
        left++
    }
    best = max(best, right-left+1)
}
\`\`\`

## Complexity

| | Time | Space |
|-|------|-------|
| Fixed window | O(n) | O(1) |
| Variable window | O(n) | O(k) with map |
`,

  examples: `# Sliding Window — Examples

## Longest Substring Without Repeating Characters

\`\`\`go
func lengthOfLongestSubstring(s string) int {
    freq := make(map[byte]int)
    left, best := 0, 0
    for right := 0; right < len(s); right++ {
        freq[s[right]]++
        for freq[s[right]] > 1 {
            freq[s[left]]--
            left++
        }
        if w := right - left + 1; w > best { best = w }
    }
    return best
}
\`\`\`

## Minimum Window Substring

\`\`\`go
func minWindow(s string, t string) string {
    need := make(map[byte]int)
    for i := 0; i < len(t); i++ { need[t[i]]++ }
    have, total := 0, len(need)
    left, best := 0, ""
    window := make(map[byte]int)
    for right := 0; right < len(s); right++ {
        c := s[right]
        window[c]++
        if need[c] > 0 && window[c] == need[c] { have++ }
        for have == total {
            sub := s[left : right+1]
            if best == "" || len(sub) < len(best) { best = sub }
            window[s[left]]--
            if need[s[left]] > 0 && window[s[left]] < need[s[left]] { have-- }
            left++
        }
    }
    return best
}
\`\`\`
`,

  patterns: `# Sliding Window Patterns

## Pattern 1: Fixed-Size Window
- Max/min sum of k consecutive elements
- Average of k elements

## Pattern 2: Variable Window with Character Frequency
- Longest substring with at most k distinct characters
- Minimum window containing all characters

## Pattern 3: Variable Window with Numeric Constraint
- Longest subarray with sum ≤ k
- Smallest subarray with sum ≥ k

## Pattern 4: Sliding Window Maximum (Deque)

\`\`\`go
func maxSlidingWindow(nums []int, k int) []int {
    dq := []int{} // indices, decreasing by value
    res := []int{}
    for i, v := range nums {
        for len(dq) > 0 && nums[dq[len(dq)-1]] <= v { dq = dq[:len(dq)-1] }
        dq = append(dq, i)
        if dq[0] == i-k { dq = dq[1:] }
        if i >= k-1 { res = append(res, nums[dq[0]]) }
    }
    return res
}
\`\`\`
`,

  interviewTips: `# Interview Tips — Sliding Window

1. **Identify the pattern:** fixed vs variable window? What makes the window valid/invalid?
2. **State the invariant:** "the window [left, right] always satisfies condition X."
3. **Shrink correctly:** when you break the invariant, shrink from left until valid again.
4. **Track the answer** only when the window is valid.
5. For string problems, use a **frequency map** to track window character counts.
6. Common complexity: O(n) time — each element enters and leaves the window at most once.
`,

  commonMistakes: `# Common Mistakes — Sliding Window

1. **Shrinking too aggressively** — shrink until valid, not just once.
2. **Checking answer at wrong time** — only update best when window is valid.
3. **Off-by-one in window size** — window size = right - left + 1, not right - left.
4. **Not initialising left = 0** before the loop.
5. **Map not cleaned up** when characters leave window — decrement, don't delete.
6. **Forgetting to handle empty input** — return 0 or "" early.
`,

  revision: `# Sliding Window — Quick Revision

| Problem | Window Type | Key |
|---------|------------|-----|
| Max sum k elements | Fixed | Slide add/remove |
| Longest no-repeat | Variable | Freq map + shrink |
| Min window substring | Variable | have/need counters |
| Sliding window max | Fixed+deque | Monotonic deque |
| Longest k-distinct | Variable | Map size check |
| Smallest sum ≥ k | Variable | Shrink from left |
`,

  codeExamples: [
    {
      language: 'go',
      label: 'Longest Substring Without Repeating',
      code: `func lengthOfLongestSubstring(s string) int {
	freq := make(map[byte]int)
	left, best := 0, 0
	for right := 0; right < len(s); right++ {
		freq[s[right]]++
		for freq[s[right]] > 1 {
			freq[s[left]]--
			left++
		}
		if w := right - left + 1; w > best {
			best = w
		}
	}
	return best
}`,
    },
  ],

  resources: [
    { title: 'Sliding Window — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Sliding Window Technique — GfG', url: 'https://www.geeksforgeeks.org/window-sliding-technique/', type: 'article', free: true },
    { title: 'LeetCode Sliding Window Tag', url: 'https://leetcode.com/tag/sliding-window/', type: 'docs', free: true },
  ],

  quiz: [
    {
      id: 'sw-q1',
      question: 'In a variable sliding window, when should you update the answer?',
      options: ['Before expanding', 'After shrinking, when window is valid', 'Only at the end', 'Before shrinking'],
      correctIndex: 1,
      explanation: 'The answer represents the optimal valid window. Update after shrinking ensures the window satisfies the constraint.',
    },
    {
      id: 'sw-q2',
      question: 'What data structure enables O(n) sliding window maximum queries?',
      options: ['Min-heap', 'Stack', 'Monotonic deque', 'Hash map'],
      correctIndex: 2,
      explanation: 'A monotonic deque maintains indices in decreasing order of value. The front always holds the current window max.',
    },
    {
      id: 'sw-q3',
      question: 'What is the time complexity of sliding window problems?',
      options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(n·k)'],
      correctIndex: 2,
      explanation: 'Each element is added and removed at most once — O(n) total operations regardless of window size.',
    },
    {
      id: 'sw-q4',
      question: 'What formula gives the window size when left and right are inclusive indices?',
      options: ['right - left', 'right - left - 1', 'right - left + 1', 'right + left'],
      correctIndex: 2,
      explanation: 'Window [left, right] inclusive has right - left + 1 elements.',
    },
  ],

  questions: [
    {
      id: 'lc-121',
      title: "Best Time to Buy and Sell Stock",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Sliding Window',
      companies: ["Amazon", "Facebook", "Microsoft", "Google"],
      tags: ["sliding-window", "array", "greedy"],
      problemStatement: "You are given an array prices where prices[i] is the price of a given stock on day i. You want to maximize profit by choosing a single day to buy and a different day to sell. Return the maximum profit. If no profit, return 0.",
      examples: [{"input": "prices = [7,1,5,3,6,4]", "output": "5"}, {"input": "prices = [7,6,4,3,1]", "output": "0"}],
      constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
      hints: ["Track the minimum price as the buy day", "For each day, calculate profit = price - minPrice"],
      bruteForce: "Check all pairs \u2014 O(n^2).",
      optimizedSolution: "One pass: track minPrice, compute max profit. O(n)/O(1).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func maxProfit(prices []int) int {
    minPrice := prices[0]
    maxProfit := 0
    for _, p := range prices {
        if p < minPrice { minPrice = p }
        profit := p - minPrice
        if profit > maxProfit { maxProfit = profit }
    }
    return maxProfit
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"},
      related: ["Best Time II", "Best Time III"],
      dryRun: {
        title: "Best Time to Buy and Sell Stock \u2014 Sliding Window",
        input: "prices = [7,1,5,3,6,4]",
        result: "Max profit = 5 (buy at 1, sell at 6)",
        steps: [
          { line: 2, description: "Initialize minPrice = 7, maxProfit = 0", variables: [{"name": "minPrice", "value": "7"}, {"name": "maxProfit", "value": "0"}], dataState: "prices = [7, 1, 5, 3, 6, 4]\n         ^\nminPrice = 7, maxProfit = 0" },
          { line: 4, description: "i=0, p=7. profit = 7-7 = 0. maxProfit stays 0.", variables: [{"name": "p", "value": "7"}, {"name": "profit", "value": "0"}, {"name": "minPrice", "value": "7"}, {"name": "maxProfit", "value": "0"}], dataState: "prices = [7, 1, 5, 3, 6, 4]\n         ^\nprofit = 0" },
          { line: 3, description: "i=1, p=1. 1 < 7 \u2192 minPrice = 1. profit = 1-1 = 0.", variables: [{"name": "p", "value": "1"}, {"name": "minPrice", "value": "1"}, {"name": "profit", "value": "0"}, {"name": "maxProfit", "value": "0"}], dataState: "prices = [7, 1, 5, 3, 6, 4]\n            ^\nminPrice = 1 (new low!)" },
          { line: 5, description: "i=2, p=5. profit = 5-1 = 4. maxProfit = max(0,4) = 4.", variables: [{"name": "p", "value": "5"}, {"name": "profit", "value": "4"}, {"name": "minPrice", "value": "1"}, {"name": "maxProfit", "value": "4"}], dataState: "prices = [7, 1, 5, 3, 6, 4]\n               ^\nprofit = 5-1 = 4" },
          { line: 5, description: "i=3, p=3. profit = 3-1 = 2. maxProfit stays 4.", variables: [{"name": "p", "value": "3"}, {"name": "profit", "value": "2"}, {"name": "maxProfit", "value": "4"}], dataState: "prices = [7, 1, 5, 3, 6, 4]\n                  ^\nprofit = 3-1 = 2" },
          { line: 5, description: "i=4, p=6. profit = 6-1 = 5. maxProfit = max(4,5) = 5!", variables: [{"name": "p", "value": "6"}, {"name": "profit", "value": "5"}, {"name": "maxProfit", "value": "5"}], dataState: "prices = [7, 1, 5, 3, 6, 4]\n                     ^\nprofit = 6-1 = 5 \u2190 NEW MAX!" },
          { line: 7, description: "Return maxProfit = 5", variables: [{"name": "result", "value": "5"}], dataState: "Result: 5 (buy@1, sell@6) \u2713" },
        ],
      },
    },
    {
      id: 'lc-424',
      title: "Longest Repeating Character Replacement",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Sliding Window',
      companies: ["Amazon", "Google", "Meta"],
      tags: ["sliding-window", "string", "hash-map"],
      problemStatement: "You are given a string s and an integer k. You can replace at most k characters in a substring to make it all the same character. Return the length of the longest substring achievable.",
      examples: [{"input": "s = \"ABAB\", k = 2", "output": "4"}, {"input": "s = \"AABABBA\", k = 1", "output": "4"}],
      constraints: ["1 <= s.length <= 10^5", "s consists of uppercase English letters", "0 <= k <= s.length"],
      hints: ["Sliding window: track max char count in window", "Window is valid when window_size - max_char_count <= k"],
      bruteForce: "Check all substrings \u2014 O(n^2).",
      optimizedSolution: "Sliding window with char frequency. O(n)/O(26)=O(1).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func characterReplacement(s string, k int) int {
    count := [26]int{}
    maxCount, left, maxLen := 0, 0, 0
    for right := 0; right < len(s); right++ {
        count[s[right]-'A']++
        if count[s[right]-'A'] > maxCount {
            maxCount = count[s[right]-'A']
        }
        for (right-left+1) - maxCount > k {
            count[s[left]-'A']--
            left++
        }
        if right-left+1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/longest-repeating-character-replacement/"},
      related: ["Longest Substring Without Repeating", "Max Consecutive Ones III"],
      dryRun: {
        title: "Longest Repeating Char Replacement \u2014 Sliding Window",
        input: "s = \"AABABBA\", k = 1",
        result: "Max length = 4",
        steps: [
          { line: 2, description: "Initialize count=[0..0], maxCount=0, left=0, maxLen=0", variables: [{"name": "left", "value": "0"}, {"name": "maxCount", "value": "0"}, {"name": "maxLen", "value": "0"}], dataState: "s = A A B A B B A\n       ^right\nleft = 0\nwindow = \"\"" },
          { line: 5, description: "right=0: A. count[A]=1. maxCount=1. window=1-1=0 <= k=1. maxLen=1", variables: [{"name": "right", "value": "0"}, {"name": "maxCount", "value": "1"}, {"name": "maxLen", "value": "1"}], dataState: "s = [A] A B A B B A\n window: \"A\"\n maxCount=1, replacements=0 <= 1" },
          { line: 5, description: "right=1: A. count[A]=2. maxCount=2. 2-2=0 <= 1. maxLen=2", variables: [{"name": "right", "value": "1"}, {"name": "maxCount", "value": "2"}, {"name": "maxLen", "value": "2"}], dataState: "s = [A A] B A B B A\n  window: \"AA\"\n  maxCount=2, replacements=0" },
          { line: 5, description: "right=2: B. count[B]=1. maxCount=2. 3-2=1 <= 1. maxLen=3", variables: [{"name": "right", "value": "2"}, {"name": "maxCount", "value": "2"}, {"name": "maxLen", "value": "3"}], dataState: "s = [A A B] A B B A\n   window: \"AAB\"\n   maxCount=2, replacements=1 <= 1" },
          { line: 5, description: "right=3: A. count[A]=3. maxCount=3. 4-3=1 <= 1. maxLen=4", variables: [{"name": "right", "value": "3"}, {"name": "maxCount", "value": "3"}, {"name": "maxLen", "value": "4"}], dataState: "s = [A A B A] B B A\n    window: \"AABA\"\n    maxCount=3, replacements=1 <= 1" },
          { line: 8, description: "right=4: B. count[B]=2. maxCount=3. 5-3=2 > 1! Shrink left. left=1. 4-3=1 <= 1.", variables: [{"name": "right", "value": "4"}, {"name": "left", "value": "1"}, {"name": "maxCount", "value": "3"}, {"name": "maxLen", "value": "4"}], dataState: "s =  A [A B A B] B A\n         ^left    ^right\n window: \"ABAB\"\n Shrink: replacements=2 > 1, move left" },
          { line: 8, description: "right=5: B. count[B]=3. 5-1+1-3=2 > 1. Shrink left=2. 4-3=1 <= 1. maxLen stays 4.", variables: [{"name": "right", "value": "5"}, {"name": "left", "value": "2"}, {"name": "maxLen", "value": "4"}], dataState: "s =  A  A [B A B B] A\n            ^left    ^right\n window: \"BABB\"\n Shrink again" },
          { line: 11, description: "right=6: A. Similar shrinking. maxLen stays 4. Return 4.", variables: [{"name": "maxLen", "value": "4"}, {"name": "result", "value": "4"}], dataState: "Result: 4 \u2713\n(substring \"AABA\" with 1 replacement)" },
        ],
      },
    },
  ],
};
