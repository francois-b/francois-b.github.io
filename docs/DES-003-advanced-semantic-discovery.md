# DES-003: Advanced Semantic Discovery — Emergent Clusters & Conversational Interface

**Status:** Draft
**Created:** 2024-12-13
**Author:** Jake (Design), Claude Code
**Project:** cv-website
**Prerequisites:** DES-002 Phase 1-2 implemented

## Overview

This document details the advanced phases of the semantic article discovery system:

- **Phase 3:** Emergent Topic Clusters — automatically derived navigation from embedding space
- **Phase 4:** Conversational Discovery — RAG-powered "ask the blog" interface

These phases are designed for 100+ articles where manual taxonomy becomes burdensome and users benefit from more exploratory interfaces.

---

## Phase 3: Emergent Topic Clusters

### Problem Statement

The current `TOPIC_CLUSTERS` in `blog.js` are hand-coded:

```javascript
const TOPIC_CLUSTERS = {
  "AI & Tools": ["ai", "claude-code", "llm", "developer-tools", "automation"],
  "Web Development": ["gatsby", "react", "typescript", "javascript", "graphql"],
  // ...
}
```

This approach has limitations:
1. **Manual maintenance:** Every new topic area requires updating the map
2. **Arbitrary boundaries:** Your mental model may not match readers' expectations
3. **Missed connections:** Articles that bridge topics don't surface relationships
4. **Doesn't scale:** At 300 articles with 100 tags, manual clustering is untenable

### Solution: Clustering in Embedding Space

Instead of defining clusters by tags, derive them from semantic similarity. Articles that are *about* similar things will cluster naturally, regardless of how they're tagged.

### Algorithm Selection

**Recommended: K-Means with Silhouette Analysis**

Why K-Means:
- Simple, well-understood, fast
- Works well with normalized embeddings
- Deterministic (given seed)
- Easy to explain: "these articles are mathematically similar"

Why Silhouette Analysis:
- Automatically suggests optimal k
- Avoids over/under-clustering
- Provides quality score per cluster

**Alternatives considered:**

| Algorithm | Pros | Cons |
|-----------|------|------|
| DBSCAN | No need to specify k, finds outliers | Sensitive to epsilon, inconsistent cluster sizes |
| Hierarchical | Shows relationships at multiple levels | Complex UI, overkill for navigation |
| HDBSCAN | Handles varying densities | More complex, less predictable |
| Gaussian Mixture | Soft clustering (articles can belong to multiple) | Harder to explain, UI complexity |

### Implementation

#### Build-Time Clustering Script

```javascript
// scripts/generate-clusters.js
const { kmeans } = require('ml-kmeans');
const { silhouette } = require('ml-clustering-eval');

async function generateClusters(embeddings, options = {}) {
  const {
    minK = 4,
    maxK = 12,
    seed = 42
  } = options;

  const vectors = embeddings.map(e => e.embedding);

  // Find optimal k using silhouette score
  let bestK = minK;
  let bestScore = -1;

  for (let k = minK; k <= maxK; k++) {
    const result = kmeans(vectors, k, { seed });
    const score = silhouette(vectors, result.clusters);

    console.log(`k=${k}, silhouette=${score.toFixed(3)}`);

    if (score > bestScore) {
      bestScore = score;
      bestK = k;
    }
  }

  console.log(`\nOptimal k: ${bestK} (silhouette: ${bestScore.toFixed(3)})`);

  // Final clustering with optimal k
  const { clusters, centroids } = kmeans(vectors, bestK, { seed });

  // Group articles by cluster
  const clusteredArticles = {};
  clusters.forEach((clusterId, articleIdx) => {
    if (!clusteredArticles[clusterId]) {
      clusteredArticles[clusterId] = [];
    }
    clusteredArticles[clusterId].push(embeddings[articleIdx]);
  });

  return {
    k: bestK,
    silhouetteScore: bestScore,
    clusters: clusteredArticles,
    centroids
  };
}

module.exports = { generateClusters };
```

#### Cluster Labeling Strategies

Raw cluster IDs (0, 1, 2...) aren't useful for navigation. We need human-readable labels.

**Strategy 1: Representative Article Titles**

Use the article closest to each centroid as the cluster's representative:

```javascript
function labelByRepresentative(clusters, centroids, embeddings) {
  return Object.entries(clusters).map(([clusterId, articles]) => {
    const centroid = centroids[clusterId];

    // Find article closest to centroid
    let closest = null;
    let minDist = Infinity;

    articles.forEach(article => {
      const dist = euclideanDistance(article.embedding, centroid);
      if (dist < minDist) {
        minDist = dist;
        closest = article;
      }
    });

    return {
      id: clusterId,
      label: closest.title,
      representativeSlug: closest.slug,
      articles: articles.map(a => a.slug)
    };
  });
}
```

**Pros:** No external dependencies, always accurate
**Cons:** Titles may be too specific, not always intuitive as category names

**Strategy 2: Common Tag Extraction**

Find the most common tags within each cluster:

```javascript
function labelByCommonTags(clusters) {
  return Object.entries(clusters).map(([clusterId, articles]) => {
    const tagCounts = {};

    articles.forEach(article => {
      article.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);

    return {
      id: clusterId,
      label: topTags.join(' / '),
      topTags,
      articles: articles.map(a => a.slug)
    };
  });
}
```

**Pros:** Leverages existing metadata, predictable
**Cons:** May miss semantic themes not captured in tags

**Strategy 3: LLM-Generated Labels (Recommended)**

Send cluster article titles to an LLM and ask for a concise category name:

```javascript
async function labelWithLLM(clusters, anthropicClient) {
  const labeledClusters = [];

  for (const [clusterId, articles] of Object.entries(clusters)) {
    const titles = articles.map(a => a.title).join('\n- ');

    const response = await anthropicClient.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: `These blog posts belong to the same topic cluster. Generate a short (2-4 word) category label that captures their common theme:\n\n- ${titles}\n\nLabel:`
      }]
    });

    const label = response.content[0].text.trim();

    labeledClusters.push({
      id: clusterId,
      label,
      articles: articles.map(a => a.slug)
    });
  }

  return labeledClusters;
}
```

**Pros:** Most human-readable labels, captures semantic themes
**Cons:** API dependency, small cost (~$0.01 per build)

**Recommendation:** Use Strategy 3 (LLM labeling) with Strategy 2 (common tags) as fallback. Cache labels and only regenerate when cluster membership changes significantly.

#### Output Format

```json
// public/clusters.json
{
  "generated": "2024-12-13T10:30:00Z",
  "k": 7,
  "silhouetteScore": 0.42,
  "clusters": [
    {
      "id": "0",
      "label": "AI-Assisted Development",
      "topTags": ["ai", "developer-tools", "automation"],
      "representativeSlug": "ai-code-review-reality",
      "articles": ["ai-code-review-reality", "ai-devops-reality", "what-ai-cant-replace", ...]
    },
    {
      "id": "1",
      "label": "Cloud Infrastructure",
      "topTags": ["aws", "cloud", "infrastructure"],
      "representativeSlug": "cloud-maintenance-2025",
      "articles": ["cloud-maintenance-2025", "cost-of-cloud-complexity", ...]
    },
    // ...
  ]
}
```

#### UI Integration

Replace static `TOPIC_CLUSTERS` with dynamic clusters:

```typescript
// components/TopicClusters.tsx
import { useEffect, useState } from 'react';

interface Cluster {
  id: string;
  label: string;
  articles: string[];
}

export function TopicClusters({ onClusterSelect, activeCluster }) {
  const [clusters, setClusters] = useState<Cluster[]>([]);

  useEffect(() => {
    fetch('/clusters.json')
      .then(r => r.json())
      .then(data => setClusters(data.clusters));
  }, []);

  return (
    <nav className="topic-clusters" aria-label="Browse by topic">
      {clusters.map(cluster => (
        <button
          key={cluster.id}
          className={`cluster-btn ${activeCluster === cluster.id ? 'active' : ''}`}
          onClick={() => onClusterSelect(cluster.id)}
          aria-pressed={activeCluster === cluster.id}
        >
          {cluster.label}
          <span className="cluster-count">{cluster.articles.length}</span>
        </button>
      ))}
    </nav>
  );
}
```

#### Visual Exploration: Cluster Map (Optional Enhancement)

For a more exploratory interface, visualize clusters as a 2D map:

```javascript
// Reduce 384-dim embeddings to 2D using UMAP
const { UMAP } = require('umap-js');

function generateClusterMap(embeddings, clusters) {
  const umap = new UMAP({
    nComponents: 2,
    nNeighbors: 15,
    minDist: 0.1
  });

  const vectors = embeddings.map(e => e.embedding);
  const projected = umap.fit(vectors);

  return embeddings.map((e, i) => ({
    slug: e.slug,
    title: e.title,
    x: projected[i][0],
    y: projected[i][1],
    cluster: clusters.find(c => c.articles.includes(e.slug))?.id
  }));
}
```

Render with Canvas or SVG:

```typescript
// components/ClusterMap.tsx
export function ClusterMap({ points, onArticleSelect }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    // Scale points to canvas dimensions
    const xMin = Math.min(...points.map(p => p.x));
    const xMax = Math.max(...points.map(p => p.x));
    const yMin = Math.min(...points.map(p => p.y));
    const yMax = Math.max(...points.map(p => p.y));

    const scale = (val, min, max, size) =>
      ((val - min) / (max - min)) * (size - 40) + 20;

    const clusterColors = [
      '#e63946', '#457b9d', '#2a9d8f', '#e9c46a',
      '#f4a261', '#264653', '#a8dadc', '#9b5de5'
    ];

    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(
        scale(point.x, xMin, xMax, 600),
        scale(point.y, yMin, yMax, 400),
        6,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = clusterColors[point.cluster % clusterColors.length];
      ctx.fill();
    });
  }, [points]);

  const handleClick = (e) => {
    // Hit detection logic to find clicked article
    // ... trigger onArticleSelect(slug)
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      onClick={handleClick}
      className="cluster-map"
      aria-label="Visual map of article topics. Click to explore."
    />
  );
}
```

**Accessibility note:** The cluster map is a progressive enhancement. Always provide the list-based cluster navigation as the primary interface.

### Build Pipeline Integration

```javascript
// gatsby-node.js additions
const { generateClusters } = require('./scripts/generate-clusters');
const { labelWithLLM } = require('./scripts/label-clusters');

exports.onPostBuild = async ({ graphql }) => {
  // ... existing embedding generation from DES-002 ...

  // Generate clusters
  const clusterResult = await generateClusters(embeddings, {
    minK: 5,
    maxK: 10
  });

  // Label clusters
  const labeledClusters = await labelWithLLM(
    clusterResult.clusters,
    anthropicClient
  );

  // Write output
  fs.writeFileSync(
    './public/clusters.json',
    JSON.stringify({
      generated: new Date().toISOString(),
      k: clusterResult.k,
      silhouetteScore: clusterResult.silhouetteScore,
      clusters: labeledClusters
    }, null, 2)
  );
};
```

### Cluster Stability Considerations

Clusters may shift as articles are added. Mitigation strategies:

1. **Seed consistency:** Always use the same random seed
2. **Minimum cluster size:** Merge clusters with <3 articles into nearest neighbor
3. **Label caching:** Only regenerate labels if cluster membership changes >20%
4. **Diff reporting:** Log cluster changes in build output for visibility

---

## Phase 4: Conversational Discovery

### Problem Statement

Even with semantic search and clusters, users must formulate their needs as queries or navigation choices. Sometimes they want to *ask a question* and get a synthesized answer that references relevant articles.

Examples:
- "What's your take on AI replacing developers?"
- "How should I think about cloud costs?"
- "What are the most important things for a senior engineer to focus on?"

### Solution: RAG-Powered Chat Interface

Retrieval-Augmented Generation (RAG) combines semantic search with LLM synthesis:

1. User asks a question
2. Embed the question
3. Retrieve top-k relevant articles via cosine similarity
4. Send question + article excerpts to LLM
5. LLM generates answer with citations

### Architecture Options

#### Option A: Fully Client-Side (WebLLM)

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│  ┌─────────┐   ┌──────────┐   ┌────────────────┐  │
│  │ Question│──▶│ Embed    │──▶│ Retrieve Top 5 │  │
│  └─────────┘   │ (MiniLM) │   │ (embeddings.json)│ │
│                └──────────┘   └────────┬───────┘  │
│                                        │          │
│                              ┌─────────▼────────┐ │
│                              │ WebLLM (Llama 3) │ │
│                              │ Generate Answer  │ │
│                              └─────────┬────────┘ │
│                                        │          │
│                              ┌─────────▼────────┐ │
│                              │ Display Answer   │ │
│                              │ + Citations      │ │
│                              └──────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Pros:**
- Zero backend infrastructure
- No API costs after initial model download
- Complete privacy—nothing leaves the browser
- Works offline after first load

**Cons:**
- ~2GB model download on first use
- Slower inference (~5-10s on typical hardware)
- Memory pressure on mobile devices
- Quality limited by small model size

**Implementation:**

```typescript
// components/ConversationalSearch.tsx
import { useState, useRef } from 'react';

export function ConversationalSearch({ embeddings, articles }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const embedderRef = useRef(null);
  const llmRef = useRef(null);

  const initModels = async () => {
    setStatus('Loading embedding model...');
    const { pipeline } = await import('@xenova/transformers');
    embedderRef.current = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );

    setStatus('Loading language model (this may take a minute)...');
    const { CreateMLCEngine } = await import('@mlc-ai/web-llm');
    llmRef.current = await CreateMLCEngine('Llama-3.2-1B-Instruct-q4f16_1-MLC');

    setStatus('');
  };

  const ask = async () => {
    if (!question.trim()) return;

    setLoading(true);

    // Initialize models if needed
    if (!embedderRef.current || !llmRef.current) {
      await initModels();
    }

    // Embed question
    setStatus('Understanding your question...');
    const queryEmbed = await embedderRef.current(question, {
      pooling: 'mean',
      normalize: true
    });

    // Retrieve relevant articles
    const scored = embeddings.map((emb, i) => ({
      article: articles[i],
      score: cosineSimilarity(queryEmbed.data, emb.embedding)
    }));

    const topArticles = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Build context
    const context = topArticles.map(({ article }) =>
      `## ${article.title}\n${article.excerpt}`
    ).join('\n\n');

    // Generate answer
    setStatus('Thinking...');
    const prompt = `You are a helpful assistant answering questions about a blog. Use ONLY the provided article excerpts to answer. Always cite which article(s) informed your answer.

## Question
${question}

## Relevant Articles
${context}

## Answer (cite articles by title)`;

    const response = await llmRef.current.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    });

    setAnswer({
      text: response.choices[0].message.content,
      sources: topArticles.map(({ article, score }) => ({
        title: article.title,
        slug: article.slug,
        relevance: score
      }))
    });

    setLoading(false);
    setStatus('');
  };

  return (
    <div className="conversational-search">
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask anything about these articles..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && ask()}
          disabled={loading}
        />
        <button onClick={ask} disabled={loading}>
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>

      {status && <p className="chat-status">{status}</p>}

      {answer && (
        <div className="chat-answer">
          <div className="answer-text">{answer.text}</div>
          <div className="answer-sources">
            <h4>Sources</h4>
            <ul>
              {answer.sources.map(source => (
                <li key={source.slug}>
                  <a href={`/blog/${source.slug}`}>{source.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
```

#### Option B: API-Based (Claude/OpenAI)

```
┌──────────────┐         ┌─────────────────────┐
│   Browser    │         │  Edge Function      │
│              │         │  (Cloudflare/Vercel)│
│ ┌──────────┐ │         │                     │
│ │ Question │─┼────────▶│ 1. Embed query      │
│ └──────────┘ │         │ 2. Retrieve articles│
│              │         │ 3. Call Claude API  │
│ ┌──────────┐ │         │ 4. Return answer    │
│ │ Answer + │◀┼─────────│                     │
│ │ Citations│ │         └─────────────────────┘
│ └──────────┘ │
└──────────────┘
```

**Pros:**
- Much better answer quality (Claude Sonnet vs. tiny local model)
- Fast responses (~2-3s)
- Works on any device
- No large downloads

**Cons:**
- Requires backend/edge function
- API costs (~$0.003 per question)
- API key management
- External dependency

**Implementation (Cloudflare Worker):**

```typescript
// functions/api/ask.ts
import Anthropic from '@anthropic-ai/sdk';

interface Env {
  ANTHROPIC_API_KEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { question, relevantArticles } = await context.request.json();

  const anthropic = new Anthropic({
    apiKey: context.env.ANTHROPIC_API_KEY
  });

  const context_text = relevantArticles.map(a =>
    `## ${a.title}\n${a.excerpt}`
  ).join('\n\n');

  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `You are answering questions about a blog. Use ONLY the provided excerpts. Cite articles by title.

Question: ${question}

Articles:
${context_text}

Answer:`
    }]
  });

  return new Response(JSON.stringify({
    answer: response.content[0].text,
    sources: relevantArticles.map(a => ({
      title: a.title,
      slug: a.slug
    }))
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
};
```

**Client-side retrieval + API synthesis:**

```typescript
// components/ConversationalSearch.tsx (API version)
const ask = async () => {
  setLoading(true);

  // Embed question client-side
  const embedder = await getEmbedder();
  const queryEmbed = await embedder(question, {
    pooling: 'mean',
    normalize: true
  });

  // Retrieve locally
  const topArticles = embeddings
    .map((emb, i) => ({
      article: articles[i],
      score: cosineSimilarity(queryEmbed.data, emb.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ article }) => article);

  // Send to API for synthesis
  const response = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      relevantArticles: topArticles
    })
  });

  const { answer, sources } = await response.json();
  setAnswer({ text: answer, sources });
  setLoading(false);
};
```

#### Option C: Hybrid (Recommended)

Use client-side retrieval (fast, no API call) + API synthesis (quality answers):

- Retrieval: Client-side embedding + cosine similarity (DES-002 infrastructure)
- Synthesis: Cloudflare Worker calling Claude Haiku

This minimizes API calls (only one per question) while maximizing quality.

### UI/UX Design

#### Placement

Two options:

1. **Dedicated page:** `/blog/ask` — Separate conversational interface
2. **Inline on blog index:** Expandable chat widget above article list

**Recommendation:** Start with dedicated page. Lower risk, clearer mental model for users.

#### Conversation Flow

```
┌─────────────────────────────────────────────────────────┐
│  Ask the Blog                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ What should I focus on as a senior engineer?    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                 [Ask]   │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  Based on the articles, senior engineers should        │
│  focus on what AI can't replace: understanding         │
│  requirements, making trade-offs, coordinating with    │
│  people, and debugging systems they didn't build.      │
│  The hard parts of software development remain         │
│  "stubbornly human problems."                          │
│                                                         │
│  As one article puts it, "The question isn't whether   │
│  AI will change software engineering. It already has.  │
│  The question is what kind of engineer you want to     │
│  be in this new landscape."                            │
│                                                         │
│  📚 Sources:                                            │
│  • What AI Can't Replace in Software Engineering       │
│  • Growth in the Age of Assistance                     │
│  • Staying Level-Headed When AI Is Changing Everything │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  [Follow-up question...]                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Conversation Memory (Optional Enhancement)

For multi-turn conversations, maintain context:

```typescript
const [conversationHistory, setConversationHistory] = useState([]);

const ask = async () => {
  // Include previous Q&A pairs in prompt
  const historyContext = conversationHistory.map(turn =>
    `Q: ${turn.question}\nA: ${turn.answer}`
  ).join('\n\n');

  const prompt = `Previous conversation:\n${historyContext}\n\nNew question: ${question}`;

  // ... rest of flow
};
```

**Recommendation:** Skip for v1. Single-turn Q&A is simpler and covers most use cases.

### Guardrails and Edge Cases

#### Off-Topic Questions

The LLM should only answer based on article content. Prompt engineering:

```
You are answering questions about a specific blog.
ONLY use information from the provided article excerpts.
If the question cannot be answered from these articles, say:
"I don't have articles that address this topic directly.
Here are some related pieces you might find interesting: [list top 3 by similarity]"
```

#### Empty Retrieval

If all similarity scores are below threshold (e.g., 0.3), don't call the LLM:

```typescript
const topArticles = scored.filter(s => s.score > 0.3).slice(0, 5);

if (topArticles.length === 0) {
  setAnswer({
    text: "I couldn't find articles closely related to your question. Try browsing by topic instead.",
    sources: []
  });
  return;
}
```

#### Rate Limiting

For API-based approach, implement rate limiting:

```typescript
// Simple in-memory rate limit (reset on deploy)
const requestCounts = new Map();

export const onRequest = async (context) => {
  const ip = context.request.headers.get('CF-Connecting-IP');
  const count = requestCounts.get(ip) || 0;

  if (count > 20) { // 20 questions per deployment cycle
    return new Response('Rate limited', { status: 429 });
  }

  requestCounts.set(ip, count + 1);
  // ... rest of handler
};
```

### Cost Analysis

**Option A (Client-Side):**
- Initial: ~2GB download per user (cached)
- Ongoing: $0

**Option B/C (API-Based with Claude Haiku):**
- Per question: ~$0.003 (500 input tokens + 500 output tokens)
- 1000 questions/month: ~$3
- 10,000 questions/month: ~$30

**Recommendation:** API costs are negligible for a personal blog. Use Option C for quality.

### Implementation Checklist

```markdown
## Phase 4 Implementation Checklist

### Infrastructure
- [ ] Set up Cloudflare Pages Functions (or Vercel Edge Functions)
- [ ] Configure ANTHROPIC_API_KEY as environment secret
- [ ] Create `/api/ask` endpoint

### Frontend
- [ ] Create ConversationalSearch component
- [ ] Integrate with existing embeddings infrastructure
- [ ] Add loading states and error handling
- [ ] Style chat interface

### UX
- [ ] Add `/blog/ask` page
- [ ] Link from blog index ("Can't find what you're looking for? Ask!")
- [ ] Add example questions as prompts
- [ ] Implement source linking (click to article)

### Guardrails
- [ ] Test off-topic question handling
- [ ] Implement similarity threshold
- [ ] Add rate limiting
- [ ] Monitor API usage

### Polish
- [ ] Add conversation history (optional)
- [ ] Mobile-responsive chat UI
- [ ] Keyboard navigation
- [ ] Analytics on question types
```

---

## Dependencies Summary

### Phase 3

| Package | Purpose | Size |
|---------|---------|------|
| `ml-kmeans` | K-means clustering | ~15KB |
| `umap-js` | Dimensionality reduction (optional) | ~50KB |
| `@anthropic-ai/sdk` | Cluster labeling (build-time only) | N/A |

### Phase 4

| Package | Purpose | Size |
|---------|---------|------|
| `@mlc-ai/web-llm` | Client-side LLM (Option A) | ~100KB + 2GB model |
| `@anthropic-ai/sdk` | API synthesis (Option B/C) | Server-side only |

---

## Decision Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Clustering algorithm | K-means | Simple, deterministic, good enough for 300 articles |
| Cluster labeling | LLM with tag fallback | Best balance of quality and reliability |
| Conversational architecture | Hybrid (client retrieval + API synthesis) | Quality answers without large client downloads |
| LLM for synthesis | Claude Haiku | Fast, cheap, good quality |
| Multi-turn conversation | Deferred | Single-turn covers most cases, simpler v1 |

---

## Success Metrics

### Phase 3
- Clusters feel intuitive (qualitative)
- Users click cluster navigation (vs. ignoring it)
- Reduced time to find relevant articles

### Phase 4
- Questions get satisfactory answers (user doesn't immediately leave)
- Sources are clicked (indicates trust in citations)
- Repeat usage (users come back to ask more)

---

## Open Questions

1. **Phase 3:** Should clusters be mutually exclusive, or allow overlap?
   - *Leaning:* Exclusive for simplicity. Overlap complicates UI.

2. **Phase 4:** Should we show confidence scores on answers?
   - *Leaning:* No. Adds complexity without clear user benefit.

3. **Phase 4:** Allow users to thumbs-up/down answers for quality feedback?
   - *Leaning:* Maybe later. Requires storage and adds friction.

---

*Start with Phase 3 when you hit 100 articles and manual clusters feel limiting. Add Phase 4 when users request it or when you want to differentiate the blog experience.*

*— Jake*
