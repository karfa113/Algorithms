---
title: Queue using Linked List
short: Queue (Linked List)
tags: Queue, Linked List, FIFO
---

## Concept

A **queue** is a First-In-First-Out (FIFO) collection: elements are added at the **rear** and removed from the **front**, like people in a line. In the linked-list implementation each element is a heap-allocated node with `data` and `next`. We keep two pointers: `front` (head of the list, where we dequeue) and `rear` (tail of the list, where we enqueue).

The two pointers are what make both operations O(1): enqueue appends after `rear` without walking the list, and dequeue removes the head. A linked queue has no fixed capacity and wastes no space the way a simple array queue does after repeated dequeues. The delicate part is the **edge cases**: the first enqueue must set both `front` and `rear`, and when the last element is dequeued `rear` must also be reset to `NULL`.

## Operations

1. **Step 1:** Start with `front = NULL` and `rear = NULL` (empty queue).
2. **Step 2:** `enqueue(v)`:
    - **(a)** Create a node `n` with `n->data = v` and `n->next = NULL`.
    - **(b)** If `rear == NULL` (queue empty), set `front = rear = n`.
    - **(c)** Otherwise set `rear->next = n`, then `rear = n`.
3. **Step 3:** `dequeue()`:
    - **(a)** If `front == NULL`, report **underflow** and stop.
    - **(b)** Save `t = front` and `value = t->data`.
    - **(c)** Set `front = front->next`.
    - **(d)** If `front == NULL` now, set `rear = NULL` as well.
    - **(e)** Free `t` and return `value`.
4. **Step 4:** `front()`: if `front == NULL` report empty, otherwise return `front->data`.
5. **Step 5:** `display()`: walk from `front` following `next` until `NULL`, printing each `data` (front to rear).
6. **Step 6:** Stop.

## Complexity

- Enqueue: O(1)
- Dequeue: O(1)
- Front: O(1)
- Display: O(n)
- Space: O(n)

## Applications

- CPU and disk scheduling, print spooling.
- Breadth-first search of graphs and level-order tree traversal.
- Buffers for streaming data and keyboard input.
- Handling requests in a web server or call centre.

## Viva

### Why do we need both front and rear pointers?

With only `front`, each enqueue would walk the whole list to reach the last node (O(n)). Keeping `rear` makes enqueue O(1), and `front` makes dequeue O(1).

### What happens to `rear` when the last element is dequeued?

`front` becomes `NULL` and `rear` still points to the freed node (a dangling pointer). It must be set to `NULL` too; otherwise the next enqueue writes through a dangling pointer.

### How do you detect an empty queue?

`front == NULL`. (Checking `rear == NULL` is equivalent if both pointers are maintained correctly.)

### Why does a linked queue avoid the problem of a simple array queue?

In a linear array queue, dequeued slots at the front are never reused, so it can report "full" while having free space. A linked queue allocates per element and frees on dequeue, so there is no wasted slot.

### Can the queue be made with only one pointer?

Yes, a circular linked list with a single `rear` pointer works, since `rear->next` is the front.

### What is the difference between a stack and a queue?

A stack is LIFO (insert and remove at the same end); a queue is FIFO (insert at the rear, remove from the front).

### Can we implement a queue with two stacks?

Yes. Push into an input stack; when dequeuing, if the output stack is empty, pour all elements from the input stack into it, then pop. Amortised O(1) per operation.
