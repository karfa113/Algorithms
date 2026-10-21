import java.util.Scanner;

public class Main {
    static class Node {
        int data;
        Node next;
        Node(int v) { data = v; }
    }

    static Node head = null;

    static int length() {
        int c = 0;
        for (Node p = head; p != null; p = p.next) c++;
        return c;
    }

    static void insertBegin(int val) {
        Node n = new Node(val);
        n.next = head;   // new node points to the old first node
        head = n;
        System.out.println("Inserted " + val + " at beginning");
    }

    static void insertEnd(int val) {
        Node n = new Node(val);
        if (head == null) head = n;
        else {
            Node p = head;
            while (p.next != null) p = p.next;   // walk to the last node
            p.next = n;
        }
        System.out.println("Inserted " + val + " at end");
    }

    static void insertPos(int val, int pos) {
        if (pos < 1 || pos > length() + 1) { System.out.println("Invalid position"); return; }
        if (pos == 1) { insertBegin(val); return; }
        Node p = head;
        for (int i = 1; i < pos - 1; i++) p = p.next;   // stop at node before pos
        Node n = new Node(val);
        n.next = p.next;
        p.next = n;
        System.out.println("Inserted " + val + " at position " + pos);
    }

    static void deleteValue(int val) {
        Node prev = null, cur = head;
        while (cur != null && cur.data != val) { prev = cur; cur = cur.next; }
        if (cur == null) { System.out.println(val + " not found"); return; }
        if (prev != null) prev.next = cur.next; else head = cur.next;
        System.out.println("Deleted " + val);   // garbage collector frees the node
    }

    static void deletePos(int pos) {
        if (head == null) { System.out.println("List is empty (underflow)"); return; }
        if (pos < 1 || pos > length()) { System.out.println("Invalid position"); return; }
        Node cur = head, prev = null;
        for (int i = 1; i < pos; i++) { prev = cur; cur = cur.next; }
        if (prev != null) prev.next = cur.next; else head = cur.next;
        System.out.println("Deleted " + cur.data + " from position " + pos);
    }

    static void search(int val) {
        int pos = 1;
        for (Node p = head; p != null; p = p.next, pos++) {
            if (p.data == val) { System.out.println(val + " found at position " + pos); return; }
        }
        System.out.println(val + " not found");
    }

    static void reverse() {
        if (head == null) { System.out.println("List is empty"); return; }
        Node prev = null, cur = head, next;
        while (cur != null) {
            next = cur.next;   // remember the rest of the list
            cur.next = prev;   // flip the link
            prev = cur;
            cur = next;
        }
        head = prev;
        System.out.println("List reversed");
    }

    static void display() {
        if (head == null) { System.out.println("List is empty"); return; }
        StringBuilder sb = new StringBuilder("List: ");
        for (Node p = head; p != null; p = p.next) sb.append(p.data).append(" -> ");
        System.out.println(sb.append("NULL"));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int val, pos;
        while (true) {
            System.out.println("\n--- Singly Linked List ---");
            System.out.println("1. Insert at beginning\n2. Insert at end\n3. Insert at position");
            System.out.println("4. Delete by value\n5. Delete by position\n6. Search\n7. Reverse\n8. Display\n0. Exit");
            System.out.print("Enter choice: ");
            if (!sc.hasNextInt()) break;
            int choice = sc.nextInt();
            if (choice == 0) break;
            switch (choice) {
                case 1: System.out.print("Enter value: "); insertBegin(sc.nextInt()); break;
                case 2: System.out.print("Enter value: "); insertEnd(sc.nextInt()); break;
                case 3:
                    System.out.print("Enter position (1-" + (length() + 1) + "): "); pos = sc.nextInt();
                    System.out.print("Enter value: "); val = sc.nextInt();
                    insertPos(val, pos); break;
                case 4: System.out.print("Enter value to delete: "); deleteValue(sc.nextInt()); break;
                case 5:
                    System.out.print("Enter position (1-" + length() + "): "); pos = sc.nextInt();
                    deletePos(pos); break;
                case 6: System.out.print("Enter value to search: "); search(sc.nextInt()); break;
                case 7: reverse(); break;
                case 8: display(); break;
                default: System.out.println("Invalid choice");
            }
        }
        System.out.println("Exiting.");
    }
}
