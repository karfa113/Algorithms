import java.util.Scanner;

public class Main {
    static class Node {
        int data;
        Node next;
        Node(int v) { data = v; next = this; }   // a lone node points to itself
    }

    // Only the tail is stored; tail.next is the head.
    static Node tail = null;

    static void insertBegin(int v) {
        Node n = new Node(v);
        if (tail == null) tail = n;
        else { n.next = tail.next; tail.next = n; }   // tail stays the same
    }

    static void insertEnd(int v) {
        insertBegin(v);
        tail = tail.next;                  // the new node becomes the tail
    }

    static int deleteValue(int v) {
        if (tail == null) return -1;                 // empty
        Node prev = tail, cur = tail.next;           // cur starts at head
        do {
            if (cur.data == v) {
                if (cur == prev) tail = null;        // only node
                else {
                    prev.next = cur.next;
                    if (cur == tail) tail = prev;    // removed the tail
                }
                return 1;                            // GC frees the node
            }
            prev = cur; cur = cur.next;
        } while (prev != tail);                      // one full lap
        return 0;
    }

    static int search(int v) {
        if (tail == null) return -1;
        Node cur = tail.next;
        int pos = 1;
        do {
            if (cur.data == v) return pos;
            cur = cur.next; pos++;
        } while (cur != tail.next);
        return 0;
    }

    static void display() {
        if (tail == null) { System.out.println("List is empty"); return; }
        Node cur = tail.next;
        StringBuilder sb = new StringBuilder("List: ");
        do {
            sb.append(cur.data).append(" -> ");
            cur = cur.next;
        } while (cur != tail.next);
        sb.append("(back to ").append(tail.next.data).append(")");
        System.out.println(sb);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice, v;
        do {
            System.out.println("\n--- Circular Linked List ---");
            System.out.println("1. Insert at beginning\n2. Insert at end\n3. Delete a value");
            System.out.println("4. Search\n5. Display\n0. Exit");
            System.out.print("Enter choice: ");
            if (!sc.hasNextInt()) break;
            choice = sc.nextInt();
            switch (choice) {
                case 1: System.out.print("Enter value: "); v = sc.nextInt(); insertBegin(v);
                        System.out.println("Inserted " + v + " at beginning"); break;
                case 2: System.out.print("Enter value: "); v = sc.nextInt(); insertEnd(v);
                        System.out.println("Inserted " + v + " at end"); break;
                case 3: { System.out.print("Enter value: "); v = sc.nextInt();
                          int r = deleteValue(v);
                          if (r == -1) System.out.println("List is empty (underflow)");
                          else if (r == 0) System.out.println(v + " not found");
                          else System.out.println("Deleted " + v); }
                        break;
                case 4: { System.out.print("Enter value: "); v = sc.nextInt();
                          int p = search(v);
                          if (p == -1) System.out.println("List is empty");
                          else if (p == 0) System.out.println(v + " not found");
                          else System.out.println(v + " found at position " + p); }
                        break;
                case 5: display(); break;
                case 0: System.out.println("Bye!"); break;
                default: System.out.println("Invalid choice");
            }
        } while (choice != 0);
    }
}
