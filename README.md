# HT Line Hooks API

A Node.js Express API application with TypeScript, comprehensive health check endpoints, and modern middleware setup.

## Features

- 🚀 Express.js 4.x with TypeScript
- 🛡️ Security with Helmet.js
- 📊 Comprehensive health check endpoints
- 🔒 CORS enabled
- 📝 Request logging with Morgan
- ⚡ Environment-based configuration
- 🔄 Hot reload with ts-node (development)
- 🏗️ Type-safe development with TypeScript
- 📨 **Line Webhook Integration** - Receive and process Line messaging events

## Health Check Endpoints

- `GET /health` - Basic health status
- `GET /health/detailed` - Detailed system information
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

## API Endpoints

- `GET /` - Welcome message with available endpoints
- `GET /api` - API information
- `GET /api/protected` - Sample protected endpoint
- `POST /api/data` - Sample data endpoint

## Line Webhook Endpoints

- `POST /line-webhook` - **Main webhook endpoint for Line messages**
- `GET /line-webhook/health` - Health check for Line webhook service

### Line Webhook Features

- **Message Events**: Text, image, video, audio, file, location, sticker
- **User Events**: Follow, unfollow
- **Group Events**: Join, leave, member joined/left
- **Interactive Events**: Postback, video play complete
- **Comprehensive Logging**: Detailed event processing with console output
- **Type Safety**: Full TypeScript interfaces for all Line event types
- **Error Handling**: Robust error handling with proper HTTP status codes

### Supported Line Event Types

| Event Type     | Description                                                 | Handler                     |
| -------------- | ----------------------------------------------------------- | --------------------------- |
| `message`      | Text, image, video, audio, file, location, sticker messages | ✅ Implemented              |
| `follow`       | User followed the bot                                       | ✅ Implemented              |
| `unfollow`     | User unfollowed the bot                                     | ✅ Implemented              |
| `join`         | Bot joined a group/room                                     | ✅ Implemented              |
| `leave`        | Bot left a group/room                                       | ✅ Implemented              |
| `postback`     | Postback action from rich menu                              | ✅ Implemented              |
| `memberJoined` | New member joined group                                     | 🔄 Ready for implementation |
| `memberLeft`   | Member left group                                           | 🔄 Ready for implementation |

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ht-line-hooks
```

2. Install dependencies:

```bash
pnpm install
```

## Usage

### Development Mode (TypeScript)

```bash
pnpm dev
```

### Production Mode (Compiled JavaScript)

```bash
pnpm build
pnpm start
```

### Build Commands

```bash
pnpm build        # Build TypeScript to JavaScript
pnpm build:watch  # Watch mode for development
pnpm clean        # Clean build artifacts
```

The server will start on port 3000 (or the port specified in your environment variables).

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

## Project Structure

```
ht-line-hooks/
├── src/                    # TypeScript source files
│   ├── app.ts             # Express app configuration
│   ├── server.ts          # Server entry point
│   ├── config/
│   │   └── config.ts      # Configuration management
│   └── routes/
│       ├── health.ts      # Health check routes
│       ├── api.ts         # Main API routes
│       └── line-webhook.ts # Line webhook routes
├── dist/                   # Compiled JavaScript (generated)
├── tsconfig.json          # TypeScript configuration
├── package.json           # Updated with TypeScript scripts
└── README.md              # Updated documentation
```

## Available Scripts

- `pnpm dev` - Start development server with ts-node (TypeScript)
- `pnpm build` - Compile TypeScript to JavaScript
- `pnpm start` - Start production server (compiled JavaScript)
- `pnpm build:watch` - Watch mode for TypeScript compilation
- `pnpm clean` - Clean build artifacts
- `pnpm test` - Run tests (to be implemented)

## TypeScript Features

- **Strict Type Checking** - Full type safety with strict TypeScript configuration
- **Interface Definitions** - Well-defined interfaces for all API responses
- **Type Safety** - Compile-time error checking for better code quality
- **Source Maps** - Debug TypeScript code directly in development
- **Declaration Files** - Generated `.d.ts` files for type definitions
- **Line Webhook Types** - Comprehensive TypeScript interfaces for Line events

## Line Webhook Usage

### Setting Up Line Webhook

1. **Configure Line Bot**: Set your webhook URL to `https://yourdomain.com/line-webhook`
2. **Verify Endpoint**: Test with `GET /line-webhook/health`
3. **Send Messages**: Line will POST events to `POST /line-webhook`

### Sample Webhook Payload

```json
{
  "destination": "your-bot-id",
  "events": [
    {
      "type": "message",
      "mode": "active",
      "timestamp": 1234567890,
      "source": {
        "type": "user",
        "userId": "user123"
      },
      "webhookEventId": "event123",
      "deliveryContext": {
        "isRedelivery": false
      },
      "replyToken": "reply123",
      "message": {
        "id": "msg123",
        "type": "text",
        "text": "Hello, bot!"
      }
    }
  ]
}
```

### Testing the Webhook

```bash
# Test health endpoint
curl http://localhost:3000/line-webhook/health

# Test webhook with sample payload
curl -X POST http://localhost:3000/line-webhook \
  -H "Content-Type: application/json" \
  -d '{"destination":"test","events":[{"type":"message","mode":"active","timestamp":1234567890,"source":{"type":"user","userId":"test"},"webhookEventId":"test","deliveryContext":{"isRedelivery":false}}]}'
```

### Customizing Event Handlers

The webhook includes placeholder functions for each event type. You can customize these in `src/routes/line-webhook.ts`:

```typescript
function handleMessageEvent(event: LineEvent): void {
  if (event.message && event.type === "message") {
    const message = event.message;

    switch (message.type) {
      case "text":
        // Add your text message processing logic here
        console.log(`Processing text: ${(message as LineTextMessage).text}`);
        break;
      // ... other message types
    }
  }
}
```

## Health Check Usage

### Kubernetes/Container Health Checks

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Load Balancer Health Checks

- **Path**: `/health`
- **Expected Response**: `200 OK` with status: "OK"

## Development Workflow

1. **Development**: Use `pnpm dev` for hot reload with ts-node
2. **Building**: Use `pnpm build` to compile TypeScript to JavaScript
3. **Production**: Use `pnpm start` to run the compiled JavaScript
4. **Type Checking**: TypeScript compiler will catch errors during build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes in TypeScript
4. Ensure the project builds successfully (`pnpm build`)
5. Add tests if applicable
6. Submit a pull request

## License

ISC
