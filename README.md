# MarketScooper

AI Market Gap Research Engine that discovers real market opportunities by analyzing public discussions, complaints, and willingness-to-pay signals across the internet.

## Architecture

```
Data Sources (Reddit, HN, CSV)
        ↓
  Ingestion Layer (connectors, deduplication)
        ↓
  Raw Documents (PostgreSQL)
        ↓
  AI Analysis (OpenAI / Anthropic)
        ↓
  Structured Results + Scoring
        ↓
  Dashboard & Admin UI
```

### Key Modules

- **Ingestion** (`src/lib/ingestion/`) — Source connectors (Reddit, HN, CSV/JSON), connector registry, deduplication
- **AI Analysis** (`src/lib/ai/`) — Provider abstraction (OpenAI/Anthropic), prompt templates, Zod validation
- **Scoring** (`src/lib/scoring/`) — Weighted scoring formula with transparent breakdown
- **API Routes** (`src/app/api/`) — Ingestion trigger, analysis trigger, reanalysis, status updates
- **Dashboard** (`src/app/opportunities/`) — Filterable/sortable opportunity list + detail views
- **Admin** (`src/app/admin/`) — Overview stats, sources, jobs, errors, manual actions

## Prerequisites

- Node.js 20+
- pnpm
- Docker & Docker Compose

## Setup

1. **Clone and install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start PostgreSQL:**
   ```bash
   docker compose up -d
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Run database migrations:**
   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Seed demo data:**
   ```bash
   pnpm db:seed
   ```

6. **Start the development server:**
   ```bash
   pnpm dev
   ```

7. **Open the app:**
   - Opportunities: [http://localhost:3000/opportunities](http://localhost:3000/opportunities)
   - Admin Dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | (required) |
| `AI_PROVIDER` | AI provider: `openai` or `anthropic` | `openai` |
| `OPENAI_API_KEY` | OpenAI API key | — |
| `ANTHROPIC_API_KEY` | Anthropic API key | — |
| `OPENAI_MODEL` | OpenAI model override | `gpt-4o-mini` |
| `ANTHROPIC_MODEL` | Anthropic model override | `claude-sonnet-4-6` |

## Data Sources (Phase 1)

| Source | API | Content |
|---|---|---|
| Reddit | Public JSON API | Posts from r/SaaS, r/startups, r/smallbusiness, r/Entrepreneur |
| Hacker News | Firebase API | Ask HN, Show HN stories + comments |
| CSV/JSON | Manual import | Testing/demo data |

## Scoring Formula

```
finalScore = (painLevel × 0.20) + (urgencySignal × 0.15) + (paymentSignal × 0.25)
           + (dissatisfactionSignal × 0.15) + (solutionSearchSignal × 0.15)
           + (confidence × 10 × 0.10)
```

Payment signal is weighted highest (0.25) because willingness to pay is the strongest indicator of a viable market opportunity.

## Testing

```bash
pnpm test
```

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **UI:** Tailwind CSS + shadcn/ui components
- **Validation:** Zod
- **AI:** OpenAI (gpt-4o-mini) / Anthropic (Claude Sonnet), switchable via env
- **Logging:** pino (structured)
- **Testing:** Vitest

## Extension Points (Phase 2+)

- Vector embeddings (pgvector) for semantic similarity
- Opportunity clustering
- Background worker service
- Additional data sources
- Automated scheduling
