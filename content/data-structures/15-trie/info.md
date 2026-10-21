---
title: Trie (Prefix Tree)
short: Trie
tags: Tree, String, Prefix
---

## Concept

A **trie** (prefix tree) is a tree that stores a set of strings character by character. The root represents the empty string, every edge is labelled with one letter, and the path from the root to a node spells a prefix. Words that share a prefix share the same path, so `car`, `card` and `care` use only one copy of `c-a-r`.

Each node holds an array `child[26]` (one slot for each letter `a` to `z`) and a flag `isEnd` that marks "a word ends here". The flag is needed because a word may be a prefix of another one (`app` and `apple`). The time to insert or search a word depends only on its **length** `L`, not on how many words are stored. Because children are visited in the order `a` to `z`, a depth-first traversal lists the words in **lexicographic order** with no extra sorting. This program accepts lowercase letters `a-z` only.

## Operations

1. **Step 1:** `insert(word)`:
    - **(a)** Start at the root. For each letter `c` of the word, look at `child[c]`.
    - **(b)** If that child is missing, create a new node and link it.
    - **(c)** Move to the child. After the last letter set `isEnd = true`. If it was already true, the word existed before.
2. **Step 2:** `search(word)`: follow the letters from the root. If a link is missing the word is absent. If you reach the last node, the word is present only when `isEnd` is true (otherwise it is just a prefix of some other word).
3. **Step 3:** `startsWith(prefix)`: follow the letters of the prefix. If a link is missing, no word starts with it. Otherwise do a DFS from the reached node, appending letters in `a..z` order, and print every node with `isEnd` set.
4. **Step 4:** `delete(word)`:
    - **(a)** First check that the word exists using `search`; otherwise report "not found".
    - **(b)** Recurse down the word and set `isEnd = false` at its last node.
    - **(c)** On the way back up, free a node if it has no word ending in it (`isEnd` false) and no children. Stop pruning at the first node that is still needed by another word.
5. **Step 5:** `listAll()`: run the same DFS from the root with an empty buffer. Words come out sorted because letters are tried in `a..z` order and a word is printed before the longer words that extend it.

## Complexity

- Insert: O(L)
- Search: O(L)
- Prefix search: O(L + size of output)
- Delete: O(L)
- List all words: O(total nodes)
- Space: O(N * L * 26) worst case for N words of length L

## Applications

- Autocomplete and type-ahead suggestions
- Spell checkers and dictionaries
- IP routing (longest prefix match) using a binary trie
- Word games such as Boggle and crossword solvers

## Viva

### What is a trie and why is it called a prefix tree?

A trie is a tree where each edge is a character and each root-to-node path is a prefix of the stored words. All words with a common prefix share the nodes of that prefix, hence the name.

### Why do we need the `isEnd` flag?

A node on a path may be a complete word and also a prefix of a longer word, for example `app` and `apple`. Without `isEnd` we could not tell whether `app` was inserted or is only part of `apple`.

### What is the time complexity of insert and search, and what does it depend on?

Both are `O(L)` where `L` is the length of the word. It does not depend on the number of words stored, which is the main advantage over a balanced BST of strings (`O(L log n)` comparisons).

### How does the trie list words in sorted order?

Each node visits its children from `a` to `z` during DFS, and a word is printed when its `isEnd` node is reached, before its longer extensions. This pre-order walk gives lexicographic order without sorting.

### How is deletion done and why must we prune nodes?

Unmark `isEnd` at the last node, then free nodes bottom-up that have no children and are not the end of another word. Pruning releases memory and keeps `startsWith` correct, since a leftover dead path would make a prefix look valid when no word uses it.

### What is the main drawback of a trie?

Memory. Each node stores 26 pointers even when most are empty. Compressed tries (radix trees) or storing children in a hash map or linked list reduce this at the cost of speed or simplicity.

### Trie vs hash table for storing strings?

A hash table gives average `O(L)` exact lookup but cannot do prefix queries or ordered listing efficiently. A trie supports prefix search, autocomplete and sorted output naturally, and has no hash collisions.
