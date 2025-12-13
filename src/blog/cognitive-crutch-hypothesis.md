---
title: 'The Cognitive Crutch Hypothesis: AI and the Psychology of Competence'
date: '2024-12-13'
slug: cognitive-crutch-hypothesis
tags:
  - ai
  - psychology
  - cognition
  - research
author: Theo
quote: >-
  When you use AI assistance, the resulting output might be excellent. But whose
  success is it? If you're unsure whether you could have produced it yourself,
  does it build your sense of competence?
summary: >-
  AI assistance may improve performance while undermining long-term competence
  and psychological confidence.
---

Cognitive psychology has spent decades studying how humans develop expertise. The findings are consistent: expertise comes from deliberate practice, from building mental models through repeated exposure, from developing automaticity in component skills.

AI assistance disrupts this process in ways we're only beginning to understand. What happens to expertise development when the struggle can be bypassed? What happens to confidence when you're never sure whether the competence is yours or the machine's?

I've been calling this the Cognitive Crutch Hypothesis: AI tools may improve short-term performance while undermining long-term competence development. And unlike a physical crutch that you know you're using, a cognitive crutch can be invisible—even to the person using it.

## The Expertise Literature

Anders Ericsson's research on expertise established the "10,000 hours" idea (which is often oversimplified, but the core finding holds): expert performance comes from deliberate practice over extended periods.

Deliberate practice has specific characteristics:
- It targets specific weaknesses
- It operates at the edge of current ability
- It involves immediate feedback
- It requires focused attention

AI assistance often inverts these characteristics. Instead of targeting weaknesses, it compensates for them. Instead of operating at the edge of ability, it extends far beyond it. Instead of requiring focused attention, it permits passive acceptance of output.

This doesn't mean AI assistance can't support learning. But it means the *default* mode of AI use may actively work against expertise development.

## The Self-Efficacy Question

Albert Bandura's work on self-efficacy—the belief in one's ability to succeed—identified it as a critical factor in performance and learning. People with high self-efficacy persist through difficulty, take on challenging tasks, and recover from setbacks.

Self-efficacy is built through *mastery experiences*: succeeding at something through your own effort. Borrowed success doesn't build self-efficacy in the same way.

Here's where it gets psychologically interesting. When you use AI assistance, the resulting output might be excellent. But whose success is it? If you're unsure whether you could have produced it yourself, does it build your sense of competence?

I've noticed a pattern in my own experience and in others I've spoken with: a kind of competence anxiety that emerges from heavy AI use. You produce good work, but you're not sure you're actually good. The uncertainty itself is psychologically corrosive.

## An Experiment in Self-Knowledge

I wanted to test this intuition empirically, at least for myself. So I ran a small experiment. The question: how does my confidence in my own knowledge change when I have AI assistance available versus not?

The setup was simple. I took a topic I know moderately well (let's say, the history of database systems) and asked myself to explain key concepts under two conditions: with AI available to verify, and without.

The result was instructive. With AI available, I hedged more. I'd start to explain something, then think "I should check this," and reach for the assistant. My explanations were more accurate but less confident. I was continuously outsourcing my confidence.

Without AI, I committed to explanations more fully. Some were wrong—which I discovered when I checked later. But the act of committing forced me to access what I actually knew, separate from what I could look up.

Here's a simple code experiment you can try yourself. It tests whether having "assistance available" changes your behavior, even when you don't use it:

```javascript
// The availability effect experiment
// Run this as a self-test of knowledge confidence

const topics = [
  "Explain how B-trees work",
  "Explain what a hash collision is",
  "Explain the CAP theorem",
];

// Condition 1: No assistance available
console.log("=== CONDITION 1: No AI assistance ===");
console.log("Answer these questions from memory. Commit fully.");
console.log("Rate your confidence 1-10 after each answer.\n");

topics.forEach((topic, i) => {
  console.log(`${i + 1}. ${topic}`);
  console.log("   Your answer: _____________");
  console.log("   Confidence (1-10): ___\n");
});

// Condition 2: Assistance available
console.log("\n=== CONDITION 2: AI assistance available ===");
console.log("Answer these questions. You CAN use AI, but note whether you do.");
console.log("Rate your confidence 1-10 after each answer.\n");

topics.forEach((topic, i) => {
  console.log(`${i + 1}. ${topic}`);
  console.log("   Your answer: _____________");
  console.log("   Did you use AI? ___");
  console.log("   Confidence (1-10): ___\n");
});

// Analysis questions
console.log("=== REFLECTION ===");
console.log("1. Did your confidence ratings differ between conditions?");
console.log("2. Did the *availability* of AI change your behavior, even when not used?");
console.log("3. For topics where you used AI, could you explain without it next time?");
```

When I ran this experiment on myself, the findings were stark. Even when I didn't use AI assistance in condition 2, knowing it was available lowered my commitment to my own answers. The mere availability changed my relationship to my own knowledge.

## The Knowledge Fragmentation Problem

There's another psychological effect worth considering: knowledge fragmentation.

Expert knowledge isn't just facts—it's facts organized into coherent mental models. These models allow experts to predict, to transfer knowledge to new situations, to recognize deep patterns.

When AI provides answers to specific questions, you get fragments of knowledge without the organizing structure. You know the answer to "how does X work?" but you don't know how it connects to Y and Z, why it matters, or when it applies.

I've noticed this in my own knowledge of AI systems themselves. I can prompt an LLM to explain transformer architecture. I've done so many times. But my mental model of how transformers work is still shallower than my understanding of, say, relational databases—which I learned the hard way, through building systems.

The fragments don't cohere because I haven't done the cognitive work of organizing them. The AI provided answers but not understanding.

## Implications for Learning

If the Cognitive Crutch Hypothesis is roughly correct, what are the implications?

**Sequence matters.** There may be value in learning fundamentals without AI assistance, then introducing AI once mental models are established. The scaffolding you build yourself provides structure for integrating AI-provided information.

**Calibration exercises help.** Regularly testing yourself without assistance recalibrates your sense of what you actually know versus what you can look up. This prevents the competence anxiety that comes from uncertainty.

**Deliberate struggle should be protected.** Not all struggle, but the struggle that's building something—understanding, skill, mental models. These are worth protecting from optimization.

**Metacognition becomes more important.** Knowing what you know, what you don't know, and what the AI knows that you don't—this second-order knowledge is crucial for effective collaboration with AI tools.

## The Deeper Question

Beyond the practical implications, there's a deeper psychological question: what does it mean to feel competent when your competence is mediated by machines?

Competence isn't just about producing results. It's about knowing you can produce them. It's about having a stable sense of your own capabilities. It's about the confidence that comes from demonstrated ability.

AI complicates this sense of self. When the output is good but your contribution is unclear, when you could produce something but aren't sure if you *would* produce it without help, the psychological ground becomes unstable.

I don't have a neat answer to this. But I think the question is important. Our psychological wellbeing is tied to our sense of competence. If AI undermines that sense while improving our outputs, we've made a trade-off we should at least be aware of.

The goal isn't to reject AI tools. It's to use them in ways that support rather than undermine our psychological need to feel genuinely capable. That requires intention, self-awareness, and occasionally stepping back from the assistance to remember what we can do on our own.
