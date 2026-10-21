---
title: Kruskal's Algorithm
short: Kruskal's MST
tags: Greedy, MST, Graph
visualizer: true
---

## Concept

Kruskal's algorithm finds a **Minimum Spanning Tree (MST)** in a weighted undirected graph. An MST is a tree that connects all vertices with the minimum possible total edge weight. Kruskal sorts all edges by weight and adds them one by one to the MST, skipping any edge that would form a cycle. Cycle detection is done with the **Union-Find (Disjoint Set Union)** data structure.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of vertices `V` and edges `E`. Read each edge as `(u, v, w)` and store it in an edge list.
3. **Step 3:** Sort all edges in **non-decreasing** order of weight `w`.
4. **Step 4:** Initialize a Disjoint Set Union (DSU): set `parent[v] = v` and `rank[v] = 0` for every vertex `v`.
5. **Step 5:** Initialize `totalCost = 0` and `edgesTaken = 0`.
6. **Step 6:** For each edge `(u, v, w)` in the sorted order, repeat:
    - **(a)** Use `find()` to determine the root of `u` and `v`.
    - **(b)** If `find(u) != find(v)` (the edge does not create a cycle): add the edge to the MST, call `union(u, v)`, increment `edgesTaken`, and add `w` to `totalCost`.
    - **(c)** Otherwise discard the edge.
    - **(d)** If `edgesTaken == V - 1`, the MST is complete — break.
7. **Step 7:** Print the MST edges along with the total cost.
8. **Step 8:** Stop.

## Complexity

- Best: O(E log E)
- Average: O(E log E)
- Worst: O(E log E)
- Space: O(V + E)

## Viva

### What is a Minimum Spanning Tree?

A spanning tree of a connected weighted graph that uses V - 1 edges with the smallest possible total weight.

### Time complexity of Kruskal's?

O(E log E) for sorting, plus nearly-linear Disjoint Set operations. Overall O(E log E) ≈ O(E log V).

### Is Kruskal's algorithm greedy?

Yes — at each step it greedily picks the smallest-weight edge that does not create a cycle.

### What does Union-Find do here?

It efficiently detects whether two vertices are in the same connected component (i.e., whether adding an edge would create a cycle).

### Is Kruskal's better for dense or sparse graphs?

Sparse graphs — sorting edges is the dominant cost, and Prim's with an adjacency matrix is faster on dense graphs.

### Does Kruskal's work on disconnected graphs?

It produces a minimum spanning *forest* rather than a tree.
