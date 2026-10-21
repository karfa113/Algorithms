---
title: Heap Sort
short: Heap Sort
tags: Sorting, Heap
visualizer: true
---

## Concept

Heap Sort uses the **binary heap** data structure (typically a max-heap) to sort an array in place. First the array is reorganized into a max-heap so that the largest element sits at index 0. Then we repeatedly swap the root with the last element of the heap and shrink the heap by one, calling `heapify` on the root to restore the heap property. After `n` such steps the array is sorted in ascending order. Heap sort is **not stable** but has guaranteed `O(n log n)` behavior.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the array `arr[]` of size `n`.
3. **Step 3:** [Build max-heap] For `i` from `n/2 - 1` down to `0`, call `heapify(arr, n, i)`. After this loop the largest element occupies `arr[0]`.
4. **Step 4:** [Sort phase] For `i` from `n - 1` down to `1`:
    - **(a)** Swap `arr[0]` (current maximum) with `arr[i]` (last unsorted position).
    - **(b)** Reduce the effective heap size to `i` and call `heapify(arr, i, 0)` to restore the heap property in the remaining unsorted portion.
5. **Step 5:** `heapify(arr, n, i)` procedure:
    - **(a)** Set `largest = i`, `l = 2i + 1` (left child), `r = 2i + 2` (right child).
    - **(b)** If `l < n` and `arr[l] > arr[largest]`, set `largest = l`.
    - **(c)** If `r < n` and `arr[r] > arr[largest]`, set `largest = r`.
    - **(d)** If `largest != i`, swap `arr[i]` with `arr[largest]` and recursively call `heapify(arr, n, largest)`.
6. **Step 6:** When the sort phase finishes, `arr[]` is in ascending order.
7. **Step 7:** Print the sorted array.
8. **Step 8:** Stop.

## Complexity

- Best: O(n log n)
- Average: O(n log n)
- Worst: O(n log n)
- Space: O(1)

## Viva

### What is a heap?

A complete binary tree where every parent satisfies the heap property: in a max-heap parent ≥ children, in a min-heap parent ≤ children.

### Is heap sort stable?

No. Swapping the root with the last element can break the relative order of equal keys.

### Time complexity of building a heap?

O(n), not O(n log n). The aggregate work using siftDown from the middle to the root is bounded by Σ (n/2^(h+1)) · h ≈ n.

### Space complexity?

O(1) — sorting is performed in place; only a constant amount of extra memory is needed.

### Why is the heap built bottom-up?

Leaves already satisfy the heap property, so building from `n/2 - 1` down to 0 lets each `heapify` use the already-heapified children.

### Why is heap sort O(n log n) in the worst case?

n extractions, each costing log n for re-heapification, giving n log n.

### How is a heap represented in an array?

Index i has children at 2i + 1 and 2i + 2, and parent at (i - 1) / 2.
