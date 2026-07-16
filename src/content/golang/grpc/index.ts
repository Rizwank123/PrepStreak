import type { TopicContent } from '../../types';

export const grpcContent: TopicContent = {
  slug: 'golang/grpc',
  title: 'gRPC',
  category: 'golang',
  theory: `# gRPC in Go

## What is gRPC?

RPC framework by Google. Uses HTTP/2 + Protocol Buffers. Strongly typed, language-agnostic, binary.

## vs REST

| | gRPC | REST |\n|-|------|------|\n| Protocol | HTTP/2 | HTTP/1.1 |\n| Serialisation | Protobuf (binary) | JSON (text) |\n| Performance | ~7x faster | Standard |\n| Streaming | Bidirectional | Server-sent events |\n| Browser support | Limited (grpc-web) | Full |\n| Contract | .proto IDL | OpenAPI |\n\n## Service Definition (.proto)\n\n\`\`\`protobuf\nsyntax = "proto3";\npackage user;\n\nservice UserService {\n    rpc GetUser(GetUserRequest) returns (GetUserResponse);\n    rpc StreamUsers(StreamRequest) returns (stream User);\n}\n\nmessage GetUserRequest { string id = 1; }\nmessage GetUserResponse { User user = 1; }\nmessage User { string id = 1; string name = 2; string email = 3; }\n\`\`\`\n\n## RPC Types\n\n1. **Unary** — single request, single response\n2. **Server streaming** — single request, stream of responses\n3. **Client streaming** — stream of requests, single response\n4. **Bidirectional streaming** — both sides stream\n\n## Interceptors (Middleware)\n\n\`\`\`go\nfunc loggingInterceptor(ctx context.Context, req any, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (any, error) {\n    start := time.Now()\n    resp, err := handler(ctx, req)\n    log.Printf("%s took %v: %v", info.FullMethod, time.Since(start), err)\n    return resp, err\n}\n\nserver := grpc.NewServer(grpc.UnaryInterceptor(loggingInterceptor))\n\`\`\`\n`,

  examples: `# gRPC — Examples

## Server Implementation

\`\`\`go
type userServer struct {
    pb.UnimplementedUserServiceServer
    db *sql.DB
}

func (s *userServer) GetUser(ctx context.Context, req *pb.GetUserRequest) (*pb.GetUserResponse, error) {
    var user pb.User
    err := s.db.QueryRowContext(ctx, "SELECT id, name FROM users WHERE id=$1", req.Id).
        Scan(&user.Id, &user.Name)
    if err == sql.ErrNoRows {
        return nil, status.Errorf(codes.NotFound, "user %s not found", req.Id)
    }
    return &pb.GetUserResponse{User: &user}, err
}

func main() {
    lis, _ := net.Listen("tcp", ":50051")
    srv := grpc.NewServer()
    pb.RegisterUserServiceServer(srv, &userServer{db: db})
    srv.Serve(lis)
}
\`\`\`
`,

  patterns: `# gRPC Patterns

## 1. Unary RPC — standard request/response\n## 2. Server streaming — real-time feeds, large result sets\n## 3. Interceptors — auth, logging, metrics (like HTTP middleware)\n## 4. Deadlines — always set deadline, don't default to infinite\n## 5. Status codes — use standard gRPC status codes (codes.NotFound, codes.InvalidArgument)`,

  interviewTips: `# Interview Tips — gRPC

1. gRPC is best for internal microservice communication; REST for public APIs.
2. Protobuf binary is ~7x smaller than JSON — important at scale.
3. HTTP/2 enables multiplexing — multiple RPCs over one connection.
4. Always embed UnimplementedXxxServer for forward compatibility.
5. Use grpc.status for typed error codes — not raw errors.
`,

  commonMistakes: `# Common Mistakes — gRPC

1. Not embedding UnimplementedXxxServer — breaks when new methods added.
2. Not setting deadlines — calls hang indefinitely.
3. Using plain error instead of status.Error — loses error codes.
4. Large protobuf messages — keep message sizes small for streaming.
5. Not securing with TLS — gRPC should use TLS in production.
`,

  revision: `# gRPC — Quick Revision

| gRPC Concept | HTTP Equivalent |\n|-------------|----------------|\n| Service | Controller |\n| RPC | Endpoint |\n| Proto message | Request/Response body |\n| Interceptor | Middleware |\n| status.Error | HTTP status code |\n| Metadata | HTTP headers |\n`,

  codeExamples: [{ language: 'go', label: 'gRPC Server with Interceptor', code: `func authInterceptor(ctx context.Context, req any, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (any, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok || len(md["authorization"]) == 0 {
		return nil, status.Error(codes.Unauthenticated, "missing auth token")
	}
	token := md["authorization"][0]
	if !validateToken(token) {
		return nil, status.Error(codes.Unauthenticated, "invalid token")
	}
	return handler(ctx, req)
}

func main() {
	lis, _ := net.Listen("tcp", ":50051")
	srv := grpc.NewServer(grpc.UnaryInterceptor(authInterceptor))
	pb.RegisterUserServiceServer(srv, &userServer{})
	srv.Serve(lis)
}` }],

  resources: [
    { title: 'gRPC Go Quickstart', url: 'https://grpc.io/docs/languages/go/quickstart/', type: 'docs', free: true },
    { title: 'Protocol Buffers Go', url: 'https://protobuf.dev/getting-started/gotutorial/', type: 'docs', free: true },
    { title: 'gRPC vs REST', url: 'https://www.geeksforgeeks.org/difference-between-rest-api-and-grpc/', type: 'article', free: true },
  ],

  quiz: [
    { id: 'grpc-q1', question: 'What serialization format does gRPC use by default?', options: ['JSON', 'XML', 'Protocol Buffers (protobuf)', 'MessagePack'], correctIndex: 2, explanation: 'gRPC uses Protocol Buffers (protobuf) for serialization — binary format that is typically 3-10x smaller than JSON and significantly faster to encode/decode.' },
    { id: 'grpc-q2', question: 'Which HTTP version does gRPC use?', options: ['HTTP/1.0', 'HTTP/1.1', 'HTTP/2', 'HTTP/3'], correctIndex: 2, explanation: 'gRPC requires HTTP/2, which enables multiplexing (multiple concurrent RPCs on one connection), header compression, and binary framing.' },
    { id: 'grpc-q3', question: 'Why embed UnimplementedXxxServer in gRPC server structs?', options: ['Required by Go compiler', 'Forward compatibility — new methods return "unimplemented" automatically', 'Performance optimization', 'Required for streaming'], correctIndex: 1, explanation: 'When new RPC methods are added to the proto, embedding UnimplementedXxxServer means your server returns codes.Unimplemented instead of compilation errors.' },
    { id: 'grpc-q4', question: 'gRPC interceptors are analogous to:', options: ['Proto messages', 'HTTP middleware', 'gRPC channels', 'Metadata'], correctIndex: 1, explanation: 'Interceptors wrap gRPC handlers to add cross-cutting concerns — auth, logging, metrics, tracing — exactly like HTTP middleware wraps handlers.' },
  ],

  questions: [],
};
