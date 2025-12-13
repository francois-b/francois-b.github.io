---
title: The Magic of Pratt Parsing
date: '2024-12-13'
slug: pratt-parsing-magic
tags:
  - compilers
  - parsing
  - programming-languages
  - algorithms
author: eli
quote: >-
  Traditional recursive descent uses the call stack to encode precedence. Pratt
  parsing uses the precedence values to encode precedence.
summary: >-
  Pratt parsing simplifies operator precedence by using data instead of complex
  function hierarchies.
---

Every parsing tutorial teaches recursive descent. Write a function for each grammar rule, call them recursively, build a tree. It works, it's intuitive, and then you hit operator precedence.

Suddenly you need separate functions for each precedence level: `parseAdditive` calls `parseMultiplicative` calls `parseUnary` calls `parsePrimary`. Add a new precedence level, add a new function, wire it into the chain. It's tedious.

Pratt parsing solves this elegantly. Once you see how it works, you'll wonder why anyone teaches anything else.

## The Problem

Consider parsing: `1 + 2 * 3 - 4`

The tree should be:
```
      -
     / \
    +   4
   / \
  1   *
     / \
    2   3
```

Multiplication binds tighter than addition, so `2 * 3` groups together. Addition and subtraction are left-associative, so `1 + ... - 4` groups left to right.

Traditional recursive descent handles this by encoding precedence in the call structure. Lower precedence functions call higher precedence functions:

```javascript
function parseAdditive() {
  let left = parseMultiplicative()
  while (token === '+' || token === '-') {
    let op = token
    advance()
    let right = parseMultiplicative()
    left = { op, left, right }
  }
  return left
}

function parseMultiplicative() {
  let left = parsePrimary()
  while (token === '*' || token === '/') {
    // same pattern
  }
  return left
}
```

Four precedence levels? Four functions. Fifteen precedence levels? Fifteen functions.

## Pratt's Insight

Vaughan Pratt's insight: instead of encoding precedence in the call structure, encode it in the operators themselves. Then write one function that consults the precedence.

Each operator has a "binding power"—a number representing how tightly it holds its operands. Higher numbers bind tighter.

```javascript
const precedence = {
  '+': 10,
  '-': 10,
  '*': 20,
  '/': 20,
}
```

The parser has one core function:

```javascript
function parseExpression(minPrecedence = 0) {
  let left = parsePrimary()

  while (precedence[token] > minPrecedence) {
    let op = token
    let prec = precedence[op]
    advance()
    let right = parseExpression(prec)  // Key insight!
    left = { op, left, right }
  }

  return left
}
```

That's it. One function handles all binary operators regardless of precedence.

## How It Works

The magic is in `parseExpression(prec)`. When we see an operator, we parse the right side at that operator's precedence level.

Walk through `1 + 2 * 3 - 4`:

1. `parseExpression(0)` starts
2. Parse `1` as the left side
3. See `+` (precedence 10 > 0), so enter the loop
4. Call `parseExpression(10)` for the right side
5. Parse `2` as the left side (inside the recursive call)
6. See `*` (precedence 20 > 10), so enter the loop
7. Call `parseExpression(20)` for the right side
8. Parse `3`, see `-` (precedence 10 ≤ 20), exit loop
9. Return `2 * 3` node
10. Back in step 4's call: see `-` (precedence 10 ≤ 10), exit loop
11. Return `1 + (2 * 3)` node
12. Back in the original call: see `-` (precedence 10 > 0), enter loop
13. Parse `4`, return
14. Final result: `(1 + (2 * 3)) - 4`

The precedence check `precedence[token] > minPrecedence` controls when to "steal" the operand. Higher precedence operators grab operands from lower precedence ones.

## The A-Ha Moment

Traditional recursive descent uses the *call stack* to encode precedence. Pratt parsing uses the *precedence values* to encode precedence.

Both achieve the same result: higher-precedence operators bind before lower-precedence ones. But Pratt parsing does it with data instead of code structure.

This is why adding a new operator is trivial:

```javascript
precedence['**'] = 30  // Exponentiation, highest precedence
```

One line. No new functions. The existing `parseExpression` handles it automatically.

## Left vs Right Associativity

`1 - 2 - 3` should parse as `(1 - 2) - 3` (left-associative).
`2 ** 3 ** 4` should parse as `2 ** (3 ** 4)` (right-associative).

The fix is subtle: for right-associative operators, use `prec - 1` instead of `prec`:

```javascript
function parseExpression(minPrecedence = 0) {
  let left = parsePrimary()

  while (precedence[token] > minPrecedence) {
    let op = token
    let prec = precedence[op]
    let nextPrec = isRightAssoc(op) ? prec - 1 : prec
    advance()
    let right = parseExpression(nextPrec)
    left = { op, left, right }
  }

  return left
}
```

For left-associative operators, `parseExpression(prec)` means "only steal if the next operator is *higher* precedence." For right-associative operators, `parseExpression(prec - 1)` means "steal if the next operator is *equal or higher* precedence."

Same-precedence operators: left-associative yields left, right-associative yields right. The decrement controls associativity.

## Prefix and Postfix Operators

Pratt parsing handles unary operators too. The original paper calls them "null denotations" (prefix) and "left denotations" (infix/postfix).

```javascript
function parseExpression(minPrecedence = 0) {
  let left

  // Prefix handling
  if (token === '-') {
    advance()
    let operand = parseExpression(prefixPrecedence['-'])
    left = { op: 'negate', operand }
  } else {
    left = parsePrimary()
  }

  // Infix handling (same as before)
  while (infixPrecedence[token] > minPrecedence) {
    // ...
  }

  return left
}
```

Postfix operators (like `++` in C) fit into the infix loop but don't parse a right operand.

## Why This Matters

Beyond the practical benefit (less code, easier to modify), Pratt parsing demonstrates a deeper principle: sometimes the right data structure eliminates complex control flow.

The recursive descent approach encodes precedence in code. Pratt parsing encodes it in data. The data-driven approach is:
- More concise (one function vs. many)
- Easier to modify (change data vs. restructure code)
- Easier to understand once you see the pattern

This pattern appears everywhere in programming. When you find yourself writing repetitive code that varies by some parameter, consider whether you could make that parameter data instead.

## Building Your Own

Here's a minimal complete Pratt parser:

```javascript
const tokens = ['1', '+', '2', '*', '3', '-', '4', 'EOF']
let pos = 0
const token = () => tokens[pos]
const advance = () => pos++

const prec = { '+': 10, '-': 10, '*': 20, '/': 20 }

function parse(minPrec = 0) {
  let left = parseInt(token()); advance()
  while (prec[token()] > minPrec) {
    let op = token(); advance()
    let right = parse(prec[op])
    left = { op, left, right }
  }
  return left
}

console.log(JSON.stringify(parse(), null, 2))
```

~15 lines for a working expression parser with correct precedence. Try adding operators and see how little changes.

That's the magic of Pratt parsing: complexity that seems intrinsic to the problem turns out to be an artifact of the solution approach.
