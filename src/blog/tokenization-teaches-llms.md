---
title: What Tokenization Teaches You About LLMs
date: '2024-12-13'
slug: tokenization-teaches-llms
tags:
  - ai
  - llm
  - compilers
  - computer-science
author: eli
quote: >-
  Ask an LLM 'How many letters are in strawberry?' and it often gets it wrong.
  Not because it can't count, but because it doesn't see individual letters. It
  sees tokens, and the token boundaries don't align with character boundaries.
summary: 'LLMs process tokens, not characters, explaining many quirks and limitations'
---

Most people using LLMs have no idea what's happening to their text before the model sees it. They type "hello world" and assume the model reads "hello world." It doesn't. It reads something like `[15339, 1917]`—tokens, not characters.

Understanding tokenization won't make you an AI researcher. But it will explain a surprising number of LLM quirks and limitations.

## The Basic Idea

LLMs don't process characters. They process tokens—chunks of text that the model treats as atomic units. A tokenizer converts your text into a sequence of token IDs that map to the model's vocabulary.

The vocabulary is learned from training data using algorithms like BPE (Byte Pair Encoding). Common words become single tokens. Rare words get split into pieces. Very rare strings might be split down to individual characters.

Examples (approximate, varies by model):

| Text | Tokens |
|------|--------|
| "hello" | `[hello]` (1 token) |
| "tokenization" | `[token, ization]` (2 tokens) |
| "JavaScript" | `[Java, Script]` (2 tokens) |
| "GPT-4" | `[G, PT, -, 4]` (4 tokens) |

## Why This Matters

### 1. Character Counting Is Hard

Ask an LLM "How many letters are in 'strawberry'?" and it often gets it wrong. Not because it can't count, but because it doesn't see individual letters. It sees tokens, and the token boundaries don't align with character boundaries.

"Strawberry" might tokenize as `[str, aw, berry]`. The model sees three tokens, not ten characters. To count characters, it has to mentally decompose tokens it's never been trained to think about character-by-character.

This isn't a bug in the model. It's a fundamental consequence of how tokenization works.

### 2. Some Languages Cost More

English text tokenizes efficiently because the training data was heavily English. Common English words are usually single tokens.

Other languages? Less efficient. The same semantic content might require 2-3x more tokens in Japanese or Arabic. This means:
- Higher API costs (you pay per token)
- Less context fits in the window
- Potentially worse performance (fewer examples fit in few-shot prompts)

The tokenizer encodes assumptions about what text is "common." Those assumptions reflect the training data's biases.

### 3. Code Is Expensive

Code tokenizes poorly compared to natural language. Variable names, syntax characters, and indentation all eat tokens:

```python
def calculate_total(items):
```

This single line might be 8-10 tokens. A paragraph of English prose of similar length might be 5-6 tokens. Code-heavy prompts fill the context window faster than you'd expect.

### 4. Arithmetic Is Token Arithmetic

LLMs are notoriously bad at arithmetic. Part of the reason is tokenization.

Consider "1234 + 5678". The model doesn't see four-digit numbers. It sees something like `[123, 4, +, 567, 8]`. The token boundaries don't align with place values. The model has to learn arithmetic across arbitrary token splits.

It's like asking you to add numbers where the digits are scrambled: "12" + "34" becomes "1 2+3 4" and you have to reconstruct what that means. Possible, but harder than necessary.

### 5. The Same Word Isn't Always The Same Token

" hello" (with a leading space) and "hello" (no space) are different tokens. Context matters. The tokenizer treats word boundaries as significant.

This explains some weird behaviors:
- "Say 'hello'" and "Say ' hello'" might produce different outputs
- Prompts are sensitive to whitespace in surprising ways
- Copy-pasting text can introduce invisible differences

### 6. Token Limits Are Uneven

"8K context window" means 8,192 tokens, not 8,192 words or characters. How much text fits depends entirely on how efficiently your text tokenizes.

Dense technical content? You might get 4,000 words. Multilingual content with rare characters? Maybe 2,000 words. The "same" context limit accommodates very different amounts of information.

## The Compiler Analogy

If you've written a compiler, tokenization is familiar. It's just lexical analysis—converting a stream of characters into a stream of tokens.

The difference: in a compiler, you design the token vocabulary for your language. `if`, `while`, `{`, `}` are tokens because you decided they should be.

In an LLM tokenizer, the vocabulary is learned from data. "The" is a token because it appears frequently. "Defenestration" gets split because it's rare. The vocabulary reflects statistical patterns in text, not deliberate language design.

This has a weird implication: the tokenizer is a kind of compression algorithm. Common patterns compress to single tokens. Rare patterns expand to many tokens. The model's "native" representation is whatever compresses well in the training data.

## Building Intuition

You can explore tokenization yourself. OpenAI has a [tokenizer tool](https://platform.openai.com/tokenizer). Paste in text and see how it splits.

Try these experiments:
- Compare "color" vs "colour" (British English often tokenizes worse)
- Compare "function" in English vs "función" in Spanish
- Look at how Python code tokenizes vs English descriptions of the same logic
- See what happens to emoji and special characters

The patterns you find will explain behaviors you've seen in LLM outputs.

## The Meta-Lesson

Tokenization is invisible infrastructure. You can use LLMs productively without understanding it. But when things go wrong—odd character counting, expensive prompts, inconsistent behavior with whitespace—tokenization is often the explanation.

More broadly: this is a case where understanding what's beneath the abstraction makes you better at using the abstraction. You're not fighting the tool's quirks blindly. You understand why they exist, and you can work with them.

That's the compiler mindset applied to AI: the model is a system. Systems have internals. Understanding the internals, even approximately, makes you a better user of the system.
