---
title: Matrix Chain Multiplication
short: Matrix Chain Mult.
tags: DP
visualizer: true
---

## Concept

Given a chain of matrices `A1, A2, …, An` with dimensions `p0×p1, p1×p2, …, p(n-1)×pn`, we cannot change the order of the matrices, but we *can* change how they are parenthesized. The cost of multiplying `p×q` by `q×r` is `p·q·r` scalar multiplications. The aim is to find a parenthesization that minimizes the total cost. This is a classic dynamic-programming problem solved in `O(n³)` time.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of matrices `n`. Read the dimension array `p[0..n]` where matrix `A_i` has dimensions `p[i-1] × p[i]`.
3. **Step 3:** Create a 2-D table `m[1..n][1..n]`. Set `m[i][i] = 0` for every `i` (a single matrix needs zero multiplications).
4. **Step 4:** For chain length `L` from `2` to `n`, repeat:
    - **(a)** For every starting index `i` from `1` to `n - L + 1`:
        - **(i)** Compute `j = i + L - 1` and set `m[i][j] = ∞`.
        - **(ii)** For every split point `k` from `i` to `j - 1`:
            - compute `q = m[i][k] + m[k+1][j] + p[i-1] · p[k] · p[j]`.
            - if `q < m[i][j]`, update `m[i][j] = q`.
5. **Step 5:** After all loops, `m[1][n]` holds the minimum number of scalar multiplications required to compute `A_1 × A_2 × … × A_n`.
6. **Step 6:** Print `m[1][n]` as the answer.
7. **Step 7:** Stop.

## Complexity

- Best: O(n³)
- Average: O(n³)
- Worst: O(n³)
- Space: O(n²)

## Viva

### What does the problem actually decide?

Only the parenthesization (associative grouping). The order of matrices is fixed.

### Time and space complexity?

O(n³) time and O(n²) space.

### Why is it a DP problem?

It has optimal substructure (optimal parenthesization breaks into two optimal sub-products at some split k) and overlapping sub-problems (the same sub-chains are evaluated repeatedly in a naive recursive approach).

### What is the recurrence?

m[i][j] = min over k in [i, j-1] of (m[i][k] + m[k+1][j] + p[i-1]·p[k]·p[j]); base case m[i][i] = 0.

### How to recover the parenthesization?

Store the optimal split `s[i][j] = k` while filling the DP table, then recursively print.
