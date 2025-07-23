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
- **Auth**: NextAuth.js 4.24.8 (replaced Clerk for simplicity)
- **Database**: Supabase (PostgreSQL) with Drizzle ORM 0.36.4
- **Storage**: Vercel Blob (for programs.csv)
- **AI**: OpenAI 4.73.0 GPT-4o-mini (with function calling)
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
- `NEXTAUTH_SECRET` - NextAuth secret for JWT encryption
- `NEXTAUTH_URL` - Application URL for NextAuth callbacks
- `OPENAI_API_KEY` - OpenAI GPT-4o API key
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token
- `RESEND_API_KEY` - Resend email service key

## Success Metrics (Day 14)
- End-to-end completion rate: ≥60%
- PDF exports per active user: ≥0.25
- New program rows auto-captured: ≥15/week

## Current Implementation Status

### ✅ **COMPLETED (Major Features)**
- **Project Setup**: Next.js 15, React 18, TypeScript, Tailwind CSS with glass-morphism design
- **Database Schema**: Complete Drizzle ORM schema with NextAuth tables (users, accounts, sessions, properties, analyses, shareLinks)
- **Authentication**: Full NextAuth.js integration with Google provider and database sessions
- **Property Parser**: OpenAI GPT-4o-mini powered property parsing with function calling
- **Buyer Questionnaire**: 3-step wizard with React Hook Form, Zod validation, and progress tracking
- **tRPC API**: Complete server setup with property and analysis routers
- **UI System**: Landing page, property display, questionnaire components with glass-morphism design
- **Type Safety**: Full TypeScript integration throughout with proper error handling
- **Testing Components**: Test pages for parser (`/test-parser`) and questionnaire (`/test-questionnaire`)

### ⚠️ **READY FOR NEXT PHASE**
- Database initialized and working with NextAuth + property/analysis tables
- OpenAI integration functional for property parsing
- Foundation ready for AI Down-Payment Guru implementation

### ❌ **NOT IMPLEMENTED (Next Features)**
- AI Down-Payment Guru with CSV program catalog
- Scenario calculator logic (MIN_CASH, BALANCED, AGGRESSIVE)
- Results display components with payment breakdowns
- PDF generation and sharing functionality
- External API integrations (MortgageNewsDaily, Resend)

## Architecture Details

### tRPC API Structure
- **Context**: `src/server/context.ts` provides database connection (auth temporarily disabled for testing)
- **Main Router**: `src/server/routers/_app.ts` combines property and analysis routers
- **Property Router**: `src/server/routers/property.ts` handles property operations
  - `property.create` - Create new property with full validation
  - `property.getById` - Fetch single property by ID
  - `property.getUserProperties` - Get all user properties
  - `property.parseUrl` - **IMPLEMENTED**: OpenAI-powered property parsing from Zillow/Redfin/Realtor URLs
- **Analysis Router**: `src/server/routers/analysis.ts` handles buyer questionnaires
  - `analysis.create` - Save buyer profile and generate placeholder scenarios
  - `analysis.getById` - Fetch analysis with property relationship
- **Client Setup**: `src/lib/trpc.ts` configures React Query integration with Superjson transformer
- **API Route**: `src/app/api/trpc/[trpc]/route.ts` handles all tRPC endpoints

### Database Schema (Drizzle)
Located in `src/lib/db/schema.ts`:
- **NextAuth Tables**: `users`, `accounts`, `sessions`, `verificationTokens` for authentication
- **properties**: Complete property data with enhanced fields (sqft, yearBuilt, lotSize, propertyType, description)
- **analyses**: User questionnaires with buyer profile (income, household size, credit, veteran status, etc.)
- **shareLinks**: Public sharing functionality for analyses (ready for implementation)
- Use `npm run db:studio` to inspect data, `npm run db:push` to sync schema changes

### Component Architecture
- **Providers**: Fully integrated TrpcProvider and SessionProvider in root layout
- **Authentication**: NextAuth.js signin page at `/auth/signin` with Google provider
- **Main Components**:
  - `BuyerQuestionnaire.tsx` - 3-step wizard with React Hook Form validation
  - Property parsing integrated directly in homepage with loading states
- **Styling**: Custom glass-morphism components in `src/styles/globals.css`:
  - `.glass-container` - Main glass effect with backdrop blur
  - `.glass-button` - Interactive button styling
  - `.chat-container`, `.chat-input` - Conversational UI components
  - `.suggestion-card` - Hover effects for feature cards
- **Theme**: Dark slate with brand colors defined in `tailwind.config.ts`
- **Layout**: Root layout with proper provider integration and NextAuth session handling

### Key Development Patterns
- All database operations use Drizzle ORM with type inference
- API calls use tRPC hooks (useQuery, useMutation) for type safety
- Environment variables follow Next.js convention (NEXT_PUBLIC_ for client-side)
- Image optimization configured for Unsplash and Zillow domains in `next.config.js`

## Quick Start Setup

### 1. Environment Setup
Copy `.env.local.example` to `.env.local` and add:
```bash
DATABASE_URL="your-supabase-connection-string"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
# Add Google OAuth credentials for authentication
```

### 2. Database Setup
```bash
npm run db:push    # Creates all tables in Supabase
npm run db:studio  # Verify tables created
```

### 3. Test Implementation
- Visit `/test-parser` to test property parsing with real Zillow/Redfin URLs
- Visit `/test-questionnaire` to test the buyer questionnaire flow
- Main app at `/` integrates both features with authentication

## Key Implementation Details

### OpenAI Property Parser (`src/lib/openai-property-parser.ts`)
- Uses GPT-4o-mini with function calling for structured data extraction
- Handles Zillow, Redfin, and Realtor.com URLs
- Extracts: address, price, beds/baths, sqft, year built, property type, description
- Robust error handling with fallback responses

### Buyer Questionnaire System
- 3-step progressive wizard: Basic Info → Financial Details → Special Status
- React Hook Form with Zod validation for type safety
- Real-time form state management and error display
- Saves complete buyer profile to database for AI Guru analysis

### Authentication Flow
- NextAuth.js with database sessions (not JWT)
- Google OAuth integration ready
- Session management throughout tRPC context
- Sign in/out functionality integrated in main layout

## Notes
- Use Drizzle ORM for all database operations (type-safe SQL)
- Follow tRPC best practices for type-safe APIs
- OpenAI function calling provides structured property data
- Programs CSV will be stored in Vercel Blob for AI Guru discoveries
- Keep solutions simple - single Next.js app (no separate backend)