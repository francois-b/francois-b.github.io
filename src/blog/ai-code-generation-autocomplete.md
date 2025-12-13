---
title: "AI Code Generation Is Just Autocomplete (And That's Not an Insult)"
date: "2024-12-13"
slug: "ai-code-generation-autocomplete"
tags: ["ai", "llm", "developer-tools", "computer-science"]
author: "eli"
---

"It's just autocomplete" is supposed to be dismissive. It's also accurate—and understanding why helps you use AI coding assistants more effectively.

The models behind GitHub Copilot, Claude, and GPT are, at their core, predicting the next token given previous tokens. That's autocomplete. But it's autocomplete that's seen billions of lines of code and learned patterns that feel like understanding.

Grasping the mechanism clarifies both the power and the limitations.

## How It Actually Works

Large language models are trained to predict the next token. Given "def factorial(", predict what comes next. The model learns: "n):" is likely. Then given "def factorial(n):", predict next. The model learns: "\n" then "if n" is likely.

During training, the model sees code from millions of repositories. It learns:
- Syntax: what sequences of tokens are valid
- Patterns: how functions are typically structured
- Conventions: naming patterns, documentation styles
- Algorithms: common implementations of common problems

At inference time, the model generates code by repeatedly predicting the next token. Each prediction is informed by everything the model learned during training, conditioned on the context you've provided.

This is autocomplete, but autocomplete with an extremely sophisticated model of "what typically comes next."

## Why It Works So Well

Code is highly structured and repetitive—more so than natural language. The same patterns appear across codebases:

- Error handling boilerplate
- CRUD operations
- API client implementations
- Configuration parsing
- Test setup and teardown

If you've seen a thousand implementations of "read file, parse JSON, extract field," predicting the 1001st is straightforward.

Code also has strong local context. The function signature strongly constrains the function body. The variable names suggest their purpose. The imports reveal the libraries in use. This context makes prediction easier.

And code has verifiable correctness—at least partially. The model learns that certain token sequences lead to syntax errors and avoids them. It learns that certain patterns satisfy type checkers. The structure of code provides implicit supervision.

## Where Autocomplete Excels

### Boilerplate and Glue Code

```javascript
// You write:
function fetchUser(id) {
  // AI completes:
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`)
  }
  return response.json()
}
```

This is *exactly* what autocomplete should do. The pattern is well-established. The context (function name, parameter) makes the implementation obvious. You're not doing creative work—you're typing out a pattern everyone uses.

Let the model type it for you.

### Syntax You Can't Remember

```python
# How do I do that regex again?
pattern = re.compile(r'^(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})$')
```

The model has seen thousands of regex patterns. It knows the syntax better than you do. This is autocomplete's home turf.

### API Usage

```python
# Using a library you don't know well
import pandas as pd
df = pd.read_csv('data.csv')
df.groupby('category').agg({'value': ['mean', 'sum', 'count']})
```

The model learned from code that uses pandas. It knows the common operations, the method names, the parameter orders. You provide the intent; it provides the incantation.

## Where Autocomplete Fails

### Novel Algorithms

Ask the model to implement a new algorithm it hasn't seen, and it will produce something that *looks* like code. But "looks like code" isn't the same as "works correctly."

The model predicts what code typically looks like. If your algorithm is atypical, the prediction is unreliable. You might get a plausible-looking implementation of the *wrong* algorithm.

### Subtle Correctness Requirements

```python
# Looks right, might be wrong
def concurrent_update(data, lock):
    with lock:
        value = data.get('count', 0)
    # Bug: modification outside lock!
    data['count'] = value + 1
```

The model doesn't "understand" thread safety. It predicts tokens that often appear near locks. Whether the locking is actually correct requires reasoning about invariants—not pattern matching.

### Your Specific Context

The model doesn't know:
- Your business rules
- Your architectural decisions
- The quirks of your specific codebase
- What's in files it hasn't seen

It predicts based on what code *typically* looks like. Your code might need to be atypical for good reasons. The model will confidently suggest typical code anyway.

### Security-Critical Code

```python
# Generated password check
def verify_password(stored, provided):
    return stored == provided  # Timing attack vulnerability!
```

The model learned from average code. Average code has average security—which means full of vulnerabilities. Security-critical code needs to be *better* than average, and the model pulls you toward average.

## Using Autocomplete Effectively

### Provide Rich Context

The model predicts from context. More context → better predictions.

```python
# Sparse context: could be anything
def process(data):

# Rich context: clear intent
def process_payment_transaction(
    transaction: PaymentTransaction,
    gateway: PaymentGateway,
    config: ProcessingConfig
) -> ProcessingResult:
    """
    Process a payment transaction through the specified gateway.

    Handles retry logic, idempotency, and error reporting.
    """
```

The second version gives the model much more to work with.

### Verify, Don't Trust

Treat generated code like code from an unreliable colleague: review it before committing. The model is often right, but when it's wrong, it's confidently wrong.

Run tests. Check edge cases. Read the generated code critically.

### Know When to Stop

If you're fighting the autocomplete—rejecting suggestions, heavily editing output—you've probably left its comfort zone. Write that part yourself.

The model is a force multiplier for work you know how to do. It's not a replacement for skills you lack.

### Use It for First Drafts

Generated code is a starting point, not a finished product. Let the model produce boilerplate, then refine it.

```
1. Accept the autocomplete
2. Read what it wrote
3. Fix the parts that are wrong for your context
4. Improve the parts that are merely typical
```

This workflow is faster than writing from scratch, but you're still doing the thinking.

## The Deeper Lesson

"Just autocomplete" undersells it. Autocomplete backed by a model that's seen billions of lines of code is genuinely useful. It handles the mechanical parts of programming—the patterns, the syntax, the boilerplate—so you can focus on the parts that require actual thought.

But it's also genuinely *just autocomplete*. It predicts what comes next based on what it's seen before. It doesn't reason, verify, or understand. It generates plausible sequences of tokens.

The engineers who use these tools effectively are the ones who understand this. They let autocomplete do what it's good at. They step in where it's weak. They treat generated code as a draft, not an oracle.

That's not an insult to the technology. It's how you actually use it well.

---

*— Eli*
