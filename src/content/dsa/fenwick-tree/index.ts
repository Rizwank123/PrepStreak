import type { TopicContent } from '../../types';

export const fenwickTreeContent: TopicContent = {
  slug: 'dsa/fenwick-tree', title: 'Fenwick Tree', category: 'dsa',
  theory: `# Fenwick Tree (Binary Indexed Tree)\n\nSimpler alternative to segment tree for prefix sum queries with point updates.\n\n## Key Insight\n\nEach index i is responsible for a range of length \`lowbit(i) = i & (-i)\`.\n\n## Operations\n\n\`\`\`go\ntype BIT struct { tree []int; n int }\n\nfunc NewBIT(n int) *BIT { return &BIT{make([]int, n+1), n} }\n\n// Add val to index i (1-indexed)\nfunc (b *BIT) Update(i, val int) {\n    for ; i <= b.n; i += i & (-i) { b.tree[i] += val }\n}\n\n// Prefix sum [1, i]\nfunc (b *BIT) Prefix(i int) int {\n    sum := 0\n    for ; i > 0; i -= i & (-i) { sum += b.tree[i] }\n    return sum\n}\n\n// Range sum [l, r]\nfunc (b *BIT) Query(l, r int) int { return b.Prefix(r) - b.Prefix(l-1) }\n\`\`\`\n\n## Complexity\n\n| Op | Time |\n|----|------|\n| Build | O(n log n) |\n| Update | O(log n) |\n| Prefix query | O(log n) |\n\n## Limitation\n\nOnly supports prefix queries natively. For range min/max, use segment tree instead.\n`,
  examples: `# Fenwick Tree — Examples\n\n## Count of Range Sum\n\n\`\`\`go\n// Count subarrays with sum in [lower, upper]\n// Use prefix sums + coordinate compression + BIT\n\`\`\`\n\n## Count Inversions\n\n\`\`\`go\n// An inversion = i<j but arr[i]>arr[j]\n// Process elements left to right. For each element v,\n// query prefix sum up to (v-1) = elements already seen that are smaller.\n// Count of elements > v = total seen - prefix(v)\n\`\`\``,
  patterns: `# Fenwick Tree Patterns\n\n## 1. Prefix sum with dynamic updates\n## 2. Count inversions\n## 3. Rank queries\n## 4. 2D BIT — 2D prefix sums with updates\n## 5. Coordinate compression + BIT — for value-based queries on large ranges`,
  interviewTips: `# Interview Tips — Fenwick Tree\n\n1. BIT is 1-indexed — convert 0-indexed array indices by +1.\n2. \`i & (-i)\` is the lowbit trick — extracts the lowest set bit.\n3. Update traverses UP the tree; query traverses DOWN.\n4. For range update + point query: use difference array technique with BIT.`,
  commonMistakes: `# Common Mistakes — Fenwick Tree\n\n1. Using 0-indexed — BIT requires 1-indexed.\n2. Off-by-one in range query: Query(l, r) = Prefix(r) - Prefix(l-1).\n3. Using BIT for range min/max — BIT only supports invertible operations (sum, XOR).`,
  revision: `# Fenwick Tree — Quick Revision\n\n\`\`\`\nUpdate(i): i += i & (-i)  // go up\nPrefix(i): i -= i & (-i)  // go down\n\`\`\`\n\n| | BIT | Segment Tree |\n|-|-----|-------------|\n| Simpler code | Yes | No |\n| Range min/max | No | Yes |\n| Range update | Diff array | Lazy |\n`,
  codeExamples: [{ language: 'go', label: 'Fenwick Tree', code: `type BIT struct{ tree []int; n int }

func NewBIT(n int) *BIT { return &BIT{make([]int, n+1), n} }

func (b *BIT) Update(i, val int) {
	for ; i <= b.n; i += i & (-i) {
		b.tree[i] += val
	}
}

func (b *BIT) Prefix(i int) int {
	sum := 0
	for ; i > 0; i -= i & (-i) {
		sum += b.tree[i]
	}
	return sum
}

func (b *BIT) Query(l, r int) int {
	return b.Prefix(r) - b.Prefix(l-1)
}` }],
  resources: [
    { title: 'Fenwick Tree — CP-Algorithms', url: 'https://cp-algorithms.com/data_structures/fenwick.html', type: 'article', free: true },
    { title: 'BIT — GfG', url: 'https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/', type: 'article', free: true },
    { title: 'LeetCode BIT Tag', url: 'https://leetcode.com/tag/binary-indexed-tree/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'bit-q1', question: 'What does `i & (-i)` compute?', options: ['i modulo 2', 'The highest set bit of i', 'The lowest set bit of i', 'i squared'], correctIndex: 2, explanation: 'In two\'s complement, -i flips all bits and adds 1. ANDing with i isolates the rightmost set bit (lowbit).' },
    { id: 'bit-q2', question: 'Fenwick tree is 1-indexed because:', options: ['Faster arithmetic', 'i & (-i) == 0 for i=0 would cause infinite loop', 'Go arrays are 1-indexed', 'Prefix sum is undefined at 0'], correctIndex: 1, explanation: 'lowbit(0) = 0, so the update/query loops would never terminate for index 0. Using 1-indexed avoids this.' },
    { id: 'bit-q3', question: 'Fenwick tree supports which aggregate operations natively?', options: ['Min and max', 'Only prefix sum', 'Any invertible operation (sum, XOR, product)', 'Only count'], correctIndex: 2, explanation: 'Range query = Prefix(r) - Prefix(l-1) requires the operation to be invertible. Sum and XOR are invertible; min/max are not.' },
    { id: 'bit-q4', question: 'What is the time complexity of building a Fenwick tree from an array of n elements?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctIndex: 1, explanation: 'Building by calling Update n times, each O(log n) — total O(n log n). Can be done in O(n) with a smarter algorithm but O(n log n) is the common approach.' },
  ],
  questions: [
    {
      id: 'lc-307-fw',
      title: "Range Sum Query - Mutable (Fenwick)",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Fenwick Tree / BIT',
      companies: ["Amazon", "Google"],
      tags: ["fenwick-tree", "bit", "design"],
      problemStatement: "Same as segment tree version but using a Fenwick Tree (Binary Indexed Tree) for range sum queries with point updates.",
      examples: [{"input": "nums = [1,3,5], sumRange(0,2)=9, update(1,2), sumRange(0,2)=8", "output": "9 then 8"}],
      constraints: ["1 <= nums.length <= 3*10^4", "-100 <= nums[i] <= 100"],
      hints: ["BIT uses the least significant bit to define ranges", "update(i, delta) adds delta to i and all ancestors (i += i&-i)", "query(i) returns prefix sum [0..i] by going down (i -= i&-i)"],
      bruteForce: "Naive array \u2014 O(n) per sum.",
      optimizedSolution: "Fenwick tree: O(log n) per update/query. O(n)/O(n).",
      timeComplexity: 'O(log n) per op',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `type NumArray struct {
    tree []int
    nums []int
    n int
}

func Constructor(nums []int) NumArray {
    n := len(nums)
    na := NumArray{tree: make([]int, n+1), nums: nums, n: n}
    for i := 0; i < n; i++ { na.update(i, nums[i]) }
    return na
}

func (na *NumArray) update(i, delta int) {
    i++
    for i <= na.n {
        na.tree[i] += delta
        i += i & (-i)
    }
}

func (na *NumArray) query(i int) int {
    i++
    sum := 0
    for i > 0 {
        sum += na.tree[i]
        i -= i & (-i)
    }
    return sum
}

func (na *NumArray) Update(index, val int) {
    delta := val - na.nums[index]
    na.nums[index] = val
    na.update(index, delta)
}

func (na *NumArray) SumRange(left, right int) int {
    if left == 0 { return na.query(right) }
    return na.query(right) - na.query(left-1)
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/range-sum-query-mutable/"},
      related: ["Count of Smaller Numbers", "Range Sum Immutable"],
      dryRun: {
        title: "Range Sum Mutable \u2014 Fenwick Tree (BIT)",
        input: "nums = [1, 3, 5]",
        result: "sumRange(0,2)=9, after update(1,2) \u2192 8",
        steps: [
          { line: 9, description: "Build BIT by calling update for each element. BIT (1-indexed): tree[1]=1, tree[2]=4, tree[3]=5", variables: [{"name": "tree", "value": "[0, 1, 4, 5]"}], dataState: "BIT (1-indexed):\ntree = [0, 1, 4, 5]\n         1  2  3\ntree[1] = nums[0] = 1\ntree[2] = nums[0]+nums[1] = 1+3 = 4\ntree[3] = nums[2] = 5" },
          { line: 19, description: "query(2) = prefix sum [0..2]. i=3: sum+=tree[3]=5. i=3-1=2: sum+=tree[2]=4. i=0: stop. sum=9", variables: [{"name": "sum", "value": "9"}], dataState: "query(2): prefix [0..2]\ni=3: sum += tree[3] = 5\ni=3-(3&3)=0... wait, 3&(-3)=1, i=3-1=2\ni=2: sum += tree[2] = 4, sum=9\ni=2-(2&2)=0: stop\nsum = 9 \u2713" },
          { line: 28, description: "Update(1, 2): delta = 2-3 = -1. update(1, -1): i=2: tree[2]+=(-1)=3. i=2+2=4 > n=3. Stop.", variables: [{"name": "tree", "value": "[0, 1, 3, 5]"}, {"name": "delta", "value": "-1"}], dataState: "Update(1, 2): delta = 2-3 = -1\ni=2: tree[2] = 4+(-1) = 3\ni=2+2=4 > 3: stop\ntree = [0, 1, 3, 5]" },
          { line: 19, description: "query(2) again: i=3: sum=5. i=2: sum+=tree[2]=3, sum=8. Return 8", variables: [{"name": "sum", "value": "8"}, {"name": "result", "value": "8"}], dataState: "query(2): \ni=3: sum += tree[3] = 5\ni=2: sum += tree[2] = 3, sum=8\nResult: 8 \u2713" },
        ],
      },
    },
  ],
};
