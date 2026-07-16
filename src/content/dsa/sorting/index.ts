import type { TopicContent } from '../../types';

export const sortingContent: TopicContent = {
  slug: 'dsa/sorting', title: 'Sorting', category: 'dsa',
  theory: `# Sorting\n\n## Comparison Sorts\n\n| Algorithm | Best | Average | Worst | Space | Stable |\n|-----------|------|---------|-------|-------|--------|\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |\n| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |\n| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |\n| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |\n| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |\n\n**Lower bound for comparison sorting:** O(n log n)\n\n## Non-Comparison Sorts\n\n- **Counting sort:** O(n+k) — integers in range [0, k]\n- **Radix sort:** O(d(n+k)) — d digits, base k\n- **Bucket sort:** O(n) average — uniformly distributed\n\n## Go\n\n\`\`\`go\nimport "sort"\nsort.Ints(nums)              // ascending\nsort.Sort(sort.Reverse(sort.IntSlice(nums))) // descending\nsort.Slice(arr, func(i, j int) bool { return arr[i].val < arr[j].val })\n\`\`\`\n`,
  examples: `# Sorting — Examples\n\n## Merge Sort\n\n\`\`\`go\nfunc mergeSort(arr []int) []int {\n    if len(arr) <= 1 { return arr }\n    mid := len(arr)/2\n    left  := mergeSort(arr[:mid])\n    right := mergeSort(arr[mid:])\n    return merge(left, right)\n}\nfunc merge(l, r []int) []int {\n    res := make([]int, 0, len(l)+len(r))\n    i, j := 0, 0\n    for i < len(l) && j < len(r) {\n        if l[i] <= r[j] { res = append(res, l[i]); i++ } else { res = append(res, r[j]); j++ }\n    }\n    return append(append(res, l[i:]...), r[j:]...)\n}\n\`\`\`\n\n## Count Sort (small range)\n\n\`\`\`go\nfunc countSort(nums []int, maxVal int) []int {\n    count := make([]int, maxVal+1)\n    for _, v := range nums { count[v]++ }\n    res := make([]int, 0, len(nums))\n    for i, c := range count {\n        for ; c > 0; c-- { res = append(res, i) }\n    }\n    return res\n}\n\`\`\``,
  patterns: `# Sorting Patterns\n\n## 1. Sort + Two Pointer — pair sums, 3sum, container with most water\n## 2. Custom Comparator — sort by frequency, by tuple field, etc.\n## 3. Counting Sort — when values are bounded\n## 4. Partial Sort — top k, quick select O(n) average\n\n\`\`\`go\n// Quick select for kth smallest O(n) average\nfunc kthSmallest(nums []int, k int) int {\n    // partition around pivot, recurse on one half\n    // ...\n}\n\`\`\``,
  interviewTips: `# Interview Tips — Sorting\n\n1. Go's sort.Slice is O(n log n) and is usually the right choice.\n2. For special distributions (small integer range), mention counting sort.\n3. Stability matters when secondary sort order must be preserved.\n4. Quick select (partial sort) gives kth element in O(n) average without full sort.`,
  commonMistakes: `# Common Mistakes — Sorting\n\n1. Sorting when not needed — sometimes hash map or heap is better.\n2. Wrong comparator — ensure strict weak ordering (no equal returns true).\n3. Forgetting stable sort requirement for tied keys.\n4. Using sort when order doesn't matter and just need a count.`,
  revision: `# Sorting — Quick Revision\n\n| Sort | Stable | Best Case | In-Place |\n|------|--------|-----------|----------|\n| Merge | Yes | O(n log n) | No |\n| Quick | No | O(n log n) | Yes |\n| Heap | No | O(n log n) | Yes |\n| Tim (Go) | Yes | O(n) | No |\n`,
  codeExamples: [{ language: 'go', label: 'Merge Sort', code: `func mergeSort(arr []int) []int {
	if len(arr) <= 1 {
		return arr
	}
	mid := len(arr) / 2
	left := mergeSort(arr[:mid])
	right := mergeSort(arr[mid:])
	return mergeSorted(left, right)
}

func mergeSorted(l, r []int) []int {
	res := make([]int, 0, len(l)+len(r))
	i, j := 0, 0
	for i < len(l) && j < len(r) {
		if l[i] <= r[j] { res = append(res, l[i]); i++ } else { res = append(res, r[j]); j++ }
	}
	res = append(res, l[i:]...)
	res = append(res, r[j:]...)
	return res
}` }],
  resources: [
    { title: 'Sorting — GfG', url: 'https://www.geeksforgeeks.org/sorting-algorithms/', type: 'article', free: true },
    { title: 'Sorting Algorithms Visualised', url: 'https://visualgo.net/en/sorting', type: 'article', free: true },
    { title: 'LeetCode Sorting Tag', url: 'https://leetcode.com/tag/sorting/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'srt-q1', question: 'What is the theoretical lower bound for comparison-based sorting?', options: ['O(n)', 'O(n log log n)', 'O(n log n)', 'O(n²)'], correctIndex: 2, explanation: 'Any comparison-based sort requires at least O(n log n) comparisons — proven via decision tree lower bound argument.' },
    { id: 'srt-q2', question: 'Which sorting algorithm is stable and has O(n log n) worst case?', options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Insertion Sort'], correctIndex: 2, explanation: 'Merge sort always divides in half and merges stably — O(n log n) guaranteed. Quick sort is O(n²) worst case, Heap sort is not stable.' },
    { id: 'srt-q3', question: 'Counting sort runs in what time complexity?', options: ['O(n log n)', 'O(n²)', 'O(n+k) where k is value range', 'O(n)'], correctIndex: 2, explanation: 'Counting sort creates a count array of size k, counts occurrences, then reconstructs. O(n) to count + O(k) to output = O(n+k).' },
    { id: 'srt-q4', question: 'Go\'s built-in sort package uses which algorithm?', options: ['Pure quicksort', 'Pure mergesort', 'Timsort (hybrid)', 'Heapsort'], correctIndex: 2, explanation: 'Go\'s sort uses Pdqsort (pattern-defeating quicksort), a hybrid of quicksort, heapsort, and insertion sort. It is not stable — use slices.SortStableFunc for stable.' },
  ],
  questions: [
    {
      id: 'lc-912',
      title: "Sort an Array",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Merge Sort',
      companies: ["Amazon", "Google", "Microsoft"],
      tags: ["sorting", "merge-sort", "recursion"],
      problemStatement: "Given an array of integers nums, sort the array in ascending order and return it. You must solve without using any built-in sort.",
      examples: [{"input": "nums = [5,2,3,1]", "output": "[1,2,3,5]"}, {"input": "nums = [5,1,1,2,0,0]", "output": "[0,0,1,1,2,5]"}],
      constraints: ["-5*10^4 <= nums[i] <= 5*10^4"],
      hints: ["Merge sort: divide array in half, sort each, merge", "Or quick sort with random pivot"],
      bruteForce: "Bubble sort \u2014 O(n^2).",
      optimizedSolution: "Merge sort: O(n log n)/O(n).",
      timeComplexity: 'O(n log n)',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func sortArray(nums []int) []int {
    if len(nums) <= 1 { return nums }
    mid := len(nums) / 2
    left := sortArray(nums[:mid])
    right := sortArray(nums[mid:])
    return merge(left, right)
}

func merge(a, b []int) []int {
    result := make([]int, 0, len(a)+len(b))
    i, j := 0, 0
    for i < len(a) && j < len(b) {
        if a[i] <= b[j] {
            result = append(result, a[i]); i++
        } else {
            result = append(result, b[j]); j++
        }
    }
    result = append(result, a[i:]...)
    result = append(result, b[j:]...)
    return result
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/sort-an-array/"},
      related: ["Sort Colors", "Kth Largest"],
      dryRun: {
        title: "Sort an Array \u2014 Merge Sort",
        input: "nums = [5,2,3,1]",
        result: "Result: [1,2,3,5]",
        steps: [
          { line: 2, description: "Split [5,2,3,1] into [5,2] and [3,1]", variables: [{"name": "left", "value": "[5,2]"}, {"name": "right", "value": "[3,1]"}], dataState: "Split: [5, 2, 3, 1]\n         [5, 2]  [3, 1]" },
          { line: 3, description: "Sort left [5,2] \u2192 split [5] [2] \u2192 merge \u2192 [2,5]", variables: [{"name": "left", "value": "[2,5]"}], dataState: "[5,2] \u2192 [5] [2] \u2192 merge \u2192 [2, 5]" },
          { line: 4, description: "Sort right [3,1] \u2192 split [3] [1] \u2192 merge \u2192 [1,3]", variables: [{"name": "right", "value": "[1,3]"}], dataState: "[3,1] \u2192 [3] [1] \u2192 merge \u2192 [1, 3]" },
          { line: 5, description: "Merge [2,5] and [1,3]: compare 2 vs 1 \u2192 pick 1. Compare 2 vs 3 \u2192 pick 2. Compare 5 vs 3 \u2192 pick 3. Remaining: 5.", variables: [{"name": "merged", "value": "[1,2,3,5]"}], dataState: "Merge [2,5] + [1,3]:\n  1 < 2 \u2192 pick 1\n  2 < 3 \u2192 pick 2\n  3 < 5 \u2192 pick 3\n  remaining: 5\nResult: [1, 2, 3, 5] \u2713" },
        ],
      },
    },
    {
      id: 'lc-75',
      title: "Sort Colors",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Dutch National Flag',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["sorting", "three-pointers", "array"],
      problemStatement: "Given an array nums with objects colored red (0), white (1), or blue (2), sort them in-place so same colors are adjacent, in order red, white, blue. Do not use built-in sort.",
      examples: [{"input": "nums = [2,0,2,1,1,0]", "output": "[0,0,1,1,2,2]"}],
      constraints: ["n == nums.length", "1 <= n <= 300", "nums[i] is 0, 1, or 2"],
      hints: ["Three pointers: low, mid, high", "0 goes to low, 2 goes to high, 1 stays in middle"],
      bruteForce: "Count sort with two passes \u2014 O(n) but two passes.",
      optimizedSolution: "Dutch flag: one pass, three pointers. O(n)/O(1).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func sortColors(nums []int) {
    low, mid, high := 0, 0, len(nums)-1
    for mid <= high {
        if nums[mid] == 0 {
            nums[low], nums[mid] = nums[mid], nums[low]
            low++; mid++
        } else if nums[mid] == 1 {
            mid++
        } else {
            nums[mid], nums[high] = nums[high], nums[mid]
            high--
        }
    }
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/sort-colors/"},
      related: ["Sort an Array", "Kth Largest"],
      dryRun: {
        title: "Sort Colors \u2014 Dutch National Flag",
        input: "nums = [2,0,2,1,1,0]",
        result: "Result: [0,0,1,1,2,2]",
        steps: [
          { line: 2, description: "Initialize low=0, mid=0, high=5", variables: [{"name": "low", "value": "0"}, {"name": "mid", "value": "0"}, {"name": "high", "value": "5"}], dataState: "nums = [2, 0, 2, 1, 1, 0]\n       ^mid          ^high\n       ^low" },
          { line: 5, description: "mid=0: nums[0]=2. Swap with high: [0,0,2,1,1,2]. high=4.", variables: [{"name": "mid", "value": "0"}, {"name": "high", "value": "4"}], dataState: "nums = [0, 0, 2, 1, 1, 2]\n       ^mid       ^high\n Swapped 2 to end" },
          { line: 4, description: "mid=0: nums[0]=0. Swap low,mid: no change. low=1,mid=1.", variables: [{"name": "low", "value": "1"}, {"name": "mid", "value": "1"}], dataState: "nums = [0, 0, 2, 1, 1, 2]\n          ^mid    ^high\n   ^low\n 0 in place" },
          { line: 4, description: "mid=1: nums[1]=0. Swap low,mid: no change. low=2,mid=2.", variables: [{"name": "low", "value": "2"}, {"name": "mid", "value": "2"}], dataState: "nums = [0, 0, 2, 1, 1, 2]\n             ^mid ^high\n             ^low\n 0 in place" },
          { line: 5, description: "mid=2: nums[2]=2. Swap with high: [0,0,1,1,2,2]. high=3.", variables: [{"name": "mid", "value": "2"}, {"name": "high", "value": "3"}], dataState: "nums = [0, 0, 1, 1, 2, 2]\n             ^mid\n             ^low  ^high\n Swapped 2 to end" },
          { line: 6, description: "mid=2: nums[2]=1. mid=3. mid=3: nums[3]=1. mid=4 > high=3. Done!", variables: [{"name": "mid", "value": "4"}, {"name": "high", "value": "3"}, {"name": "result", "value": "[0,0,1,1,2,2]"}], dataState: "nums = [0, 0, 1, 1, 2, 2]\nDONE! \u2713" },
        ],
      },
    },
  ],
};
