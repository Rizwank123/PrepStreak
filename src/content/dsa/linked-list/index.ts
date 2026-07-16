import type { TopicContent } from '../../types';

export const linkedListContent: TopicContent = {
  slug: 'dsa/linked-list',
  title: 'Linked List',
  category: 'dsa',
  theory: `# Linked List

## Structure

Each node holds data and a pointer to the next node. No random access — traversal is O(n).

\`\`\`go
type ListNode struct {
    Val  int
    Next *ListNode
}
\`\`\`

## Complexity

| Operation | Singly LL | Array |
|-----------|-----------|-------|
| Access by index | O(n) | O(1) |
| Insert at head | O(1) | O(n) |
| Insert at tail | O(n)* | O(1)* |
| Delete by pointer | O(1) | O(n) |
| Search | O(n) | O(n) |

*O(1) with tail pointer

## Dummy Head Trick

Attach a dummy node before head to avoid special-casing empty/head modifications.

\`\`\`go
dummy := &ListNode{Next: head}
curr := dummy
// ... build list ...
return dummy.Next
\`\`\`

## Floyd's Cycle Detection

Use fast (2 steps) and slow (1 step) pointers — they meet iff a cycle exists.
`,

  examples: `# Linked List — Examples

## Reverse Linked List

\`\`\`go
func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    for curr != nil {
        next := curr.Next
        curr.Next = prev
        prev = curr
        curr = next
    }
    return prev
}
\`\`\`

## Detect Cycle (Floyd's)

\`\`\`go
func hasCycle(head *ListNode) bool {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast { return true }
    }
    return false
}
\`\`\`

## Merge Two Sorted Lists

\`\`\`go
func mergeTwoLists(l1, l2 *ListNode) *ListNode {
    dummy := &ListNode{}
    cur := dummy
    for l1 != nil && l2 != nil {
        if l1.Val <= l2.Val { cur.Next = l1; l1 = l1.Next } else { cur.Next = l2; l2 = l2.Next }
        cur = cur.Next
    }
    if l1 != nil { cur.Next = l1 } else { cur.Next = l2 }
    return dummy.Next
}
\`\`\`
`,

  patterns: `# Linked List Patterns

## 1. Fast & Slow Pointer — cycle detection, find middle, nth from end
## 2. Dummy Head — simplify insert/delete at head
## 3. Reverse In-Place — three pointers: prev, curr, next
## 4. Merge — compare heads, advance the smaller
## 5. Two-pass — find length first, then target node

\`\`\`go
// Find middle (slow is middle after loop)
slow, fast := head, head
for fast != nil && fast.Next != nil {
    slow = slow.Next
    fast = fast.Next.Next
}
// slow == middle
\`\`\`
`,

  interviewTips: `# Interview Tips — Linked List

1. Draw the list and trace pointer changes on paper before coding.
2. Always use a **dummy head** — eliminates edge cases for head insertion/deletion.
3. For reversal problems, use three variables: prev, curr, next.
4. Floyd's cycle: fast pointer moves 2, slow moves 1 — they meet iff cycle exists.
5. "Kth from end" — use two pointers k apart.
6. Always check for nil before accessing .Next.
`,

  commonMistakes: `# Common Mistakes — Linked List

1. **Losing the next pointer** before reassignment — save \`next := curr.Next\` first.
2. **Not returning dummy.Next** — returning dummy itself instead of the real head.
3. **Infinite loop in cycle detection** — not advancing both pointers.
4. **Off-by-one in kth-from-end** — initialise gap = k, not k-1.
5. **nil pointer dereference** — always check curr != nil before curr.Next.
`,

  revision: `# Linked List — Quick Revision

| Problem | Pattern | Complexity |
|---------|---------|-----------|
| Reverse list | Three pointers | O(n) / O(1) |
| Detect cycle | Fast/slow | O(n) / O(1) |
| Find cycle start | Fast/slow + reset | O(n) / O(1) |
| Merge sorted | Dummy head | O(n+m) / O(1) |
| Remove nth from end | Two pointers | O(n) / O(1) |
| Find middle | Fast/slow | O(n) / O(1) |
| Palindrome list | Reverse half | O(n) / O(1) |
`,

  codeExamples: [
    { language: 'go', label: 'Reverse List', code: `func reverseList(head *ListNode) *ListNode {
	var prev *ListNode
	curr := head
	for curr != nil {
		next := curr.Next
		curr.Next = prev
		prev = curr
		curr = next
	}
	return prev
}` },
  ],

  resources: [
    { title: 'Linked List — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Linked List — GfG', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/', type: 'article', free: true },
    { title: 'LeetCode Linked List Tag', url: 'https://leetcode.com/tag/linked-list/', type: 'docs', free: true },
  ],

  quiz: [
    { id: 'll-q1', question: 'What is the time complexity of inserting a node at the head of a singly linked list?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correctIndex: 2, explanation: 'Just update the new node\'s Next to the current head and set head = newNode. No traversal required.' },
    { id: 'll-q2', question: 'In Floyd\'s cycle detection, what guarantees that fast and slow pointers meet inside the cycle?', options: ['They start at the same node', 'Fast gains 1 node per step on slow, so it catches up within cycle-length steps', 'The list is sorted', 'There are no null nodes'], correctIndex: 1, explanation: 'Within a cycle of length c, fast closes the gap by 1 each step. They meet in at most c steps after both enter the cycle.' },
    { id: 'll-q3', question: 'What does the dummy head trick eliminate?', options: ['The need for a tail pointer', 'Special cases for inserting/deleting at the head', 'Cycle detection complexity', 'Memory allocation'], correctIndex: 1, explanation: 'With a dummy node before head, all operations (including on the first real node) are uniform — no if-head-is-nil special cases.' },
    { id: 'll-q4', question: 'To find the kth node from the end in one pass, initialize two pointers how far apart?', options: ['k-1 nodes', 'k nodes', 'k+1 nodes', '1 node'], correctIndex: 1, explanation: 'Place second pointer k nodes ahead of first. When second reaches null, first is at the kth-from-end node.' },
  ],

  questions: [
    {
      id: 'lc-206',
      title: 'Reverse Linked List',
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Three Pointers',
      companies: ['Amazon', 'Microsoft', 'Apple', 'Google'],
      tags: ['linked-list', 'pointers'],
      problemStatement: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
      examples: [
        { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
        { input: 'head = [1,2]', output: '[2,1]' },
      ],
      constraints: ['0 ≤ list length ≤ 5000', '-5000 ≤ Node.val ≤ 5000'],
      hints: ['Use three variables: prev, curr, next', 'Save next before changing curr.Next'],
      bruteForce: 'Store values in array, reverse, rebuild list — O(n) time, O(n) space.',
      optimizedSolution: 'Iterate with three pointers: save next, reverse link, advance prev and curr. O(n)/O(1).',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func reverseList(head *ListNode) *ListNode {
    var prev *ListNode
    curr := head
    for curr != nil {
        next := curr.Next
        curr.Next = prev
        prev = curr
        curr = next
    }
    return prev
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/reverse-linked-list/' },
      related: ['Reverse II', 'Reverse Nodes in k-Group'],
      dryRun: {
        title: 'Reverse Linked List — Three Pointers',
        input: 'head = 1 → 2 → 3 → null',
        result: 'Reversed: 3 → 2 → 1 → null',
        steps: [
          { line: 2, description: 'Initialize prev = null, curr = 1', variables: [{ name: 'prev', value: 'null' }, { name: 'curr', value: '1' }], dataState: 'List: 1 → 2 → 3 → null\nprev = null, curr = 1' },
          { line: 4, description: 'Save next = 2. Set curr.Next = null (prev). Advance prev = 1, curr = 2', variables: [{ name: 'next', value: '2' }, { name: 'prev', value: '1' }, { name: 'curr', value: '2' }], dataState: 'List: null ← 1    2 → 3 → null\nprev = 1, curr = 2' },
          { line: 4, description: 'Save next = 3. Set curr.Next = 1 (prev). Advance prev = 2, curr = 3', variables: [{ name: 'next', value: '3' }, { name: 'prev', value: '2' }, { name: 'curr', value: '3' }], dataState: 'List: null ← 1 ← 2    3 → null\nprev = 2, curr = 3' },
          { line: 4, description: 'Save next = null. Set curr.Next = 2 (prev). Advance prev = 3, curr = null', variables: [{ name: 'next', value: 'null' }, { name: 'prev', value: '3' }, { name: 'curr', value: 'null' }], dataState: 'List: null ← 1 ← 2 ← 3\nprev = 3, curr = null' },
          { line: 6, description: 'curr is null, loop ends. Return prev = 3 (new head)', variables: [{ name: 'result', value: '3 → 2 → 1 → null' }], dataState: 'Result: 3 → 2 → 1 → null' },
        ],
      },
    },
    {
      id: 'lc-21',
      title: 'Merge Two Sorted Lists',
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Dummy Head + Two Pointers',
      companies: ['Amazon', 'Google', 'Microsoft', 'Meta'],
      tags: ['linked-list', 'merge', 'two-pointers'],
      problemStatement: 'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
      examples: [
        { input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
        { input: 'l1 = [], l2 = []', output: '[]' },
      ],
      constraints: ['0 ≤ list length ≤ 50', '-100 ≤ Node.val ≤ 100', 'Both lists sorted in non-decreasing order'],
      hints: ['Use a dummy head node', 'Compare values at both pointers, attach the smaller one'],
      bruteForce: 'Put all values in array, sort, rebuild list — O((n+m) log(n+m)) time.',
      optimizedSolution: 'Use dummy head. Compare l1.val and l2.val, attach smaller. O(n+m)/O(1).',
      timeComplexity: 'O(n + m)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func mergeTwoLists(l1, l2 *ListNode) *ListNode {
    dummy := &ListNode{}
    cur := dummy
    for l1 != nil && l2 != nil {
        if l1.Val <= l2.Val {
            cur.Next = l1; l1 = l1.Next
        } else {
            cur.Next = l2; l2 = l2.Next
        }
        cur = cur.Next
    }
    if l1 != nil { cur.Next = l1 } else { cur.Next = l2 }
    return dummy.Next
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
      related: ['Merge K Sorted Lists', 'Sort List'],
      dryRun: {
        title: 'Merge Two Sorted Lists — Dummy Head',
        input: 'l1 = 1 → 2 → 4, l2 = 1 → 3 → 4',
        result: 'Merged: 1 → 1 → 2 → 3 → 4 → 4',
        steps: [
          { line: 2, description: 'Create dummy node. cur = dummy', variables: [{ name: 'dummy', value: '0 → null' }, { name: 'cur', value: 'dummy' }, { name: 'l1', value: '1→2→4' }, { name: 'l2', value: '1→3→4' }], dataState: 'l1: 1 → 2 → 4\nl2: 1 → 3 → 4\nresult: dummy → null' },
          { line: 5, description: 'l1.val=1 ≤ l2.val=1. Attach l1. Advance l1 to 2, cur to 1', variables: [{ name: 'l1', value: '2→4' }, { name: 'l2', value: '1→3→4' }, { name: 'cur', value: '1' }], dataState: 'l1: 2 → 4\nl2: 1 → 3 → 4\nresult: dummy → 1 → null' },
          { line: 6, description: 'l1.val=2 > l2.val=1. Attach l2. Advance l2 to 3, cur to 1', variables: [{ name: 'l1', value: '2→4' }, { name: 'l2', value: '3→4' }, { name: 'cur', value: '1' }], dataState: 'l1: 2 → 4\nl2: 3 → 4\nresult: dummy → 1 → 1 → null' },
          { line: 5, description: 'l1.val=2 ≤ l2.val=3. Attach l1. Advance l1 to 4, cur to 2', variables: [{ name: 'l1', value: '4' }, { name: 'l2', value: '3→4' }, { name: 'cur', value: '2' }], dataState: 'l1: 4\nl2: 3 → 4\nresult: dummy → 1 → 1 → 2 → null' },
          { line: 6, description: 'l1.val=4 > l2.val=3. Attach l2. Advance l2 to 4, cur to 3', variables: [{ name: 'l1', value: '4' }, { name: 'l2', value: '4' }, { name: 'cur', value: '3' }], dataState: 'l1: 4\nl2: 4\nresult: dummy → 1 → 1 → 2 → 3 → null' },
          { line: 5, description: 'l1.val=4 ≤ l2.val=4. Attach l1. Advance l1 to null, cur to 4', variables: [{ name: 'l1', value: 'null' }, { name: 'l2', value: '4' }, { name: 'cur', value: '4' }], dataState: 'l1: null\nl2: 4\nresult: dummy → 1 → 1 → 2 → 3 → 4 → null' },
          { line: 9, description: 'l1 is null. Attach remaining l2 (4). Result complete', variables: [{ name: 'result', value: '1→1→2→3→4→4' }], dataState: 'Result: 1 → 1 → 2 → 3 → 4 → 4 → null' },
        ],
      },
    },
  ],
};
