import java.util.Scanner;

public class Main {
    static final int SIZE = 10;
    static final int EMPTY = 0, OCCUPIED = 1, DELETED = 2;   // slot states for linear probing

    static class Node {
        int key; Node next;
        Node(int k) { key = k; }
    }

    static int mode;                                  // 1 = chaining, 2 = linear probing
    static Node[] bucket = new Node[SIZE];            // used by chaining
    static int[] slot = new int[SIZE], state = new int[SIZE];   // used by linear probing

    static int hash(int k) { return ((k % SIZE) + SIZE) % SIZE; }   // safe for negatives

    // ---- chaining ----
    static void insertChain(int k) {
        int h = hash(k);
        Node p = bucket[h], last = null;
        for (; p != null; last = p, p = p.next)
            if (p.key == k) { System.out.println(k + " already exists. Duplicates are not allowed."); return; }
        Node n = new Node(k);
        if (last != null) last.next = n; else bucket[h] = n;     // append at tail
        System.out.println("Inserted " + k + " in bucket " + h + ".");
    }
    static void searchChain(int k) {
        int h = hash(k);
        for (Node p = bucket[h]; p != null; p = p.next)
            if (p.key == k) { System.out.println("Found " + k + " in bucket " + h + "."); return; }
        System.out.println(k + " not found.");
    }
    static void deleteChain(int k) {
        int h = hash(k);
        Node p = bucket[h], prev = null;
        for (; p != null; prev = p, p = p.next)
            if (p.key == k) {
                if (prev != null) prev.next = p.next; else bucket[h] = p.next;
                System.out.println("Deleted " + k + " from bucket " + h + ".");
                return;
            }
        System.out.println(k + " not found.");
    }
    static void displayChain() {
        for (int i = 0; i < SIZE; i++) {
            System.out.print("[" + i + "] ");
            if (bucket[i] == null) System.out.print("-");
            for (Node p = bucket[i]; p != null; p = p.next) System.out.print(p.key + (p.next != null ? " -> " : ""));
            System.out.println();
        }
    }

    // ---- linear probing ----
    static int findProbe(int k) {                     // index of k, or -1
        int h = hash(k);
        for (int i = 0; i < SIZE; i++) {
            int p = (h + i) % SIZE;
            if (state[p] == EMPTY) return -1;         // chain of probes ends here
            if (state[p] == OCCUPIED && slot[p] == k) return p;
        }
        return -1;
    }
    static void insertProbe(int k) {
        if (findProbe(k) >= 0) { System.out.println(k + " already exists. Duplicates are not allowed."); return; }
        int h = hash(k);
        for (int i = 0; i < SIZE; i++) {
            int p = (h + i) % SIZE;
            if (state[p] != OCCUPIED) {               // EMPTY or DELETED slot is reusable
                slot[p] = k; state[p] = OCCUPIED;
                System.out.println("Inserted " + k + " at index " + p + ".");
                return;
            }
        }
        System.out.println("Table is full. Cannot insert " + k + ".");
    }
    static void searchProbe(int k) {
        int p = findProbe(k);
        if (p >= 0) System.out.println("Found " + k + " at index " + p + "."); else System.out.println(k + " not found.");
    }
    static void deleteProbe(int k) {
        int p = findProbe(k);
        if (p < 0) { System.out.println(k + " not found."); return; }
        state[p] = DELETED;                           // tombstone keeps probe chains intact
        System.out.println("Deleted " + k + " from index " + p + ".");
    }
    static void displayProbe() {
        for (int i = 0; i < SIZE; i++) {
            if (state[i] == OCCUPIED) System.out.println("[" + i + "] " + slot[i]);
            else if (state[i] == DELETED) System.out.println("[" + i + "] <deleted>");
            else System.out.println("[" + i + "] -");
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Collision handling:\n1. Chaining\n2. Linear probing\nEnter choice: ");
        if (!sc.hasNextInt()) return;
        mode = sc.nextInt();
        if (mode != 1 && mode != 2) mode = 1;
        System.out.println("Using " + (mode == 1 ? "chaining" : "linear probing") + " (table size " + SIZE + ", h(k) = k mod " + SIZE + ").");
        int k = 0;
        while (true) {
            System.out.print("\n--- Hash Table ---\n1. Insert\n2. Search\n3. Delete\n4. Display\n0. Exit\nEnter choice: ");
            if (!sc.hasNextInt()) break;
            int choice = sc.nextInt();
            if (choice == 0) { System.out.println("Goodbye!"); break; }
            if (choice >= 1 && choice <= 3) { System.out.print("Enter key: "); k = sc.nextInt(); }
            switch (choice) {
            case 1: if (mode == 1) insertChain(k); else insertProbe(k); break;
            case 2: if (mode == 1) searchChain(k); else searchProbe(k); break;
            case 3: if (mode == 1) deleteChain(k); else deleteProbe(k); break;
            case 4: if (mode == 1) displayChain(); else displayProbe(); break;
            default: System.out.println("Invalid choice.");
            }
        }
    }
}
