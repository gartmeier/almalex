# Almalex Frontend

React-based web application providing an intuitive chat interface for exploring Swiss legal information.

## Features

- **Chat Interface**: Streaming responses with markdown support
- **Multi-language**: German (default), French, and English interfaces
- **Real-time Updates**: Server-sent events for streaming AI responses
- **Responsive Design**: Mobile-optimized with Tailwind CSS
- **Error Tracking**: Integrated Sentry monitoring
- **Type Safety**: Full TypeScript with auto-generated API client

## Tech Stack

- **Framework**: React Router v7 (client-side only)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with Radix UI components
- **State**: React hooks with context providers
- **i18n**: i18next for internationalization
- **Build**: Vite
- **Monitoring**: Sentry

## Prerequisites

- Node.js 20+
- pnpm package manager
- Backend API running on http://localhost:8000

## Installation

1. Install dependencies:

```bash
pnpm install
```

2. Generate API client (requires backend running):

```bash
pnpm generate-client
```

## Development

### Start development server

```bash
# Start with hot module replacement at http://localhost:5173
pnpm dev
```

### Build for production

```bash
# Type checking
pnpm typecheck

# Create production build
pnpm build

# Serve production build
pnpm start
```

### Code quality

```bash
# Format code with Prettier
pnpm format

# Type checking with React Router type generation
pnpm typecheck
```

## Architecture

### Routing Structure

- Client-side routing without SSR (`ssr: false`)
- All routes nested under `layout.tsx` wrapper
- Language-specific routes: `/de/*`, `/en/*`, `/fr/*`
- Dynamic chat routes: `/chat/:chatId`

### Key Components

- **Layout** (`routes/layout.tsx`): Main app wrapper with header
- **Chat** (`routes/chat.tsx`): Chat interface with SSE streaming
- **MessageList**: Renders chat messages with markdown
- **MessageInput**: Text input with auto-resize
- **LanguageSelector**: Language switcher component

### API Integration

- Auto-generated TypeScript client from OpenAPI spec
- Proxied through Vite dev server (`/api/*` → `http://localhost:8000`)
- Server-sent events for streaming responses
- Type-safe API calls with `@hey-api/client-fetch`

### Internationalization

- Browser language detection (cookie → navigator)
- Supported languages: German (default), French, English
- Translation files in `app/locales/*.json`
- Dynamic route updates based on selected language

## Project Structure

```
frontend/
├── app/
│   ├── components/      # React components
│   │   ├── ui/          # Radix UI primitives
│   │   └── layout/      # Layout components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and API client
│   │   └── api/         # Generated API client
│   ├── locales/         # Translation files
│   └── routes/          # React Router routes
├── build/               # Production build output
├── public/              # Static assets
└── CLAUDE.md           # AI assistant instructions
```

## Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t almalex-frontend .

# Run container
docker run -p 3000:3000 almalex-frontend
```

## Environment Variables

The frontend uses these environment variables (set at build time):

- `VITE_SENTRY_DSN`: Sentry error tracking DSN (optional)
- API proxy is configured in `vite.config.ts` for development

## License

See parent repository for license information.
