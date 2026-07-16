import type { TopicContent } from '../../types';

export const queueContent: TopicContent = {
  slug: 'dsa/queue', title: 'Queue', category: 'dsa',
  theory: `# Queue\n\nFIFO — First-In First-Out. Enqueue at back, dequeue from front.\n\n## Go Implementation\n\n\`\`\`go\nqueue := []int{}\nqueue = append(queue, x)  // enqueue\nfront := queue[0]         // peek\nqueue = queue[1:]         // dequeue (slow — use index)\n\`\`\`\n\n**Efficient queue with index:**\n\`\`\`go\nhead := 0\nfor head < len(queue) {\n    node := queue[head]; head++\n    // process and append children\n}\n\`\`\`\n\n## Deque (Double-Ended Queue)\n\n\`\`\`go\ndeque := []int{}\ndeque = append(deque, x)    // push back\ndeque = deque[:len(deque)-1] // pop back\ndeque = append([]int{x}, deque...)  // push front (slow)\n// For production use container/list or a ring buffer\n\`\`\`\n\n## Complexity\n| Op | Slice | Ring Buffer |\n|----|-------|-------------|\n| Enqueue | O(1) amort | O(1) |\n| Dequeue | O(n) slice / O(1) index | O(1) |\n`,
  examples: `# Queue — Examples\n\n## BFS Level-Order\n\n\`\`\`go\nfunc levelOrder(root *TreeNode) [][]int {\n    if root == nil { return nil }\n    res := [][]int{}\n    q := []*TreeNode{root}\n    for len(q) > 0 {\n        level := []int{}\n        size := len(q)\n        for i := 0; i < size; i++ {\n            node := q[i]\n            level = append(level, node.Val)\n            if node.Left != nil { q = append(q, node.Left) }\n            if node.Right != nil { q = append(q, node.Right) }\n        }\n        q = q[size:]\n        res = append(res, level)\n    }\n    return res\n}\n\`\`\`\n\n## Sliding Window Maximum (Monotonic Deque)\n\n\`\`\`go\nfunc maxSlidingWindow(nums []int, k int) []int {\n    dq, res := []int{}, []int{}\n    for i, v := range nums {\n        for len(dq) > 0 && nums[dq[len(dq)-1]] <= v { dq = dq[:len(dq)-1] }\n        dq = append(dq, i)\n        if dq[0] == i-k { dq = dq[1:] }\n        if i >= k-1 { res = append(res, nums[dq[0]]) }\n    }\n    return res\n}\n\`\`\``,
  patterns: `# Queue Patterns\n\n## 1. BFS Traversal — process nodes level by level\n## 2. Multi-Source BFS — start from multiple sources simultaneously\n## 3. Monotonic Deque — sliding window max/min in O(n)\n## 4. Task Scheduling — prioritise or round-robin with queue`,
  interviewTips: `# Interview Tips — Queue\n\n1. BFS uses a queue; DFS uses a stack (or recursion).\n2. For level-order BFS, capture \`len(queue)\` before the inner loop to process exactly one level.\n3. For sliding window max, use a monotonic deque (decreasing) — front holds current max.\n4. In Go, \`queue = queue[1:]\` works but is O(n). Use an index head for O(1) dequeue.`,
  commonMistakes: `# Common Mistakes — Queue\n\n1. Using slice dequeue \`queue[1:]\` — O(n) per operation. Use head index.\n2. Processing extra nodes in BFS level — capture size before inner loop.\n3. Forgetting to add children to queue in BFS.\n4. Not initialising queue with all sources in multi-source BFS.`,
  revision: `# Queue — Quick Revision\n\n| Problem | Pattern |\n|---------|---------|\n| Level-order traversal | BFS |\n| Shortest path (unweighted) | BFS |\n| Rotting oranges | Multi-source BFS |\n| Sliding window max | Monotonic deque |\n| Task scheduler | Priority queue |\n`,
  codeExamples: [{ language: 'go', label: 'BFS Level-Order', code: `func levelOrder(root *TreeNode) [][]int {
	if root == nil {
		return nil
	}
	res := [][]int{}
	q := []*TreeNode{root}
	for len(q) > 0 {
		size := len(q)
		level := make([]int, 0, size)
		for i := 0; i < size; i++ {
			node := q[i]
			level = append(level, node.Val)
			if node.Left != nil { q = append(q, node.Left) }
			if node.Right != nil { q = append(q, node.Right) }
		}
		q = q[size:]
		res = append(res, level)
	}
	return res
}` }],
  resources: [
    { title: 'Queue — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Queue — GfG', url: 'https://www.geeksforgeeks.org/queue-data-structure/', type: 'article', free: true },
    { title: 'LeetCode Queue Tag', url: 'https://leetcode.com/tag/queue/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'q-q1', question: 'Which traversal algorithm uses a queue?', options: ['DFS', 'BFS', 'Inorder', 'Postorder'], correctIndex: 1, explanation: 'BFS (Breadth-First Search) uses a queue to process nodes level by level.' },
    { id: 'q-q2', question: 'Why is `queue = queue[1:]` inefficient in Go?', options: ['It copies the entire slice', 'It leaks memory', 'It is O(n) — shifts all elements', 'It doesn\'t remove the element'], correctIndex: 2, explanation: 'Slicing from index 1 creates a new slice header but in Go the underlying array is not freed; more importantly it is O(n) for dequeue. An index-based approach is O(1).' },
    { id: 'q-q3', question: 'In BFS level-order traversal, why capture `size := len(queue)` before the inner loop?', options: ['Go requires it', 'Prevents infinite loop', 'Ensures only current-level nodes are processed', 'Speeds up iteration'], correctIndex: 2, explanation: 'Without capturing size, newly added children would be processed in the same level iteration.' },
    { id: 'q-q4', question: 'A monotonic decreasing deque gives what in O(1)?', options: ['Queue minimum', 'Queue maximum', 'Queue average', 'Queue size'], correctIndex: 1, explanation: 'The front of a monotonic decreasing deque always holds the index of the maximum element in the current window.' },
  ],
  questions: [
    {
      id: 'lc-232',
      title: "Implement Queue using Stacks",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Queue',
      companies: ["Amazon", "Microsoft"],
      tags: ["queue", "stack", "design"],
      problemStatement: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support push, pop, peek, and empty.",
      examples: [{"input": "push(1), push(2), peek()", "output": "1"}, {"input": "pop()", "output": "1"}, {"input": "empty()", "output": "false"}],
      constraints: ["1 <= x <= 9", "At most 100 calls", "All pop/peek calls are valid"],
      hints: ["Use two stacks: one for input, one for output", "Transfer elements when output stack is empty"],
      bruteForce: "Naive: transfer all for each operation \u2014 O(n) per pop.",
      optimizedSolution: "Amortized O(1): transfer only when output is empty. O(n)/O(n).",
      timeComplexity: 'O(1) amortized',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `type MyQueue struct {
    in, out []int
}

func (q *MyQueue) Push(x int) {
    q.in = append(q.in, x)
}

func (q *MyQueue) transfer() {
    for len(q.in) > 0 {
        q.out = append(q.out, q.in[len(q.in)-1])
        q.in = q.in[:len(q.in)-1]
    }
}

func (q *MyQueue) Pop() int {
    if len(q.out) == 0 { q.transfer() }
    val := q.out[len(q.out)-1]
    q.out = q.out[:len(q.out)-1]
    return val
}

func (q *MyQueue) Peek() int {
    if len(q.out) == 0 { q.transfer() }
    return q.out[len(q.out)-1]
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/implement-queue-using-stacks/"},
      related: ["Implement Stack using Queues"],
      dryRun: {
        title: "Queue using Stacks \u2014 Two Stack",
        input: "push(1), push(2), push(3), pop(), push(4), pop()",
        result: "FIFO order: pop returns 1, then 2",
        steps: [
          { line: 1, description: "Initialize in=[], out=[]", variables: [{"name": "in", "value": "[]"}, {"name": "out", "value": "[]"}], dataState: "in  = []\nout = []" },
          { line: 5, description: "push(1): in=[1]", variables: [{"name": "in", "value": "[1]"}], dataState: "in  = [1]\nout = []" },
          { line: 5, description: "push(2): in=[1,2]", variables: [{"name": "in", "value": "[1, 2]"}], dataState: "in  = [1, 2]\nout = []" },
          { line: 5, description: "push(3): in=[1,2,3]", variables: [{"name": "in", "value": "[1, 2, 3]"}], dataState: "in  = [1, 2, 3]\nout = []" },
          { line: 13, description: "pop(): out is empty. Transfer: pop from in, push to out. out=[3,2,1]", variables: [{"name": "in", "value": "[]"}, {"name": "out", "value": "[3, 2, 1]"}], dataState: "in  = []\nout = [3, 2, 1]\n(top of out = 1 = front of queue)" },
          { line: 14, description: "Pop from out: return 1. out=[3,2]", variables: [{"name": "out", "value": "[3, 2]"}, {"name": "result", "value": "1"}], dataState: "in  = []\nout = [3, 2]\npop() = 1 \u2713 (FIFO!)" },
          { line: 5, description: "push(4): in=[4]", variables: [{"name": "in", "value": "[4]"}, {"name": "out", "value": "[3, 2]"}], dataState: "in  = [4]\nout = [3, 2]" },
          { line: 14, description: "pop(): out not empty. Pop from out: return 2. out=[3]", variables: [{"name": "in", "value": "[4]"}, {"name": "out", "value": "[3]"}, {"name": "result", "value": "2"}], dataState: "in  = [4]\nout = [3]\npop() = 2 \u2713" },
        ],
      },
    },
    {
      id: 'lc-933',
      title: "Number of Recent Calls",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Queue',
      companies: ["Google", "Amazon"],
      tags: ["queue", "design"],
      problemStatement: "You have a RecentCounter that counts ping requests in the last 3000ms. Each ping adds a time t and returns the number of pings in [t-3000, t].",
      examples: [{"input": "ping(1), ping(100), ping(3001), ping(3002)", "output": "1, 2, 3, 3"}],
      constraints: ["1 <= t <= 10^9", "Each test calls at most 10^4 ping", "Calls made in increasing order"],
      hints: ["Use a queue to store ping times", "Remove pings older than t-3000 before counting"],
      bruteForce: "Scan all pings \u2014 O(n) per call.",
      optimizedSolution: "Queue: dequeue old pings, count remaining. O(1) amortized/O(n).",
      timeComplexity: 'O(1) amortized',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `type RecentCounter struct {
    queue []int
}

func (r *RecentCounter) Ping(t int) int {
    r.queue = append(r.queue, t)
    for r.queue[0] < t-3000 {
        r.queue = r.queue[1:]
    }
    return len(r.queue)
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/number-of-recent-calls/"},
      related: ["Moving Average"],
      dryRun: {
        title: "Recent Calls \u2014 Queue",
        input: "ping(1), ping(100), ping(3001), ping(3002)",
        result: "Results: 1, 2, 3, 3",
        steps: [
          { line: 3, description: "ping(1): queue=[1]. No old pings. Return 1", variables: [{"name": "queue", "value": "[1]"}, {"name": "result", "value": "1"}], dataState: "queue = [1]\nwindow = [1-3000, 1] = [-2999, 1]\ncount = 1" },
          { line: 3, description: "ping(100): queue=[1,100]. 1 >= 100-3000=-2900. Return 2", variables: [{"name": "queue", "value": "[1, 100]"}, {"name": "result", "value": "2"}], dataState: "queue = [1, 100]\nwindow = [-2900, 100]\ncount = 2" },
          { line: 3, description: "ping(3001): queue=[1,100,3001]. 1 >= 3001-3000=1. Return 3", variables: [{"name": "queue", "value": "[1, 100, 3001]"}, {"name": "result", "value": "3"}], dataState: "queue = [1, 100, 3001]\nwindow = [1, 3001]\ncount = 3" },
          { line: 4, description: "ping(3002): queue=[1,100,3001,3002]. 1 < 3002-3000=2. Dequeue 1.", variables: [{"name": "queue", "value": "[100, 3001, 3002]"}], dataState: "queue = [100, 3001, 3002]\nwindow = [2, 3002]\nRemoved: 1 (too old)" },
          { line: 5, description: "Return len(queue) = 3", variables: [{"name": "queue", "value": "[100, 3001, 3002]"}, {"name": "result", "value": "3"}], dataState: "queue = [100, 3001, 3002]\ncount = 3" },
        ],
      },
    },
  ],
};
