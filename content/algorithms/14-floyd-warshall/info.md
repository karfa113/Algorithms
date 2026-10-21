---
title: Floyd-Warshall Algorithm
short: Floyd-Warshall
tags: DP, All-Pairs Shortest Path, Graph
visualizer: true
---

## Concept

Floyd-Warshall finds the shortest distance between every pair of vertices in a weighted graph (with possibly negative weights, but no negative cycles). It uses dynamic programming over an intermediate vertex `k`: `dist[i][j]` is updated to the minimum of itself and `dist[i][k] + dist[k][j]` for every `k`. The algorithm runs in `O(V³)` time and is well suited for dense graphs.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of vertices `V` and the weighted matrix `dist[V][V]`: use the edge weight where an edge exists, `∞` where no edge exists, and `0` on the diagonal.
3. **Step 3:** For `k` from `0` to `V - 1` (`k` is the candidate intermediate vertex), repeat:
    - **(a)** For `i` from `0` to `V - 1`:
        - **(i)** For `j` from `0` to `V - 1`:
            - if `dist[i][k] + dist[k][j] < dist[i][j]`, update `dist[i][j] = dist[i][k] + dist[k][j]`.
4. **Step 4:** After the triple loop completes, `dist[i][j]` contains the shortest distance from vertex `i` to vertex `j` using any of the vertices as intermediates.
5. **Step 5:** [Optional check] If any `dist[i][i] < 0`, the graph contains a negative-weight cycle.
6. **Step 6:** Print the final shortest-distance matrix `dist[][]`.
7. **Step 7:** Stop.

## Complexity

- Best: O(V³)
- Average: O(V³)
- Worst: O(V³)
- Space: O(V²)

## Viva

### What is the time complexity?

O(V³). Three nested loops over vertices.

### Does Floyd-Warshall handle negative edges?

Yes, as long as there is no negative cycle. A negative `dist[i][i]` after running indicates a cycle.

### When prefer Floyd-Warshall over running Dijkstra's V times?

When the graph is dense or has negative edges. Dijkstra's needs non-negative weights and V × O(V²) = O(V³) anyway, but Floyd-Warshall is simpler.

### Why is the outermost loop `k`?

Because k represents the set of allowed intermediate vertices {0..k}. After processing k, dist[i][j] is shortest using vertices ≤ k as intermediates.

### What is the recurrence?

dist^k[i][j] = min(dist^(k-1)[i][j], dist^(k-1)[i][k] + dist^(k-1)[k][j]).
