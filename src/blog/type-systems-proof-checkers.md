---
title: "Type Systems Are Proof Checkers (And Why That Matters)"
date: "2024-12-13"
slug: "type-systems-proof-checkers"
tags: ["type-systems", "programming-languages", "computer-science", "compilers"]
author: "eli"
---

Type systems have a PR problem. People think they're about catching typos—passing a string where you meant an integer. That's not wrong, but it's like describing a car as "a thing that plays the radio." True, but missing the point.

Type systems are proof checkers. Your type annotations are theorems. Type checking is theorem proving. This perspective transforms how you think about types and the errors they catch.

## The Core Idea

A type is a statement about what values an expression can produce. `x: number` claims "x will be a number." `f: (a: string) => boolean` claims "f takes a string and returns a boolean."

When you write typed code, you're making claims throughout. Type checking verifies those claims are consistent. If `x: number` and you try to call `x.toUpperCase()`, you've made inconsistent claims—x can't be both a number and have string methods.

The type checker is a theorem prover, checking that your claims don't contradict each other.

## A Concrete Example

Consider this TypeScript:

```typescript
function head<T>(arr: T[]): T {
  return arr[0]
}
```

The type says: "Give me an array of T, I'll give you a T."

But this is actually a lie. What if the array is empty? Then `arr[0]` is `undefined`, not `T`. The proof is invalid.

TypeScript allows this because it balances soundness against usability. A sound type system (one where proofs are actually valid) would require:

```typescript
function head<T>(arr: T[]): T | undefined {
  return arr[0]
}
```

Now the claim is honest: you get a T or undefined. The proof checks out.

## Why "Proof Checker" Is Useful

This framing helps with several things:

### 1. Understanding Type Errors

Type errors aren't the compiler being pedantic. They're the compiler saying "your proof doesn't check out."

```typescript
function process(x: string | number) {
  return x.toUpperCase()  // Error!
}
```

The error isn't "you might have a number." It's "you claimed x could be string or number, but you're treating it as definitely string. Your claims are inconsistent."

Thinking in claims makes the error obvious: narrow your claim first.

```typescript
function process(x: string | number) {
  if (typeof x === 'string') {
    return x.toUpperCase()  // Now x is claimed to be string only
  }
  return x.toFixed(2)
}
```

### 2. Designing Better Types

If types are claims, then type design is deciding what to claim.

Claim too little, and you can't do much:
```typescript
function doSomething(x: unknown) {
  // Can barely use x at all
}
```

Claim too much, and you're lying:
```typescript
function parseJSON(s: string): User {
  return JSON.parse(s)  // Lie! Could be anything
}
```

The art is claiming exactly what's true:
```typescript
function parseJSON(s: string): unknown {
  return JSON.parse(s)  // Honest: we don't know what we'll get
}

function parseUser(s: string): User | null {
  const data = parseJSON(s)
  return isUser(data) ? data : null  // Honest: might fail
}
```

### 3. Understanding Generics

Generics are universally quantified claims. `function id<T>(x: T): T` claims "for any type T, give me a T, I'll return a T."

This is a strong claim. The implementation is highly constrained—you can't do much with a value of unknown type. But that constraint is actually useful:

```typescript
function id<T>(x: T): T {
  return x  // Only valid implementation
}
```

If the function type-checks with the generic signature, it *must* return its input unchanged. The type proves something about the behavior.

### 4. Seeing What Types Can't Prove

Types prove properties about programs, but not all properties. They can prove "this function returns a number" but not "this function returns a *positive* number" (in most type systems).

This clarifies what tests should cover. Types handle structural correctness. Tests handle semantic correctness.

```typescript
function divide(a: number, b: number): number {
  return a / b  // Type-checks, but what about b=0?
}
```

The type system proves you'll get a number. It doesn't prove the number is meaningful. That's what tests (or richer type systems) are for.

## The Curry-Howard Correspondence

This isn't just a metaphor. The Curry-Howard correspondence is a deep mathematical result: types and logical propositions are the same thing. Programs and proofs are the same thing.

| Programming | Logic |
|-------------|-------|
| Type | Proposition |
| Value of type | Proof of proposition |
| Function type A → B | Implication A ⇒ B |
| Product type (A, B) | Conjunction A ∧ B |
| Sum type A \| B | Disjunction A ∨ B |
| Generic ∀T. ... | Universal quantification ∀x. ... |

A function `(a: A) => B` is a proof that "given A, we can derive B." Calling the function is using the proof.

When you write:
```typescript
function swap<A, B>(pair: [A, B]): [B, A] {
  return [pair[1], pair[0]]
}
```

You've proven: for any A and B, if we have (A and B), we can derive (B and A). The type checker verified your proof.

## Practical Applications

### Impossible States

If a state shouldn't exist, make it unrepresentable. Then the type checker proves you never create it.

```typescript
// Allows invalid states
type Request = {
  status: 'pending' | 'success' | 'error'
  data?: Response
  error?: Error
}

// Makes invalid states unrepresentable
type Request =
  | { status: 'pending' }
  | { status: 'success', data: Response }
  | { status: 'error', error: Error }
```

The second version proves you can't have a success without data or an error without an error message.

### Exhaustiveness Checking

TypeScript's exhaustiveness checking is proof that you handled all cases:

```typescript
function handle(r: Request): string {
  switch (r.status) {
    case 'pending': return 'Loading...'
    case 'success': return r.data.message
    case 'error': return r.error.message
  }
  // No default needed—compiler proves all cases handled
}
```

Add a new status? The compiler flags every switch that needs updating.

### Branded Types

Enforce invariants by making the type system track them:

```typescript
type UserId = string & { __brand: 'UserId' }
type PostId = string & { __brand: 'PostId' }

function getUser(id: UserId): User { ... }
function getPost(id: PostId): Post { ... }

getUser(postId)  // Error! Can't pass PostId as UserId
```

The types prove you never accidentally swap IDs.

## The Bigger Picture

Thinking of types as proofs changes what you expect from them. They're not just catching obvious mistakes. They're proving properties about your code.

Not all properties—type systems have limits. But the properties they do prove, they prove statically, exhaustively, at compile time. No test suite can match that coverage for the things types can express.

The question isn't "should I use types?" It's "what do I want to prove, and can types prove it?" If yes, let the compiler do the proving. If no, write tests.

That's the real insight: types and tests aren't alternatives. They're complementary proof techniques for different kinds of properties.
