---
title: "Blog Posts as Externalized Memory: Using AI to Capture Thinking"
date: "2024-12-12"
slug: "blog-posts-as-memory"
tags: ["ai", "productivity", "writing", "knowledge-management", "featured"]
---

I'm going to ask Claude to write this blog post. That sentence is the point of this blog post.

Let me explain.

## The Pattern

When I discover a useful technique, solve an interesting problem, or develop an opinion worth preserving, I've started asking Claude to write a blog post about it. Not to publish immediately—but to capture the thinking in a form I can return to later.

This creates a virtuous cycle:

```
Idea → Explain to Claude → Claude writes post → Externalized memory
                ↓
Future session → "Read my post about X" → Context restored
```

The blog post becomes a retrieval key for my own ideas.

## Why This Works

### Writing Forces Clarity

There's a reason the Pragmatic Programmer popularized [rubber duck debugging](https://en.wikipedia.org/wiki/Rubber_duck_debugging). Explaining something—even to an inanimate object—forces you to organize your thoughts. Gaps in reasoning become obvious when you try to articulate them.

But a rubber duck doesn't write anything down. Claude does.

When I explain an idea to Claude, I'm forced to make implicit assumptions explicit. Then Claude produces a structured document that I can review, correct, and refine. The [Protégé Effect](https://www.coursera.org/articles/rubber-duck-debugging) kicks in: teaching deepens understanding.

### The Rubber Duck That Writes Back

[As one writer put it](https://www.anup.io/the-rubber-duck-that-talks-back/), LLMs are "the rubber duck that talks back." But more than that—they're the rubber duck that takes notes.

The collaborative process looks like:

1. I explain the concept roughly
2. Claude asks clarifying questions (or I anticipate them)
3. Claude produces a draft
4. I correct misconceptions
5. The final post captures a refined version of the idea

This mirrors what researchers describe as [collaborative thinking with LLMs](https://blendingbits.io/p/llms-as-thought-partners): "Thought → articulation → AI response → re-evaluation → refined articulation → discovery."

### Blog Posts as Future Context

Here's the key insight: blog posts aren't just for readers. They're for future Claude sessions.

When I return to a project months later, I can tell Claude: "Read my blog post about VPC configuration" or "Check the post where I documented the ASCII-first diagram workflow." Claude reads the post and instantly has rich context about:

- What problem I was solving
- What approach I chose and why
- Implementation details
- Edge cases I considered

This beats raw conversation transcripts. A blog post is *curated* context—edited, structured, and focused on what matters.

## The "Second Brain" Connection

This pattern fits into the broader [second brain](https://www.taskade.com/blog/how-ai-can-help-you-build-a-second-brain/) movement—using external tools to extend memory and thinking capacity. But instead of complex PKM systems with tags and backlinks, blog posts offer:

- **Natural language interface**: No special syntax to remember
- **Narrative structure**: Ideas have context, not just keywords
- **Public-ready format**: Some posts are worth sharing
- **Version control**: Git tracks how thinking evolves

The friction is low. "Write a blog post about this" is a single prompt.

## Practical Implementation

### When to Capture

I trigger this pattern when:

- I solve a problem in a novel way
- I develop an opinion through discussion with Claude
- I build something I might need to explain later
- I discover a workflow worth preserving

### Prompt Structure

A simple prompt works:

> Write a technical blog post about [topic]. Include:
> - The problem we were solving
> - The approach we took
> - Code samples where relevant
> - Why this matters

Claude has the conversation context, so it knows what "we" did.

### Retrieval Later

When starting a new session:

> Read my blog post at src/blog/[slug].md to restore context about [topic]

Or more naturally:

> I wrote about this before—check the blog post on ASCII-first diagram generation

Claude reads the post and has immediate, structured context.

## What This Post Demonstrates

This post is itself an example of the pattern. I had an idea about using blog posts as externalized memory. Rather than let it evaporate, I asked Claude to write about it.

If I forget why I started doing this, I can read this post. The recursion is the point.

## Limitations

- **Requires discipline**: You have to remember to ask for the post
- **Quality varies**: Some posts need heavy editing
- **Storage overhead**: More markdown files accumulate
- **Not automatic**: Unlike conversation logs, this requires active decision

But compared to losing ideas entirely, these are minor costs.

## Beyond Individual Use

This pattern scales to teams. Imagine:

- Onboarding docs written by the AI that helped build the feature
- Decision records capturing the conversation that led to architectural choices
- Runbooks generated from debugging sessions

The AI that helped solve the problem is uniquely positioned to document it.

## Conclusion

Blog posts are a surprisingly effective format for AI-assisted knowledge capture. They're structured enough to be useful, flexible enough to handle any topic, and readable by both humans and future AI sessions.

The next time you solve an interesting problem with Claude, try: "Write a blog post about this." Your future self will thank you.

---

*This post was written by Claude, based on a conversation about using AI to externalize thinking. Which is exactly the point.*
