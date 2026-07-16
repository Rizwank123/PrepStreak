import type { TopicContent } from '../../types';

export const concurrencyContent: TopicContent = {
  slug: 'golang/concurrency',
  title: 'Concurrency Patterns',
  category: 'golang',
  theory: `# Go Concurrency Patterns

## Mutex vs Channels

**Mutex:** protect shared state — counters, caches, maps.
**Channels:** transfer ownership, coordinate goroutines.

> "Use channels to communicate; use mutexes to protect."

## Mutex

\`\`\`go
var mu sync.Mutex
var count int

func inc() {
    mu.Lock()
    defer mu.Unlock()
    count++
}

// RWMutex — multiple readers, exclusive writer
var rw sync.RWMutex
func read() int {
    rw.RLock(); defer rw.RUnlock()
    return count
}
\`\`\`

## Worker Pool

\`\`\`go
func workerPool(jobs <-chan Job, results chan<- Result, n int) {
    var wg sync.WaitGroup
    for i := 0; i < n; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for j := range jobs {
                results <- process(j)
            }
        }()
    }
    go func() { wg.Wait(); close(results) }()
}
\`\`\`

## Semaphore (buffered channel)

\`\`\`go
sem := make(chan struct{}, 10) // max 10 concurrent
for _, url := range urls {
    sem <- struct{}{} // acquire
    go func(u string) {
        defer func() { <-sem }() // release
        fetch(u)
    }(url)
}
\`\`\`

## Once

\`\`\`go
var once sync.Once
var singleton *DB

func GetDB() *DB {
    once.Do(func() { singleton = connect() })
    return singleton
}
\`\`\`
`,

  examples: `# Concurrency Patterns — Examples

## Fan-In (Merge Channels)

\`\`\`go
func merge(cs ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    merged := make(chan int)
    output := func(c <-chan int) {
        defer wg.Done()
        for v := range c { merged <- v }
    }
    wg.Add(len(cs))
    for _, c := range cs { go output(c) }
    go func() { wg.Wait(); close(merged) }()
    return merged
}
\`\`\`

## Pipeline

\`\`\`go
func pipeline(nums []int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums { out <- n * n }
        close(out)
    }()
    return out
}
\`\`\`
`,

  patterns: `# Concurrency Patterns

## 1. Worker Pool — bounded goroutines for CPU/IO work
## 2. Pipeline — stages connected by channels
## 3. Fan-Out — one input distributed to multiple workers
## 4. Fan-In — multiple inputs merged into one output
## 5. Semaphore — limit concurrency with buffered channel
## 6. Once — run exactly once (singleton init, on-startup hooks)
## 7. ErrGroup — error propagation in goroutine groups
`,

  interviewTips: `# Interview Tips — Concurrency Patterns

1. Mention worker pool when asked about limiting concurrency.
2. ErrGroup (golang.org/x/sync/errgroup) handles goroutine error propagation cleanly.
3. Fan-out + fan-in is a powerful pattern for parallel work + result aggregation.
4. Always close channels from the producer/sender side.
5. Use context for cancellation in all async operations.
`,

  commonMistakes: `# Common Mistakes — Concurrency

1. Data race — concurrent map write/read without sync.
2. Not closing channels — workers block forever in range loop.
3. Unbounded goroutines — fan-out without limiter.
4. Mutex deadlock — nested locks or forgetting to unlock.
5. sync.WaitGroup not Add'd before go — race condition.
`,

  revision: `# Concurrency — Quick Revision

| Pattern | When | Tool |
|---------|------|------|
| Mutex | Shared state | sync.Mutex / RWMutex |
| Worker Pool | Bounded goroutines | chan + WaitGroup |
| Pipeline | Transform chain | chan + goroutines |
| Semaphore | Max concurrency | buffered chan |
| Once | Single init | sync.Once |
| Fan-In | Merge channels | WaitGroup + close |
`,

  codeExamples: [{ language: 'go', label: 'Worker Pool', code: `func workerPool(numWorkers int, jobs <-chan int, results chan<- int) {
	var wg sync.WaitGroup
	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := range jobs {
				results <- j * j // do work
			}
		}()
	}
	go func() {
		wg.Wait()
		close(results)
	}()
}` }],

  resources: [
    { title: 'Go Concurrency Patterns — Google IO 2012', url: 'https://go.dev/talks/2012/concurrency.slide', type: 'docs', free: true },
    { title: 'Advanced Go Concurrency Patterns — Google IO 2013', url: 'https://go.dev/talks/2013/advconc.slide', type: 'docs', free: true },
    { title: 'sync package — Go Docs', url: 'https://pkg.go.dev/sync', type: 'docs', free: true },
  ],

  quiz: [
    { id: 'con-q1', question: 'When should you use a Mutex instead of a channel?', options: ['For pipeline stages', 'To protect shared mutable state (counters, maps)', 'For fan-out patterns', 'For timeout handling'], correctIndex: 1, explanation: 'Mutex is appropriate for protecting shared state (read-modify-write). Channels are for communication and transferring ownership between goroutines.' },
    { id: 'con-q2', question: 'How does a buffered channel implement a semaphore?', options: ['Each receive acquires, each send releases', 'Each send acquires (blocks when full), receive releases', 'It doesn\'t implement semaphore', 'Both send and receive acquire'], correctIndex: 1, explanation: 'Buffer size = max concurrent operations. Send (acquire) blocks when full. Receive (release) frees a slot. This limits concurrency to buffer size.' },
    { id: 'con-q3', question: 'sync.Once guarantees that its function runs:', options: ['At most once', 'Exactly once even under concurrent calls', 'Once per goroutine', 'Once per program restart'], correctIndex: 1, explanation: 'Even if multiple goroutines call once.Do simultaneously, only one runs the function. All others block until it completes. Perfect for singleton initialization.' },
    { id: 'con-q4', question: 'In a worker pool, the results channel should be closed by:', options: ['Each worker goroutine', 'The main goroutine immediately', 'A coordinating goroutine after all workers finish (via WaitGroup)', 'Never — receivers detect EOF'], correctIndex: 2, explanation: 'Launch a goroutine that wg.Wait()s then closes results. Individual workers can\'t close it (only the last one should, but you don\'t know which that is without coordination).' },
  ],

  questions: [],
};
