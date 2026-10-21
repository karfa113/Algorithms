---
title: Max-Min using Divide & Conquer
short: Max-Min (D&C)
tags: Divide & Conquer
visualizer: true
---

## Concept

Given an array of `n` elements, we need to find the maximum and minimum simultaneously. A naive approach uses 2(n - 1) comparisons. With **divide and conquer**, we split the array into two halves, recursively find the (max, min) of each half, and then combine using just 2 comparisons. The total number of comparisons drops to `⌈3n/2⌉ - 2`, which is optimal.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the array `arr[]` of size `n`.
3. **Step 3:** Call `maxMin(arr, 0, n - 1)`, which will return a pair `(max, min)`.
4. **Step 4:** In `maxMin(arr, low, high)`:
    - **(a)** [Single element] If `low == high`, return `(arr[low], arr[low])`.
    - **(b)** [Two elements] If `high == low + 1`, compare `arr[low]` and `arr[high]`; return the larger as `max` and the smaller as `min`.
    - **(c)** [General case] Compute `mid = (low + high) / 2`.
    - **(d)** Recursively find `(max1, min1) = maxMin(arr, low, mid)`.
    - **(e)** Recursively find `(max2, min2) = maxMin(arr, mid + 1, high)`.
    - **(f)** Combine the partial results: `max = max(max1, max2)`, `min = min(min1, min2)`.
5. **Step 5:** Return the pair `(max, min)` to the caller.
6. **Step 6:** Print the maximum and minimum values returned.
7. **Step 7:** Stop.

## Complexity

- Best: O(n)
- Average: O(n)
- Worst: O(n)
- Space: O(log n)

## Viva

### What is the number of comparisons in this approach?

Roughly ⌈3n/2⌉ - 2, which is fewer than the naive 2n - 2.

### What is the recurrence relation?

T(n) = 2T(n/2) + 2 for n > 2. By the Master Theorem this resolves to O(n).

### Can the same be achieved iteratively?

Yes — pair-compare adjacent elements first, then compare the smaller with current min and the larger with current max. Same comparison count.

### Why is divide & conquer preferred?

It minimizes the comparison count and demonstrates the technique, although iterative pair-comparison achieves the same in O(1) extra space.

### What is the space complexity?

O(log n) for the recursion stack.
