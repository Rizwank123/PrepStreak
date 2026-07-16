import type { TopicContent } from '../../types';

export const unionFindContent: TopicContent = {
  slug: 'dsa/union-find', title: 'Union Find', category: 'dsa',
  theory: `# Union-Find (Disjoint Set)\n\n## Core Operations\n\n- **Find(x)** — return the root/representative of x's component\n- **Union(x, y)** — merge x's component with y's component\n\n## Optimisations\n\n**Path compression:** point each node directly to root on Find.\n**Union by rank:** attach smaller tree to larger. Prevents degradation to O(n).\n\nWith both: amortised O(α(n)) ≈ O(1) per operation.\n\n## Implementation\n\n\`\`\`go\ntype UF struct { parent, rank []int }\n\nfunc NewUF(n int) *UF {\n    p := make([]int, n)\n    r := make([]int, n)\n    for i := range p { p[i] = i }\n    return &UF{p, r}\n}\n\nfunc (u *UF) Find(x int) int {\n    if u.parent[x] != x { u.parent[x] = u.Find(u.parent[x]) } // path compression\n    return u.parent[x]\n}\n\nfunc (u *UF) Union(x, y int) bool {\n    rx, ry := u.Find(x), u.Find(y)\n    if rx == ry { return false } // already same component\n    if u.rank[rx] < u.rank[ry] { rx, ry = ry, rx }\n    u.parent[ry] = rx\n    if u.rank[rx] == u.rank[ry] { u.rank[rx]++ }\n    return true\n}\n\`\`\`\n\n## Use Cases\n\n- Connected components in graph\n- Detect cycle (if Union returns false, edge creates cycle)\n- Kruskal's MST\n- Redundant connection\n- Number of provinces\n`,
  examples: `# Union-Find — Examples\n\n## Number of Connected Components\n\n\`\`\`go\nfunc countComponents(n int, edges [][]int) int {\n    uf := NewUF(n)\n    count := n\n    for _, e := range edges {\n        if uf.Union(e[0], e[1]) { count-- }\n    }\n    return count\n}\n\`\`\`\n\n## Detect Cycle in Undirected Graph\n\n\`\`\`go\nfor _, e := range edges {\n    if !uf.Union(e[0], e[1]) {\n        // Union returns false → both nodes already in same component → cycle\n        return true\n    }\n}\nreturn false\n\`\`\``,
  patterns: `# Union-Find Patterns\n\n## 1. Dynamic connectivity — online edge insertions, query connectivity\n## 2. Offline MST (Kruskal's) — sort edges, union if different components\n## 3. Redundant connection — union edges; cycle detected = redundant edge\n## 4. Grid connectivity — use 2D → 1D mapping: index = r*cols + c`,
  interviewTips: `# Interview Tips — Union-Find\n\n1. Union-Find is best for **offline** graph connectivity (BFS/DFS is fine for online).\n2. Always implement both optimisations (path compression + union by rank).\n3. count-- in Union means each successful merge reduces component count by 1.\n4. For grid problems, add a virtual node for boundary connections.`,
  commonMistakes: `# Common Mistakes — Union-Find\n\n1. Not initialising parent[i] = i.\n2. Forgetting path compression in Find — degrades to O(n).\n3. Wrong union by rank — rank should only increase when two trees of equal rank merge.\n4. Not returning bool from Union to track whether merge actually happened.`,
  revision: `# Union-Find — Quick Revision\n\n| Op | With both optimisations |\n|----|------------------------|\n| Find | O(α(n)) ≈ O(1) |\n| Union | O(α(n)) ≈ O(1) |\n| Build | O(n) |\n`,
  codeExamples: [{ language: 'go', label: 'Union-Find', code: `type UF struct{ parent, rank []int }

func NewUF(n int) *UF {
	p, r := make([]int, n), make([]int, n)
	for i := range p { p[i] = i }
	return &UF{p, r}
}

func (u *UF) Find(x int) int {
	if u.parent[x] != x {
		u.parent[x] = u.Find(u.parent[x])
	}
	return u.parent[x]
}

func (u *UF) Union(x, y int) bool {
	rx, ry := u.Find(x), u.Find(y)
	if rx == ry { return false }
	if u.rank[rx] < u.rank[ry] { rx, ry = ry, rx }
	u.parent[ry] = rx
	if u.rank[rx] == u.rank[ry] { u.rank[rx]++ }
	return true
}` }],
  resources: [
    { title: 'Union Find — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Union Find — CP-Algorithms', url: 'https://cp-algorithms.com/data_structures/disjoint_set_union.html', type: 'article', free: true },
    { title: 'LeetCode Union Find Tag', url: 'https://leetcode.com/tag/union-find/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'uf-q1', question: 'What does Union(x, y) returning false indicate?', options: ['x and y are in different components', 'x and y are already in the same component', 'Error in input', 'Rank overflow'], correctIndex: 1, explanation: 'If Find(x) == Find(y), merging them would create a cycle. Union returns false — they\'re already connected.' },
    { id: 'uf-q2', question: 'Path compression in Union-Find improves Find from what complexity to what?', options: ['O(n) to O(log n)', 'O(n) to O(α(n)) amortised', 'O(log n) to O(1)', 'O(n²) to O(n)'], correctIndex: 1, explanation: 'Path compression flattens the tree, making subsequent finds very cheap. With union by rank, the amortised cost per operation is O(α(n)) — nearly constant.' },
    { id: 'uf-q3', question: 'After n unions, how many components remain if all unions succeed?', options: ['n', 'n-1', '1', '0'], correctIndex: 2, explanation: 'Each successful union reduces the component count by 1. Starting from n components, n-1 successful unions yields 1 component.' },
    { id: 'uf-q4', question: 'Union by rank attaches the smaller tree to the larger to:', options: ['Save memory', 'Maintain sorted order', 'Prevent tree height from growing rapidly', 'Enable path compression'], correctIndex: 2, explanation: 'Attaching the smaller tree under the larger keeps the merged tree\'s height at most log(n), preventing degeneration into a linked list.' },
  ],
  questions: [
    {
      id: 'lc-547',
      title: "Number of Provinces",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Union-Find',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["union-find", "graph", "dfs"],
      problemStatement: "Given an n x n matrix isConnected where isConnected[i][j] = 1 if city i is directly connected to city j, return the total number of provinces (connected components).",
      examples: [{"input": "isConnected = [[1,1,0],[1,1,0],[0,0,1]]", "output": "2"}, {"input": "isConnected = [[1,0,0],[0,1,0],[0,0,1]]", "output": "3"}],
      constraints: ["1 <= n <= 200", "isConnected[i][j] is 0 or 1", "isConnected[i][i] = 1"],
      hints: ["Union connected cities", "Count distinct roots (provinces)"],
      bruteForce: "DFS/BFS from each unvisited city \u2014 O(n^2).",
      optimizedSolution: "Union-Find with path compression. O(n^2 * alpha(n))/O(n).",
      timeComplexity: 'O(n^2)',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func findCircleNum(isConnected [][]int) int {
    n := len(isConnected)
    parent := make([]int, n)
    for i := range parent { parent[i] = i }
    var find func(x int) int
    find = func(x int) int {
        if parent[x] != x { parent[x] = find(parent[x]) }
        return parent[x]
    }
    union := func(x, y int) {
        px, py := find(x), find(y)
        if px != py { parent[px] = py }
    }
    for i := 0; i < n; i++ {
        for j := i+1; j < n; j++ {
            if isConnected[i][j] == 1 { union(i, j) }
        }
    }
    count := 0
    for i := 0; i < n; i++ {
        if find(i) == i { count++ }
    }
    return count
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/number-of-provinces/"},
      related: ["Redundant Connection", "Accounts Merge"],
      dryRun: {
        title: "Number of Provinces \u2014 Union-Find",
        input: "isConnected = [[1,1,0],[1,1,0],[0,0,1]]",
        result: "Result = 2 provinces",
        steps: [
          { line: 4, description: "Initialize parent = [0, 1, 2] (each city is its own root)", variables: [{"name": "parent", "value": "[0, 1, 2]"}], dataState: "parent = [0, 1, 2]\n0\u21920  1\u21921  2\u21922\n3 separate provinces" },
          { line: 12, description: "i=0,j=1: isConnected[0][1]=1. union(0,1). parent[0]=1.", variables: [{"name": "parent", "value": "[1, 1, 2]"}], dataState: "Cities 0 and 1 connected\nunion(0, 1): parent[0] = 1\nparent = [1, 1, 2]\nProvince: {0,1}, {2}" },
          { line: 12, description: "i=0,j=2: isConnected[0][2]=0. Skip. i=1,j=2: isConnected[1][2]=0. Skip.", variables: [{"name": "parent", "value": "[1, 1, 2]"}], dataState: "City 0-2: not connected, skip\nCity 1-2: not connected, skip\nparent = [1, 1, 2]" },
          { line: 16, description: "Count roots: find(0)=1 (not root). find(1)=1 (root!). find(2)=2 (root!). count=2.", variables: [{"name": "count", "value": "2"}], dataState: "find(0) = 1 (root is 1)\nfind(1) = 1 (is root) \u2713 count=1\nfind(2) = 2 (is root) \u2713 count=2\nResult: 2 provinces \u2713" },
        ],
      },
    },
    {
      id: 'lc-684',
      title: "Redundant Connection",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Union-Find',
      companies: ["Amazon", "Google", "Meta"],
      tags: ["union-find", "graph", "tree"],
      problemStatement: "In a tree, one extra edge creates a cycle. Given edges of an undirected graph that started as a tree plus one extra edge, return the edge that can be removed to make it a tree again.",
      examples: [{"input": "edges = [[1,2],[1,3],[2,3]]", "output": "[2,3]"}, {"input": "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", "output": "[1,4]"}],
      constraints: ["3 <= n <= 1000", "edges.length == n", "1 <= u, v <= n", "No repeated edges"],
      hints: ["Union-Find: if two nodes already share a root, that edge is redundant", "Process edges in order, return first that forms a cycle"],
      bruteForce: "DFS to detect cycle \u2014 O(n^2).",
      optimizedSolution: "Union-Find with path compression. O(n * alpha(n))/O(n).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func findRedundantConnection(edges [][]int) []int {
    parent := make([]int, len(edges)+1)
    for i := range parent { parent[i] = i }
    var find func(x int) int
    find = func(x int) int {
        if parent[x] != x { parent[x] = find(parent[x]) }
        return parent[x]
    }
    for _, e := range edges {
        pu, pv := find(e[0]), find(e[1])
        if pu == pv { return e }
        parent[pu] = pv
    }
    return nil
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/redundant-connection/"},
      related: ["Number of Provinces", "Accounts Merge"],
      dryRun: {
        title: "Redundant Connection \u2014 Union-Find",
        input: "edges = [[1,2],[1,3],[2,3]]",
        result: "Redundant edge = [2,3]",
        steps: [
          { line: 2, description: "Initialize parent = [0, 1, 2, 3] (1-indexed)", variables: [{"name": "parent", "value": "[0,1,2,3]"}], dataState: "parent = [_, 1, 2, 3]\nEach node is its own root" },
          { line: 9, description: "Edge [1,2]: find(1)=1, find(2)=2. Different! Union: parent[1]=2", variables: [{"name": "parent", "value": "[0,2,2,3]"}], dataState: "Edge [1,2]: 1 and 2 different roots\nUnion: parent[1] = 2\nTree: 1-2, 3" },
          { line: 9, description: "Edge [1,3]: find(1)=2, find(3)=3. Different! Union: parent[2]=3", variables: [{"name": "parent", "value": "[0,3,3,3]"}], dataState: "Edge [1,3]: find(1)=2, find(3)=3\nUnion: parent[2] = 3\nTree: 1-2-3" },
          { line: 9, description: "Edge [2,3]: find(2)=3, find(3)=3. SAME! This edge creates a cycle. Return [2,3]!", variables: [{"name": "result", "value": "[2,3]"}], dataState: "Edge [2,3]: find(2)=3, find(3)=3\nSAME ROOT! Cycle detected!\nReturn [2,3] \u2713" },
        ],
      },
    },
  ],
};
