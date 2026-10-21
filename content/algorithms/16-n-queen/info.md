---
title: N-Queen Problem
short: N-Queen
tags: Backtracking
visualizer: true
---

## Concept

The N-Queen problem asks: place `n` queens on an `n × n` chessboard such that no two queens attack each other. A queen attacks along the same row, column and both diagonals. The standard solution uses **backtracking**: place queens column by column, check whether the current placement is safe, recurse to the next column, and backtrack if no safe row is found. The first valid placement is reported (or all placements can be enumerated).

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the value of `N` (size of the chessboard).
3. **Step 3:** Initialize `board[N][N]` with all zeros.
4. **Step 4:** Call `solve(col = 0)` to start placing queens column by column.
5. **Step 5:** In `solve(col)`:
    - **(a)** [Base case] If `col == N`, all queens have been placed successfully — return `true`.
    - **(b)** For each `row` from `0` to `N - 1`:
        - **(i)** If `isSafe(row, col)` returns `true`:
            - Place a queen: `board[row][col] = 1`.
            - Recursively call `solve(col + 1)`; if it returns `true`, propagate success.
            - Otherwise **backtrack**: reset `board[row][col] = 0` and try the next row.
    - **(c)** If no row works for the current column, return `false`.
6. **Step 6:** `isSafe(row, col)` procedure: confirm that no queen lies on the same `row`, on the upper-left diagonal, or on the lower-left diagonal of `(row, col)` within the already-filled columns `0..col-1`.
7. **Step 7:** If `solve(0)` returns `true`, print the board (`Q` for a queen, `.` for an empty cell). Otherwise print *“No solution exists.”*
8. **Step 8:** Stop.

## Complexity

- Best: O(N!)
- Average: O(N!)
- Worst: O(N!)
- Space: O(N²)

## Viva

### Why is N-Queens classified as backtracking?

We explore choices (place a queen in some row), recurse, and undo (remove the queen) when the partial solution cannot be extended.

### What is the worst-case time complexity?

Roughly O(N!), since we try N rows in the first column, then up to N - 1 in the next, and so on.

### What is the constraint check?

No queen on the same row, column, upper diagonal, or lower diagonal. Column conflict is automatic because we place one per column.

### How many solutions exist for N = 8?

92 in total, 12 unique up to reflection/rotation.

### How can the algorithm be made faster?

Track row/diagonal occupancy with boolean arrays (or bitmasks) for O(1) safety checks. Also use symmetry to skip mirrored states.
