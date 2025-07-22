# Aid Rocket - Claude Development Guide

## Project Overview
Aid Rocket is a no-BS home-buying advisor that provides honest breakdowns of cash-to-close, monthly payments, and assistance programs through an AI "Down-Payment Guru".

**Vision**: One input, one minute, one truth.

## Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS (Airbnb-style glass-morphism)
- **Backend**: Next.js API Routes (no separate Express server)
- **API**: tRPC (end-to-end typed)
- **Auth**: Clerk
- **Database**: Supabase (PostgreSQL) with Drizzle ORM
- **Storage**: Vercel Blob (for programs.csv)
- **AI**: OpenAI GPT-4o
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

## 7-Day Sprint Progress
- [x] Day 1: Project scaffolding, Turborepo, Tailwind, Clerk, Landing page
- [ ] Day 2: Listing parser & logos, SerpAPI scrape, UI cards
- [ ] Day 3: Questionnaire wizard, React Hook Form, Zod validation
- [ ] Day 4: AI Guru + CSV pipeline, GPT function calls, tax/insurance data
- [ ] Day 5: Scenario calculator, mortgage utils, Results grid
- [ ] Day 6: PDF & share flow, react-pdf, Resend email
- [ ] Day 7: Polish & deploy, auth limits, monitoring, smoke tests

## Notes
- Use Drizzle ORM for all database operations (type-safe SQL)
- Keep solutions simple and avoid overcomplicating
- Follow tRPC best practices for type-safe APIs
- Programs CSV stored in Vercel Blob, grows through AI Guru discoveries
- Single Next.js app (no separate backend) for simplicity