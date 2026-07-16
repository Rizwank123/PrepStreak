import type { TopicContent } from '../../types';

export const contextContent: TopicContent = {
  slug: 'golang/context',
  title: 'Context',
  category: 'golang',
  theory: `# Context

## Purpose

Carry cancellation signals, deadlines, and request-scoped values across API boundaries and between goroutines.

## Creating Contexts

\`\`\`go
ctx := context.Background() // root context
ctx := context.TODO()       // placeholder when context is unknown

ctx, cancel := context.WithCancel(parent)
defer cancel() // ALWAYS defer cancel to avoid goroutine leak

ctx, cancel := context.WithTimeout(parent, 5*time.Second)
defer cancel()

ctx, cancel := context.WithDeadline(parent, time.Now().Add(5*time.Second))
defer cancel()

ctx = context.WithValue(parent, key, value) // no cancel
\`\`\`

## Checking Cancellation

\`\`\`go
select {
case result := <-doWork(ctx):
    return result
case <-ctx.Done():
    return ctx.Err() // context.Canceled or context.DeadlineExceeded
}

// or in a loop
for {
    select { case <-ctx.Done(): return ctx.Err() default: }
    // do work
}
\`\`\`

## Context Values

\`\`\`go
type contextKey string
const userIDKey contextKey = "userID"

ctx = context.WithValue(ctx, userIDKey, "user-123")
userID := ctx.Value(userIDKey).(string)
\`\`\`

## Rules

1. Pass context as first parameter: \`func doWork(ctx context.Context, ...)\`
2. Don't store context in struct fields
3. Always cancel — defer cancel()
4. Use typed keys to avoid collisions

## HTTP Integration

\`\`\`go
func handler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context() // already has request deadline
    result, err := queryDB(ctx, userID)
    // if client disconnects, ctx is cancelled automatically
}
\`\`\`
`,

  examples: `# Context — Examples

## Database Query with Timeout

\`\`\`go
func getUser(ctx context.Context, db *sql.DB, id string) (*User, error) {
    ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
    defer cancel()

    var user User
    err := db.QueryRowContext(ctx, "SELECT * FROM users WHERE id=$1", id).Scan(&user.ID, &user.Name)
    if err == context.DeadlineExceeded {
        return nil, fmt.Errorf("query timed out")
    }
    return &user, err
}
\`\`\`

## Cancelling Multiple Goroutines

\`\`\`go
ctx, cancel := context.WithCancel(context.Background())
defer cancel()

for i := 0; i < workers; i++ {
    go func(ctx context.Context) {
        for {
            select {
            case <-ctx.Done():
                return
            case job := <-jobs:
                process(job)
            }
        }
    }(ctx)
}
cancel() // stops all workers
\`\`\`
`,

  patterns: `# Context Patterns

## 1. Request-scoped timeout — WithTimeout on incoming HTTP request
## 2. Cancellation cascade — parent cancel cancels all children
## 3. Value propagation — pass request ID, user ID, logger
## 4. Graceful shutdown — context cancellation to stop goroutines
## 5. Deadline propagation — pass client deadline to downstream calls
`,

  interviewTips: `# Interview Tips — Context

1. Context is the standard way to propagate cancellation and deadlines in Go.
2. Always defer cancel() to prevent goroutine/resource leaks.
3. Use typed keys for context values to avoid collisions.
4. HTTP handlers get context from r.Context() — propagate it downstream.
5. Context values are for request-scoped data (request ID, auth token) — not configuration.
`,

  commonMistakes: `# Common Mistakes — Context

1. Not cancelling — WithCancel/WithTimeout must have cancel() called.
2. Storing context in struct — contexts are request-scoped, not long-lived.
3. Using string keys for context.WithValue — causes collisions with other packages.
4. Not passing context through function calls — breaks cancellation chain.
5. Ignoring ctx.Err() — don't know why context was cancelled.
`,

  revision: `# Context — Quick Revision

| Constructor | Creates | Cancel? |
|-------------|---------|---------|
| Background() | Root context | No |
| WithCancel(p) | Cancellable | Yes |
| WithTimeout(p, d) | Auto-cancel after d | Yes |
| WithDeadline(p, t) | Auto-cancel at t | Yes |
| WithValue(p, k, v) | Value carrier | No |
`,

  codeExamples: [{ language: 'go', label: 'Context with Timeout', code: `func queryWithTimeout(db *sql.DB, id string) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	var u User
	err := db.QueryRowContext(ctx,
		"SELECT id, name FROM users WHERE id = $1", id,
	).Scan(&u.ID, &u.Name)
	if err != nil {
		if ctx.Err() != nil {
			return nil, fmt.Errorf("query timed out: %w", ctx.Err())
		}
		return nil, err
	}
	return &u, nil
}` }],

  resources: [
    { title: 'context package — Go Docs', url: 'https://pkg.go.dev/context', type: 'docs', free: true },
    { title: 'Contexts and structs — Go Blog', url: 'https://go.dev/blog/context-and-structs', type: 'article', free: true },
    { title: 'Go Concurrency Patterns: Context', url: 'https://go.dev/blog/context', type: 'article', free: true },
  ],

  quiz: [
    { id: 'ctx-q1', question: 'Why must you always call the cancel function from WithCancel/WithTimeout?', options: ['It commits the context', 'It releases resources and prevents goroutine leaks', 'It signals workers to stop', 'Required by Go compiler'], correctIndex: 1, explanation: 'Not calling cancel leaks resources — the context\'s internal goroutine/timer runs until the parent context is cancelled. Always defer cancel().' },
    { id: 'ctx-q2', question: 'context.Background() should be used:', options: ['In tests only', 'As the root context at program startup or main', 'As a placeholder', 'For values only'], correctIndex: 1, explanation: 'Background() is the top-level root context. Use it in main, tests, or as the root of a context tree. Use TODO() as a placeholder when the right context is unknown.' },
    { id: 'ctx-q3', question: 'ctx.Done() returns:', options: ['A boolean', 'An error', 'A channel that is closed when the context is cancelled', 'The context value'], correctIndex: 2, explanation: 'ctx.Done() returns a channel. When the context is cancelled or deadline exceeded, the channel is closed — select on it to detect cancellation.' },
    { id: 'ctx-q4', question: 'Why use typed keys (custom type) for context.WithValue?', options: ['Performance', 'Avoid key collisions with other packages', 'Required by Go spec', 'Context only accepts typed keys'], correctIndex: 1, explanation: 'Using string or int keys can collide with keys from other packages. A private type from your package is unique — no other package can accidentally use the same key.' },
  ],

  questions: [],
};
