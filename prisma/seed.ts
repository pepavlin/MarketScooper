import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create sources
  const redditSaaS = await prisma.source.upsert({
    where: { id: "src-reddit-saas" },
    update: {},
    create: {
      id: "src-reddit-saas",
      name: "Reddit - r/SaaS",
      type: "REDDIT",
      config: { subreddit: "SaaS", limit: 25, sort: "new" },
    },
  });

  const redditStartups = await prisma.source.upsert({
    where: { id: "src-reddit-startups" },
    update: {},
    create: {
      id: "src-reddit-startups",
      name: "Reddit - r/startups",
      type: "REDDIT",
      config: { subreddit: "startups", limit: 25, sort: "new" },
    },
  });

  const hn = await prisma.source.upsert({
    where: { id: "src-hackernews" },
    update: {},
    create: {
      id: "src-hackernews",
      name: "Hacker News",
      type: "HACKERNEWS",
      config: { limit: 20, fetchComments: true },
    },
  });

  console.log("Created sources:", redditSaaS.name, redditStartups.name, hn.name);

  // Create sample raw documents
  const sampleDocuments = [
    {
      externalId: "seed-001",
      sourceId: redditSaaS.id,
      title: "Frustrated with current project management tools",
      content:
        "I've been using Asana, Monday, and Jira for my 15-person team and none of them really work well for our hybrid workflow. We need something that handles both software sprints AND creative project timelines. I'd happily pay $50/user/month for something that actually does this well. Anyone else have this problem?",
      author: "startup_founder_42",
      url: "https://www.reddit.com/r/SaaS/comments/seed001",
      metadata: { subreddit: "SaaS", score: 47, numComments: 23 },
    },
    {
      externalId: "seed-002",
      sourceId: redditSaaS.id,
      title: "Need a better invoicing solution for micro-SaaS",
      content:
        "Stripe Billing is overkill and expensive for what I need. I just want to send professional invoices, track payments, and have basic subscription management. Not looking for a full billing platform. Would pay $20-30/month for something simple and clean that just works for solo SaaS founders.",
      author: "indie_hacker_dev",
      url: "https://www.reddit.com/r/SaaS/comments/seed002",
      metadata: { subreddit: "SaaS", score: 89, numComments: 45 },
    },
    {
      externalId: "seed-003",
      sourceId: redditSaaS.id,
      title: "Customer feedback tools are all terrible",
      content:
        "I've tried Canny, UserVoice, and ProductBoard. They're either too expensive or too complex for what small SaaS teams need. I just want a simple board where customers can submit and vote on feature requests, and I can update them on progress. Everything out there tries to be a full product management suite. Willing to pay if someone builds just this one thing well.",
      author: "bootstrapped_sarah",
      url: "https://www.reddit.com/r/SaaS/comments/seed003",
      metadata: { subreddit: "SaaS", score: 156, numComments: 67 },
    },
    {
      externalId: "seed-004",
      sourceId: redditStartups.id,
      title: "Onboarding new employees is still painful",
      content:
        "We're a 50-person startup and onboarding is a mess. IT has to set up 10 different tools manually, HR sends a packet of PDFs, and the new hire is confused for 2 weeks. BambooHR helps with HR stuff but doesn't handle the IT provisioning or the actual welcome/training flow. We need an all-in-one onboarding platform that coordinates IT, HR, and team introductions. Would easily budget $10k/year for this.",
      author: "ops_lead_mike",
      url: "https://www.reddit.com/r/startups/comments/seed004",
      metadata: { subreddit: "startups", score: 203, numComments: 89 },
    },
    {
      externalId: "seed-005",
      sourceId: redditStartups.id,
      title: "Why is there no good competitor research tool?",
      content:
        "I want to track what my competitors are shipping, their pricing changes, new features, blog posts, and social media activity. Manually checking 8 competitor websites every week is not sustainable. Crayon and Klue are enterprise-priced ($30k+/year). There's a massive gap in the market for a $100-200/month competitor intelligence tool for startups.",
      author: "competitive_analyst",
      url: "https://www.reddit.com/r/startups/comments/seed005",
      metadata: { subreddit: "startups", score: 312, numComments: 134 },
    },
    {
      externalId: "seed-006",
      sourceId: hn.id,
      title: "Ask HN: How do you handle API documentation?",
      content:
        "We have a REST API with 200+ endpoints and keeping the docs in sync with code changes is a nightmare. We use OpenAPI/Swagger but the generated docs are ugly and hard to navigate. Readme.com is nice but expensive at scale. Anyone built something better? Would love a tool that auto-generates beautiful, searchable docs from our OpenAPI spec and lets us add guides/tutorials alongside the reference docs.",
      author: "api_dev",
      url: "https://news.ycombinator.com/item?id=seed006",
      metadata: { score: 167, descendants: 89, type: "story" },
    },
    {
      externalId: "seed-007",
      sourceId: hn.id,
      title: "Show HN: I'm building a tool because log analysis is broken",
      content:
        "After spending years dealing with Datadog bills that keep growing, I realized most startups just need simple log search and basic alerting without the $50k+ price tag. CloudWatch is cheap but painful to use. We built an open-core log analytics platform that's 10x cheaper than Datadog while being actually usable. Looking for early adopters. The response has been incredible — 500+ signups in the first week.",
      author: "log_founder",
      url: "https://news.ycombinator.com/item?id=seed007",
      metadata: { score: 423, descendants: 212, type: "story" },
    },
    {
      externalId: "seed-008",
      sourceId: redditSaaS.id,
      title: "Scheduling meetings across timezones is still unsolved",
      content:
        "Calendly handles 1:1 scheduling fine but falls apart with group scheduling across timezones. I manage a remote team of 12 people in 6 timezones and finding meeting times is a weekly 30-minute exercise. I've tried WorldTimeBuddy, When2meet, and Doodle — none of them integrate well with Google Calendar or handle recurring group meetings. I'd pay $15/user/month for something that just works.",
      author: "remote_team_lead",
      url: "https://www.reddit.com/r/SaaS/comments/seed008",
      metadata: { subreddit: "SaaS", score: 78, numComments: 34 },
    },
    {
      externalId: "seed-009",
      sourceId: redditStartups.id,
      title: "Just found out our Firebase bill will be $8k next month",
      content:
        "We're a small startup with moderate traffic and our Firebase/Firestore costs have been creeping up. Just got the projected bill and it's going to be $8k. We're barely making revenue yet. The vendor lock-in is real — migrating off Firebase at this point would take months. I wish there was a Firebase alternative that was more predictable in pricing and didn't have this lock-in problem. Would happily pay a flat monthly fee instead of this usage-based nightmare.",
      author: "burnt_by_firebase",
      url: "https://www.reddit.com/r/startups/comments/seed009",
      metadata: { subreddit: "startups", score: 445, numComments: 198 },
    },
    {
      externalId: "seed-010",
      sourceId: hn.id,
      title: "Ask HN: Best practices for managing feature flags at scale?",
      content:
        "We have 50+ feature flags and it's becoming unmanageable. LaunchDarkly is great but costs $1k/month for our team size. We tried building our own but maintaining it is a pain. Split.io and Flagsmith exist but each has significant limitations. What we really need is a lightweight, self-hostable feature flag service with a good UI, proper audit logging, and gradual rollout capabilities. Not another enterprise platform with 100 features we'll never use.",
      author: "devops_jane",
      url: "https://news.ycombinator.com/item?id=seed010",
      metadata: { score: 234, descendants: 156, type: "story" },
    },
  ];

  for (const doc of sampleDocuments) {
    await prisma.rawDocument.upsert({
      where: {
        sourceId_externalId: {
          sourceId: doc.sourceId,
          externalId: doc.externalId,
        },
      },
      update: {},
      create: {
        ...doc,
        status: "PENDING",
      },
    });
  }

  console.log(`Created ${sampleDocuments.length} sample documents`);
  console.log("Seed completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
