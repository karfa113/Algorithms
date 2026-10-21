---
title: Stack using Array
short: Stack (Array)
tags: Stack, LIFO, Array
---

## Concept

A **stack** is a linear data structure that follows the **LIFO** (Last In, First Out) rule: the element pushed most recently is the first one removed. All insertions and deletions happen at one end called the **top**.

In the array implementation the elements live in a fixed-size array `stack[MAX]` and a single integer `top` stores the index of the topmost element. An empty stack has `top = -1`; a full stack has `top = MAX - 1`. Pushing increments `top` and stores the value, popping reads the value and decrements `top`. No element is ever shifted, so every operation is O(1). Trying to push onto a full stack is **overflow**, and popping from an empty one is **underflow**; both must be checked before touching the array.

## Operations

1. **Step 1:** Start with `top = -1` (empty stack).
2. **Step 2:** `isEmpty()` returns `top == -1`; `isFull()` returns `top == MAX - 1`.
3. **Step 3:** [Push `val`]
    - **(a)** If `isFull()`, print **overflow** and stop.
    - **(b)** Set `top = top + 1`.
    - **(c)** Set `stack[top] = val`.
4. **Step 4:** [Pop]
    - **(a)** If `isEmpty()`, print **underflow** and stop.
    - **(b)** Save `val = stack[top]`.
    - **(c)** Set `top = top - 1` and return `val`.
5. **Step 5:** [Peek] If `isEmpty()` report empty, otherwise return `stack[top]` without changing `top`.
6. **Step 6:** [Display] For `i` from `top` down to `0` print `stack[i]` (top first).
7. **Step 7:** Repeat the menu until the user chooses `0`, then stop.

## Complexity

- Push: O(1)
- Pop: O(1)
- Peek: O(1)
- isEmpty / isFull: O(1)
- Display: O(n)
- Space: O(n)

## Applications

- Function call stack and recursion
- Undo / redo in editors
- Expression evaluation and infix to postfix conversion
- Balanced parentheses checking
- Depth-first search and backtracking

## Viva

### What does LIFO mean?

Last In, First Out: the most recently inserted element is removed first, like a stack of plates.

### What are stack overflow and underflow?

**Overflow** is pushing onto a full stack (`top == MAX - 1`). **Underflow** is popping or peeking from an empty stack (`top == -1`). Both are checked before the operation.

### Why is `top` initialised to -1 and not 0?

Index 0 is a valid slot. With `top = -1` the stack is empty and the first push (`++top`) stores at index 0. If `top` started at 0 we could not tell an empty stack from one holding a single element.

### What is the difference between pop and peek?

`pop` removes the top element and decrements `top`; `peek` only reads it and leaves the stack unchanged.

### Does pop actually erase the value from the array?

No. It only decrements `top`; the old value remains in memory until overwritten by a later push. It is logically gone because it is above `top`.

### What is the disadvantage of an array-based stack?

The size is fixed, so it can overflow even when the system has plenty of memory. A linked-list stack grows dynamically, at the cost of a pointer per node.

### How can a stack be used to reverse a string?

Push every character, then pop them all. Because of LIFO they come out in reverse order.

### Which stack is used when a function calls another function?

The **call stack**. Each call pushes a frame holding parameters, return address and locals, and returning pops it. Very deep recursion causes a real stack overflow.
