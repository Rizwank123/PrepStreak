import type { TopicContent } from '../../types';

export const treeContent: TopicContent = {
  slug: 'dsa/tree', title: 'Trees', category: 'dsa',
  theory: `# Trees\n\n## Binary Tree Node\n\n\`\`\`go\ntype TreeNode struct { Val int; Left, Right *TreeNode }\n\`\`\`\n\n## Traversals\n\n| Order | Pattern | Use |\n|-------|---------|-----|\n| Inorder (L-Root-R) | Left, process, Right | Sorted output from BST |\n| Preorder (Root-L-R) | Process, Left, Right | Copy / serialise tree |\n| Postorder (L-R-Root) | Left, Right, process | Delete / evaluate |\n| Level-order | BFS | Shortest path, level ops |\n\n## Key Properties\n\n- Height of balanced tree: O(log n)\n- Height of skewed tree: O(n)\n- BFS uses queue; DFS uses stack/recursion\n\n## Recursive Template\n\n\`\`\`go\nfunc solve(node *TreeNode) int {\n    if node == nil { return 0 } // base case\n    left  := solve(node.Left)\n    right := solve(node.Right)\n    return combine(left, right, node.Val)\n}\n\`\`\`\n`,
  examples: `# Trees — Examples\n\n## Maximum Depth\n\n\`\`\`go\nfunc maxDepth(root *TreeNode) int {\n    if root == nil { return 0 }\n    return 1 + max(maxDepth(root.Left), maxDepth(root.Right))\n}\n\`\`\`\n\n## Diameter of Binary Tree\n\n\`\`\`go\nfunc diameterOfBinaryTree(root *TreeNode) int {\n    best := 0\n    var height func(*TreeNode) int\n    height = func(n *TreeNode) int {\n        if n == nil { return 0 }\n        l, r := height(n.Left), height(n.Right)\n        if l+r > best { best = l+r }\n        return 1 + max(l, r)\n    }\n    height(root)\n    return best\n}\n\`\`\`\n\n## Lowest Common Ancestor\n\n\`\`\`go\nfunc lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {\n    if root == nil || root == p || root == q { return root }\n    left  := lowestCommonAncestor(root.Left, p, q)\n    right := lowestCommonAncestor(root.Right, p, q)\n    if left != nil && right != nil { return root }\n    if left != nil { return left }\n    return right\n}\n\`\`\``,
  patterns: `# Tree Patterns\n\n## 1. Recursive DFS with Return Value\nReturn computed value from subtrees to parent.\n\n## 2. Level-Order BFS\nProcess nodes layer by layer using a queue.\n\n## 3. Path Problems\nTrack path sum; backtrack on return.\n\n## 4. Serialise / Deserialise\nPreorder traversal with null markers.\n\n## 5. Diameter / Longest Path\nCompute height at each node; diameter = max(left_height + right_height).`,
  interviewTips: `# Interview Tips — Trees\n\n1. Always ask: binary tree vs BST? Balanced? Nulls allowed?\n2. Most tree problems are solved with DFS recursion — practice the template.\n3. Think: what does each recursive call return and how do you combine results?\n4. For iterative DFS, use an explicit stack with the same logic.\n5. BFS is better when you need level information.`,
  commonMistakes: `# Common Mistakes — Trees\n\n1. Not handling nil base case — always return early on nil.\n2. Returning wrong value — confusing height vs depth vs diameter.\n3. Global variable for diameter — prefer passing by reference or closure.\n4. Confusing inorder/preorder/postorder — know which one you need.\n5. Stack overflow on deep trees — consider iterative for skewed trees.`,
  revision: `# Trees — Quick Revision\n\n| Problem | Technique | Complexity |\n|---------|-----------|----------|\n| Max depth | DFS height | O(n)/O(h) |\n| Diameter | DFS + max | O(n)/O(h) |\n| Level order | BFS | O(n)/O(n) |\n| LCA | DFS search | O(n)/O(h) |\n| Symmetric | DFS compare | O(n)/O(h) |\n| Path sum | DFS track | O(n)/O(h) |\n`,
  codeExamples: [{ language: 'go', label: 'Max Depth', code: `func maxDepth(root *TreeNode) int {
	if root == nil {
		return 0
	}
	l := maxDepth(root.Left)
	r := maxDepth(root.Right)
	if l > r { return 1 + l }
	return 1 + r
}` }],
  resources: [
    { title: 'Trees — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Binary Tree — GfG', url: 'https://www.geeksforgeeks.org/binary-tree-data-structure/', type: 'article', free: true },
    { title: 'LeetCode Tree Tag', url: 'https://leetcode.com/tag/tree/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'tr-q1', question: 'Which traversal visits nodes in sorted order for a BST?', options: ['Preorder', 'Postorder', 'Inorder', 'Level-order'], correctIndex: 2, explanation: 'Inorder (left-root-right) visits BST nodes in ascending sorted order because of the BST property.' },
    { id: 'tr-q2', question: 'In the diameter-of-binary-tree solution, what does the recursive function return?', options: ['Diameter', 'Node count', 'Height of subtree', 'Path sum'], correctIndex: 2, explanation: 'The function returns height. At each node it computes left_h + right_h (a candidate diameter) and updates the global best.' },
    { id: 'tr-q3', question: 'BFS of a binary tree visits nodes in what order?', options: ['Left subtree first', 'Right subtree first', 'Level by level', 'Deepest first'], correctIndex: 2, explanation: 'BFS uses a queue and processes all nodes at depth d before any node at depth d+1 — i.e., level by level.' },
    { id: 'tr-q4', question: 'The time complexity of most DFS tree problems is:', options: ['O(log n)', 'O(n log n)', 'O(n)', 'O(n²)'], correctIndex: 2, explanation: 'DFS visits every node exactly once, doing O(1) work per node — total O(n).' },
  ],
  questions: [
    {
      id: 'lc-104',
      title: "Maximum Depth of Binary Tree",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'DFS',
      companies: ["Amazon", "Google", "Microsoft", "Apple"],
      tags: ["tree", "dfs", "recursion"],
      problemStatement: "Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root to the farthest leaf node.",
      examples: [{"input": "root = [3,9,20,null,null,15,7]", "output": "3"}, {"input": "root = [1,null,2]", "output": "2"}],
      constraints: ["0 <= number of nodes <= 10^4", "-100 <= Node.val <= 100"],
      hints: ["Recursively: depth = 1 + max(left, right)", "Or use BFS level counting"],
      bruteForce: "Count manually \u2014 not scalable.",
      optimizedSolution: "Recursive DFS: 1 + max(depth(left), depth(right)). O(n)/O(h).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func maxDepth(root *TreeNode) int {
    if root == nil {
        return 0
    }
    return 1 + max(maxDepth(root.Left), maxDepth(root.Right))
}

func max(a, b int) int {
    if a > b { return a }
    return b
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/maximum-depth-of-binary-tree/"},
      related: ["Minimum Depth", "Balanced Tree"],
      dryRun: {
        title: "Max Depth \u2014 Recursive DFS",
        input: "root = [3,9,20,null,null,15,7]",
        result: "Max depth = 3",
        steps: [
          { line: 2, description: "Call maxDepth(3). Not null. Recurse on children.", variables: [{"name": "node", "value": "3"}], dataState: "      3\n     / \\\n    9   20\n        / \\\n       15  7\nVisiting: 3" },
          { line: 4, description: "maxDepth(9): leaf node. Return 1 + max(0, 0) = 1", variables: [{"name": "node", "value": "9"}, {"name": "left", "value": "0"}, {"name": "right", "value": "0"}, {"name": "depth", "value": "1"}], dataState: "      3\n     / \\\n   [9]   20\n  leaf! depth = 1" },
          { line: 4, description: "maxDepth(20): recurse. maxDepth(15)=1, maxDepth(7)=1. Return 1+max(1,1)=2", variables: [{"name": "node", "value": "20"}, {"name": "left", "value": "1"}, {"name": "right", "value": "1"}, {"name": "depth", "value": "2"}], dataState: "      3\n     / \\\n    9  [20]\n       / \\\n     [15][7]\n     d=1  d=1\n     depth(20) = 2" },
          { line: 4, description: "Back at root: 1 + max(1, 2) = 3. Return 3!", variables: [{"name": "node", "value": "3"}, {"name": "left", "value": "1"}, {"name": "right", "value": "2"}, {"name": "depth", "value": "3"}], dataState: "      [3]\n      / \\\n   d=1  d=2\n   1 + max(1, 2) = 3\n   Result: 3 \u2713" },
        ],
      },
    },
    {
      id: 'lc-226',
      title: "Invert Binary Tree",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'DFS',
      companies: ["Google", "Amazon", "Microsoft"],
      tags: ["tree", "dfs", "recursion"],
      problemStatement: "Given the root of a binary tree, invert the tree, and return its root. Inverting means swapping every left and right child.",
      examples: [{"input": "root = [4,2,7,1,3,6,9]", "output": "[4,7,2,9,6,3,1]"}],
      constraints: ["0 <= number of nodes <= 100"],
      hints: ["Swap left and right at each node", "Recursively invert subtrees"],
      bruteForce: "Iterate with a queue \u2014 O(n).",
      optimizedSolution: "Recursive: swap children, invert left, invert right. O(n)/O(h).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func invertTree(root *TreeNode) *TreeNode {
    if root == nil {
        return nil
    }
    root.Left, root.Right = root.Right, root.Left
    invertTree(root.Left)
    invertTree(root.Right)
    return root
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/invert-binary-tree/"},
      related: ["Symmetric Tree", "Flip Equivalent Trees"],
      dryRun: {
        title: "Invert Binary Tree \u2014 Recursive",
        input: "root = [4,2,7,1,3,6,9]",
        result: "Inverted: [4,7,2,9,6,3,1]",
        steps: [
          { line: 4, description: "At node 4: swap left(2) and right(7). Now 7 is left, 2 is right", variables: [{"name": "node", "value": "4"}, {"name": "left", "value": "7"}, {"name": "right", "value": "2"}], dataState: "Before:     After:\n    4          4\n   / \\        / \\\n  2   7  ->  7   2\n /\\  /\\     /\\  /\\\n1 3 6 9    9 6 3 1\nSwapped at root" },
          { line: 5, description: "Recurse left(7): swap 6 and 9. 9 becomes left, 6 becomes right", variables: [{"name": "node", "value": "7"}, {"name": "left", "value": "9"}, {"name": "right", "value": "6"}], dataState: "    4\n   / \\\n  7   2\n /\\  /\\\n9 6 3 1\nSwapped at 7" },
          { line: 6, description: "Recurse right(2): swap 1 and 3. 3 becomes left, 1 becomes right", variables: [{"name": "node", "value": "2"}, {"name": "left", "value": "3"}, {"name": "right", "value": "1"}], dataState: "    4\n   / \\\n  7   2\n /\\  /\\\n9 6 3 1\nSwapped at 2\nDONE!" },
        ],
      },
    },
  ],
};
