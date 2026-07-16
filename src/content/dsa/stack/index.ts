import type { TopicContent } from '../../types';

export const stackContent: TopicContent = {
  slug: 'dsa/stack', title: 'Stack', category: 'dsa',
  theory: `# Stack\n\nLIFO (Last-In First-Out). Push and pop at the top in O(1).\n\n## Go Implementation\n\n\`\`\`go\nstack := []int{}               // use slice\nstack = append(stack, x)      // push\ntop  := stack[len(stack)-1]   // peek\nstack = stack[:len(stack)-1]  // pop\n\`\`\`\n\n## Use Cases\n- Bracket matching / expression evaluation\n- DFS iterative\n- Monotonic stack (next greater element)\n- Undo/redo, function call stack\n\n## Complexity\n| Op | Time |\n|----|------|\n| Push | O(1) |\n| Pop | O(1) |\n| Peek | O(1) |\n`,
  examples: `# Stack — Examples\n\n## Valid Parentheses\n\n\`\`\`go\nfunc isValid(s string) bool {\n    stack := []rune{}\n    pair := map[rune]rune{')': '(', '}': '{', ']': '['}\n    for _, c := range s {\n        if c == '(' || c == '{' || c == '[' {\n            stack = append(stack, c)\n        } else {\n            if len(stack) == 0 || stack[len(stack)-1] != pair[c] { return false }\n            stack = stack[:len(stack)-1]\n        }\n    }\n    return len(stack) == 0\n}\n\`\`\`\n\n## Min Stack\n\n\`\`\`go\ntype MinStack struct { vals, mins []int }\nfunc (ms *MinStack) Push(v int) {\n    ms.vals = append(ms.vals, v)\n    if len(ms.mins) == 0 || v <= ms.mins[len(ms.mins)-1] { ms.mins = append(ms.mins, v) }\n}\nfunc (ms *MinStack) Pop() {\n    top := ms.vals[len(ms.vals)-1]\n    ms.vals = ms.vals[:len(ms.vals)-1]\n    if top == ms.mins[len(ms.mins)-1] { ms.mins = ms.mins[:len(ms.mins)-1] }\n}\nfunc (ms *MinStack) GetMin() int { return ms.mins[len(ms.mins)-1] }\n\`\`\``,
  patterns: `# Stack Patterns\n\n## 1. Bracket Matching\nPush opens, pop and check on closes.\n\n## 2. Monotonic Stack\nKeep stack in increasing/decreasing order. Pop when invariant breaks.\n\n## 3. Evaluate Expression\nTwo stacks: one for operands, one for operators.\n\n## 4. Iterative DFS\nPush neighbours, pop and process.`,
  interviewTips: `# Interview Tips — Stack\n\n1. For bracket problems, clarify: which bracket types? nested? mixed?\n2. Monotonic stack: decide increasing vs decreasing based on what you need (next greater vs next smaller).\n3. Min stack trick: maintain a parallel min stack — push only when new value ≤ current min.\n4. Expression evaluation: handle operator precedence with precedence map.`,
  commonMistakes: `# Common Mistakes — Stack\n\n1. Peeking/popping an empty stack — always check len > 0.\n2. Wrong monotonic direction — next greater needs decreasing stack (pop when curr > top).\n3. Not clearing stack between test cases.\n4. Using pop when you only need peek.`,
  revision: `# Stack — Quick Revision\n\n| Problem | Stack Type | Complexity |\n|---------|-----------|----------|\n| Valid parentheses | Simple | O(n)/O(n) |\n| Min stack | Parallel min stack | O(1)/O(n) |\n| Daily temperatures | Monotonic dec | O(n)/O(n) |\n| Next greater element | Monotonic dec | O(n)/O(n) |\n| Largest rectangle | Monotonic inc | O(n)/O(n) |\n| Evaluate RPN | Operand stack | O(n)/O(n) |\n`,
  codeExamples: [{ language: 'go', label: 'Valid Parentheses', code: `func isValid(s string) bool {
	stack := []rune{}
	pair := map[rune]rune{')': '(', '}': '{', ']': '['}
	for _, c := range s {
		if c == '(' || c == '{' || c == '[' {
			stack = append(stack, c)
		} else {
			if len(stack) == 0 || stack[len(stack)-1] != pair[c] {
				return false
			}
			stack = stack[:len(stack)-1]
		}
	}
	return len(stack) == 0
}` }],
  resources: [
    { title: 'Stack — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Stack — GfG', url: 'https://www.geeksforgeeks.org/stack-data-structure/', type: 'article', free: true },
    { title: 'LeetCode Stack Tag', url: 'https://leetcode.com/tag/stack/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'stk-q1', question: 'Which problem is a classic stack application?', options: ['Binary search', 'Bracket matching', 'Merge sort', 'Dijkstra'], correctIndex: 1, explanation: 'Push opening brackets, pop on closing. If popped bracket doesn\'t match, invalid.' },
    { id: 'stk-q2', question: 'A monotonic decreasing stack is used for which problem?', options: ['Min stack', 'Next greater element', 'Valid parentheses', 'LRU cache'], correctIndex: 1, explanation: 'Pop elements smaller than the current — those find their "next greater" as the current element.' },
    { id: 'stk-q3', question: 'GetMin() on a min stack should have what complexity?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctIndex: 2, explanation: 'A parallel mins stack tracks the minimum at each level. GetMin() just peeks the top of mins.' },
    { id: 'stk-q4', question: 'In Go, what slice operation implements a stack pop?', options: ['stack[1:]', 'stack[:len(stack)-1]', 'stack[0]', 'append(stack, 0)'], correctIndex: 1, explanation: 'stack[:len(stack)-1] removes the last element, which is the top of the stack.' },
  ],
  questions: [
    {
      id: 'lc-20',
      title: "Valid Parentheses",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Stack',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["stack", "string"],
      problemStatement: "Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid. A string is valid if brackets are closed in the correct order.",
      examples: [{"input": "s = \"()\"", "output": "true"}, {"input": "s = \"()[]{}\"", "output": "true"}, {"input": "s = \"(]\"", "output": "false"}],
      constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only"],
      hints: ["Use a stack to track opening brackets", "For each closing bracket, check if the top of the stack matches"],
      bruteForce: "Check all pairs \u2014 O(n^2).",
      optimizedSolution: "Stack: push opening brackets, pop and match on closing. O(n)/O(n).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func isValid(s string) bool {
    var stack []byte
    pairs := map[byte]byte{")": "(", "]": "[", "}": "{"}
    for i := 0; i < len(s); i++ {
        c := s[i]
        if c == '(' || c == '[' || c == '{' {
            stack = append(stack, c)
        } else {
            if len(stack) == 0 || stack[len(stack)-1] != pairs[c] {
                return false
            }
            stack = stack[:len(stack)-1]
        }
    }
    return len(stack) == 0
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/valid-parentheses/"},
      related: ["Min Stack", "Generate Parentheses"],
      dryRun: {
        title: "Valid Parentheses \u2014 Stack",
        input: "s = \"()[]{}\"",
        result: "Return true \u2014 all brackets matched",
        steps: [
          { line: 2, description: "Initialize empty stack", variables: [{"name": "stack", "value": "[]"}], dataState: "s = ( ) [ ] { }\n    ^\nstack = []" },
          { line: 5, description: "i=0, char=\"(\". Push to stack", variables: [{"name": "stack", "value": "[(]"}], dataState: "s = ( ) [ ] { }\n    ^\nstack = [\"(\"]" },
          { line: 7, description: "i=1, char=\")\". Top of stack = \"(\". Match! Pop.", variables: [{"name": "stack", "value": "[]"}], dataState: "s = ( ) [ ] { }\n      ^\nstack = []\n\")\" matches \"(\" \u2713" },
          { line: 5, description: "i=2, char=\"[\". Push to stack", variables: [{"name": "stack", "value": "[[]"}], dataState: "s = ( ) [ ] { }\n        ^\nstack = [\"[\"]" },
          { line: 7, description: "i=3, char=\"]\". Top of stack = \"[\". Match! Pop.", variables: [{"name": "stack", "value": "[]"}], dataState: "s = ( ) [ ] { }\n          ^\nstack = []\n\"]\" matches \"[\" \u2713" },
          { line: 5, description: "i=4, char=\"{\". Push to stack", variables: [{"name": "stack", "value": "[{]"}], dataState: "s = ( ) [ ] { }\n            ^\nstack = [\"{\"]" },
          { line: 7, description: "i=5, char=\"}\". Top of stack = \"{\". Match! Pop.", variables: [{"name": "stack", "value": "[]"}], dataState: "s = ( ) [ ] { }\n              ^\nstack = []\n\"}\" matches \"{\" \u2713" },
          { line: 10, description: "Stack is empty. Return true!", variables: [{"name": "result", "value": "true"}], dataState: "Stack empty = VALID \u2713\nResult: true" },
        ],
      },
    },
    {
      id: 'lc-155',
      title: "Min Stack",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Stack',
      companies: ["Amazon", "Bloomberg", "Microsoft"],
      tags: ["stack", "design"],
      problemStatement: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
      examples: [{"input": "push(-2), push(0), push(-3), getMin()", "output": "-3"}, {"input": "pop(), top(), getMin()", "output": "0, 0"}],
      constraints: ["-2^31 <= val <= 2^31 - 1", "pop, top, getMin called on non-empty stack"],
      hints: ["Use a second stack to track the minimum at each level", "When pushing, also push the new min to the min stack"],
      bruteForce: "Scan stack to find min \u2014 O(n) per getMin call.",
      optimizedSolution: "Two stacks: main stack + min stack. O(1) for all operations. O(n)/O(n).",
      timeComplexity: 'O(1) per op',
      spaceComplexity: 'O(n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `type MinStack struct {
    stack []int
    minSt []int
}

func (m *MinStack) Push(val int) {
    m.stack = append(m.stack, val)
    if len(m.minSt) == 0 || val <= m.minSt[len(m.minSt)-1] {
        m.minSt = append(m.minSt, val)
    }
}

func (m *MinStack) Pop() {
    val := m.stack[len(m.stack)-1]
    m.stack = m.stack[:len(m.stack)-1]
    if val == m.minSt[len(m.minSt)-1] {
        m.minSt = m.minSt[:len(m.minSt)-1]
    }
}

func (m *MinStack) Top() int { return m.stack[len(m.stack)-1] }
func (m *MinStack) GetMin() int { return m.minSt[len(m.minSt)-1] }`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/min-stack/"},
      related: ["Valid Parentheses", "Max Stack"],
      dryRun: {
        title: "Min Stack \u2014 Two Stacks",
        input: "push(-2), push(0), push(-3)",
        result: "getMin() = -3, top() = 0 after pop",
        steps: [
          { line: 1, description: "Initialize main stack and min stack", variables: [{"name": "stack", "value": "[]"}, {"name": "minSt", "value": "[]"}], dataState: "stack = []\nminSt  = []" },
          { line: 5, description: "push(-2): stack=[-2]. -2 <= empty, push to minSt: minSt=[-2]", variables: [{"name": "stack", "value": "[-2]"}, {"name": "minSt", "value": "[-2]"}, {"name": "min", "value": "-2"}], dataState: "stack = [-2]\nminSt  = [-2]\ncurrent min = -2" },
          { line: 5, description: "push(0): stack=[-2,0]. 0 > -2, do NOT push to minSt", variables: [{"name": "stack", "value": "[-2, 0]"}, {"name": "minSt", "value": "[-2]"}, {"name": "min", "value": "-2"}], dataState: "stack = [-2, 0]\nminSt  = [-2]\ncurrent min = -2" },
          { line: 5, description: "push(-3): stack=[-2,0,-3]. -3 <= -2, push to minSt: minSt=[-2,-3]", variables: [{"name": "stack", "value": "[-2, 0, -3]"}, {"name": "minSt", "value": "[-2, -3]"}, {"name": "min", "value": "-3"}], dataState: "stack = [-2, 0, -3]\nminSt  = [-2, -3]\ncurrent min = -3" },
          { line: 11, description: "getMin(): return top of minSt = -3", variables: [{"name": "getMin", "value": "-3"}], dataState: "getMin() = -3 \u2713" },
          { line: 9, description: "pop(): pop -2 from stack. -3 == minSt top, pop minSt too. minSt=[-2]", variables: [{"name": "stack", "value": "[-2, 0]"}, {"name": "minSt", "value": "[-2]"}, {"name": "min", "value": "-2"}], dataState: "stack = [-2, 0]\nminSt  = [-2]\ncurrent min = -2" },
        ],
      },
    },
  ],
};
