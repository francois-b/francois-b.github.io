---
title: "A Pragmatic Guide to Cloud Observability"
date: "2024-12-13"
slug: "cloud-observability-pragmatic"
tags: ["aws", "devops", "infrastructure", "developer-tools"]
---

Observability has become complicated. Vendors compete on features. Frameworks multiply. The "three pillars" have become four, or five, depending on who you ask.

Meanwhile, most teams I work with struggle to answer a simple question during an incident: "What's actually broken?"

Let me offer a more grounded perspective on building observability that works.

## Start with the Questions

Before you adopt any tool or framework, get clear on what you're trying to learn. The questions that matter most:

1. **Is the system healthy?** Can users do what they came to do?
2. **When something's wrong, where is it?** Which service? Which component? Which dependency?
3. **What changed?** Deployments, configuration, traffic patterns, external factors?
4. **Has this happened before?** Is this a known issue with a known fix, or something new?

Every observability investment should make at least one of these questions easier to answer. If it doesn't, it's probably overhead.

## The Three Layers That Matter

### Layer 1: User-Facing Health

This is what your users experience. It should be the first thing you look at in any incident.

**What to measure:**
- Request success rate (HTTP 2xx vs. 4xx vs. 5xx)
- Latency at meaningful percentiles (p50, p95, p99)
- Error rates by type
- Key business transactions (checkout completions, signups, etc.)

**How to measure it:**
- Synthetic checks that simulate real user flows
- Real user monitoring for client-side applications
- Edge/load balancer metrics for request-level data

**The principle:** If this layer is green, you probably don't have a user-facing problem. If it's red, you definitely do.

### Layer 2: Service Health

Once you know users are affected, you need to find which service is responsible.

**What to measure:**
- Per-service request rates and error rates
- Inter-service latency (time spent waiting on dependencies)
- Resource utilization (CPU, memory, connections)
- Queue depths and processing rates

**How to measure it:**
- Distributed tracing for request flow visibility
- Service-level metrics emitted by applications
- Infrastructure metrics from containers/VMs

**The principle:** This layer should let you quickly narrow from "something's wrong" to "this service is the problem."

### Layer 3: Component Health

Once you've identified the service, you need to find the actual cause.

**What to measure:**
- Database query performance and connection pool status
- Cache hit rates and eviction patterns
- External API latencies and error rates
- Application-specific metrics (queue consumers, background jobs, etc.)

**How to measure it:**
- Detailed application logging (structured, not printf debugging)
- Database and cache instrumentation
- Dependency health checks

**The principle:** This is where you actually fix things. The other layers tell you where to look.

## Common Patterns That Work

### Pattern 1: The Service Dashboard

Every service should have a dashboard answering:
- Is it receiving traffic?
- Is it successfully handling traffic?
- How fast is it responding?
- What resources is it consuming?

One dashboard per service. Standardized layout. No customization needed to understand a service you've never seen before.

### Pattern 2: The Deployment Correlation

Make it trivially easy to see "what changed" alongside "what broke." This means:
- Deployment markers on time-series graphs
- Configuration change events in the same timeline
- Clear mapping from alerts to recent changes

The majority of incidents are caused by recent changes. Make this connection obvious.

### Pattern 3: The Runbook Link

Every alert should link to a runbook. The runbook should contain:
- What this alert means
- First things to check
- Common causes and their fixes
- Escalation path if you're stuck

An alert without a runbook is just noise.

### Pattern 4: The Baseline Comparison

"Is this metric high?" is meaningless without context. Always show:
- Current value vs. same time yesterday
- Current value vs. same time last week
- Current value vs. the trend

Most metrics are only meaningful relative to their baseline.

## What Not to Do

### Don't collect everything

More data isn't better observability. It's more noise, more cost, and slower queries. Collect what helps you answer the questions that matter.

### Don't alert on everything

Alert fatigue is real and deadly. If your team ignores alerts, you don't have observability—you have false comfort.

A good heuristic: every alert should require human action. If the right response is "wait and see," it shouldn't be an alert.

### Don't build custom tooling (usually)

Unless observability is your core business, you probably can't build better tools than the vendors. The abstractions are well understood. Buy something and configure it well.

The exception: custom instrumentation for your specific domain. Generic tools don't know what matters to your business.

### Don't skip the fundamentals

I've seen teams with sophisticated tracing who couldn't answer "is the service up?" because they forgot to set up basic health checks.

Start simple. Add complexity when you've proven you need it.

## The Real Test

Good observability passes one test: when something breaks at 3 AM, can the on-call engineer understand what's happening and fix it without waking up the person who built the system?

If yes, you've built something useful. If no, you have dashboards but not observability.

That distinction matters more than any framework or vendor choice.
