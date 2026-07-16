import type { TopicContent } from '../../types';

export const topologicalSortContent: TopicContent = {
  slug: 'dsa/topological-sort', title: 'Topological Sort', category: 'dsa',
  theory: `# Topological Sort\n\nLinear ordering of vertices in a **DAG** (Directed Acyclic Graph) such that for every edge u→v, u appears before v.\n\n## Kahn's Algorithm (BFS)\n\n\`\`\`go\nfunc topoSort(n int, prereqs [][]int) []int {\n    inDegree := make([]int, n)\n    graph := make([][]int, n)\n    for _, p := range prereqs {\n        graph[p[1]] = append(graph[p[1]], p[0])\n        inDegree[p[0]]++\n    }\n    q := []int{}\n    for i, d := range inDegree { if d == 0 { q = append(q, i) } }\n    order := []int{}\n    for len(q) > 0 {\n        node := q[0]; q = q[1:]\n        order = append(order, node)\n        for _, nb := range graph[node] {\n            inDegree[nb]--\n            if inDegree[nb] == 0 { q = append(q, nb) }\n        }\n    }\n    if len(order) == n { return order }\n    return nil // cycle detected\n}\n\`\`\`\n\n## DFS Post-Order\n\nDFS; push node to stack **after** all descendants are processed. Reverse stack = topological order.\n\n## Complexity\n\nO(V+E) time, O(V+E) space.`,
  examples: `# Topological Sort — Examples\n\n## Course Schedule (Can All Be Completed?)\n\n\`\`\`go\nfunc canFinish(numCourses int, prereqs [][]int) bool {\n    return topoSort(numCourses, prereqs) != nil\n}\n\`\`\`\n\n## Find Order of Courses\n\n\`\`\`go\nfunc findOrder(numCourses int, prereqs [][]int) []int {\n    order := topoSort(numCourses, prereqs)\n    if order == nil { return nil }\n    return order\n}\n\`\`\``,
  patterns: `# Topological Sort Patterns\n\n## 1. Kahn's (BFS) — easier cycle detection (len(order) != n)\n## 2. DFS post-order — natural for dependency resolution\n## 3. Layered topological sort — find nodes at each "level" (parallel processing)\n## 4. Alien Dictionary — build graph from character order constraints`,
  interviewTips: `# Interview Tips — Topological Sort\n\n1. Always clarify: is there guaranteed to be no cycle? (Topo sort only works on DAGs.)\n2. Kahn's is easier to implement and cycle detection is trivial (check output size vs n).\n3. For "minimum time to complete all tasks with dependencies", use layer-BFS.\n4. Build the graph explicitly before running — edge direction matters.`,
  commonMistakes: `# Common Mistakes — Topological Sort\n\n1. Wrong edge direction — prerequisites add edges TO the dependent node, not FROM.\n2. Not detecting cycles — check len(order) == n.\n3. Not initialising in-degree correctly.\n4. Modifying in-degree array of original graph — use a copy if needed.`,
  revision: `# Topological Sort — Quick Revision\n\n| | Kahn's (BFS) | DFS post-order |\n|-|-------------|----------------|\n| Cycle detect | len(order) < n | grey node encountered |\n| Complexity | O(V+E) | O(V+E) |\n| Implementation | Iterative | Recursive |\n| Use when | Default, cleaner | Dependency resolution |\n`,
  codeExamples: [{ language: 'go', label: "Kahn's Algorithm", code: `func topoSort(n int, edges [][]int) []int {
	indegree := make([]int, n)
	graph := make([][]int, n)
	for _, e := range edges {
		graph[e[1]] = append(graph[e[1]], e[0])
		indegree[e[0]]++
	}
	q := []int{}
	for i, d := range indegree {
		if d == 0 { q = append(q, i) }
	}
	order := []int{}
	for len(q) > 0 {
		node := q[0]; q = q[1:]
		order = append(order, node)
		for _, nb := range graph[node] {
			indegree[nb]--
			if indegree[nb] == 0 { q = append(q, nb) }
		}
	}
	if len(order) == n { return order }
	return nil
}` }],
  resources: [
    { title: 'Topological Sort — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Topological Sort — CP-Algorithms', url: 'https://cp-algorithms.com/graph/topological-sort.html', type: 'article', free: true },
    { title: 'LeetCode Topological Sort Tag', url: 'https://leetcode.com/tag/topological-sort/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'ts-q1', question: 'Topological sort is only valid for:', options: ['Undirected graphs', 'DAGs (Directed Acyclic Graphs)', 'Weighted graphs', 'Complete graphs'], correctIndex: 1, explanation: 'Topological sort requires a directed acyclic graph. A cycle means no valid topological ordering exists.' },
    { id: 'ts-q2', question: 'In Kahn\'s algorithm, how do you detect a cycle?', options: ['DFS colours', 'len(outputOrder) < n', 'Negative in-degree', 'Disconnected graph'], correctIndex: 1, explanation: 'Nodes in a cycle never reach in-degree 0 and thus never enter the queue. If output has fewer than n nodes, a cycle exists.' },
    { id: 'ts-q3', question: 'Kahn\'s algorithm processes nodes in what order?', options: ['DFS order', 'Nodes with in-degree 0 first', 'Random', 'Alphabetical'], correctIndex: 1, explanation: 'Kahn\'s starts with all in-degree-0 nodes (no prerequisites). After processing, it reduces neighbours\' in-degrees and enqueues those that reach 0.' },
    { id: 'ts-q4', question: 'What is the time complexity of topological sort (Kahn\'s or DFS)?', options: ['O(V²)', 'O(V log V)', 'O(V+E)', 'O(E log E)'], correctIndex: 2, explanation: 'Each vertex is processed once and each edge is examined once. Total: O(V+E).' },
  ],
  questions: [
    {
      id: 'lc-207',
      title: "Course Schedule",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Topological Sort / Cycle Detection',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["topological-sort", "bfs", "graph", "cycle-detection"],
      problemStatement: "There are numCourses courses labeled 0 to numCourses-1. Given prerequisites[i = [a, b]] means you must take b before a. Return true if you can finish all courses (no cycles).",
      examples: [{"input": "numCourses = 2, prerequisites = [[1,0]]", "output": "true"}, {"input": "numCourses = 2, prerequisites = [[1,0],[0,1]]", "output": "false"}],
      constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
      hints: ["Kahn algorithm: BFS with in-degree tracking", "If all nodes processed, no cycle"],
      bruteForce: "DFS cycle detection for each node \u2014 O(V^2).",
      optimizedSolution: "Kahn BFS: process zero in-degree nodes. O(V+E)/O(V+E).",
      timeComplexity: 'O(V+E)',
      spaceComplexity: 'O(V+E)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func canFinish(numCourses int, prerequisites [][]int) bool {
    adj := make([][]int, numCourses)
    indegree := make([]int, numCourses)
    for _, p := range prerequisites {
        adj[p[1]] = append(adj[p[1]], p[0])
        indegree[p[0]]++
    }
    queue := []int{}
    for i := 0; i < numCourses; i++ {
        if indegree[i] == 0 { queue = append(queue, i) }
    }
    count := 0
    for len(queue) > 0 {
        course := queue[0]
        queue = queue[1:]
        count++
        for _, next := range adj[course] {
            indegree[next]--
            if indegree[next] == 0 { queue = append(queue, next) }
        }
    }
    return count == numCourses
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/course-schedule/"},
      related: ["Course Schedule II", "Alien Dictionary"],
      dryRun: {
        title: "Course Schedule \u2014 Kahn BFS",
        input: "numCourses = 4, prereqs = [[1,0],[2,1],[3,2]]",
        result: "Return true (no cycle, linear chain)",
        steps: [
          { line: 8, description: "Build adjacency: 0\u21921, 1\u21922, 2\u21923. In-degrees: [0,1,1,1]", variables: [{"name": "indegree", "value": "[0,1,1,1]"}, {"name": "adj", "value": "0\u21921, 1\u21922, 2\u21923"}], dataState: "Graph: 0 \u2192 1 \u2192 2 \u2192 3\nIndegrees: [0, 1, 1, 1]\nQueue: [0] (in-degree 0)" },
          { line: 13, description: "Process 0. count=1. Neighbor 1: in-degree 1\u21920. Add to queue.", variables: [{"name": "count", "value": "1"}, {"name": "indegree", "value": "[0,0,1,1]"}, {"name": "queue", "value": "[1]"}], dataState: "Processed: 0 \u2713\nCount: 1\nCourse 1 now has in-degree 0\nQueue: [1]" },
          { line: 13, description: "Process 1. count=2. Neighbor 2: in-degree 1\u21920. Add to queue.", variables: [{"name": "count", "value": "2"}, {"name": "indegree", "value": "[0,0,0,1]"}, {"name": "queue", "value": "[2]"}], dataState: "Processed: 0, 1 \u2713\nCount: 2\nCourse 2 now has in-degree 0\nQueue: [2]" },
          { line: 13, description: "Process 2. count=3. Neighbor 3: in-degree 1\u21920. Add to queue.", variables: [{"name": "count", "value": "3"}, {"name": "indegree", "value": "[0,0,0,0]"}, {"name": "queue", "value": "[3]"}], dataState: "Processed: 0, 1, 2 \u2713\nCount: 3\nCourse 3 now has in-degree 0\nQueue: [3]" },
          { line: 13, description: "Process 3. count=4. No neighbors. Queue empty.", variables: [{"name": "count", "value": "4"}, {"name": "queue", "value": "[]"}], dataState: "Processed: 0, 1, 2, 3 \u2713\nCount: 4 = numCourses\nQueue: empty" },
          { line: 15, description: "count=4 == numCourses=4. Return true!", variables: [{"name": "result", "value": "true"}], dataState: "Result: true \u2713\n(All courses can be finished)" },
        ],
      },
    },
    {
      id: 'lc-210',
      title: "Course Schedule II",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Topological Sort',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["topological-sort", "bfs", "graph"],
      problemStatement: "Return the ordering of courses you should take to finish all courses. If impossible (cycle), return empty array.",
      examples: [{"input": "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]", "output": "[0,2,1,3] or [0,1,2,3]"}],
      constraints: ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
      hints: ["Same as Course Schedule but record the order", "Process zero in-degree nodes in BFS order"],
      bruteForce: "DFS postorder reversal.",
      optimizedSolution: "Kahn BFS, record order. O(V+E)/O(V+E).",
      timeComplexity: 'O(V+E)',
      spaceComplexity: 'O(V+E)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func findOrder(numCourses int, prerequisites [][]int) []int {
    adj := make([][]int, numCourses)
    indegree := make([]int, numCourses)
    for _, p := range prerequisites {
        adj[p[1]] = append(adj[p[1]], p[0])
        indegree[p[0]]++
    }
    queue := []int{}
    for i := 0; i < numCourses; i++ {
        if indegree[i] == 0 { queue = append(queue, i) }
    }
    order := []int{}
    for len(queue) > 0 {
        course := queue[0]
        queue = queue[1:]
        order = append(order, course)
        for _, next := range adj[course] {
            indegree[next]--
            if indegree[next] == 0 { queue = append(queue, next) }
        }
    }
    if len(order) == numCourses { return order }
    return []int{}
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/course-schedule-ii/"},
      related: ["Course Schedule I", "Alien Dictionary"],
      dryRun: {
        title: "Course Schedule II \u2014 Kahn BFS Order",
        input: "numCourses = 4, prereqs = [[1,0],[2,0],[3,1],[3,2]]",
        result: "Order: [0,1,2,3] or [0,2,1,3]",
        steps: [
          { line: 8, description: "Build graph: 0\u21921, 0\u21922, 1\u21923, 2\u21923. Indegrees: [0,1,1,2]", variables: [{"name": "indegree", "value": "[0,1,1,2]"}], dataState: "Graph:\n    0\n   / \\\n  1   2\n   \\ /\n    3\nIndegrees: [0, 1, 1, 2]\nQueue: [0]" },
          { line: 13, description: "Process 0. order=[0]. Neighbors 1,2: indegrees \u2192 [0,0,2]. Add 1,2.", variables: [{"name": "order", "value": "[0]"}, {"name": "indegree", "value": "[0,0,0,2]"}, {"name": "queue", "value": "[1,2]"}], dataState: "Order: [0]\nIndegrees: [0, 0, 0, 2]\nQueue: [1, 2]" },
          { line: 13, description: "Process 1. order=[0,1]. Neighbor 3: in-degree 2\u21921. Not zero yet.", variables: [{"name": "order", "value": "[0,1]"}, {"name": "indegree", "value": "[0,0,0,1]"}, {"name": "queue", "value": "[2]"}], dataState: "Order: [0, 1]\nCourse 3: in-degree = 1\nQueue: [2]" },
          { line: 13, description: "Process 2. order=[0,1,2]. Neighbor 3: in-degree 1\u21920. Add 3.", variables: [{"name": "order", "value": "[0,1,2]"}, {"name": "indegree", "value": "[0,0,0,0]"}, {"name": "queue", "value": "[3]"}], dataState: "Order: [0, 1, 2]\nCourse 3: in-degree = 0\nQueue: [3]" },
          { line: 13, description: "Process 3. order=[0,1,2,3]. No neighbors. Queue empty.", variables: [{"name": "order", "value": "[0,1,2,3]"}, {"name": "queue", "value": "[]"}], dataState: "Order: [0, 1, 2, 3]\nQueue: empty" },
          { line: 15, description: "len(order)=4 == numCourses. Return [0,1,2,3]", variables: [{"name": "result", "value": "[0,1,2,3]"}], dataState: "Result: [0, 1, 2, 3] \u2713\n(Valid topological order)" },
        ],
      },
    },
  ],
};
