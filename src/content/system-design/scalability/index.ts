import type { TopicContent } from '../../types';

export const scalabilityContent: TopicContent = {
    slug: 'system-design/scalability',
    title: 'Scalability',
    category: 'system-design',
    theory: `# Scalability

## What is Scalability?

Scalability is the ability of a system to handle a growing amount of work by adding resources. A scalable system maintains performance as load increases.

## Types of Scaling

### Vertical Scaling (Scale Up)
- Add more power (CPU, RAM, SSD) to a single server
- Simple but has hard limits (hardware ceiling)
- Single point of failure
- Examples: upgrading from 16GB to 128GB RAM

### Horizontal Scaling (Scale Out)
- Add more servers to distribute the load
- Virtually unlimited scaling potential
- Requires load balancing and distributed architecture
- Examples: adding web servers behind a load balancer

| Aspect | Vertical | Horizontal |
|--------|----------|------------|
| Cost | Expensive hardware | Commodity hardware |
| Limit | Hardware ceiling | Virtually unlimited |
| Complexity | Simple | Complex (distributed systems) |
| Fault Tolerance | Low (single node) | High (multiple nodes) |
| Examples | MySQL on bigger server | Cassandra cluster |

## Scalability Dimensions

### 1. Load Scalability
Ability to handle increasing number of requests per second.
- Caching, load balancing, database sharding

### 2. Data Scalability
Ability to handle growing data volume.
- Partitioning, archiving, compression, sharding

### 3. Geographic Scalability
Ability to serve users across regions efficiently.
- CDNs, multi-region deployments, edge computing

## Key Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Throughput | Requests per second | Higher is better |
| Latency | Response time | Lower is better |
| Error Rate | Failed requests / total | < 0.1% |
| Resource Utilisation | CPU, memory, disk, network | < 80% |

## Scalability Principles

1. **Statelessness** — Keep application servers stateless; store state externally (Redis, DB)
2. **Caching** — Cache at every layer (CDN, application, database)
3. **Asynchronous Processing** — Use message queues for heavy tasks
4. **Database Sharding** — Split data across multiple databases
5. **Load Balancing** — Distribute traffic evenly across servers
6. **Auto-scaling** — Automatically add/remove resources based on load
`,

    examples: `# Scalability — Examples

## Scenario: E-commerce Platform Black Friday

**Problem:** 10x traffic spike during sales events.

**Solution:**
1. Horizontal scaling: auto-scale web servers from 10 → 100 instances
2. CDN: cache product images and static assets at edge locations
3. Read replicas: 5 read replicas for product catalog queries
4. Message queue: order processing via Kafka (async, decoupled)
5. Database sharding: shard orders by user_id

## Scenario: Social Media Feed

**Problem:** Millions of users refreshing feeds simultaneously.

**Solution:**
1. Fan-out on write: pre-compute feeds for active users
2. Caching: Redis for hot posts, CDN for media
3. Edge caching: serve from nearest data centre
4. Rate limiting: prevent abuse and protect backend

## Scenario: Video Streaming Service

**Problem:** High bandwidth, variable quality requirements.

**Solution:**
1. CDN: distribute video chunks globally
2. Adaptive bitrate: serve quality based on connection
3. Regional origin servers: reduce backhaul traffic
4. Pre-positioning: predict and cache trending content
`,

    patterns: `# Scalability Patterns

## 1. Load Balancing Pattern
Distribute incoming requests across multiple servers.
- Round-robin, least connections, IP hash
- Health checks to remove failed nodes
- Layer 4 (transport) vs Layer 7 (application)

## 2. Caching Pattern
Store frequently accessed data closer to consumers.
- **Cache-Aside:** Application checks cache first, falls back to DB
- **Write-Through:** Write to cache and DB simultaneously
- **Write-Behind:** Write to cache, async flush to DB
- **Read-Through:** Cache manages DB reads transparently

## 3. CQRS (Command Query Responsibility Segregation)
Separate read and write models for independent scaling.
- Write model: optimised for consistency (OLTP)
- Read model: optimised for queries (OLAP, materialised views)

## 4. Sharding Pattern
Partition data across multiple databases.
- **Hash sharding:** hash(key) % num_shards
- **Range sharding:** user_id 1-1M → Shard A, 1M-2M → Shard B
- **Geo sharding:** EU users → EU shard, US users → US shard

## 5. Rate Limiting Pattern
Control resource consumption and prevent overload.
- Token bucket, sliding window, fixed window
- Per-user, per-IP, or global limits

## 6. Bulkhead Pattern
Isolate failures to prevent cascading issues.
- Separate thread pools per service
- Circuit breakers for external dependencies
`,

    interviewTips: `# Interview Tips — Scalability

1. **Start with requirements:** Ask about expected users, data volume, read/write ratio.
2. **Estimate first:** Do back-of-envelope calculations (QPS, storage, bandwidth).
3. **Identify bottlenecks:** Database is usually the first bottleneck — cache and shard early.
4. **Trade-offs matter:** Scalability vs complexity, consistency vs availability, cost vs performance.
5. **Know the numbers:**
   - 1 server: ~1K-10K RPS
   - 1 DB connection: ~1K QPS
   - Redis: ~100K ops/sec
   - Network: ~1Gbps = ~125MB/s
6. **Mention monitoring:** Scalable systems need observability (metrics, logs, tracing).
`,

    commonMistakes: `# Common Mistakes — Scalability

1. **Premature optimisation:** Don't over-engineer before you need it. Scale when metrics demand it.
2. **Ignoring the database:** Application scales easily; database is the bottleneck. Plan sharding early.
3. **Synchronous everywhere:** Blocking calls between services create cascading failures. Use async patterns.
4. **Single points of failure:** Every component needs redundancy (load balancer, DB, cache).
5. **No rate limiting:** Unprotected endpoints fail under unexpected load spikes.
6. **Stateful servers:** Sticky sessions prevent horizontal scaling. Use external session stores.
7. **Cache invalidation bugs:** Stale data, thundering herd, cache avalanche — plan invalidation strategy.
`,

    revision: `# Scalability — Quick Revision

| Concept | Key Point |
|---------|-----------|
| Vertical Scaling | Bigger machine, limited, simple |
| Horizontal Scaling | More machines, unlimited, complex |
| Load Balancer | Distributes traffic, health checks |
| CDN | Caches static content at edge |
| Database Sharding | Splits data across DBs |
| Caching | Reduces DB load, improves latency |
| Message Queue | Async processing, decoupling |
| Auto-scaling | Dynamic resource adjustment |

## Scaling Order of Operations
1. Optimise code and queries
2. Add caching (CDN, Redis)
3. Read replicas for DB
4. Horizontal scaling (more app servers)
5. Database sharding
6. Multi-region / edge deployment
`,

    codeExamples: [],

    resources: [
        { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', type: 'book', free: false },
        { title: 'Scalability for Dummies', url: 'https://www.lecloud.net/tagged/scalability', type: 'article', free: true },
        { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'article', free: true },
    ],

    quiz: [
        { id: 'scale-q1', question: 'What is the main limitation of vertical scaling?', options: ['It requires load balancers', 'It has a hardware ceiling (you cannot scale infinitely)', 'It is too cheap', 'It requires distributed databases'], correctIndex: 1, explanation: 'Vertical scaling means adding more power to a single machine. There is a physical limit to how much CPU, RAM, and disk a single server can hold.' },
        { id: 'scale-q2', question: 'Which pattern separates read and write models for independent scaling?', options: ['CQRS', 'Event Sourcing', 'Saga Pattern', 'Circuit Breaker'], correctIndex: 0, explanation: 'CQRS (Command Query Responsibility Segregation) separates the read model from the write model, allowing each to be optimised and scaled independently.' },
        { id: 'scale-q3', question: 'In a Cache-Aside pattern, what happens on a cache miss?', options: ['The request fails', 'The application fetches from DB and populates cache', 'The cache fetches from DB automatically', 'Data is written to cache only'], correctIndex: 1, explanation: 'In Cache-Aside, the application checks the cache first. On a miss, it fetches from the database and then writes the result into the cache for future requests.' },
        { id: 'scale-q4', question: 'Which is typically the FIRST bottleneck when scaling a web application?', options: ['CDN bandwidth', 'Application server CPU', 'Database', 'Load balancer'], correctIndex: 2, explanation: 'The database is usually the first bottleneck because it handles persistent storage, ACID constraints, and concurrent connections — all harder to scale than stateless app servers.' },
    ],

    questions: [],
};
