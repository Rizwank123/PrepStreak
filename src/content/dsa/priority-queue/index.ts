import type { TopicContent } from '../../types';

export const priorityQueueContent: TopicContent = {
  slug: 'dsa/priority-queue', title: 'Priority Queue', category: 'dsa',
  theory: `# Priority Queue\n\nAbstract data type: dequeue always returns the element with the highest (or lowest) priority. Implemented with a heap.\n\n## When to Choose\n\n| Need | Use |\n|------|-----|\n| Always get min/max | Heap |\n| Sorted output once | Sort |\n| Frequent updates | Heap |\n| Median tracking | Two heaps |\n\n## Custom Priority in Go\n\n\`\`\`go\ntype Item struct { val, priority int }\ntype PQ []*Item\nfunc (pq PQ) Len() int            { return len(pq) }\nfunc (pq PQ) Less(i, j int) bool  { return pq[i].priority > pq[j].priority } // max\nfunc (pq PQ) Swap(i, j int)       { pq[i], pq[j] = pq[j], pq[i] }\nfunc (pq *PQ) Push(x any)         { *pq = append(*pq, x.(*Item)) }\nfunc (pq *PQ) Pop() any           { old:=*pq; n:=len(old); x:=old[n-1]; *pq=old[:n-1]; return x }\n\`\`\`\n`,
  examples: `# Priority Queue — Examples\n\n## Task Scheduler\n\n\`\`\`go\n// Greedy: always schedule the most frequent remaining task\n// Use max-heap by frequency\nfunc leastInterval(tasks []byte, n int) int {\n    freq := [26]int{}\n    for _, t := range tasks { freq[t-'A']++ }\n    // Push all frequencies into max-heap, simulate scheduling\n    // (implementation uses cooldown queue + heap)\n    _ = freq\n    return 0 // simplified\n}\n\`\`\`\n\n## Reorganize String\n\nGreedy: always pick the most frequent character that differs from the previous one.\nUse max-heap by character frequency.`,
  patterns: `# Priority Queue Patterns\n\n## 1. Greedy with PQ — always pick best candidate\n## 2. Event simulation — process events in time order\n## 3. Dijkstra — (cost, node) min-heap\n## 4. A* search — (f=g+h, node) min-heap`,
  interviewTips: `# Interview Tips — Priority Queue\n\n1. State clearly: min-PQ or max-PQ? Custom comparator?\n2. In Go, flip Less() to get max-heap: \`pq[i].priority > pq[j].priority\`.\n3. For Dijkstra, push (cost, node) pairs — lazy deletion handles stale entries.\n4. Announce O(log n) per operation and O(n) total space.`,
  commonMistakes: `# Common Mistakes — Priority Queue\n\n1. Using min-heap when max is needed (forget to negate or flip comparator).\n2. Not calling heap.Init before first push.\n3. Stale entries in Dijkstra — check visited set after pop.\n4. Wrong type assertion on Pop() return.`,
  revision: `# Priority Queue — Revision\n\n| Operation | Time |\n|-----------|------|\n| Push | O(log n) |\n| Pop | O(log n) |\n| Peek | O(1) |\n| Build | O(n) |\n`,
  codeExamples: [{ language: 'go', label: 'Max Priority Queue', code: `type MaxPQ []int
func (h MaxPQ) Len() int           { return len(h) }
func (h MaxPQ) Less(i, j int) bool { return h[i] > h[j] } // max-heap
func (h MaxPQ) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MaxPQ) Push(x any)        { *h = append(*h, x.(int)) }
func (h *MaxPQ) Pop() any {
	old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x
}` }],
  resources: [
    { title: 'Heap/PQ — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'container/heap — Go Docs', url: 'https://pkg.go.dev/container/heap', type: 'docs', free: true },
    { title: 'LeetCode Heap Tag', url: 'https://leetcode.com/tag/heap-priority-queue/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'pq-q1', question: 'To implement a max-heap in Go\'s container/heap, how do you change Less()?', options: ['h[i] < h[j]', 'h[i] > h[j]', 'h[i] == h[j]', 'h[j] < h[i] is the same'], correctIndex: 1, explanation: 'container/heap builds a min-heap using Less. Returning h[i] > h[j] inverts the ordering, producing a max-heap.' },
    { id: 'pq-q2', question: 'What is the time complexity per operation in a priority queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'], correctIndex: 2, explanation: 'Heap sift-up/down traverses O(log n) levels — each push and pop is O(log n).' },
    { id: 'pq-q3', question: 'In Dijkstra\'s algorithm, what does the priority queue store?', options: ['Only node IDs', '(distance, node) pairs', 'Edge weights', 'Visited nodes'], correctIndex: 1, explanation: 'Dijkstra pops the node with minimum known distance. The PQ stores (dist, node) so it always processes the nearest unvisited node.' },
    { id: 'pq-q4', question: 'Which function must be called after manually pushing elements into a Go heap slice?', options: ['heap.Push', 'heap.Fix', 'heap.Init', 'heap.Pop'], correctIndex: 2, explanation: 'heap.Init(h) establishes the heap invariant on an existing slice in O(n). Without it, Push/Pop behaviour is undefined.' },
  ],
  questions: [
    {
      id: 'lc-347',
      title: "Top K Frequent Elements",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Min-Heap',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["priority-queue", "heap", "hash-map"],
      problemStatement: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
      examples: [{"input": "nums = [1,1,1,2,2,3], k = 2", "output": "[1,2]"}, {"input": "nums = [1], k = 1", "output": "[1]"}],
      constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "k is valid"],
      hints: ["Count frequencies with a hash map", "Use a min-heap of size k sorted by frequency"],
      bruteForce: "Sort by frequency \u2014 O(n log n).",
      optimizedSolution: "Hash map + min-heap of size k. O(n log k)/O(n).",
      timeComplexity: 'O(n log k)',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func topKFrequent(nums []int, k int) []int {
    freq := make(map[int]int)
    for _, n := range nums { freq[n]++ }
    h := &freqHeap{}
    for num, count := range freq {
        heap.Push(h, item{num, count})
        if h.Len() > k { heap.Pop(h) }
    }
    result := []int{}
    for h.Len() > 0 {
        result = append(result, heap.Pop(h).(item).num)
    }
    return result
}

type item struct { num, count int }
type freqHeap []item
func (h freqHeap) Len() int { return len(h) }
func (h freqHeap) Less(i, j int) bool { return h[i].count < h[j].count }
func (h *freqHeap) Push(x any) { *h = append(*h, x.(item)) }
func (h *freqHeap) Pop() any { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/top-k-frequent-elements/"},
      related: ["K Closest Points", "Kth Largest"],
      dryRun: {
        title: "Top K Frequent \u2014 Hash Map + Min-Heap",
        input: "nums = [1,1,1,2,2,3], k = 2",
        result: "Result: [1, 2]",
        steps: [
          { line: 2, description: "Count frequencies: freq = {1:3, 2:2, 3:1}", variables: [{"name": "freq", "value": "{1:3, 2:2, 3:1}"}], dataState: "nums = [1, 1, 1, 2, 2, 3]\nfreq = {1: 3, 2: 2, 3: 1}" },
          { line: 5, description: "Push item{1,3}. Heap=[{1,3}]. Size=1 <= k=2", variables: [{"name": "heap", "value": "[{1,3}]"}], dataState: "Heap: [(1, freq=3)]\nsize=1 <= 2" },
          { line: 5, description: "Push item{2,2}. Heap=[{2,2},{1,3}]. Size=2 <= k=2", variables: [{"name": "heap", "value": "[{2,2}, {1,3}]"}], dataState: "Heap: [(2, freq=2), (1, freq=3)]\nsize=2 <= 2" },
          { line: 5, description: "Push item{3,1}. Heap=[{3,1},{1,3},{2,2}]. Size=3 > k=2. Pop min freq=1 ({3,1})", variables: [{"name": "heap", "value": "[{2,2}, {1,3}]"}, {"name": "popped", "value": "3 (freq=1)"}], dataState: "Heap: [(2, freq=2), (1, freq=3)]\nsize=3 > 2, pop (3, freq=1)" },
          { line: 8, description: "Extract: pop {2,2}, pop {1,3}. Result = [2, 1] (or [1,2])", variables: [{"name": "result", "value": "[1, 2]"}], dataState: "Result: [1, 2] \u2713\n(Top 2 most frequent)" },
        ],
      },
    },
    {
      id: 'lc-973',
      title: "K Closest Points to Origin",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Max-Heap',
      companies: ["Amazon", "Google", "Meta", "Asana"],
      tags: ["priority-queue", "heap", "geometry"],
      problemStatement: "Given an array of points and an integer k, return the k closest points to the origin (0, 0). Distance is Euclidean (squared to avoid sqrt).",
      examples: [{"input": "points = [[1,3],[-2,2]], k = 1", "output": "[[-2,2]]"}, {"input": "points = [[3,3],[5,-1],[-2,4]], k = 2", "output": "[[3,3],[-2,4]]"}],
      constraints: ["1 <= k <= points.length <= 10^4", "-10^4 < x, y < 10^4"],
      hints: ["Use a max-heap of size k", "Keep closest k by popping farthest when heap exceeds k"],
      bruteForce: "Sort all points by distance \u2014 O(n log n).",
      optimizedSolution: "Max-heap of size k. O(n log k)/O(k).",
      timeComplexity: 'O(n log k)',
      spaceComplexity: 'O(k)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func kClosest(points [][]int, k int) [][]int {
    h := &maxHeap{}
    for _, p := range points {
        dist := p[0]*p[0] + p[1]*p[1]
        heap.Push(h, point{p, dist})
        if h.Len() > k { heap.Pop(h) }
    }
    result := [][]int{}
    for h.Len() > 0 {
        result = append(result, heap.Pop(h).(point).coords)
    }
    return result
}

type point struct { coords []int; dist int }
type maxHeap []point
func (h maxHeap) Len() int { return len(h) }
func (h maxHeap) Less(i, j int) bool { return h[i].dist > h[j].dist }
func (h *maxHeap) Push(x any) { *h = append(*h, x.(point)) }
func (h *maxHeap) Pop() any { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/k-closest-points-to-origin/"},
      related: ["Top K Frequent", "Kth Largest"],
      dryRun: {
        title: "K Closest Points \u2014 Max-Heap of Size K",
        input: "points = [[3,3],[5,-1],[-2,4]], k = 2",
        result: "Result: [[3,3],[-2,4]]",
        steps: [
          { line: 4, description: "Push [3,3]: dist = 9+9=18. Heap=[[3,3,18]]. Size=1 <= k=2", variables: [{"name": "heap", "value": "[([3,3], 18)]"}], dataState: "Point [3,3]: dist = 3^2+3^2 = 18\nHeap: [([3,3], 18)]\nsize=1 <= 2" },
          { line: 4, description: "Push [5,-1]: dist = 25+1=26. Heap=[[5,-1,26],[3,3,18]]. Size=2 <= k=2", variables: [{"name": "heap", "value": "[([5,-1],26), ([3,3],18)]"}], dataState: "Point [5,-1]: dist = 25+1 = 26\nHeap: [([5,-1], 26), ([3,3], 18)]\nsize=2 <= 2" },
          { line: 5, description: "Push [-2,4]: dist = 4+16=20. Heap size=3 > k=2. Pop max=26 ([5,-1])", variables: [{"name": "heap", "value": "[([3,3],18), ([-2,4],20)]"}, {"name": "popped", "value": "[5,-1] (dist=26)"}], dataState: "Point [-2,4]: dist = 4+16 = 20\nHeap size=3 > 2, pop farthest\nPopped: [5,-1] (dist=26)\nHeap: [([3,3], 18), ([-2,4], 20)]" },
          { line: 8, description: "Extract remaining: [3,3] and [-2,4]. These are the k=2 closest.", variables: [{"name": "result", "value": "[[3,3], [-2,4]]"}], dataState: "Result: [[3,3], [-2,4]] \u2713\n(2 closest to origin)" },
        ],
      },
    },
  ],
};
