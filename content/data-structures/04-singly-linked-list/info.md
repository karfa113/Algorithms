---
title: Singly Linked List
short: Singly Linked List
tags: Linked List, Pointers, Dynamic Memory
---

## Concept

A **singly linked list** is a linear collection of **nodes**. Each node stores a `data` value and a `next` pointer to the following node; the list is reached through a `head` pointer and the last node's `next` is `NULL`. Nodes are allocated individually on the heap, so the list grows and shrinks one node at a time and insertion or deletion never shifts other elements, unlike an array.

The price is that there is no random access: reaching the k-th node needs a walk from `head`. Because links go only forward, deleting a node requires a pointer to its **predecessor**, which is why the programs keep a `prev` pointer while searching. This program supports insertion at the beginning, end and a given position, deletion by value or position, search, in-place reversal and display.

## Operations

1. **Step 1:** Start with `head = NULL` (empty list).
2. **Step 2:** `insertBegin(v)`: create node `n`, set `n->next = head`, then `head = n`.
3. **Step 3:** `insertEnd(v)`:
    - **(a)** Create node `n` with `n->next = NULL`.
    - **(b)** If the list is empty, set `head = n`.
    - **(c)** Otherwise walk `p` until `p->next == NULL` and set `p->next = n`.
4. **Step 4:** `insertPos(v, pos)`:
    - **(a)** If `pos < 1` or `pos > length + 1`, report an invalid position.
    - **(b)** If `pos == 1`, insert at the beginning.
    - **(c)** Otherwise move `p` to the node at `pos - 1`, then set `n->next = p->next` and `p->next = n`.
5. **Step 5:** `deleteValue(v)`: walk with `prev` and `cur` until `cur->data == v`. If not found, report it. Otherwise set `prev->next = cur->next` (or `head = cur->next` if `cur` is the head) and free `cur`.
6. **Step 6:** `deletePos(pos)`: report underflow if the list is empty or an invalid position if `pos` is out of range; otherwise walk to the node at `pos`, unlink it as in Step 5 and free it.
7. **Step 7:** `search(v)`: traverse from `head` counting positions and report the first position where `data == v`, or "not found".
8. **Step 8:** `reverse()`: with `prev = NULL`, `cur = head`, repeat: save `next = cur->next`, set `cur->next = prev`, advance `prev = cur`, `cur = next`. Finally set `head = prev`.
9. **Step 9:** `display()`: print each `p->data` followed by `->` from `head` until `p == NULL`, then print `NULL`.
10. **Step 10:** Stop.

## Complexity

- Insert at beginning: O(1)
- Insert at end: O(n)
- Insert at position: O(n)
- Delete by value: O(n)
- Delete by position: O(n)
- Search: O(n)
- Reverse: O(n)
- Space: O(n)

## Applications

- Building blocks for stacks, queues and hash-table chaining.
- Polynomial representation and sparse data.
- Dynamic memory allocators and free lists.
- Any sequence with frequent insertions and deletions at known positions.

## Viva

### What is the difference between an array and a linked list?

An array stores elements contiguously and gives O(1) random access but costly insertion and deletion in the middle. A linked list stores nodes anywhere in memory joined by pointers: O(1) insertion once the position is reached, but O(n) access and extra memory per node.

### Why is insertion at the end O(n) here?

There is no tail pointer, so the whole list must be traversed to find the last node. Keeping a `tail` pointer makes it O(1).

### Why do we need a `prev` pointer when deleting?

The node before the target must have its `next` changed to skip it, and a singly linked node cannot look backwards, so the predecessor is tracked during the walk.

### How does in-place reversal work?

Three pointers (`prev`, `cur`, `next`) flip each link one at a time to point backwards, in O(n) time and O(1) extra space. `head` finally points at the old last node.

### What special cases must insertion and deletion handle?

An empty list, and operations at the head, because `head` itself must change. Forgetting these causes `NULL` dereferences and lost lists.

### How can you detect a loop in a linked list?

Floyd's algorithm: move a slow pointer by one node and a fast pointer by two; if they ever meet, there is a cycle. It uses O(1) space.

### What happens if you free a node without unlinking it first?

The previous node still points to freed memory (a dangling pointer), so a later traversal gives undefined behaviour. Always relink first, then free.
