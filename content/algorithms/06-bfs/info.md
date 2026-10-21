---
title: BFS (Adjacency Matrix, no STL)
short: BFS
tags: Graph, Traversal
visualizer: true
---

## Concept

Breadth-First Search explores a graph **level by level** starting from a source vertex. Vertices are visited in the order of their distance (in number of edges) from the source. BFS uses a **queue**: enqueue the source, then repeatedly dequeue a vertex, visit it, and enqueue all its unvisited neighbours. A `visited[]` array prevents the same vertex from being processed twice. BFS finds the shortest path in an unweighted graph.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of vertices `n` and edges `e`. Read each edge as `(u, v)` and build the adjacency matrix `adj[n][n]` setting `adj[u][v] = adj[v][u] = 1`.
3. **Step 3:** Initialize `visited[v] = 0` for every vertex `v`. Create an empty queue with `front = rear = 0`.
4. **Step 4:** Read the source vertex `s`.
5. **Step 5:** Mark `visited[s] = 1` and enqueue `s`.
6. **Step 6:** While the queue is not empty, repeat:
    - **(a)** Dequeue a vertex `u` from the front and print it (visit `u`).
    - **(b)** For every `v` from `0` to `n - 1`, check whether `adj[u][v] == 1` (edge exists) and `visited[v] == 0` (not yet seen).
    - **(c)** If both conditions hold, mark `visited[v] = 1` and enqueue `v`.
7. **Step 7:** When the queue becomes empty, the BFS traversal from `s` is complete.
8. **Step 8:** Stop.

## Complexity

- Best: O(V²)
- Average: O(V²)
- Worst: O(V²)
- Space: O(V)

## Viva

### Which data structure does BFS use?

A FIFO queue — vertices are explored in the order they are discovered.

### Time complexity using an adjacency matrix?

O(V²) — for every vertex we scan all V entries of its row.

### Time complexity using an adjacency list?

O(V + E) — each vertex is enqueued once and each edge is examined twice (in undirected graphs).

### What is BFS useful for?

Finding the shortest path in unweighted graphs, level-order traversal, connected components, bipartite checking, and web crawling.

### Is BFS guaranteed to terminate?

Yes, because the visited array ensures each vertex is enqueued at most once and the graph has finitely many vertices.

### Difference between BFS and DFS?

BFS explores level by level using a queue; DFS goes deep first using a stack/recursion. BFS finds shortest paths in unweighted graphs; DFS detects cycles and finds connected components more naturally.

### Space complexity?

O(V) for the visited array and queue.
