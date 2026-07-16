import type { TopicContent } from '../../types';

export const bfsContent: TopicContent = {
  slug: 'dsa/bfs', title: 'BFS', category: 'dsa',
  theory: `# Breadth-First Search\n\nExplore all neighbours at the current depth before going deeper. Always uses a queue. Guarantees shortest path in **unweighted** graphs.\n\n## Template\n\n\`\`\`go\nvisited := make([]bool, n)\nq := []int{start}\nvisited[start] = true\ndist := 0\nfor len(q) > 0 {\n    size := len(q)\n    for i := 0; i < size; i++ {\n        node := q[i]\n        for _, nb := range graph[node] {\n            if !visited[nb] {\n                visited[nb] = true\n                q = append(q, nb)\n            }\n        }\n    }\n    q = q[size:]\n    dist++\n}\n\`\`\`\n\n## BFS vs DFS\n\n| | BFS | DFS |\n|-|-----|-----|\n| Data structure | Queue | Stack |\n| Shortest path | Yes (unweighted) | No |\n| Memory | O(w) — width | O(h) — height |\n| Completeness | Yes | Yes |\n`,
  examples: `# BFS — Examples\n\n## Word Ladder\n\n\`\`\`go\nfunc ladderLength(beginWord, endWord string, wordList []string) int {\n    wordSet := make(map[string]bool)\n    for _, w := range wordList { wordSet[w] = true }\n    q := []string{beginWord}\n    steps := 1\n    for len(q) > 0 {\n        size := len(q)\n        for i := 0; i < size; i++ {\n            word := []byte(q[i])\n            for j := range word {\n                orig := word[j]\n                for c := byte('a'); c <= 'z'; c++ {\n                    if c == orig { continue }\n                    word[j] = c\n                    nw := string(word)\n                    if nw == endWord { return steps+1 }\n                    if wordSet[nw] { q = append(q, nw); delete(wordSet, nw) }\n                    word[j] = orig\n                }\n            }\n        }\n        q = q[size:]; steps++\n    }\n    return 0\n}\n\`\`\``,
  patterns: `# BFS Patterns\n\n## 1. Shortest Path — mark visited before enqueueing\n## 2. Level-Order — capture size before inner loop\n## 3. Multi-Source — enqueue all sources at distance 0\n## 4. 0-1 BFS — use deque; push front for cost 0, back for cost 1\n## 5. Bidirectional BFS — expand from both ends; meet in middle`,
  interviewTips: `# Interview Tips — BFS\n\n1. Mark nodes visited **when you enqueue them**, not when you dequeue.\n2. For grid problems, check bounds and visited status before enqueuing.\n3. Multi-source BFS: enqueue all sources together — no special start node needed.\n4. BFS is the algorithm for "minimum number of steps/moves" problems.`,
  commonMistakes: `# Common Mistakes — BFS\n\n1. Marking visited after dequeue — can enqueue same node multiple times.\n2. Forgetting to update distance per level.\n3. Modifying the queue slice while iterating — use size-based inner loop.\n4. Not marking source as visited before starting.`,
  revision: `# BFS — Quick Revision\n\n| Problem | BFS Variant |\n|---------|-------------|\n| Shortest path (unwt) | Standard BFS |\n| Level-order tree | Standard BFS |\n| Rotten oranges | Multi-source BFS |\n| Word ladder | BFS on word graph |\n| 01 Matrix | Multi-source BFS |\n| Bidirectional search | Bidirectional BFS |\n`,
  codeExamples: [{ language: 'go', label: 'BFS Template', code: `func bfs(graph [][]int, start int) []int {
	n := len(graph)
	dist := make([]int, n)
	for i := range dist { dist[i] = -1 }
	dist[start] = 0
	q := []int{start}
	for len(q) > 0 {
		size := len(q)
		for i := 0; i < size; i++ {
			node := q[i]
			for _, nb := range graph[node] {
				if dist[nb] == -1 {
					dist[nb] = dist[node] + 1
					q = append(q, nb)
				}
			}
		}
		q = q[size:]
	}
	return dist
}` }],
  resources: [
    { title: 'BFS — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'BFS — GfG', url: 'https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/', type: 'article', free: true },
    { title: 'LeetCode BFS Tag', url: 'https://leetcode.com/tag/breadth-first-search/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'bfs-q1', question: 'Why does BFS guarantee shortest path in unweighted graphs?', options: ['It visits all nodes', 'It explores nodes in order of increasing distance from source', 'It uses a priority queue', 'It marks visited nodes'], correctIndex: 1, explanation: 'BFS explores all nodes at distance d before distance d+1. The first time a node is reached, it\'s via the shortest path.' },
    { id: 'bfs-q2', question: 'When should you mark nodes as visited in BFS?', options: ['After dequeuing', 'When enqueuing', 'After processing all neighbours', 'At the start of each level'], correctIndex: 1, explanation: 'Marking when enqueuing prevents the same node from being added to the queue multiple times, which can cause O(V²) behaviour.' },
    { id: 'bfs-q3', question: 'What is the time complexity of BFS on a graph with V vertices and E edges?', options: ['O(V)', 'O(E)', 'O(V+E)', 'O(V·E)'], correctIndex: 2, explanation: 'Each vertex is processed once and each edge is examined once from each endpoint — O(V+E) total.' },
    { id: 'bfs-q4', question: 'Multi-source BFS is used when:', options: ['There is no source', 'There are multiple starting points all at distance 0', 'The graph is weighted', 'The graph is a tree'], correctIndex: 1, explanation: 'Initialize the queue with all source nodes simultaneously. This finds minimum distance from any source — e.g., rotten oranges, 0-1 matrix.' },
  ],
  questions: [
    {
      id: 'lc-102',
      title: "Binary Tree Level Order Traversal",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'BFS',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["bfs", "tree", "queue"],
      problemStatement: "Given the root of a binary tree, return the level order traversal of its nodes values (left to right, level by level).",
      examples: [{"input": "root = [3,9,20,null,null,15,7]", "output": "[[3],[9,20],[15,7]]"}],
      constraints: ["0 <= number of nodes <= 2000", "-1000 <= Node.val <= 1000"],
      hints: ["Use a queue, process level by level", "Track queue size to know level boundaries"],
      bruteForce: "DFS with level tracking \u2014 O(n).",
      optimizedSolution: "BFS with queue: process one level at a time. O(n)/O(w).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(w)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func levelOrder(root *TreeNode) [][]int {
    if root == nil { return nil }
    var result [][]int
    queue := []*TreeNode{root}
    for len(queue) > 0 {
        size := len(queue)
        level := []int{}
        for i := 0; i < size; i++ {
            node := queue[0]
            queue = queue[1:]
            level = append(level, node.Val)
            if node.Left != nil { queue = append(queue, node.Left) }
            if node.Right != nil { queue = append(queue, node.Right) }
        }
        result = append(result, level)
    }
    return result
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/binary-tree-level-order-traversal/"},
      related: ["Level Order II", "Zigzag Order"],
      dryRun: {
        title: "Level Order Traversal \u2014 BFS",
        input: "root = [3,9,20,null,null,15,7]",
        result: "Result: [[3], [9,20], [15,7]]",
        steps: [
          { line: 4, description: "Initialize queue with root [3].", variables: [{"name": "queue", "value": "[3]"}], dataState: "      3\n     / \\\n    9   20\n        / \\\n       15  7\nQueue: [3]" },
          { line: 8, description: "Level 0: size=1. Process 3. Add 9,20 to queue. level=[3]", variables: [{"name": "level", "value": "[3]"}, {"name": "queue", "value": "[9, 20]"}], dataState: "     [3]\n     / \\\n    9   20\nLevel 0: [3]\nQueue: [9, 20]" },
          { line: 8, description: "Level 1: size=2. Process 9 (no children), process 20 (add 15,7). level=[9,20]", variables: [{"name": "level", "value": "[9, 20]"}, {"name": "queue", "value": "[15, 7]"}], dataState: "      3\n     / \\\n   [9] [20]\n        / \\\n       15  7\nLevel 1: [9, 20]\nQueue: [15, 7]" },
          { line: 8, description: "Level 2: size=2. Process 15 (leaf), process 7 (leaf). level=[15,7]", variables: [{"name": "level", "value": "[15, 7]"}, {"name": "queue", "value": "[]"}], dataState: "      3\n     / \\\n    9   20\n       / \\\n     [15][7]\nLevel 2: [15, 7]\nQueue: []" },
          { line: 10, description: "Queue empty. Return [[3], [9,20], [15,7]]", variables: [{"name": "result", "value": "[[3],[9,20],[15,7]]"}], dataState: "Result: [[3], [9,20], [15,7]] \u2713" },
        ],
      },
    },
    {
      id: 'lc-994',
      title: "Rotting Oranges",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Multi-source BFS',
      companies: ["Amazon", "Google", "Meta"],
      tags: ["bfs", "matrix", "queue"],
      problemStatement: "You are given an m x n grid where each cell can be 0 (empty), 1 (fresh orange), or 2 (rotten orange). Every minute, adjacent fresh oranges rot. Return the minimum minutes until no fresh orange remains, or -1 if impossible.",
      examples: [{"input": "grid = [[2,1,1],[1,1,0],[0,1,1]]", "output": "4"}],
      constraints: ["m == grid.length", "1 <= m, n <= 10"],
      hints: ["Multi-source BFS from all rotten oranges", "Count fresh oranges, decrement as they rot"],
      bruteForce: "Process one rotten at a time \u2014 O(n^2).",
      optimizedSolution: "Multi-source BFS: all rotten at once. O(m*n)/O(m*n).",
      timeComplexity: 'O(m*n)',
      spaceComplexity: 'O(m*n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func orangesRotting(grid [][]int) int {
    m, n := len(grid), len(grid[0])
    queue := [][]int{}
    fresh := 0
    for i := 0; i < m; i++ {
        for j := 0; j < n; j++ {
            if grid[i][j] == 2 { queue = append(queue, []int{i, j}) }
            if grid[i][j] == 1 { fresh++ }
        }
    }
    minutes := 0
    dirs := [][]int{{0,1},{0,-1},{1,0},{-1,0}}
    for len(queue) > 0 && fresh > 0 {
        size := len(queue)
        for i := 0; i < size; i++ {
            cur := queue[0]; queue = queue[1:]
            for _, d := range dirs {
                ni, nj := cur[0]+d[0], cur[1]+d[1]
                if ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] == 1 {
                    grid[ni][nj] = 2
                    fresh--
                    queue = append(queue, []int{ni, nj})
                }
            }
        }
        minutes++
    }
    if fresh > 0 { return -1 }
    return minutes
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/rotting-oranges/"},
      related: ["Walls and Gates", "01 Matrix"],
      dryRun: {
        title: "Rotting Oranges \u2014 Multi-source BFS",
        input: "grid = [[2,1,1],[1,1,0],[0,1,1]]",
        result: "Minutes = 4",
        steps: [
          { line: 8, description: "Find rotten at (0,0). Fresh count = 6. Queue=[(0,0)]", variables: [{"name": "fresh", "value": "6"}, {"name": "queue", "value": "[(0,0)]"}], dataState: "Grid:\n[2] 1  1\n 1  1  0\n 0  1  1\nFresh: 6, Rotten: (0,0)" },
          { line: 14, description: "Min 1: Process (0,0). Rot (0,1) and (1,0). fresh=4. Queue=[(0,1),(1,0)]", variables: [{"name": "fresh", "value": "4"}, {"name": "minutes", "value": "1"}], dataState: "Grid:\n 2 [2] 1\n[2] 1  0\n 0  1  1\nMin 1: 2 more rotted" },
          { line: 14, description: "Min 2: Process (0,1),(1,0). Rot (0,2) and (1,1). fresh=2. Queue=[(0,2),(1,1)]", variables: [{"name": "fresh", "value": "2"}, {"name": "minutes", "value": "2"}], dataState: "Grid:\n 2  2 [2]\n 2 [2] 0\n 0  1  1\nMin 2: 2 more rotted" },
          { line: 14, description: "Min 3: Process (0,2),(1,1). Rot (2,1). fresh=1. Queue=[(2,1)]", variables: [{"name": "fresh", "value": "1"}, {"name": "minutes", "value": "3"}], dataState: "Grid:\n 2  2  2\n 2  2  0\n 0 [2] 1\nMin 3: 1 more rotted" },
          { line: 14, description: "Min 4: Process (2,1). Rot (2,2). fresh=0. Queue=[(2,2)]", variables: [{"name": "fresh", "value": "0"}, {"name": "minutes", "value": "4"}], dataState: "Grid:\n 2  2  2\n 2  2  0\n 0  2 [2]\nMin 4: last one rotted" },
          { line: 20, description: "fresh=0. Return minutes = 4", variables: [{"name": "result", "value": "4"}], dataState: "Result: 4 minutes \u2713" },
        ],
      },
    },
  ],
};
