---
title: Bellman-Ford Algorithm
short: Bellman-Ford
tags: DP, Shortest Path, Graph
visualizer: true
---

## Concept

Bellman-Ford computes single-source shortest paths in graphs that may have **negative-weight edges**. Unlike Dijkstra's, it does not require non-negative weights and can also **detect negative-weight cycles** reachable from the source. The algorithm relaxes every edge `V - 1` times. If any distance can still be improved on a V-th pass, a negative cycle exists. The complexity is `O(V·E)`.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of vertices `V` and edges `E`. Read each edge as `(u, v, w)` into an edge list. Read the source `s`.
3. **Step 3:** Initialize `dist[v] = ∞` for every vertex `v`, then set `dist[s] = 0`.
4. **Step 4:** Repeat the following `V - 1` times:
    - **(a)** For every edge `(u, v, w)` in the edge list, if `dist[u] != ∞` and `dist[u] + w < dist[v]`, update `dist[v] = dist[u] + w` (relax the edge).
5. **Step 5:** [Negative cycle check] Perform one more pass over all edges:
    - **(a)** If for any edge `(u, v, w)` we still have `dist[u] + w < dist[v]`, a negative-weight cycle is reachable from `s`. Print *“Negative-weight cycle detected”* and stop.
6. **Step 6:** Otherwise `dist[v]` contains the shortest distance from `s` to `v` for every vertex.
7. **Step 7:** Print the shortest distances.
8. **Step 8:** Stop.

## Complexity

- Best: O(VE)
- Average: O(VE)
- Worst: O(VE)
- Space: O(V)

## Viva

### Why V - 1 iterations?

Any shortest simple path has at most V - 1 edges. After V - 1 relaxations, all distances are correct (in the absence of negative cycles).

### How does Bellman-Ford detect negative cycles?

After V - 1 passes the distances are final. If a V-th pass still relaxes an edge, a negative-weight cycle exists.

### Time complexity?

O(V·E). For dense graphs it can be slower than Dijkstra's but it handles negatives.

### When to use Bellman-Ford over Dijkstra's?

Whenever the graph has negative weights or you need to detect a negative cycle.

### Can Bellman-Ford be applied to undirected graphs with negative edges?

Treat each undirected edge as two directed edges; but a single negative edge then forms a 2-cycle, so the answer is generally negative-cycle.
