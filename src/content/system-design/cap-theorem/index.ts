import type { TopicContent } from '../../types';

export const capTheoremContent: TopicContent = {
  slug: 'system-design/cap-theorem',
  title: 'CAP Theorem',
  category: 'system-design',
  theory: `# CAP Theorem

## The Theorem

A distributed system can guarantee at most **2 of 3** properties simultaneously:

- **C**onsistency — every read receives the most recent write or an error
- **A**vailability — every request receives a response (no error)
- **P**artition Tolerance — system continues despite network partitions

In practice, **network partitions always occur** in distributed systems, so the real choice is **CP vs AP**.

## CP Systems

Sacrifice availability during partitions. Return error rather than stale data.
- HBase, ZooKeeper, etcd, Consul
- Use when: financial transactions, inventory systems

## AP Systems

Stay available during partitions, accept eventual consistency.
- Cassandra, DynamoDB, CouchDB
- Use when: social feeds, shopping carts, DNS

## CA Systems

Only possible in single-node (no partition risk).
- Traditional RDBMS (PostgreSQL, MySQL) in standalone mode

## PACELC Extension

PACELC extends CAP: "Even when there's **No partition**, there's a trade-off between **L**atency and **C**onsistency."

| System | Partition | Else |
|--------|-----------|------|
| Cassandra | AP | EL (eventual, low latency) |
| Spanner | CP | EC (strong, higher latency) |
| DynamoDB | AP | EL |
`,

  examples: `# CAP Theorem — Examples

## Scenario: E-commerce Inventory

User A and User B both try to buy the last item simultaneously.

**CP approach:** Lock both reads. One succeeds, one gets error. No overselling.

**AP approach:** Both can read available=1. Both buy. Need compensation transaction later.

## Scenario: User Profile Updates

**AP approach:** User updates profile on US-East. EU-West may serve stale data for seconds.
Acceptable — eventual consistency is fine for non-critical data.

## Choosing CP vs AP

| Requirement | Choose |\n|-------------|--------|\n| Data must be 100% accurate | CP |\n| System must always respond | AP |\n| Financial operations | CP |\n| Social feeds, caches | AP |\n`,

  patterns: `# CAP Patterns

## 1. Strong Consistency Pattern
Read from single master. Replication sync before ack. Sacrifices latency.

## 2. Eventual Consistency Pattern
Async replication. Reads may be stale. Use versioning to detect conflicts.

## 3. Read-Your-Writes Consistency
User always sees their own writes. Route user's reads to same replica they wrote to.

## 4. Monotonic Read Consistency
Once a user reads a value, they never read an older value.
`,

  interviewTips: `# Interview Tips — CAP Theorem

1. Don't just say "choose 2 of 3" — explain that partition tolerance is mandatory.
2. Know which DBs are CP vs AP: Cassandra=AP, ZooKeeper=CP, DynamoDB=AP, Spanner=CP.
3. Discuss PACELC — shows deeper understanding beyond basic CAP.
4. Give concrete examples of when you'd choose each.
5. In system design interviews, state your consistency requirement upfront.
`,

  commonMistakes: `# Common Mistakes — CAP

1. Saying CA is achievable in distributed systems — partitions always happen.
2. Confusing consistency with durability — they're different.
3. Not knowing which databases are CP vs AP.
4. Ignoring eventual consistency mechanisms (vector clocks, conflict resolution).
`,

  revision: `# CAP Theorem — Quick Revision

| Property | Meaning | Sacrifice in partition |
|----------|---------|----------------------|
| Consistency | Latest data always | AP systems return stale |
| Availability | Always responds | CP systems may error |
| Partition tolerance | Survives network splits | Always required |

## CP Databases: HBase, ZooKeeper, etcd, PostgreSQL (sync replication)
## AP Databases: Cassandra, DynamoDB, Couchbase, DNS
`,

  codeExamples: [],

  resources: [
    { title: 'CAP Theorem — Martin Fowler', url: 'https://martinfowler.com/articles/nosql-distilled.html', type: 'book', free: false },
    { title: 'CAP Theorem — GfG', url: 'https://www.geeksforgeeks.org/cap-theorem-in-system-design/', type: 'article', free: true },
    { title: 'PACELC Paper', url: 'https://dbmsmusings.blogspot.com/2010/04/problems-with-cap-and-yahoos-little.html', type: 'article', free: true },
  ],

  quiz: [
    { id: 'cap-q1', question: 'Why is "CA" (Consistency + Availability, no Partition Tolerance) not realistic for distributed systems?', options: ['It\'s too expensive', 'Network partitions always occur in distributed systems', 'CA requires 3 nodes minimum', 'CA is actually realistic'], correctIndex: 1, explanation: 'Network partitions are a fact of distributed systems — switches fail, cables cut, timeouts occur. You cannot eliminate partition risk.' },
    { id: 'cap-q2', question: 'Cassandra is classified as:', options: ['CA', 'CP', 'AP', 'Neither'], correctIndex: 2, explanation: 'Cassandra prioritises availability and partition tolerance. During a partition, it serves potentially stale data rather than refusing requests.' },
    { id: 'cap-q3', question: 'ZooKeeper is classified as:', options: ['CA', 'CP', 'AP', 'PA'], correctIndex: 1, explanation: 'ZooKeeper uses leader election (Zab protocol) and requires quorum. During partition, minority partition stops serving — sacrificing availability for consistency.' },
    { id: 'cap-q4', question: 'PACELC extends CAP by adding what trade-off when there is NO partition?', options: ['Cost vs Performance', 'Latency vs Consistency', 'Availability vs Durability', 'Read vs Write'], correctIndex: 1, explanation: 'Even without partitions, strong consistency requires coordinating replicas, which adds latency. AP/EL systems serve faster with relaxed consistency.' },
  ],

  questions: [],
};
