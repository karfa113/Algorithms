---
title: Circular Linked List
short: Circular Linked List
tags: Linked List, Circular, Pointers
---

## Concept

A **circular linked list** is a linked list in which the last node does not point to `NULL` but back to the first node, so the nodes form a ring. There is no natural "end": from any node you can reach every other node by following `next` pointers. Each node is allocated separately on the heap and holds `data` and a `next` pointer.

The usual trick is to keep a pointer to the **tail** instead of the head. Because `tail->next` is the head, both ends are reachable in O(1): inserting at the beginning or the end only needs the tail, and only the tail pointer changes when inserting at the end. Traversal must stop when we come back to the starting node (use a `do ... while` loop), otherwise it loops forever. Use it for round-robin problems where work cycles repeatedly over the same set of items.

## Operations

1. **Step 1:** Start with `tail = NULL` (empty list). The head is always `tail->next`.
2. **Step 2:** `insertBegin(v)`:
    - **(a)** Create a node `n` with `n->data = v`.
    - **(b)** If the list is empty, set `tail = n` and `n->next = n`.
    - **(c)** Otherwise set `n->next = tail->next` and `tail->next = n`. The tail does not change.
3. **Step 3:** `insertEnd(v)`:
    - **(a)** Do `insertBegin(v)` exactly as above.
    - **(b)** Move the tail one step forward: `tail = tail->next`, so the new node is the tail.
4. **Step 4:** `deleteValue(v)`:
    - **(a)** If `tail == NULL`, report underflow and stop.
    - **(b)** Set `prev = tail` and `cur = tail->next` (the head). Walk the ring at most one full lap.
    - **(c)** When `cur->data == v`: if `cur == prev` it is the only node, so set `tail = NULL`; otherwise set `prev->next = cur->next`, and if `cur == tail` set `tail = prev`.
    - **(d)** Free `cur`. If the lap ends without a match, report "not found".
5. **Step 5:** `search(v)`: start at `tail->next`, compare each node, and stop with its position or when the walk returns to the head.
6. **Step 6:** `display()`: start at `tail->next`, print each node with a `do ... while (cur != tail->next)` loop, so the loop runs at least once and stops after one lap.
7. **Step 7:** Stop.

## Complexity

- Insert at beginning: O(1)
- Insert at end: O(1)
- Delete by value: O(n)
- Search: O(n)
- Traverse: O(n)
- Space: O(n)

## Applications

- Round-robin CPU scheduling and time-sharing.
- Multiplayer games where turns rotate among players.
- Circular buffers and music or image playlists that repeat.
- The Josephus problem.

## Viva

### How does a circular linked list differ from a singly linked list?

The last node points to the first node instead of `NULL`. No pointer in the list is ever `NULL` (except an empty list's `tail`), and any node can reach all others.

### Why store a tail pointer instead of a head pointer?

With `tail`, the head is `tail->next`, so both insertion at the beginning and at the end are O(1). With only a head pointer, insertion at the end needs an O(n) walk around the ring to find the last node.

### Why must traversal use `do ... while` and not `while (cur != head)`?

If `cur` starts at the head, a plain `while (cur != head)` would exit immediately without visiting anything. `do ... while` visits the first node, then stops when we return to it.

### What special cases arise in deletion?

Deleting the only node (the list becomes empty, `tail = NULL`), and deleting the tail node (the tail must move back to the previous node). Deleting the head just needs `tail->next` updated.

### What happens if you traverse with `while (cur != NULL)`?

It never terminates, because no node in a circular list has a `NULL` next pointer.

### How can you detect that a given list is circular?

Walk with a pointer; if it reaches `NULL` the list is not circular, and if it returns to the starting node it is. Floyd's slow/fast pointer method also detects cycles in O(n) time and O(1) space.

### How do you find the length of the list?

Count nodes while walking one full lap from `tail->next` until you return to it. It takes O(n) unless you maintain a size counter.

### Can a circular list be doubly linked?

Yes. Then `head->prev` is the tail and `tail->next` is the head, which makes deleting a known node and reverse traversal O(1) at the cost of one extra pointer per node.
