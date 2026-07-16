import type { TopicContent } from '../../types';

export const prefixSumContent: TopicContent = {
  slug: 'dsa/prefix-sum', title: 'Prefix Sum', category: 'dsa',
  theory: `# Prefix Sum\n\nPre-compute cumulative sums to answer range sum queries in O(1) after O(n) preprocessing.\n\n## 1D Prefix Sum\n\n\`\`\`go\npre := make([]int, len(nums)+1)\nfor i, v := range nums { pre[i+1] = pre[i] + v }\n// Sum of nums[l..r] = pre[r+1] - pre[l]\n\`\`\`\n\n## 2D Prefix Sum\n\n\`\`\`go\npre[i][j] = matrix[i-1][j-1] + pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1]\n// Rectangle (r1,c1) to (r2,c2):\n// = pre[r2+1][c2+1] - pre[r1][c2+1] - pre[r2+1][c1] + pre[r1][c1]\n\`\`\`\n\n## Prefix Sum + Hash Map\n\nCount subarrays with sum exactly k:\n\`\`\`go\ncount, sum := 0, 0\nfreq := map[int]int{0: 1}\nfor _, v := range nums {\n    sum += v\n    count += freq[sum-k]\n    freq[sum]++\n}\n\`\`\`\n\n## Complexity\n\n| | Pre-process | Query |\n|-|------------|-------|\n| 1D | O(n) | O(1) |\n| 2D | O(nm) | O(1) |\n`,
  examples: `# Prefix Sum — Examples\n\n## Range Sum Query\n\n\`\`\`go\ntype NumArray struct { pre []int }\nfunc Constructor(nums []int) NumArray {\n    pre := make([]int, len(nums)+1)\n    for i, v := range nums { pre[i+1] = pre[i]+v }\n    return NumArray{pre}\n}\nfunc (na *NumArray) SumRange(l, r int) int { return na.pre[r+1]-na.pre[l] }\n\`\`\`\n\n## Contiguous Array (equal 0s and 1s)\n\n\`\`\`go\n// Replace 0 with -1. Find longest subarray with sum 0.\n// Use prefix sum + hash map: store first occurrence of each sum.\nfunc findMaxLength(nums []int) int {\n    firstSeen := map[int]int{0: -1}\n    sum, best := 0, 0\n    for i, v := range nums {\n        if v == 0 { sum-- } else { sum++ }\n        if j, ok := firstSeen[sum]; ok {\n            if i-j > best { best = i-j }\n        } else {\n            firstSeen[sum] = i\n        }\n    }\n    return best\n}\n\`\`\``,
  patterns: `# Prefix Sum Patterns\n\n## 1. Range Sum Query — pre[r+1] - pre[l]\n## 2. Subarray Sum = k — prefix + hash map\n## 3. Longest subarray with sum condition — prefix + earliest index map\n## 4. 2D rectangle sum — 2D prefix\n## 5. Difference Array — range updates in O(1), query in O(n)`,
  interviewTips: `# Interview Tips — Prefix Sum\n\n1. Initialise prefix array with size n+1 — avoids index bound checks.\n2. For subarray sum = k, always initialise {0: 1} in the frequency map.\n3. For 2D prefix sums, draw the inclusion-exclusion formula.\n4. Difference array is the inverse of prefix sum — use for range update problems.`,
  commonMistakes: `# Common Mistakes — Prefix Sum\n\n1. Wrong index: sum[l..r] = pre[r+1] - pre[l], NOT pre[r] - pre[l-1].\n2. Missing {0:1} initialisation — skips subarrays starting at index 0.\n3. Off-by-one in prefix array size — must be n+1, not n.\n4. 2D prefix: forgetting the -pre[i-1][j-1] term in inclusion-exclusion.`,
  revision: `# Prefix Sum — Quick Revision\n\n| Problem | Technique |\n|---------|-----------|\n| Range sum query | 1D prefix |\n| 2D range sum | 2D prefix |\n| Subarray sum = k | Prefix + hash map |\n| Max subarray sum | Kadane (not prefix) |\n| Longest equal 0s & 1s | Prefix + first seen |\n| Product except self | Prefix + suffix product |\n`,
  codeExamples: [{ language: 'go', label: 'Subarray Sum = k', code: `func subarraySum(nums []int, k int) int {
	count, sum := 0, 0
	freq := map[int]int{0: 1}
	for _, v := range nums {
		sum += v
		count += freq[sum-k]
		freq[sum]++
	}
	return count
}` }],
  resources: [
    { title: 'Prefix Sum — GfG', url: 'https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/', type: 'article', free: true },
    { title: 'Prefix Sum — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'LeetCode Prefix Sum Tag', url: 'https://leetcode.com/tag/prefix-sum/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'ps-q1', question: 'After O(n) prefix-sum preprocessing, what is the time for a single range-sum query?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctIndex: 2, explanation: 'pre[r+1] - pre[l] is computed with two array accesses and one subtraction — constant time O(1).' },
    { id: 'ps-q2', question: 'In "Subarray Sum Equals K" using prefix sum + hash map, why initialise freq[0] = 1?', options: ['Avoids division by zero', 'Counts subarrays starting from index 0', 'Required by Go map semantics', 'Handles negative numbers'], correctIndex: 1, explanation: 'If prefix[i] == k, then the subarray nums[0..i] sums to k. Without freq[0]=1, this case would be missed.' },
    { id: 'ps-q3', question: 'Prefix array size should be n+1 (not n) because:', options: ['It is faster', 'pre[0]=0 represents an empty prefix; indices align as pre[i+1]', 'Go requires it', 'Avoids overflow'], correctIndex: 1, explanation: 'Having pre[0]=0 makes the formula sum(l..r) = pre[r+1] - pre[l] work uniformly for all l, including l=0.' },
    { id: 'ps-q4', question: 'The "Contiguous Array" problem (equal 0s and 1s) uses prefix sum with what transformation?', options: ['Replace 1 with -1', 'Replace 0 with -1', 'Square each value', 'No transformation needed'], correctIndex: 1, explanation: 'Replace 0 with -1. Equal 0s and 1s → subarray sum = 0. Find longest subarray with prefix sum 0 using hash map of first occurrences.' },
  ],
  questions: [
    {
      id: 'lc-560',
      title: "Subarray Sum Equals K",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Prefix Sum + Hash Map',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["prefix-sum", "hash-map", "array"],
      problemStatement: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals k.",
      examples: [{"input": "nums = [1,1,1], k = 2", "output": "2"}, {"input": "nums = [1,2,3], k = 3", "output": "2"}],
      constraints: ["1 <= nums.length <= 2*10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"],
      hints: ["Use prefix sum with a hash map", "If prefixSum - k exists in map, count those occurrences"],
      bruteForce: "Check all subarrays \u2014 O(n^2).",
      optimizedSolution: "Prefix sum + hash map. O(n)/O(n).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func subarraySum(nums []int, k int) int {
    count, prefixSum := 0, 0
    m := make(map[int]int)
    m[0] = 1
    for _, n := range nums {
        prefixSum += n
        if v, ok := m[prefixSum-k]; ok {
            count += v
        }
        m[prefixSum]++
    }
    return count
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/subarray-sum-equals-k/"},
      related: ["Continuous Subarray Sum", "Subarray Sums Divisible by K"],
      dryRun: {
        title: "Subarray Sum Equals K \u2014 Prefix Sum + Hash",
        input: "nums = [1,1,1], k = 2",
        result: "Count = 2",
        steps: [
          { line: 2, description: "Initialize count=0, prefixSum=0, map={0:1}", variables: [{"name": "count", "value": "0"}, {"name": "prefixSum", "value": "0"}, {"name": "map", "value": "{0:1}"}], dataState: "nums = [1, 1, 1]\nk = 2\nmap = {0: 1}\nprefixSum = 0" },
          { line: 6, description: "i=0, n=1. prefixSum=1. Check 1-2=-1 in map? No. map={0:1,1:1}.", variables: [{"name": "prefixSum", "value": "1"}, {"name": "map", "value": "{0:1, 1:1}"}, {"name": "count", "value": "0"}], dataState: "nums = [1, 1, 1]\n       ^\nprefixSum = 1\n1-2 = -1 not in map" },
          { line: 6, description: "i=1, n=1. prefixSum=2. Check 2-2=0 in map? Yes, count=1. map={0:1,1:1,2:1}.", variables: [{"name": "prefixSum", "value": "2"}, {"name": "map", "value": "{0:1, 1:1, 2:1}"}, {"name": "count", "value": "1"}], dataState: "nums = [1, 1, 1]\n          ^\nprefixSum = 2\n2-2 = 0 in map (1 time)\ncount = 1 (subarray [0..1])" },
          { line: 6, description: "i=2, n=1. prefixSum=3. Check 3-2=1 in map? Yes, count=1+1=2. map={0:1,1:1,2:1,3:1}.", variables: [{"name": "prefixSum", "value": "3"}, {"name": "map", "value": "{0:1,1:1,2:1,3:1}"}, {"name": "count", "value": "2"}], dataState: "nums = [1, 1, 1]\n             ^\nprefixSum = 3\n3-2 = 1 in map (1 time)\ncount = 2 (subarray [1..2])" },
          { line: 9, description: "Return count = 2", variables: [{"name": "result", "value": "2"}], dataState: "Result: 2 subarrays sum to 2\n[1,1] at [0..1] and [1,1] at [1..2] \u2713" },
        ],
      },
    },
    {
      id: 'lc-303',
      title: "Range Sum Query - Immutable",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Prefix Sum',
      companies: ["Google", "Amazon"],
      tags: ["prefix-sum", "design", "array"],
      problemStatement: "Given an integer array nums, handle multiple queries of the form: sumRange(left, right) which returns the sum of elements from index left to right inclusive.",
      examples: [{"input": "nums=[-2,0,3,-5,2,-1], sumRange(0,2), sumRange(2,5)", "output": "1, -1"}],
      constraints: ["1 <= nums.length <= 10^4", "-10^5 <= nums[i] <= 10^5", "At most 10^4 calls"],
      hints: ["Precompute prefix sums", "sumRange(l,r) = prefix[r+1] - prefix[l]"],
      bruteForce: "Sum each query naively \u2014 O(n) per query.",
      optimizedSolution: "Precompute prefix sums. O(n) init, O(1) per query. O(n)/O(n).",
      timeComplexity: 'O(n) init',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `type NumArray struct {
    prefix []int
}

func Constructor(nums []int) NumArray {
    prefix := make([]int, len(nums)+1)
    for i := 0; i < len(nums); i++ {
        prefix[i+1] = prefix[i] + nums[i]
    }
    return NumArray{prefix: prefix}
}

func (na *NumArray) SumRange(left, right int) int {
    return na.prefix[right+1] - na.prefix[left]
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/range-sum-query-immutable/"},
      related: ["Range Sum 2D", "Range Sum Query Mutable"],
      dryRun: {
        title: "Range Sum Query \u2014 Prefix Sum",
        input: "nums = [-2,0,3,-5,2,-1]",
        result: "sumRange(0,2) = 1, sumRange(2,5) = -1",
        steps: [
          { line: 4, description: "Build prefix array: prefix[0]=0, prefix[i+1]=prefix[i]+nums[i]", variables: [{"name": "prefix", "value": "[0,-2,-2,1,-4,-2,-3]"}], dataState: "nums   = [-2,  0,  3, -5,  2, -1]\nprefix = [ 0, -2, -2,  1, -4, -2, -3]\n          0   1   2   3   4   5   6" },
          { line: 11, description: "sumRange(0,2) = prefix[3] - prefix[0] = 1 - 0 = 1", variables: [{"name": "left", "value": "0"}, {"name": "right", "value": "2"}, {"name": "result", "value": "1"}], dataState: "sumRange(0, 2):\nprefix[3] - prefix[0] = 1 - 0 = 1\n(nums[0]+nums[1]+nums[2] = -2+0+3 = 1) \u2713" },
          { line: 11, description: "sumRange(2,5) = prefix[6] - prefix[2] = -3 - (-2) = -1", variables: [{"name": "left", "value": "2"}, {"name": "right", "value": "5"}, {"name": "result", "value": "-1"}], dataState: "sumRange(2, 5):\nprefix[6] - prefix[2] = -3 - (-2) = -1\n(nums[2..5] = 3+(-5)+2+(-1) = -1) \u2713" },
        ],
      },
    },
  ],
};
