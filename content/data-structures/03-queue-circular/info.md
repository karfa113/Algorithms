---
title: Circular Queue using Array
short: Circular Queue
tags: Queue, FIFO, Array
---

## Concept

A **queue** is a linear structure that follows **FIFO** (First In, First Out): elements are inserted at the **rear** and removed from the **front**. In a simple array queue, the front index only moves forward, so slots freed by dequeues are never reused and the queue reports "full" even when most of the array is empty.

A **circular queue** fixes this by treating the array as a ring: after the last index the position wraps around to index 0 using the modulo operator. This program stores `front` (index of the first element) and `count` (number of stored elements). The rear slot is computed as `(front + count) % MAX`. Using `count` makes full/empty detection trivial: empty is `count == 0` and full is `count == MAX`. (Without a counter, `front == rear` is ambiguous, so one slot is usually sacrificed.) Use it for fixed-size buffers with continuous producers and consumers.

## Operations

1. **Step 1:** Start with `front = 0` and `count = 0`.
2. **Step 2:** `isEmpty()` returns `count == 0`; `isFull()` returns `count == MAX`.
3. **Step 3:** [Enqueue `val`]
    - **(a)** If `isFull()`, print **overflow** and stop.
    - **(b)** Compute `rear = (front + count) % MAX`.
    - **(c)** Set `queue[rear] = val`.
    - **(d)** Increment `count`.
4. **Step 4:** [Dequeue]
    - **(a)** If `isEmpty()`, print **underflow** and stop.
    - **(b)** Save `val = queue[front]`.
    - **(c)** Set `front = (front + 1) % MAX`.
    - **(d)** Decrement `count` and return `val`.
5. **Step 5:** [Front] If `isEmpty()` report empty, otherwise return `queue[front]`.
6. **Step 6:** [Display] For `i` from `0` to `count - 1` print `queue[(front + i) % MAX]`.
7. **Step 7:** Repeat the menu until the user chooses `0`, then stop.

## Complexity

- Enqueue: O(1)
- Dequeue: O(1)
- Front: O(1)
- isEmpty / isFull: O(1)
- Display: O(n)
- Space: O(n)

## Applications

- CPU scheduling (round robin) and disk scheduling
- Buffers such as keyboard, printer spooler and streaming data
- Producer-consumer problems
- Traffic light and other cyclic systems

## Viva

### What is the problem with a linear array queue?

`front` only moves forward, so freed slots at the beginning are never reused. The queue appears full when `rear == MAX - 1` even though there is free space at the front.

### How does a circular queue solve it?

Indices wrap around using `% MAX`, so after the last slot the next insertion goes to slot 0 if it is free. Every slot can be reused.

### Why is `front == rear` ambiguous without a counter?

It holds both when the queue is empty and when it is completely full (rear has wrapped to meet front). Solutions are to keep a `count`, keep a flag, or leave one slot unused so that full is `(rear + 1) % MAX == front`.

### How do you compute the rear index here?

`rear = (front + count) % MAX`. It is the first free slot after the last stored element.

### What is the capacity of a circular queue that wastes one slot?

`MAX - 1` elements. With the `count` approach all `MAX` slots can be used.

### What are overflow and underflow in a queue?

Overflow is enqueue on a full queue (`count == MAX`); underflow is dequeue or front on an empty queue (`count == 0`).

### Difference between stack and queue?

A stack is LIFO with a single access point (top); a queue is FIFO with two (front and rear).

### Does dequeue erase the element from memory?

No. It only advances `front` and decrements `count`; the old value stays in the array until a later enqueue overwrites it.
