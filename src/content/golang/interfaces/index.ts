import type { TopicContent } from '../../types';

export const interfacesContent: TopicContent = {
  slug: 'golang/interfaces',
  title: 'Interfaces',
  category: 'golang',
  theory: `# Interfaces in Go

## Implicit Satisfaction

Go interfaces are satisfied implicitly — no \`implements\` keyword needed.

\`\`\`go
type Animal interface {
    Sound() string
    Name() string
}

type Dog struct { name string }
func (d Dog) Sound() string { return "Woof" }
func (d Dog) Name() string  { return d.name }
// Dog implicitly satisfies Animal
\`\`\`

## Interface Composition

\`\`\`go
type Reader interface { Read([]byte) (int, error) }
type Writer interface { Write([]byte) (int, error) }
type ReadWriter interface { Reader; Writer } // compose
\`\`\`

## Empty Interface (any)

\`\`\`go
func print(v any) { fmt.Printf("%T %v\\n", v, v) }
print(42); print("hello"); print([]int{1,2,3})
\`\`\`

## Type Assertion

\`\`\`go
var v any = "hello"
s, ok := v.(string) // ok=true, s="hello"
n, ok := v.(int)    // ok=false, n=0

// Type switch
switch t := v.(type) {
case string:  fmt.Println("string:", t)
case int:     fmt.Println("int:", t)
default:      fmt.Println("unknown")
}
\`\`\`

## Interface Internals (Two Words)

An interface value holds: (type, pointer to data). A nil interface has both nil. A non-nil interface pointing to nil data is non-nil!

\`\`\`go
var err *MyError = nil
var e error = err  // e is NON-NIL interface (has type, nil data)
fmt.Println(e == nil) // false! Gotcha
\`\`\`
`,

  examples: `# Interfaces — Examples

## io.Reader / io.Writer

\`\`\`go
func copyData(dst io.Writer, src io.Reader) (int64, error) {
    return io.Copy(dst, src)
}
// Works with files, HTTP bodies, buffers, etc.
\`\`\`

## Dependency Injection

\`\`\`go
type UserStore interface {
    GetUser(id string) (*User, error)
    SaveUser(*User) error
}
type UserService struct { store UserStore }

// Test with mock, production with DB implementation
type MockStore struct { users map[string]*User }
func (m *MockStore) GetUser(id string) (*User, error) { return m.users[id], nil }
\`\`\`
`,

  patterns: `# Interface Patterns

## 1. Accept interfaces, return concrete types
## 2. Small interfaces (1-3 methods) — io.Reader, io.Writer, error
## 3. Dependency injection — pass interface, swap implementations for testing
## 4. Stringer interface — fmt.Stringer for custom String() method
## 5. Error interface — custom error types
`,

  interviewTips: `# Interview Tips — Interfaces

1. Interfaces enable polymorphism and testability in Go.
2. The nil interface gotcha: a typed nil is NOT nil as an interface — always return untyped nil for errors.
3. Small interfaces are Go idiom — prefer 1-3 methods.
4. Interface satisfaction is checked at compile time.
5. Use interfaces for dependency injection — makes code testable.
`,

  commonMistakes: `# Common Mistakes — Interfaces

1. Returning typed nil as error — \`var err *MyError = nil; return err\` — callers get non-nil interface.
2. Defining large interfaces — should evolve from consumer needs, not producer definitions.
3. Asserting without ok check — panics if type doesn't match.
4. Interface on value vs pointer receiver — must match how methods are defined.
`,

  revision: `# Interfaces — Quick Revision

| Concept | Example |\n|---------|--------|\n| Implicit satisfaction | No implements keyword |\n| Composition | Embed smaller interfaces |\n| Empty interface | any — holds any value |\n| Type assertion | v.(string) — extract concrete type |\n| Nil gotcha | Typed nil ≠ nil interface |\n| io.Reader | Read([]byte) (int, error) |\n`,

  codeExamples: [{ language: 'go', label: 'Interface + DI Example', code: `type Repository interface {
	Get(id string) (string, error)
	Save(id, value string) error
}

type Service struct{ repo Repository }

func (s *Service) Process(id string) (string, error) {
	return s.repo.Get(id)
}

// Mock for testing
type MockRepo struct{ data map[string]string }

func (m *MockRepo) Get(id string) (string, error) {
	if v, ok := m.data[id]; ok { return v, nil }
	return "", errors.New("not found")
}
func (m *MockRepo) Save(id, value string) error {
	m.data[id] = value; return nil
}` }],

  resources: [
    { title: 'Interfaces — Effective Go', url: 'https://go.dev/doc/effective_go#interfaces', type: 'docs', free: true },
    { title: 'Go Interfaces Explained', url: 'https://go.dev/tour/methods/9', type: 'docs', free: true },
    { title: 'Interface Composition — Go Blog', url: 'https://go.dev/doc/articles/interfaces_and_types.html', type: 'article', free: true },
  ],

  quiz: [
    { id: 'iface-q1', question: 'In Go, a type satisfies an interface by:', options: ['Using the implements keyword', 'Registering with the interface', 'Implicitly by implementing all methods', 'Embedding the interface'], correctIndex: 2, explanation: 'Go uses structural typing (duck typing). A type satisfies an interface if it implements all the interface\'s methods — no declaration needed.' },
    { id: 'iface-q2', question: 'What is the "nil interface gotcha"?', options: ['nil can\'t be assigned to interfaces', 'A non-nil interface can hold a nil pointer — it won\'t equal nil', 'Interfaces always return nil on empty', 'nil interfaces cause compilation errors'], correctIndex: 1, explanation: 'An interface holds (type, value). If you assign a typed nil pointer (type=*T, value=nil), the interface itself is non-nil even though it points to nil.' },
    { id: 'iface-q3', question: 'What does type assertion v.(string) do if v is not a string?', options: ['Returns empty string', 'Returns nil', 'Panics (without ok form)', 'Compilation error'], correctIndex: 2, explanation: 'Single-value assertion panics if the type doesn\'t match. Use two-value form: s, ok := v.(string) to avoid panic.' },
    { id: 'iface-q4', question: 'The io.Reader interface has:', options: ['3 methods', '1 method: Read([]byte)(int,error)', '2 methods', 'No methods'], correctIndex: 1, explanation: 'io.Reader has a single method: Read(p []byte) (n int, err error). This minimalism makes it implementable by files, buffers, network connections, etc.' },
  ],

  questions: [],
};
