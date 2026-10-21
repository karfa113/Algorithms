---
title: Stack using Linked List
short: Stack (Linked List)
tags: Stack, Linked List, LIFO
---

## Concept

A **stack** is a Last-In-First-Out (LIFO) collection: the element pushed most recently is the first one popped. In the linked-list implementation every element lives in its own heap-allocated node holding `data` and a `next` pointer, and the **top of the stack is the head of the list**. Pushing and popping at the head touch only one pointer, so both are O(1), and no element ever has to be shifted.

Unlike an array-based stack, a linked stack has **no fixed capacity** and never reports "overflow" until memory runs out; the price is one extra pointer per element and poorer cache locality. Use it when the maximum size is unknown in advance. Underflow (popping an empty stack) must be checked explicitly: it happens when `top == NULL`.

## Operations

1. **Step 1:** Start with `top = NULL` (empty stack).
2. **Step 2:** `push(v)`:
    - **(a)** Create a new node `n` and set `n->data = v`.
    - **(b)** Set `n->next = top` so it points at the current top.
    - **(c)** Set `top = n`.
3. **Step 3:** `pop()`:
    - **(a)** If `top == NULL`, report **underflow** and stop.
    - **(b)** Save `t = top` and read `value = t->data`.
    - **(c)** Move `top = top->next`, then free `t`.
    - **(d)** Return `value`.
4. **Step 4:** `peek()`: if `top == NULL` report empty, otherwise return `top->data` without removing it.
5. **Step 5:** `isEmpty()`: return true when `top == NULL`.
6. **Step 6:** `display()`: starting at `top`, print `cur->data` and move `cur = cur->next` until `cur == NULL`. This prints top to bottom.
7. **Step 7:** Stop.

## Complexity

- Push: O(1)
- Pop: O(1)
- Peek: O(1)
- isEmpty: O(1)
- Display: O(n)
- Space: O(n)

## Applications

- Function call stack and recursion.
- Undo / redo and browser back history.
- Expression evaluation and infix-to-postfix conversion.
- Depth-first search and backtracking.

## Viva

### Why is the top of a linked stack the head and not the tail?

Insertion and deletion at the head are O(1) in a singly linked list. Removing from the tail would need an O(n) walk to find the second-last node.

### What is stack overflow and underflow in this implementation?

Underflow is popping or peeking when `top == NULL`. Overflow does not occur from a size limit; it only happens if `malloc`/`new` fails because memory is exhausted (or the process call stack overflows in recursion).

### Compare array stack with linked-list stack.

Array stack: fixed capacity (or amortised resizing), better cache locality, no per-element pointer. Linked stack: grows one node at a time, true O(1) worst-case push, but extra memory for pointers and an allocation per push.

### What must be done when popping to avoid a memory leak (in C/C++)?

Save the old top in a temporary pointer, move `top` forward, then `free`/`delete` the saved node. Losing the pointer before freeing leaks the node.

### What does a stack do to the order of elements pushed 1, 2, 3?

They come out as 3, 2, 1. A stack reverses order, which is why it is used for reversing strings and matching nested structures.

### What is the difference between `pop` and `peek`?

`pop` removes the top element and returns it; `peek` only returns it and leaves the stack unchanged.

### Can a stack be implemented with a queue?

Yes, with two queues (or one queue by rotating elements after each push). Push or pop then becomes O(n).
