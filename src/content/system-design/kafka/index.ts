import type { TopicContent } from '../../types';

export const kafkaContent: TopicContent = {
  slug: 'system-design/kafka',
  title: 'Kafka',
  category: 'system-design',
  theory: `# Apache Kafka

## Core Concepts

**Topic** — logical channel. Messages are written to and read from topics.
**Partition** — topics are divided into partitions. Messages within a partition are ordered. Enables parallel consumption.
**Producer** — writes messages to topics.
**Consumer** — reads messages from topics.
**Consumer Group** — set of consumers sharing the load. Each partition assigned to one consumer per group.
**Offset** — position of a message in a partition. Consumer tracks its offset.
**Broker** — Kafka server. Cluster of brokers stores topics.
**ZooKeeper / KRaft** — coordination layer (ZK being replaced by KRaft).

## Retention

Messages retained for a configurable period (default 7 days) regardless of consumption. Multiple consumer groups can read independently.

## Ordering

Guaranteed within a partition. Not across partitions. Use partition key to route related events to same partition.

## Delivery Semantics

| Mode | Guarantee | Use Case |
|------|-----------|----------|
| At-most-once | May lose messages | Metrics |
| At-least-once | May duplicate | Default |
| Exactly-once | No loss/duplicate | Financial |

## Use Cases

- Event streaming / real-time pipelines
- Log aggregation
- Change Data Capture (CDC)
- Activity tracking
- Decoupling microservices
`,

  examples: `# Kafka — Examples

## Producer (Go using confluent-kafka-go)

\`\`\`go
p, _ := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": "localhost:9092"})
p.Produce(&kafka.Message{
    TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
    Value: []byte("order-created:" + orderID),
    Key: []byte(userID), // route to consistent partition
}, nil)
\`\`\`

## Consumer Group

\`\`\`go
c, _ := kafka.NewConsumer(&kafka.ConfigMap{
    "bootstrap.servers": "localhost:9092",
    "group.id": "order-processor",
    "auto.offset.reset": "earliest",
})
c.SubscribeTopics([]string{"orders"}, nil)
for {
    msg, _ := c.ReadMessage(-1)
    processOrder(msg.Value)
    c.CommitMessage(msg) // manual offset commit
}
\`\`\`
`,

  patterns: `# Kafka Patterns

## 1. Event Sourcing — Kafka as immutable event log
## 2. CQRS — separate write (events) and read (projections) stores
## 3. Outbox Pattern — write to DB + Kafka atomically
## 4. Saga Choreography — services react to events, emit next event
## 5. Dead Letter Queue — failed messages routed to separate topic for inspection
`,

  interviewTips: `# Interview Tips — Kafka

1. Explain: Kafka is a distributed log, not just a queue.
2. Partitions = parallelism. More partitions = more consumers.
3. Consumer group = competing consumers. Multiple groups = pub/sub.
4. For ordering guarantees: use partition key to route related events.
5. Discuss retention vs queue deletion — Kafka retains, traditional queues delete on ACK.
`,

  commonMistakes: `# Common Mistakes — Kafka

1. Expecting global ordering across partitions — only per-partition.
2. Too many partitions — increases coordination overhead.
3. Not setting partition key — loses ordering for related events.
4. Auto-committing offsets before processing — risk of data loss.
5. Consumer group rebalance storms — tune session.timeout.ms.
`,

  revision: `# Kafka — Quick Revision

| Concept | One-liner |
|---------|-----------|
| Topic | Named stream of events |
| Partition | Ordered sub-log, enables parallelism |
| Consumer Group | Load-balanced consumers sharing a topic |
| Offset | Position in partition; consumer tracks it |
| Retention | Messages kept regardless of consumption |
| Replication | Each partition has leader + replicas |
`,

  codeExamples: [],

  resources: [
    { title: 'Apache Kafka Docs', url: 'https://kafka.apache.org/documentation/', type: 'docs', free: true },
    { title: 'Kafka — ByteByteGo', url: 'https://bytebytego.com', type: 'video', free: false },
    { title: 'Kafka Design Patterns', url: 'https://www.confluent.io/learn/kafka-patterns/', type: 'article', free: true },
  ],

  quiz: [
    { id: 'kfk-q1', question: 'What determines the parallelism of Kafka consumers in a consumer group?', options: ['Number of brokers', 'Number of topics', 'Number of partitions', 'Number of messages'], correctIndex: 2, explanation: 'Each partition is assigned to exactly one consumer in a group. More partitions = more consumers can work in parallel.' },
    { id: 'kfk-q2', question: 'Kafka guarantees message ordering:', options: ['Globally across all topics', 'Across all partitions in a topic', 'Within a single partition', 'Only for consumer groups with one member'], correctIndex: 2, explanation: 'Messages within a partition are strictly ordered by offset. Ordering across partitions is not guaranteed.' },
    { id: 'kfk-q3', question: 'Multiple consumer groups reading the same topic results in:', options: ['Error', 'Only the first group receives messages', 'Each group receives all messages independently (pub/sub)', 'Messages are split between groups'], correctIndex: 2, explanation: 'Each consumer group maintains its own offset. All groups independently consume all messages — Kafka acts as a pub/sub system.' },
    { id: 'kfk-q4', question: 'The Outbox Pattern with Kafka solves what problem?', options: ['Slow consumers', 'Atomically writing to DB and publishing an event', 'Message ordering', 'Consumer group rebalancing'], correctIndex: 1, explanation: 'Write to DB and an outbox table atomically. A separate process reads from the outbox and publishes to Kafka — ensuring no event is lost even if Kafka is temporarily unavailable.' },
  ],

  questions: [],
};
