---
title: Doubly Linked List
short: Doubly Linked List
tags: Linked List, Pointers, Bidirectional
---

## Concept

A **doubly linked list** stores in every node a `data` value plus two pointers: `next` to the following node and `prev` to the preceding one. The list keeps both a `head` and a `tail` pointer, so it can be traversed **forward from head** or **backward from tail**, and insertion at either end is O(1).

Because each node knows its predecessor, a node can be deleted given only a pointer to it, with no separate `prev` walk as in a singly linked list. The cost is one extra pointer per node and more links to update on every insertion and deletion. The key discipline is to update **both** directions and the end pointers: forgetting `head`, `tail` or one `prev`/`next` link corrupts the list.

## Operations

1. **Step 1:** Start with `head = tail = NULL` and `count = 0`.
2. **Step 2:** `insertBegin(v)`: create node `n`, set `n->next = head`. If `head` exists set `head->prev = n`, otherwise `tail = n`. Then `head = n`.
3. **Step 3:** `insertEnd(v)`: create node `n`, set `n->prev = tail`. If `tail` exists set `tail->next = n`, otherwise `head = n`. Then `tail = n`.
4. **Step 4:** `insertPos(v, pos)`:
    - **(a)** If `pos < 1` or `pos > count + 1`, report an invalid position.
    - **(b)** If `pos == 1` insert at the beginning; if `pos == count + 1` insert at the end.
    - **(c)** Otherwise move `p` to the node at `pos - 1` and set `n->next = p->next`, `n->prev = p`, `p->next->prev = n`, `p->next = n`.
5. **Step 5:** `deleteValue(v)`: walk from `head` to the first node `cur` with `data == v`; report "not found" if none. Otherwise unlink it (Step 7) and free it.
6. **Step 6:** `deletePos(pos)`: report underflow if empty or an invalid position if out of range; otherwise walk to the node at `pos` and unlink it.
7. **Step 7:** `unlink(cur)`:
    - **(a)** If `cur->prev` exists set `cur->prev->next = cur->next`, else `head = cur->next`.
    - **(b)** If `cur->next` exists set `cur->next->prev = cur->prev`, else `tail = cur->prev`.
    - **(c)** Free `cur` and decrement `count`.
8. **Step 8:** `search(v)`: traverse from `head` counting positions and report the first match or "not found".
9. **Step 9:** `displayForward()`: print `p->data` from `head` following `next`; `displayBackward()`: print from `tail` following `prev`.
10. **Step 10:** Stop.

## Complexity

- Insert at beginning: O(1)
- Insert at end: O(1)
- Insert at position: O(n)
- Delete by value: O(n)
- Delete by position: O(n)
- Search: O(n)
- Traversal (either direction): O(n)
- Space: O(n)

## Applications

- Browser history and forward/back navigation.
- Undo / redo in editors.
- Music player playlists and image carousels.
- LRU caches (with a hash map) and deques.

## Viva

### How does a doubly linked list differ from a singly linked list?

Each node has an extra `prev` pointer, so traversal works in both directions and a node can be deleted knowing only its own address. It uses more memory and every update touches more pointers.

### Why is deleting a known node O(1) here but not in a singly linked list?

The node itself holds its predecessor, so `cur->prev->next` can be updated directly. A singly linked list must walk from `head` to find the predecessor.

### Which pointers change when inserting in the middle?

Four: the new node's `prev` and `next`, the predecessor's `next`, and the successor's `prev`. The order matters; set the new node's links first so nothing is lost.

### What edge cases must deletion handle?

Deleting the head (update `head`), the tail (update `tail`) and the only node (both become `NULL`). The `if/else` on `prev` and `next` in the unlink step covers all of them.

### Why keep a tail pointer?

It makes insertion at the end O(1) and enables backward traversal from the last node.

### What is the memory overhead compared with a singly linked list?

One extra pointer per node (typically 8 bytes on 64-bit systems), so a node holding an `int` roughly doubles in size.

### What happens if you forget to update `prev` after an insertion?

Forward traversal still works but backward traversal skips or loops incorrectly, and later deletions through `prev` can corrupt the list or crash.
