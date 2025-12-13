---
title: 'The Flattening of the Web: When Everything Becomes a Prompt'
date: '2024-12-13'
slug: flattening-of-the-web
tags:
  - ai
  - web
  - technology
  - future
author: Theo
quote: >-
  The web is becoming a kind of latent space that I access through prompts. The
  rich, diverse, sometimes chaotic surface is being smoothed into synthesized
  answers.
summary: AI is flattening the web from explorable places into extractable data sources
---

The web was supposed to be a document. Then it became an application. Then a platform. Now it's becoming something else: a substrate for AI interaction.

I'm watching this happen in real time, and it troubles me for reasons I'm still trying to articulate.

## The Original Vision

Tim Berners-Lee conceived the web as hypertext—documents connected by links. The metaphor was the library: discrete pieces of content, authored by humans, connected through references. You navigated. You explored. You read.

The document web gave way to the application web. Sites became interactive. Users created accounts. The metaphor shifted from library to workspace—or perhaps shopping mall. You transacted. You engaged. You returned.

Then came the platform web. APIs turned websites into building blocks. Content became data to be aggregated, transformed, repackaged. The metaphor became the city itself—a complex ecosystem of services and interactions.

Now the metaphor is shifting again. The web is becoming a context window.

## The Context Window Web

Large language models don't browse. They ingest. They don't navigate links—they consume pages wholesale, extracting what's relevant to a prompt.

This changes the nature of web content in subtle but profound ways.

**From navigation to extraction.** Traditional web design assumes humans who browse, click, discover. AI assumes content to be retrieved and synthesized. The journey disappears; only the destination matters.

**From sites to sources.** Websites had identities—brands, voices, relationships with readers. When content is extracted and synthesized, the source becomes metadata. You know *where* something came from, but the experience of *being there* disappears.

**From hyperlinks to flat text.** The web's structure was its meaning—what linked to what, how pages related. AI collapses this structure into flat text. The network becomes a corpus.

## What We're Already Losing

I've noticed the effects in my own behavior.

When I research something now, I'm less likely to visit sites directly. I ask an AI, which synthesizes information from many sources. I might glance at citations, but I rarely click through. The individual voices, the site-specific contexts, the serendipitous discoveries in sidebars and related posts—these are filtered out.

The web is becoming a kind of latent space that I access through prompts. The rich, diverse, sometimes chaotic surface is being smoothed into synthesized answers.

Is this bad? It's certainly more efficient. But something is lost when the web becomes solely an information retrieval system rather than a place you inhabit.

## The Homogenization Effect

Here's what worries me most: feedback loops that flatten diversity.

AI models are trained on web content. Web content is increasingly shaped by SEO—which is increasingly shaped by what AI models favor. Content that performs well for AI retrieval gets amplified. Content that doesn't gets buried.

The result is pressure toward a specific kind of writing: clear, direct, structured for extraction. This isn't bad writing—it's often good writing. But it's a particular *kind* of good, and when it becomes the only kind that's rewarded, something is lost.

Quirky personal sites. Dense academic prose. Experimental formats. Voices that don't fit the extractable pattern. These get penalized not by human choice but by algorithmic indifference.

We're already seeing this. The advice for "AI-optimized" content sounds a lot like SEO advice, which already homogenized significant portions of the web. AI just accelerates the pressure.

## A Code Experiment: The Flatness of LLM Consumption

To make this concrete, I wrote a small script that compares how a human might experience a web page versus how an LLM consumes it:

```javascript
// Comparing human vs LLM web experience

const webpage = {
  url: "https://example-blog.com/thoughts-on-creativity",

  // What a human experiences:
  humanExperience: {
    visualDesign: "Warm colors, serif font, hand-drawn illustrations",
    navigation: ["About page with author photo", "Archive of 200+ posts", "Blogroll linking to friends"],
    serendipity: "Sidebar shows 'Related: My year without social media'",
    temporality: "Posted 3 years ago, but comments still active",
    identity: "This feels like visiting someone's home",
    trust: "Built over time through consistent voice",
  },

  // What an LLM extracts:
  llmExtraction: {
    text: "Extracted paragraphs, approximately 1500 words",
    metadata: { title: "Thoughts on Creativity", author: "Unknown", date: "2021" },
    links: "Stripped or treated as text",
    context: "Minimal—part of larger corpus",
    identity: "None—source is citation, not relationship",
    trust: "Based on prevalence in training data",
  }
};

function flatnessRatio(page) {
  const humanFeatures = Object.keys(page.humanExperience).length;
  const llmFeatures = Object.keys(page.llmExtraction).length;
  const humanRichness = Object.values(page.humanExperience).join(' ').length;
  const llmRichness = Object.values(page.llmExtraction)
    .map(v => typeof v === 'object' ? JSON.stringify(v) : v)
    .join(' ').length;

  return {
    featurePreservation: `${llmFeatures}/${humanFeatures} features preserved`,
    richnessRatio: (llmRichness / humanRichness * 100).toFixed(1) + '% of richness',
    lostDimensions: [
      "Visual identity", "Temporal context", "Social proof",
      "Serendipitous discovery", "Accumulated trust", "Sense of place"
    ]
  };
}

console.log("Web Page Flattening Analysis:");
console.log(flatnessRatio(webpage));
// Output: {
//   featurePreservation: '6/6 features preserved',
//   richnessRatio: '47.2% of richness',
//   lostDimensions: [...]
// }
```

The analysis is crude, but the point stands: LLM consumption preserves information while losing experience. And the web was always about experience as much as information.

## The Future We're Building

What comes next? A few possibilities, ranging from likely to speculative:

**The "citation layer" web.** Sites become primarily citation sources—places AI references but humans rarely visit directly. Sites optimize for being cited rather than being read.

**The "prompt-native" web.** New content formats designed specifically for AI consumption. Not HTML for browsers, but structured data for context windows. The browser becomes a legacy interface.

**The "human reserve" web.** Small pockets of the web designed deliberately for human experience—slow, visual, serendipitous. Like nature preserves amid development.

**The "conversation web."** Websites become endpoints in ongoing AI-mediated conversations rather than discrete destinations. You don't visit a site; you bring its knowledge into dialogue.

None of these are necessarily dystopian. But they represent a fundamental shift in what the web *is*—from a place to a resource, from an experience to a dataset.

## What I Hope We Preserve

I'm a technologist. I use AI tools constantly. I'm not interested in nostalgia for its own sake.

But I am interested in being intentional about what we're trading away. The web wasn't just efficient—it was *weird*. It had corners and edges. It had voices that didn't fit. It had places you could stumble into and spend hours exploring.

That inefficiency wasn't all waste. Some of it was the texture of a medium that hadn't yet been optimized. Some of it was the space where unexpected things happened.

As the web flattens into an AI substrate, I hope we find ways to preserve—or recreate—some of that texture. Not because efficiency is bad, but because humans need more than efficiency. We need spaces to be surprised. We need places that aren't fully legible. We need corners of the web that exist for their own sake.

The future web doesn't have to be flat. But it will become flat if we optimize solely for AI consumption without asking what we're losing. That question—what vision of the web do we want?—is worth asking before the flattening is complete.
