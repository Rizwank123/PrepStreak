import type { TopicContent } from '../../types';

export const golangInterviewContent: TopicContent = {
  slug: 'interview/golang-interview',
  title: 'Golang Interview Questions',
  category: 'interview',
  theory: `# Golang Interview Questions

## Goroutines vs OS Threads

| | Goroutine | OS Thread |
|-|-----------|-----------|
| Stack | 2KB–1GB dynamic | 1–8MB fixed |
| Scheduled by | Go runtime (M:N) | OS kernel |
| Creation | ~1μs | ~1ms |
| Communication | Channels | Shared memory |

## Defer, Panic, Recover

**defer:** executes LIFO when function returns. Arguments evaluated immediately but execution deferred.

**panic:** halts normal execution, runs deferred functions, then crashes (unless recovered).

**recover:** only useful inside a deferred function. Returns the value passed to panic.

## Interface Nil Gotcha

\`\`\`go
var err *MyError = nil
var e error = err  // e is non-nil! has type *MyError, value nil
fmt.Println(e == nil) // false
\`\`\`

## Map Concurrency

Maps are NOT safe for concurrent read/write. Use \`sync.Map\` or protect with \`sync.RWMutex\`.

## Slice Internals

A slice is (pointer, len, cap). Appending beyond capacity creates a new array.

\`\`\`go
s := make([]int, 3, 5) // len=3, cap=5, array of 5
s2 := s[1:3]           // shares backing array
s2[0] = 99             // modifies s[1] too!
\`\`\`

## String is Immutable Bytes

\`\`\`go
s := "hello"
// s[0] = 'H' // compile error
b := []byte(s); b[0] = 'H'; s2 := string(b)
\`\`\`

## Garbage Collector

Concurrent tri-colour mark-and-sweep. Very low pause times. Escape analysis determines stack vs heap allocation.
`,

  examples: `# Golang Interview — Key Code Patterns

## Defer Evaluation

\`\`\`go
func f() int {
    x := 0
    defer func() { fmt.Println(x) }() // prints current x value on exit
    x = 5
    return x // prints 5
}

// Named return + defer:
func g() (x int) {
    defer func() { x++ }() // deferred func modifies named return
    return 1 // x=1, then defer: x=2, returns 2
}
\`\`\`

## Slice Gotcha

\`\`\`go
a := []int{1,2,3}
b := a[:2] // shares array
b = append(b, 99) // modifies a[2]!
fmt.Println(a) // [1 2 99]

// Safe copy:
c := make([]int, len(a))
copy(c, a)
\`\`\`
`,

  patterns: `# Golang Interview Patterns

## Questions to Prepare
1. Goroutines vs threads
2. defer execution order (LIFO)
3. Named returns + defer interaction
4. nil interface gotcha
5. Slice sharing + append behaviour
6. Map is not concurrent-safe
7. Escape analysis (when does heap allocation happen?)
8. sync.Once for singletons
9. Channel direction (send-only, recv-only)
10. select with nil channel (blocks forever)
`,

  interviewTips: `# Interview Tips — Go Specific

1. Know GMP scheduler (Goroutines, OS threads, Processors).
2. Named returns enable defer to modify return value — common gotcha question.
3. Always explain interface nil vs typed nil with an example.
4. Explain when to use channels vs mutex: "share memory by communicating."
5. Know escape analysis conceptually — stack vs heap allocation affects GC pressure.
`,

  commonMistakes: `# Common Mistakes in Go Interviews

1. Saying goroutines are threads — they're not, they're lighter.
2. Not knowing the nil interface gotcha — very common interview question.
3. Missing defer LIFO order — multiple defers execute in reverse order.
4. Saying maps are concurrent-safe — they're not!
5. Confusing cap and len in slices.
`,

  revision: `# Go Interview — Quick Revision

| Topic | Key Point |
|-------|-----------|
| Goroutines | Lightweight, M:N scheduled, ~2KB stack |
| Channels | Unbuffered blocks until receiver ready |
| Defer | LIFO, args evaluated immediately |
| Panic/Recover | Recover only in deferred function |
| Interface nil | Typed nil ≠ nil interface |
| Map concurrency | Not safe — use sync.Map or RWMutex |
| Slice internals | (ptr, len, cap) — shared backing array |
| GC | Concurrent tri-colour mark-and-sweep |
`,

  codeExamples: [{ language: 'go', label: 'Key Go Gotchas', code: `// 1. Nil interface gotcha
var p *int = nil
var i interface{} = p
fmt.Println(i == nil) // false! interface has type *int

// 2. Defer LIFO
func deferOrder() {
	defer fmt.Println("1") // prints last
	defer fmt.Println("2") // prints second
	defer fmt.Println("3") // prints first
}

// 3. Slice sharing
a := []int{1, 2, 3, 4, 5}
b := a[1:3]
b[0] = 99
fmt.Println(a) // [1 99 3 4 5] — shared!

// 4. Map not concurrent-safe
var m = map[string]int{}
var mu sync.Mutex
// MUST use mu.Lock() / mu.Unlock() for concurrent access` }],

  resources: [
    { title: 'Go FAQ', url: 'https://go.dev/doc/faq', type: 'docs', free: true },
    { title: 'Effective Go', url: 'https://go.dev/doc/effective_go', type: 'docs', free: true },
    { title: 'Go Interview Questions — GfG', url: 'https://www.geeksforgeeks.org/go-interview-questions-and-answers/', type: 'article', free: true },
  ],

  quiz: [
    { id: 'goi-q1', question: 'What is the execution order of multiple defer statements?', options: ['FIFO (first in, first out)', 'LIFO (last in, first out)', 'Alphabetical', 'Random'], correctIndex: 1, explanation: 'Deferred functions execute LIFO — the last defer statement runs first. Think of it as a stack.' },
    { id: 'goi-q2', question: 'Go maps are safe for concurrent use:', options: ['Yes, always', 'No — concurrent reads OK, but any write requires synchronisation', 'Yes, with -race flag', 'Yes, if you use interface{}'], correctIndex: 1, explanation: 'Concurrent map writes (or read+write) cause a data race and can crash the program. Use sync.Map or protect with sync.RWMutex.' },
    { id: 'goi-q3', question: 'When does recover() work to catch a panic?', options: ['Anywhere in the program', 'Only in the panicking goroutine\'s deferred functions', 'In the parent goroutine', 'Only in main()'], correctIndex: 1, explanation: 'recover() must be called directly inside a deferred function in the same goroutine that panicked. It cannot catch panics from other goroutines.' },
    { id: 'goi-q4', question: 'What does append() do when it exceeds slice capacity?', options: ['Returns an error', 'Overwrites the last element', 'Allocates a new larger backing array and copies elements', 'Panics'], correctIndex: 2, explanation: 'When capacity is exceeded, Go allocates a new array (typically 2× the old capacity), copies all elements to it, then appends the new element.' },
    { id: 'goi-q5', question: 'In Go, what is escape analysis?', options: ['Detecting goroutine leaks', 'Compiler analysis to decide if a variable lives on stack or heap', 'Memory leak detection at runtime', 'Static analysis for nil pointer dereferences'], correctIndex: 1, explanation: 'Escape analysis is a compiler optimisation that determines if a variable needs to be heap-allocated (escaped) or can live on the stack. Stack allocation is faster and reduces GC pressure.' },
  ],

  questions: [],
};
