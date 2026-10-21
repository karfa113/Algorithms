import java.util.Scanner;

public class Main {
    static class Node {
        int key, height = 1;
        Node left, right;
        Node(int k) { key = k; }
    }

    static boolean found;   // set by insert/delete to report the outcome

    static int height(Node n) { return n == null ? 0 : n.height; }
    static int balance(Node n) { return n == null ? 0 : height(n.left) - height(n.right); }
    static void update(Node n) { n.height = 1 + Math.max(height(n.left), height(n.right)); }

    static Node rotateRight(Node y) {      // y's left child x becomes the new root
        Node x = y.left;
        y.left = x.right;
        x.right = y;
        update(y); update(x);
        return x;
    }

    static Node rotateLeft(Node x) {       // x's right child y becomes the new root
        Node y = x.right;
        x.right = y.left;
        y.left = x;
        update(x); update(y);
        return y;
    }

    // Restore the AVL property at n (children are already balanced).
    static Node rebalance(Node n) {
        update(n);
        int bf = balance(n);
        if (bf > 1) {
            if (balance(n.left) >= 0) {
                System.out.println("Rotation: LL case at " + n.key + " (right rotation)");
            } else {
                System.out.println("Rotation: LR case at " + n.key + " (left-right rotation)");
                n.left = rotateLeft(n.left);
            }
            return rotateRight(n);
        }
        if (bf < -1) {
            if (balance(n.right) <= 0) {
                System.out.println("Rotation: RR case at " + n.key + " (left rotation)");
            } else {
                System.out.println("Rotation: RL case at " + n.key + " (right-left rotation)");
                n.right = rotateRight(n.right);
            }
            return rotateLeft(n);
        }
        return n;
    }

    static Node insert(Node n, int key) {
        if (n == null) { found = false; return new Node(key); }
        if (key < n.key) n.left = insert(n.left, key);
        else if (key > n.key) n.right = insert(n.right, key);
        else { found = true; return n; }   // duplicate
        return rebalance(n);
    }

    static Node minNode(Node n) { while (n.left != null) n = n.left; return n; }

    static Node delete(Node n, int key) {
        if (n == null) { found = false; return null; }
        if (key < n.key) n.left = delete(n.left, key);
        else if (key > n.key) n.right = delete(n.right, key);
        else {
            found = true;
            if (n.left == null || n.right == null)      // 0 or 1 child
                return n.left != null ? n.left : n.right;
            Node s = minNode(n.right);                  // inorder successor
            n.key = s.key;
            n.right = delete(n.right, s.key);
        }
        return rebalance(n);
    }

    static boolean search(Node n, int key) {
        while (n != null) {
            if (key == n.key) return true;
            n = key < n.key ? n.left : n.right;
        }
        return false;
    }

    static void inorder(Node n) { if (n != null) { inorder(n.left); System.out.print(n.key + " "); inorder(n.right); } }
    static void preorder(Node n) { if (n != null) { System.out.print(n.key + " "); preorder(n.left); preorder(n.right); } }
    static void showBalance(Node n) {
        if (n != null) {
            showBalance(n.left);
            System.out.println("Node " + n.key + ": height = " + n.height + ", balance factor = " + balance(n));
            showBalance(n.right);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Node root = null;
        while (true) {
            System.out.print("\n--- AVL Tree ---\n1. Insert\n2. Delete\n3. Search\n4. Inorder\n5. Preorder\n6. Height and balance factors\n0. Exit\nEnter choice: ");
            if (!sc.hasNextInt()) break;
            int choice = sc.nextInt();
            if (choice == 0) { System.out.println("Goodbye!"); break; }
            int x;
            switch (choice) {
            case 1:
                System.out.print("Enter value: "); x = sc.nextInt();
                root = insert(root, x);
                if (found) System.out.println(x + " already exists. Duplicates are not allowed.");
                else System.out.println(x + " inserted.");
                break;
            case 2:
                System.out.print("Enter value: "); x = sc.nextInt();
                root = delete(root, x);
                if (found) System.out.println(x + " deleted.");
                else System.out.println(x + " not found.");
                break;
            case 3:
                System.out.print("Enter value: "); x = sc.nextInt();
                System.out.println(x + (search(root, x) ? " found." : " not found."));
                break;
            case 4:
                if (root == null) { System.out.println("Tree is empty."); break; }
                System.out.print("Inorder: "); inorder(root); System.out.println(); break;
            case 5:
                if (root == null) { System.out.println("Tree is empty."); break; }
                System.out.print("Preorder: "); preorder(root); System.out.println(); break;
            case 6:
                if (root == null) { System.out.println("Tree is empty."); break; }
                showBalance(root);
                System.out.println("Tree height = " + height(root));
                break;
            default: System.out.println("Invalid choice.");
            }
        }
    }
}
