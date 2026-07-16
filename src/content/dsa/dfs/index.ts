import type { TopicContent } from '../../types';

export const dfsContent: TopicContent = {
  slug: 'dsa/dfs', title: 'DFS', category: 'dsa',
  theory: `# Depth-First Search\n\nExplore as deep as possible before backtracking. Uses a stack (explicit or call stack).\n\n## Recursive Template\n\n\`\`\`go\nfunc dfs(node int, visited []bool, graph [][]int) {\n    if visited[node] { return }\n    visited[node] = true\n    for _, nb := range graph[node] {\n        dfs(nb, visited, graph)\n    }\n}\n\`\`\`\n\n## Iterative Template\n\n\`\`\`go\nstack := []int{start}\nvisited := make([]bool, n)\nfor len(stack) > 0 {\n    node := stack[len(stack)-1]; stack = stack[:len(stack)-1]\n    if visited[node] { continue }\n    visited[node] = true\n    for _, nb := range graph[node] { stack = append(stack, nb) }\n}\n\`\`\`\n\n## Applications\n- Connected components\n- Cycle detection\n- Topological sort (postorder)\n- Path finding\n- Backtracking\n- Tree traversal\n`,
  examples: `# DFS — Examples\n\n## Clone Graph\n\n\`\`\`go\nfunc cloneGraph(node *Node) *Node {\n    visited := map[*Node]*Node{}\n    var dfs func(*Node) *Node\n    dfs = func(n *Node) *Node {\n        if n == nil { return nil }\n        if clone, ok := visited[n]; ok { return clone }\n        clone := &Node{Val: n.Val}\n        visited[n] = clone\n        for _, nb := range n.Neighbors { clone.Neighbors = append(clone.Neighbors, dfs(nb)) }\n        return clone\n    }\n    return dfs(node)\n}\n\`\`\`\n\n## Path Sum (Tree)\n\n\`\`\`go\nfunc hasPathSum(root *TreeNode, targetSum int) bool {\n    if root == nil { return false }\n    if root.Left == nil && root.Right == nil { return root.Val == targetSum }\n    return hasPathSum(root.Left, targetSum-root.Val) || hasPathSum(root.Right, targetSum-root.Val)\n}\n\`\`\``,
  patterns: `# DFS Patterns\n\n## 1. Connected Components — DFS from each unvisited node, count calls\n## 2. Cycle Detection — track recursion stack (grey nodes in directed graph)\n## 3. Topological Sort — postorder DFS, push to result on finish\n## 4. Path Enumeration — backtracking with undo on return\n## 5. Tree DFS — recursive with base case on nil`,
  interviewTips: `# Interview Tips — DFS\n\n1. Use recursive DFS for trees (simpler), iterative for graphs (avoids stack overflow).\n2. Always mark visited before recursing — not after.\n3. For path problems, pass current path and backtrack on return.\n4. Postorder DFS gives topological sort in reverse.`,
  commonMistakes: `# Common Mistakes — DFS\n\n1. Marking visited after push, not before processing — revisits.\n2. Not backtracking — forgetting to undo state changes on return.\n3. Stack overflow on large inputs — convert to iterative.\n4. Wrong postorder for topological sort — must add to result after both children.`,
  revision: `# DFS — Quick Revision\n\n| Application | Key Detail |\n|-------------|------------|\n| Connected components | Count DFS calls |\n| Cycle (undirected) | Track parent |\n| Cycle (directed) | 3-color (grey = in-stack) |\n| Topological sort | Postorder + reverse |\n| Path sum | Pass remaining target |\n| Flood fill | Mark visited inline |\n`,
  codeExamples: [{ language: 'go', label: 'DFS Graph', code: `func dfs(node int, visited []bool, graph [][]int) {
	if visited[node] {
		return
	}
	visited[node] = true
	for _, nb := range graph[node] {
		dfs(nb, visited, graph)
	}
}` }],
  resources: [
    { title: 'DFS — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'DFS — GfG', url: 'https://www.geeksforgeeks.org/depth-first-search-or-dfs-for-a-graph/', type: 'article', free: true },
    { title: 'LeetCode DFS Tag', url: 'https://leetcode.com/tag/depth-first-search/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'dfs-q1', question: 'DFS uses which data structure?', options: ['Queue', 'Stack (or call stack)', 'Heap', 'Sorted array'], correctIndex: 1, explanation: 'DFS uses a stack. Recursive DFS uses the call stack implicitly; iterative DFS uses an explicit stack.' },
    { id: 'dfs-q2', question: 'When should you use iterative DFS over recursive DFS?', options: ['Always', 'For balanced trees only', 'When graph/tree could be very deep causing stack overflow', 'For BFS'], correctIndex: 2, explanation: 'Default stack size limits recursion depth. For large or skewed graphs, iterative DFS with an explicit stack avoids stack overflow.' },
    { id: 'dfs-q3', question: 'Postorder DFS on a DAG produces a topological sort in what order?', options: ['Forward order', 'Reverse order', 'Alphabetical', 'Arbitrary'], correctIndex: 1, explanation: 'Nodes finish (post-order) after all their dependents, so push to front or reverse at the end to get topological order.' },
    { id: 'dfs-q4', question: 'In backtracking (DFS with path), when must you undo a choice?', options: ['Before recursing', 'After the recursive call returns', 'Never', 'Only if the path fails'], correctIndex: 1, explanation: 'Undo (backtrack) after the recursive call returns so the state is clean for the next sibling choice.' },
  ],
  questions: [
    {
      id: 'lc-94',
      title: "Binary Tree Inorder Traversal",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'DFS',
      companies: ["Amazon", "Microsoft", "Google"],
      tags: ["dfs", "tree", "stack"],
      problemStatement: "Given the root of a binary tree, return the inorder traversal of its nodes values (left, root, right).",
      examples: [{"input": "root = [1,null,2,3]", "output": "[1,3,2]"}, {"input": "root = []", "output": "[]"}],
      constraints: ["0 <= number of nodes <= 100", "-100 <= Node.val <= 100"],
      hints: ["Recursive: traverse left, visit, traverse right", "Iterative: use a stack, go left as far as possible"],
      bruteForce: "Level order \u2014 not applicable.",
      optimizedSolution: "Recursive DFS or iterative with stack. O(n)/O(h).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func inorderTraversal(root *TreeNode) []int {
    var result []int
    var dfs func(node *TreeNode)
    dfs = func(node *TreeNode) {
        if node == nil { return }
        dfs(node.Left)
        result = append(result, node.Val)
        dfs(node.Right)
    }
    dfs(root)
    return result
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/binary-tree-inorder-traversal/"},
      related: ["Preorder", "Postorder", "Level Order"],
      dryRun: {
        title: "Inorder Traversal \u2014 DFS",
        input: "root = [1,null,2,3]",
        result: "Result: [1, 3, 2]",
        steps: [
          { line: 5, description: "dfs(1): go left first. node.Left = null, return immediately.", variables: [{"name": "node", "value": "1"}, {"name": "left", "value": "null"}], dataState: "    1\n     \\\n      2\n     /\n    3\nVisit 1: left is null" },
          { line: 6, description: "Visit node 1. Append 1 to result. result=[1]", variables: [{"name": "result", "value": "[1]"}], dataState: "   [1]\n     \\\n      2\n     /\n    3\nresult = [1]" },
          { line: 7, description: "dfs(2): go left to node 3.", variables: [{"name": "node", "value": "2"}], dataState: "    1\n     \\\n    [2]\n     /\n    3\nProcessing node 2, go left" },
          { line: 5, description: "dfs(3): left is null. Visit 3. result=[1,3]. Right is null.", variables: [{"name": "node", "value": "3"}, {"name": "result", "value": "[1, 3]"}], dataState: "    1\n     \\\n      2\n     /\n   [3]\nresult = [1, 3]" },
          { line: 6, description: "Back at node 2: visit 2. result=[1,3,2]. Right is null.", variables: [{"name": "node", "value": "2"}, {"name": "result", "value": "[1, 3, 2]"}], dataState: "    1\n     \\\n    [2]\nresult = [1, 3, 2] \u2713" },
        ],
      },
    },
    {
      id: 'lc-79',
      title: "Word Search",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'DFS + Backtracking',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["dfs", "backtracking", "matrix"],
      problemStatement: "Given an m x n grid of characters and a string word, return true if word exists in the grid. The word can be constructed from adjacent cells, each cell used at most once.",
      examples: [{"input": "board=[[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word=\"ABCCED\"", "output": "true"}],
      constraints: ["m == board.length", "1 <= m, n <= 6", "1 <= word.length <= 15"],
      hints: ["DFS from each cell matching first char", "Mark visited cells, backtrack on failure"],
      bruteForce: "Try all paths \u2014 exponential.",
      optimizedSolution: "DFS with backtracking: mark cell, try 4 directions, unmark. O(m*n*4^L)/O(L).",
      timeComplexity: 'O(m*n*4^L)',
      spaceComplexity: 'O(L)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func exist(board [][]byte, word string) bool {
    m, n := len(board), len(board[0])
    var dfs func(i, j, idx int) bool
    dfs = func(i, j, idx int) bool {
        if idx == len(word) { return true }
        if i < 0 || i >= m || j < 0 || j >= n || board[i][j] != word[idx] { return false }
        tmp := board[i][j]
        board[i][j] = '#'
        found := dfs(i+1,j,idx+1) || dfs(i-1,j,idx+1) || dfs(i,j+1,idx+1) || dfs(i,j-1,idx+1)
        board[i][j] = tmp
        return found
    }
    for i := 0; i < m; i++ {
        for j := 0; j < n; j++ {
            if dfs(i, j, 0) { return true }
        }
    }
    return false
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/word-search/"},
      related: ["Word Search II", "Number of Islands"],
      dryRun: {
        title: "Word Search \u2014 DFS Backtracking",
        input: "board 3x4, word = \"ABCCED\"",
        result: "Found: true",
        steps: [
          { line: 9, description: "Start at (0,0): board[0][0]=\"A\" matches word[0]=\"A\". Mark visited.", variables: [{"name": "pos", "value": "(0,0)"}, {"name": "idx", "value": "0"}, {"name": "char", "value": "A"}], dataState: "Board:\n[#] B C E\n S  F C S\n A  D E E\nword = A B C C E D\n       ^\nAt (0,0), matched A" },
          { line: 11, description: "Try right: (0,1)=\"B\" matches word[1]=\"B\". Mark visited.", variables: [{"name": "pos", "value": "(0,1)"}, {"name": "idx", "value": "1"}, {"name": "char", "value": "B"}], dataState: "Board:\n # [#] C E\n S  F  C S\n A  D  E E\nword = A B C C E D\n          ^\nAt (0,1), matched B" },
          { line: 11, description: "Try right: (0,2)=\"C\" matches word[2]=\"C\". Mark visited.", variables: [{"name": "pos", "value": "(0,2)"}, {"name": "idx", "value": "2"}, {"name": "char", "value": "C"}], dataState: "Board:\n #  # [#] E\n S  F  C  S\n A  D  E  E\nword = A B C C E D\n             ^\nAt (0,2), matched C" },
          { line: 11, description: "Try down: (1,2)=\"C\" matches word[3]=\"C\". Mark visited.", variables: [{"name": "pos", "value": "(1,2)"}, {"name": "idx", "value": "3"}, {"name": "char", "value": "C"}], dataState: "Board:\n #  #  #  E\n S  F [#] S\n A  D  E  E\nword = A B C C E D\n                ^\nAt (1,2), matched C" },
          { line: 11, description: "Try down: (2,2)=\"E\" matches word[4]=\"E\". Mark visited.", variables: [{"name": "pos", "value": "(2,2)"}, {"name": "idx", "value": "4"}, {"name": "char", "value": "E"}], dataState: "Board:\n #  #  #  E\n S  F  #  S\n A  D [#] E\nword = A B C C E D\n                   ^\nAt (2,2), matched E" },
          { line: 11, description: "Try left: (2,1)=\"D\" matches word[5]=\"D\". idx=6=len(word). Return true!", variables: [{"name": "pos", "value": "(2,1)"}, {"name": "idx", "value": "6"}, {"name": "char", "value": "D"}, {"name": "result", "value": "true"}], dataState: "Board:\n #  #  #  E\n S  F  #  S\n A [#] #  E\nword = A B C C E D\n                      ^\nAt (2,1), matched D\nALL CHARS FOUND! \u2713" },
        ],
      },
    },
  ],
};
