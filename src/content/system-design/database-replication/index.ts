import type { TopicContent } from '../../types';

export const databaseReplicationContent: TopicContent = {
  slug: 'system-design/database-replication',
  title: 'Database Replication',
  category: 'system-design',
  theory: `# Database Replication

## What is Database Replication?

Database replication is the process of copying data from a primary database to one or more replica databases. This improves read throughput, availability, and geographic latency.

## Architecture

### Single-Leader (Master-Slave) Replication

\`\`\`
                    ┌──────────────┐
  Write Request ──▶│   Primary    │
                    │  (Read/Write)│
                    └──────┬───────┘
                           │ Replicate
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Replica 1 │ │ Replica 2 │ │ Replica 3 │
        │ (Read)    │ │ (Read)    │ │ (Read)    │
        └──────────┘ └──────────┘ └──────────┘
              ▲            ▲            ▲
              │     Read Requests       │
              └────────────────────────┘
\`\`\`

- Writes go to primary only
- Reads can go to any replica
- Replication is asynchronous (default) or synchronous

### Multi-Leader (Master-Master) Replication

\`\`\`
  ┌────────────┐         ┌────────────┐
  │  Leader A  │◀───────▶│  Leader B  │
  │ (R/W)      │ Replicate│ (R/W)      │
  └─────┬──────┘         └─────┬──────┘
        │                      │
   ┌────▼───┐             ┌────▼───┐
   │ Region │             │ Region │
   │   A    │             │   B    │
   └────────┘             └────────┘
\`\`\`

- Each leader accepts both reads and writes
- Conflict resolution needed (LWW, CRDTs, custom logic)
- Good for multi-region deployments

### No-Leader (Quorum-Based) Replication

\`\`\`
  ┌────────┐  ┌────────┐  ┌────────┐
  │ Node 1 │  │ Node 2 │  │ Node 3 │
  │ (R/W)  │  │ (R/W)  │  │ (R/W)  │
  └───┬────┘  └───┬────┘  └───┬────┘
      │           │           │
      └───────────┴───────────┘
           Quorum: W + R > N

  W = write quorum, R = read quorum, N = total nodes
  Example: N=3, W=2, R=2 → strong consistency
\`\`\`

## Replication Methods

### 1. Statement-Based
Copy SQL statements from primary to replicas.
- Pro: low bandwidth
- Con: non-deterministic functions (NOW(), RAND()) cause divergence

### 2. WAL (Write-Ahead Log) Shipping
Ship the binary WAL to replicas.
- Pro: exact replication, used by PostgreSQL
- Con: version-specific binary format

### 3. Logical (Row-Based) Replication
Ship logical change records (row-level changes).
- Pro: cross-version, cross-engine compatible
- Con: higher overhead

## Synchronous vs Asynchronous

| Mode | Write Latency | Data Loss Risk | Use Case |
|------|---------------|----------------|----------|
| Asynchronous | Low | Some (on primary crash) | Default, most systems |
| Synchronous | High (waits for replica) | None | Financial, critical data |
| Semi-Synchronous | Medium | Minimal | Balanced |

## Read Replica Use Cases

1. **Read Scaling** — distribute read traffic across replicas
2. **Analytics** — run heavy queries on replicas, not primary
3. **Disaster Recovery** — promote replica if primary fails
4. **Geographic Latency** — replicas near users in different regions

## Replication Lag

In async replication, replicas may lag behind the primary.

\`\`\`
Primary:   [T1] [T2] [T3] [T4] [T5]
Replica:   [T1] [T2] [T3] ---lag---
                            ▲
                     Read may see stale data
\`\`\`

Solutions:
- Read-your-writes consistency: route reads from same user to primary
- Session stickiness: pin session to one replica
- Bounded staleness: reject reads if lag exceeds threshold
`,

  examples: `# Database Replication — Practical Examples

## PostgreSQL Streaming Replication

\`\`\`sql
-- Primary: postgresql.conf
wal_level = replica
max_wal_senders = 10
synchronous_commit = on  -- for synchronous mode

-- Replica: postgresql.conf
hot_standby = on

-- Setup replica from primary
pg_basebackup -h primary-host -U replicator -D /var/lib/postgresql/data -X stream -P
\`\`\`

## MySQL Replication

\`\`\`sql
-- Primary: my.cnf
[mysqld]
server-id = 1
log_bin = mysql-bin
binlog_format = ROW

-- Replica: my.cnf
[mysqld]
server-id = 2
relay_log = relay-bin
read_only = 1

-- On replica, connect to primary:
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='primary-host',
  SOURCE_USER='replica',
  SOURCE_PASSWORD='password',
  SOURCE_LOG_FILE='mysql-bin.000001',
  SOURCE_LOG_POS=4;
START REPLICA;
\`\`\`

## Application-Level Read/Write Splitting

\`\`\`go
// Write to primary
db.Primary.Create(&user)

// Read from replica (round-robin)
replica := db.GetReplica() // returns least-lagged replica
replica.First(&user, userID)
\`\`\`
`,

  patterns: `# Replication Patterns

## 1. Single-Leader (Master-Slave)
One primary handles writes, replicas handle reads. Most common. Simple but primary is a write bottleneck.

## 2. Multi-Leader (Master-Master)
Multiple leaders accept writes. Good for multi-region but requires conflict resolution.

## 3. No-Leader (Quorum)
All nodes accept reads and writes. Strong consistency with quorum (W+R > N). Used by Cassandra, DynamoDB.

## 4. Read-Through Replica
Application reads from replicas transparently via a proxy or driver.

## 5. Cascade Replication
Primary → Replica A → Replica B. Reduces load on primary for fan-out.

## 6. Read-Your-Writes
Route a user's reads to the primary (or same replica) after their write to prevent stale reads.
`,

  interviewTips: `# Interview Tips — Database Replication

1. **Start with single-leader** — it's the simplest and most common. Mention multi-leader only if the problem needs multi-region writes.
2. **Replication lag** — always mention it. Async replicas can serve stale data. Discuss read-your-writes consistency.
3. **Synchronous vs async** — know the trade-off: latency vs durability. Financial systems need sync.
4. **Write bottleneck** — replication doesn't solve write scaling. For that, you need sharding.
5. **Failover** — explain how a replica is promoted to primary. Mention split-brain risk.
6. **Quorum systems** — W + R > N for strong consistency. Know the math.
`,

  commonMistakes: `# Common Mistakes — Database Replication

1. **Assuming replicas are real-time** — async replication has lag. Always account for stale reads.
2. **No failover plan** — if primary crashes, which replica takes over? Test failover before you need it.
3. **Too many replicas** — each replica adds load to the primary (for replication). 3-5 is typical.
4. **Writing to replicas** — writes to read replicas cause divergence. Use read_only=1.
5. **Ignoring replication lag in app logic** — user writes, then reads, sees stale data. Use read-your-writes.
6. **No monitoring** — replication lag should be monitored and alerted on.
7. **Synchronous everywhere** — sync replication on all replicas kills write latency. Use semi-sync with 1-2 replicas.
`,

  revision: `# Database Replication — Quick Revision

| Concept | Key Point |
|---------|-----------|
| Single-Leader | 1 primary (writes), N replicas (reads) |
| Multi-Leader | Multiple write nodes, conflict resolution needed |
| No-Leader | Quorum: W + R > N for strong consistency |
| Async | Low latency, risk of data loss on crash |
| Sync | No data loss, high write latency |
| Replication Lag | Replicas may be behind primary |
| Read-Your-Writes | Route same-user reads to primary |
| Failover | Promote replica on primary failure |

## Replication Methods
- Statement-based: copy SQL (non-deterministic risk)
- WAL shipping: copy binary log (PostgreSQL)
- Logical: copy row-level changes (cross-version)
`,

  codeExamples: [
    {
      language: 'go',
      label: 'Go — Read/Write Split',
      code: `package main

import (
    "gorm.io/gorm"
    "gorm.io/driver/postgres"
)

type DB struct {
    Primary   *gorm.DB
    Replicas  []*gorm.DB
    replicaIdx int
}

func (d *DB) GetReplica() *gorm.DB {
    // Round-robin replica selection
    replica := d.Replicas[d.replicaIdx%len(d.Replicas)]
    d.replicaIdx++
    return replica
}

func (d *DB) CreateUser(user *User) error {
    return d.Primary.Create(user).Error
}

func (d *DB) GetUser(id uint) (*User, error) {
    var user User
    err := d.GetReplica().First(&user, id).Error
    return &user, err
}`,
    },
  ],

  resources: [
    { title: 'PostgreSQL Replication Docs', url: 'https://www.postgresql.org/docs/current/warm-standby.html', type: 'docs', free: true },
    { title: 'MySQL Replication', url: 'https://dev.mysql.com/doc/refman/8.0/en/replication.html', type: 'docs', free: true },
    { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', type: 'book', free: false },
    { title: 'Database Replication — ByteByteGo', url: 'https://bytebytego.com', type: 'video', free: false },
  ],

  quiz: [
    { id: 'dbrepl-q1', question: 'In single-leader replication, where do write operations go?', options: ['Any replica', 'Primary only', 'Load balancer decides', 'All nodes simultaneously'], correctIndex: 1, explanation: 'In single-leader (master-slave) replication, all writes go to the primary. The primary then replicates changes to read replicas. This ensures write consistency.' },
    { id: 'dbrepl-q2', question: 'What is replication lag?', options: ['Network latency between client and DB', 'Delay between a write on primary and the replica catching up', 'Query execution time', 'Time to promote a replica'], correctIndex: 1, explanation: 'Replication lag is the delay between a write being committed on the primary and that change appearing on a replica. In async replication, this can range from milliseconds to seconds.' },
    { id: 'dbrepl-q3', question: 'In a quorum-based system with N=5, W=3, R=3, what consistency guarantee do you get?', options: ['Eventual consistency', 'Strong consistency', 'No consistency', 'Weak consistency'], correctIndex: 1, explanation: 'With W=3, R=3, and N=5, W+R=6 > N=5. This guarantees that any read overlaps with the last write, providing strong consistency.' },
    { id: 'dbrepl-q4', question: 'What is read-your-writes consistency?', options: ['Replicas can write', 'A user reads their own writes immediately', 'Writes are always synchronous', 'Reads are always from primary'], correctIndex: 1, explanation: 'Read-your-writes consistency ensures that after a user writes, their subsequent reads reflect that write. This is often done by routing that user reads to the primary or the same replica.' },
  ],

  questions: [],
};
