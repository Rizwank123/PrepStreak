import type { TopicContent } from '../../types';

export const shardingContent: TopicContent = {
  slug: 'system-design/sharding',
  title: 'Sharding',
  category: 'system-design',
  theory: `# Sharding

## What is Sharding?

Sharding is a database partitioning technique that distributes data across multiple machines (shards). Each shard holds a subset of the data, enabling horizontal scaling of both reads and writes.

## Architecture

\`\`\`
                    ┌──────────────────────┐
                    │   Shard Router /     │
  Client ─────────▶│   Coordinator        │
  Request          │  (hash(key) % N)     │
                    └──────────┬───────────┘
                               │
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │   Shard 0    │  │   Shard 1    │  │   Shard 2    │
    │              │  │              │  │              │
    │ Users 0-33K  │  │ Users 33K-66K│  │ Users 66K-99K│
    │              │  │              │  │              │
    │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────┐ │
    │ │ Primary  │ │  │ │ Primary  │ │  │ │ Primary  │ │
    │ │ Replica  │ │  │ │ Replica  │ │  │ │ Replica  │ │
    │ └──────────┘ │  │ └──────────┘ │  │ └──────────┘ │
    └──────────────┘  └──────────────┘  └──────────────┘
\`\`\`

## Sharding Strategies

### 1. Hash-Based Sharding

\`\`\`
shard = hash(key) % num_shards

Example: hash(user_id) % 3
  user_id=100  → hash(100)=37  → 37 % 3 = 1  → Shard 1
  user_id=201  → hash(201)=53  → 53 % 3 = 2  → Shard 2
  user_id=305  → hash(305)=17  → 17 % 3 = 2  → Shard 0
\`\`\`

- Pro: Even distribution
- Con: Adding/removing shards requires rehashing all data

### 2. Range-Based Sharding

\`\`\`
Shard 0: user_id 1      — 1,000,000
Shard 1: user_id 1,000,001 — 2,000,000
Shard 2: user_id 2,000,001 — 3,000,000
\`\`\`

- Pro: Easy to add new shards (new ranges)
- Con: Hot spots — sequential keys go to same shard

### 3. Geographic Sharding

\`\`\`
US Shard:  users in North America
EU Shard:  users in Europe
Asia Shard: users in Asia-Pacific
\`\`\`

- Pro: Low latency for regional users
- Con: Uneven distribution if user base is not geographically even

### 4. Directory-Based Sharding

\`\`\`
┌──────────────┐
│ Lookup Table │  maps key → shard
│ (shard_id)   │
└──────┬───────┘
       │
  ┌────▼────┐  ┌────────┐  ┌────────┐
  │ Shard 0 │  │ Shard 1│  │ Shard 2│
  └─────────┘  └────────┘  └────────┘
\`\`\`

- Pro: Flexible — change shard assignment without rehashing
- Con: Lookup table is a SPOF and bottleneck

## Consistent Hashing

Solves the rehashing problem when adding/removing shards.

\`\`\`
Traditional:                    Consistent Hashing:
hash(key) % N                    hash(key) → ring position
                                 hash(node) → ring position
                                 Key → nearest node clockwise

  Adding a shard:                Only K/N keys move
  ALL keys rehash                (not all keys)

  ┌──────────────────┐           ┌──────────────────────┐
  │ Before: 3 shards │           │ Ring:                │
  │ hash % 3          │           │  Node A at 0°        │
  │                   │           │  Node B at 120°      │
  │ After: 4 shards   │           │  Node C at 240°      │
  │ hash % 4          │           │  Key at 50° → Node B │
  │ ALL keys move!    │           │  Add Node D at 60°  │
  └──────────────────┘           │  Only keys 0-60 move │
                                 └──────────────────────┘
\`\`\`

## Sharding vs Replication

| Aspect | Sharding | Replication |
|--------|----------|------------|
| Scales | Both reads AND writes | Reads only |
| Data | Each shard has different data | All replicas have same data |
| Complexity | High (cross-shard queries) | Medium |
| Use case | Data too large for one node | Read-heavy workloads |

## Cross-Shard Challenges

### 1. Joins
Joining data across shards requires scatter-gather or denormalization.

\`\`\`
-- Cannot do this efficiently across shards:
SELECT * FROM orders o JOIN users u ON o.user_id = u.id

-- Solution: denormalize or co-locate related data
-- Store user data on same shard as their orders
\`\`\`

### 2. Transactions
Distributed transactions are slow. Use:
- Two-phase commit (2PC) — slow, blocking
- Saga pattern — compensating transactions
- Eventual consistency — accept stale reads

### 3. Counting / Aggregation
COUNT(*), SUM, AVG across shards require scatter-gather.

\`\`\`
Client → Router → [Shard0: COUNT] + [Shard1: COUNT] + [Shard2: COUNT]
                 → Sum results → Return to client
\`\`\`

### 4. Hot Shards
A single shard receives disproportionate traffic.
- Solutions: shard splitting, hot-key replication, consistent hashing rebalance
`,

  examples: `# Sharding — Practical Examples

## Application-Level Sharding (Go)

\`\`\`go
type ShardManager struct {
    shards map[int]*gorm.DB
    numShards int
}

func (sm *ShardManager) GetShard(key string) *gorm.DB {
    h := fnv.New32a()
    h.Write([]byte(key))
    shard := int(h.Sum32()) % sm.numShards
    return sm.shards[shard]
}

func (sm *ShardManager) CreateUser(user *User) error {
    shard := sm.GetShard(user.ID)
    return shard.Create(user).Error
}

func (sm *ShardManager) GetUser(id string) (*User, error) {
    shard := sm.GetShard(id)
    var user User
    err := shard.First(&user, "id = ?", id).Error
    return &user, err
}
\`\`\`

## MongoDB Sharding

\`\`\`javascript
// Enable sharding on database
sh.enableSharding("mydb")

// Shard collection by user_id (hashed)
sh.shardCollection("mydb.users", { "user_id": "hashed" })

// Shard collection by region (ranged)
sh.shardCollection("mydb.events", { "timestamp": 1 })
\`\`\`

## SQL Sharding with Vitess

\`\`\`yaml
# Vitess shard configuration
shards:
  - name: "-80"
    key_range: { start: "", end: "80" }
  - name: "80-"
    key_range: { start: "80", end: "" }

# Vindex (sharding function)
vindexes:
  hash:
    type: numeric_hash
    params:
      - table: users
      - column: user_id
\`\`\`
`,

  patterns: `# Sharding Patterns

## 1. Hash Sharding
Even distribution via hash function. Best for uniform access patterns.

## 2. Range Sharding
Shard by key ranges. Best for range queries but risk of hot spots.

## 3. Directory Sharding
Lookup table maps keys to shards. Most flexible but adds indirection.

## 4. Geo Sharding
Shard by geography. Reduces latency for regional users.

## 5. Consistent Hashing
Minimizes data movement when adding/removing shards. Used by Cassandra, DynamoDB.

## 6. Co-location
Store related data (user + their orders) on the same shard to enable local joins.
`,

  interviewTips: `# Interview Tips — Sharding

1. **When to shard:** When data exceeds single-node capacity or write throughput exceeds one DB. Not premature.
2. **Start with replication** — read replicas are simpler. Shard only when writes are the bottleneck.
3. **Shard key is critical** — choosing the wrong key leads to hot spots or cross-shard queries. Pick a key with high cardinality and even distribution.
4. **Mention consistent hashing** — shows you know how to handle dynamic shard addition.
5. **Cross-shard operations** — always mention joins, transactions, and aggregations as challenges.
6. **Know the trade-off:** Sharding adds operational complexity. Have a sharding strategy before you need it, but implement it only when necessary.
`,

  commonMistakes: `# Common Mistakes — Sharding

1. **Bad shard key** — low cardinality or skewed distribution causes hot shards. Choose a key with even distribution.
2. **Sharding too early** — adds massive complexity. Start with read replicas and vertical scaling first.
3. **Ignoring cross-shard queries** — joins and aggregations become scatter-gather. Plan your data model.
4. **No resharding plan** — what happens when a shard grows too large? Need splitting or consistent hashing.
5. **Auto-increment IDs** — sequential IDs cause hot spots in range sharding. Use UUIDs or snowflake IDs.
6. **No monitoring per shard** — hot shards are invisible without per-shard metrics.
7. **Foreign keys across shards** — can't enforce FK constraints across shards. Use application-level validation.
`,

  revision: `# Sharding — Quick Revision

| Strategy | Distribution | Pros | Cons |
|----------|-------------|------|------|
| Hash | Even via hash | Balanced load | Resharding is expensive |
| Range | By key range | Range queries | Hot spots |
| Directory | Lookup table | Flexible | SPOF |
| Geo | By region | Low latency | Uneven growth |
| Consistent | Ring-based | Minimal data movement | Complex |

## Key Decisions
- Shard key: high cardinality, even distribution, query-aligned
- When to shard: data > single node, writes > single node capacity
- Alternative first: read replicas, caching, vertical scaling

## Challenges
- Cross-shard joins → denormalize or co-locate
- Distributed transactions → saga or eventual consistency
- Aggregations → scatter-gather
- Hot shards → split or rebalance
`,

  codeExamples: [
    {
      language: 'go',
      label: 'Go — Consistent Hashing',
      code: `package main

import (
    "hash/fnv"
    "sort"
    "sync"
)

type ConsistentHash struct {
    mu       sync.RWMutex
    ring     []uint32          // sorted hash values
    nodes    map[uint32]string // hash → node name
    replicas int              // virtual nodes per real node
}

func New(replicas int) *ConsistentHash {
    return &ConsistentHash{nodes: make(map[uint32]string), replicas: replicas}
}

func (c *ConsistentHash) Add(node string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    for i := 0; i < c.replicas; i++ {
        h := c.hash(node + string(rune(i)))
        c.ring = append(c.ring, h)
        c.nodes[h] = node
    }
    sort.Slice(c.ring, func(i, j int) bool { return c.ring[i] < c.ring[j] })
}

func (c *ConsistentHash) Get(key string) string {
    c.mu.RLock()
    defer c.mu.RUnlock()
    if len(c.ring) == 0 { return "" }
    h := c.hash(key)
    idx := sort.Search(len(c.ring), func(i int) bool { return c.ring[i] >= h })
    if idx == len(c.ring) { idx = 0 }
    return c.nodes[c.ring[idx]]
}

func (c *ConsistentHash) hash(s string) uint32 {
    h := fnv.New32a()
    h.Write([]byte(s))
    return h.Sum32()
}`,
    },
  ],

  resources: [
    { title: 'Sharding — MongoDB Docs', url: 'https://www.mongodb.com/docs/manual/sharding/', type: 'docs', free: true },
    { title: 'Vitess (MySQL Sharding)', url: 'https://vitess.io/docs/', type: 'docs', free: true },
    { title: 'Consistent Hashing — Paper', url: 'https://www.akamai.com/site/en/documents/technical-publication/consistent-hashing-and-random-trees-distributed-caching-protocols-for-relieving-hot-spots-on-the-world-wide-web-technical-publication.pdf', type: 'article', free: true },
    { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', type: 'book', free: false },
    { title: 'Sharding — ByteByteGo', url: 'https://bytebytego.com', type: 'video', free: false },
  ],

  quiz: [
    { id: 'shard-q1', question: 'What problem does sharding solve that replication does not?', options: ['Read scaling', 'Write scaling', 'Data backup', 'Query caching'], correctIndex: 1, explanation: 'Replication scales reads by adding replicas, but all writes still go to one primary. Sharding distributes both data and writes across multiple nodes, scaling writes horizontally.' },
    { id: 'shard-q2', question: 'What is the main advantage of consistent hashing over hash-based sharding?', options: ['Faster queries', 'Minimal data movement when adding/removing shards', 'No need for a hash function', 'Automatic data backup'], correctIndex: 1, explanation: 'With consistent hashing, adding or removing a node only moves the keys assigned to that node, not all keys. Traditional hash-based sharding (hash % N) requires rehashing all data when N changes.' },
    { id: 'shard-q3', question: 'Which sharding strategy is best for range queries like "all users with ID between 1000-2000"?', options: ['Hash sharding', 'Range sharding', 'Directory sharding', 'Geo sharding'], correctIndex: 1, explanation: 'Range sharding assigns key ranges to shards, so a range query can target a single shard. Hash sharding scatters sequential keys across all shards, making range queries expensive.' },
    { id: 'shard-q4', question: 'What is a "hot shard" in a sharded database?', options: ['A shard with high CPU temperature', 'A shard receiving disproportionate traffic or data', 'A shard that is failing', 'The first shard in the cluster'], correctIndex: 1, explanation: 'A hot shard receives significantly more traffic or data than others, often due to poor shard key selection. Solutions include shard splitting, hot-key replication, or rebalancing with consistent hashing.' },
  ],

  questions: [],
};
