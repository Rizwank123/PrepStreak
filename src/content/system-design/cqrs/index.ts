import type { TopicContent } from '../../types';

export const cqrsContent: TopicContent = {
  slug: 'system-design/cqrs',
  title: 'CQRS',
  category: 'system-design',
  theory: `# CQRS — Command Query Responsibility Segregation

## What is CQRS?

CQRS is an architectural pattern that separates read operations (queries) from write operations (commands). Instead of one model handling both, CQRS uses separate models optimized for each concern.

## Traditional vs CQRS

\`\`\`
Traditional (CRUD):

  ┌────────┐     ┌──────────────────────┐     ┌───────┐
  │ Client │────▶│   Single Model       │────▶│  DB   │
  │        │     │  (Read + Write)      │     │       │
  └────────┘     └──────────────────────┘     └───────┘

CQRS:

  ┌────────┐     ┌──────────────┐          ┌───────────┐
  │ Client │────▶│ Command Side │─────────▶│ Write DB  │
  │ (Write)│     │ (Optimized   │          │ (OLTP)    │
  └────────┘     │  for writes) │          └─────┬─────┘
                 └──────────────┘                │
                                          Sync or Async
                                                 │
  ┌────────┐     ┌──────────────┐          ┌─────▼─────┐
  │ Client │────▶│ Query Side   │◀─────────│ Read DB   │
  │ (Read) │     │ (Optimized   │          │ (OLAP /   │
  └────────┘     │  for reads)  │          │  Denorm.) │
                 └──────────────┘          └───────────┘
\`\`\`

## Why CQRS?

### Problem with Traditional CRUD
- One model serves both complex reads and complex writes
- Optimizing for reads hurts writes and vice versa
- Different query patterns need different data shapes
- Heavy read queries can lock tables and slow writes

### CQRS Solution
- **Write model:** optimized for consistency, validation, business logic
- **Read model:** optimized for query performance, denormalized views
- Write and read sides scale independently
- Read side can use different storage (Redis, Elasticsearch, materialized views)

## Architecture with Event Sourcing

\`\`\`
┌────────┐  Command   ┌──────────┐  Event   ┌──────────────┐
│ Client │───────────▶│ Command  │────────▶│ Event Store  │
│        │            │ Handler  │         │ (Append Only)│
└────────┘            └──────────┘         └──────┬───────┘
                                                   │
                                            Event │
                                                   ▼
┌────────┐   Query    ┌──────────┐  Build   ┌──────────────┐
│ Client │───────────▶│ Query    │◀───────│ Read Model    │
│        │            │ Handler  │ Update  │ (Materialized │
└────────┘            └──────────┘         │  View)        │
                                           └──────────────┘
\`\`\`

### Event Sourcing
- Store every state change as an immutable event
- Current state = replay of all events
- Write side: append events to event store
- Read side: subscribe to events, build optimized read models
- Full audit trail for free

## When to Use CQRS

| Good Fit | Bad Fit |
|----------|---------|
| Read-heavy systems (100:1 read/write) | Simple CRUD |
| Complex domain logic | Small team, simple domain |
| Need independent scaling of reads/writes | Real-time collaboration (needs sync) |
| Multiple representations of same data | Short-lived projects |
| Event-driven architecture already in use | Strong consistency required everywhere |

## CQRS Variants

### 1. Simple CQRS (Same Database)

\`\`\`
┌─────────────┐         ┌───────────────┐
│ Command API │         │ Query API     │
│ (Write)     │         │ (Read)        │
└──────┬──────┘         └──────┬────────┘
       │                       │
       ▼                       ▼
  ┌────────────────────────────────┐
  │      Same Database              │
  │  (Different views/models)       │
  └────────────────────────────────┘
\`\`\`

Simplest form. Separate APIs but same DB. Good starting point.

### 2. CQRS with Separate Stores

\`\`\`
┌─────────────┐                    ┌───────────────┐
│ Command API │                    │ Query API     │
│ (Write)     │                    │ (Read)        │
└──────┬──────┘                    └──────┬────────┘
       │                                  │
       ▼                                  ▼
  ┌──────────┐    Event/MQ     ┌──────────────┐
  │ Write DB │───────────────▶│ Read Store    │
  │ (Postgres)│               │ (Redis/ES)   │
  └──────────┘                └──────────────┘
\`\`\`

Write to PostgreSQL, read from Redis/Elasticsearch. Maximum read performance.

### 3. CQRS + Event Sourcing

Full event-sourced architecture. Event store is the source of truth. Read models are projections.

## Synchronization Models

| Model | Latency | Complexity | Consistency |
|-------|---------|------------|-------------|
| Synchronous | Low | Low | Strong |
| Asynchronous (events) | Eventual | Medium | Eventual |
| Event Sourcing | Eventual | High | Eventual + audit |

## Read Model Examples

\`\`\`
Write Model (normalized):
  users: id, name, email
  orders: id, user_id, total, status

Read Model (denormalized):
  user_dashboard: user_id, user_name, order_count, total_spent, last_order_date
  order_summary: order_id, user_name, status, total, created_at

→ Read model pre-computed for specific queries
→ No joins needed at read time
\`\`\`
`,

  examples: `# CQRS — Practical Examples

## Simple CQRS with Separate Handlers

\`\`\`go
// Command side
type CreateOrderCommand struct {
    UserID string
    Items  []OrderItem
}

type CommandHandler struct {
    writeDB *gorm.DB
}

func (h *CommandHandler) Handle(cmd CreateOrderCommand) (string, error) {
    order := Order{ID: uuid.New().String(), UserID: cmd.UserID, Status: "pending"}
    return order.ID, h.writeDB.Create(&order).Error
}

// Query side
type OrderQueryHandler struct {
    readDB *gorm.DB // could be Redis, ES, or read replica
}

func (h *OrderQueryHandler) GetOrderHistory(userID string) ([]OrderSummary, error) {
    var orders []OrderSummary
    err := h.readDB.Where("user_id = ?", userID).Find(&orders).Error
    return orders, err
}
\`\`\`

## CQRS with Event Sourcing

\`\`\`go
// Command handler appends events
func (h *CommandHandler) CreateOrder(cmd CreateOrderCommand) error {
    event := OrderCreatedEvent{
        ID:        uuid.New().String(),
        UserID:    cmd.UserID,
        Items:     cmd.Items,
        Timestamp: time.Now(),
    }
    return h.eventStore.Append(event)
}

// Event handler builds read model
func (h *EventHandler) OnOrderCreated(event OrderCreatedEvent) {
    // Update denormalized read model
    h.readDB.Create(&OrderSummary{
        OrderID:   event.ID,
        UserID:    event.UserID,
        Status:    "pending",
        CreatedAt: event.Timestamp,
    })
}
\`\`\`

## Read Model Projection (Materialized View)

\`\`\`sql
-- Write model (normalized)
CREATE TABLE orders (id UUID, user_id UUID, total DECIMAL, status TEXT);
CREATE TABLE users (id UUID, name TEXT, email TEXT);

-- Read model (denormalized materialized view)
CREATE MATERIALIZED VIEW user_order_stats AS
SELECT
    u.id        AS user_id,
    u.name      AS user_name,
    COUNT(o.id) AS order_count,
    COALESCE(SUM(o.total), 0) AS total_spent,
    MAX(o.created_at) AS last_order
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.name;

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY user_order_stats;
\`\`\`
`,

  patterns: `# CQRS Patterns

## 1. Separate Command/Query APIs
Two API endpoints: one for writes (commands), one for reads (queries). Simplest CQRS.

## 2. Separate Read/Write Stores
Write to PostgreSQL, read from Redis or Elasticsearch. Read store is a projection of write store.

## 3. Event Sourcing + CQRS
Store events as source of truth. Read models are projections built from events. Full audit trail.

## 4. Materialized View Pattern
Use database materialized views as read models. Refreshed periodically. Simple but effective.

## 5. Eventual Consistency with Events
Write side publishes events; read side subscribes and updates asynchronously. Accept eventual consistency.

## 6. Saga Pattern (with CQRS)
For distributed transactions across aggregates. Each step publishes an event triggering the next.
`,

  interviewTips: `# Interview Tips — CQRS

1. **Don't start with CQRS** — begin with simple CRUD. Add CQRS only when read/write patterns diverge significantly.
2. **Explain the problem first** — one model serving both reads and writes leads to compromises. CQRS lets each side optimize independently.
3. **Mention eventual consistency** — CQRS with separate stores means reads may lag. Discuss if that's acceptable.
4. **Event sourcing is optional** — CQRS and event sourcing are often confused. You can do CQRS without event sourcing.
5. **Scaling benefit** — read side can have many replicas (100:1 read/write ratio). Write side scales differently.
6. **When NOT to use** — simple CRUD apps, small teams, strong consistency requirements. Over-engineering is the most common mistake.
`,

  commonMistakes: `# Common Mistakes — CQRS

1. **Starting with CQRS** — most systems don't need it. Start with CRUD, evolve to CQRS when needed.
2. **CQRS = Event Sourcing** — they are separate patterns. CQRS separates reads/writes. Event sourcing stores events as truth.
3. **Ignoring eventual consistency** — async CQRS means reads lag writes. Users may see stale data. Handle gracefully.
4. **Complexity creep** — two models, two APIs, synchronization logic. Ensure the benefit justifies the cost.
5. **No read model refresh strategy** — if using materialized views or projections, plan refresh frequency and mechanism.
6. **Tight coupling between sides** — if read model mirrors write model exactly, you're not getting CQRS benefits. Denormalize the read model.
7. **Not handling event ordering** — events arriving out of order corrupt read models. Use sequence numbers or timestamps.
`,

  revision: `# CQRS — Quick Revision

| Concept | Key Point |
|---------|-----------|
| Command | Write operation (create, update, delete) |
| Query | Read operation (no side effects) |
| Separation | Different models, APIs, possibly different stores |
| Read model | Denormalized, optimized for queries |
| Write model | Normalized, optimized for consistency |
| Eventual consistency | Read side may lag write side |
| Event Sourcing | Optional: events as source of truth |

## When to Use
- Read-heavy systems (100:1 or more)
- Complex domain with different read/write models
- Need independent read/write scaling
- Event-driven architecture

## When NOT to Use
- Simple CRUD
- Small team / short project
- Strong consistency required
- Read/write ratio is balanced
`,

  codeExamples: [
    {
      language: 'go',
      label: 'Go — CQRS with Event Bus',
      code: `package main

import "sync"

// Command
type CreateOrderCommand struct {
    UserID string
    Items  []string
}

// Event
type OrderCreatedEvent struct {
    OrderID string
    UserID  string
    Items   []string
}

// Command Handler (write side)
type CommandHandler struct {
    eventBus *EventBus
}

func (h *CommandHandler) Handle(cmd CreateOrderCommand) error {
    event := OrderCreatedEvent{
        OrderID: generateID(),
        UserID:  cmd.UserID,
        Items:   cmd.Items,
    }
    return h.eventBus.Publish(event)
}

// Read Model (query side)
type OrderReadModel struct {
    mu     sync.RWMutex
    orders map[string]OrderView
}

func (r *OrderReadModel) OnOrderCreated(e OrderCreatedEvent) {
    r.mu.Lock()
    defer r.mu.Unlock()
    r.orders[e.OrderID] = OrderView{
        ID:     e.OrderID,
        UserID: e.UserID,
        Status: "pending",
    }
}

func (r *OrderReadModel) GetOrder(id string) (OrderView, bool) {
    r.mu.RLock()
    defer r.mu.RUnlock()
    order, ok := r.orders[id]
    return order, ok
}`,
    },
    {
      language: 'csharp',
      label: 'C# — MediatR CQRS',
      code: `// Command
public record CreateOrderCommand(string UserId, List<string> Items)
    : IRequest<string>;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, string>
{
    private readonly OrderDbContext _db;
    public CreateOrderHandler(OrderDbContext db) => _db = db;

    public async Task<string> Handle(CreateOrderCommand cmd, CancellationToken ct)
    {
        var order = new Order { UserId = cmd.UserId, Status = "pending" };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync(ct);
        return order.Id.ToString();
    }
}

// Query
public record GetOrderHistoryQuery(string UserId)
    : IRequest<List<OrderSummary>>;

public class GetOrderHistoryHandler
    : IRequestHandler<GetOrderHistoryQuery, List<OrderSummary>>
{
    private readonly ReadOnlyDbContext _readDb;
    public GetOrderHistoryHandler(ReadOnlyDbContext readDb) => _readDb = readDb;

    public async Task<List<OrderSummary>> Handle(GetOrderHistoryQuery q, CancellationToken ct)
        => await _readDb.OrderSummaries
            .Where(o => o.UserId == q.UserId)
            .ToListAsync(ct);
}`,
    },
  ],

  resources: [
    { title: 'CQRS — Martin Fowler', url: 'https://martinfowler.com/bliki/CQRS.html', type: 'article', free: true },
    { title: 'CQRS Journey — Microsoft', url: 'https://learn.microsoft.com/en-us/previous-versions/msp-n-p/jj554200(v=pandp.10)', type: 'docs', free: true },
    { title: 'CQRS / Event Sourcing — Greg Young', url: 'https://cqrs.files.wordpress.com/2010/11/cqrs_documents.pdf', type: 'article', free: true },
    { title: 'CQRS — ByteByteGo', url: 'https://bytebytego.com', type: 'video', free: false },
  ],

  quiz: [
    { id: 'cqrs-q1', question: 'What does CQRS stand for?', options: ['Command Query Responsibility Segregation', 'Common Query Request System', 'Cached Query Result Store', 'Centralized Query Routing Service'], correctIndex: 0, explanation: 'CQRS = Command Query Responsibility Segregation. It separates write operations (commands) from read operations (queries) into separate models.' },
    { id: 'cqrs-q2', question: 'In CQRS, what is a "command"?', options: ['A read query', 'A write operation that changes state', 'A database transaction', 'A message queue'], correctIndex: 1, explanation: 'A command is a write operation that changes the system state (create, update, delete). Commands are intent-driven and typically return minimal data (e.g., just an ID or success/failure).' },
    { id: 'cqrs-q3', question: 'Is event sourcing required for CQRS?', options: ['Yes, always', 'No, they are independent patterns often used together', 'CQRS requires event sourcing', 'Event sourcing requires CQRS'], correctIndex: 1, explanation: 'CQRS and event sourcing are separate patterns. CQRS separates reads from writes. Event sourcing stores state changes as events. You can use CQRS without event sourcing and vice versa, though they are often combined.' },
    { id: 'cqrs-q4', question: 'What is a key trade-off of CQRS with separate read/write stores?', options: ['Strong consistency is guaranteed', 'Reads may be eventually consistent with writes', 'Write performance decreases', 'The system becomes simpler'], correctIndex: 1, explanation: 'When read and write stores are separate, the read store is updated asynchronously (via events). This means reads may not reflect the latest writes immediately — eventual consistency.' },
  ],

  questions: [],
};
