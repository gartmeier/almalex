# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `pnpm dev` - Starts React Router dev server with HMR at http://localhost:5173
- **Build**: `pnpm build` - Creates production build
- **Type checking**: `pnpm typecheck` - Runs React Router type generation and TypeScript compiler
- **Formatting**: `pnpm format` - Formats code with Prettier
- **API client generation**: `pnpm generate-client` - Generates API client from OpenAPI spec at http://localhost:8000/openapi.json

## Architecture Overview

### React Router v7 Configuration

- **SSR disabled**: `ssr: false` in react-router.config.ts - this is a client-side only application
- **Layout routing pattern**: Uses `layout()` wrapper in app/routes.ts with nested routes
- **Route structure**: All user-facing routes are nested under `routes/layout.tsx` layout component
- **File-based routing**: Routes defined explicitly in app/routes.ts, not convention-based

### Multi-language Support (i18n)

- **Client-side detection**: Uses i18next with browser language detection (localStorage → navigator)
- **Supported languages**: German (de, fallback), French (fr), English (en)
- **Language-specific routes**: Each language has its own route structure (`/de/faq`, `/en/faq`, `/fr/faq`)
- **Translation files**: Located in `app/locales/*.json`
- **Language switching**: Handled client-side via `i18n.changeLanguage()` in language selector

### Component Architecture

- **UI components**: Radix UI primitives with custom styling in `app/components/ui/`
- **Layout components**: Navigation and language selector in `app/components/layout/`
- **Styling**: TailwindCSS with Tailwind v4 using @tailwindcss/vite plugin
- **Icons**: Lucide React for icons

### Key Dependencies

- **React Router v7**: Latest routing solution, replacing Remix
- **React Query**: @tanstack/react-query for server state management
- **Sentry**: Error tracking and performance monitoring
- **OpenAPI client**: @hey-api/client-fetch for type-safe API calls

### Code Style Conventions

- **Variable declarations**: Use `let` unless it's a real constant
- **Function syntax**: Use `function foo() {}` syntax unless it's an inline event handler
- **Component exports**: Named exports with `export function ComponentName()`
- **File naming**: ALWAYS use kebab-case for filenames (e.g., `use-language-redirect.ts`, `navigation-menu.tsx`)

### API Integration

- **Backend proxy**: `/api/*` routes proxied to `http://localhost:8000` via Vite dev server
- **API client**: Auto-generated from OpenAPI spec using @hey-api/openapi-ts
- **Generated client location**: `app/lib/api/`

### Build and Deployment

- **Build output**: Uses React Router's build system generating `build/client/` and `build/server/`
- **Container ready**: Includes Docker configuration
- **Static assets**: Handled by Vite with sourcemap generation enabled
- **Start command**: `pnpm start` serves the built application

### Development Workflow

1. Backend API server should run on http://localhost:8000
2. Frontend dev server runs on http://localhost:5173
3. API calls are proxied from frontend to backend
4. Use `pnpm generate-client` when backend OpenAPI spec changes
5. Always run `pnpm typecheck` before committing changes

### Routing Gotchas

- Navigation component only renders within layout routes (not on root)
- Layout component includes header with navigation and language selector
- Route changes trigger client-side language detection
- Language-specific content URLs must match the detected language
