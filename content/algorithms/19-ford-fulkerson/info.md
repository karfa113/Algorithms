---
title: Ford-Fulkerson (Max Flow)
short: Ford-Fulkerson
tags: Graph, Max Flow
visualizer: true
---

## Concept

The Ford-Fulkerson method computes the **maximum flow** from a source `s` to a sink `t` in a flow network — a directed graph whose edges carry non-negative capacities. The idea is to repeatedly find an **augmenting path** from `s` to `t` in the *residual graph* and push flow equal to the path's bottleneck capacity along it. The residual graph stores remaining capacity on forward edges and used flow on reverse edges (allowing flow cancellation). When no augmenting path remains, the algorithm terminates. Using BFS to find the path gives the Edmonds-Karp variant with complexity `O(V·E²)`.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of vertices `V` and the capacity matrix `cap[V][V]`. Read the source `s` and the sink `t`.
3. **Step 3:** Create a residual graph `rGraph[V][V]` and initialize `rGraph[u][v] = cap[u][v]` for every pair.
4. **Step 4:** Initialize `maxFlow = 0`.
5. **Step 5:** Repeat while a path from `s` to `t` exists in the residual graph:
    - **(a)** Use BFS from `s`; record `parent[v]` for each visited vertex. If `t` is unreachable, exit the loop.
    - **(b)** Compute the bottleneck capacity along the path: `pathFlow = min(rGraph[u][v])` for every edge `(u, v)` on the path traced from `t` back to `s`.
    - **(c)** Update the residual graph: for every edge `(u, v)` on the path, set `rGraph[u][v] -= pathFlow` (forward) and `rGraph[v][u] += pathFlow` (reverse).
    - **(d)** Add `pathFlow` to `maxFlow`.
6. **Step 6:** When no augmenting path can be found, the maximum flow has been reached.
7. **Step 7:** Print `maxFlow` as the answer.
8. **Step 8:** Stop.

## Complexity

- Best: O(VE²)
- Average: O(VE²)
- Worst: O(E·max_flow)
- Space: O(V²)

## Viva

### What is a flow network?

A directed graph with non-negative edge capacities, a source `s`, and a sink `t`. Flow on every edge must be ≤ capacity, and total flow in equals total flow out at every internal vertex.

### What is the residual graph?

A graph that records remaining capacity on forward edges (`cap - flow`) and used flow on reverse edges. Reverse edges allow the algorithm to *cancel* previously sent flow.

### What is an augmenting path?

A path from source to sink in the residual graph in which every edge has positive residual capacity. Flow can be pushed along it equal to the path's bottleneck.

### Why use BFS instead of DFS?

BFS finds the shortest augmenting path. This is the Edmonds-Karp variant and guarantees O(V·E²) time. Plain DFS may not terminate for irrational capacities and can be much slower in the worst case.

### State the Max-Flow Min-Cut theorem.

The maximum flow from `s` to `t` equals the capacity of the minimum `s-t` cut (smallest total capacity of edges whose removal disconnects `s` from `t`).

### Time complexity?

O(E · max_flow) for the original Ford-Fulkerson with DFS. O(V · E²) for Edmonds-Karp (BFS). O(V²·E) using Dinic's algorithm.

### Applications of max flow?

Bipartite matching, image segmentation, network routing, project selection, and baseball elimination problems.
