import type { TopicContent } from '../../types';

export const microservicesContent: TopicContent = {
  slug: 'system-design/microservices',
  title: 'Microservices',
  category: 'system-design',
  theory: `# Microservices

## Definition

Architectural style where an application is built as a collection of small, independently deployable services, each running its own process and communicating via APIs.

## Monolith vs Microservices

| | Monolith | Microservices |
|-|----------|---------------|
| Deployment | All at once | Independent |
| Scaling | Entire app | Per service |
| Fault isolation | Poor | Good |
| Team autonomy | Low | High (Conway's Law) |
| Complexity | Simple start | Distributed systems |
| Data | Shared DB | Per-service DB |

## Communication Patterns

**Synchronous:** REST, gRPC — caller waits.
**Asynchronous:** Kafka, RabbitMQ — fire and forget, decoupled.

## Service Discovery

Services register themselves (Consul, etcd, Kubernetes DNS). Clients discover dynamically instead of hardcoded IPs.

## Fault Tolerance Patterns

- **Circuit Breaker** — stop calling failed service, fail fast
- **Retry with Backoff** — retry failures with exponential backoff
- **Timeout** — don't wait forever
- **Bulkhead** — isolate resources per service

## API Gateway

Single entry point for clients. Handles: auth, rate limiting, routing, SSL termination, load balancing.
`,

  examples: `# Microservices — Examples

## Circuit Breaker Pattern

\`\`\`go
type CircuitBreaker struct {
    state       string // "closed", "open", "half-open"
    failCount   int
    threshold   int
    lastFail    time.Time
    timeout     time.Duration
}
func (cb *CircuitBreaker) Call(fn func() error) error {
    if cb.state == "open" {
        if time.Since(cb.lastFail) > cb.timeout { cb.state = "half-open" } else { return ErrCircuitOpen }
    }
    err := fn()
    if err != nil {
        cb.failCount++; cb.lastFail = time.Now()
        if cb.failCount >= cb.threshold { cb.state = "open" }
    } else { cb.failCount = 0; cb.state = "closed" }
    return err
}
\`\`\`
`,

  patterns: `# Microservices Patterns

## 1. Saga Pattern — distributed transactions via events (choreography) or coordinator (orchestration)
## 2. CQRS — separate read/write models for scalability
## 3. Event Sourcing — store state as sequence of events
## 4. Outbox Pattern — atomic DB write + event publish
## 5. Sidecar — proxy handles cross-cutting concerns (Istio/Envoy)
`,

  interviewTips: `# Interview Tips — Microservices

1. Mention Conway's Law: org structure mirrors system architecture.
2. Each service should own its own database — no shared DB.
3. Synchronous communication couples services — prefer async where possible.
4. Discuss distributed tracing (OpenTelemetry) for debugging microservices.
5. Mention service mesh (Istio) for advanced traffic management.
`,

  commonMistakes: `# Common Mistakes — Microservices

1. Too fine-grained services — "nano-services" increase network calls.
2. Shared database across services — tight coupling.
3. Synchronous calls everywhere — cascading failures.
4. No distributed tracing — impossible to debug failures.
5. Starting with microservices — often better to start monolith and extract.
`,

  revision: `# Microservices — Quick Revision

## Key Principles
- Single Responsibility per service
- Own data — database per service
- Communicate via APIs, not shared memory
- Design for failure (circuit breakers, retries, timeouts)
- Deploy independently (CI/CD per service)
`,

  codeExamples: [],

  resources: [
    { title: 'Microservices — Martin Fowler', url: 'https://martinfowler.com/articles/microservices.html', type: 'article', free: true },
    { title: 'Microservices Patterns Book', url: 'https://microservices.io/patterns/index.html', type: 'docs', free: true },
    { title: 'ByteByteGo', url: 'https://bytebytego.com', type: 'video', free: false },
  ],

  quiz: [
    { id: 'ms-q1', question: 'What is the "database per service" pattern?', options: ['All services share one DB for consistency', 'Each microservice owns and manages its own database', 'One DB replica per service instance', 'Read-only databases per service'], correctIndex: 1, explanation: 'Each service has its own database. This enforces loose coupling — services can use different DB technologies and scale independently.' },
    { id: 'ms-q2', question: 'A Circuit Breaker in the OPEN state means:', options: ['Requests pass through normally', 'Calls are blocked and fail fast without reaching the service', 'Partial traffic allowed', 'Rate limiting is active'], correctIndex: 1, explanation: 'OPEN circuit breaker immediately returns an error without calling the downstream service — preventing cascade failures and allowing the failed service to recover.' },
    { id: 'ms-q3', question: 'The Saga pattern solves what distributed systems problem?', options: ['Service discovery', 'Distributed transactions across multiple services', 'Load balancing', 'API versioning'], correctIndex: 1, explanation: 'In microservices, you can\'t use 2PC transactions across services. Saga handles distributed transactions via a series of local transactions with compensating transactions on failure.' },
    { id: 'ms-q4', question: 'Why should microservices prefer asynchronous communication?', options: ['It\'s faster', 'Decouples services — caller doesn\'t wait and failures don\'t cascade', 'Easier to implement', 'Required by REST'], correctIndex: 1, explanation: 'Synchronous chains mean failure or slowness in one service cascades to all callers. Async (events/queues) decouples producers from consumers.' },
  ],

  questions: [],
};
