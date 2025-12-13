---
title: "mmx: A Memex-like personal journal"
date: "2024-02-20"
slug: "mmx"
tags: ["project", "javascript", "SVG"]
---

## Executive Summary

A self-hosted personal AI journaling system that extracts structured knowledge from conversations, supports optional argument mapping for decision-making, and surfaces insights over time. Designed for sustained daily use with minimal complexity.

### Key Design Principles

1. **Simplicity over features** — Avoid the week-three dropout by keeping cognitive load low
2. **Privacy by default** — Self-hosted AWS infrastructure, your data stays yours
3. **Output orientation** — The system produces insights, not just stores information
4. **Arguments are opt-in** — Never auto-extract reasoning structure from normal conversation
5. **Accumulation over forgetting** — Long-term knowledge base with periodic surfacing, not auto-archival

### Differentiation

Based on competitive research, this system occupies whitespace at the intersection of:
- AI journaling (Rosebud, Day One) — which lacks knowledge extraction
- Personal knowledge management (Khoj, Mem0) — which lacks argument mapping
- Argument mapping tools (Argdown) — which lack AI integration

No existing product combines conversational capture, automatic knowledge extraction, and structured reasoning support.

---

## Knowledge Model

### Overview

Five knowledge types plus one optional structure:

| Type | Description | Source |
|------|-------------|--------|
| **Entity** | People, places, organizations, concepts | Auto-extracted, normalized |
| **Fact** | Statements about entities or the world | First-party and third-party |
| **Reflection** | Thoughts, feelings, observations, questions | First-party only |
| **Decision** | Choices made with reasoning | First-party only |
| **Reference** | Cited content from documents (may be opinions) | Third-party documents |
| **Argument** | Structured claim → evidence → conclusion | Opt-in only |

### Entity

Canonical representations of things mentioned across conversations and documents.

```
Entity {
  id: uuid
  name: string                    -- Canonical name
  entity_type: enum               -- person, organization, place, concept, project, technology
  aliases: string[]               -- Alternative names for matching
  created_at: timestamp
  updated_at: timestamp
  embedding: vector(1536)
}
```

**Extraction behavior:**
- LLM identifies entity mentions and normalizes to canonical form
- Matches against existing entities before creating new ones
- "MongoDB", "Mongo", "mongodb" → single Entity
- Entity type inferred from context

### Fact

Statements that can be true or false, associated with an entity or standalone.

```
Fact {
  id: uuid
  content: string                 -- The factual statement
  entity_id: uuid | null          -- Associated entity (optional)
  source_type: enum               -- conversation, obsidian_note, document
  source_id: string               -- Reference to source
  extraction_confidence: enum     -- high, medium, low
  verification_status: enum       -- unverified, verified, disputed
  is_current: boolean             -- Supersession tracking
  superseded_by: uuid | null      -- Points to newer fact if superseded
  created_at: timestamp
  updated_at: timestamp
  embedding: vector(1536)
}
```

**Extraction confidence** (LLM self-assessment based on linguistic signals):
- **High**: Definitive statements ("I work at Anthropic", "MongoDB uses B-trees")
- **Medium**: Qualified statements ("I think...", "probably", "usually")
- **Low**: Uncertain or ambiguous ("maybe", "I'm not sure but...")

**Verification status** (user-controlled):
- **Unverified**: Default state, not yet reviewed
- **Verified**: User confirmed accuracy
- **Disputed**: User marked as incorrect or contested

**Supersession**: When a new fact contradicts an existing fact about the same entity/topic, the old fact is marked `is_current: false` and `superseded_by` points to the new fact. Both are retained for history.

### Reflection

First-person thoughts, feelings, observations, and questions. Temporal and subjective.

```
Reflection {
  id: uuid
  content: string                 -- The reflection text
  is_question: boolean            -- True if this is an open question
  source_type: enum               -- conversation, obsidian_note
  source_id: string
  extraction_confidence: enum     -- high, medium, low
  verification_status: enum       -- unverified, verified, disputed
  created_at: timestamp
  updated_at: timestamp
  embedding: vector(1536)
}
```

**Questions** are reflections with `is_question: true`. They represent open wonderings that may later be answered or dismissed.

Examples:
- Reflection: "I'm feeling burned out on frontend work"
- Reflection: "The GTD system isn't working for me anymore"
- Question: "Should I focus on TPM roles or stay technical?"

### Decision

Choices made, with optional free-text reasoning. May link to a formal Argument.

```
Decision {
  id: uuid
  content: string                 -- What was decided
  reasoning: text | null          -- Free-text explanation (informal)
  argument_id: uuid | null        -- Link to formal Argument (optional)
  confidence: enum                -- high, medium, low
  verification_status: enum       -- unverified, verified, disputed
  source_type: enum               -- conversation, obsidian_note
  source_id: string
  created_at: timestamp
  updated_at: timestamp
  embedding: vector(1536)
}
```

A Decision can exist in three forms:
1. **Standalone**: Just the decision, no reasoning captured
2. **With reasoning**: Decision plus informal explanation
3. **With Argument**: Decision linked to formal claim/evidence structure

### Reference

Cited content from third-party documents. Unlike Facts, References may represent opinions or claims from external sources.

```
Reference {
  id: uuid
  content: string                 -- The referenced content
  document_id: uuid               -- Source document
  location: string | null         -- Page number, section, etc.
  author_opinion: boolean         -- True if this is opinion vs factual claim
  extraction_confidence: enum     -- high, medium, low
  created_at: timestamp
  embedding: vector(1536)
}
```

**Why separate from Fact?** A Fact represents something the system treats as potentially true. A Reference preserves what a source said without that endorsement. "Author X argues that Y" is a Reference; "Y is true" would be a Fact.

### Argument (Opt-in Structure)

Formal reasoning structure created only via explicit request.

```
Argument {
  id: uuid
  title: string                   -- Descriptive title
  claim_content: string           -- The main claim being argued
  claim_qualifier: string | null  -- "likely", "probably", "certainly"
  status: enum                    -- open, concluded, abandoned
  conclusion_decision_id: uuid | null  -- Link to resulting Decision
  created_at: timestamp
  updated_at: timestamp
}

Evidence {
  id: uuid
  argument_id: uuid
  content: string                 -- The evidence statement
  relationship: enum              -- supports, refutes
  strength: enum                  -- strong, medium, weak
  premise: text | null            -- Inline reasoning connecting evidence to claim
  is_addressed: boolean           -- For rebuttals: has this been addressed?
  addressed_note: text | null     -- How it was addressed
  created_at: timestamp
}

EvidenceFact {
  evidence_id: uuid
  fact_id: uuid
  -- Links Evidence to grounding Facts
}
```

**Argument creation triggers** (never automatic):
1. `/argument` command in chat
2. Retroactive request: "Structure my reasoning about X"
3. Manual promotion of a Reflection to Claim

**Argument flow:**
1. User states or bot elicits the Claim
2. Bot guides evidence collection (supports and refutes)
3. Bot suggests when evidence is actually a Premise (reasoning step)
4. User can mark rebuttals as addressed
5. Argument concludes with optional Decision

---

## Source Types and Extraction Rules

### First-Party Sources

Sources where the content represents the user's own thoughts.

| Source | Extracts |
|--------|----------|
| Conversations | Entity, Fact, Reflection, Decision |
| Obsidian notes | Entity, Fact, Reflection, Decision |
| User-authored documents | Entity, Fact, Reflection, Decision |

### Third-Party Sources

Sources where the content represents external information.

| Source | Extracts |
|--------|----------|
| Uploaded PDFs, articles | Entity, Fact, Reference |
| Web clippings | Entity, Fact, Reference |

**Key restriction**: Third-party sources never produce Reflections or Decisions (those are inherently first-person).

---

## Database Architecture

### Technology Choices

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Conversations | DynamoDB | High-frequency writes, simple access patterns |
| Knowledge | PostgreSQL + pgvector | Complex queries, joins, vector search |
| Documents | S3 | Binary storage |
| Embeddings | Bedrock Titan | AWS ecosystem, 1536 dimensions |
| LLM | Claude (Anthropic API) | Best reasoning for extraction |

<details>
<summary>DynamoDB Schema (Single-Table Design)</summary>

```
Conversations and Messages:
  PK: CONV#{conversation_id}
  SK: META                        -- Conversation metadata
  SK: MSG#{timestamp}             -- Individual messages

Devices:
  PK: DEVICE#{device_id}
  SK: META                        -- Device info, push token
  SK: ACTIVITY#{date}             -- Activity tracking

Events:
  PK: EVENT#{type}#{event_id}
  SK: META                        -- Event metadata

GSI: type-index
  PK: TYPE#{entity_type}
  SK: {timestamp}
```

</details>

<details>
<summary>PostgreSQL Schema</summary>

```sql
-- Entities
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  aliases TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  embedding VECTOR(1536)
);

CREATE INDEX idx_entities_embedding ON entities
  USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_entities_type ON entities(entity_type);
CREATE INDEX idx_entities_name ON entities(name);

-- Facts
CREATE TABLE facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  entity_id UUID REFERENCES entities(id),
  source_type VARCHAR(50) NOT NULL,
  source_id VARCHAR(255) NOT NULL,
  extraction_confidence VARCHAR(20) DEFAULT 'medium',
  verification_status VARCHAR(20) DEFAULT 'unverified',
  is_current BOOLEAN DEFAULT TRUE,
  superseded_by UUID REFERENCES facts(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  embedding VECTOR(1536)
);

CREATE INDEX idx_facts_embedding ON facts
  USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_facts_entity ON facts(entity_id);
CREATE INDEX idx_facts_verification ON facts(verification_status);
CREATE INDEX idx_facts_current ON facts(is_current);

-- Reflections
CREATE TABLE reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  is_question BOOLEAN DEFAULT FALSE,
  source_type VARCHAR(50) NOT NULL,
  source_id VARCHAR(255) NOT NULL,
  extraction_confidence VARCHAR(20) DEFAULT 'medium',
  verification_status VARCHAR(20) DEFAULT 'unverified',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  embedding VECTOR(1536)
);

CREATE INDEX idx_reflections_embedding ON reflections
  USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_reflections_question ON reflections(is_question);

-- Decisions
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  reasoning TEXT,
  argument_id UUID REFERENCES arguments(id),
  confidence VARCHAR(20) DEFAULT 'medium',
  verification_status VARCHAR(20) DEFAULT 'unverified',
  source_type VARCHAR(50) NOT NULL,
  source_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  embedding VECTOR(1536)
);

CREATE INDEX idx_decisions_embedding ON decisions
  USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_decisions_argument ON decisions(argument_id);

-- References
CREATE TABLE references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  document_id UUID REFERENCES documents(id) NOT NULL,
  location VARCHAR(255),
  author_opinion BOOLEAN DEFAULT FALSE,
  extraction_confidence VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW(),
  embedding VECTOR(1536)
);

CREATE INDEX idx_references_embedding ON references
  USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_references_document ON references(document_id);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  s3_key VARCHAR(500) NOT NULL,
  source_type VARCHAR(50) NOT NULL,  -- uploaded, obsidian
  mime_type VARCHAR(100),
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Arguments
CREATE TABLE arguments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  claim_content TEXT NOT NULL,
  claim_qualifier VARCHAR(50),
  status VARCHAR(20) DEFAULT 'open',
  conclusion_decision_id UUID REFERENCES decisions(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_arguments_status ON arguments(status);

-- Evidence
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  argument_id UUID REFERENCES arguments(id) NOT NULL,
  content TEXT NOT NULL,
  relationship VARCHAR(20) NOT NULL,  -- supports, refutes
  strength VARCHAR(20) DEFAULT 'medium',
  premise TEXT,
  is_addressed BOOLEAN DEFAULT FALSE,
  addressed_note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_evidence_argument ON evidence(argument_id);

-- Evidence to Fact linking
CREATE TABLE evidence_facts (
  evidence_id UUID REFERENCES evidence(id),
  fact_id UUID REFERENCES facts(id),
  PRIMARY KEY (evidence_id, fact_id)
);

-- Hashtags
CREATE TABLE hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag VARCHAR(100) NOT NULL UNIQUE,
  usage_count INT DEFAULT 0
);

-- Polymorphic tagging
CREATE TABLE item_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type VARCHAR(50) NOT NULL,  -- fact, reflection, decision, reference
  item_id UUID NOT NULL,
  hashtag_id UUID REFERENCES hashtags(id),
  UNIQUE(item_type, item_id, hashtag_id)
);

CREATE INDEX idx_item_tags_item ON item_tags(item_type, item_id);
CREATE INDEX idx_item_tags_hashtag ON item_tags(hashtag_id);

-- Entity mentions (polymorphic)
CREATE TABLE entity_mentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id),
  item_type VARCHAR(50) NOT NULL,
  item_id UUID NOT NULL,
  UNIQUE(entity_id, item_type, item_id)
);

CREATE INDEX idx_entity_mentions_entity ON entity_mentions(entity_id);
CREATE INDEX idx_entity_mentions_item ON entity_mentions(item_type, item_id);
```

</details>

---

## Extraction Pipeline

### Normal Extraction (Nightly at 2 AM)

Processes conversations updated since last extraction run.

**Input**: Conversation messages  
**Output**: Entities, Facts, Reflections, Decisions

**Prompt structure**:
```
You are extracting structured knowledge from a personal journal conversation.

Extract the following:

1. ENTITIES: People, organizations, places, concepts, projects, technologies mentioned.
   - Normalize names to canonical form
   - Provide entity_type
   - Note any aliases used

2. FACTS: Statements that could be true or false.
   - Associate with entity if applicable
   - Rate extraction_confidence (high/medium/low) based on linguistic certainty
   - Note if this might contradict existing facts

3. REFLECTIONS: First-person thoughts, feelings, observations.
   - Mark is_question=true for open wonderings
   - These are subjective and temporal

4. DECISIONS: Choices the user has made.
   - Include any reasoning mentioned
   - Rate confidence based on how firm the decision seems

DO NOT extract argument structure unless the conversation explicitly contains
formal reasoning with claims and evidence. Normal conversation should not
produce Arguments.

Return as JSON...
```

**Post-processing**:
1. Match extracted entities against existing entities (embedding similarity > 0.9)
2. Create new entities for unmatched
3. Check new facts against existing facts for same entity (embedding similarity > 0.85)
4. If contradiction found, mark old fact `is_current: false`, link via `superseded_by`
5. Generate embeddings via Bedrock Titan
6. Store all items

### Argument Extraction (Opt-in)

Triggered only by explicit request.

**Triggers**:
- `/argument` command starts argument mode
- "Help me think through X" or "Structure my reasoning about Y"
- Manual promotion of Reflection to Argument

**Argument mode conversation flow**:
```
User: /argument

Bot: I'll help you structure an argument. What's the main claim 
     you're considering?

User: I think I should switch to a TPM role.

Bot: Got it. Your claim is: "I should switch to a TPM role."
     Would you add any qualifier? (certainly, probably, possibly)

User: Probably

Bot: Claim recorded: "I should probably switch to a TPM role."
     What evidence supports this claim?

User: I've been doing more coordination than coding lately.
      My skip-level said I have good cross-team communication.

Bot: I've recorded two supporting evidence points:
     1. "I've been doing more coordination than coding lately" (medium strength)
     2. "My skip-level said I have good cross-team communication" (strong - external validation)
     
     Are there reasons this might NOT be the right move?

User: I might miss hands-on technical work.

Bot: Recorded as refuting evidence: "I might miss hands-on technical work"
     This seems like a concern rather than a factual counter-argument.
     Should I note this as a premise (your reasoning) rather than evidence?

User: Yeah, that makes sense.

Bot: Updated to premise. Any other considerations?

User: I think that covers it.

Bot: Summary of your argument:
     
     CLAIM: I should probably switch to a TPM role
     
     SUPPORTING:
     - I've been doing more coordination than coding (medium)
     - Skip-level praised my cross-team communication (strong)
     
     CONSIDERATIONS:
     - Premise: I might miss hands-on technical work
     
     Would you like to conclude with a decision, or leave this open?
```

### Document Ingestion

**Supported formats**: PDF, TXT, MD, DOCX

**Processing**:
1. Upload to S3 (presigned URL)
2. S3 event triggers Lambda
3. Extract text (pdf-parse, mammoth, etc.)
4. Chunk into sections
5. Extract: Entities, Facts, References
6. Mark `author_opinion: true` for subjective claims
7. Generate embeddings
8. Store with `document_id` reference

**Obsidian vault sync**:
- Treated as first-party source
- Full extraction (including Reflections, Decisions)
- Periodic sync from S3 prefix

---

## RAG Retrieval

### Query Flow

```
User: "What do I know about MongoDB?"

1. Generate query embedding
2. Parallel searches:
   - Entities: name/alias match + embedding similarity
   - Facts: embedding similarity, filter by entity if matched
   - Reflections: embedding similarity
   - Decisions: embedding similarity
   - Arguments: title + claim embedding similarity
3. Rank and deduplicate
4. Format context for LLM
5. Generate response with citations
```

### Context Assembly

```
Retrieved context for your query:

ENTITY: MongoDB (technology)
- Associated facts: 3
- Mentioned in decisions: 1
- Referenced in arguments: 0

FACTS:
1. [high confidence, verified] "MongoDB uses B-tree indexes for most operations"
2. [medium confidence, unverified] "MongoDB Atlas starts at ~$50/month for production"
3. [high confidence, verified] "I evaluated MongoDB for the journal bot project"

REFLECTIONS:
1. "I'm impressed by MongoDB's developer experience"

DECISIONS:
1. "Chose PostgreSQL over MongoDB for the journal bot" 
   Reasoning: "Need vector search (pgvector) and complex joins"

Based on this context, respond to the user's query...
```

---

## Insight Surfacing

A key differentiator addressing the "capture without transform" failure mode.

### Weekly Digest (Sundays)

Generated summary of the week's knowledge activity.

**Contents**:
- New facts extracted (count by entity)
- Reflections and their themes
- Decisions made
- Open questions
- Arguments in progress

**Delivery**: Email or push notification with link to web view

### Connection Prompts

Proactive suggestions based on patterns.

**Triggers**:
- Entity mentioned 3+ times without associated decision
- Question open for 30+ days
- Fact superseded (contradiction detected)
- Decision made 6+ months ago (review prompt)

**Examples**:
- "You've mentioned 'burnout' in 4 reflections this month. Want to explore this?"
- "Your question about TPM roles has been open for 45 days. Ready to work through it?"
- "You decided to use PostgreSQL 6 months ago. Has that worked out?"

### Periodic Surfacing

Instead of managed forgetting, bring old knowledge back into attention.

**Monthly review queue**:
- 5 random facts older than 90 days: "Still accurate?"
- 3 decisions older than 6 months: "Still the right call?"
- Unverified items older than 60 days: "Worth keeping?"

User can: Verify, Dispute, Archive, or Dismiss

---

## Interfaces

### CLI (Primary Development Interface)

Simple conversational interface for capture and quick queries.

**Commands**:
```bash
# Start conversation
journal

# Query
journal ask "What do I know about MongoDB?"

# Review queue
journal review

# Start argument mode
journal argument

# Sync Obsidian
journal sync-obsidian /path/to/vault
```

**Conversation mode**:
```
> Hey, I've been thinking about the TPM transition

I hear you. You've mentioned this in 3 previous conversations. Last time
you noted feeling more energized by coordination work than coding.

What's on your mind about it today?

> I talked to Sarah and she thinks I'd be good at it

That's encouraging external validation. I've noted this as a fact about
your TPM consideration. Sarah is at [company] - is that the same Sarah
from your team?

> Yeah

Got it. Anything else from that conversation?
```

**Review mode**:
```
> journal review

5 items need review:

1. [fact, low confidence] "React 19 has automatic memoization"
2. [reflection, medium confidence] "I should exercise more"
3. [fact, low confidence] "MongoDB pricing starts at $50/month"
4. [decision, medium confidence] "Will focus on AI orchestration skills"
5. [question, 45 days old] "Should I pursue TPM roles?"

Enter: number to view, 1✓ to verify, 1✗ to dispute, 1d to delete, q to quit

> 1

[fact, low confidence]
"React 19 has automatic memoization"
Source: Conversation on 2024-11-15
Entity: React

This was extracted from: "I read that React 19 might have automatic 
memoization, but I'm not sure."

Actions: ✓ verify, ✗ dispute, d delete, s skip

> ✗

Marked as disputed. Add a note? (Enter to skip)

> Actually React Compiler does this, not React 19 itself

Got it. Created corrected fact: "React Compiler provides automatic 
memoization (not React 19 core)"

4 items remaining...
```

### Web UI (4 Screens)

#### 1. Dashboard

<div class="theme-image">
  <img class="light-only" src="/mmx-dashboard.svg" alt="Dashboard wireframe" />
  <img class="dark-only" src="/mmx-dashboard-dark.svg" alt="Dashboard wireframe" />
</div>

#### 2. Review Queue

<div class="theme-image">
  <img class="light-only" src="/mmx-review-queue.svg" alt="Review Queue wireframe" />
  <img class="dark-only" src="/mmx-review-queue-dark.svg" alt="Review Queue wireframe" />
</div>

#### 3. Argument Viewer

<div class="theme-image">
  <img class="light-only" src="/mmx-argument-viewer.svg" alt="Argument Viewer wireframe" />
  <img class="dark-only" src="/mmx-argument-viewer-dark.svg" alt="Argument Viewer wireframe" />
</div>

#### 4. Search

Unified search with filters, replacing separate browsers.

<div class="theme-image">
  <img class="light-only" src="/mmx-search.svg" alt="Search wireframe" />
  <img class="dark-only" src="/mmx-search-dark.svg" alt="Search wireframe" />
</div>

**Entity detail view** (modal or drill-down from search):

<div class="theme-image">
  <img class="light-only" src="/mmx-entity-detail.svg" alt="Entity Detail View wireframe" />
  <img class="dark-only" src="/mmx-entity-detail-dark.svg" alt="Entity Detail View wireframe" />
</div>


#### Knowledge

```
GET /knowledge/search
Query params: q, type[], confidence[], verification[], entityId, tag[], limit, offset
Response:
{
  "results": [
    { "type": "entity", "item": {...}, "score": 0.95 },
    { "type": "fact", "item": {...}, "score": 0.87 },
    ...
  ],
  "total": number,
  "facets": {
    "types": { "fact": 12, "reflection": 5, ... },
    "entities": [ { "id": "...", "name": "MongoDB", "count": 8 } ]
  }
}

GET /knowledge/entities/:id
Response:
{
  "entity": {...},
  "facts": [...],
  "reflections": [...],
  "decisions": [...],
  "arguments": [...]
}

GET /knowledge/arguments
Query params: status
Response:
{
  "arguments": [
    {
      "id": "uuid",
      "title": "string",
      "claim": "string",
      "status": "open | concluded | abandoned",
      "evidenceCount": number,
      "supportCount": number,
      "refuteCount": number
    }
  ]
}

GET /knowledge/arguments/:id
Response:
{
  "argument": {
    "id": "uuid",
    "title": "string",
    "claim": "string",
    "qualifier": "string",
    "status": "string",
    "evidence": [
      {
        "id": "uuid",
        "content": "string",
        "relationship": "supports | refutes",
        "strength": "strong | medium | weak",
        "premise": "string | null",
        "isAddressed": boolean,
        "groundingFacts": [...]
      }
    ],
    "conclusionDecision": {...} | null
  },
  "relatedKnowledge": {
    "facts": [...],
    "reflections": [...],
    "decisions": [...]
  }
}

GET /knowledge/review-queue
Query params: type[], limit
Response:
{
  "items": [
    {
      "type": "fact | reflection | decision | question",
      "item": {...},
      "reason": "low_confidence | unverified | stale_question | old_decision"
    }
  ],
  "total": number
}
```

#### Curation

```
POST /curation/verify
Request: { "itemType": "fact | reflection | decision", "itemId": "uuid" }

POST /curation/dispute
Request: { "itemType": "...", "itemId": "uuid", "note": "string | null" }

DELETE /curation/:itemType/:itemId

POST /curation/link-evidence
Request: {
  "factId": "uuid",
  "argumentId": "uuid",
  "relationship": "supports | refutes",
  "strength": "strong | medium | weak"
}

POST /curation/promote-to-argument
Request: { "reflectionId": "uuid" }
Response: { "argumentId": "uuid" }

POST /curation/merge
Request: {
  "itemType": "entity | fact",
  "keepId": "uuid",
  "mergeIds": ["uuid", ...]
}

POST /curation/tags
Request: {
  "itemType": "...",
  "itemId": "uuid",
  "tags": ["tag1", "tag2"]
}
```

#### Documents

```
POST /documents/upload-url
Request: { "filename": "string", "mimeType": "string" }
Response: { "uploadUrl": "string", "documentId": "uuid" }

POST /documents/obsidian-sync
Request: { "s3Prefix": "string" }
Response: { "jobId": "uuid", "filesFound": number }

GET /documents/:id/status
Response: { "processed": boolean, "extractedItems": number }
```

#### Insights

```
GET /insights/digest
Query params: week (ISO date)
Response: {
  "week": "2024-11-10",
  "summary": {
    "factsExtracted": 15,
    "reflections": 8,
    "decisions": 3,
    "questionsOpened": 2,
    "questionsClosed": 1
  },
  "themes": ["career transition", "AI tools", ...],
  "highlights": [...]
}

GET /insights/prompts
Response: {
  "prompts": [
    {
      "type": "connection | review | stale_question",
      "content": "You've mentioned burnout 4 times...",
      "relatedItems": [...]
    }
  ]
}
```

#### Events

```
POST /events
Request: {
  "type": "git_commit | idle_return | calendar_event",
  "payload": {...}
}
Response: {
  "eventId": "uuid",
  "promptGenerated": boolean,
  "prompt": "string | null"
}
```

---

## AWS Infrastructure (CDK)

### Architecture Diagram

<div class="theme-image">
  <img class="light-only" src="/mmx-architecture.svg" alt="AWS Architecture Diagram" />
  <img class="dark-only" src="/mmx-architecture-dark.svg" alt="AWS Architecture Diagram" />
</div>

<details>
<summary>CDK Stack Overview</summary>

```typescript
// lib/journal-bot-stack.ts

export class JournalBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC for RDS
    const vpc = new ec2.Vpc(this, 'JournalVpc', {
      maxAzs: 2,
      natGateways: 1,
    });

    // RDS Aurora Serverless v2
    const dbCluster = new rds.DatabaseCluster(this, 'KnowledgeDb', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_4,
      }),
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 2,
      vpc,
      defaultDatabaseName: 'journal',
    });

    // DynamoDB for conversations
    const conversationsTable = new dynamodb.Table(this, 'Conversations', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // S3 for documents
    const documentsBucket = new s3.Bucket(this, 'Documents', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Secrets Manager for API keys
    const anthropicApiKey = new secretsmanager.Secret(this, 'AnthropicKey');

    // Lambda functions...
    // API Gateway...
    // EventBridge scheduler...
  }
}
```

</details>

### Cost Estimate

| Service | Configuration | Monthly Cost |
|---------|--------------|--------------|
| RDS Aurora Serverless v2 | 0.5-2 ACU | $12-15 |
| Claude API | ~500K tokens | ~$1.50 |
| Bedrock Titan | ~100K tokens | ~$0.01 |
| Secrets Manager | 2 secrets | ~$1.50 |
| DynamoDB | On-demand, low volume | $0 (free tier) |
| S3 | < 1 GB | $0 (free tier) |
| Lambda | Low invocations | $0 (free tier) |
| API Gateway | Low requests | $0 (free tier) |
| CloudWatch | Basic logging | ~$1 |
| **Total** | | **~$16-20** |

---

## Implementation Roadmap

### Phase 1: Foundation (1 week)

**Goal**: Basic chat working end-to-end

- [ ] CDK stack: VPC, DynamoDB, API Gateway, base Lambda
- [ ] Chat Lambda: conversation storage, Claude integration
- [ ] CLI client: basic conversation mode
- [ ] Local development setup

**Deliverable**: Can have a conversation via CLI, messages stored in DynamoDB

### Phase 2: Knowledge Extraction (1.5 weeks)

**Goal**: Automatic extraction with RAG retrieval

- [ ] RDS Aurora Serverless + pgvector setup
- [ ] PostgreSQL schema deployment
- [ ] Extraction Lambda: Entity, Fact, Reflection, Decision
- [ ] Bedrock Titan embedding integration
- [ ] RAG retrieval in chat responses
- [ ] EventBridge scheduler for nightly extraction
- [ ] Supersession detection

**Deliverable**: Chat responses include relevant past knowledge

### Phase 3: Web UI (1.5 weeks)

**Goal**: Review and search interface

- [ ] React app setup (Vite + TypeScript + Tailwind)
- [ ] Dashboard screen
- [ ] Review Queue screen with actions
- [ ] Search screen with filters
- [ ] Argument Viewer screen
- [ ] Entity detail modal
- [ ] Deploy to S3 + CloudFront

**Deliverable**: Can browse and curate knowledge via web

### Phase 4: Curation + Insights (1 week)

**Goal**: Complete curation workflow plus insight surfacing

- [ ] All curation API endpoints
- [ ] Curation actions in CLI
- [ ] Weekly digest generation
- [ ] Connection prompts logic
- [ ] Periodic surfacing queue
- [ ] Email/notification delivery

**Deliverable**: System actively surfaces insights

### Phase 5: Arguments (1 week)

**Goal**: Full argument mode

- [ ] Argument extraction prompts
- [ ] `/argument` command in CLI
- [ ] Argument mode conversation flow
- [ ] Evidence linking to facts
- [ ] Retroactive argument structuring
- [ ] Argument Viewer enhancements

**Deliverable**: Can build and visualize structured arguments

### Phase 6: Document Ingestion (0.5 weeks)

**Goal**: Process uploaded documents

- [ ] S3 upload with presigned URLs
- [ ] Document processing Lambda
- [ ] PDF, TXT, MD, DOCX parsing
- [ ] Reference extraction
- [ ] Document status tracking

**Deliverable**: Can upload and extract from documents

### Phase 7: Obsidian Integration (0.5 weeks)

**Goal**: Sync Obsidian vault

- [ ] S3 sync endpoint
- [ ] Obsidian-specific parsing
- [ ] Incremental sync tracking
- [ ] CLI sync command

**Deliverable**: Obsidian notes feed into knowledge base

### Phase 8: Events & Prompts (0.5 weeks)

**Goal**: Contextual prompting

- [ ] Event ingestion endpoint
- [ ] Git commit hook script
- [ ] Idle detection prompt logic
- [ ] Push notification setup (SNS)

**Deliverable**: Proactive prompts based on context

---

### CHECKPOINT: ~7 weeks

**Evaluate**:
- Are you using the system daily?
- What features are actually valuable?
- What's missing that blocks regular use?

**Decision**: Continue to mobile apps or iterate on core?

---

### Phase 9+: Mobile Apps (TBD)

Only if checkpoint confirms value:

- [ ] Mac app (SwiftUI)
- [ ] Android app (Jetpack Compose)
- [ ] Push notification handling
- [ ] Quick capture widgets

---

## Security Considerations

### Data Protection

- RDS encryption at rest (AWS managed keys)
- S3 encryption at rest
- HTTPS for all API traffic
- Secrets in AWS Secrets Manager

### Network Security

- RDS in private subnets
- Lambda in VPC for RDS access
- API Gateway with API key authentication
- No public database access

### Future Enhancements

- AWS Cognito for proper auth
- Client-side encryption for sensitive entries
- Audit logging
- Data export/deletion tools

---

## Appendix: Extraction Prompt Templates

### Standard Extraction

```
You are extracting structured knowledge from a personal journal conversation.

Current date: {date}
User context: {user_context}

Conversation:
{messages}

Extract and return JSON with:

{
  "entities": [
    {
      "name": "canonical name",
      "type": "person|organization|place|concept|project|technology",
      "aliases": ["alternative names used"],
      "isNew": true/false,
      "matchedEntityId": "uuid if matching existing"
    }
  ],
  "facts": [
    {
      "content": "the factual statement",
      "entityName": "associated entity or null",
      "confidence": "high|medium|low",
      "confidenceReason": "why this confidence level",
      "possibleContradiction": "existing fact it might contradict or null"
    }
  ],
  "reflections": [
    {
      "content": "the reflection",
      "isQuestion": true/false,
      "confidence": "high|medium|low"
    }
  ],
  "decisions": [
    {
      "content": "what was decided",
      "reasoning": "any reasoning mentioned",
      "confidence": "high|medium|low"
    }
  ]
}

Guidelines:
- Extract only what is explicitly stated or clearly implied
- For confidence: high = definitive statement, medium = qualified, low = uncertain
- Mark isQuestion=true for wonderings, open questions, things to figure out
- Include reasoning for decisions even if informal
- Do NOT create argument structures - only explicit claims with evidence
```

### Argument Mode

```
You are helping structure an argument about a decision or belief.

Current argument state:
{argument_state}

User message:
{message}

Your role:
1. If no claim yet: Help clarify and state the main claim
2. If gathering evidence: Identify if this is supporting or refuting evidence
3. Distinguish evidence (external facts) from premises (reasoning steps)
4. Suggest strength ratings based on how compelling the evidence is
5. When appropriate, ask about counterarguments
6. When user is ready, help formulate conclusion

Respond conversationally, then provide structured update:

{
  "claim": "updated claim if changed",
  "qualifier": "certainly|probably|possibly|null",
  "newEvidence": [
    {
      "content": "the evidence",
      "relationship": "supports|refutes",
      "strength": "strong|medium|weak",
      "isPremise": true/false,
      "premiseText": "if isPremise, the reasoning"
    }
  ],
  "suggestedAction": "ask_for_counterarguments|ready_to_conclude|continue_gathering"
}
```

---

## Appendix: Example Conversation Flows

### Normal Conversation with Extraction

```
User: I've been researching MongoDB vs PostgreSQL for the journal bot.
      MongoDB has a nicer query API but PostgreSQL has pgvector built in.

Bot: That's a solid comparison. PostgreSQL's native pgvector support is 
     particularly relevant for RAG applications - you avoid the operational 
     complexity of a separate vector store.

     I've noted two facts about your research:
     - MongoDB has a nicer query API (your assessment)
     - PostgreSQL has pgvector built in
     
     Are you leaning toward a decision?

User: Yeah, I think PostgreSQL makes more sense for this use case.

Bot: Got it. I've recorded your decision: "PostgreSQL for the journal bot 
     because of pgvector support." Want me to capture any additional 
     reasoning?

User: The ability to do hybrid queries - combining regular SQL with vector 
      similarity - is the main thing.

Bot: Added to your reasoning. This is now stored as a decision with context
     about hybrid query capabilities being the deciding factor.
```

### Review Session

```
User: journal review

Bot: You have 8 items in your review queue:

     LOW CONFIDENCE (3):
     1. "React 19 has automatic memoization" - from Nov 15
     2. "MongoDB Atlas costs $50/month" - from Nov 10  
     3. "Kubernetes is overkill for small projects" - from Nov 8

     STALE QUESTIONS (2):
     4. "Should I pursue TPM roles?" - 45 days old
     5. "Is AI consulting viable as a freelancer?" - 30 days old

     OLD DECISIONS (3):
     6. "Focus on AI orchestration skills" - 4 months old
     7. "Use GTD methodology" - 6 months old
     8. "Prioritize PostgreSQL expertise" - 5 months old

     Enter a number to review, or 'q' to quit.

User: 1

Bot: FACT (low confidence):
     "React 19 has automatic memoization"
     
     Extracted from: "I read somewhere that React 19 might have automatic 
     memoization, not sure if that's accurate."
     
     The low confidence is because you expressed uncertainty ("might", 
     "not sure").

     Actions:
     - verify: Mark as accurate
     - dispute: Mark as incorrect (add correction)
     - delete: Remove entirely
     - skip: Review later

User: dispute

Bot: What's the correction?

User: It's the React Compiler that does this, not React 19 itself.

Bot: Got it. I've:
     - Marked the original fact as disputed
     - Created new fact: "React Compiler provides automatic memoization 
       (separate from React 19 core)"
     
     7 items remaining. Next?
```

---

*Document version: 2.0*
*Last updated: December 2024*

