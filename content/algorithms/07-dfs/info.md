---
title: DFS (Recursive & Iterative)
short: DFS
tags: Graph, Traversal
visualizer: true
---

## Concept

Depth-First Search explores a graph as deeply as possible along each branch before backtracking. Starting at a source, DFS visits an unvisited neighbour, recurses on it, and only moves to another neighbour after the entire subtree is exhausted. Recursive DFS uses the function-call stack implicitly, while iterative DFS uses an explicit stack. DFS underlies topological sorting, cycle detection, strongly connected components, and many other graph algorithms.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of vertices `n` and edges `e`. Build the adjacency matrix `adj[n][n]`.
3. **Step 3:** Initialize `visited[v] = 0` for every vertex `v`. Read the source vertex `s`.
4. **Step 4:** [Recursive DFS] Call `dfsRec(s)`:
    - **(a)** Mark `visited[s] = 1` and print `s`.
    - **(b)** For every `v` from `0` to `n - 1`, if `adj[s][v] == 1` and `visited[v] == 0`, recursively call `dfsRec(v)`.
5. **Step 5:** [Iterative DFS] Use an explicit stack:
    - **(a)** Push the source `s` onto the stack.
    - **(b)** While the stack is not empty: pop a vertex `u`; if it is already visited, skip and continue; otherwise mark `visited[u] = 1` and print `u`.
    - **(c)** For `v` from `n - 1` down to `0` (reverse order to preserve recursive ordering), if `adj[u][v] == 1` and `visited[v] == 0`, push `v`.
6. **Step 6:** Both procedures terminate when no more vertices can be reached from the source.
7. **Step 7:** Stop.

## Complexity

- Best: O(V²)
- Average: O(V²)
- Worst: O(V²)
- Space: O(V)

## Viva

### Which data structure does DFS use?

A stack — either explicit (iterative) or implicit via recursion.

### Time complexity with an adjacency matrix?

O(V²); with adjacency list it is O(V + E).

### Applications of DFS?

Cycle detection, topological sorting (DAGs), strongly connected components (Kosaraju/Tarjan), finding bridges & articulation points, maze solving.

### Difference between recursive and iterative DFS?

Recursive uses the system call-stack; iterative uses an explicit stack. Iterative avoids stack overflow on deep graphs and is preferable in production.

### How does DFS detect a cycle?

In a directed graph by tracking vertices in the current DFS path; if we encounter a back-edge to an ancestor a cycle exists. In an undirected graph by spotting a visited neighbour that is not the parent.

### Can DFS find shortest paths?

Not in general for unweighted graphs; it may find a longer path before a shorter one. Use BFS for shortest paths in unweighted graphs.
