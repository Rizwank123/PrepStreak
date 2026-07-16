import type { TopicContent } from '../../types';

export const distributedSystemsContent: TopicContent = {
  slug: 'system-design/distributed-systems',
  title: 'Distributed Systems',
  category: 'system-design',
  theory: `# Distributed Systems

## Core Challenges

1. **Partial failures** — some nodes fail, others continue
2. **Network unreliability** — messages can be lost, delayed, or duplicated
3. **No global clock** — nodes can't agree on absolute time
4. **Consistency vs availability** — CAP theorem

## Consensus

Nodes must agree on a single value despite failures.

**Raft** — leader-based. Leader elected by majority. All writes go through leader. Followers replicate log. Used by: etcd, Consul.

**Paxos** — theoretical foundation. Two phases: Prepare/Promise and Accept/Accepted. Complex to implement.

## Leader Election

Only one node is "master" at a time. Others are followers.
- ZooKeeper ephemeral nodes
- Redis SETNX (set if not exists)
- etcd leases

## Vector Clocks

Logical timestamps that capture causality between events in distributed systems.

## Two-Phase Commit (2PC)

**Phase 1:** Coordinator sends PREPARE to all participants. Each votes YES or NO.
**Phase 2:** If all YES, send COMMIT. Else send ROLLBACK.

Problem: coordinator failure leaves participants in uncertain state.

## Saga Pattern

Alternative to 2PC. Local transactions + compensating transactions on failure. Eventually consistent.

## Eventual Consistency

System will eventually reach a consistent state without real-time coordination. Conflict resolution needed (last-write-wins, vector clocks, CRDTs).
`,

  examples: `# Distributed Systems — Examples

## Distributed Lock with Redis

\`\`\`go
// Redlock algorithm
func acquireLock(client *redis.Client, key string, ttl time.Duration) (string, bool) {
    value := uuid.New().String()
    ok, _ := client.SetNX(ctx, key, value, ttl).Result()
    return value, ok
}
func releaseLock(client *redis.Client, key, value string) {
    // Lua script: compare-and-delete atomically
    script := "if redis.call('get',KEYS[1]) == ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end"
    client.Eval(ctx, script, []string{key}, value)
}
\`\`\`
`,

  patterns: `# Distributed Systems Patterns

## 1. Sidecar — proxy per service (Envoy, Istio)
## 2. Service Mesh — network layer for microservices
## 3. CQRS — command/query separation
## 4. Event Sourcing — immutable event log as source of truth
## 5. Bulkhead — isolate failure blast radius
## 6. Health Endpoint — /health for load balancer checks
`,

  interviewTips: `# Interview Tips — Distributed Systems

1. Know CAP, PACELC, and which DB systems fall where.
2. For consistency: distinguish strong, eventual, causal, monotonic-read.
3. Explain 2PC limitations: blocking protocol, coordinator SPOF.
4. Saga as alternative: eventual consistency, compensating transactions.
5. Distributed tracing (OpenTelemetry) for debugging failures across services.
`,

  commonMistakes: `# Common Mistakes — Distributed Systems

1. Assuming network calls are reliable — they're not.
2. Assuming clocks are synchronised — use logical clocks or NTP carefully.
3. Using 2PC in microservices — prefer Saga.
4. Not designing for idempotency — retries cause duplicate processing.
5. Ignoring partial failures — design for all possible failure modes.
`,

  revision: `# Distributed Systems — Quick Revision

| Problem | Solution |
|---------|----------|
| Consensus | Raft, Paxos |
| Leader election | ZooKeeper, etcd |
| Distributed lock | Redlock |
| Distributed transaction | Saga, 2PC |
| Causality tracking | Vector clocks |
| Always-available data | CRDTs |
`,

  codeExamples: [],

  resources: [
    { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', type: 'book', free: false },
    { title: 'Raft Consensus Algorithm', url: 'https://raft.github.io/', type: 'docs', free: true },
    { title: 'Distributed Systems — Martin Kleppmann MIT', url: 'https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB', type: 'video', free: true },
  ],

  quiz: [
    { id: 'ds-q1', question: 'In Raft consensus, writes go through:', options: ['Any node', 'The oldest node', 'The elected leader only', 'All nodes simultaneously'], correctIndex: 2, explanation: 'Raft has a single leader at any time. All writes go through the leader, which replicates to followers before acknowledging.' },
    { id: 'ds-q2', question: 'Two-Phase Commit\'s main limitation is:', options: ['Slow performance', 'Blocking protocol — coordinator failure leaves participants uncertain', 'Requires sorted inputs', 'Only works with SQL'], correctIndex: 1, explanation: 'If the coordinator crashes after Phase 1 votes but before Phase 2, participants are blocked in an uncertain state waiting for the coordinator to recover.' },
    { id: 'ds-q3', question: 'The Saga pattern handles distributed transactions by:', options: ['Using 2PC', 'Local transactions with compensating transactions on failure', 'Locking all resources upfront', 'Using global transactions'], correctIndex: 1, explanation: 'Saga executes a series of local transactions. If a step fails, it runs compensating transactions (undo actions) to roll back the previous steps.' },
    { id: 'ds-q4', question: 'Vector clocks track:', options: ['Real wall-clock time', 'Causality — happens-before relationships between events', 'Network latency', 'Node health'], correctIndex: 1, explanation: 'Vector clocks assign a vector timestamp to events. By comparing vectors you can determine if event A happened-before B, B happened-before A, or they\'re concurrent.' },
  ],

  questions: [],
};
