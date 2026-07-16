import type { TopicContent } from '../../types';

export const binarySearchContent: TopicContent = {
  slug: 'dsa/binary-search',
  title: 'Binary Search',
  category: 'dsa',
  theory: `# Binary Search

## Core Idea

Halve the search space each iteration by comparing the midpoint with the target. Requires a **sorted** or **monotonic** search space.

## Template (Bug-Free)

\`\`\`go
lo, hi := 0, len(nums)-1
for lo <= hi {
    mid := lo + (hi-lo)/2 // avoids overflow vs (lo+hi)/2
    if nums[mid] == target { return mid }
    if nums[mid] < target { lo = mid + 1 } else { hi = mid - 1 }
}
return -1
\`\`\`

## Left Boundary (first occurrence)

\`\`\`go
lo, hi := 0, len(nums)
for lo < hi {
    mid := lo + (hi-lo)/2
    if nums[mid] < target { lo = mid + 1 } else { hi = mid }
}
return lo // lo == first index where nums[lo] >= target
\`\`\`

## Right Boundary (last occurrence)

\`\`\`go
lo, hi := 0, len(nums)
for lo < hi {
    mid := lo + (hi-lo)/2
    if nums[mid] <= target { lo = mid + 1 } else { hi = mid }
}
return lo - 1
\`\`\`

## Search on Answer Space

Use when the answer itself is monotonic — binary search on the answer range instead of the array.

## Complexity

| | Time | Space |
|-|------|-------|
| Binary search | O(log n) | O(1) |
| With recursion | O(log n) | O(log n) stack |
`,

  examples: `# Binary Search — Examples

## Rotated Sorted Array

\`\`\`go
func search(nums []int, target int) int {
    lo, hi := 0, len(nums)-1
    for lo <= hi {
        mid := lo + (hi-lo)/2
        if nums[mid] == target { return mid }
        if nums[lo] <= nums[mid] { // left half sorted
            if nums[lo] <= target && target < nums[mid] { hi = mid - 1 } else { lo = mid + 1 }
        } else { // right half sorted
            if nums[mid] < target && target <= nums[hi] { lo = mid + 1 } else { hi = mid - 1 }
        }
    }
    return -1
}
\`\`\`

## Koko Eating Bananas (Answer Space)

\`\`\`go
func minEatingSpeed(piles []int, h int) int {
    lo, hi := 1, slices.Max(piles)
    for lo < hi {
        mid := lo + (hi-lo)/2
        hours := 0
        for _, p := range piles { hours += (p + mid - 1) / mid }
        if hours <= h { hi = mid } else { lo = mid + 1 }
    }
    return lo
}
\`\`\`
`,

  patterns: `# Binary Search Patterns

## 1. Exact Search — standard template, return index or -1
## 2. Left Boundary — first position satisfying condition
## 3. Right Boundary — last position satisfying condition
## 4. Search on Answer — binary search over answer range [lo, hi]

**Trigger for answer-space search:**
- "minimum X such that condition"
- "maximum X such that condition"
- Condition is monotonic (once true, stays true)

\`\`\`go
// Generic answer-space template
lo, hi := minPossible, maxPossible
for lo < hi {
    mid := lo + (hi-lo)/2
    if feasible(mid) { hi = mid } else { lo = mid + 1 }
}
return lo
\`\`\`
`,

  interviewTips: `# Interview Tips — Binary Search

1. **Always use \`mid = lo + (hi-lo)/2\`** to avoid integer overflow.
2. Choose loop invariant: \`lo <= hi\` (exact) vs \`lo < hi\` (boundary).
3. Prove your loop terminates: show the search space strictly shrinks each iteration.
4. For answer-space problems, identify: what range? what feasibility check?
5. After the loop, verify \`lo\` is a valid answer — may need bounds check.
`,

  commonMistakes: `# Common Mistakes — Binary Search

1. **Overflow in mid calculation** — use \`lo + (hi-lo)/2\`.
2. **Wrong loop condition** — \`lo <= hi\` for exact search, \`lo < hi\` for boundary.
3. **Infinite loop** — if \`hi = mid\` and \`lo = mid\`, ensure \`mid = lo + (hi-lo)/2\` (rounds down, so \`lo < hi\` makes progress).
4. **Off-by-one on boundaries** — left boundary returns \`lo\`, right boundary returns \`lo-1\`.
5. **Not verifying answer** — check \`nums[lo] == target\` after left-boundary search.
`,

  revision: `# Binary Search — Quick Revision

| Variant | Condition | Move | Returns |
|---------|-----------|------|---------|
| Exact | \`lo <= hi\` | \`lo=mid+1\` / \`hi=mid-1\` | index or -1 |
| Left bound | \`lo < hi\` | \`lo=mid+1\` / \`hi=mid\` | \`lo\` |
| Right bound | \`lo < hi\` | \`lo=mid+1\` / \`hi=mid\` | \`lo-1\` |
| Answer space | \`lo < hi\` | feasible → \`hi=mid\` else \`lo=mid+1\` | \`lo\` |
`,

  codeExamples: [
    {
      language: 'go',
      label: 'Standard Binary Search',
      code: `func binarySearch(nums []int, target int) int {
	lo, hi := 0, len(nums)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if nums[mid] == target {
			return mid
		} else if nums[mid] < target {
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return -1
}`,
    },
    {
      language: 'go',
      label: 'Left Boundary',
      code: `func lowerBound(nums []int, target int) int {
	lo, hi := 0, len(nums)
	for lo < hi {
		mid := lo + (hi-lo)/2
		if nums[mid] < target {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return lo
}`,
    },
  ],

  resources: [
    { title: 'Binary Search — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Binary Search — CP-Algorithms', url: 'https://cp-algorithms.com/num_methods/binary_search.html', type: 'article', free: true },
    { title: 'LeetCode Binary Search Tag', url: 'https://leetcode.com/tag/binary-search/', type: 'docs', free: true },
  ],

  quiz: [
    {
      id: 'bs-q1',
      question: 'Why use `lo + (hi-lo)/2` instead of `(lo+hi)/2`?',
      options: ['Faster computation', 'Avoids integer overflow when lo+hi exceeds INT_MAX', 'Always rounds up', 'Syntactic preference'],
      correctIndex: 1,
      explanation: 'If lo and hi are both large, lo+hi can overflow a 32-bit integer. lo+(hi-lo)/2 is mathematically equivalent but safe.',
    },
    {
      id: 'bs-q2',
      question: 'In left-boundary binary search (find first occurrence), what loop condition prevents infinite loops?',
      options: ['lo <= hi', 'lo < hi', 'lo != hi', 'lo >= hi'],
      correctIndex: 1,
      explanation: 'With lo < hi and hi=mid, when lo=hi the loop exits. Using lo<=hi with hi=mid would loop forever when lo==hi==mid.',
    },
    {
      id: 'bs-q3',
      question: 'Binary search on "minimum feasible answer" problems requires the feasibility function to be:',
      options: ['Strictly decreasing', 'Monotonic (once true, stays true)', 'Random', 'Strictly increasing'],
      correctIndex: 1,
      explanation: 'Binary search on answer space only works when the answer space is monotonic — feasible(x) implies feasible(x+1) for maximisation.',
    },
    {
      id: 'bs-q4',
      question: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
      correctIndex: 2,
      explanation: 'Each step halves the search space — after k steps, n/2^k = 1, so k = log₂n steps.',
    },
  ],

  questions: [
    {
      id: 'lc-704',
      title: 'Binary Search',
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Binary Search',
      companies: ['Google', 'Amazon', 'Microsoft'],
      tags: ['binary-search', 'array'],
      problemStatement: 'Given a sorted array of integers nums and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1. Must be O(log n) runtime.',
      examples: [
        { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
        { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
      ],
      constraints: ['1 <= nums.length <= 10^4', 'All values unique', 'nums sorted ascending'],
      hints: ['Use left and right pointers', 'Compare mid with target, discard half each time'],
      bruteForce: 'Linear scan — O(n) time.',
      optimizedSolution: 'Classic binary search: left, right, mid. O(log n)/O(1).',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func search(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        } else if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/binary-search/' },
      related: ['Search Insert Position', 'Search 2D Matrix'],
      dryRun: {
        title: 'Binary Search — Iterative',
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        result: 'Found at index 4',
        steps: [
          { line: 2, description: 'Initialize left = 0, right = 5', variables: [{ name: 'left', value: '0' }, { name: 'right', value: '5' }], dataState: 'nums = [-1, 0, 3, 5, 9, 12]\n       ^left        ^right' },
          { line: 4, description: 'mid = 0 + (5-0)/2 = 2. nums[2] = 3 < 9. Move left = 3', variables: [{ name: 'mid', value: '2' }, { name: 'nums[mid]', value: '3' }, { name: 'left', value: '3' }, { name: 'right', value: '5' }], dataState: 'nums = [-1, 0, 3, 5, 9, 12]\n             ^left    ^right\nmid=2, nums[2]=3 < 9' },
          { line: 4, description: 'mid = 3 + (5-3)/2 = 4. nums[4] = 9 == target. Return 4!', variables: [{ name: 'mid', value: '4' }, { name: 'nums[mid]', value: '9' }, { name: 'result', value: '4' }], dataState: 'nums = [-1, 0, 3, 5, 9, 12]\n                   ^left ^right\nmid=4, nums[4]=9 == 9\nFOUND!' },
        ],
      },
    },
    {
      id: 'lc-33',
      title: 'Search in Rotated Sorted Array',
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Modified Binary Search',
      companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
      tags: ['binary-search', 'array'],
      problemStatement: 'A sorted array is rotated at an unknown pivot. Given the array and a target value, search for the target in O(log n) time. Return its index, or -1 if not found.',
      examples: [
        { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
        { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
      ],
      constraints: ['1 <= nums.length <= 5000', 'All values unique', 'nums rotated at some pivot'],
      hints: ['At each mid, determine which half is sorted', 'Check if target is in the sorted half'],
      bruteForce: 'Linear scan — O(n).',
      optimizedSolution: 'Modified binary search: check which half is sorted, then decide which half to search. O(log n)/O(1).',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func search(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        }
        if nums[left] <= nums[mid] {
            if nums[left] <= target && target < nums[mid] {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
            if nums[mid] < target && target <= nums[right] {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }
    return -1
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      related: ['Search Rotated II', 'Find Min in Rotated Array'],
      dryRun: {
        title: 'Search in Rotated Sorted Array',
        input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0',
        result: 'Found at index 4',
        steps: [
          { line: 2, description: 'Initialize left = 0, right = 6', variables: [{ name: 'left', value: '0' }, { name: 'right', value: '6' }], dataState: 'nums = [4, 5, 6, 7, 0, 1, 2]\n       ^left           ^right' },
          { line: 4, description: 'mid = 3. nums[3] = 7 != 0. Left half [4,5,6,7] is sorted (4 <= 7)', variables: [{ name: 'mid', value: '3' }, { name: 'nums[mid]', value: '7' }, { name: 'left half', value: 'sorted' }], dataState: 'nums = [4, 5, 6, 7, 0, 1, 2]\n       ^left  ^mid     ^right\nLeft half [4,5,6,7] is sorted' },
          { line: 7, description: 'Is 0 in [4, 7)? No (0 < 4). Search right half. left = 4', variables: [{ name: 'left', value: '4' }, { name: 'right', value: '6' }], dataState: 'nums = [4, 5, 6, 7, 0, 1, 2]\n                   ^left  ^right\nSearching right half' },
          { line: 4, description: 'mid = 5. nums[5] = 1 != 0. Left half [0] is sorted (0 <= 1)', variables: [{ name: 'mid', value: '5' }, { name: 'nums[mid]', value: '1' }, { name: 'left half', value: 'sorted' }], dataState: 'nums = [4, 5, 6, 7, 0, 1, 2]\n                   ^left ^mid ^right\nLeft half [0] is sorted' },
          { line: 7, description: 'Is 0 in [0, 1)? Yes! Search left. right = 4', variables: [{ name: 'left', value: '4' }, { name: 'right', value: '4' }], dataState: 'nums = [4, 5, 6, 7, 0, 1, 2]\n                   ^left=^right\nSearching left half' },
          { line: 4, description: 'mid = 4. nums[4] = 0 == target. Return 4!', variables: [{ name: 'mid', value: '4' }, { name: 'nums[mid]', value: '0' }, { name: 'result', value: '4' }], dataState: 'nums = [4, 5, 6, 7, 0, 1, 2]\n                   ^mid\nnums[4] = 0 == 0\nFOUND!' },
        ],
      },
    },
  ],
};
