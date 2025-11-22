# Terminal Portfolio Website

## Overview

This is an interactive terminal-style portfolio website that simulates a Linux CLI experience in the browser. Users navigate the portfolio by typing terminal commands (like `help`, `about`, `resume`, etc.) in an authentic bash/zsh-inspired interface. The application features a retro-modern aesthetic combining classic terminal emulator design with contemporary web polish.

The project is built as a full-stack TypeScript application with a React frontend and Express backend, styled with Tailwind CSS and shadcn/ui components configured for a dark terminal theme with green accent colors.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- Component architecture centered around a single Terminal component that handles all CLI interactions

**UI Component Library**
- shadcn/ui (Radix UI primitives) configured with "new-york" style preset
- Custom terminal-inspired theme with dark background (#0d0d0d) and green accent (#00ff00)
- Monospace typography using JetBrains Mono, Fira Code, or Source Code Pro
- Tailwind CSS with custom configuration for terminal aesthetics

**State Management**
- TanStack Query (React Query) for server state management
- Local React state for terminal command history and output
- Custom hooks for mobile detection and toast notifications

**Design System**
- Terminal-first design approach mimicking iTerm2/Hyper/GNOME Terminal aesthetics
- Minimal spacing system (1, 2, 4, 8 Tailwind units) for terminal density
- Monospace font at single weight with color/opacity for hierarchy
- Full viewport terminal window with optional chrome (titlebar with traffic light buttons)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- Dual-mode server setup: development (with Vite middleware) and production (serving static files)
- RESTful API design pattern

**Development vs Production**
- `index-dev.ts`: Runs Vite dev server with HMR, reloads index.html on each request for development
- `index-prod.ts`: Serves pre-built static files from dist/public directory
- Conditional Replit plugins (@replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner) only in development

**API Structure**
- GET `/api/resume`: Retrieves resume data
- POST `/api/resume`: Updates/creates resume data with validation
- All API routes prefixed with `/api` for clear separation from frontend routes

**Path Resolution**
- TypeScript path aliases: `@/*` (client), `@shared/*` (shared), `@assets/*` (assets)
- Vite configured to resolve these aliases at build time
- Strict filesystem access in development for security

### Data Storage Solutions

**Current Implementation**
- In-memory storage via `MemStorage` class
- Simple key-value storage for resume content
- No persistence between server restarts

**Database Schema (Configured but Not Active)**
- Drizzle ORM configured for PostgreSQL with Neon serverless driver
- `resumes` table schema defined with:
  - `id`: UUID primary key (auto-generated)
  - `content`: Text field for resume content
  - `updatedAt`: Timestamp with automatic default
- Migration files configured to output to `./migrations` directory
- Schema defined in `shared/schema.ts` for type sharing between client and server

**Data Validation**
- Zod schemas generated from Drizzle schema via drizzle-zod
- Runtime validation on API endpoints using `insertResumeSchema`
- Type inference for TypeScript from Drizzle schema

### Authentication and Authorization

Currently not implemented. The application is a public portfolio site with no authentication requirements.

### External Dependencies

**UI Component Library**
- Radix UI primitives (23+ component packages) for accessible, unstyled UI components
- shadcn/ui configuration and component patterns
- class-variance-authority for component variant management
- Tailwind CSS with PostCSS for styling

**Development Tools**
- Vite with React plugin for fast development and HMR
- tsx for running TypeScript files directly in Node.js
- esbuild for production server bundling
- Replit-specific plugins for development experience (cartographer, dev-banner, runtime-error-modal)

**Database & ORM** (Configured)
- Drizzle ORM with drizzle-kit for schema management
- @neondatabase/serverless for PostgreSQL connection
- connect-pg-simple for session storage (installed but not used)

**State & Data Fetching**
- TanStack Query v5 for server state management
- Custom query client with disabled refetching and infinite stale time
- Fetch API wrapper with error handling and JSON response parsing

**Routing & Forms**
- Wouter for client-side routing (lightweight alternative to React Router)
- React Hook Form with Hookform Resolvers for form management

**Utilities**
- date-fns for date manipulation
- clsx and tailwind-merge (via cn utility) for conditional className management
- nanoid for unique ID generation

**Type Safety**
- TypeScript with strict mode enabled
- Shared types between client and server via `shared/` directory
- Zod for runtime validation and type inference