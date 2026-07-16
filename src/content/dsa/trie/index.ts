import type { TopicContent } from '../../types';

export const trieContent: TopicContent = {
  slug: 'dsa/trie', title: 'Trie', category: 'dsa',
  theory: `# Trie (Prefix Tree)\n\nTree where each node represents a character. All descendants share the same prefix.\n\n## Operations — all O(L) where L = word length\n\n- **Insert** — traverse/create nodes for each character\n- **Search** — traverse; return isEnd at last character\n- **StartsWith** — traverse; return true if prefix exists\n\n## Go Implementation\n\n\`\`\`go\ntype TrieNode struct {\n    children [26]*TrieNode\n    isEnd    bool\n}\n\ntype Trie struct { root *TrieNode }\n\nfunc Constructor() Trie { return Trie{root: &TrieNode{}} }\n\nfunc (t *Trie) Insert(word string) {\n    node := t.root\n    for _, c := range word {\n        idx := c - 'a'\n        if node.children[idx] == nil { node.children[idx] = &TrieNode{} }\n        node = node.children[idx]\n    }\n    node.isEnd = true\n}\n\nfunc (t *Trie) Search(word string) bool {\n    node := t.root\n    for _, c := range word {\n        if node.children[c-'a'] == nil { return false }\n        node = node.children[c-'a']\n    }\n    return node.isEnd\n}\n\nfunc (t *Trie) StartsWith(prefix string) bool {\n    node := t.root\n    for _, c := range prefix {\n        if node.children[c-'a'] == nil { return false }\n        node = node.children[c-'a']\n    }\n    return true\n}\n\`\`\`\n\n## Space Complexity\n\nO(n × L) where n = words, L = average length. Use map for children if large alphabet.`,
  examples: `# Trie — Examples\n\n## Word Search II\n\nBuild a Trie from the word list. DFS on the grid, following trie paths.\n\`\`\`go\n// At each cell, check if current char is a trie child.\n// If node.isEnd, add current path to results.\n// Backtrack by restoring cell and unsetting isEnd to avoid duplicates.\n\`\`\`\n\n## Design Add and Search Words\n\n\`\`\`go\n// Wildcard '.' matches any character:\nfunc (t *WordDictionary) Search(word string) bool {\n    return t.dfs(t.root, word, 0)\n}\nfunc (t *WordDictionary) dfs(node *TrieNode, word string, i int) bool {\n    if i == len(word) { return node.isEnd }\n    c := word[i]\n    if c == '.' {\n        for _, child := range node.children {\n            if child != nil && t.dfs(child, word, i+1) { return true }\n        }\n        return false\n    }\n    child := node.children[c-'a']\n    return child != nil && t.dfs(child, word, i+1)\n}\n\`\`\``,
  patterns: `# Trie Patterns\n\n## 1. Autocomplete — find all words with given prefix\n## 2. Spell Check — check if word exists\n## 3. Wildcard Search — DFS with '.' matching any char\n## 4. Word Search II — trie-guided DFS on grid\n## 5. Longest Common Prefix — walk trie to first branch\n## 6. XOR Maximum — binary trie for bit manipulation`,
  interviewTips: `# Interview Tips — Trie\n\n1. Use [26]*TrieNode for lowercase letters — O(1) child lookup.\n2. For large/variable alphabets, use map[rune]*TrieNode.\n3. Mark isEnd correctly — only true at complete word, not at prefix nodes.\n4. For Word Search II, prune the trie (set isEnd=false) after finding a word to avoid duplicates.`,
  commonMistakes: `# Common Mistakes — Trie\n\n1. Forgetting to set isEnd = true on insert.\n2. Returning true on startsWith when search is needed — they differ by isEnd check.\n3. Not initialising root node before operations.\n4. Off-by-one in character index: c - 'a' gives 0-25 for lowercase.`,
  revision: `# Trie — Quick Revision\n\n| Op | Time | Space |\n|----|------|-------|\n| Insert | O(L) | O(L) |\n| Search | O(L) | O(1) |\n| StartsWith | O(L) | O(1) |\n| Build from n words | O(n×L) | O(n×L) |\n`,
  codeExamples: [{ language: 'go', label: 'Trie Implementation', code: `type TrieNode struct {
	children [26]*TrieNode
	isEnd    bool
}

type Trie struct{ root *TrieNode }

func NewTrie() Trie { return Trie{root: &TrieNode{}} }

func (t *Trie) Insert(word string) {
	node := t.root
	for _, c := range word {
		idx := c - 'a'
		if node.children[idx] == nil {
			node.children[idx] = &TrieNode{}
		}
		node = node.children[idx]
	}
	node.isEnd = true
}

func (t *Trie) Search(word string) bool {
	node := t.root
	for _, c := range word {
		if node.children[c-'a'] == nil {
			return false
		}
		node = node.children[c-'a']
	}
	return node.isEnd
}` }],
  resources: [
    { title: 'Trie — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Trie — GfG', url: 'https://www.geeksforgeeks.org/trie-insert-and-search/', type: 'article', free: true },
    { title: 'LeetCode Trie Tag', url: 'https://leetcode.com/tag/trie/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'tri-q1', question: 'What is the time complexity of inserting a word of length L into a trie?', options: ['O(n)', 'O(L)', 'O(L log n)', 'O(1)'], correctIndex: 1, explanation: 'Insert traverses or creates one node per character — exactly L steps.' },
    { id: 'tri-q2', question: 'How does Search differ from StartsWith in a trie?', options: ['Search is faster', 'Search checks isEnd at the last character; StartsWith does not', 'StartsWith is O(n)', 'No difference'], correctIndex: 1, explanation: 'StartsWith returns true if the prefix path exists. Search additionally requires node.isEnd == true — a complete word was inserted.' },
    { id: 'tri-q3', question: 'For large alphabets (e.g., Unicode), which child storage is more space-efficient?', options: ['[128]*TrieNode', '[26]*TrieNode', 'map[rune]*TrieNode', '[]TrieNode'], correctIndex: 2, explanation: 'A fixed array wastes space for absent characters. map[rune]*TrieNode only allocates for characters that actually appear.' },
    { id: 'tri-q4', question: 'In the "Word Search II" grid problem, why prune the trie after finding a word?', options: ['Speeds up insert', 'Prevents the same word from being added to results multiple times', 'Reduces memory', 'Required for correctness'], correctIndex: 1, explanation: 'Multiple paths through the grid may reach the same trie leaf. Setting isEnd=false after recording the word prevents duplicate results.' },
  ],
  questions: [
    {
      id: 'lc-208',
      title: "Implement Trie (Prefix Tree)",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Trie',
      companies: ["Amazon", "Google", "Microsoft", "Meta"],
      tags: ["trie", "design", "string"],
      problemStatement: "A trie (pronounced \"try\") is a tree-like data structure that stores a dynamic set of strings. Implement Trie with insert, search, and startsWith.",
      examples: [{"input": "insert(\"apple\"), search(\"apple\")", "output": "true"}, {"input": "search(\"app\"), startsWith(\"app\")", "output": "false, true"}],
      constraints: ["1 <= word.length, prefix.length <= 1000", "word and prefix consist of lowercase English letters"],
      hints: ["Each node has 26 children and an end flag", "Insert: create nodes per char, mark end. Search: traverse and check end flag."],
      bruteForce: "Store all strings in a list, scan each \u2014 O(n*m).",
      optimizedSolution: "Trie: O(m) for insert/search/startsWith where m is word length. O(m)/O(ALPHABET_SIZE * N).",
      timeComplexity: 'O(m) per op',
      spaceComplexity: 'O(26 * N)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `type Trie struct {
    children [26]*Trie
    isEnd bool
}

func (t *Trie) Insert(word string) {
    node := t
    for _, c := range word {
        i := c - 'a'
        if node.children[i] == nil {
            node.children[i] = &Trie{}
        }
        node = node.children[i]
    }
    node.isEnd = true
}

func (t *Trie) Search(word string) bool {
    node := t
    for _, c := range word {
        i := c - 'a'
        if node.children[i] == nil { return false }
        node = node.children[i]
    }
    return node.isEnd
}

func (t *Trie) StartsWith(prefix string) bool {
    node := t
    for _, c := range prefix {
        i := c - 'a'
        if node.children[i] == nil { return false }
        node = node.children[i]
    }
    return true
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/implement-trie-prefix-tree/"},
      related: ["Word Search II", "Design Add & Search Words"],
      dryRun: {
        title: "Trie \u2014 Insert and Search",
        input: "insert(\"apple\"), insert(\"app\"), search(\"app\"), startsWith(\"ap\")",
        result: "search(\"app\")=true, startsWith(\"ap\")=true",
        steps: [
          { line: 5, description: "insert(\"apple\"): create nodes a\u2192p\u2192p\u2192l\u2192e. Mark e as end.", variables: [{"name": "word", "value": "apple"}, {"name": "isEnd", "value": "true at e"}], dataState: "root\n  a\n  p\n  p\n  l\n  e (end)" },
          { line: 5, description: "insert(\"app\"): traverse a\u2192p\u2192p (already exist). Mark p as end.", variables: [{"name": "word", "value": "app"}, {"name": "isEnd", "value": "true at 2nd p"}], dataState: "root\n  a\n  p\n  p (end)\n  l\n  e (end)" },
          { line: 15, description: "search(\"app\"): traverse a\u2192p\u2192p. p.isEnd=true. Return true!", variables: [{"name": "result", "value": "true"}], dataState: "root\n  a\n  p\n [p] (end = true)\nSearch \"app\" = true \u2713" },
          { line: 23, description: "startsWith(\"ap\"): traverse a\u2192p. p exists. Return true!", variables: [{"name": "result", "value": "true"}], dataState: "root\n  a\n [p]\nstartsWith \"ap\" = true \u2713" },
        ],
      },
    },
    {
      id: 'lc-212',
      title: "Word Search II",
      difficulty: 'hard',
      platform: 'LeetCode',
      pattern: 'Trie + DFS',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["trie", "dfs", "backtracking"],
      problemStatement: "Given an m x n board of characters and a list of words, return all words that exist in the board. Words can be constructed from adjacent cells (horizontally/vertically), each cell used once per word.",
      examples: [{"input": "board=[[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words=[\"oath\",\"pea\"]", "output": "[\"oath\",\"pea\"]"}],
      constraints: ["m == board.length", "1 <= m, n <= 12", "1 <= words.length <= 3*10^4"],
      hints: ["Build a trie of all words", "DFS from each cell, traversing the trie", "Mark visited cells to avoid reuse"],
      bruteForce: "DFS from each cell for each word \u2014 O(m*n*4^L*W).",
      optimizedSolution: "Trie + DFS: prune when no trie child matches. O(m*n*4^L)/O(W*L).",
      timeComplexity: 'O(m*n*4^L)',
      spaceComplexity: 'O(W*L)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func findWords(board [][]byte, words []string) []string {
    trie := &Trie{}
    for _, w := range words { trie.Insert(w) }
    var result []string
    m, n := len(board), len(board[0])
    var dfs func(i, j int, node *Trie, path string)
    dfs = func(i, j int, node *Trie, path string) {
        if i < 0 || i >= m || j < 0 || j >= n || board[i][j] == '#' { return }
        c := board[i][j] - 'a'
        if node.children[c] == nil { return }
        node = node.children[c]
        path += string(board[i][j])
        if node.isEnd { result = append(result, path); node.isEnd = false }
        tmp := board[i][j]; board[i][j] = '#'
        dfs(i+1, j, node, path); dfs(i-1, j, node, path)
        dfs(i, j+1, node, path); dfs(i, j-1, node, path)
        board[i][j] = tmp
    }
    for i := 0; i < m; i++ {
        for j := 0; j < n; j++ {
            dfs(i, j, trie, "")
        }
    }
    return result
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/word-search-ii/"},
      related: ["Word Search I", "Implement Trie"],
      dryRun: {
        title: "Word Search II \u2014 Trie + DFS",
        input: "board=[[\"a\",\"b\"],[\"c\",\"d\"]], words=[\"abdc\"]",
        result: "Found: \"abdc\"",
        steps: [
          { line: 2, description: "Build trie from words. Insert \"abdc\": a\u2192b\u2192d\u2192c", variables: [{"name": "trie", "value": "a\u2192b\u2192d\u2192c (end)"}], dataState: "Trie: a \u2192 b \u2192 d \u2192 c (end)\nBoard:\n  a b\n  c d" },
          { line: 9, description: "DFS from (0,0) char=a. Trie has child a. Move to node a.", variables: [{"name": "pos", "value": "(0,0)"}, {"name": "char", "value": "a"}, {"name": "path", "value": "\"a\""}], dataState: "Board:\n [a] b\n  c  d\npath = \"a\", trie at node \"a\"" },
          { line: 12, description: "DFS right to (0,1) char=b. Trie node a has child b. path=\"ab\"", variables: [{"name": "pos", "value": "(0,1)"}, {"name": "char", "value": "b"}, {"name": "path", "value": "\"ab\""}], dataState: "Board:\n  a [b]\n  c  d\npath = \"ab\", trie at node \"b\"" },
          { line: 13, description: "DFS down to (1,1) char=d. Trie node b has child d. path=\"abd\"", variables: [{"name": "pos", "value": "(1,1)"}, {"name": "char", "value": "d"}, {"name": "path", "value": "\"abd\""}], dataState: "Board:\n  a  b\n  c [d]\npath = \"abd\", trie at node \"d\"" },
          { line: 12, description: "DFS left to (1,0) char=c. Trie node d has child c. path=\"abdc\". node.isEnd=true!", variables: [{"name": "pos", "value": "(1,0)"}, {"name": "char", "value": "c"}, {"name": "path", "value": "\"abdc\""}, {"name": "result", "value": "[\"abdc\"]"}], dataState: "Board:\n  a  b\n [c] d\npath = \"abdc\"\nisEnd = true \u2713\nFOUND: \"abdc\"" },
        ],
      },
    },
  ],
};
