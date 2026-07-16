import type { TopicContent } from '../../types';

export const twoPointerContent: TopicContent = {
  slug: 'dsa/two-pointer',
  title: 'Two Pointer',
  category: 'dsa',
  theory: `# Two Pointer

## Core Idea

Place two pointers (indices) at different positions and move them based on a condition. Eliminates the need for a nested loop, reducing O(n²) to O(n).

## Variants

**Opposite ends** — start left=0, right=n-1, converge inward.
\`\`\`go
left, right := 0, len(arr)-1
for left < right {
    // process arr[left] and arr[right]
    if condition { left++ } else { right-- }
}
\`\`\`

**Same direction (fast/slow)** — detect cycles, remove duplicates.
\`\`\`go
slow := 0
for fast := 0; fast < len(arr); fast++ {
    if arr[fast] != arr[slow] {
        slow++
        arr[slow] = arr[fast]
    }
}
\`\`\`

## When to Use

- Sorted array + pair/triplet sum
- Palindrome validation
- Container with most water
- Partition by condition
- Remove duplicates in-place

## Complexity

| | Time | Space |
|-|------|-------|
| Opposite ends | O(n) | O(1) |
| Fast/slow | O(n) | O(1) |
`,

  examples: `# Two Pointer — Examples

## 3Sum

Find all unique triplets summing to zero.

\`\`\`go
func threeSum(nums []int) [][]int {
    sort.Ints(nums)
    var res [][]int
    for i := 0; i < len(nums)-2; i++ {
        if i > 0 && nums[i] == nums[i-1] { continue }
        l, r := i+1, len(nums)-1
        for l < r {
            sum := nums[i] + nums[l] + nums[r]
            if sum == 0 {
                res = append(res, []int{nums[i], nums[l], nums[r]})
                for l < r && nums[l] == nums[l+1] { l++ }
                for l < r && nums[r] == nums[r-1] { r-- }
                l++; r--
            } else if sum < 0 { l++ } else { r-- }
        }
    }
    return res
}
\`\`\`

## Container With Most Water

\`\`\`go
func maxArea(height []int) int {
    l, r, best := 0, len(height)-1, 0
    for l < r {
        h := min(height[l], height[r])
        if area := h * (r - l); area > best { best = area }
        if height[l] < height[r] { l++ } else { r-- }
    }
    return best
}
\`\`\`
`,

  patterns: `# Two Pointer Patterns

## Pattern 1: Pair Sum in Sorted Array
Sort → place pointers at ends → move based on sum vs target.

## Pattern 2: Remove Duplicates
Slow pointer tracks write position; fast scans and writes unique values.

## Pattern 3: Valid Palindrome
Compare chars at both ends, skip non-alphanumeric.

## Pattern 4: Trapping Rain Water
Track left_max and right_max; water = min(left_max, right_max) - height[i].

\`\`\`go
func trap(height []int) int {
    l, r := 0, len(height)-1
    lMax, rMax, water := 0, 0, 0
    for l < r {
        if height[l] <= height[r] {
            if height[l] >= lMax { lMax = height[l] } else { water += lMax - height[l] }
            l++
        } else {
            if height[r] >= rMax { rMax = height[r] } else { water += rMax - height[r] }
            r--
        }
    }
    return water
}
\`\`\`
`,

  interviewTips: `# Interview Tips — Two Pointer

1. Ask: **Is the array sorted?** Two pointer on unsorted arrays usually requires sorting first.
2. Choose the variant: **opposite ends** for pair sums, **fast/slow** for duplicates/cycles.
3. Handle **duplicate skipping** explicitly in 3Sum-style problems.
4. For trapping water / container problems, think about which pointer to move (move the **smaller** one).
5. State why this beats brute force: "Sorting is O(n log n) then one pass O(n), vs O(n²) brute."
`,

  commonMistakes: `# Common Mistakes — Two Pointer

1. Using two pointer on an **unsorted** array without sorting first.
2. **Not skipping duplicates** in 3Sum — produces duplicate triplets.
3. Using \`left < right - 1\` instead of \`left < right\` — misses the two-element case.
4. Moving both pointers at once when only one should move.
5. Forgetting to check bounds when accessing \`arr[left+1]\` or \`arr[right-1]\`.
`,

  revision: `# Two Pointer — Quick Revision

| Problem | Variant | Complexity |
|---------|---------|-----------|
| Pair sum (sorted) | Opposite ends | O(n) / O(1) |
| 3Sum | Sort + two pointer | O(n²) / O(1) |
| Remove duplicates | Fast/slow | O(n) / O(1) |
| Container most water | Opposite ends | O(n) / O(1) |
| Trapping rain water | Opposite ends | O(n) / O(1) |
| Valid palindrome | Opposite ends | O(n) / O(1) |
`,

  codeExamples: [
    {
      language: 'go',
      label: '3Sum',
      code: `func threeSum(nums []int) [][]int {
	sort.Ints(nums)
	var res [][]int
	for i := 0; i < len(nums)-2; i++ {
		if i > 0 && nums[i] == nums[i-1] {
			continue
		}
		l, r := i+1, len(nums)-1
		for l < r {
			sum := nums[i] + nums[l] + nums[r]
			if sum == 0 {
				res = append(res, []int{nums[i], nums[l], nums[r]})
				for l < r && nums[l] == nums[l+1] { l++ }
				for l < r && nums[r] == nums[r-1] { r-- }
				l++; r--
			} else if sum < 0 {
				l++
			} else {
				r--
			}
		}
	}
	return res
}`,
    },
  ],

  resources: [
    { title: 'Two Pointer — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Two Pointer Technique — GfG', url: 'https://www.geeksforgeeks.org/two-pointers-technique/', type: 'article', free: true },
    { title: 'LeetCode Two Pointers Tag', url: 'https://leetcode.com/tag/two-pointers/', type: 'docs', free: true },
  ],

  quiz: [
    {
      id: 'tp-q1',
      question: 'What precondition is usually required before applying the opposite-ends two pointer for pair sum?',
      options: ['Array must be reversed', 'Array must be sorted', 'Array must have no duplicates', 'Array must have even length'],
      correctIndex: 1,
      explanation: 'Sorting lets you decide which pointer to move: if sum < target, move left right; if sum > target, move right left.',
    },
    {
      id: 'tp-q2',
      question: 'In the Container with Most Water problem, when heights[left] < heights[right], which pointer should you move?',
      options: ['right', 'left', 'both', 'neither'],
      correctIndex: 1,
      explanation: 'The area is limited by the shorter side. Moving the shorter pointer gives a chance of finding a taller one and increasing area.',
    },
    {
      id: 'tp-q3',
      question: 'What is the time complexity of 3Sum using sort + two pointer?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
      correctIndex: 2,
      explanation: 'Outer loop O(n) × inner two pointer O(n) = O(n²). Sorting is O(n log n) which is dominated.',
    },
    {
      id: 'tp-q4',
      question: 'In the fast/slow pointer pattern for removing duplicates, what does the slow pointer track?',
      options: ['The end of duplicates', 'The next write position', 'The start of the array', 'The current read position'],
      correctIndex: 1,
      explanation: 'Slow pointer marks where the next unique element should be written. Fast pointer scans for unique values.',
    },
  ],

  questions: [
    {
      id: 'lc-283',
      title: "Move Zeroes",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Two Pointers',
      companies: ["Amazon", "Meta", "Microsoft"],
      tags: ["two-pointer", "array"],
      problemStatement: "Given an integer array nums, move all 0s to the end while maintaining the relative order of non-zero elements. Do this in-place without making a copy.",
      examples: [{"input": "nums = [0,1,0,3,12]", "output": "[1,3,12,0,0]"}],
      constraints: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
      hints: ["Use a write pointer for the next non-zero position", "Swap non-zero elements to the front"],
      bruteForce: "Copy to new array \u2014 O(n) space.",
      optimizedSolution: "Two pointers: write pointer swaps non-zeros forward. O(n)/O(1).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func moveZeroes(nums []int) {
    write := 0
    for read := 0; read < len(nums); read++ {
        if nums[read] != 0 {
            nums[write], nums[read] = nums[read], nums[write]
            write++
        }
    }
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/move-zeroes/"},
      related: ["Remove Duplicates", "Sort Colors"],
      dryRun: {
        title: "Move Zeroes \u2014 Two Pointer In-place",
        input: "nums = [0,1,0,3,12]",
        result: "Result: [1,3,12,0,0]",
        steps: [
          { line: 2, description: "Initialize write = 0", variables: [{"name": "write", "value": "0"}], dataState: "nums = [0, 1, 0, 3, 12]\n     ^write\n      ^read" },
          { line: 4, description: "read=0: nums[0]=0. Skip (is zero).", variables: [{"name": "read", "value": "0"}, {"name": "write", "value": "0"}], dataState: "nums = [0, 1, 0, 3, 12]\n     ^write=^read\n 0 is zero, skip" },
          { line: 4, description: "read=1: nums[1]=1 != 0. Swap(0,1) \u2192 [1,0,0,3,12]. write=1.", variables: [{"name": "read", "value": "1"}, {"name": "write", "value": "1"}], dataState: "nums = [1, 0, 0, 3, 12]\n        ^write\n           ^read\n Swapped 1 to front" },
          { line: 4, description: "read=2: nums[2]=0. Skip.", variables: [{"name": "read", "value": "2"}, {"name": "write", "value": "1"}], dataState: "nums = [1, 0, 0, 3, 12]\n        ^write\n              ^read\n 0 is zero, skip" },
          { line: 4, description: "read=3: nums[3]=3 != 0. Swap(1,3) \u2192 [1,3,0,0,12]. write=2.", variables: [{"name": "read", "value": "3"}, {"name": "write", "value": "2"}], dataState: "nums = [1, 3, 0, 0, 12]\n           ^write\n                 ^read\n Swapped 3 forward" },
          { line: 4, description: "read=4: nums[4]=12 != 0. Swap(2,4) \u2192 [1,3,12,0,0]. write=3.", variables: [{"name": "read", "value": "4"}, {"name": "write", "value": "3"}, {"name": "result", "value": "[1,3,12,0,0]"}], dataState: "nums = [1, 3, 12, 0, 0]\n               ^write\n                     ^read\n Swapped 12 forward\n DONE! \u2713" },
        ],
      },
    },
    {
      id: 'lc-15',
      title: "3Sum",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Two Pointers',
      companies: ["Amazon", "Google", "Meta", "Microsoft", "Apple"],
      tags: ["two-pointer", "sorting", "array"],
      problemStatement: "Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that they sum to 0. The solution set must not contain duplicate triplets.",
      examples: [{"input": "nums = [-1,0,1,2,-1,-4]", "output": "[[-1,-1,2],[-1,0,1]]"}],
      constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
      hints: ["Sort the array first", "Fix one element, use two pointers for the other two", "Skip duplicates"],
      bruteForce: "Check all triplets \u2014 O(n^3).",
      optimizedSolution: "Sort + two pointers. O(n^2)/O(1) extra.",
      timeComplexity: 'O(n^2)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func threeSum(nums []int) [][]int {
    sort.Ints(nums)
    var result [][]int
    for i := 0; i < len(nums)-2; i++ {
        if i > 0 && nums[i] == nums[i-1] { continue }
        left, right := i+1, len(nums)-1
        for left < right {
            sum := nums[i] + nums[left] + nums[right]
            if sum == 0 {
                result = append(result, []int{nums[i], nums[left], nums[right]})
                for left < right && nums[left] == nums[left+1] { left++ }
                for left < right && nums[right] == nums[right-1] { right-- }
                left++; right--
            } else if sum < 0 {
                left++
            } else {
                right--
            }
        }
    }
    return result
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/3sum/"},
      related: ["Two Sum", "4Sum", "3Sum Closest"],
      dryRun: {
        title: "3Sum \u2014 Sort + Two Pointers",
        input: "nums = [-1,0,1,2,-1,-4]",
        result: "Result: [[-1,-1,2],[-1,0,1]]",
        steps: [
          { line: 2, description: "Sort: nums = [-4,-1,-1,0,1,2]", variables: [{"name": "sorted", "value": "[-4,-1,-1,0,1,2]"}], dataState: "Sorted: [-4, -1, -1, 0, 1, 2]" },
          { line: 5, description: "i=0, nums[i]=-4. left=1, right=5. sum=-4+(-1)+2=-3 < 0. left++.", variables: [{"name": "i", "value": "0"}, {"name": "left", "value": "1"}, {"name": "right", "value": "5"}, {"name": "sum", "value": "-3"}], dataState: "[-4, -1, -1, 0, 1, 2]\n  ^i  ^left        ^right\n sum = -4+(-1)+2 = -3 < 0, left++" },
          { line: 5, description: "left=2,right=5. sum=-4+(-1)+2=-3 < 0. left++. left=3,right=5. sum=-4+0+2=-2 < 0. left++. left=4,right=5. sum=-4+1+2=-1 < 0. left++. left=5, loop ends.", variables: [{"name": "i", "value": "0"}], dataState: "[-4, -1, -1, 0, 1, 2]\n  ^i             ^left=^right\n No triplet for -4" },
          { line: 5, description: "i=1, nums[i]=-1. left=2, right=5. sum=-1+(-1)+2=0! Triplet [-1,-1,2]!", variables: [{"name": "i", "value": "1"}, {"name": "left", "value": "2"}, {"name": "right", "value": "5"}, {"name": "sum", "value": "0"}, {"name": "result", "value": "[[-1,-1,2]]"}], dataState: "[-4, -1, -1, 0, 1, 2]\n      ^i  ^left     ^right\n sum = -1+(-1)+2 = 0 \u2713\n FOUND: [-1, -1, 2]!" },
          { line: 5, description: "Skip duplicates. left=3, right=4. sum=-1+0+1=0! Triplet [-1,0,1]!", variables: [{"name": "left", "value": "3"}, {"name": "right", "value": "4"}, {"name": "sum", "value": "0"}, {"name": "result", "value": "[[-1,-1,2],[-1,0,1]]"}], dataState: "[-4, -1, -1, 0, 1, 2]\n      ^i       ^left ^right\n sum = -1+0+1 = 0 \u2713\n FOUND: [-1, 0, 1]!" },
          { line: 5, description: "i=2: nums[2]=-1 == nums[1]. Skip duplicate. i=3: no more triplets.", variables: [{"name": "result", "value": "[[-1,-1,2],[-1,0,1]]"}], dataState: "Skip duplicate at i=2\nResult: [[-1,-1,2], [-1,0,1]] \u2713" },
        ],
      },
    },
  ],
};
