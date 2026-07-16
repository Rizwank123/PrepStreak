import type { TopicContent } from '../../types';

export const systemDesignInterviewContent: TopicContent = {
  slug: 'interview/system-design-interview',
  title: 'System Design Interview',
  category: 'interview',
  theory: `# System Design Interview Strategy

## RESHADED Framework

| Letter | Step | Time |
|--------|------|------|
| R | Requirements (functional + non-functional) | 5 min |
| E | Estimation (scale: QPS, storage, bandwidth) | 5 min |
| S | Storage (DB choice, schema) | 5 min |
| H | High-level design (box diagram) | 10 min |
| A | API design (endpoints, contracts) | 5 min |
| D | Detailed design (deep dive on key components) | 10 min |
| E | Evaluate (bottlenecks, failure modes) | 5 min |
| D | Distinguish (trade-offs, alternatives) | 5 min |

## Step 1: Requirements

**Functional requirements:**
- What does the system DO?
- Core features only (scope is huge, focus matters)

**Non-functional requirements:**
- Scale: how many users? QPS?
- Availability: 99.9%? 99.999%?
- Latency: p99 < 100ms?
- Consistency: strong or eventual?

## Step 2: Estimation

Back-of-envelope calculations:
- Daily active users × actions per day = QPS
- QPS × data size per request = bandwidth
- QPS × data size × retention = storage
- Read:write ratio

## Step 3: High-Level Design

Draw boxes: clients → load balancer → services → databases → cache → CDN

## Step 4: Deep Dive

Interviewer picks 1–2 components. Show depth:
- Database: sharding strategy, indexes
- Cache: strategy, eviction, invalidation
- Message queue: ordering, at-least-once delivery
`,

  examples: `# System Design — Example: URL Shortener

## Requirements
- Functional: shorten URL, redirect short → original
- Non-functional: 100M URLs created/day, 10B reads/day, 10-year retention

## Estimation
- Write QPS = 100M / 86400 ≈ 1200 QPS
- Read QPS = 10B / 86400 ≈ 115,000 QPS (read-heavy, ratio 100:1)
- Storage: 1200 QPS × 500 bytes × 86400 × 365 × 10 ≈ 189 TB

## Design
- Hash: MD5/Base62 encode → 6-character code
- DB: short_code (PK), long_url, created_at, user_id, expiry
- Cache: Redis (popular URLs), 80-20 rule
- Redirect: 301 (cacheable browser) vs 302 (track analytics)
`,

  patterns: `# System Design Patterns

## Always mention:
1. Load balancer
2. Cache (Redis)
3. Database (primary + replica)
4. CDN for static assets
5. Message queue for async processing
6. Monitoring + alerting

## Pick appropriate DB:
- Strong consistency, complex queries → PostgreSQL
- High write throughput, global scale → Cassandra
- Document store → MongoDB
- Key-value cache → Redis
- Search → Elasticsearch
`,

  interviewTips: `# Interview Tips — System Design

1. Drive the interview — don't wait to be asked. Lead with RESHADED.
2. Whiteboard from the start — visual communication is key.
3. State trade-offs explicitly: "I chose X over Y because... the downside is..."
4. Ask interviewers which component to deep-dive.
5. Acknowledge what you're simplifying — "I'm omitting X for now, can revisit."
`,

  commonMistakes: `# Common Mistakes — System Design

1. Jumping to solutions before requirements.
2. No estimation — hand-waving about scale.
3. Single point of failure everywhere — no HA.
4. Over-engineering — add complexity only when justified by requirements.
5. Forgetting monitoring, logging, alerting.
`,

  revision: `# System Design — Quick Revision

## Scale Estimation Rules of Thumb
- 1 million users → ~12 QPS
- 100M DAU × 10 actions → 12K QPS
- 1KB/request × 1M req/day → ~1GB/day
- 8 characters base62 = 62^8 = 218 trillion possibilities

## Common Databases
| Use Case | DB |
|----------|-----|
| Relational data | PostgreSQL |
| KV cache | Redis |
| Wide column, high write | Cassandra |
| Document | MongoDB |
| Search | Elasticsearch |
`,

  codeExamples: [],

  resources: [
    { title: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer', type: 'github', free: true },
    { title: 'ByteByteGo System Design', url: 'https://bytebytego.com', type: 'video', free: false },
    { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', type: 'book', free: false },
  ],

  quiz: [
    { id: 'sdi-q1', question: 'What should you do FIRST in a system design interview?', options: ['Draw the architecture', 'Code the solution', 'Clarify functional and non-functional requirements', 'Estimate storage'], correctIndex: 2, explanation: 'Requirements define scope. Without them, you might design the wrong system. Ask: what are the core features? What\'s the scale? Availability requirements?' },
    { id: 'sdi-q2', question: 'Back-of-envelope estimation for 100M DAU, 10 actions/day, 1KB/action storage per day?', options: ['1 GB/day', '10 GB/day', '100 GB/day', '1 TB/day'], correctIndex: 2, explanation: '100M users × 10 actions × 1KB = 1,000 GB/day = ~1 TB/day. Back of envelope: 100M × 10 × 1024 bytes ≈ 1 TB.' },
    { id: 'sdi-q3', question: 'For URL shortener redirects, 301 vs 302: which to use for analytics?', options: ['301 — permanent, browser caches', '302 — temporary, browser always hits your server', 'Both are identical', 'Neither works for redirects'], correctIndex: 1, explanation: '302 (temporary redirect) means the browser hits your server on every request, allowing you to log analytics. 301 gets cached by browser — fast but no analytics tracking.' },
    { id: 'sdi-q4', question: 'What is the 80-20 rule in caching?', options: ['80% of cache hits come from 20% of data', '80% of requests should be served from DB', 'Cache 80% of all data', '20% of requests are writes'], correctIndex: 0, explanation: '20% of content serves 80% of traffic (Pareto principle). Caching that 20% gives maximum cache effectiveness with minimum storage.' },
  ],

  questions: [],
};
