import type { TopicContent } from '../../types';

export const apiGatewayContent: TopicContent = {
  slug: 'system-design/api-gateway',
  title: 'API Gateway',
  category: 'system-design',
  theory: `# API Gateway

## What is an API Gateway?

An API Gateway is a server that acts as the single entry point for all client requests. It routes requests to the appropriate backend service, and handles cross-cutting concerns like authentication, rate limiting, caching, and request transformation.

## Architecture

\`\`\`
                    ┌─────────────────────────────────────┐
                    │          API Gateway                 │
  Client ─────────▶│                                      │
  Request          │  ┌──────────────────────────────┐   │
                   │  │  Auth │ Rate Limit │ Transform│   │
                   │  └──────────┬───────────────────┘   │
                   │             │ Routing               │
                   └─────────────┼──────────────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
      ┌────▼────┐         ┌──────▼──────┐         ┌─────▼─────┐
      │  User   │         │   Order     │         │  Payment  │
      │ Service │         │   Service   │         │  Service  │
      └─────────┘         └─────────────┘         └───────────┘
\`\`\`

## API Gateway vs Reverse Proxy

| Aspect | Reverse Proxy (NGINX) | API Gateway (Kong, APISIX) |
|--------|----------------------|---------------------------|
| Primary role | Forward HTTP requests | Full API lifecycle management |
| Auth | Basic | OAuth, JWT, API keys, mTLS |
| Plugins | Limited | Rich plugin ecosystem |
| Request transform | Headers only | Body, headers, query params |
| Analytics | Access logs | Per-API metrics, dashboards |
| API versioning | Manual | Built-in |
| Rate limiting | Basic | Per-consumer, per-API |

## Core Responsibilities

### 1. Request Routing
Route requests to the correct backend service based on URL path, method, or headers.

\`\`\`
GET  /api/v1/users     ──▶  User Service
POST /api/v1/orders     ──▶  Order Service
GET  /api/v1/products   ──▶  Catalog Service
\`\`\`

### 2. Authentication & Authorization
Validate JWT tokens, API keys, or OAuth tokens before forwarding to backends.

\`\`\`
Client ──▶ [API Gateway: Validate JWT] ──▶ Backend (trusts gateway)
\`\`\`

### 3. Rate Limiting
Per-consumer, per-API, or per-IP rate limiting to protect backends.

### 4. Request/Response Transformation
- Add/remove headers
- Transform request body (e.g., XML → JSON)
- Aggregate responses from multiple services

### 5. Caching
Cache responses to reduce backend load and improve latency.

### 6. Load Balancing
Distribute traffic across multiple instances of the same service.

### 7. Protocol Translation
Translate between HTTP/REST and gRPC, WebSocket, or SOAP.

## API Gateway Patterns

### Backend for Frontend (BFF)

\`\`\`
┌─────────┐     ┌──────────────┐     ┌──────────┐
│ Mobile  │────▶│  Mobile BFF  │────▶│ Services │
│ App     │     │  (Gateway)   │     └──────────┘
└─────────┘     └──────────────┘

┌─────────┐     ┌──────────────┐     ┌──────────┐
│ Web     │────▶│  Web BFF    │────▶│ Services │
│ Browser │     │  (Gateway)   │     └──────────┘
└─────────┘     └──────────────┘
\`\`\`

Each frontend gets its own gateway tailored to its needs — no over-fetching or under-fetching.

### Request Aggregation

\`\`\`
Client requests /api/dashboard
         │
    ┌────▼────┐
    │ Gateway │──▶ User Service    (get profile)
    │         │──▶ Order Service   (get recent orders)
    │         │──│ Stats Service   (get metrics)
    │         │  └── Combine all responses
    └─────────┘
         │
    Client receives single aggregated response
\`\`\`

Reduces client-side round-trips from N to 1.

## Popular API Gateway Solutions

| Solution | Type | Key Feature |
|----------|------|-------------|
| Kong | Open-source / Enterprise | Lua plugins, PostgreSQL-backed |
| Apache APISIX | Open-source | High performance, dynamic routing |
| AWS API Gateway | Cloud (AWS) | Serverless, Lambda integration |
| Tyk | Open-source | Go-based, lightweight |
| NGINX Plus | Commercial | Enterprise features on NGINX |
| Envoy | Open-source | Service mesh + gateway, gRPC-native |
`,

  examples: `# API Gateway — Practical Examples

## Kong Gateway Configuration

\`\`\`yaml
# Add a service
curl -X POST http://localhost:8001/services \\
  -d "name=user-service" \\
  -d "url=http://user-service:3000"

# Add a route
curl -X POST http://localhost:8001/services/user-service/routes \\
  -d "paths[]=/api/users"

# Add JWT authentication plugin
curl -X POST http://localhost:8001/routes/user-route/plugins \\
  -d "name=jwt"

# Add rate limiting plugin
curl -X POST http://localhost:8001/routes/user-route/plugins \\
  -d "name=rate-limiting" \\
  -d "config.minute=100"
\`\`\`

## AWS API Gateway (Serverless)

\`\`\`yaml
# SAM template
Resources:
  ApiGateway:
    Type: AWS::Serverless::Api
    Properties:
      StageName: prod
      Auth:
        DefaultAuthorizer: MyCognitoAuth
        Authorizers:
          MyCognitoAuth:
            UserPoolArn: !GetAtt CognitoUserPool.Arn

  GetUserFunction:
    Type: AWS::Serverless::Function
    Properties:
      Events:
        GetUser:
          Type: Api
          Properties:
            RestApiId: !Ref ApiGateway
            Path: /users/{id}
            Method: GET
\`\`\`
`,

  patterns: `# API Gateway Patterns

## 1. Single Entry Point
All client requests go through one gateway. Simplifies client logic and centralizes cross-cutting concerns.

## 2. Backend for Frontend (BFF)
Each client type (mobile, web, partner API) gets its own gateway. Avoids over-fetching.

## 3. Request Aggregation
Gateway fetches data from multiple services and returns a single combined response. Reduces client round-trips.

## 4. Protocol Translation
Gateway translates HTTP/REST to gRPC, SOAP, or other protocols. Clients only need to speak HTTP.

## 5. Circuit Breaker
Gateway detects failing backends and stops forwarding requests, returning fallback responses.

## 6. Canary Release
Gateway routes a percentage of traffic to new service versions for gradual rollout.
`,

  interviewTips: `# Interview Tips — API Gateway

1. **When to use an API Gateway:** Multiple microservices, shared auth, rate limiting, or client-specific response shaping.
2. **BFF pattern:** Mention it when the interviewer asks about mobile vs web API differences.
3. **Single point of failure:** API Gateway is a SPOF — deploy multiple instances behind a load balancer.
4. **Performance overhead:** Gateway adds one network hop. Measure latency impact.
5. **Request aggregation:** Reduces client round-trips but increases gateway complexity and coupling.
6. **Popular solutions:** Kong, APISIX, AWS API Gateway, Envoy. Know at least one well.
`,

  commonMistakes: `# Common Mistakes — API Gateway

1. **Business logic in gateway** — keep it thin. Routing, auth, rate limiting only.
2. **No redundancy** — single gateway instance is a SPOF. Deploy at least 2 behind a LB.
3. **No timeout config** — slow backends can exhaust gateway connections. Set timeouts.
4. **Over-aggregating** — too much response merging creates tight coupling between services.
5. **Ignoring latency** — every hop adds latency. Monitor gateway response times.
6. **No caching** — repeated identical requests waste backend resources. Cache where appropriate.
7. **Not versioning APIs** — gateway should support multiple API versions simultaneously.
`,

  revision: `# API Gateway — Quick Revision

| Responsibility | Description |
|----------------|-------------|
| Routing | Path/method → backend service |
| Auth | JWT, API key, OAuth validation |
| Rate Limiting | Per-consumer, per-API limits |
| Transformation | Headers, body, protocol translation |
| Caching | Reduce backend load |
| Load Balancing | Distribute across instances |
| Aggregation | Combine multiple service responses |

## BFF Pattern
- Mobile BFF: minimal data, low bandwidth
- Web BFF: full data, richer responses
- Partner BFF: restricted APIs, separate auth

## Popular Solutions
- Kong, APISIX, AWS API Gateway, Envoy, Tyk
`,

  codeExamples: [
    {
      language: 'yaml',
      label: 'Kong — declarative config',
      code: `# kong.yml
_format_version: "3.0"

services:
  - name: user-service
    url: http://user-service:3000
    routes:
      - name: users
        paths: ["/api/users"]
        strip_path: false
    plugins:
      - name: jwt
      - name: rate-limiting
        config:
          minute: 100

  - name: order-service
    url: http://order-service:3000
    routes:
      - name: orders
        paths: ["/api/orders"]
        strip_path: false
    plugins:
      - name: key-auth`,
    },
    {
      language: 'typescript',
      label: 'Express — Custom Gateway',
      code: `import express from 'express';
import jwt from 'express-jwt';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Global rate limiting
app.use(rateLimit({ windowMs: 60000, max: 100 }));

// JWT auth on /api routes
app.use('/api', jwt({ secret: process.env.JWT_SECRET }));

// Route to user service
app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3000',
  changeOrigin: true,
}));

// Route to order service
app.use('/api/orders', createProxyMiddleware({
  target: 'http://order-service:3000',
  changeOrigin: true,
}));

app.listen(8080);`,
    },
  ],

  resources: [
    { title: 'Kong Documentation', url: 'https://docs.konghq.com/', type: 'docs', free: true },
    { title: 'Apache APISIX Docs', url: 'https://apisix.apache.org/docs/', type: 'docs', free: true },
    { title: 'AWS API Gateway', url: 'https://docs.aws.amazon.com/apigateway/', type: 'docs', free: true },
    { title: 'API Gateway Pattern — Microsoft', url: 'https://learn.microsoft.com/en-us/azure/architecture/microservices/design/gateway', type: 'article', free: true },
    { title: 'ByteByteGo — API Gateway', url: 'https://bytebytego.com', type: 'video', free: false },
  ],

  quiz: [
    { id: 'apigw-q1', question: 'What is the primary role of an API Gateway?', options: ['Store API documentation', 'Act as a single entry point routing requests to backend services', 'Replace all backend services', 'Generate API client code'], correctIndex: 1, explanation: 'An API Gateway is the single entry point for all client requests. It routes to backends and handles cross-cutting concerns like auth, rate limiting, and transformation.' },
    { id: 'apigw-q2', question: 'What is the Backend for Frontend (BFF) pattern?', options: ['One gateway for all clients', 'A separate gateway for each frontend client type', 'Backend runs in the frontend', 'Frontend acts as the gateway'], correctIndex: 1, explanation: 'BFF provides a dedicated API gateway for each client type (mobile, web, partner). Each gateway returns only the data that specific client needs.' },
    { id: 'apigw-q3', question: 'What is request aggregation in an API Gateway?', options: ['Bundling multiple API versions', 'Fetching data from multiple services and returning a combined response', 'Aggregating log files', 'Combining multiple gateways into one'], correctIndex: 1, explanation: 'Request aggregation lets the gateway fetch from multiple backend services in parallel and return a single combined response, reducing client round-trips.' },
    { id: 'apigw-q4', question: 'Why is an API Gateway a potential single point of failure?', options: ['It cannot scale', 'All traffic passes through it, so if it fails all services are unreachable', 'It stores all data', 'It requires a dedicated database'], correctIndex: 1, explanation: 'Since all client traffic flows through the gateway, a failure means all services become unreachable. Mitigate by deploying multiple instances behind a load balancer.' },
  ],

  questions: [],
};
