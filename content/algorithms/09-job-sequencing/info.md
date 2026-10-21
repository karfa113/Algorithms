---
title: Job Sequencing with Deadlines
short: Job Sequencing
tags: Greedy, Scheduling
visualizer: true
---

## Concept

We are given `n` jobs, each with a deadline and a profit. Each job takes one unit of time and only one job can be scheduled at a time. The goal is to schedule a subset of jobs to maximize the total profit such that no job misses its deadline. The greedy approach sorts jobs by descending profit, then places each job in the latest free time-slot on or before its deadline. If no slot is free, the job is skipped.

## Algorithm

1. **Step 1:** Start.
2. **Step 2:** Read the number of jobs `n`. For each job `i`, read its `id[i]`, `deadline[i]`, and `profit[i]`.
3. **Step 3:** Sort the jobs in **descending** order of `profit`.
4. **Step 4:** Find the maximum deadline `M` among all jobs. Create a `slot[M]` array with every position marked free (`used[t] = false`).
5. **Step 5:** Initialize `totalProfit = 0`.
6. **Step 6:** For each job in the sorted order, repeat:
    - **(a)** Let `t = min(M, job.deadline) - 1` — the latest slot allowed for this job.
    - **(b)** Scan from `t` down to `0`; if `slot[t]` is free, assign the job to it, mark `used[t] = true`, add `job.profit` to `totalProfit`, and break out of the inner loop.
    - **(c)** If no free slot is found before its deadline, skip the job.
7. **Step 7:** Print the scheduled job ids in slot order and the total profit.
8. **Step 8:** Stop.

## Complexity

- Best: O(n²)
- Average: O(n²)
- Worst: O(n²)
- Space: O(n)

## Viva

### Why sort jobs by profit in descending order?

Greedy choice: scheduling the most profitable job first guarantees we never lose a high-profit opportunity to a lower-profit one.

### Why pick the latest free slot before deadline?

To keep earlier slots free for other jobs that may have tighter deadlines.

### Time complexity?

O(n²) with a simple latest-free-slot scan. With Disjoint Set Union (Union-Find) it can be O(n log n).

### How can you improve performance?

Use a Disjoint Set Union to find the latest free slot in nearly constant amortized time, reducing complexity to O(n α(n)).

### What is the greedy property used?

Local optimality (max profit) leads to global optimality because each unit time-slot is independent; rearranging never improves.
