import java.util.Scanner;

public class Main {
    static class Node {
        int key;
        Node left, right;
        Node(int k) { key = k; }
    }

    static boolean found;   // set by insert/delete to report the outcome

    static Node insert(Node n, int key) {
        if (n == null) { found = false; return new Node(key); }
        if (key < n.key) n.left = insert(n.left, key);
        else if (key > n.key) n.right = insert(n.right, key);
        else found = true;                   // duplicate
        return n;
    }

    static Node minNode(Node n) { while (n.left != null) n = n.left; return n; }
    static Node maxNode(Node n) { while (n.right != null) n = n.right; return n; }

    static Node delete(Node n, int key) {
        if (n == null) { found = false; return null; }
        if (key < n.key) n.left = delete(n.left, key);
        else if (key > n.key) n.right = delete(n.right, key);
        else {
            found = true;
            if (n.left == null && n.right == null) {         // case 1: leaf
                System.out.println("Case 1: leaf node");
                return null;
            }
            if (n.left == null || n.right == null) {         // case 2: one child
                System.out.println("Case 2: node with one child");
                return n.left != null ? n.left : n.right;
            }
            System.out.println("Case 3: node with two children");  // case 3: two children
            Node s = minNode(n.right);                       // inorder successor
            n.key = s.key;
            n.right = delete(n.right, s.key);
            found = true;
        }
        return n;
    }

    static boolean search(Node n, int key) {
        while (n != null) {
            if (key == n.key) return true;
            n = key < n.key ? n.left : n.right;
        }
        return false;
    }

    static int height(Node n) {
        if (n == null) return 0;
        return 1 + Math.max(height(n.left), height(n.right));
    }

    static void inorder(Node n) { if (n != null) { inorder(n.left); System.out.print(n.key + " "); inorder(n.right); } }
    static void preorder(Node n) { if (n != null) { System.out.print(n.key + " "); preorder(n.left); preorder(n.right); } }
    static void postorder(Node n) { if (n != null) { postorder(n.left); postorder(n.right); System.out.print(n.key + " "); } }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Node root = null;
        while (true) {
            System.out.print("\n--- Binary Search Tree ---\n1. Insert\n2. Delete\n3. Search\n4. Inorder\n5. Preorder\n6. Postorder\n7. Height\n8. Minimum and Maximum\n0. Exit\nEnter choice: ");
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
                System.out.print("Postorder: "); postorder(root); System.out.println(); break;
            case 7:
                System.out.println("Tree height = " + height(root)); break;
            case 8:
                if (root == null) { System.out.println("Tree is empty."); break; }
                System.out.println("Minimum = " + minNode(root).key + "\nMaximum = " + maxNode(root).key);
                break;
            default: System.out.println("Invalid choice.");
            }
        }
    }
}
