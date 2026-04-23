import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const raw = await readFile(envPath, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

const longFormContents = [
  {
    excerpt:
      "A practical AIO playbook for premium Japanese dining brands in Dubai that need to win AI-assisted discovery and convert high-intent guests.",
    content: `# AI Search Visibility (AIO) for Premium Japanese Dining in Dubai

Dubai's premium dining market has shifted from keyword-based discoverability to **answer-engine discoverability**. When users ask AI products where to host a client omakase dinner, where to find a private robata experience, or which venue can serve executive groups with dietary precision, recommendation systems increasingly synthesize data from multiple sources instead of simply listing classic SERP results.

## Why AIO Changes the Competitive Landscape

Traditional SEO can still drive baseline traffic, but premium Japanese restaurants now compete on:

- **Entity trust**: clear brand identity, chef credentials, location precision, and menu specificity.
- **Contextual depth**: structured answers for use cases like corporate hosting, halal-adjacent requirements, and multilingual guest support.
- **Proof signals**: citations, third-party mentions, and high-consistency metadata across directories and social profiles.

## Operational AIO Blueprint

### 1) Build an Intent Matrix by Commercial Scenario

Map discovery intent into enterprise-relevant scenarios:

- executive dinner booking
- investor delegation hosting
- premium takeaway for leadership workshops
- private room booking for board-level discussions

For each scenario, define:

1. target persona
2. budget range
3. decision timeline
4. confidence blockers

### 2) Publish Machine-Interpretable Content Assets

High-performing assets in Dubai include:

- chef interview pages with provenance and ingredient sourcing details
- neighborhood landing pages by DIFC, Downtown, and Palm Jumeirah
- FAQ blocks covering corporate invoicing, private event capacity, and dietary protocols

Use concise headings, canonical naming, and stable URLs so AI systems can repeatedly resolve the same entity facts.

### 3) Connect Discovery to Revenue Metrics

AIO should be measured beyond impressions. Track:

- qualified booking inquiries from AI-referral sessions
- average spend per AI-assisted booking
- conversion lag by inquiry type
- repeat corporate client rate

## 90-Day Execution Plan

**Weeks 1-2:** technical audit, schema corrections, source consistency cleanup.  
**Weeks 3-6:** launch scenario pages, FAQs, and structured proof content.  
**Weeks 7-10:** deploy multilingual optimization and booking-path friction tests.  
**Weeks 11-13:** reallocate paid media toward top-converting AIO entry points.

## Executive Takeaway

In Dubai's premium segment, AIO is no longer an experimental channel. It is now a **front-door influence layer** for affluent and corporate dining demand. Restaurants that operationalize AIO early can capture disproportionate mindshare in high-value decision moments.`,
  },
  {
    excerpt:
      "How cloud kitchens in Dubai can scale poke bowl and katsu curry sub-brands while preserving margin and service quality through automation.",
    content: `# Multi-Brand Cloud Kitchen Expansion: Poke Bowls, Katsu Curry, and Beyond

Dubai's delivery-first consumption patterns create a strong case for **multi-brand cloud kitchen portfolios**. The challenge is not concept ideation; it is operating several brands with a shared backend while protecting food quality, SLA reliability, and contribution margin.

## Portfolio Design for Demand Resilience

A robust architecture usually combines:

- a health-forward daytime brand (e.g., poke bowls)
- a comfort-led evening brand (e.g., katsu curry)
- a limited-time innovation line to test new demand pockets

This model helps balance basket size volatility and daypart dependency.

## Automation Layers That Matter

### Demand and Prep Forecasting

Use order history, weather shifts, payday effects, and event calendars to forecast SKU-level demand. Forecasting should trigger prep recommendations by station to reduce dead time and overproduction.

### Dynamic Menu Orchestration

Automate menu visibility by:

- prep load
- rider availability
- ingredient freshness thresholds
- gross margin guardrails

When margin-risk SKUs spike in cost, auto-prioritize substitute bundles.

### QA and Dispatch Control

Implement a rules engine that blocks dispatch when:

1. prep exceeds freshness windows
2. packaging mismatch is detected
3. allergen tags are incomplete

## Financial Control Framework

For each sub-brand, track:

- variable contribution margin per order
- cancellation-adjusted net revenue
- customer reacquisition cost by channel
- labor minutes per completed ticket

The operating objective is not top-line growth alone; it is **profitable repeatability**.

## Execution Priorities for Operators

1. Standardize cross-brand base ingredients with clear variance limits.
2. Deploy a single command center for menu, pricing, and promo governance.
3. Build role-specific dashboards for kitchen managers and commercial teams.
4. Introduce weekly kill-or-scale decisions for underperforming menu lines.

## Strategic Conclusion

Cloud kitchens in Dubai can scale aggressively only when brand expansion is tied to automated operational discipline. The winners will be operators that treat technology as a **profitability control system**, not just a convenience layer.`,
  },
  {
    excerpt:
      "A field-tested framework for enterprise-grade lead generation in Dubai, combining precision targeting, content architecture, and pipeline orchestration.",
    content: `# Precision Lead Generation and Content Pipelines for B2B Enterprise Growth

Dubai's B2B environment involves complex buying committees, cross-border compliance expectations, and multilingual stakeholder communication. High-output lead generation requires a pipeline strategy where content is mapped to account progression, not vanity engagement.

## The New Lead Quality Equation

Strong enterprise demand systems now blend:

- intent signal intelligence
- role-aware messaging
- progressive trust assets
- sales-ready qualification logic

## Pipeline Architecture by Funnel Stage

### Stage 1: Market Signal Capture

Aggregate signals from search behavior, industry events, partner ecosystems, and owned channels. Score for recency, relevance, and decision authority.

### Stage 2: Narrative Qualification

Instead of generic nurture sequences, publish sector-specific assets:

- procurement-oriented ROI briefs
- executive implementation roadmaps
- technical readiness checklists

Each asset should answer one high-friction question that blocks advancement.

### Stage 3: Sales Activation

Trigger sales handoff when accounts exceed thresholds in:

1. cumulative intent score
2. high-value page depth
3. repeat multi-role engagement

## Content Operations Model

Adopt an editorial operating rhythm:

- weekly insight memo for fast-moving market updates
- monthly flagship report for strategic positioning
- quarterly proof-case collection for conversion acceleration

Define clear owner roles for analysts, editors, and demand managers to eliminate production bottlenecks.

## Dashboard Essentials for Leadership

Leadership should monitor:

- pipeline created per content pillar
- stage velocity by account segment
- revenue influence per editorial theme
- conversion quality by acquisition source

## Final Recommendation

The most resilient B2B teams in Dubai no longer separate content and pipeline strategy. They design one integrated system where every asset has a measurable commercial purpose and every lead signal informs the next piece of narrative delivery.`,
  },
  {
    excerpt:
      "An advanced operating model for luxury hospitality and retail groups seeking unified AI marketing, content governance, and executive decision support.",
    content: `# Building an Integrated AI Marketing Operating System for Dubai Consumer Enterprises

Large hospitality and retail organizations in Dubai often run fragmented media, CRM, and content workflows across multiple brands. This fragmentation inflates spend and delays decision-making. A unified AI operating system can resolve these inefficiencies.

## Core Design Principles

### Unified Taxonomy

Create one controlled taxonomy for audience segments, offer classes, lifecycle stages, and campaign objectives. Without shared labels, analytics becomes non-comparable across business units.

### Decision-Ready Data Products

Move from report-heavy culture to decision products:

- spend reallocation recommendations
- churn-risk alerts
- account expansion playbooks

These outputs should be concise, prioritized, and tied to owner accountability.

### Content Governance at Scale

Establish a governance framework that enforces:

1. brand voice consistency
2. legal and compliance checks
3. market localization quality
4. publishing cadence discipline

## Implementation Sequence

**Phase 1:** Data unification and KPI normalization.  
**Phase 2:** AI copilots for planning, experimentation, and post-campaign diagnosis.  
**Phase 3:** Automated optimization loops for bids, creative rotation, and audience re-weighting.

## Risk Controls

Executive teams should proactively manage:

- model drift from outdated audience assumptions
- over-automation without human quality review
- attribution bias in multi-touch enterprise journeys

## Outcome Profile

Organizations that execute this model typically achieve faster cycle times, cleaner strategic alignment, and stronger capital efficiency across paid, owned, and partner channels.`,
  },
  {
    excerpt:
      "A strategic roadmap for cross-functional teams to turn AI-assisted discovery into sustained enterprise revenue in Dubai's F&B and retail sectors.",
    content: `# From Discovery to Revenue: A Cross-Functional AIO Playbook for Dubai

Winning discovery is not enough. Enterprises in Dubai need an operating bridge from AI-assisted visibility to qualified pipeline, predictable conversion, and long-term account growth.

## Commercial Alignment First

Before scaling campaigns, leadership should define:

- primary growth segments (F&B groups, retail chains, hospitality operators)
- revenue thresholds per segment
- acceptable CAC-to-LTV ratio bands

This prevents high-traffic programs that fail to produce meaningful commercial outcomes.

## High-Impact Workflow Design

### Marketing

Produce modular content blocks that can be reused across:

- AI answer surfaces
- industry newsletters
- account-based outreach sequences

### Sales

Operationalize a follow-up protocol where every lead receives:

1. context-aware outreach narrative
2. sector-specific value framing
3. clear next-step offer

### Operations

Feed delivery constraints, staffing data, and margin alerts into campaign planning to avoid growth that breaks service quality.

## Measurement Framework

Track an integrated scorecard:

- discovery-to-MQL conversion rate
- MQL-to-opportunity progression by sector
- opportunity win rate with content influence
- post-sale expansion within 120 days

## Practical 12-Week Roadmap

**Weeks 1-4:** baseline diagnostics and taxonomy cleanup.  
**Weeks 5-8:** launch pillar content and AI visibility optimizations.  
**Weeks 9-12:** enforce sales enablement automation and executive KPI reviews.

## Conclusion

Dubai's market rewards teams that combine strategic precision with execution discipline. AIO becomes materially valuable only when it is embedded into the full go-to-market system, from discovery signal to signed revenue.`,
  },
];

async function getLatestFiveArticles(url, key) {
  const response = await fetch(
    `${url}/rest/v1/articles?select=id,title&is_published=eq.true&order=created_at.desc,id.desc&limit=5`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch articles: ${response.status} ${body}`);
  }

  return response.json();
}

async function updateArticle(url, key, id, payload) {
  const response = await fetch(`${url}/rest/v1/articles?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to update article ${id}: ${response.status} ${body}`);
  }

  return response.json();
}

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
    );
  }

  const articles = await getLatestFiveArticles(url, key);
  if (!Array.isArray(articles) || articles.length === 0) {
    throw new Error("No published articles found to update.");
  }

  const targets = articles.slice(0, 5);
  for (let i = 0; i < targets.length; i += 1) {
    const article = targets[i];
    const contentPack = longFormContents[i % longFormContents.length];
    const updated = await updateArticle(url, key, article.id, {
      excerpt: contentPack.excerpt,
      content: contentPack.content,
    });

    const row = updated[0];
    console.log(
      `Updated article ${row.id}: ${row.title.slice(0, 70)}... (content length: ${row.content.length})`,
    );
  }

  console.log("Completed long-form content updates for latest five articles.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
