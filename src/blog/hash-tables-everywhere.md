---
title: Hash Tables All the Way Down
date: '2024-12-13'
slug: hash-tables-everywhere
tags:
  - data-structures
  - computer-science
  - programming-languages
  - performance
author: eli
quote: >-
  Hash tables trade computation for space—they compute the slot from the key,
  adding CPU time but letting you use an array of any size instead of needing
  space proportional to the entire key space.
summary: >-
  Hash tables are everywhere in programming; understanding them reveals how most
  modern languages actually work.
---

Hash tables are the most underappreciated data structure in programming. Not because people don't use them—they use them constantly—but because the abstraction is so good that people forget what's happening underneath.

JavaScript objects? Hash tables. Python dictionaries? Hash tables. Ruby hashes? The name gives it away. When you understand hash tables, you understand a surprising amount of how dynamic languages actually work.

## The Fundamental Trade-off

Arrays give you O(1) access by index. But indices are integers, and the things you want to look up are usually not integers.

The insight: convert any key into an integer (the hash), use that as the index. Now you have O(1) access by arbitrary key.

```
hash("name") → 48291
hash("age")  → 17403

array[48291] = "Alice"
array[17403] = 42
```

But arrays need contiguous memory. You can't actually allocate array[48291] without allocating 0-48290. So you take the hash modulo the array size:

```
48291 % 16 = 3
17403 % 16 = 11

array[3]  = ("name", "Alice")
array[11] = ("age", 42)
```

Now different keys can hash to the same slot (collision). Handle collisions somehow—chaining or open addressing—and you have a hash table.

## The A-Ha Moment

Here's what makes hash tables click: they trade *computation* for *space*.

An array indexed by the key directly would need space proportional to the key space. If keys are 32-bit integers, you'd need 4 billion slots. If keys are strings, infinite slots.

Hash tables compute the slot from the key. This adds CPU time (hashing) but lets you use an array of any size. The load factor (items / slots) determines how many collisions you get.

More space → fewer collisions → faster operations (closer to O(1))
Less space → more collisions → slower operations (closer to O(n))

The sweet spot is typically 70-80% load. Modern implementations resize automatically when you cross this threshold.

## Why Dynamic Languages Are Hash Tables

In JavaScript, every object is a hash table:

```javascript
const obj = { name: "Alice", age: 42 }
obj.name     // Hash lookup
obj["name"]  // Same thing
obj.foo = 1  // Hash insert
```

Property access is hash lookup. Property assignment is hash insert. That's why objects can have arbitrary properties—the hash table accommodates any string key.

This also explains some performance characteristics:

- Adding properties is O(1) amortized, but triggers resize occasionally
- Looking up existing properties is O(1)
- Looking up non-existent properties is also O(1) (just returns undefined)
- Iterating all properties is O(n)

When V8 or SpiderMonkey optimize your JavaScript, a lot of what they're doing is *not* using hash tables. They detect objects with stable shapes and compile to direct memory offsets instead. That's why consistent object shapes matter for performance.

## Hash Functions Are Critical

A bad hash function destroys hash table performance. If every key hashes to the same slot, you have a linked list, not a hash table.

Good hash functions have these properties:

1. **Deterministic**: Same key → same hash, always
2. **Uniform distribution**: Keys should spread evenly across slots
3. **Avalanche effect**: Small key changes → big hash changes

The avalanche effect prevents clustering. Without it, similar keys (like "name1", "name2", "name3") might all hash to nearby slots, creating hot spots.

Real hash functions are carefully designed. MurmurHash, xxHash, and SipHash are common choices. Don't roll your own unless you know what you're doing.

## Collision Resolution Strategies

When two keys hash to the same slot, you need a strategy:

**Chaining**: Each slot holds a linked list of entries. Colliding entries go in the same list.
- Simple to implement
- Performance degrades gracefully
- Extra memory for list pointers
- Cache-unfriendly (following pointers is slow)

**Open addressing**: Colliding entries go in a different slot in the same array. "Probe" for an empty slot.
- Better cache performance (data stays in the array)
- More complex deletion (can't leave holes)
- Performance cliff at high load factors

Linear probing (try slot+1, slot+2, ...) is simple but causes clustering. Quadratic probing or double hashing work better.

Modern implementations usually use open addressing with Robin Hood hashing or Swiss tables—variations that minimize probe lengths.

## Sets Are Hash Tables Too

A set is just a hash table where you only care about keys, not values:

```javascript
const set = new Set()
set.add("apple")    // Insert key, no value
set.has("apple")    // Check key exists
```

The implementation is identical—hash the key, find the slot, store the key. O(1) membership testing is why sets are so useful.

## The JSON Hack

Ever needed to check if an array contains duplicates?

```javascript
// O(n²)
function hasDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true
    }
  }
  return false
}

// O(n)
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length
}
```

The Set version is O(n) because each insert and each membership check is O(1). The nested loop is O(n²) because you're comparing each pair.

This pattern—"throw it in a hash table for O(1) lookup"—solves countless interview problems. Most "optimize this O(n²) algorithm" questions want you to use a hash table.

## Hash Tables in Compilers

Compilers use hash tables everywhere:

- **Symbol tables**: Variable names → types and locations
- **Interned strings**: Deduplicate identical strings
- **Memoization**: Cache computed results
- **Constant pools**: Deduplicate literal values

When you look up a variable name, the compiler hashes it to find the symbol table entry. This is why variable lookup is fast even in huge programs.

String interning is particularly clever: store each unique string once, use the pointer as the identity. Comparing interned strings is pointer comparison—O(1) instead of O(n) for string comparison.

## When Not to Use Hash Tables

Hash tables aren't always optimal:

- **Small collections**: Array linear search might be faster due to cache effects
- **Ordered data**: Trees maintain order; hash tables don't
- **Range queries**: Hash tables can't efficiently find "all keys between X and Y"
- **Worst-case guarantees**: Hash tables have O(n) worst case; trees have O(log n)

Also, hashing has overhead. For tiny keys (like single integers), the hash computation might cost more than it saves.

## Building Intuition

When you see O(1) lookup in any language or library, ask: "Is this a hash table?" Usually the answer is yes.

- `Map` and `Set` in JavaScript: hash tables
- `dict` and `set` in Python: hash tables
- `HashMap` and `HashSet` in Java: hash tables
- `unordered_map` in C++: hash table
- Caching systems (memcached, Redis): giant distributed hash tables

Understanding hash tables means understanding a huge portion of the data structures you use daily. The abstraction is so clean you can ignore the implementation—until you hit a performance problem, and then knowing what's underneath saves you hours of confusion.
