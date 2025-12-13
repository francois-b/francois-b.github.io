---
title: 'AI in DevOps: Separating What Works from What''s Marketing'
date: '2024-12-13'
slug: ai-devops-reality
tags:
  - ai
  - devops
  - automation
  - developer-tools
author: Nora
quote: AI can gather information. It can't yet make the judgment call.
summary: >-
  AI improves specific DevOps tasks but can't replace human judgment in
  operations
---

Every DevOps tool now has an AI story. Most of those stories are marketing. But some represent genuine improvements to how we operate systems. Here's my attempt to separate signal from noise.

## What's Actually Working

### Intelligent Alerting and Anomaly Detection

This is where AI in operations actually delivers value today. The problem it solves is real: alert fatigue from static thresholds, combined with the difficulty of manually correlating signals across complex systems.

Modern anomaly detection learns baseline behavior and flags deviations. The key is that it's *assistive*—it surfaces things worth investigating rather than making decisions autonomously.

What to look for:
- Systems that explain their reasoning, not just flag anomalies
- Tunable sensitivity that learns from operator feedback
- Integration with existing alerting pipelines rather than replacement

What to avoid:
- "AI-powered" solutions that are just renamed statistical methods
- Systems that generate more alerts than they reduce
- Black boxes that can't explain why something was flagged

### Log Analysis and Root Cause Correlation

Sifting through logs during an incident is miserable work. AI tools that pre-cluster related log lines, suggest relevant time windows, and correlate across services genuinely help.

The best implementations I've seen:
- Run continuously, building context before you need it
- Let you ask natural language questions about your logs
- Surface common patterns across incidents over time

The caveat: these tools are only as good as your logging hygiene. AI can't find signal in logs that don't contain it.

### Code Generation for Infrastructure

This is where the hype is loudest, so let me be specific about what actually works:

**Works well:**
- Generating boilerplate Terraform/CloudFormation/Pulumi
- Converting between IaC formats
- Explaining existing infrastructure code
- Suggesting security improvements to configurations

**Works sometimes:**
- Generating CI/CD pipelines from descriptions
- Creating Kubernetes manifests for standard workloads
- Writing basic monitoring queries

**Doesn't work yet:**
- Architecting infrastructure from requirements
- Making trade-off decisions (cost vs. availability vs. complexity)
- Understanding your specific organizational constraints

The pattern: AI is good at producing syntactically correct configurations for well-documented patterns. It's bad at the judgment calls that make infrastructure *appropriate* for your context.

## What's Not Working (Yet)

### Autonomous Incident Response

The pitch: AI detects an issue and remediates it automatically.

The reality: I've yet to see this work in production for anything beyond trivial cases. The problem isn't the AI—it's that meaningful remediation requires understanding context that doesn't exist in telemetry.

When your service is degraded, the right response depends on:
- What changed recently
- What downstream services depend on you
- What your SLOs actually require
- Whether this is an acceptable degradation or a real incident

AI can gather information. It can't yet make the judgment call.

### "ChatOps" AI Assistants

Many teams have deployed AI assistants in Slack/Teams that can answer questions about infrastructure. Most have quietly stopped using them.

Why they fail:
- They answer the question you asked, not the question you meant
- They lack access to real-time system state
- They can't perform actions, only describe what you should do
- They hallucinate plausible-sounding but wrong answers

The exception: assistants that are tightly scoped to specific, well-documented processes. "How do I rotate the database credentials?" works. "Why is the API slow?" doesn't.

### Predictive Scaling

This should work in theory—predict load, scale proactively. In practice:
- Traffic patterns are rarely predictable enough
- When they are, simple time-based rules work better
- The cost of being wrong (under-provisioned) is much higher than the cost of reactive scaling

I'm not saying predictive scaling is impossible. I'm saying it requires predictable workloads, which most organizations don't have.

## How to Evaluate AI DevOps Tools

Questions I ask before recommending anything:

1. **What decision does this help me make?** If the answer is vague, the tool probably is too.

2. **What happens when it's wrong?** Good tools fail gracefully. Bad tools fail in ways that make incidents worse.

3. **Does it require me to change how I work, or does it fit into existing workflows?** The best AI tools are invisible except when they're useful.

4. **Can I explain to an auditor what it's doing?** If the AI's reasoning is opaque, you can't trust it for anything important.

5. **Is there a non-AI alternative that solves 80% of the problem?** Sometimes the AI is just a more expensive way to do something simple.

## The Honest Assessment

AI is making DevOps incrementally better in specific areas. It's not revolutionizing operations. The fundamental challenges—understanding complex systems, making trade-offs under uncertainty, coordinating across teams—remain human problems.

Use AI where it actually helps. Ignore the marketing. That's the whole strategy.
