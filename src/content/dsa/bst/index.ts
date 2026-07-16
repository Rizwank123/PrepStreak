import type { TopicContent } from '../../types';

export const bstContent: TopicContent = {
  slug: 'dsa/bst', title: 'BST', category: 'dsa',
  theory: `# Binary Search Tree\n\n## BST Property\n\nFor every node N: all nodes in left subtree < N.Val < all nodes in right subtree.\n\n## Operations\n\n| Op | Balanced (AVL/RB) | Unbalanced |\n|----|-------------------|------------|\n| Search | O(log n) | O(n) |\n| Insert | O(log n) | O(n) |\n| Delete | O(log n) | O(n) |\n| Min/Max | O(log n) | O(n) |\n| Inorder | O(n) | O(n) |\n\n## Search\n\n\`\`\`go\nfunc searchBST(root *TreeNode, val int) *TreeNode {\n    if root == nil || root.Val == val { return root }\n    if val < root.Val { return searchBST(root.Left, val) }\n    return searchBST(root.Right, val)\n}\n\`\`\`\n\n## Inorder = Sorted\n\nInorder traversal of a BST visits nodes in ascending sorted order. Useful for:\n- Kth smallest/largest element\n- Validate BST\n- Convert to sorted array\n`,
  examples: `# BST — Examples\n\n## Validate BST\n\n\`\`\`go\nfunc isValidBST(root *TreeNode) bool {\n    var validate func(node *TreeNode, lo, hi int) bool\n    validate = func(node *TreeNode, lo, hi int) bool {\n        if node == nil { return true }\n        if node.Val <= lo || node.Val >= hi { return false }\n        return validate(node.Left, lo, node.Val) && validate(node.Right, node.Val, hi)\n    }\n    return validate(root, math.MinInt64, math.MaxInt64)\n}\n\`\`\`\n\n## Kth Smallest (Inorder)\n\n\`\`\`go\nfunc kthSmallest(root *TreeNode, k int) int {\n    res, count := 0, 0\n    var inorder func(*TreeNode)\n    inorder = func(n *TreeNode) {\n        if n == nil { return }\n        inorder(n.Left)\n        count++\n        if count == k { res = n.Val; return }\n        inorder(n.Right)\n    }\n    inorder(root)\n    return res\n}\n\`\`\``,
  patterns: `# BST Patterns\n\n## 1. Validate — pass [lo, hi] bounds down the tree\n## 2. Inorder for sorted operations — kth smallest, iterator\n## 3. LCA in BST — if both values < root go left; if both > root go right; else root is LCA\n## 4. Insert / Delete — find correct position using BST property\n\n\`\`\`go\n// LCA in BST\nfunc lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {\n    if p.Val < root.Val && q.Val < root.Val { return lowestCommonAncestor(root.Left, p, q) }\n    if p.Val > root.Val && q.Val > root.Val { return lowestCommonAncestor(root.Right, p, q) }\n    return root // split point\n}\n\`\`\``,
  interviewTips: `# Interview Tips — BST\n\n1. Use value bounds (lo, hi) for validation — don't just compare with immediate parent.\n2. Inorder traversal on BST produces sorted output — use this property.\n3. BST LCA is simpler than general tree LCA — use BST property to navigate.\n4. Always ask: is the tree guaranteed to be balanced? (Affects complexity.)`,
  commonMistakes: `# Common Mistakes — BST\n\n1. Comparing only with parent node for validation — doesn't catch violations deeper.\n2. Not handling duplicate values — clarify: are duplicates allowed? If so, which side?\n3. Stack overflow on skewed tree — consider iterative inorder for large inputs.\n4. Wrong kth smallest termination — stop recursion early when count reaches k.`,
  revision: `# BST — Quick Revision\n\n| Problem | Technique |\n|---------|-----------|\n| Validate BST | DFS with bounds |\n| Kth smallest | Inorder + counter |\n| LCA in BST | Navigate with BST property |\n| Insert | Find leaf position |\n| Delete | Find successor/predecessor |\n`,
  codeExamples: [{ language: 'go', label: 'Validate BST', code: `func isValidBST(root *TreeNode) bool {
	var validate func(*TreeNode, int, int) bool
	validate = func(n *TreeNode, lo, hi int) bool {
		if n == nil { return true }
		if n.Val <= lo || n.Val >= hi { return false }
		return validate(n.Left, lo, n.Val) && validate(n.Right, n.Val, hi)
	}
	return validate(root, -1<<63, 1<<63-1)
}` }],
  resources: [
    { title: 'BST — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'BST — GfG', url: 'https://www.geeksforgeeks.org/binary-search-tree-data-structure/', type: 'article', free: true },
    { title: 'LeetCode BST Tag', url: 'https://leetcode.com/tag/binary-search-tree/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'bst-q1', question: 'What traversal visits a BST in sorted ascending order?', options: ['Preorder', 'Postorder', 'Level-order', 'Inorder'], correctIndex: 3, explanation: 'Inorder (L-N-R) visits left subtree (all smaller), then node, then right subtree (all larger) — ascending sorted order.' },
    { id: 'bst-q2', question: 'Why must BST validation pass bounds (lo, hi) rather than comparing with parent only?', options: ['Performance', 'Subtree constraint violation can be non-local', 'Recursion requires it', 'Go requires it'], correctIndex: 1, explanation: 'A node in the right subtree must be greater than its ancestor, not just its parent. Example: [5, 1, 6, null, null, 3, 7] — 3 violates the root constraint.' },
    { id: 'bst-q3', question: 'Time complexity of BST search in a balanced tree?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correctIndex: 2, explanation: 'In a balanced BST of height log n, each comparison eliminates half the remaining search space.' },
    { id: 'bst-q4', question: 'In BST LCA, if both p and q values are less than root.Val, where is the LCA?', options: ['Current root', 'Right subtree', 'Left subtree', 'Cannot determine'], correctIndex: 2, explanation: 'If both target values are smaller than root, both nodes must be in the left subtree, so the LCA is also in the left subtree.' },
  ],
  questions: [
    {
      id: 'lc-98',
      title: "Validate BST",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Inorder',
      companies: ["Amazon", "Microsoft", "Google", "Meta"],
      tags: ["bst", "tree", "inorder"],
      problemStatement: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST has left subtree values strictly less and right subtree values strictly greater than the node.",
      examples: [{"input": "root = [2,1,3]", "output": "true"}, {"input": "root = [5,1,4,null,null,3,6]", "output": "false"}],
      constraints: ["Number of nodes in [1, 10^4]", "-2^31 <= Node.val <= 2^31 - 1"],
      hints: ["Use min/max bounds at each node", "Or do inorder traversal and check it is sorted"],
      bruteForce: "Check all pairs \u2014 O(n^2).",
      optimizedSolution: "Recursive with bounds: each node must be in (min, max). O(n)/O(h).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func isValidBST(root *TreeNode) bool {
    return validate(root, nil, nil)
}

func validate(node *TreeNode, min, max *int) bool {
    if node == nil { return true }
    if min != nil && node.Val <= *min { return false }
    if max != nil && node.Val >= *max { return false }
    return validate(node.Left, min, &node.Val) &&
           validate(node.Right, &node.Val, max)
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/validate-bst/"},
      related: ["Recover BST", "BST Iterator"],
      dryRun: {
        title: "Validate BST \u2014 Min/Max Bounds",
        input: "root = [5,1,4,null,null,3,6]",
        result: "Return false \u2014 3 < 5 but in right subtree",
        steps: [
          { line: 2, description: "Call validate(5, nil, nil). 5 has no bounds.", variables: [{"name": "node", "value": "5"}, {"name": "min", "value": "-inf"}, {"name": "max", "value": "+inf"}], dataState: "      5\n     / \\\n    1   4\n       / \\\n      3   6\nBounds: (-inf, +inf) \u2713" },
          { line: 7, description: "validate(1, -inf, 5). 1 > -inf and 1 < 5. Valid. Recurse children (both nil).", variables: [{"name": "node", "value": "1"}, {"name": "min", "value": "-inf"}, {"name": "max", "value": "5"}], dataState: "      5\n     / \\\n   [1]   4\n  leaf, valid\nBounds: (-inf, 5) \u2713" },
          { line: 8, description: "validate(4, 5, +inf). 4 > 5? NO! 4 <= 5. Return false!", variables: [{"name": "node", "value": "4"}, {"name": "min", "value": "5"}, {"name": "max", "value": "+inf"}, {"name": "result", "value": "false"}], dataState: "      5\n     / \\\n    1  [4]\nBounds: (5, +inf)\n4 <= 5? YES \u2192 INVALID!\nResult: false" },
        ],
      },
    },
    {
      id: 'lc-701',
      title: "Insert into BST",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'BST Insert',
      companies: ["Amazon", "Google"],
      tags: ["bst", "tree", "recursion"],
      problemStatement: "You are given the root node of a BST and a value to insert. Return the root of the BST after insertion. The tree remains a valid BST.",
      examples: [{"input": "root = [4,2,7,1,3], val = 5", "output": "[4,2,7,1,3,5]"}],
      constraints: ["Number of nodes in [0, 10^4]", "-10^8 <= Node.val, val <= 10^8"],
      hints: ["If val < node, go left; if val > node, go right", "Insert at the first null position found"],
      bruteForce: "BST property ensures one path to insert.",
      optimizedSolution: "Recursive: go left or right, insert at null. O(h)/O(h).",
      timeComplexity: 'O(h)',
      spaceComplexity: 'O(h)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func insertIntoBST(root *TreeNode, val int) *TreeNode {
    if root == nil {
        return &TreeNode{Val: val}
    }
    if val < root.Val {
        root.Left = insertIntoBST(root.Left, val)
    } else {
        root.Right = insertIntoBST(root.Right, val)
    }
    return root
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/insert-into-a-binary-search-tree/"},
      related: ["Delete Node in BST", "Search in BST"],
      dryRun: {
        title: "Insert into BST \u2014 Recursive",
        input: "root = [4,2,7,1,3], val = 5",
        result: "Insert 5 as right child of 7... wait, 5 < 7, so left of 7",
        steps: [
          { line: 2, description: "insertIntoBST(4, 5). 5 > 4, go right", variables: [{"name": "node", "value": "4"}, {"name": "val", "value": "5"}], dataState: "      4\n     / \\\n    2   7\n   / \\ \n  1   3\n5 > 4, go right \u2192" },
          { line: 7, description: "insertIntoBST(7, 5). 5 < 7, go left", variables: [{"name": "node", "value": "7"}, {"name": "val", "value": "5"}], dataState: "      4\n     / \\\n    2   7\n       /\n5 < 7, go left \u2192" },
          { line: 2, description: "insertIntoBST(nil, 5). Create new node {Val:5}. Return it.", variables: [{"name": "node", "value": "nil"}, {"name": "val", "value": "5"}, {"name": "result", "value": "Node{5}"}], dataState: "      4\n     / \\\n    2   7\n       /\n      5 \u2190 NEW NODE" },
          { line: 7, description: "Back at node 7: root.Left = Node{5}. Return 7.", variables: [{"name": "node", "value": "7"}, {"name": "left", "value": "5"}], dataState: "      4\n     / \\\n    2   7\n       /\n      5\nInserted! \u2713" },
        ],
      },
    },
  ],
};
