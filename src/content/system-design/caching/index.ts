import type { TopicContent } from '../../types';

export const cachingContent: TopicContent = {
  slug: 'system-design/caching',
  title: 'Caching',
  category: 'system-design',
  theory: `# Caching

## Why Cache?

Reduce latency (memory: μs vs DB: ms), reduce load on database, improve throughput.

## Cache Strategies

**Cache-Aside (Lazy Loading)**
- App checks cache. Miss → load DB → write cache.
- Resilient to cache failure. Risk: stale data, cold start.

**Write-Through**
- Write to cache AND DB simultaneously.
- Always fresh. Doubles write latency.

**Write-Back (Write-Behind)**
- Write to cache only, async flush to DB.
- Low write latency. Risk: data loss if cache crashes before flush.

**Write-Around**
- Write directly to DB, bypass cache.
- Cache stays clean. Good for write-once data.

## Eviction Policies

| Policy | Evicts | Best For |
|--------|--------|---------|
| LRU (Least Recently Used) | Oldest access | General purpose |
| LFU (Least Frequently Used) | Least popular | Access-pattern-based |
| TTL | Expired items | Time-sensitive data |
| FIFO | Oldest inserted | Simple queues |

## Redis vs Memcached

| | Redis | Memcached |
|-|-------|-----------|
| Data types | Rich (list, set, hash, sorted set) | Simple string only |
| Persistence | Yes (RDB, AOF) | No |
| Cluster | Yes | Yes |
| Pub/Sub | Yes | No |
| Atomic ops | Yes | Limited |

## Cache Stampede / Thundering Herd

Many requests miss at the same time and hammer the DB. Solutions:
- Locking / mutex on cache miss
- Stale-while-revalidate
- Probabilistic early expiry
`,

  examples: `# Caching — Examples

## Cache-Aside Pattern

\`\`\`go
func GetUser(id string) (*User, error) {
    // 1. Check cache
    if data, err := redis.Get(ctx, "user:"+id).Bytes(); err == nil {
        var user User
        json.Unmarshal(data, &user)
        return &user, nil
    }
    // 2. Cache miss: query DB
    user, err := db.GetUser(id)
    if err != nil { return nil, err }
    // 3. Write to cache
    data, _ := json.Marshal(user)
    redis.Set(ctx, "user:"+id, data, 5*time.Minute)
    return user, nil
}
\`\`\`

## LRU Cache Implementation

Doubly linked list + hash map. O(1) get and put.
`,

  patterns: `# Caching Patterns

## 1. Cache-Aside — most common, application manages cache
## 2. Write-Through — consistency at cost of latency
## 3. Read-Through — cache handles DB lookup transparently
## 4. CDN Caching — static assets at edge
## 5. Local (in-memory) + Distributed (Redis) — two-level cache
`,

  interviewTips: `# Interview Tips — Caching

1. Always mention caching in system design — it's expected.
2. Specify TTL and eviction policy for every cache you add.
3. Discuss invalidation: how does the cache get updated when DB changes?
4. Mention cache stampede — shows you think about failure modes.
5. Redis for complex data types (sorted sets for leaderboards), Memcached for simple key-value.
`,

  commonMistakes: `# Common Mistakes — Caching

1. Caching everything — don't cache data that changes too frequently.
2. No TTL — stale data forever.
3. Not considering cache invalidation — hardest problem in CS.
4. Thundering herd — don't forget to mention and handle it.
5. Cache as primary store — cache is not durable by default.
`,

  revision: `# Caching — Quick Revision

| Strategy | Write to Cache | Write to DB | Freshness |
|----------|---------------|-------------|----------|
| Cache-Aside | On miss | Always | Eventual |
| Write-Through | Yes | Yes (sync) | Strong |
| Write-Back | Yes | Async | Eventual |
| Write-Around | No | Always | Fresh on next miss |
`,

  codeExamples: [],

  resources: [
    { title: 'Caching — ByteByteGo', url: 'https://bytebytego.com', type: 'video', free: false },
    { title: 'Redis Documentation', url: 'https://redis.io/docs/', type: 'docs', free: true },
    { title: 'Caching Strategies — AWS', url: 'https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html', type: 'docs', free: true },
  ],

  quiz: [
    { id: 'cch-q1', question: 'In Cache-Aside, when does the application write to the cache?', options: ['On every write', 'On cache hit', 'On cache miss (after DB read)', 'Never'], correctIndex: 2, explanation: 'Cache-Aside (lazy loading): app reads from cache, on miss reads from DB and then populates cache. Cache is populated on demand.' },
    { id: 'cch-q2', question: 'Write-Through caching writes to:', options: ['Cache only', 'DB only', 'Cache and DB synchronously', 'Cache first, DB later'], correctIndex: 2, explanation: 'Write-Through writes to both cache and DB in the same operation — ensuring cache is always consistent, at the cost of write latency.' },
    { id: 'cch-q3', question: 'LRU eviction removes which item?', options: ['Most recently used', 'Least frequently used', 'Least recently used', 'Oldest inserted'], correctIndex: 2, explanation: 'LRU (Least Recently Used) removes the item that was accessed furthest in the past — the assumption is that recently used items are more likely to be needed again.' },
    { id: 'cch-q4', question: 'Cache stampede occurs when:', options: ['Cache is too large', 'Many requests miss simultaneously and overload the DB', 'TTL is too long', 'Cache is read-only'], correctIndex: 1, explanation: 'When a popular cached item expires, many concurrent requests miss and all hit the DB simultaneously — "thundering herd". Use mutex or early revalidation to prevent.' },
  ],

  questions: [],
};
