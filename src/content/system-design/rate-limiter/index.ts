import type { TopicContent } from '../../types';

export const rateLimiterContent: TopicContent = {
  slug: 'system-design/rate-limiter',
  title: 'Rate Limiter',
  category: 'system-design',
  theory: `# Rate Limiter

## Purpose

Prevent abuse, ensure fair usage, protect backend services from overload, and enforce SLA tiers.

## Algorithms

**Token Bucket**
- Bucket of capacity C. Tokens added at rate R/sec.
- Request consumes 1 token. Reject if bucket empty.
- Allows bursts up to C. Smooth long-term.

**Leaky Bucket**
- Requests enter bucket. Processed at constant rate.
- No burst allowed. Memory-bounded queue.

**Fixed Window Counter**
- Count requests per time window (e.g., per minute).
- Problem: burst at window boundary (e.g., 100 req in last second of window + 100 in first second of next).

**Sliding Window Log**
- Store timestamps of all requests. Count within last N seconds.
- Accurate but O(requests) memory.

**Sliding Window Counter**
- Hybrid: use current + previous window weighted by overlap.
- Low memory, near-accurate.

## Distributed Rate Limiting

Use Redis for shared counters across multiple API servers.

\`\`\`
INCR user:123:count
EXPIRE user:123:count 60
GET user:123:count
\`\`\`

## Response Headers

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1620000060
Retry-After: 30  (when rate limited)
\`\`\`
`,

  examples: `# Rate Limiter — Examples

## Token Bucket in Go

\`\`\`go
type TokenBucket struct {
    tokens   float64
    capacity float64
    rate     float64 // tokens per second
    lastTime time.Time
    mu       sync.Mutex
}
func (tb *TokenBucket) Allow() bool {
    tb.mu.Lock(); defer tb.mu.Unlock()
    now := time.Now()
    elapsed := now.Sub(tb.lastTime).Seconds()
    tb.tokens = min(tb.capacity, tb.tokens + elapsed*tb.rate)
    tb.lastTime = now
    if tb.tokens >= 1 { tb.tokens--; return true }
    return false
}
\`\`\`
`,

  patterns: `# Rate Limiter Patterns

## 1. Per-user rate limiting — identify user by API key, user ID, or IP
## 2. Per-endpoint rate limiting — stricter limits on expensive endpoints
## 3. Tiered limits — free plan: 100 req/min, paid: 10,000 req/min
## 4. Redis + Lua — atomic increment and check in one operation
`,

  interviewTips: `# Interview Tips — Rate Limiter

1. Specify where the rate limiter lives: API Gateway, middleware, or service level.
2. Discuss algorithm choice with trade-offs (token bucket for bursts, leaky for smoothing).
3. Mention Redis as the distributed store for counters.
4. Discuss what happens when rate limited: 429 Too Many Requests + Retry-After header.
5. Consider rate limiting by: IP, user ID, API key, endpoint.
`,

  commonMistakes: `# Common Mistakes — Rate Limiter

1. Only rate limiting by IP — proxy users all share one IP.
2. Fixed window without handling boundary burst.
3. Not returning proper headers — clients can't implement retry logic.
4. Counting in application memory — doesn't work with multiple instances.
`,

  revision: `# Rate Limiter — Quick Revision

| Algorithm | Memory | Burst | Smoothness |
|-----------|--------|-------|-----------|
| Token Bucket | O(1) | Yes | Moderate |
| Leaky Bucket | O(queue) | No | Perfect |
| Fixed Window | O(1) | Boundary issue | Poor |
| Sliding Window Log | O(requests) | No | Best |
| Sliding Window Counter | O(1) | Approximate | Good |
`,

  codeExamples: [],

  resources: [
    { title: 'Rate Limiting — ByteByteGo', url: 'https://bytebytego.com', type: 'video', free: false },
    { title: 'Rate Limiter Design — GfG', url: 'https://www.geeksforgeeks.org/rate-limiter-system-design/', type: 'article', free: true },
    { title: 'Stripe Rate Limiting', url: 'https://stripe.com/blog/rate-limiters', type: 'article', free: true },
  ],

  quiz: [
    { id: 'rl-q1', question: 'Token bucket allows bursts up to:', options: ['Rate per second', 'Bucket capacity', 'Window size', 'Queue length'], correctIndex: 1, explanation: 'The bucket holds up to capacity tokens. A client with a full bucket can send capacity requests instantly — that\'s the burst allowance.' },
    { id: 'rl-q2', question: 'Fixed window counter\'s main problem is:', options: ['High memory usage', 'Cannot handle distributed systems', 'Boundary burst — double the rate allowed at window edges', 'Inaccurate counting'], correctIndex: 2, explanation: '100 requests allowed. Client sends 100 in the last second of window 1 and 100 in the first second of window 2 — 200 requests slip through in 2 seconds.' },
    { id: 'rl-q3', question: 'Why use Redis for distributed rate limiting?', options: ['Redis is faster than memory', 'Shared atomic counters across multiple server instances', 'Redis has TTL support', 'Redis is cheaper'], correctIndex: 1, explanation: 'Multiple API server instances can\'t share in-memory counters. Redis provides atomic INCR operations that are consistent across all instances.' },
    { id: 'rl-q4', question: 'HTTP status code for a rate-limited response?', options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '429 Too Many Requests'], correctIndex: 3, explanation: '429 Too Many Requests is the correct status code for rate limiting. Include Retry-After header indicating when the client can try again.' },
  ],

  questions: [],
};
