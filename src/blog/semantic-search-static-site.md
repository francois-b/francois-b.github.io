---
title: "Building Semantic Search for a Static Site (Without a Backend)"
date: "2024-12-13"
slug: "semantic-search-static-site"
tags: ["ai", "gatsby", "javascript", "developer-tools"]
author: "Jake"
vimeoId: "1146231562"
---

I just shipped semantic search and related article recommendations for this blog—all running client-side, no API calls, no backend. Here's how it works and why you might want to do this yourself.

## The Problem with Tags at Scale

Tags work fine when you have 20 articles. You click "aws" and see your AWS posts. Simple.

But tags have limits:

1. **Taxonomy is arbitrary.** Your mental model of what belongs under "infrastructure" might not match your readers' expectations.
2. **Articles span concerns.** A post about AI-assisted DevOps touches both categories. Where does it go?
3. **Discovery vs. retrieval.** Tags help when you know what you want. They don't help when you're exploring.

The real killer: users searching for "how to think about career decisions when AI is changing everything" won't find your article titled "Staying Level-Headed When AI Is Changing Everything" unless those exact words appear.

## The Solution: Vector Embeddings

Instead of keyword matching, we embed articles as vectors in a high-dimensional space. Articles that are *semantically similar*—about the same concepts, even with different words—end up close together.

This enables two features:

1. **Related Articles:** "You're reading about X, here are other articles about similar things"
2. **Semantic Search:** "Find articles about *this concept*" even if the words don't match

The key insight: we can compute embeddings at build time and serve them as static JSON. The similarity computation happens in the browser—no backend needed.

## Architecture

```
Build Time                          Runtime (Browser)
───────────                         ─────────────────

┌─────────────┐                     ┌─────────────────┐
│ Markdown    │                     │ User types      │
│ Articles    │                     │ search query    │
└──────┬──────┘                     └────────┬────────┘
       │                                     │
       ▼                                     ▼
┌─────────────┐                     ┌─────────────────┐
│ Extract     │                     │ Embed query     │
│ title +     │                     │ (lazy-load      │
│ excerpt     │                     │  model ~30MB)   │
└──────┬──────┘                     └────────┬────────┘
       │                                     │
       ▼                                     ▼
┌─────────────┐                     ┌─────────────────┐
│ Generate    │                     │ Cosine          │
│ embeddings  │──────────────────▶  │ similarity      │
│ (MiniLM)    │   embeddings.json   │ against all     │
└──────┬──────┘   (~150KB gzipped)  │ articles        │
       │                            └────────┬────────┘
       ▼                                     │
┌─────────────┐                              ▼
│ public/     │                     ┌─────────────────┐
│ embeddings  │                     │ Show ranked     │
│ .json       │                     │ results         │
└─────────────┘                     └─────────────────┘
```

## Implementation: Build Time

In `gatsby-node.js`, I added an `onPostBuild` hook that:

1. Queries all blog posts via GraphQL
2. Extracts title + excerpt for each
3. Generates 384-dimensional embeddings using `all-MiniLM-L6-v2`
4. Writes the results to `public/embeddings.json`

```javascript
// gatsby-node.js (simplified)
const { pipeline } = require('@xenova/transformers');

exports.onPostBuild = async ({ graphql }) => {
  const result = await graphql(`
    query {
      allMarkdownRemark {
        nodes {
          frontmatter { title, slug, tags }
          excerpt(pruneLength: 500)
        }
      }
    }
  `);

  const embedder = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2'
  );

  const embeddings = await Promise.all(
    result.data.allMarkdownRemark.nodes.map(async (node) => {
      const text = `${node.frontmatter.title}. ${node.excerpt}`;
      const output = await embedder(text, {
        pooling: 'mean',
        normalize: true
      });

      return {
        slug: node.frontmatter.slug,
        title: node.frontmatter.title,
        embedding: Array.from(output.data)
      };
    })
  );

  fs.writeFileSync('./public/embeddings.json', JSON.stringify(embeddings));
};
```

The model runs in Node.js at build time via `@xenova/transformers`, which is a JavaScript port of Hugging Face's transformers library. No Python, no external API.

Build time for 36 articles: about 30 seconds.

## Implementation: Related Articles

The `RelatedArticles` component fetches the embeddings JSON and computes similarity:

```typescript
// RelatedArticles.tsx (simplified)
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
  }
  return dot; // vectors are pre-normalized
}

const RelatedArticles = ({ currentSlug }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetch('/embeddings.json')
      .then(r => r.json())
      .then(articles => {
        const current = articles.find(a => a.slug === currentSlug);
        if (!current) return;

        const scored = articles
          .filter(a => a.slug !== currentSlug)
          .map(a => ({
            ...a,
            score: cosineSimilarity(current.embedding, a.embedding)
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        setRelated(scored);
      });
  }, [currentSlug]);

  // render...
};
```

For 36 articles with 384-dimensional vectors, computing all pairwise similarities takes less than 1ms. This scales fine to hundreds of articles.

## Implementation: Semantic Search

Search is more interesting because we need to embed the user's query at runtime. This means loading the model in the browser.

The model is ~30MB. That's too heavy to load upfront, so we lazy-load it when the user focuses the search input:

```typescript
// SemanticSearch.tsx (simplified)
const SemanticSearch = () => {
  const embedderRef = useRef(null);
  const [modelLoading, setModelLoading] = useState(false);

  const loadEmbedder = async () => {
    if (embedderRef.current) return embedderRef.current;

    setModelLoading(true);
    const { pipeline } = await import('@xenova/transformers');
    embedderRef.current = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2'
    );
    setModelLoading(false);
    return embedderRef.current;
  };

  const search = async (query) => {
    const embedder = await loadEmbedder();
    const queryEmbed = await embedder(query, {
      pooling: 'mean',
      normalize: true
    });

    // Score all articles against query embedding
    const scored = embeddings.map(article => ({
      ...article,
      score: cosineSimilarity(queryEmbed.data, article.embedding)
    }));

    return scored.sort((a, b) => b.score - a.score).slice(0, 10);
  };

  // Pre-load model on input focus
  const handleFocus = () => {
    if (!embedderRef.current && !modelLoading) {
      loadEmbedder();
    }
  };

  // render...
};
```

First search takes 2-3 seconds while the model loads. Subsequent searches are nearly instant because the model is cached.

## The Webpack Problem

One gotcha: `@xenova/transformers` includes `onnxruntime-node`, which is a native Node.js module. Gatsby's webpack tries to bundle it for SSR and fails.

The fix is to configure webpack to exclude these modules during HTML generation:

```javascript
// gatsby-node.js
exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      externals: getConfig().externals.concat((context, request, callback) => {
        if (/onnxruntime-node|sharp/.test(request)) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      }),
    });
  }
};
```

## Performance Budget

| Asset | Size | Load Strategy |
|-------|------|---------------|
| embeddings.json (36 articles) | ~380KB (~100KB gzipped) | Lazy load on article pages |
| Transformer model | ~30MB | Lazy load on search focus, cached by browser |
| Similarity computation | <1ms | Inline, negligible |

At 300 articles, embeddings.json would be about 3MB uncompressed, ~800KB gzipped. Still acceptable for lazy loading.

## What I'd Do Differently

**Pre-compute related articles at build time.** Right now, every article page fetches the full embeddings.json and computes similarity client-side. For 36 articles, this is fine. At scale, I'd compute the top 5 related articles per post during build and include them directly in the page data.

**Add a similarity threshold.** Currently I show the top 5 related articles regardless of similarity score. Some articles might not have strong matches. I should hide the section if all scores are below, say, 0.4.

**Consider a smaller model for search.** 30MB is heavy. There are quantized versions that are smaller, though potentially lower quality. Worth testing.

## Is This Worth It?

For 30 articles? Probably overkill. Tags work fine.

For 100+ articles where you want real discovery? Absolutely. Semantic search surfaces connections that keyword search misses. Related articles keep readers engaged without you manually curating "see also" links.

The best part: it's all static. No API costs, no backend to maintain, no latency from network calls. Build once, serve forever.

The embeddings infrastructure also opens up future possibilities: auto-generated topic clusters, conversational Q&A over your content, recommendation systems. All client-side, all from the same embedding vectors.

That's the leverage of computing embeddings once and reusing them everywhere.
