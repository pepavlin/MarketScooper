# CLAUDE.md

## Purpose of this document

This document explains how Claude Code should work with this repository
and how development should proceed across the different project phases.

The goal of the project is to build an **AI Market Gap Research Engine**
that discovers real market opportunities by analyzing discussions,
complaints, and signals of willingness to pay across the internet.

Claude Code acts primarily as an **implementation agent** responsible
for building and improving the system according to the specifications in
the phase documents.

Phase specifications: - `claude_code_phase_1.md` -
`claude_code_phase_2.md` - `claude_code_phase_3.md`

Always follow those documents for detailed requirements.

------------------------------------------------------------------------

# Development Principles

## 1. Modular Architecture

The system must be implemented with a clean modular architecture.

Separate the following concerns:

-   data ingestion
-   AI analysis
-   scoring
-   clustering
-   persistence
-   background processing
-   UI
-   admin dashboard

Avoid large monolithic files or mixing business logic with UI or API
handlers.

------------------------------------------------------------------------

## 2. Strong Typing

Use **TypeScript** where possible.

Define clear interfaces for:

-   Raw documents
-   Analysis results
-   Evidence signals
-   Opportunity insights
-   Clusters

All AI outputs must be validated using schemas.

------------------------------------------------------------------------

## 3. AI Output Validation

LLM responses must:

-   follow strict JSON schemas
-   be validated
-   be retried if invalid
-   never crash the pipeline

Store metadata such as:

-   model used
-   prompt version
-   retry count
-   processing timestamp

------------------------------------------------------------------------

# Project Structure (suggested)

Example structure:

/app /api /components /dashboard

/server /services /ingestion /analysis /scoring /clustering

/workers

/database /prisma

/prompts

/config

/scripts

This structure may evolve but must remain clean and modular.

------------------------------------------------------------------------

# Main Execution Method

The **primary way to run the system must be Docker Compose.**

This ensures the environment is reproducible and easy to start.

Running the full system should require only:

``` bash
docker compose up
```

Docker Compose must start:

-   the main Next.js application
-   background worker(s)
-   PostgreSQL database
-   optional vector extensions (pgvector)
-   any required supporting services

All services must communicate through Docker networking.

Environment variables must be configured through `.env`.

------------------------------------------------------------------------

# Required Docker Services

Minimum services:

### app

Next.js application containing:

-   main UI
-   admin dashboard
-   API endpoints

### worker

Background worker responsible for:

-   ingestion processing
-   AI analysis
-   scoring
-   clustering

### postgres

Main database.

Use PostgreSQL and enable `pgvector` if embeddings are used.

### optional services

May include:

-   scheduler
-   redis (future queue support)

------------------------------------------------------------------------

# Background Processing

Heavy operations must run in workers, not inside HTTP routes.

Examples:

-   ingestion
-   AI analysis
-   clustering
-   scoring recalculation

Workers must be safe to restart and idempotent.

------------------------------------------------------------------------

# Database Requirements

Use PostgreSQL.

The schema must support:

-   sources
-   raw documents
-   analysis results
-   evidence signals
-   processing jobs
-   errors
-   review states
-   clusters (phase 3)

Database migrations must be versioned.

------------------------------------------------------------------------

# Admin Dashboard

The admin dashboard is a critical part of the system.

It must provide visibility into:

-   ingestion status
-   processing jobs
-   errors
-   opportunities
-   clusters
-   analytics
-   review workflow

Admin UI should allow:

-   manual ingestion runs
-   re-analysis
-   review actions
-   cluster inspection

------------------------------------------------------------------------

# AI Prompts

Prompts must be stored separately from code.

Recommended location:

    /prompts

Each prompt must include:

-   clear instruction
-   expected JSON schema
-   version identifier

Prompt versions must be tracked.

------------------------------------------------------------------------

# Logging and Observability

Implement structured logging.

Logs should include:

-   job type
-   source
-   processing step
-   error context

Admin dashboard should expose key operational metrics.

------------------------------------------------------------------------

# Performance Considerations

The system will eventually process large datasets.

Design with scalability in mind:

-   avoid unnecessary recomputation
-   store embeddings
-   store analysis results
-   make clustering rerunnable

------------------------------------------------------------------------

# Safety and Robustness

The system must be resilient to:

-   API failures
-   malformed AI responses
-   duplicate documents
-   network errors

No failure should corrupt the pipeline.

------------------------------------------------------------------------

# Development Workflow

When implementing new features:

1.  Read the relevant phase specification.
2.  Implement modular services.
3.  Add database schema if required.
4.  Update Docker services if needed.
5.  Ensure the system still runs via Docker Compose.

Always keep the project runnable with:

    docker compose up

------------------------------------------------------------------------

# Final Goal

The finished system should be able to:

1.  Collect data from multiple sources.
2.  Extract structured problems using AI.
3.  Detect signals of willingness to pay.
4.  Group insights into opportunity clusters.
5.  Generate actionable product opportunities.
6.  Provide a powerful admin dashboard for analysis.

Claude Code should prioritize **clarity, maintainability, and
extensibility** in all implementations.
