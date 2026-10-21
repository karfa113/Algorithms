---
title: Array Operations
short: Array Operations
tags: Array, Linear, Basics
---

## Concept

An **array** is a collection of elements of the same type stored in **contiguous memory locations**. The address of element `i` is `base + i * size`, so any element can be reached in constant time using its index. This is called *random access* and is the main strength of arrays. The price is a **fixed size**: the capacity must be decided in advance, and inserting or deleting in the middle requires shifting the elements that follow.

This program keeps an array of capacity 10 and the count `n` of elements actually stored. Positions given by the user are **1-based** (position 1 is index 0). Use an array when the number of elements is roughly known, you need fast access by index, and insertions or deletions in the middle are rare.

## Operations

1. **Step 1:** Start with an empty array `arr[MAX]` and `n = 0`.
2. **Step 2:** [Traverse] If `n == 0` print "empty". Otherwise for `i` from `0` to `n - 1` print `arr[i]`.
3. **Step 3:** [Insert `val` at position `pos`]
    - **(a)** If `n == MAX`, report **overflow** and stop.
    - **(b)** If `pos < 1` or `pos > n + 1`, report an invalid position and stop.
    - **(c)** For `i` from `n` down to `pos`, set `arr[i] = arr[i - 1]` (shift right, last element first).
    - **(d)** Set `arr[pos - 1] = val` and increment `n`.
4. **Step 4:** [Delete at position `pos`]
    - **(a)** If `n == 0`, report **underflow** and stop.
    - **(b)** If `pos < 1` or `pos > n`, report an invalid position and stop.
    - **(c)** Save `val = arr[pos - 1]`.
    - **(d)** For `i` from `pos - 1` to `n - 2`, set `arr[i] = arr[i + 1]` (shift left).
    - **(e)** Decrement `n`.
5. **Step 5:** [Linear search for `key`] For `i` from `0` to `n - 1`, if `arr[i] == key` report position `i + 1` and stop. If the loop ends, report "not found".
6. **Step 6:** [Update] Validate `pos`, then set `arr[pos - 1] = newVal`.
7. **Step 7:** Repeat the menu until the user chooses `0`, then stop.

## Complexity

- Access / Update by index: O(1)
- Traverse: O(n)
- Insert at position: O(n)
- Delete at position: O(n)
- Linear search: O(n)
- Space: O(n)

## Applications

- Storing fixed collections such as marks, sensor readings or pixel rows
- Building blocks for stacks, queues, heaps and hash tables
- Lookup tables where the index itself is the key
- Matrices and other multi-dimensional data

## Viva

### Why is access in an array O(1)?

Elements are contiguous and of equal size, so the address of `arr[i]` is computed directly as `base + i * sizeof(element)` with no traversal.

### Why are insertion and deletion O(n)?

To keep the elements contiguous, everything after the position must be shifted by one place. In the worst case (position at the front) all `n` elements move.

### Which end is cheapest for insertion and deletion?

The **end**. Inserting at index `n` or deleting at index `n - 1` needs no shifting, so it is O(1). The front is the most expensive.

### In which direction do you shift when inserting, and why?

Shift **right starting from the last element**. If you started from the front, `arr[pos]` would overwrite `arr[pos + 1]` before it was copied and data would be lost. For deletion you shift left starting from the front.

### What is the difference between array size and number of elements?

Size (capacity) is the memory reserved, here `MAX`. The count `n` is how many slots are in use. Overflow happens when `n == MAX`, not when an index is out of range.

### What happens if you access `arr[10]` in an array of size 10 in C?

It is out of bounds and **undefined behaviour**: C does no bounds checking, so you may read garbage or corrupt memory. Java throws `ArrayIndexOutOfBoundsException`.

### Can linear search be improved on an array?

On unsorted data O(n) is needed in the worst case. If the array is **sorted**, binary search gives O(log n), but insertion then must preserve the order.

### Array vs linked list?

Arrays give O(1) random access and good cache locality but have a fixed size and costly middle insertions. Linked lists grow dynamically and insert in O(1) once the node is known, but access is O(n) and each node carries pointer overhead.
