---
title: 'AI Code Review: A Reality Check'
date: '2024-12-13'
slug: ai-code-review-reality
tags:
  - ai
  - developer-tools
  - code-quality
  - automation
author: Nora
quote: >-
  AI sees code. It doesn't see the user story, the design discussion, or the
  alternative approaches you considered.
summary: >-
  AI code review excels at pattern matching but fails at understanding context
  and intent.
---

"AI will review your code and find bugs before production." It's a compelling pitch. It's also mostly wrong—not because AI can't help with code review, but because the pitch misunderstands what code review is actually for.

Let me explain what I mean.

## What Code Review Actually Does

Code review serves multiple purposes:

1. **Catching defects** — Finding bugs, security issues, and edge cases
2. **Ensuring consistency** — Maintaining patterns and conventions
3. **Knowledge sharing** — Spreading understanding across the team
4. **Design feedback** — Questioning architectural decisions
5. **Mentorship** — Teaching junior developers through specific feedback

AI can help with items 1 and 2. It's actively counterproductive for 3, 4, and 5.

## Where AI Code Review Works

### Style and Convention Enforcement

AI is excellent at catching:
- Inconsistent naming patterns
- Missing error handling
- Unused imports and variables
- Formatting violations
- Documentation gaps

These are things humans are bad at noticing consistently. They're also things that don't require understanding context. Perfect fit for AI.

### Common Bug Patterns

AI catches issues like:
- Null pointer dereferences in obvious cases
- Resource leaks (unclosed files/connections)
- SQL injection vulnerabilities in template strings
- Off-by-one errors in loops

The common thread: patterns that are recognizable from the code itself, without needing to understand what the code is *supposed* to do.

### Security Surface Scanning

AI is reasonably good at flagging:
- Hardcoded credentials
- Suspicious permission grants
- Known vulnerable patterns
- Missing input validation

Again—pattern matching against known issues.

## Where AI Code Review Fails

### Understanding Intent

"Is this the right approach?" requires understanding what problem you're solving. AI sees code. It doesn't see the user story, the design discussion, or the alternative approaches you considered.

When AI suggests "improvements," it's optimizing for code aesthetics, not for appropriateness to your situation.

### Questioning Architecture

Good code review asks: "Should we be doing this at all?" AI asks: "Is this syntactically correct?"

The most valuable review feedback I've received was along the lines of: "This is well-implemented, but if we solve it this way, we'll have a problem in six months." AI can't reason about future consequences.

### Contextual Correctness

Consider:
```python
def calculate_total(items):
    return sum(item.price for item in items)
```

Is this correct? Depends entirely on context:
- Should it include tax?
- What about discounts?
- Are there quantity limits?
- Should it round?

AI can tell you the code is valid Python. It can't tell you whether it correctly implements your business logic. Only someone who knows the business can do that.

### Knowledge Transfer

Code review is one of the primary ways teams share understanding. When a senior engineer reviews a PR, they're not just catching bugs—they're teaching.

"Have you considered using the existing DateUtils class for this?" teaches the codebase. "This is similar to what we did in the auth module" builds conceptual connections. AI doesn't know your codebase at this level, and even if it did, having AI do the teaching defeats the purpose.

## A Reasonable Approach

Here's how I think about AI in code review:

**Use AI for first-pass screening.** Let it catch the mechanical issues—style violations, common bugs, obvious security issues. Run this automatically on every PR.

**Don't let AI block merges.** AI findings should be suggestions, not gates. They're often wrong, and even when right, they're sometimes not worth fixing.

**Reserve human review for human concerns.** Does this approach make sense? Does it fit our architecture? Will the next person understand it? These remain human questions.

**Measure what matters.** If you introduce AI code review, track whether actual bugs in production decrease. Not AI findings—actual outcomes. I've seen teams generate mountains of AI feedback with no measurable quality improvement.

## The Deeper Issue

The push for AI code review often reflects a misunderstanding of why bugs reach production. Hint: it's usually not because humans missed obvious issues that AI would catch.

The bugs that matter are:
- Requirements that were never clear
- Edge cases nobody thought to test
- Integrations that work individually but fail together
- Race conditions and timing issues
- Performance problems that don't appear until scale

AI code review addresses none of these. Better processes, better testing, and better communication do.

## My Recommendation

Use AI for what it's good at: mechanical pattern matching and consistency enforcement. Stop pretending it's a replacement for thoughtful human review.

And be honest about why you're adopting it. If the goal is fewer humans reviewing code, just say that. Don't dress it up as quality improvement when the actual improvement is cost reduction.

Both can be valid goals. But they're different goals, and confusing them leads to poor decisions.
