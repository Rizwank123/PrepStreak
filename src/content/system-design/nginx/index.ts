import type { TopicContent } from '../../types';

export const nginxContent: TopicContent = {
  slug: 'system-design/nginx',
  title: 'NGINX',
  category: 'system-design',
  theory: `# NGINX — High-Performance Web Server & Reverse Proxy

## What is NGINX?

NGINX is an open-source web server, reverse proxy, load balancer, and HTTP cache. It uses an event-driven, non-blocking architecture that handles tens of thousands of concurrent connections per worker process.

## Architecture

\`\`\`
                    ┌─────────────────────────────────────┐
                    │         NGINX Server                 │
                    │                                      │
  Client ─────────▶│  ┌──────────┐  ┌──────────────────┐   │
  Request          │  │  Worker  │  │  Reverse Proxy   │   │
                   │  │ Process  │─▶│  + Load Balancer │   │
                   │  │ (event   │  │                  │   │
                   │  │  loop)   │  └───────┬──────────┘   │
                   │  └──────────┘          │              │
                   └────────────────────────┼──────────────┘
                                          │
                    ┌─────────────────────┼─────────────┐
                    │                     │             │
               ┌────▼────┐          ┌─────▼────┐   ┌────▼────┐
               │ Backend │          │ Backend  │   │ Backend │
               │   #1    │          │   #2     │   │  #3    │
               └─────────┘          └──────────┘   └─────────┘
\`\`\`

## Event-Driven Model

Unlike Apache's process/thread-per-connection model, NGINX uses:

\`\`\`
┌──────────────────────────────────────────────┐
│              Master Process                  │
│  (reads config, binds ports, manages workers)│
└──────────┬───────────────────────────────────┘
           │
   ┌───────┼───────┐───────┐
   ▼       ▼       ▼       ▼
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ W1  │ │ W2  │ │ W3  │ │ W4  │  Each worker handles
│     │ │     │ │     │ │     │  thousands of connections
│ epoll│ │ epoll│ │ epoll│ │ epoll│  via event loop
└─────┘ └─────┘ └─────┘ └─────┘
\`\`\`

- Master process: starts workers, reloads config, manages lifecycle
- Worker processes: handle actual HTTP requests using epoll/kqueue
- Each worker can handle 10K+ concurrent connections
- No thread-per-connection overhead

## NGINX as Reverse Proxy

\`\`\`
Client ──▶ NGINX ──▶ Backend Server
         (port 80)  (port 3000, 8080, etc.)

Benefits:
- SSL termination at NGINX
- Backend servers stay private
- Request routing by URL path
- Response caching
- Rate limiting
\`\`\`

## Load Balancing Methods

| Method | Description |
|--------|-------------|
| Round Robin | Default — distributes evenly |
| Least Connections | Sends to server with fewest active connections |
| IP Hash | Same client always goes to same server (sticky) |
| Generic Hash | Hash on custom key (URL, header) |
| Random | Randomly pick a server |

\`\`\`
upstream backend {
    server 10.0.0.1:8080 weight=3;  # 3x more traffic
    server 10.0.0.2:8080 weight=1;
    server 10.0.0.3:8080 backup;    # only if others fail
}
\`\`\`

## Key Configuration

### Reverse Proxy
\`\`\`nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        root /var/www;
        expires 30d;
    }
}
\`\`\`

### SSL Termination
\`\`\`nginx
server {
    listen 443 ssl;
    server_name api.example.com;

    ssl_certificate     /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;

    location / {
        proxy_pass http://backend;
    }
}
\`\`\`

### Rate Limiting
\`\`\`nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

server {
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://backend;
    }
}
\`\`\`
`,

  examples: `# NGINX — Practical Examples

## Full Stack Reverse Proxy

\`\`\`nginx
upstream api_backend {
    least_conn;
    server 10.0.0.1:3000;
    server 10.0.0.2:3000;
    server 10.0.0.3:3000;
}

upstream web_backend {
    server 10.0.0.10:8080;
}

server {
    listen 80;
    server_name app.example.com;

    # API requests → API cluster
    location /api/ {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_connect_timeout 5s;
        proxy_read_timeout 30s;
    }

    # Everything else → Web server
    location / {
        proxy_pass http://web_backend;
    }

    # Static files served directly by NGINX
    location /static/ {
        root /var/www;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
\`\`\`

## Health Check Configuration

\`\`\`nginx
upstream backend {
    server 10.0.0.1:3000 max_fails=3 fail_timeout=30s;
    server 10.0.0.2:3000 max_fails=3 fail_timeout=30s;
}

# max_fails=3: after 3 failed attempts, mark server down
# fail_timeout=30s: retry after 30 seconds
\`\`\`
`,

  patterns: `# NGINX Patterns

## 1. Reverse Proxy Pattern
NGINX sits in front of backend servers, forwarding client requests. Handles SSL, caching, rate limiting.

## 2. Load Balancer Pattern
Distribute traffic across multiple backend instances using round-robin, least-conn, or IP-hash.

## 3. Static Content Server
NGINX serves static files (images, CSS, JS) directly — faster than application servers.

## 4. SSL Termination
NGINX handles HTTPS; backend communication is plain HTTP. Reduces CPU load on app servers.

## 5. API Gateway Pattern
NGINX routes requests by URL path to different backend services (/api/users → user service, /api/orders → order service).

## 6. Caching Proxy
Cache backend responses to reduce load and improve response time for repeated requests.
`,

  interviewTips: `# Interview Tips — NGINX

1. **Event-driven model:** NGINX uses epoll/kqueue — one worker handles 10K+ connections. Contrast with Apache's thread-per-connection.
2. **Reverse proxy vs forward proxy:** Reverse proxy sits in front of servers (client doesn't know backend). Forward proxy sits in front of clients.
3. **Load balancing algorithms:** Know round-robin (default), least-conn, IP-hash (sticky sessions). Mention health checks.
4. **SSL termination:** NGINX handles TLS, passes plain HTTP to backends. Reduces CPU on app servers.
5. **Rate limiting:** Use limit_req_zone with burst queue. Mention nodelay vs delay modes.
6. **Mention worker_processes:** Set to auto (matches CPU cores) or manually to CPU count.
`,

  commonMistakes: `# Common Mistakes — NGINX

1. **worker_processes too low** — default is 1. Set to auto or CPU core count.
2. **No proxy_set_header** — backend sees NGINX's IP, not client's. Always set X-Real-IP and X-Forwarded-For.
3. **No timeouts** — default proxy_read_timeout is 60s. Long-running backends may need more.
4. **Not using upstream** — hardcoding proxy_pass to one server means no load balancing or failover.
5. **Serving static files through app server** — NGINX is faster at static files. Use location blocks with root.
6. **No buffering** — disable proxy_buffering for streaming, enable for everything else.
7. **Forgetting reload** — after config changes, run nginx -s reload (zero downtime).
`,

  revision: `# NGINX — Quick Revision

| Concept | Key Point |
|---------|-----------|
| Architecture | Event-driven, non-blocking, worker processes |
| Reverse Proxy | Sits in front of backends, SSL termination |
| Load Balancing | Round-robin, least-conn, IP-hash |
| Static Serving | Faster than app servers for static files |
| Rate Limiting | limit_req_zone + burst |
| SSL | Termination at NGINX, plain HTTP to backend |
| Health Checks | max_fails + fail_timeout |
| Config Reload | nginx -s reload (zero downtime) |

## Worker Model
- 1 master process → N worker processes (N = CPU cores)
- Each worker: epoll event loop, 10K+ connections
- Master: config, port binding, worker lifecycle
`,

  codeExamples: [
    {
      language: 'nginx',
      label: 'NGINX Config — Full Setup',
      code: `# /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 10240;

http {
    upstream api_backend {
        least_conn;
        server 10.0.0.1:3000;
        server 10.0.0.2:3000;
    }

    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    server {
        listen 443 ssl http2;
        server_name api.example.com;

        ssl_certificate /etc/ssl/cert.pem;
        ssl_certificate_key /etc/ssl/key.pem;

        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://api_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /static/ {
            root /var/www;
            expires 30d;
        }
    }
}`,
    },
  ],

  resources: [
    { title: 'NGINX Official Documentation', url: 'https://nginx.org/en/docs/', type: 'docs', free: true },
    { title: 'NGINX Complete Guide', url: 'https://docs.nginx.com/nginx-admin-guide/', type: 'article', free: true },
    { title: 'NGINX Load Balancing', url: 'https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/', type: 'docs', free: true },
    { title: 'NGINX High Performance — ByteByteGo', url: 'https://bytebytego.com', type: 'video', free: false },
  ],

  quiz: [
    { id: 'nginx-q1', question: 'What makes NGINX able to handle tens of thousands of concurrent connections?', options: ['Thread-per-connection model', 'Event-driven, non-blocking I/O with epoll', 'It uses a massive thread pool', 'It caches all responses'], correctIndex: 1, explanation: 'NGINX uses an event-driven, non-blocking I/O model with epoll (Linux) or kqueue (BSD). Each worker process handles thousands of connections via a single event loop.' },
    { id: 'nginx-q2', question: 'Which load balancing method sends requests to the server with the fewest active connections?', options: ['Round Robin', 'IP Hash', 'Least Connections', 'Random'], correctIndex: 2, explanation: 'The least_conn directive sends each new request to the backend server with the fewest active connections, distributing load based on actual server load.' },
    { id: 'nginx-q3', question: 'What is SSL termination in NGINX?', options: ['NGINX disables SSL', 'NGINX handles HTTPS and passes plain HTTP to backends', 'Backend handles SSL, NGINX does not', 'SSL is terminated at the database'], correctIndex: 1, explanation: 'SSL termination means NGINX handles the TLS handshake and encryption, then forwards plain HTTP to backend servers. This reduces CPU load on application servers.' },
    { id: 'nginx-q4', question: 'What does the max_fails directive do in an upstream block?', options: ['Sets max request body size', 'Sets the number of failed attempts before marking a server down', 'Limits the number of workers', 'Sets the max number of connections'], correctIndex: 1, explanation: 'max_fails defines how many failed connection attempts to a server are allowed before it is marked as unavailable. Combined with fail_timeout for retry timing.' },
  ],

  questions: [],
};
