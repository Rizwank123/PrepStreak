import type { TopicContent } from '../../types';

export const monotonicStackContent: TopicContent = {
  slug: 'dsa/monotonic-stack', title: 'Monotonic Stack', category: 'dsa',
  theory: `# Monotonic Stack\n\nA stack where elements are always in strictly increasing or decreasing order. Pop elements when the invariant would be violated — those elements "found their answer".\n\n## Increasing Monotonic Stack\n\nPop when current element is **smaller** than top. Use for: **next smaller element**, **largest rectangle in histogram**.\n\n## Decreasing Monotonic Stack\n\nPop when current element is **larger** than top. Use for: **next greater element**, **daily temperatures**.\n\n## Template (Next Greater)\n\n\`\`\`go\nresult := make([]int, len(nums))\nstack := []int{} // indices\nfor i, v := range nums {\n    for len(stack) > 0 && nums[stack[len(stack)-1]] < v {\n        idx := stack[len(stack)-1]; stack = stack[:len(stack)-1]\n        result[idx] = v // v is the next greater for nums[idx]\n    }\n    stack = append(stack, i)\n}\n// remaining in stack have no next greater element\n\`\`\`\n\n## Complexity: O(n) — each element pushed and popped at most once\n`,
  examples: `# Monotonic Stack — Examples\n\n## Daily Temperatures\n\n\`\`\`go\nfunc dailyTemperatures(temps []int) []int {\n    res := make([]int, len(temps))\n    stack := []int{} // indices\n    for i, t := range temps {\n        for len(stack) > 0 && temps[stack[len(stack)-1]] < t {\n            j := stack[len(stack)-1]; stack = stack[:len(stack)-1]\n            res[j] = i - j\n        }\n        stack = append(stack, i)\n    }\n    return res\n}\n\`\`\`\n\n## Largest Rectangle in Histogram\n\n\`\`\`go\nfunc largestRectangleArea(heights []int) int {\n    heights = append(heights, 0) // sentinel\n    stack := []int{-1}\n    best := 0\n    for i, h := range heights {\n        for len(stack) > 1 && heights[stack[len(stack)-1]] > h {\n            height := heights[stack[len(stack)-1]]; stack = stack[:len(stack)-1]\n            width := i - stack[len(stack)-1] - 1\n            if area := height * width; area > best { best = area }\n        }\n        stack = append(stack, i)\n    }\n    return best\n}\n\`\`\``,
  patterns: `# Monotonic Stack Patterns\n\n## 1. Next Greater Element — decreasing stack; pop when curr > top\n## 2. Next Smaller Element — increasing stack; pop when curr < top\n## 3. Previous Greater/Smaller — look at stack top before pushing\n## 4. Largest Rectangle — pop on shorter bar, compute areas\n## 5. Trapping Rain Water — monotonic with left_max/right_max`,
  interviewTips: `# Interview Tips — Monotonic Stack\n\n1. Store **indices**, not values — you need the position to compute width/distance.\n2. Add a **sentinel** (e.g., 0 at end, -1 at start) to flush the stack cleanly.\n3. Increasing vs decreasing: think about what "next event" you're looking for.\n4. Monotonic stack solves O(n²) brute-force problems in O(n).`,
  commonMistakes: `# Common Mistakes — Monotonic Stack\n\n1. Storing values instead of indices — can't compute width/distance.\n2. Wrong direction — increasing stack for "next greater" instead of decreasing.\n3. Not flushing remaining stack elements — may miss valid answers.\n4. Not adding sentinel — makes edge cases complex.`,
  revision: `# Monotonic Stack — Quick Revision\n\n| Problem | Stack Type | Pop When |\n|---------|-----------|----------|\n| Next Greater Element | Decreasing | curr > top |\n| Daily Temperatures | Decreasing | curr > top |\n| Next Smaller Element | Increasing | curr < top |\n| Largest Rectangle | Increasing | curr < top |\n| Trapping Rain Water | Decreasing | curr > top |\n`,
  codeExamples: [{ language: 'go', label: 'Daily Temperatures', code: `func dailyTemperatures(temps []int) []int {
	res := make([]int, len(temps))
	stack := []int{} // stores indices
	for i, t := range temps {
		for len(stack) > 0 && temps[stack[len(stack)-1]] < t {
			j := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			res[j] = i - j
		}
		stack = append(stack, i)
	}
	return res
}` }],
  resources: [
    { title: 'Monotonic Stack — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Monotonic Stack — GfG', url: 'https://www.geeksforgeeks.org/introduction-to-monotonic-stack-2/', type: 'article', free: true },
    { title: 'LeetCode Monotonic Stack Tag', url: 'https://leetcode.com/tag/monotonic-stack/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'ms-q1', question: 'For "Next Greater Element", you pop from the stack when:', options: ['Current element < top', 'Current element > top', 'Stack is empty', 'Current element == top'], correctIndex: 1, explanation: 'The current element IS the next greater element for everything in the stack that is smaller than it. Pop those indices and record the answer.' },
    { id: 'ms-q2', question: 'Why store indices instead of values in a monotonic stack?', options: ['Saves memory', 'Needed to compute distances and widths', 'Values are not integers', 'Required by Go'], correctIndex: 1, explanation: 'Problems like Daily Temperatures (waiting days) and Largest Rectangle (width) require the position/index, not just the value.' },
    { id: 'ms-q3', question: 'What is the time complexity of monotonic stack solutions?', options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(n × k)'], correctIndex: 2, explanation: 'Each element is pushed exactly once and popped at most once — O(2n) = O(n) total operations.' },
    { id: 'ms-q4', question: 'For "Largest Rectangle in Histogram", a sentinel value of 0 is appended to the end. Why?', options: ['Required by the algorithm', 'Ensures all remaining stack elements are processed after the loop', 'Handles empty histogram', 'Prevents negative areas'], correctIndex: 1, explanation: 'The sentinel height 0 is smaller than all bars, triggering the pop loop for every remaining stack element and processing their areas before the loop ends.' },
  ],
  questions: [
    {
      id: 'lc-739',
      title: "Daily Temperatures",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Monotonic Stack',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["monotonic-stack", "array"],
      problemStatement: "Given an array of daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after day i to get a warmer temperature. If none, put 0.",
      examples: [{"input": "temperatures = [73,74,75,71,69,72,76,73]", "output": "[1,1,4,2,1,1,0,0]"}],
      constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
      hints: ["Use a monotonic decreasing stack of indices", "When a warmer day is found, pop and calculate the difference"],
      bruteForce: "For each day, scan forward \u2014 O(n^2).",
      optimizedSolution: "Monotonic decreasing stack. O(n)/O(n).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func dailyTemperatures(temps []int) []int {
    n := len(temps)
    result := make([]int, n)
    var stack []int
    for i := 0; i < n; i++ {
        for len(stack) > 0 && temps[i] > temps[stack[len(stack)-1]] {
            top := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            result[top] = i - top
        }
        stack = append(stack, i)
    }
    return result
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/daily-temperatures/"},
      related: ["Next Greater Element I", "Largest Rectangle"],
      dryRun: {
        title: "Daily Temperatures \u2014 Monotonic Stack",
        input: "temps = [73,74,75,71,69,72,76,73]",
        result: "Result: [1,1,4,2,1,1,0,0]",
        steps: [
          { line: 4, description: "Initialize empty stack. Push index 0 (temp=73).", variables: [{"name": "stack", "value": "[0]"}], dataState: "temps = [73, 74, 75, 71, 69, 72, 76, 73]\n          ^\nstack = [0 (73)]\n(Descending: 73)" },
          { line: 6, description: "i=1, temp=74 > 73. Pop 0. result[0] = 1-0 = 1. Push 1.", variables: [{"name": "stack", "value": "[1]"}, {"name": "result", "value": "[1,0,0,0,0,0,0,0]"}], dataState: "temps = [73, 74, 75, 71, 69, 72, 76, 73]\n              ^\n74 > 73, pop 0 \u2192 result[0]=1\nstack = [1 (74)]" },
          { line: 6, description: "i=2, temp=75 > 74. Pop 1. result[1] = 2-1 = 1. Push 2.", variables: [{"name": "stack", "value": "[2]"}, {"name": "result", "value": "[1,1,0,0,0,0,0,0]"}], dataState: "temps = [73, 74, 75, 71, 69, 72, 76, 73]\n                   ^\n75 > 74, pop 1 \u2192 result[1]=1\nstack = [2 (75)]" },
          { line: 6, description: "i=3, temp=71 < 75. Push 3. i=4, temp=69 < 71. Push 4.", variables: [{"name": "stack", "value": "[2,3,4]"}], dataState: "temps = [73, 74, 75, 71, 69, 72, 76, 73]\n                            ^\n71 < 75, push 3\n69 < 71, push 4\nstack = [2(75), 3(71), 4(69)]" },
          { line: 6, description: "i=5, temp=72 > 69. Pop 4. result[4]=5-4=1. 72 > 71. Pop 3. result[3]=5-3=2. 72 < 75. Push 5.", variables: [{"name": "stack", "value": "[2,5]"}, {"name": "result", "value": "[1,1,0,2,1,0,0,0]"}], dataState: "temps = [73, 74, 75, 71, 69, 72, 76, 73]\n                                ^\n72 > 69, pop 4 \u2192 result[4]=1\n72 > 71, pop 3 \u2192 result[3]=2\n72 < 75, push 5\nstack = [2(75), 5(72)]" },
          { line: 6, description: "i=6, temp=76 > 72. Pop 5. result[5]=6-5=1. 76 > 75. Pop 2. result[2]=6-2=4. Push 6.", variables: [{"name": "stack", "value": "[6]"}, {"name": "result", "value": "[1,1,4,2,1,1,0,0]"}], dataState: "temps = [73, 74, 75, 71, 69, 72, 76, 73]\n                                     ^\n76 > 72, pop 5 \u2192 result[5]=1\n76 > 75, pop 2 \u2192 result[2]=4\nstack = [6 (76)]" },
          { line: 8, description: "i=7, temp=73 < 76. Push 7. Loop ends. result[6],result[7] stay 0.", variables: [{"name": "result", "value": "[1,1,4,2,1,1,0,0]"}], dataState: "temps = [73, 74, 75, 71, 69, 72, 76, 73]\n                                          ^\n73 < 76, push 7\nNo warmer day for 6,7 \u2192 0\nResult: [1,1,4,2,1,1,0,0] \u2713" },
        ],
      },
    },
    {
      id: 'lc-496',
      title: "Next Greater Element I",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Monotonic Stack',
      companies: ["Amazon", "Google", "Microsoft"],
      tags: ["monotonic-stack", "hash-map"],
      problemStatement: "Given two arrays nums1 (subset) and nums2 (superset), for each element in nums1, find the next greater element in nums2. Return -1 if none.",
      examples: [{"input": "nums1 = [4,1,2], nums2 = [1,3,4,2]", "output": "[-1,3,-1]"}],
      constraints: ["1 <= nums1.length <= nums2.length <= 1000", "All values unique"],
      hints: ["Build next greater map for nums2 using monotonic stack", "Look up each nums1 element in the map"],
      bruteForce: "For each nums1 element, scan nums2 \u2014 O(n*m).",
      optimizedSolution: "Monotonic stack on nums2 + hash map. O(n+m)/O(n).",
      timeComplexity: 'O(n+m)',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func nextGreaterElement(nums1, nums2 []int) []int {
    nextGreater := make(map[int]int)
    var stack []int
    for _, n := range nums2 {
        for len(stack) > 0 && n > stack[len(stack)-1] {
            top := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            nextGreater[top] = n
        }
        stack = append(stack, n)
    }
    result := make([]int, len(nums1))
    for i, n := range nums1 {
        if v, ok := nextGreater[n]; ok {
            result[i] = v
        } else {
            result[i] = -1
        }
    }
    return result
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/next-greater-element-i/"},
      related: ["Next Greater Element II", "Daily Temperatures"],
      dryRun: {
        title: "Next Greater Element I \u2014 Monotonic Stack + Map",
        input: "nums1 = [4,1,2], nums2 = [1,3,4,2]",
        result: "Result: [-1, 3, -1]",
        steps: [
          { line: 4, description: "Process nums2=[1,3,4,2]. Push 1.", variables: [{"name": "stack", "value": "[1]"}, {"name": "map", "value": "{}"}], dataState: "nums2 = [1, 3, 4, 2]\n          ^\nstack = [1]" },
          { line: 6, description: "n=3 > 1. Pop 1. map[1]=3. Push 3.", variables: [{"name": "stack", "value": "[3]"}, {"name": "map", "value": "{1:3}"}], dataState: "nums2 = [1, 3, 4, 2]\n             ^\n3 > 1, pop \u2192 map[1]=3\nstack = [3]" },
          { line: 6, description: "n=4 > 3. Pop 3. map[3]=4. Push 4.", variables: [{"name": "stack", "value": "[4]"}, {"name": "map", "value": "{1:3, 3:4}"}], dataState: "nums2 = [1, 3, 4, 2]\n                ^\n4 > 3, pop \u2192 map[3]=4\nstack = [4]" },
          { line: 6, description: "n=2 < 4. Push 2. Stack=[4,2]. No more elements.", variables: [{"name": "stack", "value": "[4,2]"}, {"name": "map", "value": "{1:3, 3:4}"}], dataState: "nums2 = [1, 3, 4, 2]\n                   ^\n2 < 4, push 2\nstack = [4, 2]\n(4,2 have no next greater)" },
          { line: 12, description: "Look up nums1=[4,1,2]: map[4]=none\u2192-1, map[1]=3, map[2]=none\u2192-1", variables: [{"name": "result", "value": "[-1, 3, -1]"}], dataState: "nums1[0]=4: not in map \u2192 -1\nnums1[1]=1: map[1] = 3\nnums1[2]=2: not in map \u2192 -1\nResult: [-1, 3, -1] \u2713" },
        ],
      },
    },
  ],
};
