---
title: Dijkstra's Algorithm
short: Dijkstra's
tags: Greedy, Shortest Path, Graph
visualizer: true
---

## Concept

Dijkstra's algorithm computes the shortest distance from a single source to every other vertex in a graph with **non-negative** edge weights. It maintains a distance array initialised to infinity (except the source = 0), then repeatedly picks the unvisited vertex with the smallest distance, marks it finalized, and **relaxes** its outgoing edges. The algorithm is greedy: once a vertex's distance is finalised it never changes.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of vertices `V` and the weighted adjacency matrix `graph[V][V]` (assume all weights are non-negative).
3. **Step 3:** Initialize `dist[v] = ∞` and `visited[v] = false` for every vertex `v`. Read the source vertex `s` and set `dist[s] = 0`.
4. **Step 4:** Repeat `V - 1` times:
    - **(a)** Select the unvisited vertex `u` with the smallest `dist[u]`.
    - **(b)** Mark `visited[u] = true`.
    - **(c)** For every neighbour `v` of `u` (where `graph[u][v] != 0`) that is not yet visited:
        - if `dist[u] + graph[u][v] < dist[v]`, update `dist[v] = dist[u] + graph[u][v]` (this is the *relaxation* step).
5. **Step 5:** After the loop, `dist[v]` holds the shortest distance from `s` to `v` for every vertex.
6. **Step 6:** Print the shortest distance from `s` to every vertex.
7. **Step 7:** Stop.

## Complexity

- Best: O(V²)
- Average: O(V²)
- Worst: O(V²)
- Space: O(V)

## Viva

### Does Dijkstra's work with negative weights?

No. A negative edge can decrease the distance of an already-finalized vertex, violating the greedy invariant. Use Bellman-Ford instead.

### Time complexity?

O(V²) with an adjacency matrix; O((V + E) log V) using a binary heap + adjacency list; O(E + V log V) with a Fibonacci heap.

### Why is it a greedy algorithm?

At each step it greedily picks the closest unfinalized vertex; that distance is provably final under non-negative weights.

### Difference between Dijkstra's and Prim's?

Both grow from a source, but Prim's compares only the weight of the connecting edge, while Dijkstra's compares the total distance from the source.

### Can Dijkstra's detect negative cycles?

No. It assumes non-negative edges and can produce wrong results if negatives are present.
