import type { TopicContent } from '../../types';

export const goroutinesContent: TopicContent = {
  slug: 'golang/goroutines',
  title: 'Goroutines',
  category: 'golang',
  theory: `# Goroutines

## What is a Goroutine?

A lightweight thread managed by the Go runtime. Initial stack ~2KB (vs ~2MB for OS thread). Multiplexed onto OS threads by Go's M:N scheduler.

## Creating Goroutines

\`\`\`go
go func() {
    fmt.Println("in goroutine")
}()

go doWork(arg1, arg2) // fire and forget
\`\`\`

## Go Scheduler (GPM Model)

**G** — Goroutine (user-level thread)
**P** — Processor (execution context, bounded by GOMAXPROCS)
**M** — Machine (OS thread)

Each P has a local run queue. Goroutines are stolen between Ps for load balancing.

## GOMAXPROCS

Controls parallelism — number of Ps. Default = number of CPU cores.

\`\`\`go
runtime.GOMAXPROCS(4) // use 4 cores
\`\`\`

## Goroutine Leak

Goroutines that block forever and are never garbage collected.

\`\`\`go
// LEAK: goroutine blocks on ch forever if no sender
go func() {
    v := <-ch // blocks forever
    doWork(v)
}()

// FIX: use context cancellation
go func() {
    select {
    case v := <-ch:
        doWork(v)
    case <-ctx.Done():
        return // clean exit
    }
}()
\`\`\`

## Goroutines vs Threads

| | Goroutine | OS Thread |
|-|-----------|-----------|
| Stack | 2KB–1GB dynamic | 1–8MB fixed |
| Scheduling | Go runtime (M:N) | OS kernel |
| Creation | Microseconds | Milliseconds |
| Switch cost | Very low | Higher |
`,

  examples: `# Goroutines — Examples

## WaitGroup

\`\`\`go
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    wg.Add(1)
    go func(n int) {
        defer wg.Done()
        fmt.Println("worker", n)
    }(i)
}
wg.Wait()
\`\`\`

## Concurrent HTTP Requests

\`\`\`go
var wg sync.WaitGroup
results := make([]string, len(urls))
for i, url := range urls {
    wg.Add(1)
    go func(idx int, u string) {
        defer wg.Done()
        resp, _ := http.Get(u)
        results[idx] = resp.Status
    }(i, url)
}
wg.Wait()
\`\`\`
`,

  patterns: `# Goroutine Patterns

## 1. Fan-Out — one goroutine spawns many workers
## 2. Fan-In — many goroutines send to one channel
## 3. Worker Pool — fixed goroutines consuming a job channel
## 4. Pipeline — goroutines connected by channels
## 5. Done Channel — signal goroutines to exit via context or done channel
`,

  interviewTips: `# Interview Tips — Goroutines

1. Goroutines are cheap but not free — avoid spawning millions without bounding.
2. Always mention goroutine leak prevention — context cancellation.
3. WaitGroup tracks when all goroutines finish; channels signal between goroutines.
4. GOMAXPROCS determines parallelism (not concurrency — Go is always concurrent).
5. Data races: multiple goroutines accessing shared data — use mutex or channels.
`,

  commonMistakes: `# Common Mistakes — Goroutines

1. **Loop variable capture** — always pass loop variable as parameter, not by closure.
2. **No WaitGroup** — main exits before goroutines finish.
3. **Goroutine leak** — goroutine blocks on channel/mutex forever.
4. **Not using -race flag** — data races go undetected.
5. **Spawning unbounded goroutines** — use worker pool instead.

\`\`\`go
// WRONG: all goroutines capture same i
for i := 0; i < 3; i++ {
    go func() { fmt.Println(i) }() // prints 3 3 3
}

// CORRECT
for i := 0; i < 3; i++ {
    go func(n int) { fmt.Println(n) }(i) // prints 0 1 2
}
\`\`\`
`,

  revision: `# Goroutines — Quick Revision

| Concept | Key Point |
|---------|-----------|
| Creation | go fn() — cheap, ~2KB stack |
| Scheduler | M:N, work-stealing |
| GOMAXPROCS | Parallelism = CPU cores |
| WaitGroup | Synchronise goroutine completion |
| Leak | Goroutine blocked forever — use ctx.Done() |
| Loop capture | Pass i as parameter, not by closure |
`,

  codeExamples: [
    { language: 'go', label: 'WaitGroup Example', code: `func main() {
	var wg sync.WaitGroup
	for i := 0; i < 5; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			fmt.Printf("worker %d done\\n", n)
		}(i)
	}
	wg.Wait()
	fmt.Println("all done")
}` },
  ],

  resources: [
    { title: 'Effective Go — Goroutines', url: 'https://go.dev/doc/effective_go#goroutines', type: 'docs', free: true },
    { title: 'Go Concurrency Patterns — Google IO', url: 'https://go.dev/talks/2012/concurrency.slide', type: 'docs', free: true },
    { title: 'Go scheduler internals', url: 'https://www.ardanlabs.com/blog/2018/08/scheduling-in-go-part1.html', type: 'article', free: true },
  ],

  quiz: [
    { id: 'gor-q1', question: 'What is the initial stack size of a goroutine?', options: ['1MB', '8MB', '~2KB', '~2MB'], correctIndex: 2, explanation: 'Goroutines start with ~2KB stacks that grow dynamically as needed. OS threads typically start with 1-8MB fixed stacks.' },
    { id: 'gor-q2', question: 'The classic loop-variable capture bug in goroutines is fixed by:', options: ['Using sync.Mutex', 'Passing the loop variable as a parameter to the goroutine function', 'Using a channel', 'Using GOMAXPROCS=1'], correctIndex: 1, explanation: 'Closures capture the variable by reference. By the time the goroutine runs, the loop may have advanced. Passing as a parameter copies the value.' },
    { id: 'gor-q3', question: 'How do you prevent goroutine leaks?', options: ['Use recover()', 'Use context cancellation and select with ctx.Done()', 'Limit GOMAXPROCS', 'Use WaitGroup everywhere'], correctIndex: 1, explanation: 'Goroutines that block forever are leaks. Use context.WithCancel or WithTimeout; goroutines should select on ctx.Done() to exit cleanly.' },
    { id: 'gor-q4', question: 'GOMAXPROCS controls:', options: ['Number of goroutines', 'Number of OS threads', 'Number of P (logical processors) = max parallelism', 'Channel buffer size'], correctIndex: 2, explanation: 'GOMAXPROCS sets how many Ps (execution contexts) run simultaneously. Default = number of CPU cores. This controls true parallelism.' },
  ],

  questions: [],
};
