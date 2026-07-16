import type { TopicContent } from '../../types';

export const cleanArchitectureContent: TopicContent = {
  slug: 'golang/clean-architecture',
  title: 'Clean Architecture',
  category: 'golang',
  theory: `# Clean Architecture in Go

## Layers (Inside → Out)

1. **Entities** — business objects, pure data/logic, no dependencies
2. **Use Cases** — application-specific business rules, orchestrate entities
3. **Interface Adapters** — controllers, presenters, gateways
4. **Infrastructure** — DB, HTTP, external services

## Dependency Rule

**Dependencies point inward.** Inner layers know nothing about outer layers.

## Go Implementation

\`\`\`
/internal
    /domain          # entities, business rules, interfaces
        user.go
        user_repository.go  (interface)
        user_service.go     (use case)
    /repository      # infrastructure: DB implementations
        postgres_user_repository.go
    /handler         # interface adapter: HTTP handlers
        user_handler.go
    /app             # wire everything together
        app.go
\`\`\`

## Interfaces for Dependency Inversion

\`\`\`go
// domain layer defines the interface
type UserRepository interface {
    GetByID(ctx context.Context, id string) (*User, error)
    Save(ctx context.Context, user *User) error
}

// use case depends on interface, not concrete DB
type UserService struct { repo UserRepository }
func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
    return s.repo.GetByID(ctx, id)
}

// infrastructure implements the interface
type PostgresUserRepo struct { db *sql.DB }
func (r *PostgresUserRepo) GetByID(ctx context.Context, id string) (*User, error) {
    // SQL query
}
\`\`\`
`,

  examples: `# Clean Architecture — Examples

## Wiring in main.go

\`\`\`go
func main() {
    db, _ := sql.Open("postgres", os.Getenv("DB_URL"))

    // Build dependency graph
    userRepo    := repository.NewPostgresUserRepo(db)
    userService := domain.NewUserService(userRepo)
    userHandler := handler.NewUserHandler(userService)

    mux := http.NewServeMux()
    mux.Handle("/users/", userHandler)
    http.ListenAndServe(":8080", mux)
}
\`\`\`
`,

  patterns: `# Clean Architecture Patterns

## 1. Repository Pattern — abstract data access behind interface
## 2. Service Layer — business logic, no HTTP/DB concerns
## 3. Dependency Injection — pass interfaces to constructors
## 4. CQRS — separate command and query paths
## 5. Domain Events — decouple side effects from business logic
`,

  interviewTips: `# Interview Tips — Clean Architecture

1. Explain the dependency rule: dependencies always point inward.
2. Show how interfaces enable testability — swap DB for mock in tests.
3. Discuss trade-offs: more files/abstraction, but clearer separation of concerns.
4. In Go, package names represent layers: domain, repository, handler, app.
5. Hexagonal architecture (Ports & Adapters) is effectively the same pattern.
`,

  commonMistakes: `# Common Mistakes — Clean Architecture

1. Business logic in handlers — should be in service/use case layer.
2. Domain objects depending on DB/HTTP packages — violates dependency rule.
3. Over-abstraction — not every app needs 4 layers; evaluate complexity.
4. Anemic domain model — entities with no behaviour, all logic in service.
`,

  revision: `# Clean Architecture — Quick Revision

| Layer | Contains | Depends On |
|-------|---------|-----------|
| Domain | Entities, interfaces, business rules | Nothing |
| Use Cases | Services, application logic | Domain |
| Adapters | HTTP handlers, presenters | Domain, Use Cases |
| Infrastructure | DB, external APIs, frameworks | All layers |
`,

  codeExamples: [{ language: 'go', label: 'Domain + Repository + Service', code: `// domain/user.go
type User struct { ID, Name, Email string }

// domain/repository.go (interface — no DB dependency)
type UserRepository interface {
	GetByID(ctx context.Context, id string) (*User, error)
	Save(ctx context.Context, u *User) error
}

// domain/service.go (use case)
type UserService struct{ repo UserRepository }
func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
	return s.repo.GetByID(ctx, id)
}

// repository/postgres.go (infrastructure — implements interface)
type PostgresRepo struct{ db *sql.DB }
func (r *PostgresRepo) GetByID(ctx context.Context, id string) (*User, error) {
	var u User
	err := r.db.QueryRowContext(ctx, "SELECT id,name FROM users WHERE id=$1", id).
		Scan(&u.ID, &u.Name)
	return &u, err
}` }],

  resources: [
    { title: 'Clean Architecture — Robert Martin', url: 'https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html', type: 'article', free: true },
    { title: 'Go Clean Architecture Example — GitHub', url: 'https://github.com/evrone/go-clean-template', type: 'github', free: true },
    { title: 'Hexagonal Architecture in Go', url: 'https://medium.com/ssense-tech/hexagonal-architecture-there-are-always-two-sides-to-every-story-bc0780ed7d9c', type: 'article', free: true },
  ],

  quiz: [
    { id: 'ca-q1', question: 'In Clean Architecture, which direction do dependencies flow?', options: ['Outward (from core to infrastructure)', 'Inward (from infrastructure toward core)', 'Bidirectionally', 'No dependencies between layers'], correctIndex: 1, explanation: 'The Dependency Rule: all code dependencies must point inward toward higher-level policies. Infrastructure depends on domain, never the reverse.' },
    { id: 'ca-q2', question: 'How does the Repository Pattern enable testability?', options: ['It caches DB results', 'Abstract the DB behind an interface — inject a mock in tests', 'It speeds up queries', 'It validates data'], correctIndex: 1, explanation: 'Define a UserRepository interface. In tests, inject a MockUserRepository. In production, inject PostgresUserRepository. Your service tests never touch a real DB.' },
    { id: 'ca-q3', question: 'Business logic should live in:', options: ['HTTP handlers', 'Database queries', 'Domain / Use Case layer', 'main.go'], correctIndex: 2, explanation: 'Business rules belong in the domain/use case layer — they\'re independent of HTTP, DB, or any delivery mechanism. This makes them reusable and testable.' },
    { id: 'ca-q4', question: 'The main.go file in Clean Architecture is responsible for:', options: ['Business logic', 'Database migrations', 'Wiring all layers together (dependency injection)', 'HTTP routing only'], correctIndex: 2, explanation: 'main.go (or app.go) is the composition root — it creates concrete implementations and injects them into the layers. It\'s the only place that knows about concrete types.' },
  ],

  questions: [],
};
