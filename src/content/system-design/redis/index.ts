import type { TopicContent } from '../../types';

export const redisContent: TopicContent = {
  slug: 'system-design/redis',
  title: 'Redis',
  category: 'system-design',
  theory: `# Redis — In-Memory Data Store

## What is Redis?

Redis (Remote Dictionary Server) is an open-source, in-memory key-value data store. It supports strings, hashes, lists, sets, sorted sets, streams, bitmaps, and more. Because data lives in RAM, reads and writes are sub-millisecond.

## Architecture

\`\`\`
┌────────────┐     ┌───────────────────────────┐
│  Client App │────▶│   Redis Server (RAM)       │
└────────────┘     │  ┌─────┐ ┌─────┐ ┌─────┐  │
                   │  │ Key1│ │ Key2│ │ Key3│  │
                   │  └─────┘ └─────┘ └─────┘  │
                   │                            │
                   │  Persistence Layer:        │
                   │  RDB (snapshot) + AOF (log) │
                   └─────────────┬──────────────┘
                                 │
                          ┌──────▼──────┐
                          │  Disk (SSD)  │
                          └─────────────┘
\`\`\`

## Data Structures

| Type | Use Case | Key Commands |
|------|----------|-------------|
| String | Caching, counters | SET, GET, INCR |
| Hash | User profiles, objects | HSET, HGET, HGETALL |
| List | Queues, timelines | LPUSH, RPOP, LRANGE |
| Set | Tags, unique items | SADD, SISMEMBER, SINTER |
| Sorted Set | Leaderboards, rankings | ZADD, ZRANGE, ZRANK |
| Stream | Event logging | XADD, XREAD, XRANGE |

## Persistence Options

### RDB (Redis Database)
- Point-in-time snapshots at intervals
- Compact file, fast restart
- Risk: data between snapshots is lost on crash

### AOF (Append-Only File)
- Logs every write command
- More durable — fsync options: always, everysec, no
- Larger file, slower replay

### Hybrid (Recommended)
- Use AOF for durability + RDB for faster restart
- Redis 4+ supports AOF rewrite with RDB preamble

## Replication & High Availability

\`\`\`
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Master  │───▶│ Replica 1│    │ Replica 2│
│ (R/W)    │    │ (R only) │    │ (R only) │
└────┬─────┘    └──────────┘    └──────────┘
     │
     ▼
┌──────────┐
│ Sentinel │  Monitors master, promotes replica on failure
└──────────┘
\`\`\`

## Redis Cluster (Sharding)

Redis Cluster distributes data across multiple nodes using hash slots (0–16383).

\`\`\`
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Node A   │  │ Node B   │  │ Node C   │
│ Slots    │  │ Slots    │  │ Slots    │
│ 0-5460   │  │ 5461-10922│  │ 10923-16383│
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     └─────┬───────┘             │
           ▼                     │
    ┌──────────┐         ┌──────────┐
    │ Replica A│         │ Replica B│
    └──────────┘         └──────────┘
\`\`\`

## Common Use Cases

1. **Session Store** — web session data with TTL
2. **Cache** — DB query results, computed values
3. **Leaderboard** — sorted sets for real-time rankings
4. **Rate Limiter** — INCR + EXPIRE for sliding window
5. **Pub/Sub** — real-time message broadcasting
6. **Job Queue** — lists or streams for async task processing
`,

  examples: `# Redis — Practical Examples

## Session Store

\`\`\`go
// Store session with 30-minute TTL
err := redis.Set(ctx, "session:"+sessionID, userData, 30*time.Minute).Err()

// Retrieve session
data, err := redis.Get(ctx, "session:"+sessionID).Bytes()
\`\`\`

## Rate Limiter (Sliding Window)

\`\`\`go
// Allow 100 requests per minute per IP
key := "rate:" + ip
count, _ := redis.Incr(ctx, key).Result()
if count == 1 {
    redis.Expire(ctx, key, time.Minute)
}
if count > 100 {
    return errors.New("rate limit exceeded")
}
\`\`\`

## Leaderboard with Sorted Sets

\`\`\`go
// Add player score
redis.ZAdd(ctx, "leaderboard", &redis.Z{Score: score, Member: playerID})

// Get top 10 players
top10, _ := redis.ZRevRangeWithScores(ctx, "leaderboard", 0, 9).Result()

// Get player rank
rank, _ := redis.ZRevRank(ctx, "leaderboard", playerID).Result()
\`\`\`

## Pub/Sub Chat

\`\`\`go
// Publisher
redis.Publish(ctx, "chat:room1", message)

// Subscriber
pubsub := redis.Subscribe(ctx, "chat:room1")
for msg := range pubsub.Channel() {
    fmt.Println(msg.Payload)
}
\`\`\`
`,

  patterns: `# Redis Patterns

## 1. Cache-Aside (Lazy Loading)
App checks Redis first, falls back to DB on miss, then populates cache with TTL.

## 2. Write-Through
Write to Redis and DB simultaneously. Always consistent but doubles write latency.

## 3. Write-Behind (Write-Back)
Write to Redis only, async flush to DB. Low latency but risk of data loss.

## 4. Read-Through
App always reads from Redis; Redis fetches from DB on miss transparently.

## 5. Distributed Lock (Redlock)
Use SET key value NX PX timeout for mutual exclusion across services.

## 6. Lua Scripting
Atomic multi-command operations executed server-side — no race conditions.
`,

  interviewTips: `# Interview Tips — Redis

1. **Mention persistence trade-offs:** RDB for speed, AOF for durability, hybrid for both.
2. **Eviction policies:** Know LRU, LFU, TTL, no-eviction. Default is noeviction in Redis 4+.
3. **Redis vs Memcached:** Redis has data types, persistence, pub/sub, clustering. Memcached is simpler, multithreaded.
4. **Cache stampede:** Mention mutex, stale-while-revalidate, or probabilistic early expiry.
5. **Redis Cluster vs Sentinel:** Cluster = sharding + HA. Sentinel = HA only (no sharding).
6. **Memory management:** maxmemory + eviction policy. Monitor used_memory vs maxmemory.
`,

  commonMistakes: `# Common Mistakes — Redis

1. **No TTL on cached data** — memory grows unbounded. Always set TTL.
2. **Using KEYS in production** — blocks the server. Use SCAN instead.
3. **Large keys/values** — storing megabytes in a single key blocks the event loop.
4. **No eviction policy** — OOM crashes. Set maxmemory and a policy (e.g., allkeys-lru).
5. **Treating Redis as a primary DB** — it's in-memory; data can be lost. Use AOF + replica.
6. **Not pipelining** — round-trip per command is expensive. Use pipelines or transactions.
7. **Hot keys** — a single key receiving most traffic causes uneven load. Shard hot keys.
`,

  revision: `# Redis — Quick Revision

| Concept | Key Point |
|---------|-----------|
| Data store | In-memory key-value, sub-ms latency |
| Data types | String, Hash, List, Set, Sorted Set, Stream |
| Persistence | RDB (snapshot) + AOF (log) |
| HA | Sentinel (failover) or Cluster (sharding + HA) |
| Eviction | LRU, LFU, TTL, no-eviction |
| Use cases | Cache, sessions, leaderboards, rate limit, pub/sub |
| Pipeline | Batch commands, reduce round-trips |
| Lua | Atomic server-side scripts |

## Key Numbers
- Single instance: ~100K ops/sec
- Cluster: scales linearly with nodes
- Memory: data must fit in RAM
- Latency: < 1ms for most operations
`,

  codeExamples: [
    {
      language: 'go',
      label: 'Go — Redis Client',
      code: `package main

import (
    "context"
    "github.com/redis/go-redis/v9"
)

var ctx = context.Background()

func main() {
    rdb := redis.NewClient(&redis.Options{
        Addr:     "localhost:6379",
        Password: "",
        DB:       0,
        PoolSize: 20,
    })

    // SET with TTL
    err := rdb.Set(ctx, "key", "value", 0).Err()
    if err != nil {
        panic(err)
    }

    // GET
    val, err := rdb.Get(ctx, "key").Result()
    println(val)
}`,
    },
    {
      language: 'typescript',
      label: 'TypeScript — ioredis',
      code: `import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: 3,
});

// Cache-Aside pattern
async function getUser(id: string) {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(id);
  await redis.setex(\`user:\${id}\`, 300, JSON.stringify(user));
  return user;
}`,
    },
  ],

  resources: [
    { title: 'Redis Official Documentation', url: 'https://redis.io/docs/', type: 'docs', free: true },
    { title: 'Redis Best Practices', url: 'https://redis.io/docs/manual/patterns/', type: 'article', free: true },
    { title: 'Redis University (Free Courses)', url: 'https://university.redis.com/', type: 'course', free: true },
    { title: 'Redis Design Patterns — ByteByteGo', url: 'https://bytebytego.com', type: 'video', free: false },
  ],

  quiz: [
    { id: 'redis-q1', question: 'Which Redis data structure is best for a real-time leaderboard?', options: ['Hash', 'List', 'Sorted Set', 'Set'], correctIndex: 2, explanation: 'Sorted Sets (ZSET) maintain members in order by score. ZADD, ZRANGE, and ZRANK give O(log N) leaderboard operations.' },
    { id: 'redis-q2', question: 'What is the difference between RDB and AOF persistence?', options: ['RDB logs every write; AOF takes snapshots', 'RDB takes snapshots; AOF logs every write command', 'They are identical', 'AOF is always faster than RDB'], correctIndex: 1, explanation: 'RDB creates point-in-time snapshots (compact, fast restart but data loss between snapshots). AOF logs every write command (more durable, larger file).' },
    { id: 'redis-q3', question: 'Why should you avoid the KEYS command in production?', options: ['It is deprecated', 'It blocks the server while scanning all keys', 'It only returns string keys', 'It requires admin privileges'], correctIndex: 1, explanation: 'KEYS scans the entire keyspace in a single blocking operation. In production with millions of keys, this freezes Redis. Use SCAN for non-blocking iteration.' },
    { id: 'redis-q4', question: 'What does Redis Sentinel provide?', options: ['Sharding across nodes', 'Automatic failover and monitoring', 'In-memory compression', 'SQL query support'], correctIndex: 1, explanation: 'Sentinel monitors Redis master/replica instances, notifies clients of topology changes, and automatically promotes a replica to master if the master fails.' },
    { id: 'redis-q5', question: 'Which eviction policy removes the least recently accessed key when memory is full?', options: ['allkeys-lfu', 'allkeys-lru', 'volatile-ttl', 'noeviction'], correctIndex: 1, explanation: 'allkeys-lru evicts the least recently used key across all keys. volatile-lru only considers keys with TTL set.' },
  ],

  questions: [],
};
