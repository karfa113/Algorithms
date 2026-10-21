---
title: Fractional Knapsack
short: Fractional Knapsack
tags: Greedy
visualizer: true
---

## Concept

In the Fractional Knapsack problem we have `n` items, each with a weight and value, and a knapsack with capacity `W`. We may take any fraction of an item. The goal is to maximize total value. The **greedy** strategy is to sort items by `value/weight` ratio in descending order and take items fully while there is enough capacity, then take a fraction of the next item. Unlike 0/1 Knapsack, the greedy solution here is optimal.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of items `n`. For each item `i`, read its `weight[i]` and `value[i]`. Read the knapsack capacity `W`.
3. **Step 3:** For every item `i`, compute the value-per-weight ratio: `ratio[i] = value[i] / weight[i]`.
4. **Step 4:** Sort the items in **descending** order of `ratio`.
5. **Step 5:** Initialize `totalValue = 0` and the remaining capacity `cap = W`.
6. **Step 6:** Iterate through the items in sorted order:
    - **(a)** If `weight[i] ≤ cap`, take the entire item: `totalValue += value[i]` and `cap -= weight[i]`.
    - **(b)** Otherwise, take a fraction `f = cap / weight[i]` of the item: `totalValue += f * value[i]`, set `cap = 0`, and break out of the loop.
7. **Step 7:** Print the maximum profit `totalValue`.
8. **Step 8:** Stop.

## Complexity

- Best: O(n log n)
- Average: O(n log n)
- Worst: O(n log n)
- Space: O(n)

## Viva

### Why does greedy work for fractional knapsack?

Because we can split items. Taking the highest value-per-weight first is provably optimal — any swap leads to equal or lesser total.

### Why doesn't greedy work for 0/1 knapsack?

Because items cannot be split; the high-ratio item may not fit while a combination of smaller items might yield more value.

### Time complexity?

O(n log n) due to sorting (O(n²) with bubble sort as shown). After sorting, the selection loop is O(n).

### What is the greedy choice property here?

At each step, choose the item with the highest value/weight ratio that still has capacity left.

### What is the type of problem (optimization)?

It is a classic optimization problem solved with a greedy strategy. The exchange-argument proof shows the greedy choice never reduces optimality.

### Difference from 0/1 knapsack solution technique?

0/1 Knapsack uses dynamic programming and is NP-hard in general; fractional is solvable greedily in polynomial time.
