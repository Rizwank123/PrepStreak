import type { TopicContent } from '../../types';

export const channelsContent: TopicContent = {
  slug: 'golang/channels',
  title: 'Channels',
  category: 'golang',
  theory: `# Channels

## Core Concept

Typed conduits for goroutine communication. "Don't communicate by sharing memory; share memory by communicating."

## Unbuffered vs Buffered

\`\`\`go
ch := make(chan int)     // unbuffered — blocks until receiver ready
ch := make(chan int, 10) // buffered — blocks only when full
\`\`\`

**Unbuffered:** sender blocks until receiver reads. Synchronisation point.
**Buffered:** sender blocks only when buffer full. Receiver blocks when empty.

## Send, Receive, Close

\`\`\`go
ch <- v        // send
v := <-ch      // receive (blocks)
v, ok := <-ch  // ok=false when closed and drained
close(ch)      // signal no more values (don't close from receiver side)
\`\`\`

## Range over Channel

\`\`\`go
for v := range ch { // stops when ch is closed and drained
    process(v)
}
\`\`\`

## Nil Channel

Sending/receiving on nil channel blocks forever. Use to disable select case.

## Channel Direction

\`\`\`go
func producer(out chan<- int) { out <- 42 }  // send-only
func consumer(in <-chan int) { v := <-in }   // recv-only
\`\`\`

## Select

\`\`\`go
select {
case v := <-ch1:    process(v)
case ch2 <- data:   // sent
case <-time.After(5 * time.Second): timeout()
case <-ctx.Done():  return
default:            // non-blocking
}
\`\`\`
`,

  examples: `# Channels — Examples

## Pipeline

\`\`\`go
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() { for _, n := range nums { out <- n }; close(out) }()
    return out
}
func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() { for n := range in { out <- n*n }; close(out) }()
    return out
}
for n := range square(generate(1,2,3,4)) { fmt.Println(n) }
\`\`\`

## Fan-Out

\`\`\`go
func fanOut(in <-chan int, n int) []<-chan int {
    chs := make([]<-chan int, n)
    for i := range chs {
        out := make(chan int)
        chs[i] = out
        go func() { for v := range in { out <- v }; close(out) }()
    }
    return chs
}
\`\`\`
`,

  patterns: `# Channel Patterns

## 1. Done Channel — signal shutdown: close(done)
## 2. Pipeline — chain of goroutines connected by channels
## 3. Fan-Out — distribute work to multiple goroutines
## 4. Fan-In — merge multiple channels into one
## 5. Timeout — select with time.After or ctx.Deadline
## 6. Semaphore — buffered channel as counting semaphore
`,

  interviewTips: `# Interview Tips — Channels

1. Unbuffered channel = synchronisation; buffered = queue.
2. Only close from the sender side — receiving on closed channel panics if writing.
3. Select with default = non-blocking; without default = blocks until any case ready.
4. Nil channel in select effectively removes that case.
5. range over channel stops on close — always close when done sending.
`,

  commonMistakes: `# Common Mistakes — Channels

1. Closing channel from receiver — panic if sender tries to send after close.
2. Sending to closed channel — panic.
3. Deadlock — all goroutines blocked, no one can proceed.
4. Forgetting to close — range loop hangs forever.
5. Buffered channel as synchronisation — doesn't guarantee sync; use unbuffered.
`,

  revision: `# Channels — Quick Revision

| | Unbuffered | Buffered |\n|-|------------|----------|\n| Blocks send | Until receiver ready | Until full |\n| Blocks recv | Until sender sends | Until non-empty |\n| Synchronises | Yes | No |\n| Use for | Handoff, sync | Decoupling, throughput |\n`,

  codeExamples: [{ language: 'go', label: 'Select with Timeout', code: `func fetchWithTimeout(url string, timeout time.Duration) (string, error) {
	result := make(chan string, 1)
	go func() {
		resp, err := http.Get(url)
		if err != nil { result <- "error"; return }
		defer resp.Body.Close()
		b, _ := io.ReadAll(resp.Body)
		result <- string(b)
	}()
	select {
	case res := <-result:
		return res, nil
	case <-time.After(timeout):
		return "", errors.New("timeout")
	}
}` }],

  resources: [
    { title: 'Go Channels — A Tour of Go', url: 'https://go.dev/tour/concurrency/2', type: 'docs', free: true },
    { title: 'Pipeline Patterns — Go Blog', url: 'https://go.dev/blog/pipelines', type: 'article', free: true },
    { title: 'Channels — Effective Go', url: 'https://go.dev/doc/effective_go#channels', type: 'docs', free: true },
  ],

  quiz: [
    { id: 'ch-q1', question: 'An unbuffered channel send blocks until:', options: ['The program exits', 'A receiver is ready', 'The buffer is full', 'Context is cancelled'], correctIndex: 1, explanation: 'Unbuffered channel has no buffer. The sender blocks until a goroutine is ready to receive — they synchronise at the point of transfer.' },
    { id: 'ch-q2', question: 'What happens when you receive from a closed, empty channel?', options: ['Panic', 'Blocks forever', 'Returns zero value and ok=false', 'Returns zero value and ok=true'], correctIndex: 2, explanation: 'v, ok := <-ch returns the zero value and ok=false when the channel is closed and drained. This is how range over channel knows to stop.' },
    { id: 'ch-q3', question: 'A nil channel in a select statement:', options: ['Panics', 'Always selects immediately', 'That case is never selected (blocks)', 'Causes compilation error'], correctIndex: 2, explanation: 'Sending or receiving on a nil channel blocks forever. In a select, this effectively removes that case from consideration.' },
    { id: 'ch-q4', question: 'Who should close a channel?', options: ['The receiver', 'Either sender or receiver', 'The sender (producer)', 'The main goroutine always'], correctIndex: 2, explanation: 'Only the sender should close. The receiver has no way to know if the sender is done. Sending to a closed channel panics.' },
  ],

  questions: [],
};
