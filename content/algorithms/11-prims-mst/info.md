---
title: Prim's Algorithm
short: Prim's MST
tags: Greedy, MST, Graph
visualizer: true
---

## Concept

Prim's algorithm also computes a Minimum Spanning Tree but grows it **vertex by vertex** starting from an arbitrary source. At every step it adds the minimum-weight edge that connects a vertex already in the tree to a vertex outside the tree. Using an adjacency matrix and a `key[]` array, the algorithm runs in `O(V²)` time; with a binary heap it improves to `O(E log V)`.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of vertices `V` and the weighted adjacency matrix `graph[V][V]` (use `0` if no edge between two vertices).
3. **Step 3:** Initialize `key[v] = ∞`, `parent[v] = -1`, and `inMST[v] = false` for every vertex `v`.
4. **Step 4:** Set `key[0] = 0` so that vertex `0` is chosen first as the root of the MST.
5. **Step 5:** Repeat `V - 1` times:
    - **(a)** Pick the vertex `u` not yet in the MST that has the smallest `key[u]`.
    - **(b)** Mark `inMST[u] = true`.
    - **(c)** For every neighbour `v` of `u` (where `graph[u][v] != 0`), if `v` is not in the MST and `graph[u][v] < key[v]`:
        - update `key[v] = graph[u][v]` and `parent[v] = u`.
6. **Step 6:** After the loop, the `parent[]` array describes the MST — for every vertex `v != 0`, the edge `parent[v] — v` belongs to the MST with weight `graph[v][parent[v]]`.
7. **Step 7:** Print all MST edges along with the total weight.
8. **Step 8:** Stop.

## Complexity

- Best: O(V²)
- Average: O(V²)
- Worst: O(V²)
- Space: O(V)

## Viva

### Difference between Prim's and Kruskal's?

Prim's grows a single tree from a source; Kruskal's grows a forest by sorting edges. Prim's prefers dense graphs (matrix); Kruskal's prefers sparse.

### Time complexity of Prim's?

O(V²) using an adjacency matrix and a `key` array; O(E log V) using an adjacency list with a binary heap; O(E + V log V) using a Fibonacci heap.

### Is Prim's greedy?

Yes — at each step it greedily adds the minimum-weight crossing edge from the current tree.

### Does Prim's work on disconnected graphs?

It can only build the MST of the component containing the source. To cover all components, run from each component's representative.

### What is the cut property used to prove correctness?

For any cut of the graph, the lightest crossing edge is in some MST. Prim's always picks such an edge across the cut between in-MST and out-MST.
