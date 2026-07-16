import type { TopicContent } from '../../types';

export const errorHandlingContent: TopicContent = {
  slug: 'golang/error-handling',
  title: 'Error Handling',
  category: 'golang',
  theory: `# Error Handling in Go

## error Interface

\`\`\`go
type error interface { Error() string }
\`\`\`

## Basic Pattern

\`\`\`go
val, err := doSomething()
if err != nil {
    return fmt.Errorf("context: %w", err) // wrap
}
\`\`\`

## Custom Error Types

\`\`\`go
type ValidationError struct {
    Field   string
    Message string
}
func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation error: %s %s", e.Field, e.Message)
}
\`\`\`

## Error Wrapping (Go 1.13+)

\`\`\`go
// Wrap
return fmt.Errorf("operation failed: %w", err)

// Unwrap — check error type in chain
if errors.Is(err, io.EOF) { ... }           // identity check
var ve *ValidationError
if errors.As(err, &ve) { ... }              // type check
\`\`\`

## Sentinel Errors

\`\`\`go
var ErrNotFound = errors.New("not found")
// caller: if errors.Is(err, ErrNotFound) { ... }
\`\`\`

## Panic / Recover

\`\`\`go
func safeDiv(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r)
        }
    }()
    return a / b, nil
}
\`\`\`

**When to panic:** programmer errors (nil dereference, index out of bounds, unreachable code). Not for expected runtime errors.
`,

  examples: `# Error Handling — Examples

## Error Chain

\`\`\`go
// Layer 1: DB
func (r *repo) GetUser(id string) (*User, error) {
    if not found { return nil, ErrNotFound }
    return user, nil
}

// Layer 2: Service
func (s *svc) GetUser(id string) (*User, error) {
    user, err := s.repo.GetUser(id)
    if err != nil { return nil, fmt.Errorf("svc.GetUser: %w", err) }
    return user, nil
}

// Layer 3: Handler
func handler(w http.ResponseWriter, r *http.Request) {
    user, err := svc.GetUser(id)
    if errors.Is(err, ErrNotFound) {
        http.Error(w, "not found", 404)
        return
    }
}
\`\`\`
`,

  patterns: `# Error Handling Patterns

## 1. Wrap with context — fmt.Errorf("context: %w", err)
## 2. Sentinel errors — package-level var for specific conditions
## 3. Error types — custom struct for structured error data
## 4. Panic for programmer errors only — not for user/runtime errors
## 5. Multiple return — Go's idiomatic val, err pattern
`,

  interviewTips: `# Interview Tips — Error Handling

1. Always check errors — never use _ for errors in production code.
2. Wrap errors with context at every boundary for better stack traces.
3. errors.Is for sentinel/value check; errors.As for type check.
4. Panic is for "this should never happen" — use error returns for expected failures.
5. Log errors at the boundary where you handle them, not at every layer.
`,

  commonMistakes: `# Common Mistakes — Error Handling

1. Ignoring errors with _ — bugs hide silently.
2. Returning error without context — hard to trace origin.
3. Using fmt.Errorf without %w — can't errors.Is/As through the chain.
4. Panicking for expected errors — crashes the program.
5. Logging and returning error — leads to duplicate log messages.
`,

  revision: `# Error Handling — Quick Revision

| Tool | Use |\n|------|-----|\n| errors.New | Simple sentinel |\n| fmt.Errorf %w | Wrap with context |\n| errors.Is | Check value/sentinel in chain |\n| errors.As | Check and extract type in chain |\n| Custom error type | Structured error data |\n| panic/recover | Programmer errors only |\n`,

  codeExamples: [{ language: 'go', label: 'Custom Error + Wrap + Unwrap', code: `var ErrNotFound = errors.New("not found")

type DBError struct {
	Op  string
	Err error
}
func (e *DBError) Error() string { return e.Op + ": " + e.Err.Error() }
func (e *DBError) Unwrap() error { return e.Err }

func getUser(id string) (*User, error) {
	if id == "" {
		return nil, &DBError{Op: "getUser", Err: ErrNotFound}
	}
	return &User{ID: id}, nil
}

func main() {
	_, err := getUser("")
	if errors.Is(err, ErrNotFound) {
		fmt.Println("not found") // prints this
	}
	var dbErr *DBError
	if errors.As(err, &dbErr) {
		fmt.Println("op:", dbErr.Op) // "op: getUser"
	}
}` }],

  resources: [
    { title: 'Error Handling — Effective Go', url: 'https://go.dev/doc/effective_go#errors', type: 'docs', free: true },
    { title: 'Working with Errors in Go 1.13', url: 'https://go.dev/blog/go1.13-errors', type: 'article', free: true },
    { title: 'errors package — Go Docs', url: 'https://pkg.go.dev/errors', type: 'docs', free: true },
  ],

  quiz: [
    { id: 'err-q1', question: 'errors.Is(err, target) checks:', options: ['If error types match', 'If err == target OR err wraps target at any depth', 'Only the top-level error', 'If error message contains target'], correctIndex: 1, explanation: 'errors.Is unwraps the error chain looking for a match using == (or Is method if defined). It works through nested wrapping.' },
    { id: 'err-q2', question: 'To use errors.Is/As through fmt.Errorf wrapping, you must use:', options: ['%s verb', '%v verb', '%w verb', '%e verb'], correctIndex: 2, explanation: '%w wraps the error in a way that errors.Is and errors.As can unwrap through it. %s and %v format the error as a string but break the unwrapping chain.' },
    { id: 'err-q3', question: 'When should panic be used in Go?', options: ['For all unexpected errors', 'For programmer errors that indicate a bug (not user/runtime errors)', 'As a replacement for error returns', 'In test code only'], correctIndex: 1, explanation: 'Panic is for "should never happen" situations — nil pointer on something assumed non-nil, index out of expected bounds. Use error returns for expected failures.' },
    { id: 'err-q4', question: 'errors.As(err, &target) does what?', options: ['Formats the error as string', 'Checks if err == target', 'Unwraps error chain looking for type of *target, assigns if found', 'Creates a new error'], correctIndex: 2, explanation: 'errors.As walks the error chain looking for an error that can be assigned to *target\'s type. Useful for extracting fields from custom error types.' },
  ],

  questions: [],
};
