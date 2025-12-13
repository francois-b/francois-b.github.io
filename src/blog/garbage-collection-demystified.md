---
title: "Why Garbage Collection Isn't Magic"
date: "2024-12-13"
slug: "garbage-collection-demystified"
tags: ["memory-management", "computer-science", "programming-languages", "performance"]
author: "eli"
---

Garbage collection has an aura of mystery. Memory appears when you need it and disappears when you don't. It "just works"—until it doesn't, and then you're debugging pauses and memory leaks in a system you don't understand.

The algorithms behind garbage collection are elegant and comprehensible. Understanding them won't change how you write code most days, but it will change how you debug performance problems.

## The Core Problem

Programs allocate memory. Functions create local variables, constructors create objects, parsers build trees. That memory needs to be freed eventually, or you run out.

Manual memory management (C, C++) puts this on the programmer: every `malloc` needs a matching `free`. Get it wrong and you have memory leaks (forgot to free) or use-after-free bugs (freed too early).

Garbage collection automates this: the runtime figures out what memory is still reachable and frees everything else.

The question is: how do you know what's reachable?

## Reachability

The insight: start from "roots" (global variables, stack variables, registers) and follow every pointer. Anything you can reach is live. Everything else is garbage.

```
Stack: [ptr1, ptr2]
       ↓      ↓
       A  →   B
              ↓
              C      D (unreachable = garbage)
```

A, B, and C are reachable from the stack. D isn't. D can be freed.

This is the fundamental idea. Every GC algorithm is a variation on "find unreachable memory and reclaim it."

## Mark and Sweep

The simplest algorithm:

1. **Mark phase**: Starting from roots, traverse all reachable objects. Mark each as "alive."
2. **Sweep phase**: Walk through all allocated memory. Free anything not marked.

```
Before:
[A✓] [B✓] [C✓] [D ] [E✓] [F ]

After sweep:
[A ] [B ] [C ] [free] [E ] [free]
```

It works, but has problems:
- **Stop the world**: The program pauses while GC runs
- **Fragmentation**: Free memory is scattered in small chunks
- **Time proportional to heap**: You traverse everything, even if most is garbage

## Generational Collection

Here's the key insight that makes modern GC fast: most objects die young.

Think about it. A function creates temporary variables, uses them, returns. Those variables become garbage immediately. Meanwhile, global data structures live for the program's lifetime.

Generational collectors exploit this:

- **Young generation**: Small, collected frequently
- **Old generation**: Large, collected rarely

New objects go in the young generation. If they survive a collection, they're promoted to old. Since most objects die young, young-generation collection is fast and reclaims most garbage.

```
Allocation → Young Gen → (survives) → Old Gen
                 ↓
             (collected quickly)
```

V8, the JVM, and .NET all use generational collection. That's why their GC pauses are usually short—they're collecting the small young generation, not the whole heap.

## The Write Barrier

Generational collection has a subtlety: what if an old object points to a young object?

```
Old Gen: [A] → [B] (B is in Young Gen)
```

If we only scan the young generation, we'll miss that B is reachable from A. We'd incorrectly free B.

The solution is a **write barrier**: every time you write a pointer, check if it's an old→young reference. If so, add it to a "remembered set" of roots.

Now young-generation collection starts from:
- Stack and globals (normal roots)
- Remembered set (old→young pointers)

The write barrier adds overhead to every pointer write. But it's worth it: scanning the small remembered set is much faster than scanning the entire old generation.

## Mark-Compact vs. Copying Collection

Fragmentation is a real problem. After many allocations and collections, free memory is scattered:

```
[A] [free] [B] [free] [free] [C] [free]
```

You might have 4 units free but can't allocate an object of size 3.

**Mark-Compact** solves this by moving live objects together:

```
[A] [B] [C] [free free free free]
```

All live objects are contiguous. Free space is one big block. But you have to update all pointers to the moved objects—expensive.

**Copying collection** is simpler: divide memory into two halves. Allocate in one half. When full, copy live objects to the other half (compacting as you go), then swap.

```
Before: From-space [A] [garbage] [B] [garbage]
After:  To-space   [A] [B] [free free]
```

Copying collection is fast—you only touch live objects, not garbage. But you can only use half your memory at any time.

Young generation collectors typically use copying collection: the space overhead is small (young generation is small), and most objects are garbage anyway.

## Incremental and Concurrent Collection

Stop-the-world pauses are painful for interactive applications. Users notice 100ms pauses. Games notice 16ms pauses.

**Incremental collection** breaks work into small chunks, interleaved with program execution:

```
Run program → GC work (1ms) → Run program → GC work (1ms) → ...
```

**Concurrent collection** runs GC on a separate thread while the program runs:

```
Main thread: [program execution...]
GC thread:   [marking...] [sweeping...]
```

Both are tricky because the program keeps modifying the heap while you're collecting. You need careful synchronization to avoid collecting objects that become reachable during collection.

This is where GC gets genuinely complex. The algorithms for concurrent marking, the barriers needed to track mutations, the handling of race conditions—these fill papers and PhDs.

## Practical Implications

### Object Pooling

If you're creating and destroying many short-lived objects, GC overhead adds up. Object pooling reuses objects instead of allocating new ones:

```javascript
class BulletPool {
  free = []
  acquire() {
    return this.free.pop() || new Bullet()
  }
  release(bullet) {
    bullet.reset()
    this.free.push(bullet)
  }
}
```

Same object, recycled. No allocation, no GC. Games do this constantly.

### Memory Leaks in GC Languages

"But I have GC, I can't have memory leaks!"

Yes you can. A memory leak is memory you're not using but can't reclaim. In GC languages, that means accidentally keeping references:

```javascript
const cache = {}
function process(id, data) {
  cache[id] = data  // Never removed!
}
```

The cache grows forever. Every entry is "reachable" via the global `cache` object, so GC never collects it.

GC collects unreachable memory. Memory you can still reach but don't need isn't the GC's problem—it's yours.

### Understanding Pauses

When your application pauses unpredictably, GC is often the culprit. Understanding what triggers collection helps:

- High allocation rate → frequent young-gen collection
- Surviving objects → promotion → eventual old-gen collection
- Large heap → longer collection times

Reducing allocation rate is often more effective than tuning GC parameters. Every object you don't allocate is an object that doesn't need collecting.

## The Bigger Picture

Garbage collection is a systems problem: how do you efficiently reclaim unused memory in a running program? The solutions involve trade-offs between pause time, throughput, memory overhead, and implementation complexity.

The algorithms are decades old. Mark-and-sweep is from 1960. Generational collection is from the 1980s. Modern GCs are refinements and combinations of these ideas, not fundamentally new.

Understanding the algorithms won't make GC problems disappear. But it transforms them from mysterious ("why is my app pausing?") to debuggable ("old-gen collection is scanning a 2GB heap"). That's the real value of knowing what's under the abstraction.
