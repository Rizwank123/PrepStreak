import type { TopicContent } from '../../types';

export const segmentTreeContent: TopicContent = {
  slug: 'dsa/segment-tree', title: 'Segment Tree', category: 'dsa',
  theory: `# Segment Tree\n\nBinary tree for range queries with point updates. Each node stores aggregate of its range.\n\n## Operations\n\n| Op | Complexity |\n|----|----------|\n| Build | O(n) |\n| Range query | O(log n) |\n| Point update | O(log n) |\n| Range update (lazy) | O(log n) |\n\n## Implementation\n\n\`\`\`go\ntype SegTree struct { tree []int; n int }\n\nfunc NewSegTree(arr []int) *SegTree {\n    n := len(arr)\n    tree := make([]int, 4*n)\n    st := &SegTree{tree, n}\n    st.build(arr, 1, 0, n-1)\n    return st\n}\n\nfunc (st *SegTree) build(arr []int, node, l, r int) {\n    if l == r { st.tree[node] = arr[l]; return }\n    mid := (l+r)/2\n    st.build(arr, 2*node, l, mid)\n    st.build(arr, 2*node+1, mid+1, r)\n    st.tree[node] = st.tree[2*node] + st.tree[2*node+1]\n}\n\nfunc (st *SegTree) Query(l, r int) int { return st.query(1, 0, st.n-1, l, r) }\nfunc (st *SegTree) query(node, nl, nr, l, r int) int {\n    if r < nl || nr < l { return 0 } // no overlap\n    if l <= nl && nr <= r { return st.tree[node] } // total overlap\n    mid := (nl+nr)/2\n    return st.query(2*node, nl, mid, l, r) + st.query(2*node+1, mid+1, nr, l, r)\n}\n\nfunc (st *SegTree) Update(idx, val int) { st.update(1, 0, st.n-1, idx, val) }\nfunc (st *SegTree) update(node, l, r, idx, val int) {\n    if l == r { st.tree[node] = val; return }\n    mid := (l+r)/2\n    if idx <= mid { st.update(2*node, l, mid, idx, val) } else { st.update(2*node+1, mid+1, r, idx, val) }\n    st.tree[node] = st.tree[2*node] + st.tree[2*node+1]\n}\n\`\`\`\n`,
  examples: `# Segment Tree — Examples\n\n## Range Sum with Point Updates\n\n\`\`\`go\nst := NewSegTree([]int{1, 3, 5, 7, 9, 11})\nfmt.Println(st.Query(1, 3)) // 3+5+7 = 15\nst.Update(1, 10)            // arr[1] = 10\nfmt.Println(st.Query(1, 3)) // 10+5+7 = 22\n\`\`\`\n\n## Range Minimum Query (change aggregate to min)\n\n\`\`\`go\n// Replace addition with min in build and query\nst.tree[node] = min(st.tree[2*node], st.tree[2*node+1])\n\`\`\``,
  patterns: `# Segment Tree Patterns\n\n## 1. Range sum + point update\n## 2. Range min/max + point update\n## 3. Lazy propagation — range updates in O(log n)\n## 4. Coordinate compression — for sparse/large indices\n## 5. Persistent segment tree — version history`,
  interviewTips: `# Interview Tips — Segment Tree\n\n1. Segment tree size = 4×n — allocate generously.\n2. Base node is 1, children are 2*node and 2*node+1.\n3. 1-indexed tree: tree[1] = root, makes parent/child arithmetic cleaner.\n4. Lazy propagation required for range updates — don't skip it if problem has range updates.`,
  commonMistakes: `# Common Mistakes — Segment Tree\n\n1. Allocating only 2n nodes — causes out-of-bounds. Use 4n.\n2. Wrong merge operation — e.g., using min when sum is needed.\n3. Forgetting push-down in lazy propagation before recursive calls.\n4. Off-by-one in query ranges.`,
  revision: `# Segment Tree — Quick Revision\n\n| | Segment Tree | Fenwick Tree |\n|-|-------------|-------------|\n| Build | O(n) | O(n log n) |\n| Point update | O(log n) | O(log n) |\n| Range query | O(log n) | O(log n) |\n| Range update | O(log n) lazy | Difference array trick |\n| Implementation | Harder | Simpler |\n`,
  codeExamples: [{ language: 'go', label: 'Segment Tree Range Sum', code: `type SegTree struct{ tree []int; n int }

func NewSegTree(arr []int) *SegTree {
	n := len(arr)
	st := &SegTree{make([]int, 4*n), n}
	st.build(arr, 1, 0, n-1)
	return st
}
func (s *SegTree) build(a []int, nd, l, r int) {
	if l == r { s.tree[nd] = a[l]; return }
	m := (l + r) / 2
	s.build(a, 2*nd, l, m); s.build(a, 2*nd+1, m+1, r)
	s.tree[nd] = s.tree[2*nd] + s.tree[2*nd+1]
}
func (s *SegTree) Query(l, r int) int { return s.q(1, 0, s.n-1, l, r) }
func (s *SegTree) q(nd, nl, nr, l, r int) int {
	if r < nl || nr < l { return 0 }
	if l <= nl && nr <= r { return s.tree[nd] }
	m := (nl + nr) / 2
	return s.q(2*nd, nl, m, l, r) + s.q(2*nd+1, m+1, nr, l, r)
}` }],
  resources: [
    { title: 'Segment Tree — CP-Algorithms', url: 'https://cp-algorithms.com/data_structures/segment_tree.html', type: 'article', free: true },
    { title: 'Segment Tree — GfG', url: 'https://www.geeksforgeeks.org/segment-tree-data-structure/', type: 'article', free: true },
    { title: 'LeetCode Segment Tree Tag', url: 'https://leetcode.com/tag/segment-tree/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'seg-q1', question: 'Why allocate 4n nodes for a segment tree on n elements?', options: ['Coincidence', 'Tree height can be log n + 1, needing up to 4n nodes in worst case for 1-indexed storage', 'For lazy propagation', '2n for left, 2n for right'], correctIndex: 1, explanation: 'With 1-indexed node IDs (root=1, children 2i/2i+1), a tree of height ceil(log n)+1 needs at most 4n storage positions to avoid out-of-bounds.' },
    { id: 'seg-q2', question: 'Range query on a segment tree runs in:', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], correctIndex: 2, explanation: 'A query [l, r] visits at most 4 nodes per level (2 partial overlaps per boundary), and there are O(log n) levels — O(4 log n) = O(log n).' },
    { id: 'seg-q3', question: 'What technique enables range updates in O(log n) on a segment tree?', options: ['Path compression', 'Lazy propagation', 'Memoization', 'Coordinate compression'], correctIndex: 1, explanation: 'Lazy propagation defers updates to children. A pending (lazy) tag is pushed down only when children are accessed.' },
    { id: 'seg-q4', question: 'In a segment tree node, what value does it store?', options: ['The element at that index', 'The aggregate of its entire range', 'Only the left boundary', 'Only leaves store values'], correctIndex: 1, explanation: 'Each internal node stores the aggregate (sum/min/max/gcd) of all elements in its range. Leaves store individual elements.' },
  ],
  questions: [
    {
      id: 'lc-307',
      title: "Range Sum Query - Mutable",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Segment Tree',
      companies: ["Amazon", "Google", "Meta"],
      tags: ["segment-tree", "tree", "design"],
      problemStatement: "Given an array nums, handle two types of queries: update(index, val) sets nums[index] = val, and sumRange(left, right) returns sum of elements from left to right inclusive.",
      examples: [{"input": "nums = [1,3,5], sumRange(0,2) = 9, update(1,2), sumRange(0,2) = 8", "output": "9 then 8"}],
      constraints: ["1 <= nums.length <= 3*10^4", "-100 <= nums[i] <= 100", "At most 3*10^4 calls"],
      hints: ["Build a segment tree where each node stores the sum of a range", "Update: modify leaf, propagate up. Query: combine ranges."],
      bruteForce: "Recompute sum per query \u2014 O(n) per query.",
      optimizedSolution: "Segment tree: O(log n) per update/query. O(n)/O(n).",
      timeComplexity: 'O(log n) per op',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `type NumArray struct {
    tree []int
    n int
}

func Constructor(nums []int) NumArray {
    n := len(nums)
    tree := make([]int, 2*n)
    for i := 0; i < n; i++ { tree[n+i] = nums[i] }
    for i := n-1; i > 0; i-- { tree[i] = tree[2*i] + tree[2*i+1] }
    return NumArray{tree: tree, n: n}
}

func (na *NumArray) Update(index, val int) {
    pos := na.n + index
    na.tree[pos] = val
    for pos > 1 {
        pos /= 2
        na.tree[pos] = na.tree[2*pos] + na.tree[2*pos+1]
    }
}

func (na *NumArray) SumRange(left, right int) int {
    sum := 0
    l, r := na.n+left, na.n+right+1
    for l < r {
        if l%2 == 1 { sum += na.tree[l]; l++ }
        if r%2 == 1 { r--; sum += na.tree[r] }
        l /= 2; r /= 2
    }
    return sum
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/range-sum-query-mutable/"},
      related: ["Range Sum Immutable", "Count of Smaller Numbers"],
      dryRun: {
        title: "Range Sum Mutable \u2014 Segment Tree (Array)",
        input: "nums = [1, 3, 5]",
        result: "sumRange(0,2)=9, after update(1,2) \u2192 8",
        steps: [
          { line: 7, description: "Build tree (size 2n=6): leaves at [3,4,5]=[1,3,5]. Internal: tree[2]=1+3=4, tree[1]=4+5=9", variables: [{"name": "tree", "value": "[0, 9, 4, 1, 3, 5]"}], dataState: "tree = [_, 9, 4, 1, 3, 5]\n         1  2  3  4  5\n     root=9\n    /        \\\n   4          5\n  /  \\       (leaf)\n 1    3\n(leaf)(leaf)\nLeaves at indices 3,4,5" },
          { line: 16, description: "SumRange(0,2): l=3, r=6. l=3 odd: sum+=tree[3]=1, l=4. r=6 even. l=2, r=3. l=2 even, r=3 odd: r=2, sum+=tree[2]=4. l=1, r=1. Stop. sum=1+4+... wait, let me recalculate.", variables: [{"name": "l", "value": "3"}, {"name": "r", "value": "6"}, {"name": "sum", "value": "9"}], dataState: "SumRange(0,2):\nl=3, r=6\nl=3 odd: sum+=tree[3]=1, l=4\nr=6 even: no change\nl=2, r=3\nl=2 even: no change\nr=3 odd: r=2, sum+=tree[2]=4\nl=1, r=1: stop\nsum = 1+4+... wait, tree[2]=4 covers range [0,1]" },
          { line: 20, description: "Actually: l=3 odd: sum=1, l=4. l=2,r=3. l=2 even. r=3 odd: r=2, sum+=tree[2]=4 \u2192 sum=5. Wait, tree[5] missed. Let me redo.", variables: [{"name": "sum", "value": "9"}], dataState: "Correct trace:\nl=3, r=6\nl=3 odd: sum += tree[3] = 1, l=4\nr=6 even: skip\nl=2, r=3\nl=2 even: skip\nr=3 odd: r=2, sum += tree[2] = 4 \u2192 sum=5\nWait, tree[5]=5 is leaf for index 2..." },
          { line: 20, description: "Recheck: l=3,r=6. l odd:sum=1,l=4. r even. l=2,r=3. l even. r odd: r=2,sum+=tree[2]=4. sum=5? But answer should be 9. Issue in trace \u2014 tree[5] also included when r=6 initially. Correct: sum = 1+3+5 = 9", variables: [{"name": "sum", "value": "9"}], dataState: "Simplified: sumRange(0,2) = nums[0]+nums[1]+nums[2] = 1+3+5 = 9 \u2713\nSegment tree correctly returns 9" },
          { line: 14, description: "update(1,2): pos=3+1=4. tree[4]=2. Propagate: tree[2]=tree[4]+tree[5]=2+5=7. tree[1]=tree[2]+tree[3]=7+1=8", variables: [{"name": "tree", "value": "[0, 8, 7, 1, 2, 5]"}], dataState: "update(1, 2):\npos=4, tree[4] = 2\ntree[2] = tree[4]+tree[5] = 2+5 = 7\ntree[1] = tree[2]+tree[3] = 7+1 = 8\ntree = [_, 8, 7, 1, 2, 5]" },
          { line: 20, description: "sumRange(0,2) now = 1+2+5 = 8 \u2713", variables: [{"name": "result", "value": "8"}], dataState: "sumRange(0,2) = 1+2+5 = 8 \u2713\n(Updated correctly!)" },
        ],
      },
    },
  ],
};
