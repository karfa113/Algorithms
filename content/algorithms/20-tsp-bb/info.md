---
title: Travelling Salesman (Branch & Bound)
short: TSP (B&B)
tags: Branch & Bound, Graph, NP-Hard
visualizer: true
---

## Concept

In the **Travelling Salesman Problem (TSP)** a salesman must visit every city exactly once and return to the starting city while minimizing the total tour cost. TSP is **NP-hard**. The **Branch & Bound** approach explores the search space as a tree: each node represents a partial tour. At every node we compute a **lower bound** on the cost of any completion of that partial tour. If the bound already exceeds the best known tour, we prune the subtree. Otherwise we branch into the remaining cities. The lower bound is typically derived from summing the two smallest outgoing edges of every unvisited vertex.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of cities `n` and the cost matrix `cost[n][n]` (use `∞` on the diagonal).
3. **Step 3:** Initialize `finalRes = ∞` (best tour cost found so far), `finalPath[]` (best tour), `visited[v] = false`, and `currPath[0] = 0` with `visited[0] = true`.
4. **Step 4:** Compute the initial lower bound `currBound` as the sum of the two smallest edges incident on every vertex, divided by 2.
5. **Step 5:** Call `TSPRec(currBound, currWeight = 0, level = 1, currPath)`.
6. **Step 6:** In `TSPRec(currBound, currWeight, level, currPath)`:
    - **(a)** [Base case] If `level == n`, a complete tour has been formed. If the closing edge `cost[currPath[level-1]][currPath[0]]` exists, compute `currRes = currWeight + cost[currPath[level-1]][currPath[0]]`. If `currRes < finalRes`, update `finalPath` and `finalRes`. Return.
    - **(b)** For each city `i` from `0` to `n - 1`:
        - **(i)** Skip if `i` is already visited or `cost[currPath[level-1]][i]` is `∞`.
        - **(ii)** Save `temp = currBound`. Add `cost[currPath[level-1]][i]` to `currWeight`.
        - **(iii)** Update `currBound` by subtracting the appropriate first/second smallest edge contributions of `currPath[level-1]` and `i`.
        - **(iv)** If `currBound + currWeight < finalRes` (**promising**): set `currPath[level] = i`, mark `visited[i] = true`, and recursively call `TSPRec(currBound, currWeight, level + 1, currPath)`.
        - **(v)** [Backtrack] Restore `currWeight -= cost[currPath[level-1]][i]`, `currBound = temp`, and unmark `visited[i]`.
7. **Step 7:** After the recursion ends, `finalRes` contains the optimal tour cost and `finalPath` the optimal order of cities.
8. **Step 8:** Print `finalPath` and `finalRes`.
9. **Step 9:** Stop.

## Complexity

- Best: O(N²·2^N)
- Average: O(N!) pruned
- Worst: O(N!)
- Space: O(N²)

## Viva

### What is the Travelling Salesman Problem?

Given `n` cities and pairwise distances, find the minimum-cost tour that visits every city exactly once and returns to the starting city.

### Why is TSP NP-hard?

There is no known polynomial-time algorithm. Naively there are (n-1)!/2 tours. The decision version is NP-complete.

### What does Branch & Bound do?

It explores the search tree of partial solutions but prunes any branch whose lower bound on cost already exceeds the best known full tour. This avoids exploring obviously sub-optimal subtrees.

### How is the lower bound computed?

Sum the two smallest outgoing edges of every vertex and divide by 2. Any valid tour enters and leaves each vertex once, so this sum is a valid lower bound on tour cost.

### Difference between Branch & Bound and Backtracking?

Both prune the search tree, but B&B uses a numerical bound (cost) to prune, while plain backtracking prunes only on infeasibility. B&B is for optimization problems; backtracking suits feasibility problems.

### Difference between B&B TSP and DP TSP (Held-Karp)?

Held-Karp DP runs in O(N²·2^N) time guaranteed. Branch & Bound has exponential worst case but can be much faster in practice via aggressive pruning, especially on Euclidean instances.

### What is the time complexity?

Worst case O(N!). With good bounds and pruning, the practical performance is far better. The space complexity is O(N²) for the cost matrix.

### Real-world applications?

Logistics and route planning, PCB drilling, DNA sequencing, vehicle routing, and warehouse picking.
