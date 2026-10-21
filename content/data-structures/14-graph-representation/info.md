---
title: Graph Representation (Adjacency Matrix & List)
short: Graph Representation
tags: Graph, Adjacency Matrix, Adjacency List
---

## Concept

A **graph** `G = (V, E)` is a set of vertices connected by edges, which may be *directed* or *undirected*. Before any graph algorithm (BFS, DFS, Dijkstra …) can run, the graph must be stored in memory. The two classic representations are:

- **Adjacency matrix** — a `V × V` table where `matrix[u][v] = 1` if there is an edge from `u` to `v`. Edge lookup is instant, but it always uses `O(V²)` memory.
- **Adjacency list** — an array of lists where `adj[u]` holds the neighbours of `u`. It uses only `O(V + E)` memory and is the better choice for *sparse* graphs.

For an undirected graph every edge is stored twice (`u→v` and `v→u`), so the matrix is symmetric.

## Operations

1. **Step 1:** Create the graph: read `n` (vertices), the type (directed or undirected) and the number of edges. Allocate an `n × n` matrix filled with `0` and `n` empty lists.
2. **Step 2:** `addEdge(u, v)`:
    - **(a)** Reject invalid vertices (outside `0..n-1`), self loops and duplicate edges.
    - **(b)** Set `matrix[u][v] = 1` and append `v` to `adj[u]`.
    - **(c)** If the graph is undirected, also set `matrix[v][u] = 1` and append `u` to `adj[v]`.
3. **Step 3:** Display the matrix: print row `i` as `matrix[i][0..n-1]`.
4. **Step 4:** Display the list: for every vertex `i` print `i` followed by the contents of `adj[i]`.
5. **Step 5:** Degree: for an undirected graph `deg(v) = |adj[v]|`. For a directed graph `out-degree = |adj[v]|` and `in-degree` = number of `1`s in column `v` of the matrix.
6. **Step 6:** Edge query: return `matrix[u][v]` — an `O(1)` check.

## Complexity

- Matrix space: O(V²)
- List space: O(V + E)
- Add edge: O(1)
- Edge exists? (matrix): O(1)
- Edge exists? (list): O(deg(u))
- List all neighbours: O(V) matrix, O(deg(u)) list

## Applications

- Social networks, road maps and web-page links are naturally graphs.
- Matrix form is used for Floyd-Warshall and dense graphs; list form for BFS, DFS, Dijkstra on sparse graphs.

## Viva

### What is the difference between an adjacency matrix and an adjacency list?

The matrix is a `V × V` table giving O(1) edge lookup but O(V²) space. The list stores only the real neighbours of each vertex, using O(V + E) space, but an edge lookup costs O(degree).

### When would you prefer an adjacency list?

For sparse graphs (E much smaller than V²), and whenever you need to iterate over the neighbours of a vertex, as BFS and DFS do.

### Why is the adjacency matrix of an undirected graph symmetric?

Each undirected edge `{u, v}` is stored in both directions, so `matrix[u][v] == matrix[v][u]` always.

### How do you find the degree of a vertex in each representation?

Undirected: the size of `adj[v]` (or the sum of row `v`). Directed: out-degree is the row sum, in-degree is the column sum.

### What is the time to check whether an edge exists?

O(1) in the matrix; O(degree of u) in the list.

### How would you store a weighted graph?

In the matrix, store the weight instead of `1` (with `0` or infinity for "no edge"). In the list, store `(neighbour, weight)` pairs.

### What is the sum of all degrees in an undirected graph?

`2 × E` — the handshake lemma — because each edge contributes to the degree of two vertices.
