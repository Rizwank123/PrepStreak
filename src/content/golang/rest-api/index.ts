import type { TopicContent } from '../../types';

export const restApiContent: TopicContent = {
  slug: 'golang/rest-api',
  title: 'REST API',
  category: 'golang',
  theory: `# REST API in Go

## net/http Basics

\`\`\`go
http.HandleFunc("/users", handleUsers)
http.ListenAndServe(":8080", nil)
\`\`\`

## Handler Interface

\`\`\`go
type Handler interface {
    ServeHTTP(ResponseWriter, *Request)
}
type HandlerFunc func(ResponseWriter, *Request)
func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) { f(w, r) }
\`\`\`

## JSON Encode/Decode

\`\`\`go
// Decode request
var body RequestBody
if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
    http.Error(w, "bad request", 400)
    return
}
// Encode response
w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(response)
\`\`\`

## Middleware Pattern

\`\`\`go
func Logging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// Chain: handler = Logging(Auth(RateLimit(actualHandler)))
\`\`\`

## Graceful Shutdown

\`\`\`go
srv := &http.Server{Addr: ":8080", Handler: mux}
go srv.ListenAndServe()

<-quit // wait for signal
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()
srv.Shutdown(ctx) // finish in-flight requests
\`\`\`
`,

  examples: `# REST API — Examples

## Full CRUD Handler

\`\`\`go
func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:    h.get(w, r)
    case http.MethodPost:   h.create(w, r)
    case http.MethodPut:    h.update(w, r)
    case http.MethodDelete: h.delete(w, r)
    default:
        http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
    }
}
\`\`\`

## Auth Middleware (JWT)

\`\`\`go
func JWTMiddleware(secret string) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            token := r.Header.Get("Authorization")
            if !validateJWT(token, secret) {
                http.Error(w, "unauthorized", http.StatusUnauthorized)
                return
            }
            next.ServeHTTP(w, r)
        })
    }
}
\`\`\`
`,

  patterns: `# REST API Patterns

## 1. Middleware chain — composable cross-cutting concerns
## 2. Repository pattern — decouple handler from DB
## 3. Service layer — business logic separate from HTTP
## 4. Request/Response DTOs — decouple API from domain model
## 5. Error response envelope — consistent JSON error format
`,

  interviewTips: `# Interview Tips — REST API

1. Always validate input at handler boundary — don't trust clients.
2. Return proper HTTP status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error.
3. Use context from r.Context() for all downstream calls.
4. Implement graceful shutdown — in-flight requests should complete.
5. Middleware for cross-cutting concerns: logging, auth, rate limiting, CORS.
`,

  commonMistakes: `# Common Mistakes — REST API

1. Not returning errors from handler — swallowing errors silently.
2. Ignoring r.Body.Close() — resource leak.
3. Writing to ResponseWriter after error — headers already sent.
4. Not setting Content-Type header — clients don't know how to parse.
5. Blocking main goroutine on ListenAndServe — it's blocking, use goroutine for other init.
`,

  revision: `# REST API — Quick Revision

| HTTP Status | Meaning |\n|------------|--------|\n| 200 OK | Success |\n| 201 Created | Resource created |\n| 400 Bad Request | Client input error |\n| 401 Unauthorized | Not authenticated |\n| 403 Forbidden | Not authorised |\n| 404 Not Found | Resource missing |\n| 500 Internal Error | Server bug |\n`,

  codeExamples: [{ language: 'go', label: 'Complete REST Server', code: `type Server struct{ db *sql.DB }

func (s *Server) routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /users/{id}", s.handleGetUser)
	mux.HandleFunc("POST /users", s.handleCreateUser)
	return Logging(Auth(mux))
}

func (s *Server) handleGetUser(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	user, err := s.db.QueryRowContext(r.Context(),
		"SELECT id, name FROM users WHERE id=$1", id).Scan(...)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			http.Error(w, "not found", http.StatusNotFound); return
		}
		http.Error(w, "server error", http.StatusInternalServerError); return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}` }],

  resources: [
    { title: 'net/http — Go Docs', url: 'https://pkg.go.dev/net/http', type: 'docs', free: true },
    { title: 'Building REST APIs in Go — Go Blog', url: 'https://go.dev/doc/articles/wiki/', type: 'article', free: true },
    { title: 'chi Router', url: 'https://github.com/go-chi/chi', type: 'github', free: true },
  ],

  quiz: [
    { id: 'rest-q1', question: 'What interface must a type implement to be used as an HTTP handler?', options: ['Callable interface', 'http.Handler (ServeHTTP(ResponseWriter, *Request))', 'http.Middleware', 'io.Reader'], correctIndex: 1, explanation: 'http.Handler has a single method: ServeHTTP(ResponseWriter, *Request). http.HandlerFunc adapts a function to this interface.' },
    { id: 'rest-q2', question: 'Middleware wraps a handler to:', options: ['Replace the handler', 'Add cross-cutting concerns (logging, auth, metrics) without modifying the handler', 'Speed up routing', 'Handle errors'], correctIndex: 1, explanation: 'Middleware takes a handler and returns a new handler that adds behaviour (before and/or after) then calls the original handler.' },
    { id: 'rest-q3', question: 'Why use graceful shutdown?', options: ['Performance', 'Allow in-flight requests to complete before the server exits', 'Required by HTTP spec', 'Prevents connection leaks'], correctIndex: 1, explanation: 'srv.Shutdown(ctx) waits for active connections to finish (up to ctx timeout) before closing the server — no requests are abruptly terminated.' },
    { id: 'rest-q4', question: 'HTTP status code for successfully creating a resource?', options: ['200 OK', '201 Created', '202 Accepted', '204 No Content'], correctIndex: 1, explanation: '201 Created indicates a resource was successfully created. Should include Location header pointing to the new resource.' },
  ],

  questions: [],
};
