import type { TopicContent } from '../../types';

export const loadBalancerContent: TopicContent = {
  slug: 'system-design/load-balancer',
  title: 'Load Balancer',
  category: 'system-design',
  theory: `# Load Balancer

## Purpose

Distribute incoming traffic across multiple servers to maximise throughput, minimise latency, and prevent overload.

## L4 vs L7

**L4 (Transport Layer):** routes based on IP/TCP. Fast, no content inspection.
**L7 (Application Layer):** routes based on HTTP headers, cookies, URL path. More intelligent.

## Algorithms

| Algorithm | Description | Use When |
|-----------|-------------|----------|
| Round Robin | Distribute equally in order | Equal capacity servers |
| Weighted Round Robin | Weight by server capacity | Heterogeneous servers |
| Least Connections | Route to server with fewest active | Variable request duration |
| IP Hash | Same client always hits same server | Session affinity |
| Random | Random server selection | Simple, equal servers |

## Health Checks

Active probing (ping, HTTP request) to detect failed servers. Remove from rotation when unhealthy, re-add when healthy.

## Session Stickiness

Keep user routed to same server. Needed when session state is local (not in shared store). Implemented with cookies or IP hash.

## High Availability

Two load balancers: active-passive or active-active. Virtual IP (VIP) switches on failover.

## Examples

- **NGINX** — popular software load balancer / reverse proxy
- **HAProxy** — high-performance L4/L7
- **AWS ALB** — L7, managed
- **AWS NLB** — L4, managed
`,

  examples: `# Load Balancer — Examples

## NGINX Round-Robin Config

\`\`\`nginx
upstream backend {
    server server1.example.com;
    server server2.example.com;
    server server3.example.com;
}
server {
    location / {
        proxy_pass http://backend;
    }
}
\`\`\`

## NGINX Least Connections

\`\`\`nginx
upstream backend {
    least_conn;
    server server1.example.com;
    server server2.example.com;
}
\`\`\`

## NGINX Weighted

\`\`\`nginx
upstream backend {
    server server1.example.com weight=3;  # 3x more traffic
    server server2.example.com weight=1;
}
\`\`\`
`,

  patterns: `# Load Balancer Patterns

## 1. Horizontal Scaling Pattern
Add load balancer in front of stateless app servers. Scale servers independently.

## 2. Blue-Green Deployment
Route new traffic to green (new version). Switch instantly. Blue (old) stays for rollback.

## 3. Canary Release
Route 5% to new version, 95% to old. Gradually increase if metrics are healthy.

## 4. Geographic Load Balancing
Route users to nearest data center. Reduce latency globally.
`,

  interviewTips: `# Interview Tips — Load Balancer

1. Place load balancer in architecture diagrams proactively — don't wait to be asked.
2. Mention health checks — explains how failed servers are removed.
3. Discuss session stickiness trade-off: simplifies backend, but reduces scaling flexibility.
4. Know when to use L4 vs L7: L4 for pure throughput, L7 for content-based routing.
5. For system design, always add a load balancer between clients and servers.
`,

  commonMistakes: `# Common Mistakes — Load Balancer

1. Forgetting that load balancers can also be bottlenecks — they need HA too.
2. Not considering session state — stateless vs stateful applications.
3. Confusing load balancer with API gateway — LB is for traffic distribution, API GW for cross-cutting concerns.
4. Not mentioning health checks — critical for production reliability.
`,

  revision: `# Load Balancer — Quick Revision

## Algorithms: Round Robin → Weighted → Least Connections → IP Hash
## L4: fast, IP/port based | L7: smart, HTTP header based
## Session stickiness: cookies or IP hash
## HA: active-passive with VIP failover
`,

  codeExamples: [],

  resources: [
    { title: 'Load Balancing — ByteByteGo', url: 'https://bytebytego.com', type: 'video', free: false },
    { title: 'NGINX Load Balancing Docs', url: 'https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/', type: 'docs', free: true },
    { title: 'Load Balancer — GfG', url: 'https://www.geeksforgeeks.org/load-balancer-system-design/', type: 'article', free: true },
  ],

  quiz: [
    { id: 'lb-q1', question: 'Which load balancing algorithm is best for servers with variable request processing time?', options: ['Round Robin', 'IP Hash', 'Least Connections', 'Random'], correctIndex: 2, explanation: 'Least Connections routes to the server with fewest active connections — avoids overloading a server stuck on slow requests.' },
    { id: 'lb-q2', question: 'IP Hash ensures:', options: ['Even distribution', 'Same client always hits same server', 'Fastest server gets most traffic', 'Random distribution'], correctIndex: 1, explanation: 'IP Hash computes a hash of the client IP. The same IP always maps to the same server — useful for session affinity.' },
    { id: 'lb-q3', question: 'L7 load balancer routes based on:', options: ['IP address only', 'TCP port only', 'HTTP headers, URL, cookies', 'Random selection'], correctIndex: 2, explanation: 'L7 operates at the application layer, inspecting HTTP content for routing decisions — path-based routing, header-based routing, etc.' },
    { id: 'lb-q4', question: 'What is the purpose of health checks in a load balancer?', options: ['Measure latency', 'Detect and remove failed servers from rotation', 'Monitor traffic patterns', 'Rate limiting'], correctIndex: 1, explanation: 'Health checks probe servers periodically. Failed servers are removed from the pool; recovered servers are re-added — ensuring traffic only goes to healthy servers.' },
  ],

  questions: [],
};
