---
title: Binary Search Tree
short: Binary Search Tree
tags: Tree, BST, Search
---

## Concept

A **binary search tree (BST)** is a binary tree in which every node holds a key and obeys the **BST property**: all keys in the left subtree are smaller than the node's key, and all keys in the right subtree are larger. Because of this ordering, searching, inserting and deleting only follow a single root-to-leaf path, halving the search space at every step when the tree is reasonably balanced.

Each node stores `key` and pointers to its `left` and `right` child (null when absent). An **inorder** traversal (left, node, right) of a BST visits the keys in sorted order. The **height** is the number of nodes on the longest root-to-leaf path (an empty tree has height 0, a single node has height 1). The minimum key is the leftmost node and the maximum key is the rightmost node. A plain BST is not self-balancing: inserting sorted keys produces a skewed tree whose height is `n`, so operations degrade to `O(n)`.

## Operations

1. **Step 1:** `insert(node, key)`:
    - **(a)** If `node` is null, create and return a new node holding `key`.
    - **(b)** If `key < node.key` insert into the left subtree, if `key > node.key` insert into the right subtree; if equal, reject the duplicate.
    - **(c)** Return `node` so the parent keeps its link.
2. **Step 2:** `search(key)`: start at the root; if `key` equals the node's key it is found, otherwise move left or right by comparison. Reaching a null link means the key is absent.
3. **Step 3:** `delete(node, key)`: first locate the node by comparisons, then handle three cases:
    - **(a)** **Case 1, leaf:** remove the node and return null to the parent.
    - **(b)** **Case 2, one child:** replace the node by its only child.
    - **(c)** **Case 3, two children:** find the inorder successor (smallest key in the right subtree), copy its key into the node, then delete the successor from the right subtree (it has at most one child).
4. **Step 4:** Traversals: **inorder** = left, node, right (sorted output); **preorder** = node, left, right (useful to copy a tree); **postorder** = left, right, node (useful to delete a tree).
5. **Step 5:** `height(node)`: return 0 for null, otherwise `1 + max(height(left), height(right))`.
6. **Step 6:** `min` / `max`: keep going left until there is no left child (minimum); keep going right until there is no right child (maximum).

## Complexity

- Search: O(h), O(log n) average, O(n) worst
- Insert: O(h), O(log n) average, O(n) worst
- Delete: O(h), O(log n) average, O(n) worst
- Traversal: O(n)
- Height: O(n)
- Min / Max: O(h)
- Space: O(n)

## Applications

- Ordered dictionaries and sets with fast lookup, insertion and deletion
- Sorting by inserting keys and doing an inorder traversal (tree sort)
- Foundation for self-balancing trees such as AVL and red-black trees

## Viva

### What is the BST property?

For every node, all keys in its left subtree are smaller and all keys in its right subtree are larger than the node's key. This holds recursively for every subtree.

### What does an inorder traversal of a BST give?

The keys in ascending sorted order. This is a quick way to check that a tree is a valid BST.

### Explain the three cases of deletion.

A leaf is simply removed. A node with one child is replaced by that child. A node with two children takes the key of its inorder successor (or predecessor) and then that successor node, which has at most one child, is deleted.

### Why use the inorder successor in deletion?

It is the next larger key, so copying it into the deleted node keeps every key in the left subtree smaller and every key in the right subtree larger. The successor is the leftmost node of the right subtree, so it has no left child and is easy to remove.

### What is the worst case of BST operations and when does it occur?

`O(n)`. Inserting keys in sorted (or reverse sorted) order creates a skewed tree that looks like a linked list with height `n`.

### How do you find the minimum and maximum in a BST?

The minimum is the leftmost node (follow `left` until null); the maximum is the rightmost node (follow `right` until null). Both take `O(h)` time.

### How do you find the height of a BST?

Recursively: an empty tree has height 0, otherwise `1 + max(height(left), height(right))`. Here a single node has height 1.

### How can duplicates be handled in a BST?

Reject them (as this program does), keep a count in each node, or consistently place equal keys in one subtree (for example the right one).
