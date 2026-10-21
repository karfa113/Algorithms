---
title: Priority Queue using Binary Min-Heap
short: Priority Queue (Heap)
tags: Heap, Priority Queue, Complete Binary Tree
---

## Concept

A **priority queue** is an abstract data type where every element has a priority and the element with the highest priority is always served first. The standard implementation is a **binary heap**: a *complete binary tree* stored in a plain array. In a **min-heap** every parent is smaller than or equal to its children, so the minimum always sits at index `0`.

For a node at index `i`, its parent is at `(i - 1) / 2`, its left child at `2i + 1` and its right child at `2i + 2` — no pointers needed. Insertion places the new value at the end and *sifts it up*; extraction removes the root, moves the last element there and *sifts it down*. Both restore the heap property in `O(log n)`.

## Operations

1. **Step 1:** Start with an empty array `heap[]` and `size = 0`.
2. **Step 2:** `insert(v)`:
    - **(a)** If the heap is full, report overflow and stop.
    - **(b)** Place `v` at `heap[size]` and increase `size`.
    - **(c)** `heapifyUp`: while the node has a parent and `heap[parent] > heap[i]`, swap them and move `i` to the parent.
3. **Step 3:** `extractMin()`:
    - **(a)** If `size == 0`, report that the heap is empty and stop.
    - **(b)** Save `min = heap[0]`.
    - **(c)** Copy the last element to the root: `heap[0] = heap[size - 1]` and decrease `size`.
    - **(d)** `heapifyDown`: find the smallest of the node and its two children; if a child is smaller, swap and continue from that child, otherwise stop.
    - **(e)** Return `min`.
4. **Step 4:** `peek()`: return `heap[0]` without removing it.
5. **Step 5:** `display()`: print `heap[0..size-1]` (level-order of the tree).

## Complexity

- Insert: O(log n)
- Extract-min: O(log n)
- Peek: O(1)
- Build heap from n items: O(n)
- Space: O(n)

## Applications

- Dijkstra's and Prim's algorithms (pick the nearest vertex).
- Heap sort, merging k sorted lists, finding the k largest elements.
- CPU task scheduling and event-driven simulation.

## Viva

### What is a heap and what property does it maintain?

A complete binary tree stored in an array where each parent is `<=` its children (min-heap) or `>=` its children (max-heap). Only the parent-child order is guaranteed, not left-vs-right order.

### Why is a heap stored in an array?

It is a *complete* tree, so there are no gaps: parent and child positions follow from index arithmetic (`2i+1`, `2i+2`, `(i-1)/2`), saving the memory and time of pointers.

### What is the time complexity of insert and extract-min, and why?

Both O(log n): the tree height is `floor(log2 n)` and each operation moves one element along a single root-to-leaf path.

### Is a heap the same as a binary search tree?

No. A BST orders left < node < right, so it supports sorted traversal and O(log n) search. A heap only orders parents against children; searching for an arbitrary key is O(n), but finding the min/max is O(1).

### How do you build a heap from an unsorted array in O(n)?

Call `heapifyDown` on every internal node from index `n/2 - 1` down to `0` (Floyd's method). Most nodes are near the leaves and move very little, so the total work sums to O(n).

### How would you turn this min-heap into a max-heap?

Reverse the comparisons in `heapifyUp` and `heapifyDown` (`>` instead of `<`), or insert negated values.

### Where is a priority queue used?

Dijkstra, Prim, Huffman coding, heap sort, schedulers, and "top-k" problems.
