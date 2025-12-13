---
title: Building a Text Information Density Analyzer for Gatsby
date: '2024-12-12'
slug: text-density-analyzer-gatsby
tags:
  - gatsby
  - nlp
  - javascript
  - llm
  - developer-tools
  - featured
quote: >-
  Dense writing respects the reader's time. These tools help you measure whether
  yours does.
summary: >-
  Build two-tier text analysis: fast JavaScript metrics plus LLM evaluation for
  writing quality.
---

Good writing is dense. Every sentence should earn its place. But how do you measure information density programmatically?

This post explores building a text analyzer for Gatsby that combines fast JavaScript NLP libraries for instant metrics with LLM-based evaluation for deeper quality assessment. The goal: surface writing quality issues at build time and give authors actionable feedback.

## The Two-Tier Approach

Text quality has two dimensions:

1. **Mechanical metrics** (sentence length, readability scores, lexical density) - fast, deterministic, compute at build time
2. **Subjective quality** (is this paragraph padding? does this add value?) - requires judgment, best handled by LLMs

We'll build both layers.

## JavaScript Libraries for Text Analysis

The JavaScript NLP ecosystem is surprisingly capable. Three library stacks emerge as best-in-class:

| Stack | Best For | Size |
|-------|----------|------|
| compromise + text-readability-ts + write-good | Browser-compatible analysis | ~220KB |
| wink-nlp | Performance-critical (650k tokens/sec) | ~10KB + 2MB model |
| retext ecosystem | Extensible prose linting | Modular |

### Readability Metrics

The `text-readability-ts` library provides all major readability formulas:

```typescript
import readability from 'text-readability-ts';

const text = 'Your article content here...';

const metrics = {
  fleschEase: readability.fleschKincaidReadingEase(text),  // 0-100 scale
  gradeLevel: readability.fleschKincaidGrade(text),        // US grade level
  smog: readability.smogIndex(text),                       // SMOG index
  consensus: readability.textStandard(text),               // Consensus grade
  difficultWords: readability.difficultWords(text)         // Complex word count
};
```

The Flesch Reading Ease score is particularly useful: 60-70 is plain English, 30-50 is academic, below 30 is dense technical writing.

### Lexical Density

Lexical density measures the ratio of content words (nouns, verbs, adjectives, adverbs) to total words. High-density text packs more meaning per word.

```javascript
import nlp from 'compromise';

function calculateLexicalDensity(text) {
  const doc = nlp(text);
  const totalWords = doc.terms().out('array').length;

  const contentWords = [
    ...doc.nouns().out('array'),
    ...doc.verbs().out('array'),
    ...doc.adjectives().out('array'),
    ...doc.adverbs().out('array')
  ].length;

  return (contentWords / totalWords * 100).toFixed(1) + '%';
}
```

Academic writing typically hits 60-70% lexical density. Conversational writing runs 40-50%.

### Detecting Weak Writing

The `write-good` library flags passive voice, weasel words, adverbs, and wordy phrases:

```javascript
import writeGood from 'write-good';

const suggestions = writeGood('So the report was written by the team.');
// [{index: 0, offset: 2, reason: "omit 'So' from beginning"},
//  {index: 15, offset: 18, reason: "'was written' is passive voice"}]
```

For granular control, standalone word lists provide curated vocabularies:

| Package | Count | Examples |
|---------|-------|----------|
| `hedges` | 162 | "a bit", "allegedly", "somewhat" |
| `fillers` | 80 | "basically", "frankly", "just" |
| `weasels` | 116 | "many", "some", "often" |
| `buzzwords` | 322 | "synergy", "leverage", "disrupt" |

## Gatsby Integration

Build-time analysis bakes metrics into static pages—instant display without JavaScript overhead.

### Adding Metrics via onCreateNode

Extend markdown nodes with computed metrics in `gatsby-node.js`:

```javascript
const readingTime = require('reading-time');
const textReadability = require('text-readability');

exports.onCreateNode = ({ node, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const content = node.rawMarkdownBody;
    const stats = readingTime(content);

    createNodeField({
      node,
      name: 'readingTime',
      value: {
        text: stats.text,
        minutes: stats.minutes,
        words: stats.words
      }
    });

    createNodeField({
      node,
      name: 'textMetrics',
      value: {
        wordCount: textReadability.lexiconCount(content),
        fleschReadingEase: textReadability.fleschReadingEase(content),
        fleschKincaidGrade: textReadability.fleschKincaidGrade(content),
        avgWordsPerSentence: textReadability.lexiconCount(content) /
                            textReadability.sentenceCount(content)
      }
    });
  }
};
```

### Schema Customization

Define explicit GraphQL types for type safety:

```javascript
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type TextMetrics {
      wordCount: Int!
      fleschReadingEase: Float!
      fleschKincaidGrade: Float!
      avgWordsPerSentence: Float!
    }

    type MarkdownRemarkFields {
      readingTime: ReadingTime
      textMetrics: TextMetrics
    }
  `);
};
```

### Displaying in Templates

Query and display metrics in blog post templates:

```jsx
const BlogPost = ({ data }) => {
  const { readingTime, textMetrics } = data.markdownRemark.fields;

  return (
    <article>
      <header>
        <h1>{data.markdownRemark.frontmatter.title}</h1>
        <div className="metrics-badge">
          {readingTime.text} · Grade {textMetrics.fleschKincaidGrade.toFixed(1)}
        </div>
      </header>
      {/* ... */}
    </article>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      fields {
        readingTime { text minutes words }
        textMetrics {
          wordCount
          fleschReadingEase
          fleschKincaidGrade
        }
      }
    }
  }
`;
```

## LLM-as-Judge for Deeper Evaluation

Algorithmic metrics miss subjective quality. Is this paragraph padding? Does this section add value? LLMs excel here.

Research shows GPT-4 achieves **85% agreement with human experts** versus 81% human-human agreement on text quality assessment.

### The G-Eval Framework

G-Eval uses chain-of-thought reasoning before scoring, improving correlation with human judgment:

```python
DENSITY_EVALUATION_PROMPT = """
You are an expert editor evaluating text for information density.

EVALUATION CRITERIA (score 1-5):
1. Delivers maximum value per word
2. Avoids filler phrases ("it's important to note...", "essentially...")
3. Every sentence adds new information
4. Uses precise language over vague descriptions
5. Avoids restating the same point

LOW-DENSITY PATTERNS TO PENALIZE:
- "In order to" instead of "to"
- "Due to the fact that" instead of "because"
- Throat-clearing ("As we can see...", "It goes without saying...")
- Redundant intensifiers ("very unique", "completely unanimous")

TEXT: {text}

First, identify specific low-density patterns. Then score.

OUTPUT (JSON):
{
  "low_density_examples": ["specific quotes"],
  "substantive_claims_count": N,
  "density_score": 1-5,
  "reasoning": "brief explanation"
}
"""
```

The key insight: require reasoning *before* the score. This grounds the evaluation and produces more consistent results.

### Calibration Matters

LLM judges have known biases:

| Bias | Description | Mitigation |
|------|-------------|------------|
| Positional | Prefers first/last position | Swap positions; accept only if consistent |
| Verbosity | Prefers longer responses | Explicit anti-verbosity instructions |
| Self-enhancement | Favors own model's outputs | Use different model as judge |

Key calibration techniques:

1. **Explanation-first prompting**: Require reasoning before the score
2. **Multiple evidence**: Generate 3-5 evaluations with temperature > 0, take majority vote
3. **Few-shot calibration**: Include 2-4 labeled examples spanning the score range
4. **Pairwise comparison**: More reliable than absolute scoring for subjective metrics

## Complete Analyzer

Combining all approaches:

<details>
<summary>Full analyzer implementation</summary>

```javascript
import nlp from 'compromise';
import readability from 'text-readability-ts';
import writeGood from 'write-good';
import { hedges } from 'hedges';
import { fillers } from 'fillers';

export function analyzeText(text) {
  const doc = nlp(text);
  const words = doc.terms().out('array');
  const wordsLower = words.map(w => w.toLowerCase());

  // Lexical density
  const contentWords = [
    ...doc.nouns().out('array'),
    ...doc.verbs().out('array'),
    ...doc.adjectives().out('array'),
    ...doc.adverbs().out('array')
  ];

  return {
    // Basic stats
    wordCount: words.length,
    sentenceCount: doc.sentences().out('array').length,

    // Readability
    fleschEase: readability.fleschKincaidReadingEase(text),
    gradeLevel: readability.fleschKincaidGrade(text),
    consensus: readability.textStandard(text),

    // Density metrics
    lexicalDensity: (contentWords.length / words.length * 100).toFixed(1),

    // Quality issues
    suggestions: writeGood(text),
    weakWords: {
      hedges: wordsLower.filter(w => hedges.includes(w)),
      fillers: wordsLower.filter(w => fillers.includes(w))
    }
  };
}
```

</details>

## Runtime Analysis for External URLs

For analyzing user-submitted URLs, use Gatsby Functions with `@mozilla/readability`:

```javascript
// src/api/analyze-url.js
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import textReadability from 'text-readability';

export default async function handler(req, res) {
  const { url } = req.body;

  const response = await fetch(url);
  const html = await response.text();

  const dom = new JSDOM(html, { url });
  const article = new Readability(dom.window.document).parse();
  const text = article.textContent;

  res.json({
    title: article.title,
    wordCount: textReadability.lexiconCount(text),
    fleschReadingEase: textReadability.fleschReadingEase(text),
    fleschKincaidGrade: textReadability.fleschKincaidGrade(text),
    readingTime: Math.ceil(textReadability.lexiconCount(text) / 200)
  });
}
```

## Conclusion

The most effective architecture uses two tiers: fast JavaScript analysis for immediate feedback at build time, complemented by LLM evaluation for nuanced quality assessment.

For Gatsby:
1. Use `onCreateNode` to inject metrics into GraphQL
2. Display them in templates with zero runtime cost
3. Add a Gatsby Function endpoint for external URL analysis

The combination of **text-readability-ts + compromise + write-good** covers 90% of use cases at minimal bundle cost. For subjective quality that algorithms can't capture, G-Eval-style LLM prompts with proper calibration fill the gap.

Dense writing respects the reader's time. These tools help you measure whether yours does.
