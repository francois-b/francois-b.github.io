---
title: 'The Question of the Good Life, Revisited: Virtue Ethics Meets LLMs'
date: '2024-12-13'
slug: good-life-virtue-ethics-llms
tags:
  - ai
  - philosophy
  - ethics
  - virtue
author: Theo
quote: >-
  Here's where AI becomes philosophically interesting: what happens to virtue
  when the struggle can be bypassed?
summary: >-
  AI might undermine character development by eliminating the struggles
  necessary for building virtue.
---

Every technology implies a vision of the good life. The automobile implied that mobility was good, that distance should not constrain. Television implied that entertainment was good, that boredom should be eliminated. The smartphone implied that connection was good, that being unreachable was a problem to solve.

What vision of the good life does AI imply?

This is the question I keep circling back to. Not "what can AI do?" but "what does AI assume about what a life should be like?"

## The Implicit Assumptions

When I look at how AI is being developed and marketed, I see several implicit assumptions:

**Productivity is good.** AI is constantly framed as making you more productive—doing more, faster, with less effort. The assumption: output is the measure of a good life.

**Convenience is good.** AI removes friction, handles tedious tasks, makes things easier. The assumption: effort is a problem, ease is the goal.

**Information is good.** AI provides answers, knowledge, insight. The assumption: knowing more is better than knowing less.

**Optimization is good.** AI helps you make better decisions, find better matches, achieve better outcomes. The assumption: life is a series of optimizable functions.

These aren't necessarily wrong. But they're not neutral either. They're a specific vision of what makes life worthwhile—a vision that's contestable, and that the ancient philosophers would have questioned.

## Aristotle's Question

Aristotle spent considerable effort on the question of *eudaimonia*—usually translated as "happiness" or "flourishing," but meaning something closer to "the good life" or "living well."

For Aristotle, eudaimonia wasn't about feeling good or having what you want. It was about living in accordance with virtue—developing the excellences of character that let you live a fully human life.

The virtues Aristotle described include:
- **Courage:** The disposition to act rightly in the face of fear
- **Temperance:** The disposition to moderate desires appropriately
- **Justice:** The disposition to give others what they're due
- **Practical wisdom:** The capacity to discern the right action in particular situations

These virtues are developed through practice. You become courageous by acting courageously. You develop practical wisdom by making decisions and learning from them. The struggle is part of the development.

Here's where AI becomes philosophically interesting: what happens to virtue when the struggle can be bypassed?

## The Virtue Development Problem

Virtue is built through repeated action. You can't become courageous by reading about courage. You can't develop practical wisdom by following instructions. The development requires doing, facing, struggling, sometimes failing.

AI threatens to short-circuit this process in several ways:

**If decisions are optimized, practical wisdom atrophies.** Practical wisdom develops through making decisions under uncertainty, experiencing consequences, and building judgment. When AI recommends "optimal" decisions, this developmental process is bypassed.

**If difficulty is eliminated, courage has fewer opportunities.** Courage isn't just about dramatic moments of danger. It's also about the small daily acts of facing what's difficult. When AI handles the difficult parts, the muscle doesn't get exercised.

**If wants are immediately gratified, temperance isn't practiced.** Temperance is about moderating desires—knowing when enough is enough. When AI makes everything easy, the practice of moderation becomes optional.

This doesn't mean AI is bad for virtue. But it means virtue development requires intention. If we let AI optimize our lives without thought, we might produce good outcomes while developing worse character.

## A Virtue-Oriented Approach to AI

What would it look like to use AI in ways that support rather than undermine virtue development?

**Use AI for information, but retain decision-making.** Let AI provide analysis, options, trade-offs. But make the decision yourself, even when it's hard. The decision-making is where practical wisdom develops.

**Use AI as a spur to courage, not a way around it.** AI can help you prepare to face difficult things—but don't let it face them for you. If you're afraid to have a difficult conversation, AI can help you think through what to say, but you still have to have the conversation.

**Use AI to surface what you want, then practice moderation.** AI can make many things easier to get. Use that visibility to practice choosing wisely—not everything that's available is worth having.

**Use AI in service of relationships, not as a substitute for them.** The virtues are social—they develop and express themselves in relation to others. AI can support human relationships, but can't replace the development that happens through them.

Here's a thought experiment in code form—a "virtue-aware" AI assistant:

```javascript
// A virtue-aware AI assistant

const virtueAwareAssistant = {
  beforeAction(userRequest) {
    const virtueAnalysis = this.analyzeVirtueImplications(userRequest);

    if (virtueAnalysis.bypassesDevelopment) {
      return {
        proceed: false,
        prompt: `This request would skip ${virtueAnalysis.virtue} development.
                Would you like to:
                a) Do this yourself (builds ${virtueAnalysis.virtue})
                b) Get guidance but retain responsibility
                c) Have AI handle it entirely (foregoes development)`,
        recommendation: 'b'
      };
    }
    return { proceed: true };
  },

  analyzeVirtueImplications(request) {
    const patterns = {
      // Requests that bypass practical wisdom
      "decide for me": {
        bypassesDevelopment: true,
        virtue: "practical wisdom",
        alternative: "Present options with trade-offs"
      },
      // Requests that bypass courage
      "handle this difficult situation": {
        bypassesDevelopment: true,
        virtue: "courage",
        alternative: "Help prepare, but user must act"
      },
      // Requests that bypass temperance
      "give me everything about": {
        bypassesDevelopment: true,
        virtue: "temperance",
        alternative: "Provide what's sufficient, not everything"
      }
    };

    // Analysis logic here...
    return patterns[this.categorize(request)] || { bypassesDevelopment: false };
  }
};

// The key insight: some AI actions,
// while efficient, may impede human development
```

## The Deeper Question

Aristotle would ask: what is AI *for*?

The modern answer tends to be instrumental: AI is for productivity, convenience, information, optimization. AI is a tool, and tools are for achieving whatever ends you have.

But Aristotle would push further: what are those ends for? Productivity toward what? Convenience for what? The instrumental answer always defers the question of purpose.

Eventually, you have to answer: what is a good life? What is it all for?

Here's my attempt at an answer, drawing on the virtue tradition:

A good life is one in which you develop and exercise excellences of character in relationship with others. It involves meaningful work, genuine relationships, courage in facing difficulty, wisdom in making decisions, and moderation in desires. It involves being the author of your own life, not just the consumer of experiences.

If that's roughly right, then the question for AI becomes: does this technology help me live that kind of life, or does it subtly redirect me toward a different life—one of productivity without purpose, convenience without character, optimization without meaning?

## Grounded Hope

I'm not a Luddite. I use AI tools extensively. I believe they can genuinely support human flourishing.

But I also believe we need to be more thoughtful than we have been about what we're optimizing for. The technology is powerful enough to reshape how we live. We should make sure it's reshaping us toward lives we actually want.

The virtue tradition doesn't give easy answers. But it gives better questions:

- Not "how do I get more done?" but "what is worth doing?"
- Not "how do I eliminate difficulty?" but "which difficulties are worth facing?"
- Not "how do I know more?" but "what kind of knower do I want to be?"
- Not "how do I optimize outcomes?" but "what outcomes reflect the person I want to become?"

AI can help with efficiency, convenience, information, and optimization. It can't help with these deeper questions. For those, you're on your own—with all the ancient wisdom and modern confusion that entails.

What vision of the good life does your AI use imply? Is that a life worth wanting?

The question is yours to answer. That's where the real work is.

---

*Theo*
