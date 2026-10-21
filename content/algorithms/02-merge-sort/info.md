---
title: Merge Sort
short: Merge Sort
tags: Divide & Conquer, Sorting, Stable
visualizer: true
---

## Concept

Merge Sort is a classical divide-and-conquer sorting algorithm. The array is recursively divided into two halves until each subarray has one element (which is trivially sorted). Then the halves are **merged** back together in sorted order. The merge step is the heart of the algorithm: it walks two sorted subarrays with two pointers and writes the smaller element each time. Merge sort guarantees `O(n log n)` time in all cases and is **stable**.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the unsorted array `arr[]` of size `n`.
3. **Step 3:** Call `mergeSort(arr, low, high)` with `low = 0` and `high = n - 1`.
4. **Step 4:** [Base case] In `mergeSort`, if `low ≥ high`, return — a sub-array of 0 or 1 element is trivially sorted.
5. **Step 5:** Compute `mid = (low + high) / 2` to divide the current sub-array into two halves.
6. **Step 6:** Recursively call `mergeSort(arr, low, mid)` to sort the left half.
7. **Step 7:** Recursively call `mergeSort(arr, mid + 1, high)` to sort the right half.
8. **Step 8:** Call `merge(arr, low, mid, high)` to combine the two sorted halves:
    - **(a)** Copy `arr[low..mid]` into auxiliary array `L[]` and `arr[mid+1..high]` into `R[]`.
    - **(b)** Use three indices: `i = 0`, `j = 0`, `k = low`.
    - **(c)** While both halves have unread elements, compare `L[i]` and `R[j]`; place the smaller at `arr[k]` and advance the corresponding index.
    - **(d)** Copy any remaining elements of `L[]` or `R[]` into `arr[]`.
9. **Step 9:** When all recursive calls return, `arr[]` contains the fully sorted sequence.
10. **Step 10:** Print the sorted array.
11. **Step 11:** Stop.

## Complexity

- Best: O(n log n)
- Average: O(n log n)
- Worst: O(n log n)
- Space: O(n)

## Viva

### Is merge sort stable?

Yes. Equal elements retain their original relative order because the merge step uses `<=` when picking from the left half.

### What is the time complexity?

O(n log n) in best, average and worst cases. The recurrence is T(n) = 2T(n/2) + O(n).

### Why is merge sort preferred for linked lists?

It does not require random access; only sequential traversal. Splitting a linked list is O(n) and merging is in-place with pointer manipulation.

### What is the space complexity?

O(n) for the auxiliary array used in the merge step. Recursion stack adds O(log n).

### Is merge sort in-place?

No, the standard array implementation requires O(n) auxiliary space.

### When is merge sort better than quicksort?

When stability is required, for external sorting (data on disk), or when worst-case guarantees matter (quicksort is O(n²) worst case).

### What is the recurrence relation?

T(n) = 2T(n/2) + Θ(n). By the Master Theorem (case 2), T(n) = Θ(n log n).
