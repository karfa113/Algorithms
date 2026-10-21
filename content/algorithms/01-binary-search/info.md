---
title: Binary Search (Recursive)
short: Binary Search
tags: Divide & Conquer, Search
visualizer: true
---

## Concept

Binary Search is an efficient searching algorithm used to locate a target value inside a **sorted** array. Instead of scanning every element (as in linear search), it repeatedly halves the search space. We compare the target with the middle element: if equal, we are done; if smaller, we recurse on the left half; if larger, we recurse on the right half. Because the array size is halved at each step, only `O(log n)` comparisons are needed.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the sorted array `arr[]` of size `n` and the search key `key`.
3. **Step 3:** Call the recursive function `binarySearch(arr, low, high, key)` with `low = 0` and `high = n - 1`.
4. **Step 4:** [Base case] If `low > high`, the key is not present in the array. Return `-1`.
5. **Step 5:** Compute the middle index as `mid = low + (high - low) / 2` (this form avoids integer overflow when `low + high` is large).
6. **Step 6:** [Match] If `arr[mid] == key`, return `mid` — the element has been found at index `mid`.
7. **Step 7:** [Search left] If `key < arr[mid]`, recursively call `binarySearch(arr, low, mid - 1, key)` on the left half.
8. **Step 8:** [Search right] Otherwise (`key > arr[mid]`), recursively call `binarySearch(arr, mid + 1, high, key)` on the right half.
9. **Step 9:** Display the returned index, or print *“Element not found”* if the function returns `-1`.
10. **Step 10:** Stop.

## Complexity

- Best: O(1)
- Average: O(log n)
- Worst: O(log n)
- Space: O(log n)

## Viva

### What is the prerequisite for applying binary search?

The input array must be sorted (ascending or descending). Without sorting, the divide-and-conquer logic does not work.

### What is the time complexity of binary search?

Best case is O(1) when the middle element is the key; average and worst cases are O(log n) since the search space halves each step.

### Why use `low + (high - low)/2` instead of `(low + high)/2`?

To avoid integer overflow when `low` and `high` are very large. The expression `(low+high)` may exceed INT_MAX.

### What is the space complexity of recursive binary search?

O(log n) due to the recursion call stack. The iterative version uses O(1) space.

### Can binary search be applied to linked lists?

Not efficiently. Linked lists do not support O(1) random access, so finding the middle element costs O(n), defeating the purpose.

### Is binary search a divide-and-conquer algorithm?

Yes. It divides the problem into smaller subproblems (half the array) and conquers each recursively. There is no combine step.

### What is the recurrence relation?

`T(n) = T(n/2) + O(1)`, which solves to O(log n) by the Master Theorem.
