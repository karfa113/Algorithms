---
title: M-Coloring (Graph Coloring)
short: M-Coloring
tags: Backtracking, Graph
visualizer: true
---

## Concept

Given an undirected graph and `m` colors, the M-Coloring problem asks whether we can color the vertices using at most `m` colors such that no two adjacent vertices share a color. The decision version is **NP-complete**. The standard solution uses **backtracking**: try assigning each color to the current vertex; if it does not conflict with already-colored neighbours, recurse on the next vertex; backtrack on failure.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of vertices `n` and edges `e`. Build the adjacency matrix `graph[n][n]`.
3. **Step 3:** Read the number of available colors `m`. Initialize `color[v] = 0` for every vertex `v`.
4. **Step 4:** Call `graphColoring(v = 0)`.
5. **Step 5:** In `graphColoring(v)`:
    - **(a)** [Base case] If `v == n`, every vertex has been assigned a valid color — return `true`.
    - **(b)** For each color `c` from `1` to `m`:
        - **(i)** If `isSafe(v, c)` returns `true` (no neighbour of `v` currently has color `c`):
            - assign `color[v] = c`.
            - recursively call `graphColoring(v + 1)`; if it returns `true`, propagate success.
            - otherwise **backtrack**: reset `color[v] = 0` and try the next color.
    - **(c)** If no color works for vertex `v`, return `false`.
6. **Step 6:** `isSafe(v, c)` procedure: for every neighbour `u` of `v` (where `graph[v][u] == 1`), check that `color[u] != c`.
7. **Step 7:** If `graphColoring(0)` returns `true`, print the color assigned to each vertex. Otherwise print *“Not possible with m colors.”*
8. **Step 8:** Stop.

## Complexity

- Best: O(m^N)
- Average: O(m^N)
- Worst: O(m^N)
- Space: O(N)

## Viva

### What is the chromatic number of a graph?

The minimum number of colors needed to properly color the graph. Determining it is NP-hard.

### Why is graph coloring NP-complete?

There is no known polynomial-time algorithm for general graphs and 3-coloring is one of Karp's 21 original NP-complete problems.

### Time complexity?

Worst-case O(m^N) — each vertex can take m colors and there are N vertices.

### What is the role of backtracking here?

It systematically tries every color for each vertex and undoes assignments that lead to dead-ends, pruning impossible branches.

### Real-world applications?

Map coloring, register allocation in compilers, time-table scheduling, frequency assignment in cellular networks, and Sudoku.
