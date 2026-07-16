import type { TopicContent } from '../../types';

export const backtrackingContent: TopicContent = {
  slug: 'dsa/backtracking', title: 'Backtracking', category: 'dsa',
  theory: `# Backtracking\n\nBuild a solution incrementally, abandoning partial solutions (backtracking) as soon as it's determined they cannot lead to a valid complete solution.\n\n## Mental Model: Decision Tree\n\nAt each step, try all possible choices. If a choice fails the constraint, undo it and try the next.\n\n## Template\n\n\`\`\`go\nfunc backtrack(state, choices) {\n    if isComplete(state) {\n        result = append(result, copy(state))\n        return\n    }\n    for _, choice := range choices {\n        if isValid(state, choice) {\n            makeChoice(state, choice)     // add to path\n            backtrack(state, nextChoices)\n            undoChoice(state, choice)     // remove from path\n        }\n    }\n}\n\`\`\`\n\n## Complexity\n\nWorst case exponential: O(n! × n) for permutations, O(2^n × n) for subsets. Pruning reduces the constant.`,
  examples: `# Backtracking — Examples\n\n## Subsets\n\n\`\`\`go\nfunc subsets(nums []int) [][]int {\n    var res [][]int\n    var bt func(start int, curr []int)\n    bt = func(start int, curr []int) {\n        res = append(res, append([]int{}, curr...))\n        for i := start; i < len(nums); i++ {\n            curr = append(curr, nums[i])\n            bt(i+1, curr)\n            curr = curr[:len(curr)-1]\n        }\n    }\n    bt(0, nil)\n    return res\n}\n\`\`\`\n\n## Permutations\n\n\`\`\`go\nfunc permute(nums []int) [][]int {\n    var res [][]int\n    var bt func(start int)\n    bt = func(start int) {\n        if start == len(nums) { res = append(res, append([]int{}, nums...)); return }\n        for i := start; i < len(nums); i++ {\n            nums[start], nums[i] = nums[i], nums[start]\n            bt(start + 1)\n            nums[start], nums[i] = nums[i], nums[start]\n        }\n    }\n    bt(0)\n    return res\n}\n\`\`\``,
  patterns: `# Backtracking Patterns\n\n## 1. Subsets — at each index: include or skip\n## 2. Permutations — swap current with each remaining\n## 3. Combinations — choose k items from n\n## 4. Word Search — DFS on grid with visited marking\n## 5. N-Queens — place queen per row, check column/diagonal conflicts\n\n**Pruning tips:**\n- Sort input to skip duplicates early\n- Break when remaining elements can't fulfill constraint`,
  interviewTips: `# Interview Tips — Backtracking\n\n1. Draw the decision tree first — it directly maps to the code.\n2. Always copy the current path when adding to results.\n3. Sort input if duplicates need to be avoided in subsets/combinations.\n4. State what you're backtracking: "I'm adding each element and removing it after exploring."\n5. Mention pruning: why does your approach avoid unnecessary branches?`,
  commonMistakes: `# Common Mistakes — Backtracking\n\n1. Not undoing choice on backtrack — path accumulates incorrectly.\n2. Shallow copy — appending path directly instead of copy.\n3. Duplicate subsets — not sorting + skipping equal adjacent elements.\n4. Infinite recursion — base case missing or wrong termination condition.`,
  revision: `# Backtracking — Quick Revision\n\n| Problem | Key |\n|---------|-----|\n| Subsets | Start index prevents reuse |\n| Subsets II | Skip duplicates after sorting |\n| Permutations | Swap + restore |\n| Combinations | Start index + max remaining check |\n| N-Queens | Track columns and diagonals |\n| Word Search | Mark + unmark visited cells |\n`,
  codeExamples: [{ language: 'go', label: 'Subsets', code: `func subsets(nums []int) [][]int {
	var res [][]int
	var bt func(start int, curr []int)
	bt = func(start int, curr []int) {
		res = append(res, append([]int{}, curr...))
		for i := start; i < len(nums); i++ {
			curr = append(curr, nums[i])
			bt(i+1, curr)
			curr = curr[:len(curr)-1]
		}
	}
	bt(0, nil)
	return res
}` }],
  resources: [
    { title: 'Backtracking — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Backtracking — GfG', url: 'https://www.geeksforgeeks.org/backtracking-algorithms/', type: 'article', free: true },
    { title: 'LeetCode Backtracking Tag', url: 'https://leetcode.com/tag/backtracking/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'bt-q1', question: 'Why must you copy the current path when appending to results in backtracking?', options: ['Faster', 'Path slice is mutated on backtrack — original reference changes', 'Go requires it', 'To avoid duplicates'], correctIndex: 1, explanation: 'The path slice is a shared reference. After backtracking, its contents change. You must copy to capture the state at the time of the valid solution.' },
    { id: 'bt-q2', question: 'To avoid duplicate subsets in "Subsets II" with duplicate numbers, what do you do?', options: ['Use a hash set', 'Sort + skip same value at same recursion level', 'Sort only', 'Use a visited array'], correctIndex: 1, explanation: 'Sort the array, then skip nums[i] == nums[i-1] when i > start — this skips the same element at the same recursion depth.' },
    { id: 'bt-q3', question: 'What is the time complexity of generating all subsets of n elements?', options: ['O(n)', 'O(n²)', 'O(2^n)', 'O(n!)'], correctIndex: 2, explanation: 'There are 2^n subsets (each element either included or not). Copying each subset adds O(n) — total O(n × 2^n).' },
    { id: 'bt-q4', question: 'In the N-Queens problem, what is the most efficient way to check if a column is attacked?', options: ['Scan entire board', 'Track used columns in a set', 'Sort columns', 'Use a 2D boolean matrix'], correctIndex: 1, explanation: 'A set of used columns, positive diagonals (r-c), and negative diagonals (r+c) lets you check any cell in O(1).' },
  ],
  questions: [
    {
      id: 'lc-46',
      title: "Permutations",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Backtracking',
      companies: ["Amazon", "Meta", "Google", "Microsoft"],
      tags: ["backtracking", "recursion"],
      problemStatement: "Given an array nums of distinct integers, return all possible permutations. You can return the answer in any order.",
      examples: [{"input": "nums = [1,2,3]", "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"}],
      constraints: ["1 <= nums.length <= 6", "-10 <= nums[i] <= 10", "All integers are unique"],
      hints: ["Use backtracking: swap or track used elements", "At each position, try all unused numbers"],
      bruteForce: "Generate all arrangements naively.",
      optimizedSolution: "Backtracking with used array. O(n! * n)/O(n).",
      timeComplexity: 'O(n! * n)',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func permute(nums []int) [][]int {
    var result [][]int
    var backtrack func(start int)
    backtrack = func(start int) {
        if start == len(nums) {
            copy := append([]int{}, nums...)
            result = append(result, copy)
            return
        }
        for i := start; i < len(nums); i++ {
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]
        }
    }
    backtrack(0)
    return result
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/permutations/"},
      related: ["Permutations II", "Combinations"],
      dryRun: {
        title: "Permutations \u2014 Backtracking by Swap",
        input: "nums = [1,2,3]",
        result: "6 permutations generated",
        steps: [
          { line: 5, description: "backtrack(0): start=0. Try swapping with i=0,1,2.", variables: [{"name": "start", "value": "0"}, {"name": "path", "value": "[1,2,3]"}], dataState: "nums = [1, 2, 3]\n         ^start\nTry i=0: swap(0,0) \u2192 [1,2,3]" },
          { line: 9, description: "i=0: swap(0,0) no change. backtrack(1).", variables: [{"name": "start", "value": "1"}, {"name": "path", "value": "[1,2,3]"}], dataState: "nums = [1, 2, 3]\n            ^start\nFixed: [1, _, _]" },
          { line: 9, description: "i=1: swap(1,1) no change. backtrack(2). i=2: swap(1,2) \u2192 [1,3,2]. backtrack(2).", variables: [{"name": "start", "value": "2"}, {"name": "perm1", "value": "[1,2,3]"}, {"name": "perm2", "value": "[1,3,2]"}], dataState: "Permutations so far:\n[1,2,3] \u2713\n[1,3,2] \u2713\nFixed: [1, _, _]" },
          { line: 9, description: "Back to start=0. i=1: swap(0,1) \u2192 [2,1,3]. backtrack(1).", variables: [{"name": "start", "value": "0"}, {"name": "path", "value": "[2,1,3]"}], dataState: "nums = [2, 1, 3]\n         ^start\nTry i=1: swap(0,1) \u2192 [2,1,3]\nFixed: [2, _, _]" },
          { line: 9, description: "From [2,1,3]: generate [2,1,3] and [2,3,1].", variables: [{"name": "perm1", "value": "[2,1,3]"}, {"name": "perm2", "value": "[2,3,1]"}], dataState: "Permutations so far:\n[1,2,3] [1,3,2]\n[2,1,3] [2,3,1]\nFixed: [2, _, _]" },
          { line: 9, description: "i=2: swap(0,2) \u2192 [3,2,1]. Generate [3,2,1] and [3,1,2].", variables: [{"name": "perm1", "value": "[3,2,1]"}, {"name": "perm2", "value": "[3,1,2]"}], dataState: "All 6 permutations:\n[1,2,3] [1,3,2]\n[2,1,3] [2,3,1]\n[3,1,2] [3,2,1] \u2713" },
        ],
      },
    },
    {
      id: 'lc-39',
      title: "Combination Sum",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Backtracking',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["backtracking", "recursion"],
      problemStatement: "Given an array of distinct integers candidates and a target, return all unique combinations of candidates that sum to target. The same number may be chosen unlimited times.",
      examples: [{"input": "candidates = [2,3,6,7], target = 7", "output": "[[2,2,3],[7]]"}],
      constraints: ["1 <= candidates.length <= 30", "1 <= candidates[i] <= 200", "1 <= target <= 40"],
      hints: ["Backtrack: try each candidate, subtract from target", "Only move forward to avoid duplicates"],
      bruteForce: "Try all subsets \u2014 exponential.",
      optimizedSolution: "Backtracking: try candidate, recurse with reduced target. O(2^t)/O(t).",
      timeComplexity: 'O(2^t)',
      spaceComplexity: 'O(t)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func combinationSum(candidates []int, target int) [][]int {
    var result [][]int
    var backtrack func(start, target int, path []int)
    backtrack = func(start, target int, path []int) {
        if target == 0 {
            copy := append([]int{}, path...)
            result = append(result, copy)
            return
        }
        for i := start; i < len(candidates); i++ {
            if candidates[i] > target { continue }
            backtrack(i, target-candidates[i], append(path, candidates[i]))
        }
    }
    backtrack(0, target, []int{})
    return result
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/combination-sum/"},
      related: ["Combination Sum II", "Combination Sum III"],
      dryRun: {
        title: "Combination Sum \u2014 Backtracking",
        input: "candidates = [2,3,6,7], target = 7",
        result: "Result: [[2,2,3], [7]]",
        steps: [
          { line: 5, description: "backtrack(0, 7, []). target=7 > 0.", variables: [{"name": "target", "value": "7"}, {"name": "path", "value": "[]"}], dataState: "candidates = [2, 3, 6, 7]\ntarget = 7\npath = []" },
          { line: 11, description: "i=0: try 2. backtrack(0, 5, [2]).", variables: [{"name": "target", "value": "5"}, {"name": "path", "value": "[2]"}], dataState: "path = [2]\ntarget = 7-2 = 5" },
          { line: 11, description: "i=0: try 2. backtrack(0, 3, [2,2]).", variables: [{"name": "target", "value": "3"}, {"name": "path", "value": "[2,2]"}], dataState: "path = [2, 2]\ntarget = 5-2 = 3" },
          { line: 11, description: "i=0: try 2. backtrack(0, 1, [2,2,2]). 2 > 1, skip. i=1: 3 > 1 skip. No match.", variables: [{"name": "target", "value": "1"}, {"name": "path", "value": "[2,2,2]"}], dataState: "path = [2, 2, 2]\ntarget = 1\ncandidates > 1, backtrack" },
          { line: 11, description: "Back at target=3, path=[2,2]. i=1: try 3. backtrack(1, 0, [2,2,3]). target=0! Found!", variables: [{"name": "target", "value": "0"}, {"name": "path", "value": "[2,2,3]"}, {"name": "result", "value": "[[2,2,3]]"}], dataState: "path = [2, 2, 3]\ntarget = 3-3 = 0\nFOUND: [2, 2, 3] \u2713" },
          { line: 11, description: "Back at target=7, path=[]. i=3: try 7. backtrack(3, 0, [7]). target=0! Found!", variables: [{"name": "target", "value": "0"}, {"name": "path", "value": "[7]"}, {"name": "result", "value": "[[2,2,3],[7]]"}], dataState: "path = [7]\ntarget = 7-7 = 0\nFOUND: [7] \u2713\nResult: [[2,2,3], [7]]" },
        ],
      },
    },
  ],
};
