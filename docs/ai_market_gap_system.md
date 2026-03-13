# AI System for Finding Market Gaps

## Goal

Build an AI program that discovers **real market opportunities** by
analyzing where people experience repeated problems and show signals of
willingness to pay.

------------------------------------------------------------------------

# Core Principle

Instead of generating random startup ideas, the system should detect:

**Problem → Frequency → Pain → Willingness to Pay → Opportunity**

A good opportunity appears when: - Many people experience the same
problem - The problem is painful or time‑consuming - Existing tools are
inadequate - People show signals they would pay for a solution

------------------------------------------------------------------------

# Signals the AI Should Detect

## 1. Pain Signal

People describe a concrete problem.

Examples: - "This process is extremely manual." - "This tool is terrible
for this use case." - "We waste hours doing this."

## 2. Search / Intent Signal

People actively look for solutions.

Examples: - "Does anyone know a tool for...?" - "Looking for software
that..." - "Is there a better way to...?"

## 3. Dissatisfaction Signal

Existing tools are not good enough.

Examples: - Too expensive - Too complex - Missing a key feature - Not
suitable for a specific niche

## 4. Payment Signal (most important)

Evidence people would pay.

Examples: - "I would pay for this." - "Our company needs something like
this." - "We currently pay \$X for something similar."

## 5. Frequency Signal

The same problem appears across multiple platforms or discussions.

------------------------------------------------------------------------

# High Value Data Sources

Good places where people discuss problems:

-   Reddit discussions
-   Product Hunt comments
-   G2 / Capterra reviews
-   Hacker News
-   StackOverflow questions
-   GitHub Issues of existing tools
-   Industry forums
-   Job listings
-   Twitter/X conversations

### Why job listings?

Companies hiring people for repetitive work often indicates an
**expensive manual process** that software could automate.

------------------------------------------------------------------------

# System Architecture

collector ↓ normalize posts / comments / reviews ↓ problem extractor
(LLM) ↓ buyer‑intent classifier ↓ competitor mention extractor ↓ pricing
/ budget extractor ↓ embeddings ↓ clustering ↓ opportunity scorer ↓
report generator

------------------------------------------------------------------------

# Example Pipeline

## Step 1 -- Data Collection

Scrape posts from selected platforms.

## Step 2 -- Problem Extraction

Prompt example:

Extract the problem the user is experiencing.\
Return only one sentence.

Output example:

Users struggle to automatically sync Stripe invoices with accounting
software.

## Step 3 -- Embeddings + Clustering

Group similar problems using embeddings.

Example cluster:

Stripe accounting automation - syncing stripe invoices - exporting
stripe data - accounting integration problems

## Step 4 -- Market Evaluation

Each cluster is evaluated by AI.

Criteria:

-   Pain intensity
-   Frequency
-   Willingness to pay
-   Competition weakness
-   Ease of MVP
-   Distribution ease

Example scoring:

{ painIntensity: 8.7, frequency: 7.9, willingnessToPay: 8.9,
competitionWeakness: 6.8, easeOfMVP: 7.1, distributionEase: 6.5,
finalScore: 7.8 }

------------------------------------------------------------------------

# Final Output Format

Problem: Small accounting teams struggle to reconcile Stripe
transactions.

Buyer: Small companies and freelancers

Existing solutions: Generic accounting tools that require manual work

Opportunity: Stripe → Accounting automation tool

MVP: - Connect Stripe - Auto categorize transactions - Export to
accounting software

Potential price: \$9--\$29 / month

------------------------------------------------------------------------

# Key Insight

The system should not produce only ideas.

It should identify:

1.  Interesting problems
2.  Frequent problems
3.  Painful problems
4.  Problems people will pay to solve

The last one determines real business opportunities.

------------------------------------------------------------------------

# Possible Tech Stack

Crawler: - Python + Playwright

AI processing: - OpenAI / Claude

Embeddings: - OpenAI embeddings or BGE

Clustering: - HDBSCAN

Backend: - Python workers

Database: - Postgres

Vector search: - pgvector

Frontend: - Next.js dashboard

------------------------------------------------------------------------

# Future Improvements

-   Automatic competitor analysis
-   SEO keyword opportunity detection
-   Pricing analysis
-   Automatic MVP specification
-   Go‑to‑market strategy suggestions

------------------------------------------------------------------------

# Potential Product

Instead of just an "idea generator", the result could be a:

**AI Market Gap Research Engine**

A system that automatically finds: - Problems - Buyers - Product ideas -
Pricing suggestions - Distribution channels
