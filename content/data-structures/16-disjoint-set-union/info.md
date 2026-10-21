---
title: Disjoint Set Union (Union-Find)
short: Disjoint Set (DSU)
tags: Disjoint Set, Union-Find, Tree
---

## Concept

A **Disjoint Set Union** (also called **Union-Find**) keeps track of a collection of non-overlapping sets. It supports two operations: `find(x)`, which returns the representative (root) of the set containing `x`, and `union(a, b)`, which merges the sets containing `a` and `b`.

Each set is stored as a tree in a `parent[]` array: the root is its own parent. Two optimisations make it almost constant time: **path compression** (during `find`, point every visited node directly at the root) and **union by rank** (attach the shorter tree under the taller one). Together they give an amortised cost of `O(α(n))`, where `α` is the extremely slowly growing inverse Ackermann function.

## Operations

1. **Step 1:** `makeSets(n)`: for every `i` set `parent[i] = i` and `rank[i] = 0`.
2. **Step 2:** `find(x)`:
    - **(a)** If `parent[x] == x`, return `x`.
    - **(b)** Otherwise set `parent[x] = find(parent[x])` (path compression) and return `parent[x]`.
3. **Step 3:** `union(a, b)`:
    - **(a)** Compute `ra = find(a)` and `rb = find(b)`. If they are equal, the elements are already together — stop.
    - **(b)** If `rank[ra] < rank[rb]`, swap `ra` and `rb`.
    - **(c)** Set `parent[rb] = ra`.
    - **(d)** If both ranks were equal, increase `rank[ra]` by 1.
4. **Step 4:** `connected(a, b)`: return `find(a) == find(b)`.

## Complexity

- Make-set: O(1) per element
- Find (amortised): O(α(n))
- Union (amortised): O(α(n))
- Space: O(n)

## Applications

- Kruskal's minimum spanning tree (cycle detection).
- Counting connected components, detecting cycles in undirected graphs.
- Network connectivity, image segmentation, equivalence classes.

## Viva

### What problem does Union-Find solve?

It maintains a partition of elements into disjoint sets and answers "are these two in the same set?" and "merge these sets" very quickly.

### What is path compression?

While finding the root of `x`, every node on the path is re-pointed directly to the root, flattening the tree so later finds are faster.

### What is union by rank?

Always attach the root of the shallower tree beneath the root of the deeper one, so tree height stays `O(log n)`. Rank is an upper bound on the height.

### What is the complexity with both optimisations?

Amortised `O(α(n))` per operation, where `α` is the inverse Ackermann function — below 5 for any practical `n`.

### How is DSU used in Kruskal's algorithm?

For each edge `(u, v)` in increasing weight order, if `find(u) != find(v)` the edge joins two components, so add it and `union` them; otherwise it would form a cycle and is skipped.

### Can DSU split a set again?

No. Standard DSU supports only merging; deletions/splits need other structures (e.g. link-cut trees or offline tricks).

### Difference between rank and size in union?

Both heuristics keep trees shallow. Union by size attaches the smaller set (by element count) under the larger; union by rank compares tree-height bounds. Complexity is the same.
