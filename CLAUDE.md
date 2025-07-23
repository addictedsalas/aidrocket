# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Aid Rocket - Claude Development Guide

## Project Overview
Aid Rocket is a no-BS home-buying advisor that provides honest breakdowns of cash-to-close, monthly payments, and assistance programs through an AI "Down-Payment Guru".

**Vision**: One input, one minute, one truth.

## Tech Stack
- **Frontend**: Next.js 15.4.3, React 18.3.0, TypeScript, Tailwind CSS 3.4.15 (Airbnb-style glass-morphism)
- **Backend**: Next.js API Routes (no separate Express server)
- **API**: tRPC 11.0.0-rc.553 (end-to-end typed)
- **Auth**: Clerk 6.11.8
- **Database**: Supabase (PostgreSQL) with Drizzle ORM 0.36.4
- **Storage**: Vercel Blob (for programs.csv)
- **AI**: OpenAI 4.73.0 GPT-4o
- **Hosting**: Vercel (all-in-one)
- **External APIs**: MortgageNewsDaily/FRED for rates
- **Email/PDF**: Resend + react-pdf

## Key Features
1. **Listing Intake**: Parse Zillow, Redfin, Realtor links with logo detection
2. **AI Down-Payment Guru**: GPT-4o powered program discovery with CSV catalog
3. **Scenario Calculator**: MIN_CASH, BALANCED 10%, AGGRESSIVE 15-yr scenarios
4. **Results UI**: Cards with provider logos, payment timelines, PDF export
5. **Auth Limits**: 1 anon property, 5 logged-in properties

## Development Commands
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build
npm run build

# Database commands
npm run db:generate    # Generate Drizzle types
npm run db:push        # Push schema to Supabase
npm run db:studio      # Open Drizzle Studio

# Linting & Type checking
npm run lint
npm run typecheck
```

## Project Structure
```
aid-rocket/
├── src/
│   ├── app/                 # Next.js 14 app directory
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configurations
│   ├── server/              # tRPC server and API logic
│   ├── styles/              # Tailwind CSS and global styles
│   └── types/               # TypeScript type definitions
├── drizzle/                 # Database schema and migrations
├── public/                  # Static assets
└── docs/                    # Documentation
```

## Environment Variables Needed
- `DATABASE_URL` - Supabase PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key
- `OPENAI_API_KEY` - OpenAI GPT-4o API key
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `RESEND_API_KEY` - Resend email service key

## Success Metrics (Day 14)
- End-to-end completion rate: ≥60%
- PDF exports per active user: ≥0.25
- New program rows auto-captured: ≥15/week

## Current Implementation Status

### ✅ **COMPLETED (Foundation)**
- **Project Setup**: Next.js 15, React 18, TypeScript, Tailwind CSS with glass-morphism design
- **Database Schema**: Complete Drizzle ORM schema (users, properties, analyses, shareLinks)
- **tRPC API**: Full server setup with authentication context and property router
- **Authentication Framework**: Clerk integration in tRPC context (NOT yet in layout)
- **UI System**: Landing page with chat interface and suggestion cards
- **Development Tools**: All npm scripts functional (dev, build, lint, typecheck, db commands)

### ⚠️ **CRITICAL SETUP REQUIRED**
1. **Provider Integration**: Layout missing ClerkProvider and TrpcProvider wrappers
2. **Database Initialization**: Run `npm run db:push` to create actual tables in Supabase
3. **Environment Variables**: Set up actual API keys per `.env.local.example`

### ❌ **NOT IMPLEMENTED (Core Features)**
- Listing parser implementation (property.parseUrl is placeholder)
- Questionnaire wizard and React Hook Form components
- AI Down-Payment Guru and OpenAI integration
- Scenario calculator logic and mortgage utilities
- Results display components and PDF generation
- External API integrations (SerpAPI, MortgageNewsDaily, Resend)

## Architecture Details

### tRPC API Structure
- **Context**: `src/server/context.ts` provides database connection and Clerk user authentication
- **Main Router**: `src/server/routers/_app.ts` combines all feature routers
- **Property Router**: `src/server/routers/property.ts` handles CRUD for properties table
  - `property.create` - Create new property with Zod validation
  - `property.getById` - Fetch single property by ID
  - `property.getUserProperties` - Get all user properties with auth
  - `property.parseUrl` - Parse listing URLs (placeholder implementation)
- **Client Setup**: `src/lib/trpc.ts` configures React Query integration with Superjson transformer
- **API Route**: `src/app/api/trpc/[trpc]/route.ts` handles all tRPC endpoints

### Database Schema (Drizzle)
Located in `src/lib/db/schema.ts`:
- **users**: Clerk user integration with UUID primary keys
- **properties**: Property listings with source URL tracking
- **analyses**: User questionnaires with JSONB scenarios field
- **shareLinks**: Public sharing functionality for analyses
- Use `npm run db:studio` to inspect data, `npm run db:push` to sync schema changes

### Component Architecture
- **Providers**: `src/components/providers/TrpcProvider.tsx` wraps React Query (NOT yet integrated in layout)
- **Styling**: Custom glass-morphism components in `src/styles/globals.css`:
  - `.glass-container` - Main glass effect with backdrop blur
  - `.glass-button` - Interactive button styling
  - `.chat-container`, `.chat-input` - Conversational UI components
- **Theme**: Dark slate with brand colors defined in `tailwind.config.ts`
- **Layout**: Root layout in `src/app/layout.tsx` (missing provider integration)

### Key Development Patterns
- All database operations use Drizzle ORM with type inference
- API calls use tRPC hooks (useQuery, useMutation) for type safety
- Environment variables follow Next.js convention (NEXT_PUBLIC_ for client-side)
- Image optimization configured for Unsplash and Zillow domains in `next.config.js`

## Quick Start Setup

### 1. Fix Provider Integration (CRITICAL)
The app currently won't work due to missing providers in layout. Add to `src/app/layout.tsx`:
```tsx
import { ClerkProvider } from '@clerk/nextjs'
import TrpcProvider from '@/components/providers/TrpcProvider'

// Wrap children with both providers
```

### 2. Database Setup
```bash
npm run db:push    # Creates tables in Supabase
npm run db:studio  # Verify tables created
```

### 3. Environment Setup
Copy `.env.local.example` to `.env.local` and add real API keys.

## Notes
- Use Drizzle ORM for all database operations (type-safe SQL)
- Follow tRPC best practices for type-safe APIs
- Programs CSV stored in Vercel Blob, grows through AI Guru discoveries
- Keep solutions simple - single Next.js app (no separate backend)