import type { TopicContent } from '../../types';

export const heapContent: TopicContent = {
  slug: 'dsa/heap', title: 'Heap', category: 'dsa',
  theory: `# Heap / Priority Queue\n\n## Binary Heap\n\nComplete binary tree stored as array. Parent at i, children at 2i+1 and 2i+2.\n\n**Min-heap:** parent ≤ children. Root = global minimum.\n**Max-heap:** parent ≥ children. Root = global maximum.\n\n## Operations\n\n| Op | Time |\n|----|------|\n| Insert (push) | O(log n) |\n| Remove top (pop) | O(log n) |\n| Peek top | O(1) |\n| Build from array | O(n) |\n\n## Go — container/heap\n\n\`\`\`go\nimport "container/heap"\n\ntype MinHeap []int\nfunc (h MinHeap) Len() int           { return len(h) }\nfunc (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }\nfunc (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }\nfunc (h *MinHeap) Push(x any)        { *h = append(*h, x.(int)) }\nfunc (h *MinHeap) Pop() any {\n    old := *h; n := len(old)\n    x := old[n-1]; *h = old[:n-1]; return x\n}\n\nh := &MinHeap{3,1,2}\nheap.Init(h)\nheap.Push(h, 0)\ntop := heap.Pop(h).(int) // 0\n\`\`\`\n`,
  examples: `# Heap — Examples\n\n## Kth Largest Element\n\n\`\`\`go\nfunc findKthLargest(nums []int, k int) int {\n    h := &MinHeap{}\n    heap.Init(h)\n    for _, v := range nums {\n        heap.Push(h, v)\n        if h.Len() > k { heap.Pop(h) }\n    }\n    return (*h)[0]\n}\n\`\`\`\n\nKeep a min-heap of size k. The root is the kth largest.\n\n## Merge K Sorted Lists\n\n\`\`\`go\n// Push head of each list into min-heap\n// Pop minimum, push its Next\n// O((n log k)) where n = total nodes, k = number of lists\n\`\`\`\n\n## Find Median from Data Stream\n\nUse two heaps: max-heap for lower half, min-heap for upper half. Balance sizes — median = top(s) or average of both tops.`,
  patterns: `# Heap Patterns\n\n## 1. Top K Elements — min-heap of size k, pop when size exceeds k\n## 2. Kth Largest/Smallest — size-k heap\n## 3. Merge K Sorted — heap of (value, list index)\n## 4. Median Stream — two heaps (lower max + upper min)\n## 5. Task Scheduling — max-heap by frequency\n## 6. Dijkstra — min-heap (distance, node)`,
  interviewTips: `# Interview Tips — Heap\n\n1. For "kth largest" use min-heap size k; for "kth smallest" use max-heap size k.\n2. Always implement the full container/heap interface in Go (6 methods).\n3. Two-heap median: maintain |max-heap size - min-heap size| ≤ 1.\n4. State heap operations complexity: push/pop O(log n), peek O(1), build O(n).`,
  commonMistakes: `# Common Mistakes — Heap\n\n1. Using max-heap when min-heap is needed (or vice versa).\n2. Forgetting heap.Init() before first use.\n3. Type asserting Pop() to wrong type.\n4. Not rebalancing the two heaps in median problem.\n5. Building heap with O(n log n) inserts instead of O(n) heap.Init().`,
  revision: `# Heap — Quick Revision\n\n| Problem | Heap Type | Size |\n|---------|----------|------|\n| Kth largest | Min-heap | k |\n| Kth smallest | Max-heap | k |\n| Merge k sorted | Min-heap | k |\n| Median stream | Two heaps | n/2 each |\n| Task scheduler | Max-heap | distinct tasks |\n| Dijkstra | Min-heap | all nodes |\n`,
  codeExamples: [{ language: 'go', label: 'Kth Largest', code: `type MinHeap []int
func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() any {
	old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x
}

func findKthLargest(nums []int, k int) int {
	h := &MinHeap{}
	heap.Init(h)
	for _, v := range nums {
		heap.Push(h, v)
		if h.Len() > k { heap.Pop(h) }
	}
	return (*h)[0]
}` }],
  resources: [
    { title: 'Heap — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Heap — GfG', url: 'https://www.geeksforgeeks.org/heap-data-structure/', type: 'article', free: true },
    { title: 'LeetCode Heap Tag', url: 'https://leetcode.com/tag/heap-priority-queue/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'hp-q1', question: 'What is the time complexity of building a heap from n elements using heapify?', options: ['O(n log n)', 'O(n)', 'O(log n)', 'O(n²)'], correctIndex: 1, explanation: 'heap.Init / heapify runs in O(n) — nodes near the bottom require little sifting. The sum of heights in a complete binary tree is O(n).' },
    { id: 'hp-q2', question: 'To find the kth largest element efficiently, use:', options: ['Max-heap of all n', 'Min-heap of size k', 'Sorted array', 'Max-heap of size k'], correctIndex: 1, explanation: 'Keep a min-heap of size k. When a new element is larger than the root (kth largest so far), pop root and push new element.' },
    { id: 'hp-q3', question: 'What is the time complexity of a single push/pop on a heap?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], correctIndex: 2, explanation: 'Sift up (push) or sift down (pop) traverses at most the height of the tree = log n.' },
    { id: 'hp-q4', question: 'In the "Find Median from Data Stream" problem, the median equals the top of the max-heap when:', options: ['Both heaps are equal size', 'Max-heap has one more element', 'Min-heap has one more element', 'Either heap is empty'], correctIndex: 1, explanation: 'When the lower max-heap has one more element than upper min-heap, the root of max-heap is the median of an odd-count stream.' },
  ],
  questions: [
    {
      id: 'lc-215',
      title: "Kth Largest Element in an Array",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Min-Heap',
      companies: ["Amazon", "Facebook", "Google", "Microsoft"],
      tags: ["heap", "priority-queue", "sorting"],
      problemStatement: "Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.",
      examples: [{"input": "nums = [3,2,1,5,6,4], k = 2", "output": "5"}, {"input": "nums = [3,2,3,1,2,4,5,5,6], k = 4", "output": "4"}],
      constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
      hints: ["Build a min-heap of size k", "For elements beyond k, if larger than heap top, replace"],
      bruteForce: "Sort the array and pick index n-k \u2014 O(n log n).",
      optimizedSolution: "Min-heap of size k. O(n log k)/O(k).",
      timeComplexity: 'O(n log k)',
      spaceComplexity: 'O(k)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func findKthLargest(nums []int, k int) int {
    h := &minHeap{}
    for _, n := range nums {
        heap.Push(h, n)
        if h.Len() > k {
            heap.Pop(h)
        }
    }
    return (*h)[0]
}

type minHeap []int
func (h minHeap) Len() int { return len(h) }
func (h minHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h *minHeap) Push(x any) { *h = append(*h, x.(int)) }
func (h *minHeap) Pop() any { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/kth-largest-element-in-an-array/"},
      related: ["K Closest Points", "Top K Frequent"],
      dryRun: {
        title: "Kth Largest \u2014 Min-Heap of Size K",
        input: "nums = [3,2,1,5,6,4], k = 2",
        result: "2nd largest = 5",
        steps: [
          { line: 2, description: "Initialize empty min-heap h", variables: [{"name": "h", "value": "[]"}, {"name": "k", "value": "2"}], dataState: "heap = []\nk = 2" },
          { line: 4, description: "Push 3. Heap=[3]. Len=1 <= k=2", variables: [{"name": "h", "value": "[3]"}], dataState: "heap = [3]\nsize = 1 <= 2, keep" },
          { line: 4, description: "Push 2. Heap=[2,3]. Len=2 <= k=2", variables: [{"name": "h", "value": "[2, 3]"}], dataState: "heap = [2, 3]\nsize = 2 <= 2, keep" },
          { line: 5, description: "Push 1. Heap=[1,3,2]. Len=3 > k=2. Pop min(1). Heap=[2,3]", variables: [{"name": "h", "value": "[2, 3]"}, {"name": "popped", "value": "1"}], dataState: "heap = [2, 3]\nsize = 3 > 2, pop 1" },
          { line: 5, description: "Push 5. Heap=[2,3,5]. Len=3 > k=2. Pop min(2). Heap=[3,5]", variables: [{"name": "h", "value": "[3, 5]"}, {"name": "popped", "value": "2"}], dataState: "heap = [3, 5]\nsize = 3 > 2, pop 2" },
          { line: 5, description: "Push 6. Heap=[3,5,6]. Len=3 > k=2. Pop min(3). Heap=[5,6]", variables: [{"name": "h", "value": "[5, 6]"}, {"name": "popped", "value": "3"}], dataState: "heap = [5, 6]\nsize = 3 > 2, pop 3" },
          { line: 5, description: "Push 4. Heap=[4,6,5]. Len=3 > k=2. Pop min(4). Heap=[5,6]", variables: [{"name": "h", "value": "[5, 6]"}, {"name": "popped", "value": "4"}], dataState: "heap = [5, 6]\nsize = 3 > 2, pop 4" },
          { line: 7, description: "Return heap top = 5. The 2nd largest is 5!", variables: [{"name": "result", "value": "5"}], dataState: "heap = [5, 6]\ntop = 5 = 2nd largest \u2713" },
        ],
      },
    },
    {
      id: 'lc-703',
      title: "Kth Largest Element in a Stream",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Min-Heap',
      companies: ["Amazon", "Google"],
      tags: ["heap", "priority-queue", "design"],
      problemStatement: "Design a class to find the kth largest element in a stream. The class receives k and an initial array, then adds elements one at a time and returns the kth largest.",
      examples: [{"input": "k=3, arr=[4,5,8,2], add(3), add(5), add(10)", "output": "4, 5, 8"}],
      constraints: ["1 <= k <= 10^4", "0 <= nums.length <= 10^4"],
      hints: ["Maintain a min-heap of size k", "On add, push and pop if over k"],
      bruteForce: "Sort each time \u2014 O(n log n) per add.",
      optimizedSolution: "Min-heap of size k. O(log k) per add/O(k).",
      timeComplexity: 'O(log k) per add',
      spaceComplexity: 'O(k)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `type KthLargest struct {
    k int
    h *minHeap
}

func Constructor(k int, nums []int) KthLargest {
    kl := KthLargest{k: k, h: &minHeap{}}
    for _, n := range nums {
        heap.Push(kl.h, n)
        if kl.h.Len() > k { heap.Pop(kl.h) }
    }
    return kl
}

func (kl *KthLargest) Add(val int) int {
    heap.Push(kl.h, val)
    if kl.h.Len() > kl.k { heap.Pop(kl.h) }
    return (*kl.h)[0]
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/kth-largest-element-in-a-stream/"},
      related: ["Kth Largest Element", "Top K Frequent"],
      dryRun: {
        title: "Kth Largest Stream \u2014 Min-Heap",
        input: "k=3, arr=[4,5,8,2], add(3), add(5), add(10)",
        result: "Results: 4, 5, 8",
        steps: [
          { line: 5, description: "Init: push 4,5,8,2. After filtering to k=3, heap=[4,5,8]", variables: [{"name": "h", "value": "[4, 5, 8]"}, {"name": "k", "value": "3"}], dataState: "heap = [4, 5, 8]\n(top = 4 = 3rd largest)" },
          { line: 11, description: "add(3): push 3. heap=[3,5,8,4]. Len=4 > 3. Pop 3. heap=[4,5,8]", variables: [{"name": "h", "value": "[4, 5, 8]"}, {"name": "result", "value": "4"}], dataState: "heap = [4, 5, 8]\nadd(3) = 4 (3rd largest)" },
          { line: 11, description: "add(5): push 5. heap=[4,5,8,5]. Len=4 > 3. Pop 4. heap=[5,8,5]", variables: [{"name": "h", "value": "[5, 5, 8]"}, {"name": "result", "value": "5"}], dataState: "heap = [5, 5, 8]\nadd(5) = 5 (3rd largest)" },
          { line: 11, description: "add(10): push 10. heap=[5,8,10,5]. Len=4 > 3. Pop 5. heap=[5,8,10]", variables: [{"name": "h", "value": "[5, 8, 10]"}, {"name": "result", "value": "8"}], dataState: "heap = [5, 8, 10]\nadd(10) = 8 (3rd largest)" },
        ],
      },
    },
  ],
};
