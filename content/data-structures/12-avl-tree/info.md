---
title: AVL Tree
short: AVL Tree
tags: Tree, Self-Balancing, BST
---

## Concept

An **AVL tree** is a self-balancing binary search tree. For every node the **balance factor** `bf = height(left) - height(right)` must be `-1`, `0` or `+1`. Whenever an insertion or deletion breaks this rule, the tree repairs itself with one or two local **rotations**, so the height always stays `O(log n)` (at most about `1.44 log2 n`). A plain BST can degenerate into a linked list on sorted input; an AVL tree cannot.

Each node stores `key`, pointers to its left and right child, and its `height` (a leaf has height 1, an empty subtree 0). Heights are recomputed on the way back up the recursion, which is where balance factors are checked. AVL trees give faster lookups than red-black trees because they are more strictly balanced, at the cost of slightly more rotations on updates. Use them when searches dominate and the data changes less often.

## Operations

1. **Step 1:** `insert(node, key)`:
    - **(a)** Do an ordinary BST insert: go left if `key < node.key`, right if larger; a duplicate is rejected; an empty spot gets a new node of height 1.
    - **(b)** On the way back up, update `node.height = 1 + max(height(left), height(right))` and compute `bf`.
    - **(c)** If `bf > 1` (left-heavy): if the left child has `bf >= 0` it is the **LL case**, do a right rotation at `node`; otherwise it is the **LR case**, rotate the left child left, then rotate `node` right.
    - **(d)** If `bf < -1` (right-heavy): if the right child has `bf <= 0` it is the **RR case**, do a left rotation at `node`; otherwise it is the **RL case**, rotate the right child right, then rotate `node` left.
2. **Step 2:** `rotateRight(y)`: let `x = y.left`; set `y.left = x.right`, `x.right = y`; recompute the heights of `y` then `x`; return `x` as the new subtree root. `rotateLeft` is the mirror image.
3. **Step 3:** `delete(node, key)`:
    - **(a)** Search for `key` as in a BST; if the subtree is empty the key is not present.
    - **(b)** If the node has 0 or 1 child, replace it by that child. If it has 2 children, copy the inorder successor (smallest key of the right subtree) into it and delete the successor from the right subtree.
    - **(c)** On the way back up, update heights and rebalance with the same four cases. For deletion the child's `bf` may be `0`, which is handled as a single rotation (LL or RR).
4. **Step 4:** `search(key)`: start at the root, go left or right by comparison until the key is found or a null link is reached.
5. **Step 5:** Inorder traversal prints keys in sorted order; preorder prints the root first and shows the tree's shape. Printing `height` and `bf` for each node verifies that every `bf` is within `[-1, 1]`.

## Complexity

- Search: O(log n)
- Insert: O(log n)
- Delete: O(log n)
- Traversal: O(n)
- Space: O(n)

## Applications

- In-memory ordered dictionaries and sets where lookups dominate
- Database indexes and lookup tables that must give guaranteed worst-case time
- Building blocks for interval trees and order-statistic trees

## Viva

### What is the balance factor and which values are allowed?

`bf = height(left) - height(right)`. In an AVL tree every node must have `bf` in `{-1, 0, +1}`.

### What are the four rotation cases?

LL (right rotation), RR (left rotation), LR (left rotation on the left child, then right rotation on the node) and RL (right rotation on the right child, then left rotation on the node). The name tells where the new node went relative to the unbalanced node.

### How many rotations does an insertion need at most?

At most one rebalancing step (a single or a double rotation). After it, the subtree regains its old height, so no ancestor becomes unbalanced.

### Can a deletion need more than one rotation?

Yes. Fixing a node may shrink the subtree height, so ancestors higher up can become unbalanced and need rotations too, up to `O(log n)` in total.

### Why is the height of an AVL tree O(log n)?

The minimum number of nodes `N(h)` in an AVL tree of height `h` satisfies `N(h) = N(h-1) + N(h-2) + 1`, which grows like Fibonacci numbers (exponentially). So `h <= 1.44 log2(n)`.

### AVL tree vs red-black tree?

AVL is more strictly balanced, so lookups are faster, but inserts and deletes do more rotations. Red-black trees allow a height of up to `2 log2 n` and are cheaper for update-heavy workloads.

### Which node is the first unbalanced one after inserting?

The deepest ancestor of the new node whose `bf` becomes `+2` or `-2`. The recursive code finds it naturally while returning up the call stack.

### What happens if you insert keys 10, 20, 30 in order?

Inserting 30 makes node 10 right-heavy with a right-heavy child (RR case), so a left rotation makes 20 the root with children 10 and 30.
