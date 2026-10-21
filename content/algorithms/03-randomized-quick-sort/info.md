---
title: Randomized Quick Sort
short: Randomized Quick Sort
tags: Divide & Conquer, Sorting, Randomized
visualizer: true
---

## Concept

Quick Sort is a divide-and-conquer algorithm that picks a **pivot**, partitions the array such that smaller elements lie left of the pivot and larger ones lie right, and then recursively sorts the two partitions. In **Randomized Quick Sort** the pivot is chosen uniformly at random rather than as a fixed position. Randomization avoids the worst-case `O(n²)` behavior on already-sorted or adversarial inputs and gives an **expected** running time of `O(n log n)`.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the array `arr[]` of size `n`.
3. **Step 3:** Call `quickSort(arr, 0, n - 1)`.
4. **Step 4:** In `quickSort(arr, low, high)`, if `low < high`:
    - **(a)** Pick a random index `r` in `[low, high]`; swap `arr[r]` with `arr[high]` to randomize the pivot.
    - **(b)** Call `partition(arr, low, high)`, which returns the final position `p` of the pivot.
    - **(c)** Recursively call `quickSort(arr, low, p - 1)` to sort the left part.
    - **(d)** Recursively call `quickSort(arr, p + 1, high)` to sort the right part.
5. **Step 5:** `partition(arr, low, high)` procedure:
    - **(a)** Set `pivot = arr[high]` and `i = low - 1`.
    - **(b)** For `j` from `low` to `high - 1`: if `arr[j] ≤ pivot`, increment `i` and swap `arr[i]` with `arr[j]`.
    - **(c)** Swap `arr[i + 1]` with `arr[high]` and return `i + 1`.
6. **Step 6:** When the top-level call returns, `arr[]` is fully sorted.
7. **Step 7:** Print the sorted array.
8. **Step 8:** Stop.

## Complexity

- Best: O(n log n)
- Average: O(n log n)
- Worst: O(n²)
- Space: O(log n)

## Viva

### Why randomize the pivot?

To avoid the worst-case O(n²) when input is already sorted or reverse-sorted. With random pivots, the *expected* complexity is O(n log n) regardless of input.

### Is quick sort stable?

No. The partition step swaps elements across positions and can reorder equal keys.

### Is it in-place?

Yes. Partitioning is done within the array using swaps. Space usage is only the recursion stack.

### What is the worst case input for non-randomized quick sort?

An already-sorted or reverse-sorted array when the first/last element is always the pivot.

### What is the recurrence?

Best/Avg: T(n) = 2T(n/2) + O(n) = O(n log n). Worst: T(n) = T(n-1) + O(n) = O(n²).

### How can worst case be avoided besides randomization?

Use median-of-three pivot selection, or switch to heap/merge sort once recursion depth exceeds 2 log n (Introsort).

### Difference between Lomuto and Hoare partition?

Lomuto is simpler and uses one scanning pointer with the pivot at the end. Hoare uses two pointers moving from both ends and is generally faster but more complex.
