---
title: 'The New Literacy: What Does It Mean to ''Know'' Something Now?'
date: '2024-12-13'
slug: new-literacy-knowing-ai-age
tags:
  - ai
  - knowledge
  - epistemology
  - learning
author: Theo
quote: >-
  The less you know about a domain, the more you need AI assistance—but the more
  AI assistance you need, the less able you are to evaluate it.
summary: >-
  AI makes foundational knowledge more important because you need expertise to
  verify AI outputs.
---

Every major technology shift has changed what it means to be educated. The printing press shifted literacy from scribes to the general population. Universal schooling standardized knowledge transmission. The internet made information access nearly universal.

AI is changing knowledge again—not just what we know, but what it means to know.

When an AI can answer any factual question instantly, what does it mean to "know" something? When AI can reason through problems you couldn't solve yourself, what does expertise mean? When AI can generate text indistinguishable from human writing, what does literacy mean?

These aren't just philosophical questions. They have practical implications for education, hiring, credentialing, and how we think about our own competence.

## The Old Literacy

Traditional literacy meant being able to read and write. But "literacy" has always meant more than that—it's meant being equipped to function in your society's information environment.

For most of human history, literacy meant knowing things. Education was largely about memorizing information: facts, dates, formulas, texts. The educated person was one who had internalized a body of knowledge and could retrieve it on demand.

This made sense when information access was scarce. Libraries were rare. Books were expensive. If you needed to know something, it had to be in your head or you'd have to travel to find it.

The internet challenged this model. When you can look anything up, memorization becomes less valuable. "Knowing" shifted from retrieval to navigation—knowing how to find, evaluate, and synthesize information.

Search literacy became the new literacy. Could you formulate good queries? Could you evaluate sources? Could you synthesize information from multiple places? These became the skills that mattered.

## The New Challenge

AI presents a new challenge. It doesn't just help you find information—it synthesizes, reasons, and generates.

Ask a search engine a question and you get links. Ask an AI the same question and you get an answer. Ask a search engine how to approach a problem and you get articles. Ask an AI and you get a solution.

This changes the knowledge game again:

**From finding to verifying.** When AI provides answers directly, the challenge isn't finding information but evaluating whether the AI's output is correct. This requires knowledge you can't get from the AI itself.

**From learning to directing.** Effective AI use requires knowing what to ask, how to constrain the problem, what assumptions to make explicit. This is a different skill than learning domain content.

**From producing to editing.** AI can draft; humans need to evaluate and refine. The literacy of production becomes the literacy of judgment.

**From remembering to integrating.** Memorized facts matter less; mental models that integrate knowledge matter more. You need frameworks to evaluate AI output, not just facts to contribute.

## A Taxonomy of Knowing

It might help to distinguish different types of knowing and how AI affects each:

**Factual knowledge:** "What year was the Constitution ratified?"
- AI impact: Nearly obsolete as a human skill. AI knows more facts, more accurately, more accessibly.
- New skill: Knowing when facts matter and how to verify AI-provided facts.

**Procedural knowledge:** "How do I configure a Kubernetes cluster?"
- AI impact: Significantly augmented. AI can provide step-by-step instructions for almost any procedure.
- New skill: Evaluating whether the procedure fits your context; adapting when it doesn't.

**Conceptual knowledge:** "Why does monetary policy affect inflation?"
- AI impact: Partially augmented. AI can explain concepts, but understanding requires mental model construction that's still largely internal.
- New skill: Using AI explanations as input to your own understanding; knowing when you've understood vs. just read.

**Practical wisdom:** "How should we prioritize these competing objectives?"
- AI impact: Minimally augmented. AI can provide frameworks but can't know your values or context.
- New skill: Mostly unchanged—but more important because it's where human judgment is irreplaceable.

**Creative insight:** "What novel approach might solve this problem?"
- AI impact: Augmented but not replaced. AI can generate options; humans evaluate and refine.
- New skill: Prompting for creative directions; combining AI ideas with domain insight.

## The Verification Problem

Here's a practical challenge of the new literacy: how do you verify AI outputs?

The answer depends on your existing knowledge. If you know the domain well, you can evaluate AI outputs critically. If you don't, you're taking the AI's word for it.

This creates a paradox: the less you know about a domain, the more you need AI assistance—but the more AI assistance you need, the less able you are to evaluate it.

A code experiment illustrates this:

```javascript
// The verification paradox

function evaluateAIOutput(domain, userExpertise, aiConfidence) {
  // Can the user actually verify the output?
  const verificationCapacity = userExpertise / 10; // 0-1 scale

  // How much should the user trust unverified output?
  const necessaryTrust = 1 - verificationCapacity;

  // Risk = trust required * potential for error
  const aiErrorRate = 1 - aiConfidence;
  const undetectedErrorRisk = necessaryTrust * aiErrorRate;

  return {
    canVerify: verificationCapacity > 0.7,
    blindTrust: necessaryTrust,
    riskLevel: undetectedErrorRisk,
    recommendation: undetectedErrorRisk > 0.2
      ? "Build domain knowledge before relying on AI"
      : undetectedErrorRisk > 0.1
        ? "Use AI but verify critical outputs with expert"
        : "AI assistance appropriate"
  };
}

// Example: Developer using AI for unfamiliar language
console.log(evaluateAIOutput("Rust programming", 2, 0.8));
// { canVerify: false, blindTrust: 0.8, riskLevel: 0.16,
//   recommendation: "Use AI but verify critical outputs with expert" }

// Example: Expert using AI for routine task
console.log(evaluateAIOutput("Python programming", 9, 0.9));
// { canVerify: true, blindTrust: 0.1, riskLevel: 0.01,
//   recommendation: "AI assistance appropriate" }
```

The implication: some base level of domain knowledge is prerequisite to effective AI use. Not because you need to do the work yourself, but because you need to be able to evaluate whether the AI's work is correct.

## The Skills of the New Literacy

If this analysis is roughly correct, what skills constitute the new literacy?

**Prompt engineering as a foundational skill.** The ability to communicate clearly with AI—specifying constraints, providing context, asking followup questions—is increasingly valuable. It's not about tricks; it's about clear thinking made explicit.

**Verification thinking.** Knowing how to check outputs: looking for internal consistency, testing edge cases, consulting authoritative sources, recognizing hallucination patterns.

**Model awareness.** Understanding what AI can and can't do, where it's reliable and where it fails, what kinds of questions it handles well. This meta-knowledge enables appropriate calibration.

**Integration skill.** Combining AI outputs with your own knowledge and judgment. Not accepting AI output wholesale, not rejecting it reflexively, but integrating it appropriately.

**Foundational domain knowledge.** Paradoxically, AI makes foundational knowledge more important, not less. You need enough knowledge to evaluate AI outputs, even if you don't need enough to produce them yourself.

## The Educational Implications

If knowledge is being transformed, education needs to transform too. Some directions:

**Less emphasis on retention, more on understanding.** If facts are always accessible, the value is in mental models that organize and contextualize facts. Education should focus on building these models.

**Explicit AI literacy.** Students need to learn how to use AI effectively, how to evaluate its outputs, when to trust it and when to be skeptical. This is as foundational as traditional literacy.

**Emphasis on verification and source evaluation.** Critical thinking about information sources has always been important. It's now essential.

**Teaching through problems, not just content.** If content is accessible, the skill is in applying it. Problem-based learning becomes more valuable than content-based learning.

**Preserving struggle.** Not all struggle, but the struggle that builds understanding. Education should consciously decide which learning processes benefit from AI assistance and which need to be done the hard way.

## The Personal Question

Beyond the systemic questions, there's a personal one: what do you want to know?

"Knowing" in the old sense—having information in your head—has different value than it used to. But it's not valueless. There's something different about knowledge you've internalized versus knowledge you can access.

Internalized knowledge is available instantly, shapes your perception, connects to other knowledge spontaneously. Accessible knowledge requires a query, arrives decontextualized, sits outside your mental models until you integrate it.

Both have value. But they're different. The new literacy includes knowing when internalized knowledge matters and investing in building it deliberately.

What do you want to genuinely know, versus what are you content to merely access? That's a question worth answering for yourself.

The new literacy isn't just about using AI well. It's about being intentional about what knowledge means to you—what you want to understand, what you want to internalize, what kind of knower you want to be.

AI changes the landscape. It doesn't answer these questions for you.
