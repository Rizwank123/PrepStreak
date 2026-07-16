import type { TopicContent } from '../../types';

export const partitioningContent: TopicContent = {
  slug: 'system-design/partitioning',
  title: 'Partitioning',
  category: 'system-design',
  theory: `# Partitioning

## What is Partitioning?

Partitioning splits a large table into smaller, more manageable pieces called partitions. Unlike sharding (which distributes across machines), partitioning can happen within a single database or across nodes.

## Partitioning vs Sharding

| Aspect | Partitioning | Sharding |
|--------|-------------|----------|
| Scope | Within one database | Across multiple databases/nodes |
| Network | Local (same machine) | Distributed (multiple machines) |
| Complexity | Medium | High |
| Query scope | Transparent to app | Requires routing logic |
| Use case | Large single table | Data exceeds one machine |

## Architecture

### Horizontal Partitioning (by rows)

\`\`\`
┌──────────────────────────────────────────────────┐
│              Original Table (1B rows)              │
└───────────────────────┬──────────────────────────┘
                        │ Split by date
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  ┌───────────┐  ┌───────────┐  ┌───────────┐
  │ Partition │  │ Partition │  │ Partition │
  │  2023-Q1  │  │  2023-Q2  │  │  2023-Q3  │
  │ (250M)    │  │ (250M)    │  │ (250M)    │
  └───────────┘  └───────────┘  └───────────┘
\`\`\`

Each partition has the same schema but different rows.

### Vertical Partitioning (by columns)

\`\`\`
┌────────────────────────────────────────────┐
│           Original User Table               │
│  id | name | email | bio | avatar | settings │
└───────────────────────┬────────────────────┘
                        │ Split by column groups
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  ┌───────────┐  ┌───────────┐  ┌───────────┐
  │ Frequently │  │  Rarely   │  │   Blob    │
  │  Accessed  │  │ Accessed  │  │  Columns  │
  │            │  │           │  │           │
  │ id | name  │  │ bio |     │  │ avatar |  │
  │    | email │  │  settings │  │  large   │
  └───────────┘  └───────────┘  └───────────┘
\`\`\`

Separate frequently-accessed columns from rarely-accessed ones and large blobs.

## Partitioning Strategies

### 1. Range Partitioning

\`\`\`
Partition by date:
  p2023q1: created_at >= '2023-01-01' AND < '2023-04-01'
  p2023q2: created_at >= '2023-04-01' AND < '2023-07-01'
  p2023q3: created_at >= '2023-07-01' AND < '2023-10-01'
  p2023q4: created_at >= '2023-10-01' AND < '2024-01-01'

Query: SELECT * FROM orders WHERE created_at >= '2023-06-01'
→ Only scans p2023q2 partition (partition pruning)
\`\`\`

### 2. List Partitioning

\`\`\`
Partition by region:
  p_us:   country = 'US'
  p_eu:   country IN ('DE', 'FR', 'UK', 'ES')
  p_asia: country IN ('JP', 'CN', 'IN', 'KR')

Query: SELECT * FROM users WHERE country = 'JP'
→ Only scans p_asia partition
\`\`\`

### 3. Hash Partitioning

\`\`\`
Partition by hash:
  p0: hash(user_id) % 4 = 0
  p1: hash(user_id) % 4 = 1
  p2: hash(user_id) % 4 = 2
  p3: hash(user_id) % 4 = 3

Even distribution, but no partition pruning for range queries.
\`\`\`

## Partition Pruning

The query optimizer skips partitions that cannot contain matching rows.

\`\`\`
-- Range partitioned by created_at
SELECT * FROM orders WHERE created_at >= '2023-06-01' AND created_at < '2023-07-01'

Without pruning: scan ALL partitions
With pruning:   scan ONLY p2023q2 (1 of 4 partitions)
→ 4x faster
\`\`\`

## Benefits

1. **Query Performance** — scan fewer rows (partition pruning)
2. **Maintenance** — archive/drop old partitions without affecting others
3. **Data Lifecycle** — easily drop old data (DROP PARTITION vs DELETE)
4. **Parallelism** — query different partitions in parallel
5. **Storage** — store partitions on different tablespaces/disks

## Challenges

1. **Cross-partition queries** — queries without partition key scan all partitions
2. **Unique constraints** — must include partition key in unique indexes
3. **Foreign keys** — limited support for FKs to/from partitioned tables
4. **Partition limits** — PostgreSQL supports up to thousands of partitions
`,

  examples: `# Partitioning — Practical Examples

## PostgreSQL Range Partitioning

\`\`\`sql
-- Create partitioned table
CREATE TABLE orders (
    id          BIGSERIAL,
    user_id     BIGINT NOT NULL,
    amount      NUMERIC(10,2),
    created_at  TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

-- Create quarterly partitions
CREATE TABLE orders_2023q1 PARTITION OF orders
    FOR VALUES FROM ('2023-01-01') TO ('2023-04-01');

CREATE TABLE orders_2023q2 PARTITION OF orders
    FOR VALUES FROM ('2023-04-01') TO ('2023-07-01');

CREATE TABLE orders_2023q3 PARTITION OF orders
    FOR VALUES FROM ('2023-07-01') TO ('2023-10-01');

CREATE TABLE orders_2023q4 PARTITION OF orders
    FOR VALUES FROM ('2023-10-01') TO ('2024-01-01');

-- Create index on each partition (or parent)
CREATE INDEX idx_orders_user ON orders (user_id);

-- Drop old data instantly (vs slow DELETE)
DROP TABLE orders_2023q1;
\`\`\`

## PostgreSQL List Partitioning

\`\`\`sql
CREATE TABLE users (
    id       BIGSERIAL,
    name     TEXT,
    country  TEXT NOT NULL
) PARTITION BY LIST (country);

CREATE TABLE users_us PARTITION OF users
    FOR VALUES IN ('US', 'CA');

CREATE TABLE users_eu PARTITION OF users
    FOR VALUES IN ('DE', 'FR', 'UK', 'ES', 'IT');

CREATE TABLE users_asia PARTITION OF users
    FOR VALUES IN ('JP', 'CN', 'IN', 'KR', 'SG');
\`\`\`

## MySQL Partitioning

\`\`\`sql
CREATE TABLE events (
    id          BIGINT AUTO_INCREMENT,
    event_type  VARCHAR(50),
    created_at  DATETIME NOT NULL,
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (TO_DAYS(created_at)) (
    PARTITION p202301 VALUES LESS THAN (TO_DAYS('2023-02-01')),
    PARTITION p202302 VALUES LESS THAN (TO_DAYS('2023-03-01')),
    PARTITION p202303 VALUES LESS THAN (TO_DAYS('2023-04-01')),
    PARTITION pmax    VALUES LESS THAN MAXVALUE
);
\`\`\`
`,

  patterns: `# Partitioning Patterns

## 1. Time-Based Partitioning
Partition by date/time. Best for event logs, orders, metrics. Easy archiving via DROP PARTITION.

## 2. Geographic Partitioning
Partition by region/country. Best for multi-region apps. Reduces scan scope for regional queries.

## 3. Hash Partitioning
Partition by hash of key. Best for even distribution when no natural range. No pruning for range queries.

## 4. Vertical Partitioning
Split columns into separate tables. Best for tables with large blobs or rarely-accessed columns.

## 5. Composite Partitioning
Combine strategies (e.g., RANGE-HASH). Partition by date, then sub-partition by hash. Best for very large datasets.
`,

  interviewTips: `# Interview Tips — Partitioning

1. **Partitioning vs Sharding:** Partitioning is within one DB; sharding is across multiple DBs. Mention both.
2. **Partition pruning:** Always mention it — it's the main performance benefit. Queries with partition key skip irrelevant partitions.
3. **Data lifecycle:** DROP PARTITION is instant vs slow DELETE. Great for time-series data retention.
4. **Choose partition key wisely:** It should align with common query filters. Bad key = no pruning benefit.
5. **Unique constraints:** Must include partition key. This is a common gotcha in interviews.
6. **When to partition:** Table > 10M rows or > 100GB. Don't partition small tables.
`,

  commonMistakes: `# Common Mistakes — Partitioning

1. **Partitioning small tables** — adds overhead with no benefit. Only partition large tables.
2. **Wrong partition key** — if queries don't filter on partition key, no pruning occurs.
3. **Forgetting unique constraint limitation** — unique indexes must include partition key.
4. **Too many partitions** — thousands of partitions slow planning. Keep it reasonable (hundreds).
5. **Not automating partition creation** — new data arrives, no partition exists → goes to DEFAULT or fails.
6. **Ignoring maintenance** — old partitions should be archived/dropped regularly.
7. **Cross-partition joins** — joining partitioned tables without partition key is expensive.
`,

  revision: `# Partitioning — Quick Revision

| Type | Splits By | Best For |
|------|-----------|----------|
| Horizontal | Rows (by range/list/hash) | Large tables, time-series |
| Vertical | Columns | Tables with large blobs |

| Strategy | Key | Pruning | Use Case |
|----------|-----|--------|----------|
| Range | Date/number | Yes (range queries) | Time-series data |
| List | Discrete values | Yes (exact match) | Geographic data |
| Hash | Hash of key | No (point queries only) | Even distribution |

## Key Benefits
- Query performance (partition pruning)
- Data lifecycle (DROP PARTITION is instant)
- Parallel scans across partitions
- Storage tiering (old partitions on cheaper disk)
`,

  codeExamples: [
    {
      language: 'sql',
      label: 'PostgreSQL — Automated Partitioning',
      code: `-- Function to create next month's partition automatically
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
    next_month DATE;
    partition_name TEXT;
BEGIN
    next_month := date_trunc('month', CURRENT_DATE + INTERVAL '1 month');
    partition_name := 'orders_' || to_char(next_month, 'YYYYMM');

    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF orders
         FOR VALUES FROM (%L) TO (%L)',
        partition_name,
        next_month,
        next_month + INTERVAL '1 month'
    );
END;
$$ LANGUAGE plpgsql;

-- Schedule via pg_cron
SELECT cron.schedule(
    'create_partition_monthly',
    '0 0 25 * *',  -- 25th of each month at midnight
    'SELECT create_monthly_partition()'
);`,
    },
  ],

  resources: [
    { title: 'PostgreSQL Partitioning', url: 'https://www.postgresql.org/docs/current/ddl-partitioning.html', type: 'docs', free: true },
    { title: 'MySQL Partitioning', url: 'https://dev.mysql.com/doc/refman/8.0/en/partitioning.html', type: 'docs', free: true },
    { title: 'Partitioning vs Sharding — PG Wiki', url: 'https://wiki.postgresql.org/wiki/Table_partitioning', type: 'article', free: true },
    { title: 'ByteByteGo — Partitioning', url: 'https://bytebytego.com', type: 'video', free: false },
  ],

  quiz: [
    { id: 'part-q1', question: 'What is the main difference between partitioning and sharding?', options: ['Partitioning is faster', 'Partitioning is within one DB; sharding is across multiple DBs', 'Sharding is always better', 'They are identical'], correctIndex: 1, explanation: 'Partitioning splits a table within a single database (same machine or cluster). Sharding distributes data across multiple independent database instances on different machines.' },
    { id: 'part-q2', question: 'What is partition pruning?', options: ['Deleting old partitions', 'The optimizer skipping partitions that cannot contain matching rows', 'Compressing partition data', 'Splitting partitions into smaller ones'], correctIndex: 1, explanation: 'Partition pruning is when the query optimizer eliminates partitions that cannot contain rows matching the WHERE clause, reducing the scan to only relevant partitions.' },
    { id: 'part-q3', question: 'Which partitioning strategy is best for a time-series log table?', options: ['Hash partitioning', 'List partitioning', 'Range partitioning by date', 'Vertical partitioning'], correctIndex: 2, explanation: 'Range partitioning by date is ideal for time-series data. It enables partition pruning for date-range queries and easy data lifecycle management (DROP old partitions).' },
    { id: 'part-q4', question: 'Why must unique indexes on partitioned tables include the partition key?', options: ['For performance', 'Because each partition enforces uniqueness independently', 'It is optional', 'To enable pruning'], correctIndex: 1, explanation: 'Each partition has its own index. Without the partition key in the unique index, the database cannot determine which partition to check for duplicates, so it would need to scan all partitions for every insert.' },
  ],

  questions: [],
};
