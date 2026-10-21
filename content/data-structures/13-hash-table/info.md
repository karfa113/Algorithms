---
title: Hash Table (Chaining and Linear Probing)
short: Hash Table
tags: Hashing, Collision Handling, Searching
---

## Concept

A **hash table** stores keys in an array of `m` slots and uses a **hash function** `h(k)` to turn a key directly into an array index. With `h(k) = k mod m` the key `37` in a table of size 10 goes to slot 7. Lookup, insert and delete therefore take `O(1)` time on average, no matter how many keys are stored, which beats the `O(log n)` of balanced trees when only exact-match queries are needed (hash tables keep no sorted order).

Two different keys can hash to the same slot; this is a **collision**. This program implements both classic remedies. **Separate chaining** keeps a linked list in every slot, and colliding keys are simply appended to that list. **Open addressing with linear probing** stores every key inside the array itself: if slot `h` is taken, try `h+1, h+2, ...` (wrapping around) until a free slot is found. Because probing can never hold more than `m` keys, the table can become **full**. Deleting from a probing table cannot just empty the slot (that would break the probe chain of other keys), so the slot is marked **deleted** (a tombstone) and can be reused by later inserts. The **load factor** `alpha = n / m` controls performance: chaining degrades gracefully above 1, linear probing slows sharply as `alpha` approaches 1 because of **primary clustering**.

## Operations

1. **Step 1:** Hash function: `h(k) = ((k mod m) + m) mod m` (the extra `+ m` keeps the index non-negative for negative keys).
2. **Step 2:** Chaining `insert(k)`:
    - **(a)** Compute `i = h(k)`.
    - **(b)** Walk the list `bucket[i]`; if `k` is already present, report a duplicate and stop.
    - **(c)** Otherwise append a new node holding `k` at the tail of the list.
3. **Step 3:** Chaining `search(k)` / `delete(k)`: compute `i = h(k)` and walk `bucket[i]`. For delete, remember the previous node and unlink the matching node (or update `bucket[i]` when it is the head), then free it.
4. **Step 4:** Linear probing `find(k)`:
    - **(a)** For `j = 0, 1, ..., m-1` look at slot `p = (h(k) + j) mod m`.
    - **(b)** If the slot is `EMPTY`, stop: `k` is not in the table.
    - **(c)** If the slot is `OCCUPIED` and holds `k`, return `p`. A `DELETED` slot is skipped and probing continues.
5. **Step 5:** Linear probing `insert(k)`:
    - **(a)** If `find(k)` succeeds, report a duplicate.
    - **(b)** Probe `p = (h(k) + j) mod m` for `j = 0 .. m-1` and place `k` in the first slot that is not `OCCUPIED` (empty or deleted).
    - **(c)** If all `m` slots are occupied, report **"Table is full"**.
6. **Step 6:** Linear probing `delete(k)`: `p = find(k)`; if found, set the slot's state to `DELETED` (do not mark it `EMPTY`).
7. **Step 7:** Display: print every slot index with its list (chaining) or its key / `-` / `<deleted>` (probing).

## Complexity

- Search: O(1) average, O(n) worst
- Insert: O(1) average, O(n) worst
- Delete: O(1) average, O(n) worst
- Space: O(n)

## Applications

- Symbol tables in compilers and interpreters
- Caches, dictionaries and sets (`dict`, `HashMap`, `unordered_map`)
- Counting frequencies, removing duplicates, two-sum style problems
- Database indexing for equality lookups

## Viva

### What is a collision and how can it be resolved?

Two different keys hashing to the same index. It is resolved by **separate chaining** (a list per slot) or by **open addressing** (probe for another free slot: linear, quadratic or double hashing).

### Compare chaining and linear probing.

Chaining never fills up (load factor can exceed 1), deletion is easy, but it needs extra memory for pointers and is less cache friendly. Linear probing uses only the array and is cache friendly, but suffers from clustering, needs a tombstone scheme for deletion, and fails when the table is full.

### Why can't we simply empty a slot when deleting in open addressing?

Searching stops at the first empty slot. If a key sat further along a probe chain, emptying a slot in the middle would make that key unreachable. A `DELETED` marker lets searches continue past it.

### What is primary clustering?

In linear probing, long runs of occupied slots build up; a key hashing anywhere into a run must probe to its end, which makes the run longer still. This increases the average number of probes.

### What is the load factor and why does it matter?

`alpha = n / m`. Expected cost of an unsuccessful search is about `1 + alpha` with chaining and about `(1 + 1/(1-alpha)^2) / 2` with linear probing, so probing needs `alpha` kept well below 1 (typically resized at about 0.7).

### What makes a good hash function?

It should be fast, spread keys uniformly over all slots and depend on the whole key. For `k mod m`, choosing `m` as a prime not close to a power of 2 reduces patterns; a table size of 10 is only for demonstration.

### Why is the worst case O(n)?

If every key hashes to the same slot, chaining becomes one long list and probing walks the whole table, so each operation is linear.

### What happens if a key is inserted into a full probing table?

The probe loop visits all `m` slots without finding a free one, so the insert fails; the table must be resized or rehashed into a larger array.
