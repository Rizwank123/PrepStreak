import type { TopicContent } from '../../types';

export const graphContent: TopicContent = {
  slug: 'dsa/graph', title: 'Graph', category: 'dsa',
  theory: `# Graphs\n\n## Representations\n\n**Adjacency List** — \`map[int][]int\` or \`[][]int\`. Space O(V+E). Fast neighbour iteration.\n**Adjacency Matrix** — \`[][]bool\`. Space O(V²). O(1) edge check. Good for dense graphs.\n\n## Directed vs Undirected\n\nDirected: edges have direction. Undirected: add both directions in adjacency list.\n\n## Common Algorithms\n\n| Algorithm | Purpose | Complexity |\n|-----------|---------|----------|\n| BFS | Shortest path (unweighted) | O(V+E) |\n| DFS | Connectivity, cycle detection | O(V+E) |\n| Dijkstra | Shortest path (non-neg weights) | O((V+E)log V) |\n| Topological sort | Ordering in DAG | O(V+E) |\n| Union-Find | Connected components | O(α(n)) per op |\n| Kruskal/Prim | MST | O(E log E) |\n\n## Cycle Detection\n\n- **Undirected:** DFS with parent tracking\n- **Directed:** DFS with color (white/grey/black) or in-degree (Kahn's)\n`,
  examples: `# Graph — Examples\n\n## Number of Islands\n\n\`\`\`go\nfunc numIslands(grid [][]byte) int {\n    count := 0\n    var dfs func(r, c int)\n    dfs = func(r, c int) {\n        if r < 0 || r >= len(grid) || c < 0 || c >= len(grid[0]) || grid[r][c] != '1' { return }\n        grid[r][c] = '0'\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    }\n    for r := range grid {\n        for c := range grid[r] {\n            if grid[r][c] == '1' { count++; dfs(r, c) }\n        }\n    }\n    return count\n}\n\`\`\`\n\n## BFS Shortest Path\n\n\`\`\`go\nfunc shortestPath(graph [][]int, src, dst int) int {\n    visited := make([]bool, len(graph))\n    q := [][]int{{src, 0}}\n    for len(q) > 0 {\n        node, dist := q[0][0], q[0][1]; q = q[1:]\n        if node == dst { return dist }\n        if visited[node] { continue }\n        visited[node] = true\n        for _, nb := range graph[node] { q = append(q, []int{nb, dist+1}) }\n    }\n    return -1\n}\n\`\`\``,
  patterns: `# Graph Patterns\n\n## 1. DFS/BFS from all unvisited nodes — connected components, islands\n## 2. Multi-source BFS — rotten oranges, distance from multiple sources\n## 3. Topological sort — course schedule, build order\n## 4. Union-Find — dynamic connectivity\n## 5. Dijkstra — cheapest path with weights\n## 6. Cycle detection — directed (DFS colors), undirected (DFS parent)`,
  interviewTips: `# Interview Tips — Graph\n\n1. Always build the graph explicitly from the input before running algorithms.\n2. Use visited set/array to prevent revisiting — crucial for correctness.\n3. State clearly: directed vs undirected? Weighted? Cyclic?\n4. BFS for shortest path (unweighted), Dijkstra for weighted.\n5. Matrix problems are graphs — treat cells as nodes, 4-directional as edges.`,
  commonMistakes: `# Common Mistakes — Graph\n\n1. Not marking nodes visited before adding to BFS queue — can revisit.\n2. Forgetting to add both directions for undirected graph.\n3. Using DFS for shortest path in unweighted graph — use BFS.\n4. Not handling disconnected graphs — may need outer loop over all nodes.`,
  revision: `# Graph — Quick Revision\n\n| Problem | Algorithm |\n|---------|-----------|\n| Number of islands | DFS/BFS flood fill |\n| Shortest path (unwt) | BFS |\n| Detect cycle (directed) | DFS with 3-color |\n| Course schedule | Topological sort |\n| Connected components | DFS/Union-Find |\n| Cheapest path (wt) | Dijkstra |\n`,
  codeExamples: [{ language: 'go', label: 'Number of Islands', code: `func numIslands(grid [][]byte) int {
	count := 0
	var dfs func(r, c int)
	dfs = func(r, c int) {
		if r < 0 || r >= len(grid) || c < 0 || c >= len(grid[0]) || grid[r][c] != '1' {
			return
		}
		grid[r][c] = '0'
		dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
	}
	for r := range grid {
		for c := range grid[r] {
			if grid[r][c] == '1' {
				count++
				dfs(r, c)
			}
		}
	}
	return count
}` }],
  resources: [
    { title: 'Graphs — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Graph Algorithms — CP-Algorithms', url: 'https://cp-algorithms.com/graph/bfs.html', type: 'article', free: true },
    { title: 'LeetCode Graph Tag', url: 'https://leetcode.com/tag/graph/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'gr-q1', question: 'Which algorithm finds the shortest path in an unweighted graph?', options: ['DFS', 'Dijkstra', 'BFS', 'Bellman-Ford'], correctIndex: 2, explanation: 'BFS explores nodes level by level — the first time a node is reached, it\'s via the shortest path (fewest edges).' },
    { id: 'gr-q2', question: 'Space complexity of an adjacency list for a sparse graph with V vertices and E edges?', options: ['O(V²)', 'O(V+E)', 'O(E²)', 'O(V)'], correctIndex: 1, explanation: 'Each vertex stores its neighbours — total entries = 2E (undirected) or E (directed). Total space O(V+E).' },
    { id: 'gr-q3', question: 'For cycle detection in a directed graph, DFS uses how many states per node?', options: ['2 (visited/unvisited)', '3 (white/grey/black)', '4', '1'], correctIndex: 1, explanation: 'White = unvisited, Grey = in current DFS path, Black = fully processed. A grey→grey back edge indicates a cycle.' },
    { id: 'gr-q4', question: 'Multi-source BFS initialises the queue with:', options: ['Only the source node', 'All target nodes', 'All source nodes simultaneously', 'One random node'], correctIndex: 2, explanation: 'Multi-source BFS adds all starting nodes to the queue at distance 0, computing minimum distance from any source.' },
  ],
  questions: [
    {
      id: 'lc-200',
      title: "Number of Islands",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'DFS/BFS',
      companies: ["Amazon", "Google", "Meta", "Microsoft", "Bloomberg"],
      tags: ["graph", "dfs", "bfs", "matrix"],
      problemStatement: "Given an m x n 2D binary grid grid which represents a map of 1s (land) and 0s (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.",
      examples: [{"input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", "output": "3"}],
      constraints: ["m == grid.length", "1 <= m, n <= 300", "grid[i][j] is \"0\" or \"1\""],
      hints: ["DFS/BFS from each unvisited land cell", "Mark all connected land as visited (sink the island)"],
      bruteForce: "Check every cell pair \u2014 O((mn)^2).",
      optimizedSolution: "DFS from each 1, mark visited. O(m*n)/O(m*n).",
      timeComplexity: 'O(m*n)',
      spaceComplexity: 'O(m*n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func numIslands(grid [][]byte) int {
    count := 0
    m, n := len(grid), len(grid[0])
    for i := 0; i < m; i++ {
        for j := 0; j < n; j++ {
            if grid[i][j] == '1' {
                count++
                dfs(grid, i, j, m, n)
            }
        }
    }
    return count
}

func dfs(grid [][]byte, i, j, m, n int) {
    if i < 0 || i >= m || j < 0 || j >= n || grid[i][j] != '1' { return }
    grid[i][j] = '0'
    dfs(grid, i+1, j, m, n)
    dfs(grid, i-1, j, m, n)
    dfs(grid, i, j+1, m, n)
    dfs(grid, i, j-1, m, n)
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/number-of-islands/"},
      related: ["Max Area of Island", "Surrounded Regions"],
      dryRun: {
        title: "Number of Islands \u2014 DFS",
        input: "grid = 4x5 with 3 islands",
        result: "Count = 3",
        steps: [
          { line: 4, description: "i=0,j=0: grid[0][0]=\"1\". Found island! count=1. Start DFS.", variables: [{"name": "count", "value": "1"}, {"name": "pos", "value": "(0,0)"}], dataState: "Grid:\n[1] 1  0  0  0\n 1  1  0  0  0\n 0  0  1  0  0\n 0  0  0  1  1\nIsland 1 found at (0,0)" },
          { line: 11, description: "DFS marks all connected 1s as 0. Sink island at (0,0),(0,1),(1,0),(1,1).", variables: [{"name": "sunk", "value": "4 cells"}], dataState: "Grid after DFS:\n 0  0  0  0  0\n 0  0  0  0  0\n 0  0  1  0  0\n 0  0  0  1  1\nIsland 1 sunk" },
          { line: 4, description: "i=2,j=2: grid[2][2]=\"1\". Found island! count=2. DFS sinks it.", variables: [{"name": "count", "value": "2"}, {"name": "pos", "value": "(2,2)"}], dataState: "Grid:\n 0  0  0  0  0\n 0  0  0  0  0\n 0  0 [1] 0  0\n 0  0  0  1  1\nIsland 2 found at (2,2)" },
          { line: 4, description: "i=3,j=3: grid[3][3]=\"1\". Found island! count=3. DFS sinks (3,3),(3,4).", variables: [{"name": "count", "value": "3"}, {"name": "pos", "value": "(3,3)"}], dataState: "Grid:\n 0  0  0  0  0\n 0  0  0  0  0\n 0  0  0  0  0\n 0  0  0 [1] 1\nIsland 3 found at (3,3)" },
          { line: 7, description: "All cells scanned. Return count = 3", variables: [{"name": "result", "value": "3"}], dataState: "Result: 3 islands \u2713" },
        ],
      },
    },
    {
      id: 'lc-133',
      title: "Clone Graph",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'BFS/DFS',
      companies: ["Amazon", "Google", "Meta"],
      tags: ["graph", "bfs", "hash-map"],
      problemStatement: "Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node has a val and a list of neighbors.",
      examples: [{"input": "adjList = [[2,4],[1,3],[2,4],[1,3]]", "output": "cloned graph with same structure"}],
      constraints: ["1 <= Node.val <= 100", "1 <= number of nodes <= 100", "No repeated edges, no self-loops"],
      hints: ["Use a map to track old node to new node", "BFS or DFS: for each neighbor, create clone if needed and connect"],
      bruteForce: "Copy all nodes, then copy all edges \u2014 O(V+E).",
      optimizedSolution: "BFS with visited map. O(V+E)/O(V).",
      timeComplexity: 'O(V+E)',
      spaceComplexity: 'O(V)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func cloneGraph(node *Node) *Node {
    if node == nil { return nil }
    visited := make(map[*Node]*Node)
    queue := []*Node{node}
    visited[node] = &Node{Val: node.Val}
    for len(queue) > 0 {
        cur := queue[0]
        queue = queue[1:]
        for _, neighbor := range cur.Neighbors {
            if _, ok := visited[neighbor]; !ok {
                visited[neighbor] = &Node{Val: neighbor.Val}
                queue = append(queue, neighbor)
            }
            visited[cur].Neighbors = append(visited[cur].Neighbors, visited[neighbor])
        }
    }
    return visited[node]
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/clone-graph/"},
      related: ["Copy List with Random Pointer", "Number of Islands"],
      dryRun: {
        title: "Clone Graph \u2014 BFS",
        input: "4 nodes: 1-2-4, 2-1-3, 3-2-4, 4-1-3",
        result: "Cloned graph with same structure",
        steps: [
          { line: 3, description: "Create map and queue. Clone node 1, add to map and queue.", variables: [{"name": "visited", "value": "{1: clone(1)}"}, {"name": "queue", "value": "[1]"}], dataState: "Original: 1 -- 2\n          |    |\n          4 -- 3\nClone(1) created\nQueue: [1]" },
          { line: 8, description: "Process node 1. Neighbors: 2,4. Clone 2 and 4. Add to queue.", variables: [{"name": "visited", "value": "{1:c1, 2:c2, 4:c4}"}, {"name": "queue", "value": "[2, 4]"}], dataState: "Cloned: c1\n        / \\\n       c2  c4\nQueue: [2, 4]" },
          { line: 8, description: "Process node 2. Neighbors: 1(already cloned),3(new). Clone 3. Connect c2-c1, c2-c3.", variables: [{"name": "visited", "value": "{1:c1,2:c2,3:c3,4:c4}"}, {"name": "queue", "value": "[4, 3]"}], dataState: "Cloned: c1 -- c2\n         |      |\n         c4     c3\nQueue: [4, 3]" },
          { line: 8, description: "Process node 4. Neighbors: 1,3 (both cloned). Connect c4-c1, c4-c3.", variables: [{"name": "queue", "value": "[3]"}], dataState: "Cloned: c1 -- c2\n         |      |\n         c4 -- c3\nQueue: [3]" },
          { line: 8, description: "Process node 3. Neighbors: 2,4 (both cloned). Connect c3-c2, c3-c4. Done!", variables: [{"name": "queue", "value": "[]"}, {"name": "result", "value": "clone of 1"}], dataState: "Cloned: c1 -- c2\n         |      |\n         c4 -- c3\nComplete graph clone \u2713" },
        ],
      },
    },
  ],
};
