import type { TopicContent } from '../../types';

export const searchingContent: TopicContent = {
  slug: 'dsa/searching', title: 'Searching', category: 'dsa',
  theory: `# Searching\n\n## Linear Search — O(n)\n\nScan every element. Works on unsorted data.\n\n## Binary Search — O(log n)\n\nRequires sorted data. Eliminates half the search space each step.\n\n## Hash Lookup — O(1) average\n\nHash map membership check. O(n) space.\n\n## Ternary Search — O(log n)\n\nFor unimodal functions: find maximum/minimum of f(x) over [lo, hi].\n\n\`\`\`go\nfor lo < hi-2 {\n    m1 := lo + (hi-lo)/3\n    m2 := hi - (hi-lo)/3\n    if f(m1) < f(m2) { lo = m1 } else { hi = m2 }\n}\n\`\`\`\n\n## Exponential Search — O(log n)\n\nFor unbounded/infinite sorted arrays: find range [1, 2, 4, 8, ...] then binary search.\n\n## Jump Search — O(√n)\n\nJump √n steps at a time, then linear scan within block.`,
  examples: `# Searching — Examples\n\n## Binary Search on Rotated Array\n\n\`\`\`go\nfunc search(nums []int, target int) int {\n    lo, hi := 0, len(nums)-1\n    for lo <= hi {\n        mid := lo + (hi-lo)/2\n        if nums[mid] == target { return mid }\n        if nums[lo] <= nums[mid] { // left half sorted\n            if nums[lo] <= target && target < nums[mid] { hi = mid-1 } else { lo = mid+1 }\n        } else { // right half sorted\n            if nums[mid] < target && target <= nums[hi] { lo = mid+1 } else { hi = mid-1 }\n        }\n    }\n    return -1\n}\n\`\`\`\n\n## Find Peak Element\n\n\`\`\`go\nfunc findPeakElement(nums []int) int {\n    lo, hi := 0, len(nums)-1\n    for lo < hi {\n        mid := lo + (hi-lo)/2\n        if nums[mid] > nums[mid+1] { hi = mid } else { lo = mid+1 }\n    }\n    return lo\n}\n\`\`\``,
  patterns: `# Searching Patterns\n\n## 1. Sorted array → Binary Search\n## 2. Answer space is monotonic → Binary search on answer\n## 3. Need O(1) membership → Hash set\n## 4. Unimodal function → Ternary search\n## 5. Unbounded array → Exponential search`,
  interviewTips: `# Interview Tips — Searching\n\n1. "Is the data sorted?" — if yes, binary search is almost always applicable.\n2. For hash lookup, always mention O(n) space cost.\n3. Binary search on the answer requires identifying the monotonic property first.\n4. Know all 4 binary search variants: exact, left bound, right bound, answer space.`,
  commonMistakes: `# Common Mistakes — Searching\n\n1. Applying binary search to unsorted data.\n2. Not accounting for duplicates in bound search.\n3. Confusing search termination — lo==hi vs lo>hi.`,
  revision: `# Searching — Quick Revision\n\n| Method | Data Required | Time |\n|--------|--------------|------|\n| Linear | None | O(n) |\n| Binary | Sorted | O(log n) |\n| Hash | None | O(1) avg |\n| Jump | Sorted | O(√n) |\n| Ternary | Unimodal | O(log n) |\n`,
  codeExamples: [{ language: 'go', label: 'Binary Search', code: `func binarySearch(arr []int, target int) int {
	lo, hi := 0, len(arr)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if arr[mid] == target { return mid }
		if arr[mid] < target { lo = mid + 1 } else { hi = mid - 1 }
	}
	return -1
}` }],
  resources: [
    { title: 'Searching — GfG', url: 'https://www.geeksforgeeks.org/searching-algorithms/', type: 'article', free: true },
    { title: 'Binary Search — CP-Algorithms', url: 'https://cp-algorithms.com/num_methods/binary_search.html', type: 'article', free: true },
    { title: 'LeetCode Binary Search Tag', url: 'https://leetcode.com/tag/binary-search/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'srch-q1', question: 'What precondition is required for binary search?', options: ['Array must be sorted', 'Array must be unique', 'Array must be non-empty', 'Both sorted and unique'], correctIndex: 0, explanation: 'Binary search requires the search space to be sorted (or at least monotonic). Uniqueness is not required — use left/right boundary for duplicates.' },
    { id: 'srch-q2', question: 'What is the time complexity of linear search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 2, explanation: 'Linear search checks each element sequentially — in the worst case it visits all n elements.' },
    { id: 'srch-q3', question: 'For "find peak element in unsorted array where adjacent are different", the efficient approach is:', options: ['Linear scan O(n)', 'Binary search O(log n)', 'Sort + check O(n log n)', 'Hash map O(n)'], correctIndex: 1, explanation: 'If nums[mid] < nums[mid+1], the peak must be to the right. Binary search exploits this monotonic property — O(log n).' },
    { id: 'srch-q4', question: 'Exponential search is useful for:', options: ['Sorted arrays with known bounds', 'Unbounded sorted arrays', 'Unsorted arrays', 'Hash tables'], correctIndex: 1, explanation: 'Exponential search finds a range [2^k, 2^(k+1)] containing the target in O(log i) steps where i is the target\'s position, then binary searches that range.' },
  ],
  questions: [
    {
      id: 'lc-34',
      title: "Find First and Last Position of Element in Sorted Array",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Binary Search',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["binary-search", "array"],
      problemStatement: "Given a sorted array of integers nums and a target, find the starting and ending position of target. Return [-1,-1] if not found. Must be O(log n).",
      examples: [{"input": "nums = [5,7,7,8,8,10], target = 8", "output": "[3,4]"}, {"input": "nums = [5,7,7,8,8,10], target = 6", "output": "[-1,-1]"}],
      constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9", "nums sorted non-decreasing"],
      hints: ["Two binary searches: one for left boundary, one for right", "Left: find first index where nums[i] >= target"],
      bruteForce: "Linear scan \u2014 O(n).",
      optimizedSolution: "Two binary searches: leftmost and rightmost. O(log n)/O(1).",
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func searchRange(nums []int, target int) []int {
    return []int{findLeft(nums, target), findRight(nums, target)}
}

func findLeft(nums []int, target int) int {
    lo, hi := 0, len(nums)-1
    for lo < hi {
        mid := lo + (hi-lo)/2
        if nums[mid] < target { lo = mid+1 } else { hi = mid }
    }
    if lo < len(nums) && nums[lo] == target { return lo }
    return -1
}

func findRight(nums []int, target int) int {
    lo, hi := 0, len(nums)-1
    for lo < hi {
        mid := lo + (hi-lo)/2 + 1
        if nums[mid] > target { hi = mid-1 } else { lo = mid }
    }
    if lo < len(nums) && nums[lo] == target { return lo }
    return -1
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/"},
      related: ["Binary Search", "Insert Position"],
      dryRun: {
        title: "Find First and Last \u2014 Binary Search",
        input: "nums = [5,7,7,8,8,10], target = 8",
        result: "Result: [3, 4]",
        steps: [
          { line: 3, description: "findLeft: lo=0, hi=5. Find first index where nums[i] >= 8", variables: [{"name": "lo", "value": "0"}, {"name": "hi", "value": "5"}], dataState: "nums = [5, 7, 7, 8, 8, 10]\n       ^lo           ^hi\nLooking for leftmost 8" },
          { line: 8, description: "mid=2. nums[2]=7 < 8. lo=3.", variables: [{"name": "mid", "value": "2"}, {"name": "lo", "value": "3"}, {"name": "hi", "value": "5"}], dataState: "nums = [5, 7, 7, 8, 8, 10]\n             ^lo    ^hi\nmid=2, nums[2]=7 < 8, move lo" },
          { line: 8, description: "mid=4. nums[4]=8 >= 8. hi=4.", variables: [{"name": "mid", "value": "4"}, {"name": "lo", "value": "3"}, {"name": "hi", "value": "4"}], dataState: "nums = [5, 7, 7, 8, 8, 10]\n             ^lo ^hi\nmid=4, nums[4]=8 >= 8, move hi" },
          { line: 8, description: "mid=3. nums[3]=8 >= 8. hi=3. lo==hi. Exit. nums[3]=8. Return 3.", variables: [{"name": "lo", "value": "3"}, {"name": "hi", "value": "3"}, {"name": "left", "value": "3"}], dataState: "nums = [5, 7, 7, 8, 8, 10]\n             ^lo=^hi\nLeft boundary = 3 \u2713" },
          { line: 13, description: "findRight: similar search. Returns 4. Result: [3, 4]", variables: [{"name": "right", "value": "4"}, {"name": "result", "value": "[3,4]"}], dataState: "Right boundary = 4\nResult: [3, 4] \u2713" },
        ],
      },
    },
    {
      id: 'lc-162',
      title: "Find Peak Element",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Binary Search',
      companies: ["Amazon", "Google", "Meta"],
      tags: ["binary-search", "array"],
      problemStatement: "A peak element is an element that is strictly greater than its neighbors. Given an integer array nums, find a peak element and return its index. You may imagine nums[-1] = nums[n] = -inf.",
      examples: [{"input": "nums = [1,2,3,1]", "output": "2"}, {"input": "nums = [1,2,1,3,5,6,4]", "output": "5"}],
      constraints: ["1 <= nums.length <= 1000", "-2^31 <= nums[i] <= 2^31-1"],
      hints: ["Binary search: compare mid with mid+1", "If nums[mid] > nums[mid+1], peak is on left side (including mid)"],
      bruteForce: "Linear scan \u2014 O(n).",
      optimizedSolution: "Binary search: go toward the rising side. O(log n)/O(1).",
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func findPeakElement(nums []int) int {
    lo, hi := 0, len(nums)-1
    for lo < hi {
        mid := lo + (hi-lo)/2
        if nums[mid] > nums[mid+1] {
            hi = mid
        } else {
            lo = mid + 1
        }
    }
    return lo
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/find-peak-element/"},
      related: ["Find Min in Rotated Array", "Peak Index in Mountain"],
      dryRun: {
        title: "Find Peak Element \u2014 Binary Search",
        input: "nums = [1,2,1,3,5,6,4]",
        result: "Peak at index 5 (value 6)",
        steps: [
          { line: 2, description: "Initialize lo=0, hi=6", variables: [{"name": "lo", "value": "0"}, {"name": "hi", "value": "6"}], dataState: "nums = [1, 2, 1, 3, 5, 6, 4]\n       ^lo           ^hi" },
          { line: 5, description: "mid=3. nums[3]=3 > nums[4]=5? No (3 < 5). lo=4.", variables: [{"name": "mid", "value": "3"}, {"name": "lo", "value": "4"}, {"name": "hi", "value": "6"}], dataState: "nums = [1, 2, 1, 3, 5, 6, 4]\n                ^lo    ^hi\nmid=3, 3 < 5, go right" },
          { line: 5, description: "mid=5. nums[5]=6 > nums[6]=4? Yes! hi=5.", variables: [{"name": "mid", "value": "5"}, {"name": "lo", "value": "4"}, {"name": "hi", "value": "5"}], dataState: "nums = [1, 2, 1, 3, 5, 6, 4]\n                ^lo ^hi\nmid=5, 6 > 4, go left" },
          { line: 5, description: "mid=4. nums[4]=5 > nums[5]=6? No. lo=5. lo==hi. Exit.", variables: [{"name": "mid", "value": "4"}, {"name": "lo", "value": "5"}, {"name": "hi", "value": "5"}, {"name": "result", "value": "5"}], dataState: "nums = [1, 2, 1, 3, 5, 6, 4]\n                    ^lo=^hi\nPeak at index 5, value 6 \u2713" },
        ],
      },
    },
  ],
};
