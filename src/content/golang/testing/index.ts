import type { TopicContent } from '../../types';

export const testingContent: TopicContent = {
  slug: 'golang/testing',
  title: 'Testing',
  category: 'golang',
  theory: `# Testing in Go

## Basic Test

\`\`\`go
// file: add_test.go
func TestAdd(t *testing.T) {
    got := Add(2, 3)
    want := 5
    if got != want {
        t.Errorf("Add(2,3) = %d; want %d", got, want)
    }
}
\`\`\`

## Table-Driven Tests

\`\`\`go
func TestAdd(t *testing.T) {
    cases := []struct{ a, b, want int }{
        {2, 3, 5}, {0, 0, 0}, {-1, 1, 0},
    }
    for _, tc := range cases {
        t.Run(fmt.Sprintf("%d+%d", tc.a, tc.b), func(t *testing.T) {
            if got := Add(tc.a, tc.b); got != tc.want {
                t.Errorf("got %d want %d", got, tc.want)
            }
        })
    }
}
\`\`\`

## Benchmarks

\`\`\`go
func BenchmarkSort(b *testing.B) {
    for i := 0; i < b.N; i++ {
        sort.Ints([]int{5,3,1,4,2})
    }
}
// go test -bench=. -benchmem
\`\`\`

## Running Tests

\`\`\`bash
go test ./...          # all packages
go test -v             # verbose
go test -run TestAdd   # specific test
go test -race          # detect data races
go test -cover         # coverage report
go test -bench=.       # run benchmarks
\`\`\`

## Testify

\`\`\`go
import "github.com/stretchr/testify/assert"

func TestAdd(t *testing.T) {
    assert.Equal(t, 5, Add(2, 3))
    assert.NoError(t, err)
    assert.ErrorIs(t, err, ErrNotFound)
}
\`\`\`

## Mocking

Define interface → mock implements it → inject mock in test.
`,

  examples: `# Testing — Examples

## HTTP Handler Test

\`\`\`go
func TestGetUser(t *testing.T) {
    mockRepo := &MockUserRepo{user: &User{ID: "1", Name: "Alice"}}
    svc := NewUserService(mockRepo)
    handler := NewHandler(svc)

    req := httptest.NewRequest(http.MethodGet, "/users/1", nil)
    w := httptest.NewRecorder()
    handler.ServeHTTP(w, req)

    assert.Equal(t, http.StatusOK, w.Code)
    var got User
    json.NewDecoder(w.Body).Decode(&got)
    assert.Equal(t, "Alice", got.Name)
}
\`\`\`
`,

  patterns: `# Testing Patterns

## 1. Table-driven tests — one loop, many cases\n## 2. Interface mocking — test in isolation\n## 3. httptest.NewRecorder — test HTTP handlers without server\n## 4. Subtests t.Run — parallel subtests with t.Parallel()\n## 5. Test helpers — t.Helper() marks helper functions\n## 6. Fixtures — testdata/ directory for input files`,

  interviewTips: `# Interview Tips — Testing

1. Table-driven tests are the Go idiom — use them always.
2. Test at the right level: unit (mock dependencies), integration (real DB), e2e (HTTP).
3. -race flag should be part of CI — catches race conditions.
4. 80% coverage is a good target; 100% is not always practical.
5. httptest package makes HTTP handler testing clean and fast.
`,

  commonMistakes: `# Common Mistakes — Testing

1. No table-driven tests — duplicate test functions.
2. Testing implementation, not behaviour — brittle tests.
3. Not running with -race — races slip to production.
4. Hard-coded external dependencies — use interfaces and mocks.
5. Missing t.Helper() on test helper functions — error points to wrong line.
`,

  revision: `# Testing — Quick Revision

| Command | Purpose |\n|---------|--------|\n| go test ./... | Run all tests |\n| go test -v | Verbose output |\n| go test -race | Race detector |\n| go test -cover | Coverage |\n| go test -bench=. | Benchmarks |\n| go test -run TestFoo | Single test |\n`,

  codeExamples: [{ language: 'go', label: 'Table-Driven Test', code: `func TestDivide(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
		wantErr bool
	}{
		{"basic", 10, 2, 5, false},
		{"negative", -6, 3, -2, false},
		{"div by zero", 10, 0, 0, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := Divide(tt.a, tt.b)
			if (err != nil) != tt.wantErr {
				t.Fatalf("err = %v, wantErr %v", err, tt.wantErr)
			}
			if !tt.wantErr && got != tt.want {
				t.Errorf("got %v want %v", got, tt.want)
			}
		})
	}
}` }],

  resources: [
    { title: 'testing package — Go Docs', url: 'https://pkg.go.dev/testing', type: 'docs', free: true },
    { title: 'testify — GitHub', url: 'https://github.com/stretchr/testify', type: 'github', free: true },
    { title: 'Testing in Go — GfG', url: 'https://www.geeksforgeeks.org/go-lang-testing/', type: 'article', free: true },
  ],

  quiz: [
    { id: 'tst-q1', question: 'What flag detects data races in Go tests?', options: ['-check', '-race', '-sync', '-parallel'], correctIndex: 1, explanation: 'go test -race enables the built-in race detector which instruments memory accesses to detect concurrent reads and writes.' },
    { id: 'tst-q2', question: 'Table-driven tests run cases using:', options: ['Multiple test functions', 'Nested functions only', 'A loop with t.Run for subtests', 'Reflection'], correctIndex: 2, explanation: 'Table-driven tests define test cases in a slice and loop over them with t.Run(name, func) — clean, DRY, and each subtest is identifiable by name.' },
    { id: 'tst-q3', question: 'httptest.NewRecorder() is used to:', options: ['Start a test HTTP server', 'Capture HTTP handler responses without a real server', 'Mock database calls', 'Benchmark HTTP handlers'], correctIndex: 1, explanation: 'NewRecorder returns a ResponseRecorder that implements http.ResponseWriter. You can inspect Code, Body, Header after calling the handler.' },
    { id: 'tst-q4', question: 't.Helper() in a test helper function:', options: ['Skips the test', 'Marks the function so error messages point to the caller, not the helper', 'Runs the test in parallel', 'Captures panics'], correctIndex: 1, explanation: 'Without t.Helper(), error lines point inside the helper. With t.Helper(), Go reports the test line that called the helper — much clearer failures.' },
  ],

  questions: [],
};
