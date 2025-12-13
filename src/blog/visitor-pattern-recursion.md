---
title: "The Visitor Pattern Is Just Recursion in Disguise"
date: "2024-12-13"
slug: "visitor-pattern-recursion"
tags: ["design-patterns", "compilers", "programming-languages", "computer-science"]
author: "eli"
---

The Visitor pattern has a reputation for being confusing. Double dispatch, accept methods, visitor interfaces—the ceremony obscures what's actually happening. But strip away the object-oriented machinery and you'll find something familiar: it's just recursion with pluggable behavior.

## The Setup

Say you have an expression tree:

```
    +
   / \
  3   *
     / \
    4   5
```

You want to evaluate it. You also want to print it. And maybe compile it to bytecode. Each operation needs to traverse the tree and do something different at each node.

## The Direct Approach

Without the Visitor pattern, you'd write:

```javascript
function evaluate(node) {
  if (node.type === 'number') return node.value
  if (node.type === 'add') return evaluate(node.left) + evaluate(node.right)
  if (node.type === 'multiply') return evaluate(node.left) * evaluate(node.right)
}

function print(node) {
  if (node.type === 'number') return String(node.value)
  if (node.type === 'add') return `(${print(node.left)} + ${print(node.right)})`
  if (node.type === 'multiply') return `(${print(node.left)} * ${print(node.right)})`
}
```

Two functions, same structure: check the node type, recurse into children, combine results. The only difference is what you do at each node type.

## The Pattern

The Visitor pattern extracts that commonality:

```javascript
function visit(node, visitor) {
  switch (node.type) {
    case 'number': return visitor.number(node)
    case 'add': return visitor.add(node,
      () => visit(node.left, visitor),
      () => visit(node.right, visitor))
    case 'multiply': return visitor.multiply(node,
      () => visit(node.left, visitor),
      () => visit(node.right, visitor))
  }
}

const evaluator = {
  number: (n) => n.value,
  add: (n, left, right) => left() + right(),
  multiply: (n, left, right) => left() * right()
}

const printer = {
  number: (n) => String(n.value),
  add: (n, left, right) => `(${left()} + ${right()})`,
  multiply: (n, left, right) => `(${left()} * ${right()})`
}

visit(tree, evaluator)  // 23
visit(tree, printer)    // "(3 + (4 * 5))"
```

The recursion lives in `visit`. The behavior lives in the visitor objects. Same recursive structure, different pluggable behaviors.

## The A-Ha Moment

Here's what makes this click: the Visitor pattern is a way to write recursive functions when you can't modify the data structure.

In functional languages, you'd define evaluation and printing right in the data type definition. In languages with pattern matching, you'd use match expressions. The Visitor pattern solves the same problem in OOP languages where the data structure is already defined and you can't add methods to it.

That's why it exists. Not because it's inherently elegant, but because it solves a real problem: separating tree traversal from tree processing when you don't control the tree class.

## Why The OOP Version Looks Complicated

The classic OOP Visitor has more ceremony:

```java
interface ExprVisitor<T> {
  T visitNumber(NumberExpr expr);
  T visitAdd(AddExpr expr);
  T visitMultiply(MultiplyExpr expr);
}

abstract class Expr {
  abstract <T> T accept(ExprVisitor<T> visitor);
}

class AddExpr extends Expr {
  <T> T accept(ExprVisitor<T> visitor) {
    return visitor.visitAdd(this);
  }
}
```

The "double dispatch" (`expr.accept(visitor)` calls `visitor.visitAdd(this)`) exists because Java doesn't have pattern matching. It's a workaround for language limitations, not inherent to the concept.

In essence:
- `accept` is "tell me what type you are"
- The visitor method is "here's what to do for that type"
- Recursion happens when visitor methods call `accept` on child nodes

## Practical Implications

### 1. Adding Operations Is Easy

Want to add a new operation? Define a new visitor. No changes to existing code.

```javascript
const countNodes = {
  number: () => 1,
  add: (n, left, right) => 1 + left() + right(),
  multiply: (n, left, right) => 1 + left() + right()
}
```

### 2. Adding Node Types Is Hard

Want to add a new node type (say, `subtract`)? You have to update every visitor. This is the fundamental trade-off.

Functional programming has the opposite trade-off: adding node types is easy (add a case to the type), but adding operations means modifying every function that matches on the type.

### 3. Short-Circuiting Is Natural

Because the visitor controls when recursion happens, you can stop early:

```javascript
const containsFive = {
  number: (n) => n.value === 5,
  add: (n, left, right) => left() || right(),  // short-circuits!
  multiply: (n, left, right) => left() || right()
}
```

With explicit recursion, this is obvious. The pattern just preserves it.

## When To Use It

Use the Visitor pattern when:

- You have a stable tree structure with multiple node types
- You need multiple traversal operations
- You want to keep operations decoupled from the tree classes

Don't use it when:

- You have one or two operations (just write the recursive function)
- The tree structure changes frequently (every change breaks all visitors)
- The "visitor" would just replicate the tree structure anyway

## A Final Thought

The Visitor pattern clicked for me when I stopped thinking about objects and interfaces and started thinking about recursion.

The pattern doesn't exist to be clever. It exists because recursive tree processing is useful, and OOP languages needed a way to express it without pattern matching.

If this abstraction disappeared tomorrow, you'd rebuild it as recursive functions. Which tells you exactly what it is.
