---
title: "The Death of Undifferentiated Heavy Lifting (And What Comes Next)"
date: "2024-12-13"
slug: "undifferentiated-heavy-lifting"
tags: ["cloud", "infrastructure", "strategy", "aws"]
---

"Focus on what differentiates your business, not undifferentiated heavy lifting." Amazon has been saying this for nearly two decades. It's become so familiar that we've stopped examining what it actually means—and whether the category of "undifferentiated" is about to expand dramatically.

## The Original Insight

The core idea was simple: running your own data centers, managing hardware, patching operating systems—these activities are necessary but don't create competitive advantage. Every company does them roughly the same way. So let someone else handle them and focus your engineering effort on things that actually differentiate your product.

This insight drove cloud adoption. It was correct. Still is.

But the boundary of what's "undifferentiated" keeps moving.

## The Boundary Shifts

**2008:** Running servers is undifferentiated. Use EC2.

**2012:** Managing relational databases is undifferentiated. Use RDS.

**2015:** Running containers is undifferentiated. Use ECS/Kubernetes-as-a-service.

**2018:** Building authentication is undifferentiated. Use Auth0/Cognito.

**2020:** Running ML inference at scale is undifferentiated. Use SageMaker/Vertex.

**2024:** Writing boilerplate code is undifferentiated. Use AI assistants.

Each shift felt radical at the time and obvious in retrospect. The pattern is consistent: activities that once required specialized expertise become commodities that can be bought instead of built.

## What's Becoming Undifferentiated Now

I see several categories actively commoditizing:

### Standard API Development

Building CRUD APIs for well-understood domains is increasingly mechanical. The patterns are known. The code is similar across applications. AI can generate most of it.

This doesn't mean API development is worthless. It means *routine* API development is. The value shifts to API design, edge cases, and integration—things that require understanding your specific context.

### Data Pipeline Assembly

Connecting system A to system B with transformation logic in between. There are hundreds of tools for this now. AI can generate the configuration. The differentiated work is deciding *what* data to move and *how* to interpret it.

### Basic Frontend Implementation

Converting designs to code for standard UI patterns. AI does this reasonably well now. The differentiated work is designing the interactions, handling complex state, and integrating with real backends.

### Standard Security Controls

Baseline security—encryption, access control, audit logging—is increasingly table stakes that platforms provide. The differentiated work is threat modeling, security architecture, and incident response.

## What This Means for Engineers

Some take this as a threat: "AI is coming for my job." I see it differently.

**The work shifts, but doesn't disappear.** When we stopped managing servers, we didn't have fewer infrastructure engineers. We had infrastructure engineers doing different, often more impactful work.

**The bar for "differentiated" rises.** Activities that were valuable become commodities. You need to operate at a higher level of abstraction to create value.

**Judgment becomes more valuable.** As execution becomes easier, deciding *what* to execute becomes the bottleneck. Strategy, architecture, trade-offs—these matter more than ever.

**Integration becomes the hard part.** Individual capabilities are commodities. Making them work together in your specific context is not.

## How to Think About This

Questions I find useful when evaluating where to invest effort:

1. **Could someone else do this roughly the same way?** If yes, it's probably commoditizing or already has. Consider buying instead of building.

2. **Does this require understanding our specific situation?** Things that depend on your users, your constraints, your business model—these remain differentiated.

3. **What's the failure mode?** Undifferentiated doesn't mean unimportant. It means someone else can do it at least as well. Make sure they actually can before handing it off.

4. **What can we do with the freed capacity?** The point of avoiding undifferentiated work is to do more differentiated work. Make sure you're actually capturing that upside.

## The Uncomfortable Implication

Here's what I think people don't want to hear: a lot of work that feels skilled and important is actually undifferentiated heavy lifting in disguise.

Writing the 10,000th REST API doesn't differentiate your business, even if it requires technical skill. Building the same data pipeline with the same tools doesn't create competitive advantage, even if it takes effort.

This doesn't mean these tasks are worthless or that the people doing them lack value. It means the economic dynamics are shifting. The same effort could create more value elsewhere.

The engineers who thrive will be the ones who recognize this shift and position themselves on the differentiated side of the boundary—wherever it moves next.

## A Final Thought

Werner Vogels was right in 2006. The insight has only gotten stronger. The question for each of us is: what's the undifferentiated heavy lifting in my work right now, and what becomes possible if I let it go?
