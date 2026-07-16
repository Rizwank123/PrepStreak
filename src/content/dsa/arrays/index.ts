import type { TopicContent } from '../../types';

export const arraysContent: TopicContent = {
  slug: 'dsa/arrays',
  title: 'Arrays',
  category: 'dsa',
  theory: `# Arrays

## What is an Array?

An array is a **contiguous block of memory** storing elements of the same type. Elements are accessed via a zero-based index in O(1) time.

## Complexity

| Operation | Array | Dynamic Array |
|-----------|-------|---------------|
| Access | O(1) | O(1) |
| Search | O(n) | O(n) |
| Insert end | O(1) | O(1) amortized |
| Insert mid | O(n) | O(n) |
| Delete end | O(1) | O(1) |
| Delete mid | O(n) | O(n) |

## Memory Layout

Elements live at address = base + index × element_size, giving constant-time access.

\`\`\`
Index:  0    1    2    3    4
Value: [10] [20] [30] [40] [50]
\`\`\`

## Dynamic Arrays (Go Slices)

When capacity is exceeded, Go allocates a new backing array (typically 2×) and copies. Append is O(1) amortized.

\`\`\`go
s := make([]int, 0, 4) // len=0, cap=4
s = append(s, 1, 2, 3) // no alloc
s = append(s, 4, 5)    // cap exceeded → new alloc
\`\`\`

## When to Use Arrays

- Random access by index required
- Fixed or predictable data size
- Cache performance critical (spatial locality)
- Simplest possible structure needed
`,

  examples: `# Arrays — Examples

## Two Sum (Hash Map)

Given nums and target, return indices where nums[i] + nums[j] == target.

\`\`\`go
func twoSum(nums []int, target int) []int {
    seen := make(map[int]int) // value → index
    for i, v := range nums {
        if j, ok := seen[target-v]; ok {
            return []int{j, i}
        }
        seen[v] = i
    }
    return nil
}
\`\`\`

Trace: [2,7,11,15], target=9
- i=0: need 7, not seen → add {2:0}
- i=1: need 2, found at 0 → return [0,1] ✓

## Maximum Subarray (Kadane's)

\`\`\`go
func maxSubArray(nums []int) int {
    curr, best := nums[0], nums[0]
    for _, v := range nums[1:] {
        if curr < 0 { curr = 0 }
        curr += v
        if curr > best { best = curr }
    }
    return best
}
\`\`\`

## Rotate Array In-Place

\`\`\`go
func rotate(nums []int, k int) {
    n := len(nums)
    k %= n
    rev := func(l, r int) {
        for l < r { nums[l], nums[r] = nums[r], nums[l]; l++; r-- }
    }
    rev(0, n-1); rev(0, k-1); rev(k, n-1)
}
\`\`\`
Trick: reverse all → reverse first k → reverse last n-k.
`,

  patterns: `# Array Patterns

## 1. Two Pointer

Move two indices toward each other or in the same direction.

\`\`\`go
// Pair sum in sorted array
left, right := 0, len(nums)-1
for left < right {
    sum := nums[left] + nums[right]
    if sum == target { return []int{left, right} }
    if sum < target { left++ } else { right-- }
}
\`\`\`

**When:** sorted input, pair/triplet problems, palindrome check.

## 2. Sliding Window

Maintain a window over contiguous elements; slide by one each step.

\`\`\`go
// Max sum subarray of size k
window := 0
for i := 0; i < k; i++ { window += nums[i] }
max := window
for i := k; i < len(nums); i++ {
    window += nums[i] - nums[i-k]
    if window > max { max = window }
}
\`\`\`

**When:** subarray/substring, fixed or variable window, max/min length.

## 3. Prefix Sum

Pre-compute cumulative sums for O(1) range queries.

\`\`\`go
pre := make([]int, len(nums)+1)
for i, v := range nums { pre[i+1] = pre[i] + v }
// sum[l..r] = pre[r+1] - pre[l]
\`\`\`

## 4. Kadane's Algorithm

Max subarray sum in O(n) — reset current sum when it goes negative.

## 5. In-Place Marking

Use sign negation to mark visited indices without extra space.

\`\`\`go
for _, v := range nums {
    idx := abs(v) - 1
    if nums[idx] < 0 { result = append(result, abs(v)) }
    nums[idx] = -nums[idx]
}
\`\`\`
`,

  interviewTips: `# Interview Tips — Arrays

1. **Ask first:** sorted? duplicates? negatives? index vs value return?
2. **State brute force, then optimise** — O(n²) → hash map O(n), or sort + two-pointer O(n log n).
3. **Complexity expectations:**
   - Single pass → O(n) time, O(1) or O(n) space
   - Pair finding → O(n) hash or O(n log n) sort+pointer
   - Range queries → O(n) prefix, then O(1) per query
4. **Always handle:** empty array, single element, all negatives, overflow.
5. **Talk aloud:** "I'll use a hash map so complement lookup is O(1), trading O(n) space for time."
6. **Test on paper** before claiming correct — trace through one example.
`,

  commonMistakes: `# Common Mistakes — Arrays

1. **Off-by-one in two pointer** — use \`left < right\` not \`left < right - 1\`.
2. **Missing \`k %= n\` in rotation** — if k equals n, no rotation needed.
3. **Integer overflow** — use \`int64\` when summing large values.
4. **Kadane's with all-negatives** — initialise \`curr\` and \`best\` to \`nums[0]\`, not 0.
5. **Wrong prefix sum index** — range [l, r] = pre[r+1] - pre[l], not pre[r] - pre[l-1].
6. **Mutating slice during iteration** — use write pointer pattern instead.
7. **Forgetting sorted precondition** for binary search or two pointer.
`,

  revision: `# Arrays — Quick Revision

## Must-Know Patterns
- [ ] Two Pointer (sorted pair sum)
- [ ] Sliding Window (subarray problems)
- [ ] Prefix Sum (range queries)
- [ ] Kadane's (max subarray)
- [ ] In-place marking (duplicates in [1..n])
- [ ] Cyclic sort (find missing number)

## Top Problems
| Problem | Pattern | Complexity |
|---------|---------|-----------|
| Two Sum | Hash Map | O(n) / O(n) |
| Max Subarray | Kadane | O(n) / O(1) |
| Rotate Array | Triple reverse | O(n) / O(1) |
| Product Except Self | Prefix+suffix | O(n) / O(1) |
| Container With Most Water | Two pointer | O(n) / O(1) |
| Find Duplicate | Floyd's cycle | O(n) / O(1) |
| Merge Intervals | Sort+scan | O(n log n) / O(n) |
`,

  codeExamples: [
    {
      language: 'go',
      label: 'Two Sum',
      code: `func twoSum(nums []int, target int) []int {
	seen := make(map[int]int)
	for i, v := range nums {
		if j, ok := seen[target-v]; ok {
			return []int{j, i}
		}
		seen[v] = i
	}
	return nil
}`,
    },
    {
      language: 'go',
      label: "Kadane's Algorithm",
      code: `func maxSubArray(nums []int) int {
	curr, best := nums[0], nums[0]
	for _, v := range nums[1:] {
		if curr < 0 {
			curr = 0
		}
		curr += v
		if curr > best {
			best = curr
		}
	}
	return best
}`,
    },
    {
      language: 'typescript',
      label: 'Two Sum (TypeScript)',
      code: `function twoSum(nums: number[], target: number): number[] {
  const seen = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (seen.has(comp)) return [seen.get(comp)!, i];
    seen.set(nums[i], i);
  }
  return [];
}`,
    },
  ],

  resources: [
    { title: 'Arrays — NeetCode Roadmap', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Array Data Structure — GeeksForGeeks', url: 'https://www.geeksforgeeks.org/array-data-structure/', type: 'article', free: true },
    { title: 'LeetCode Array Tag', url: 'https://leetcode.com/tag/array/', type: 'docs', free: true },
    { title: 'Introduction to Algorithms (CLRS)', url: 'https://mitpress.mit.edu/9780262046305/', type: 'book', free: false },
  ],

  quiz: [
    {
      id: 'arr-q1',
      question: 'What is the time complexity of accessing an element by index in an array?',
      options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
      correctIndex: 2,
      explanation: 'Arrays store elements contiguously. Address = base + index × size, computed in constant time.',
    },
    {
      id: 'arr-q2',
      question: 'Which algorithm finds the maximum subarray sum in O(n)?',
      options: ['Merge Sort', "Kadane's Algorithm", 'Binary Search', "Floyd's Algorithm"],
      correctIndex: 1,
      explanation: "Kadane's maintains a running sum and resets to 0 when negative, tracking the global max in one pass.",
    },
    {
      id: 'arr-q3',
      question: 'For "find a pair summing to target in a sorted array", which pattern is most efficient?',
      options: ['Hash Map O(n)', 'Two Pointer O(n)', 'Binary Search O(n log n)', 'Brute Force O(n²)'],
      correctIndex: 1,
      explanation: 'Two pointer on a sorted array moves left/right based on current sum vs target. O(n) time, O(1) space.',
    },
    {
      id: 'arr-q4',
      question: 'After O(n) prefix-sum pre-processing, what is the complexity of a single range-sum query [l, r]?',
      options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
      correctIndex: 2,
      explanation: 'pre[r+1] - pre[l] answers the range query in constant time after O(n) preprocessing.',
    },
    {
      id: 'arr-q5',
      question: 'The triple-reverse array rotation uses how much extra space?',
      options: ['O(n)', 'O(k)', 'O(log n)', 'O(1)'],
      correctIndex: 3,
      explanation: 'Triple reverse operates in-place using only a few index variables — O(1) extra space.',
    },
  ],

  questions: [
    {
      id: 'lc-1',
      title: 'Two Sum',
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Hash Map',
      companies: ['Google', 'Amazon', 'Microsoft', 'Meta', 'Apple'],
      tags: ['array', 'hash-map'],
      problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      examples: [
        { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 9' },
        { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      ],
      constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Exactly one solution exists'],
      hints: ['Store seen values in a hash map', 'For each number check if complement is already in map'],
      bruteForce: 'Nested loops checking all pairs — O(n²) time, O(1) space.',
      optimizedSolution: 'Single pass hash map: for each element store it; look up complement before storing. O(n) time, O(n) space.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, v := range nums {
        if j, ok := seen[target-v]; ok {
            return []int{j, i}
        }
        seen[v] = i
    }
    return nil
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/two-sum/' },
      related: ['3Sum', 'Two Sum II'],
      dryRun: {
        title: 'Two Sum — Hash Map Approach',
        input: 'nums = [2, 7, 11, 15], target = 9',
        result: 'Return [0, 1] — nums[0] + nums[1] = 2 + 7 = 9',
        steps: [
          { line: 2, description: 'Initialize empty hash map `seen`', variables: [{ name: 'seen', value: '{}' }, { name: 'target', value: '9' }], dataState: 'nums = [2, 7, 11, 15]\nseen = {}' },
          { line: 3, description: 'i=0, v=2. Check if complement (9-2=7) is in seen. Not found.', variables: [{ name: 'i', value: '0' }, { name: 'v', value: '2' }, { name: 'complement', value: '7' }, { name: 'found', value: 'false' }], dataState: 'nums = [2, 7, 11, 15]\n     ^\nseen = {}' },
          { line: 5, description: 'Store 2 → 0 in seen', variables: [{ name: 'seen', value: '{2: 0}' }], dataState: 'nums = [2, 7, 11, 15]\nseen = {2: 0}' },
          { line: 3, description: 'i=1, v=7. Check if complement (9-7=2) is in seen. Found at index 0!', variables: [{ name: 'i', value: '1' }, { name: 'v', value: '7' }, { name: 'complement', value: '2' }, { name: 'found', value: 'true' }], dataState: 'nums = [2, 7, 11, 15]\n        ^\nseen = {2: 0}' },
          { line: 4, description: 'Return [0, 1] — complement 2 was at index 0, current index is 1', variables: [{ name: 'result', value: '[0, 1]' }], dataState: 'Result: [0, 1]' },
        ],
      },
    },
    {
      id: 'lc-53',
      title: 'Maximum Subarray',
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: "Kadane's Algorithm",
      companies: ['Amazon', 'Apple', 'Google', 'Microsoft'],
      tags: ['array', 'dynamic-programming'],
      problemStatement: 'Given an integer array nums, find the subarray with the largest sum and return its sum.',
      examples: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has sum 6' },
      ],
      constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
      hints: ['At each position, decide: extend current subarray or start fresh', 'Track current and global max'],
      bruteForce: 'Try all O(n²) subarrays, compute sum each time.',
      optimizedSolution: "Kadane's: keep running sum, reset to 0 when negative, track global max. O(n)/O(1).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func maxSubArray(nums []int) int {
    curr, best := nums[0], nums[0]
    for _, v := range nums[1:] {
        if curr < 0 { curr = 0 }
        curr += v
        if curr > best { best = curr }
    }
    return best
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/maximum-subarray/' },
      related: ['Maximum Product Subarray', 'Maximum Sum Circular Subarray'],
      dryRun: {
        title: "Kadane's Algorithm — Maximum Subarray",
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        result: 'Max subarray = [4, -1, 2, 1], sum = 6',
        steps: [
          { line: 2, description: 'Initialize maxSoFar = -2, currentMax = -2 (first element)', variables: [{ name: 'maxSoFar', value: '-2' }, { name: 'currentMax', value: '-2' }], dataState: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n       ^\nmaxSoFar = -2, currentMax = -2' },
          { line: 4, description: 'i=1, v=1. currentMax = max(1, -2+1) = 1. maxSoFar = max(-2, 1) = 1', variables: [{ name: 'i', value: '1' }, { name: 'v', value: '1' }, { name: 'currentMax', value: '1' }, { name: 'maxSoFar', value: '1' }], dataState: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n          ^\nmaxSoFar = 1, currentMax = 1' },
          { line: 4, description: 'i=2, v=-3. currentMax = max(-3, 1+(-3)) = -2. maxSoFar stays 1', variables: [{ name: 'i', value: '2' }, { name: 'v', value: '-3' }, { name: 'currentMax', value: '-2' }, { name: 'maxSoFar', value: '1' }], dataState: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n             ^\nmaxSoFar = 1, currentMax = -2' },
          { line: 4, description: 'i=3, v=4. currentMax = max(4, -2+4) = 4. maxSoFar = max(1, 4) = 4', variables: [{ name: 'i', value: '3' }, { name: 'v', value: '4' }, { name: 'currentMax', value: '4' }, { name: 'maxSoFar', value: '4' }], dataState: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n                ^\nmaxSoFar = 4, currentMax = 4' },
          { line: 4, description: 'i=4, v=-1. currentMax = max(-1, 4+(-1)) = 3. maxSoFar stays 4', variables: [{ name: 'i', value: '4' }, { name: 'v', value: '-1' }, { name: 'currentMax', value: '3' }, { name: 'maxSoFar', value: '4' }], dataState: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n                   ^\nmaxSoFar = 4, currentMax = 3' },
          { line: 4, description: 'i=5, v=2. currentMax = max(2, 3+2) = 5. maxSoFar = max(4, 5) = 5', variables: [{ name: 'i', value: '5' }, { name: 'v', value: '2' }, { name: 'currentMax', value: '5' }, { name: 'maxSoFar', value: '5' }], dataState: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n                      ^\nmaxSoFar = 5, currentMax = 5' },
          { line: 4, description: 'i=6, v=1. currentMax = max(1, 5+1) = 6. maxSoFar = max(5, 6) = 6', variables: [{ name: 'i', value: '6' }, { name: 'v', value: '1' }, { name: 'currentMax', value: '6' }, { name: 'maxSoFar', value: '6' }], dataState: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n                         ^\nmaxSoFar = 6, currentMax = 6' },
          { line: 4, description: 'i=7, v=-5. currentMax = max(-5, 6+(-5)) = 1. maxSoFar stays 6', variables: [{ name: 'i', value: '7' }, { name: 'v', value: '-5' }, { name: 'currentMax', value: '1' }, { name: 'maxSoFar', value: '6' }], dataState: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n                            ^\nmaxSoFar = 6, currentMax = 1' },
          { line: 4, description: 'i=8, v=4. currentMax = max(4, 1+4) = 5. maxSoFar stays 6', variables: [{ name: 'i', value: '8' }, { name: 'v', value: '4' }, { name: 'currentMax', value: '5' }, { name: 'maxSoFar', value: '6' }], dataState: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n                               ^\nmaxSoFar = 6, currentMax = 5' },
          { line: 6, description: 'Loop ends. Return maxSoFar = 6. Subarray: [4, -1, 2, 1]', variables: [{ name: 'result', value: '6' }], dataState: 'Result: 6\nSubarray: [4, -1, 2, 1]' },
        ],
      },
    },
    {
      id: 'lc-121',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'One Pass',
      companies: ['Amazon', 'Facebook', 'Microsoft', 'Google'],
      tags: ['array', 'greedy'],
      problemStatement: 'You are given an array prices where prices[i] is the price of a given stock on day i. You want to maximize profit by choosing a single day to buy and a different day to sell. Return the maximum profit. If no profit is possible, return 0.',
      examples: [
        { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy at 1, sell at 6 → profit = 5' },
        { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No profitable transaction' },
      ],
      constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'],
      hints: ['Track the minimum price seen so far', 'At each day, calculate potential profit if sold today'],
      bruteForce: 'For each day, check all future days for max profit — O(n²) time, O(1) space.',
      optimizedSolution: 'Track minPrice as you iterate. At each day, compute profit = price - minPrice. Track maxProfit. O(n)/O(1).',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func maxProfit(prices []int) int {
    minPrice := prices[0]
    maxProfit := 0
    for _, p := range prices {
        if p < minPrice {
            minPrice = p
        }
        profit := p - minPrice
        if profit > maxProfit {
            maxProfit = profit
        }
    }
    return maxProfit
}`,
        },
        {
          language: 'typescript', label: 'TypeScript',
          code: `function maxProfit(prices: number[]): number {
    let minPrice = prices[0];
    let maxProfit = 0;
    for (const p of prices) {
        minPrice = Math.min(minPrice, p);
        maxProfit = Math.max(maxProfit, p - minPrice);
    }
    return maxProfit;
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      related: ['Best Time II', 'Best Time III', 'Best Time IV'],
      dryRun: {
        title: 'Best Time to Buy and Sell Stock — One Pass',
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        result: 'Max profit = 5 (buy at 1, sell at 6)',
        steps: [
          { line: 2, description: 'Initialize minPrice = 7, maxProfit = 0', variables: [{ name: 'minPrice', value: '7' }, { name: 'maxProfit', value: '0' }], dataState: 'prices = [7, 1, 5, 3, 6, 4]\n         ^\nminPrice = 7, maxProfit = 0' },
          { line: 5, description: 'i=0, p=7. profit = 7-7 = 0. maxProfit stays 0', variables: [{ name: 'p', value: '7' }, { name: 'profit', value: '0' }, { name: 'minPrice', value: '7' }, { name: 'maxProfit', value: '0' }], dataState: 'prices = [7, 1, 5, 3, 6, 4]\n         ^\nminPrice = 7, maxProfit = 0' },
          { line: 3, description: 'i=1, p=1. 1 < 7 → update minPrice = 1. profit = 1-1 = 0', variables: [{ name: 'p', value: '1' }, { name: 'minPrice', value: '1' }, { name: 'profit', value: '0' }, { name: 'maxProfit', value: '0' }], dataState: 'prices = [7, 1, 5, 3, 6, 4]\n            ^\nminPrice = 1, maxProfit = 0' },
          { line: 5, description: 'i=2, p=5. profit = 5-1 = 4. maxProfit = max(0, 4) = 4', variables: [{ name: 'p', value: '5' }, { name: 'profit', value: '4' }, { name: 'minPrice', value: '1' }, { name: 'maxProfit', value: '4' }], dataState: 'prices = [7, 1, 5, 3, 6, 4]\n               ^\nminPrice = 1, maxProfit = 4' },
          { line: 5, description: 'i=3, p=3. profit = 3-1 = 2. maxProfit stays 4', variables: [{ name: 'p', value: '3' }, { name: 'profit', value: '2' }, { name: 'minPrice', value: '1' }, { name: 'maxProfit', value: '4' }], dataState: 'prices = [7, 1, 5, 3, 6, 4]\n                  ^\nminPrice = 1, maxProfit = 4' },
          { line: 5, description: 'i=4, p=6. profit = 6-1 = 5. maxProfit = max(4, 5) = 5', variables: [{ name: 'p', value: '6' }, { name: 'profit', value: '5' }, { name: 'minPrice', value: '1' }, { name: 'maxProfit', value: '5' }], dataState: 'prices = [7, 1, 5, 3, 6, 4]\n                     ^\nminPrice = 1, maxProfit = 5' },
          { line: 5, description: 'i=5, p=4. profit = 4-1 = 3. maxProfit stays 5', variables: [{ name: 'p', value: '4' }, { name: 'profit', value: '3' }, { name: 'minPrice', value: '1' }, { name: 'maxProfit', value: '5' }], dataState: 'prices = [7, 1, 5, 3, 6, 4]\n                        ^\nminPrice = 1, maxProfit = 5' },
          { line: 8, description: 'Return maxProfit = 5', variables: [{ name: 'result', value: '5' }], dataState: 'Result: 5\nBuy at 1, sell at 6' },
        ],
      },
    },
    {
      id: 'lc-217',
      title: 'Contains Duplicate',
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Hash Set',
      companies: ['Amazon', 'Google', 'Microsoft'],
      tags: ['array', 'hash-set'],
      problemStatement: 'Given an integer array nums, return true if any value appears at least twice in the array, and false if every element is distinct.',
      examples: [
        { input: 'nums = [1,2,3,1]', output: 'true' },
        { input: 'nums = [1,2,3,4]', output: 'false' },
      ],
      constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
      hints: ['Use a set to track seen values', 'If a value is already in the set, return true'],
      bruteForce: 'Sort and check adjacent pairs — O(n log n) time, O(1) space.',
      optimizedSolution: 'Iterate with a hash set. If element exists in set, return true. O(n)/O(n).',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func containsDuplicate(nums []int) bool {
    seen := make(map[int]bool)
    for _, n := range nums {
        if seen[n] {
            return true
        }
        seen[n] = true
    }
    return false
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/contains-duplicate/' },
      related: ['Contains Duplicate II', 'Contains Duplicate III'],
      dryRun: {
        title: 'Contains Duplicate — Hash Set',
        input: 'nums = [1, 2, 3, 1]',
        result: 'Return true — 1 appears twice',
        steps: [
          { line: 2, description: 'Initialize empty set `seen`', variables: [{ name: 'seen', value: '{}' }], dataState: 'nums = [1, 2, 3, 1]\nseen = {}' },
          { line: 3, description: 'i=0, n=1. 1 not in seen. Add 1 to seen.', variables: [{ name: 'n', value: '1' }, { name: 'seen', value: '{1}' }], dataState: 'nums = [1, 2, 3, 1]\n     ^\nseen = {1}' },
          { line: 3, description: 'i=1, n=2. 2 not in seen. Add 2 to seen.', variables: [{ name: 'n', value: '2' }, { name: 'seen', value: '{1, 2}' }], dataState: 'nums = [1, 2, 3, 1]\n        ^\nseen = {1, 2}' },
          { line: 3, description: 'i=2, n=3. 3 not in seen. Add 3 to seen.', variables: [{ name: 'n', value: '3' }, { name: 'seen', value: '{1, 2, 3}' }], dataState: 'nums = [1, 2, 3, 1]\n           ^\nseen = {1, 2, 3}' },
          { line: 4, description: 'i=3, n=1. 1 IS in seen! Return true.', variables: [{ name: 'n', value: '1' }, { name: 'seen', value: '{1, 2, 3}' }, { name: 'found', value: 'true' }], dataState: 'nums = [1, 2, 3, 1]\n              ^\nseen = {1, 2, 3}\nDUPLICATE FOUND!' },
        ],
      },
    },
    {
      id: 'lc-238',
      title: 'Product of Array Except Self',
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Prefix/Suffix Product',
      companies: ['Amazon', 'Apple', 'Microsoft', 'Meta', 'Google'],
      tags: ['array', 'prefix-sum'],
      problemStatement: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. Must be O(n) and without using division.',
      examples: [
        { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: 'answer[0] = 2*3*4 = 24, answer[3] = 1*2*3 = 6' },
      ],
      constraints: ['2 ≤ nums.length ≤ 10⁵', '-30 ≤ nums[i] ≤ 30', 'Product fits in 32-bit int'],
      hints: ['Compute prefix products left-to-right', 'Multiply by suffix products right-to-left'],
      bruteForce: 'For each element, compute product of all others — O(n²) time.',
      optimizedSolution: 'Two passes: prefix products left→right, then multiply suffix products right→left. O(n)/O(1) extra.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func productExceptSelf(nums []int) []int {
    n := len(nums)
    result := make([]int, n)
    result[0] = 1
    for i := 1; i < n; i++ {
        result[i] = result[i-1] * nums[i-1]
    }
    suffix := 1
    for i := n - 1; i >= 0; i-- {
        result[i] *= suffix
        suffix *= nums[i]
    }
    return result
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/product-of-array-except-self/' },
      related: ['Trapping Rain Water', 'Subarray Product Less Than K'],
      dryRun: {
        title: 'Product of Array Except Self — Prefix + Suffix',
        input: 'nums = [1, 2, 3, 4]',
        result: 'answer = [24, 12, 8, 6]',
        steps: [
          { line: 3, description: 'Initialize result[0] = 1 (prefix product of nothing before index 0)', variables: [{ name: 'result', value: '[1, _, _, _]' }], dataState: 'nums   = [1, 2, 3, 4]\nresult = [1, _, _, _]' },
          { line: 5, description: 'i=1: result[1] = result[0] * nums[0] = 1 * 1 = 1', variables: [{ name: 'i', value: '1' }, { name: 'result', value: '[1, 1, _, _]' }], dataState: 'nums   = [1, 2, 3, 4]\nresult = [1, 1, _, _]' },
          { line: 5, description: 'i=2: result[2] = result[1] * nums[1] = 1 * 2 = 2', variables: [{ name: 'i', value: '2' }, { name: 'result', value: '[1, 1, 2, _]' }], dataState: 'nums   = [1, 2, 3, 4]\nresult = [1, 1, 2, _]' },
          { line: 5, description: 'i=3: result[3] = result[2] * nums[2] = 2 * 3 = 6', variables: [{ name: 'i', value: '3' }, { name: 'result', value: '[1, 1, 2, 6]' }], dataState: 'nums   = [1, 2, 3, 4]\nresult = [1, 1, 2, 6]\n(Prefix products done)' },
          { line: 7, description: 'Initialize suffix = 1', variables: [{ name: 'suffix', value: '1' }], dataState: 'nums   = [1, 2, 3, 4]\nresult = [1, 1, 2, 6]\nsuffix = 1' },
          { line: 9, description: 'i=3: result[3] *= suffix → 6*1 = 6. suffix *= nums[3] → 1*4 = 4', variables: [{ name: 'i', value: '3' }, { name: 'result', value: '[1, 1, 2, 6]' }, { name: 'suffix', value: '4' }], dataState: 'nums   = [1, 2, 3, 4]\nresult = [1, 1, 2, 6]\nsuffix = 4' },
          { line: 9, description: 'i=2: result[2] *= suffix → 2*4 = 8. suffix *= nums[2] → 4*3 = 12', variables: [{ name: 'i', value: '2' }, { name: 'result', value: '[1, 1, 8, 6]' }, { name: 'suffix', value: '12' }], dataState: 'nums   = [1, 2, 3, 4]\nresult = [1, 1, 8, 6]\nsuffix = 12' },
          { line: 9, description: 'i=1: result[1] *= suffix → 1*12 = 12. suffix *= nums[1] → 12*2 = 24', variables: [{ name: 'i', value: '1' }, { name: 'result', value: '[1, 12, 8, 6]' }, { name: 'suffix', value: '24' }], dataState: 'nums   = [1, 2, 3, 4]\nresult = [1, 12, 8, 6]\nsuffix = 24' },
          { line: 9, description: 'i=0: result[0] *= suffix → 1*24 = 24. suffix *= nums[0] → 24*1 = 24', variables: [{ name: 'i', value: '0' }, { name: 'result', value: '[24, 12, 8, 6]' }, { name: 'suffix', value: '24' }], dataState: 'nums   = [1, 2, 3, 4]\nresult = [24, 12, 8, 6]\nDONE!' },
          { line: 11, description: 'Return result = [24, 12, 8, 6]', variables: [{ name: 'result', value: '[24, 12, 8, 6]' }], dataState: 'Result: [24, 12, 8, 6]' },
        ],
      },
    },
  ],
};
