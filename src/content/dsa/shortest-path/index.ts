import type { TopicContent } from '../../types';

export const shortestPathContent: TopicContent = {
  slug: 'dsa/shortest-path', title: 'Shortest Path', category: 'dsa',
  theory: `# Shortest Path Algorithms\n\n## Unweighted Graph — BFS\n\nO(V+E). BFS naturally finds shortest path by number of edges.\n\n## Dijkstra — Non-Negative Weights\n\nGreedy: always expand the nearest unvisited node. Uses min-heap.\n\n\`\`\`go\nfunc dijkstra(graph [][][2]int, src int) []int {\n    n := len(graph)\n    dist := make([]int, n)\n    for i := range dist { dist[i] = 1<<63-1 }\n    dist[src] = 0\n    // min-heap: [dist, node]\n    h := &PQ{[2]int{0, src}}\n    heap.Init(h)\n    for h.Len() > 0 {\n        curr := heap.Pop(h).([2]int)\n        d, u := curr[0], curr[1]\n        if d > dist[u] { continue } // stale entry\n        for _, e := range graph[u] {\n            v, w := e[0], e[1]\n            if dist[u]+w < dist[v] {\n                dist[v] = dist[u]+w\n                heap.Push(h, [2]int{dist[v], v})\n            }\n        }\n    }\n    return dist\n}\n\`\`\`\n\nComplexity: O((V+E) log V)\n\n## Bellman-Ford — Handles Negative Weights\n\nRelax all edges V-1 times. O(VE). Detect negative cycle on Vth relaxation.\n\n## Floyd-Warshall — All-Pairs Shortest Path\n\n\`\`\`go\nfor k := 0; k < n; k++ {\n    for i := 0; i < n; i++ {\n        for j := 0; j < n; j++ {\n            if dist[i][k]+dist[k][j] < dist[i][j] {\n                dist[i][j] = dist[i][k]+dist[k][j]\n            }\n        }\n    }\n}\n\`\`\`\nO(V³) time, O(V²) space.`,
  examples: `# Shortest Path — Examples\n\n## Network Delay Time (Dijkstra)\n\n\`\`\`go\nfunc networkDelayTime(times [][]int, n, k int) int {\n    graph := make([][][2]int, n+1)\n    for _, t := range times {\n        graph[t[0]] = append(graph[t[0]], [2]int{t[1], t[2]})\n    }\n    dist := dijkstra(graph, k)\n    ans := 0\n    for i := 1; i <= n; i++ {\n        if dist[i] == 1<<63-1 { return -1 }\n        if dist[i] > ans { ans = dist[i] }\n    }\n    return ans\n}\n\`\`\``,
  patterns: `# Shortest Path Patterns\n\n## 1. Unweighted → BFS\n## 2. Non-negative weights → Dijkstra\n## 3. Negative weights (no negative cycle) → Bellman-Ford\n## 4. All pairs → Floyd-Warshall\n## 5. 0-1 weights → 0-1 BFS with deque (front if 0 cost, back if 1 cost)`,
  interviewTips: `# Interview Tips — Shortest Path\n\n1. Always clarify: weighted? negative weights? single source or all pairs?\n2. Dijkstra fails with negative weights — use Bellman-Ford.\n3. Use lazy deletion in Dijkstra: skip stale entries with \`if d > dist[u] continue\`.\n4. For grid shortest path with uniform cost, BFS is simpler than Dijkstra.`,
  commonMistakes: `# Common Mistakes — Shortest Path\n\n1. Using Dijkstra with negative weights — incorrect results.\n2. Not handling stale entries in Dijkstra's heap — causes repeated processing.\n3. Off-by-one in Floyd-Warshall — k must be the intermediate node, not source/dest.\n4. Not initialising distances to infinity — default 0 gives wrong answers.`,
  revision: `# Shortest Path — Quick Revision\n\n| Algorithm | Weights | Complexity | Use Case |\n|-----------|---------|------------|----------|\n| BFS | Unweighted | O(V+E) | Default |\n| Dijkstra | Non-negative | O((V+E)log V) | Standard |\n| Bellman-Ford | Any | O(VE) | Negative weights |\n| Floyd-Warshall | Any | O(V³) | All pairs |\n| 0-1 BFS | 0 or 1 | O(V+E) | Binary costs |\n`,
  codeExamples: [{ language: 'go', label: 'Dijkstra', code: `// Simplified Dijkstra using adjacency list
func dijkstra(graph [][][2]int, src int) []int {
	n := len(graph)
	dist := make([]int, n)
	for i := range dist { dist[i] = 1<<62 }
	dist[src] = 0
	// Priority queue: [dist, node] - implement with container/heap
	pq := [][]int{{0, src}}
	for len(pq) > 0 {
		// pop min-distance entry
		d, u := pq[0][0], pq[0][1]
		pq = pq[1:]
		if d > dist[u] { continue }
		for _, e := range graph[u] {
			v, w := e[0], e[1]
			if nd := dist[u] + w; nd < dist[v] {
				dist[v] = nd
				pq = append(pq, []int{dist[v], v})
			}
		}
	}
	return dist
}` }],
  resources: [
    { title: 'Shortest Path — CP-Algorithms', url: 'https://cp-algorithms.com/graph/dijkstra.html', type: 'article', free: true },
    { title: 'Dijkstra — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'LeetCode Graph Tag', url: 'https://leetcode.com/tag/graph/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'sp-q1', question: 'Why does Dijkstra fail with negative edge weights?', options: ['It uses a min-heap', 'It can\'t process cycles', 'A visited node can have its distance updated later via a negative edge', 'It requires sorted edges'], correctIndex: 2, explanation: 'Dijkstra marks a node as "finalised" when first popped. A negative edge can offer a shorter path to an already-finalised node, which Dijkstra ignores.' },
    { id: 'sp-q2', question: 'What is the time complexity of Dijkstra with a binary heap?', options: ['O(V²)', 'O(E log V)', 'O((V+E) log V)', 'O(VE)'], correctIndex: 2, explanation: 'Each vertex is processed once (V pops, O(log V) each) and each edge triggers at most one push — total O((V+E) log V).' },
    { id: 'sp-q3', question: 'Bellman-Ford relaxes all edges how many times?', options: ['E times', 'V times', 'V-1 times', 'log V times'], correctIndex: 2, explanation: 'A shortest path can have at most V-1 edges. Bellman-Ford relaxes all edges V-1 times to propagate updates through any chain of edges.' },
    { id: 'sp-q4', question: 'Floyd-Warshall solves which type of shortest path problem?', options: ['Single source', 'Single destination', 'All pairs', 'Minimum spanning tree'], correctIndex: 2, explanation: 'Floyd-Warshall computes shortest paths between ALL pairs of vertices in O(V³).' },
  ],
  questions: [
    {
      id: 'lc-743',
      title: "Network Delay Time",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Dijkstra',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["shortest-path", "dijkstra", "graph", "heap"],
      problemStatement: "You are given a network of n nodes, labeled 1 to n. Given times[i] = (u, v, w) for a directed edge from u to v with weight w. Return the time for all nodes to receive the signal from node k, or -1 if impossible.",
      examples: [{"input": "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", "output": "2"}],
      constraints: ["1 <= k <= n <= 100", "1 <= times.length <= 6000", "1 <= u, v <= n", "1 <= w <= 100"],
      hints: ["Dijkstra with min-heap from source k", "Track shortest distance to each node", "Answer = max of all distances"],
      bruteForce: "Bellman-Ford \u2014 O(VE).",
      optimizedSolution: "Dijkstra with min-heap. O((V+E) log V)/O(V).",
      timeComplexity: 'O((V+E) log V)',
      spaceComplexity: 'O(V)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func networkDelayTime(times [][]int, n, k int) int {
    adj := make([][][2]int, n+1)
    for _, t := range times {
        adj[t[0]] = append(adj[t[0]], [2]int{t[1], t[2]})
    }
    dist := make([]int, n+1)
    for i := range dist { dist[i] = 1 << 30 }
    dist[k] = 0
    h := &minHeap{{k, 0}}
    for h.Len() > 0 {
        cur := heap.Pop(h).([2]int)
        node, d := cur[0], cur[1]
        if d > dist[node] { continue }
        for _, edge := range adj[node] {
            next, w := edge[0], edge[1]
            if dist[node]+w < dist[next] {
                dist[next] = dist[node] + w
                heap.Push(h, [2]int{next, dist[next]})
            }
        }
    }
    maxDist := 0
    for i := 1; i <= n; i++ {
        if dist[i] == 1<<30 { return -1 }
        if dist[i] > maxDist { maxDist = dist[i] }
    }
    return maxDist
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/network-delay-time/"},
      related: ["Cheapest Flights", "Path with Minimum Effort"],
      dryRun: {
        title: "Network Delay Time \u2014 Dijkstra",
        input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2",
        result: "Result = 2",
        steps: [
          { line: 6, description: "Build adjacency list. Init dist = [inf, inf, 0, inf, inf]. Heap = [(2, 0)]", variables: [{"name": "dist", "value": "[inf, inf, 0, inf, inf]"}, {"name": "heap", "value": "[(2,0)]"}], dataState: "Graph:\n  2 --1--> 1\n  2 --1--> 3\n  3 --1--> 4\ndist = [_, inf, 0, inf, inf]\nHeap: [(2, d=0)]" },
          { line: 11, description: "Pop (2,0). Neighbors: 1 (w=1), 3 (w=1). dist[1]=1, dist[3]=1. Push both.", variables: [{"name": "dist", "value": "[inf, 1, 0, 1, inf]"}, {"name": "heap", "value": "[(1,1), (3,1)]"}], dataState: "Process node 2 (d=0)\n  \u2192 1: dist = 0+1 = 1 \u2713\n  \u2192 3: dist = 0+1 = 1 \u2713\nHeap: [(1,1), (3,1)]" },
          { line: 11, description: "Pop (1,1). No neighbors from node 1.", variables: [{"name": "dist", "value": "[inf, 1, 0, 1, inf]"}, {"name": "heap", "value": "[(3,1)]"}], dataState: "Process node 1 (d=1)\nNo outgoing edges.\nHeap: [(3,1)]" },
          { line: 11, description: "Pop (3,1). Neighbor: 4 (w=1). dist[4] = 1+1 = 2. Push (4,2).", variables: [{"name": "dist", "value": "[inf, 1, 0, 1, 2]"}, {"name": "heap", "value": "[(4,2)]"}], dataState: "Process node 3 (d=1)\n  \u2192 4: dist = 1+1 = 2 \u2713\nHeap: [(4,2)]" },
          { line: 11, description: "Pop (4,2). No neighbors. Heap empty. Done.", variables: [{"name": "dist", "value": "[inf, 1, 0, 1, 2]"}, {"name": "heap", "value": "[]"}], dataState: "Process node 4 (d=2)\nNo outgoing edges.\nHeap: empty" },
          { line: 17, description: "Max dist = max(1, 0, 1, 2) = 2. Return 2.", variables: [{"name": "maxDist", "value": "2"}, {"name": "result", "value": "2"}], dataState: "dist = [_, 1, 0, 1, 2]\nmax = 2\nResult: 2 \u2713" },
        ],
      },
    },
  ],
};
