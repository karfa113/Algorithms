import java.util.Scanner;

public class Main {
    static class Node {
        Node[] child = new Node[26];
        boolean isEnd;               // true if a word ends at this node
    }

    static boolean validWord(String s) {   // only lowercase a-z allowed
        for (int i = 0; i < s.length(); i++)
            if (s.charAt(i) < 'a' || s.charAt(i) > 'z') return false;
        return true;
    }

    static boolean insert(Node root, String w) {   // true if new, false if already present
        Node cur = root;
        for (int i = 0; i < w.length(); i++) {
            int c = w.charAt(i) - 'a';
            if (cur.child[c] == null) cur.child[c] = new Node();
            cur = cur.child[c];
        }
        boolean isNew = !cur.isEnd;
        cur.isEnd = true;
        return isNew;
    }

    static Node walk(Node root, String s) {        // node reached by s, or null
        Node cur = root;
        for (int i = 0; i < s.length() && cur != null; i++) cur = cur.child[s.charAt(i) - 'a'];
        return cur;
    }

    static boolean hasChild(Node n) {
        for (int i = 0; i < 26; i++) if (n.child[i] != null) return true;
        return false;
    }

    // Unmark the word and drop nodes that are no longer needed.
    // Returns true if node n itself can be removed by its parent.
    static boolean removeWord(Node n, String w, int depth) {
        if (depth == w.length()) {
            n.isEnd = false;
        } else {
            int c = w.charAt(depth) - 'a';
            if (removeWord(n.child[c], w, depth + 1)) n.child[c] = null;
        }
        return !n.isEnd && !hasChild(n);
    }

    // DFS in a..z order gives words in lexicographic order.
    static int collect(Node n, StringBuilder buf) {
        int count = 0;
        if (n.isEnd) { System.out.print(buf + " "); count++; }
        for (int i = 0; i < 26; i++)
            if (n.child[i] != null) {
                buf.append((char) ('a' + i));
                count += collect(n.child[i], buf);
                buf.deleteCharAt(buf.length() - 1);
            }
        return count;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Node root = new Node();
        while (true) {
            System.out.print("\n--- Trie ---\n1. Insert word\n2. Search word\n3. Starts with prefix\n4. Delete word\n5. List all words\n0. Exit\nEnter choice: ");
            if (!sc.hasNextInt()) break;
            int choice = sc.nextInt();
            if (choice == 0) { System.out.println("Goodbye!"); break; }
            String w;
            Node n;
            switch (choice) {
            case 1:
                System.out.print("Enter word: "); w = sc.next();
                if (!validWord(w)) { System.out.println("Invalid input. Use lowercase letters a-z only."); break; }
                if (insert(root, w)) System.out.println(w + " inserted.");
                else System.out.println(w + " already exists.");
                break;
            case 2:
                System.out.print("Enter word: "); w = sc.next();
                if (!validWord(w)) { System.out.println("Invalid input. Use lowercase letters a-z only."); break; }
                n = walk(root, w);
                System.out.println(w + ((n != null && n.isEnd) ? " found." : " not found."));
                break;
            case 3:
                System.out.print("Enter prefix: "); w = sc.next();
                if (!validWord(w)) { System.out.println("Invalid input. Use lowercase letters a-z only."); break; }
                n = walk(root, w);
                if (n == null) { System.out.println("No word starts with " + w + "."); break; }
                System.out.print("Words starting with " + w + ": ");
                collect(n, new StringBuilder(w));
                System.out.println();
                break;
            case 4:
                System.out.print("Enter word: "); w = sc.next();
                if (!validWord(w)) { System.out.println("Invalid input. Use lowercase letters a-z only."); break; }
                n = walk(root, w);
                if (n != null && n.isEnd) { removeWord(root, w, 0); System.out.println(w + " deleted."); }
                else System.out.println(w + " not found.");
                break;
            case 5:
                if (!hasChild(root)) { System.out.println("Trie is empty."); break; }
                System.out.print("Words in lexicographic order: ");
                int total = collect(root, new StringBuilder());
                System.out.println("\nTotal words = " + total);
                break;
            default: System.out.println("Invalid choice.");
            }
        }
    }
}
