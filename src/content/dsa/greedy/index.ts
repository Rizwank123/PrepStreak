import type { TopicContent } from '../../types';

export const greedyContent: TopicContent = {
  slug: 'dsa/greedy', title: 'Greedy', category: 'dsa',
  theory: `# Greedy Algorithms\n\nMake the locally optimal choice at each step, hoping it leads to a globally optimal solution.\n\n## When Greedy Works\n\nGreedy is correct when the problem has **greedy choice property** — a local optimal choice leads to a global optimum. Prove with **exchange argument**: assume an optimal solution differs from greedy; show that swapping to the greedy choice doesn't worsen it.\n\n## When Greedy Fails\n\n0/1 Knapsack: you can't always take the highest ratio item (items don't fit together). Use DP instead.\n\n## Common Greedy Algorithms\n\n| Problem | Greedy Choice |\n|---------|---------------|\n| Activity selection | Earliest finish time |\n| Interval scheduling | Earliest deadline |\n| Huffman coding | Two smallest frequencies |\n| Kruskal's MST | Shortest edge not creating cycle |\n| Dijkstra | Nearest unvisited node |\n| Fractional knapsack | Highest value/weight ratio |\n`,
  examples: `# Greedy — Examples\n\n## Jump Game\n\n\`\`\`go\nfunc canJump(nums []int) bool {\n    reach := 0\n    for i, v := range nums {\n        if i > reach { return false }\n        if i+v > reach { reach = i+v }\n    }\n    return true\n}\n\`\`\`\n\n## Merge Intervals\n\n\`\`\`go\nfunc merge(intervals [][]int) [][]int {\n    sort.Slice(intervals, func(i, j int) bool { return intervals[i][0] < intervals[j][0] })\n    res := [][]int{intervals[0]}\n    for _, iv := range intervals[1:] {\n        last := res[len(res)-1]\n        if iv[0] <= last[1] {\n            if iv[1] > last[1] { last[1] = iv[1] }\n        } else {\n            res = append(res, iv)\n        }\n    }\n    return res\n}\n\`\`\``,
  patterns: `# Greedy Patterns\n\n## 1. Interval Scheduling — sort by end time, take non-overlapping\n## 2. Reach/Jump — track maximum reachable index\n## 3. Sweep Line — process events sorted by position\n## 4. Two-Heap — balance elements between heaps\n## 5. Minimum Platform / Meeting Rooms — sort starts and ends separately`,
  interviewTips: `# Interview Tips — Greedy\n\n1. State your greedy choice and prove why it's safe (exchange argument).\n2. Sort is often the first step in greedy problems.\n3. If in doubt between greedy and DP — think about whether subproblems overlap and whether a local choice is always globally optimal.\n4. Test greedy with a counterexample before finalising.`,
  commonMistakes: `# Common Mistakes — Greedy\n\n1. Applying greedy to 0/1 knapsack — it doesn't work.\n2. Wrong sort order — e.g., sorting by start instead of end for interval scheduling.\n3. Not handling ties in sort comparator — ties can break greedy correctness.\n4. Off-by-one in interval overlap check: use \`<=\` not \`<\` for touching intervals.`,
  revision: `# Greedy — Quick Revision\n\n| Problem | Greedy Key |\n|---------|------------|\n| Jump Game | Track max reach |\n| Jump Game II | Min jumps to reach end |\n| Merge Intervals | Sort by start |\n| Non-overlapping Intervals | Sort by end, count removes |\n| Gas Station | If total gas ≥ total cost, solution exists |\n| Candy | Two passes: left→right, right→left |\n`,
  codeExamples: [{ language: 'go', label: 'Jump Game', code: `func canJump(nums []int) bool {
	reach := 0
	for i, v := range nums {
		if i > reach {
			return false
		}
		if i+v > reach {
			reach = i + v
		}
	}
	return true
}` }],
  resources: [
    { title: 'Greedy — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Greedy Algorithms — GfG', url: 'https://www.geeksforgeeks.org/greedy-algorithms/', type: 'article', free: true },
    { title: 'LeetCode Greedy Tag', url: 'https://leetcode.com/tag/greedy/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'grd-q1', question: 'What property must a problem have for a greedy algorithm to be provably correct?', options: ['Memoization', 'Greedy choice property + optimal substructure', 'Sorted input', 'Polynomial time'], correctIndex: 1, explanation: 'Greedy choice property: local optimal choice leads to global optimum. Optimal substructure: problem can be solved via subproblems. Both are needed.' },
    { id: 'grd-q2', question: 'For interval scheduling (maximum non-overlapping intervals), the greedy choice is to always pick:', options: ['Earliest start time', 'Shortest interval', 'Earliest finish time', 'Latest start time'], correctIndex: 2, explanation: 'Picking the interval that finishes earliest leaves the maximum remaining time for future intervals — provably optimal by exchange argument.' },
    { id: 'grd-q3', question: 'Why does greedy fail for the 0/1 knapsack problem?', options: ['Items have equal weight', 'Taking highest ratio item may block higher-value combinations', 'Items are unsorted', 'Two items can\'t be compared'], correctIndex: 1, explanation: 'Unlike fractional knapsack (where you can take fractions), 0/1 knapsack requires DP because one "good" choice may prevent fitting higher total value.' },
    { id: 'grd-q4', question: 'In Jump Game, what does the greedy variable "reach" represent?', options: ['Number of jumps taken', 'Maximum index reachable from any index so far', 'Current position', 'Target index'], correctIndex: 1, explanation: 'reach = max(reach, i + nums[i]) for each i. If i ever exceeds reach, no path exists.' },
  ],
  questions: [
    {
      id: 'lc-55',
      title: "Jump Game",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Greedy',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["greedy", "array"],
      problemStatement: "You are given an integer array nums. Each element represents your maximum jump length at that position. Return true if you can reach the last index starting from index 0.",
      examples: [{"input": "nums = [2,3,1,1,4]", "output": "true"}, {"input": "nums = [3,2,1,0,4]", "output": "false"}],
      constraints: ["1 <= nums.length <= 10^4", "0 <= nums[i] <= 1000"],
      hints: ["Track the farthest reachable index", "If current index exceeds farthest, return false"],
      bruteForce: "Try all jumps from each position \u2014 O(n^2).",
      optimizedSolution: "Greedy: track maxReach. If i > maxReach, fail. O(n)/O(1).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func canJump(nums []int) bool {
    maxReach := 0
    for i := 0; i < len(nums); i++ {
        if i > maxReach { return false }
        if i + nums[i] > maxReach {
            maxReach = i + nums[i]
        }
    }
    return true
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/jump-game/"},
      related: ["Jump Game II", "Jump Game III"],
      dryRun: {
        title: "Jump Game \u2014 Greedy Max Reach",
        input: "nums = [2,3,1,1,4]",
        result: "Return true \u2014 can reach last index",
        steps: [
          { line: 2, description: "Initialize maxReach = 0", variables: [{"name": "maxReach", "value": "0"}], dataState: "nums = [2, 3, 1, 1, 4]\n       ^\nmaxReach = 0" },
          { line: 4, description: "i=0: 0 <= 0. maxReach = max(0, 0+2) = 2", variables: [{"name": "i", "value": "0"}, {"name": "maxReach", "value": "2"}], dataState: "nums = [2, 3, 1, 1, 4]\n       ^\nmaxReach = 2 (can reach index 2)" },
          { line: 4, description: "i=1: 1 <= 2. maxReach = max(2, 1+3) = 4", variables: [{"name": "i", "value": "1"}, {"name": "maxReach", "value": "4"}], dataState: "nums = [2, 3, 1, 1, 4]\n          ^\nmaxReach = 4 (can reach index 4 = last!)" },
          { line: 4, description: "i=2: 2 <= 4. maxReach = max(4, 2+1) = 4. No change.", variables: [{"name": "i", "value": "2"}, {"name": "maxReach", "value": "4"}], dataState: "nums = [2, 3, 1, 1, 4]\n             ^\nmaxReach = 4" },
          { line: 4, description: "i=3: 3 <= 4. maxReach = max(4, 3+1) = 4. No change.", variables: [{"name": "i", "value": "3"}, {"name": "maxReach", "value": "4"}], dataState: "nums = [2, 3, 1, 1, 4]\n                ^\nmaxReach = 4" },
          { line: 4, description: "i=4: 4 <= 4 (reached last index). maxReach = max(4, 4+4) = 8. Loop ends. Return true!", variables: [{"name": "i", "value": "4"}, {"name": "maxReach", "value": "8"}, {"name": "result", "value": "true"}], dataState: "nums = [2, 3, 1, 1, 4]\n                   ^\nmaxReach = 8\nResult: true \u2713" },
        ],
      },
    },
    {
      id: 'lc-11',
      title: "Container With Most Water",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Greedy Two Pointers',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["greedy", "two-pointers", "array"],
      problemStatement: "Given an integer array height of length n, find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water.",
      examples: [{"input": "height = [1,8,6,2,5,4,8,3,7]", "output": "49"}],
      constraints: ["n >= 2", "0 <= height[i] <= 10^4"],
      hints: ["Two pointers: left and right", "Area = min(h[l], h[r]) * (r-l). Move the shorter line inward."],
      bruteForce: "Check all pairs \u2014 O(n^2).",
      optimizedSolution: "Two pointers: move shorter side. O(n)/O(1).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func maxArea(height []int) int {
    left, right := 0, len(height)-1
    maxArea := 0
    for left < right {
        h := min(height[left], height[right])
        area := h * (right - left)
        if area > maxArea { maxArea = area }
        if height[left] < height[right] {
            left++
        } else {
            right--
        }
    }
    return maxArea
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/container-with-most-water/"},
      related: ["Trapping Rain Water", "Trapping Rain II"],
      dryRun: {
        title: "Container With Most Water \u2014 Two Pointers",
        input: "height = [1,8,6,2,5,4,8,3,7]",
        result: "Max area = 49",
        steps: [
          { line: 2, description: "Initialize left=0, right=8, maxArea=0", variables: [{"name": "left", "value": "0"}, {"name": "right", "value": "8"}, {"name": "maxArea", "value": "0"}], dataState: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]\n           ^left              ^right" },
          { line: 6, description: "h=min(1,7)=1. area=1*8=8. maxArea=8. h[l]<h[r], left++.", variables: [{"name": "left", "value": "1"}, {"name": "right", "value": "8"}, {"name": "maxArea", "value": "8"}], dataState: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]\n              ^left           ^right\narea = 1*8 = 8" },
          { line: 6, description: "h=min(8,7)=7. area=7*7=49. maxArea=49. h[l]>=h[r], right--.", variables: [{"name": "left", "value": "1"}, {"name": "right", "value": "7"}, {"name": "maxArea", "value": "49"}], dataState: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]\n              ^left        ^right\narea = 7*7 = 49 \u2190 NEW MAX!" },
          { line: 6, description: "h=min(8,3)=3. area=3*6=18. maxArea stays 49. right--.", variables: [{"name": "left", "value": "1"}, {"name": "right", "value": "6"}, {"name": "maxArea", "value": "49"}], dataState: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]\n              ^left     ^right\narea = 3*6 = 18" },
          { line: 6, description: "Continue... pointers converge. No area exceeds 49.", variables: [{"name": "maxArea", "value": "49"}], dataState: "Pointers converge.\nMax area stays 49" },
          { line: 8, description: "Return maxArea = 49", variables: [{"name": "result", "value": "49"}], dataState: "Result: 49 \u2713\n(lines at index 1 and 8, height 8 and 7, width 7)" },
        ],
      },
    },
  ],
};
