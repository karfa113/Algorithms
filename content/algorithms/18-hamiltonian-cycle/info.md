---
title: Hamiltonian Cycle
short: Hamiltonian Cycle
tags: Backtracking, Graph
visualizer: true
---

## Concept

A **Hamiltonian Cycle** in an undirected graph is a cycle that visits every vertex exactly once and returns to the starting vertex. Deciding whether such a cycle exists is an **NP-complete** problem. The standard solution uses **backtracking**: starting from vertex `0`, we try to extend the current path one vertex at a time. At every step we check that the candidate vertex is adjacent to the previous one and has not been used. If we reach a dead end we backtrack. After all `n` vertices are placed, we verify that an edge exists from the last vertex back to the start.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of vertices `n` and edges `e`. Build the adjacency matrix `graph[n][n]`.
3. **Step 3:** Initialize `path[0..n-1] = -1`. Place the starting vertex: `path[0] = 0`.
4. **Step 4:** Call `hamCycle(pos = 1)` to fill the remaining positions of the path.
5. **Step 5:** In `hamCycle(pos)`:
    - **(a)** [Base case] If `pos == n`, every vertex has been placed. Return `true` only if `graph[path[pos-1]][path[0]] == 1` (an edge closes the cycle).
    - **(b)** For each candidate vertex `v` from `1` to `n - 1`:
        - **(i)** If `isSafe(v, pos)` returns `true`:
            - assign `path[pos] = v`.
            - recursively call `hamCycle(pos + 1)`; if it returns `true`, propagate success.
            - otherwise **backtrack**: reset `path[pos] = -1` and try the next vertex.
    - **(c)** If no vertex works at position `pos`, return `false`.
6. **Step 6:** `isSafe(v, pos)` procedure: confirm (a) `graph[path[pos-1]][v] == 1` (edge exists from previous vertex) and (b) `v` is not already present in `path[0..pos-1]`.
7. **Step 7:** If `hamCycle(1)` returns `true`, print the cycle (`path[0] → path[1] → … → path[n-1] → path[0]`). Otherwise print *“No Hamiltonian Cycle exists.”*
8. **Step 8:** Stop.

## Complexity

- Best: O(N!)
- Average: O(N!)
- Worst: O(N!)
- Space: O(N)

## Viva

### What is a Hamiltonian Cycle?

A cycle in a graph that visits every vertex exactly once and returns to the starting vertex.

### Difference between Hamiltonian and Eulerian cycle?

Hamiltonian visits every *vertex* exactly once; Eulerian uses every *edge* exactly once. Eulerian is solvable in polynomial time, Hamiltonian is NP-complete.

### Why is Hamiltonian Cycle NP-complete?

There is no known polynomial-time algorithm; it was one of Karp's 21 NP-complete problems and is closely related to TSP.

### What is the time complexity of the backtracking solution?

Worst-case O(N!) — at each of N positions we may try up to N vertices, pruned by the safety check.

### Why fix `path[0] = 0`?

Because any Hamiltonian cycle can be rotated to start at vertex 0. Fixing it eliminates N equivalent rotations and prunes redundant work.

### What is the role of `isSafe`?

It enforces two constraints: the candidate vertex must be adjacent to the previous one in the path, and it must not already appear in the partial path.

### Applications?

Travelling salesman, DNA fragment assembly, circuit design, and tour-planning problems.
