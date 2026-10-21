import java.util.Scanner;

public class Main {
    static class Node {
        int data;
        Node prev, next;
        Node(int v) { data = v; }
    }

    static Node head = null, tail = null;
    static int count = 0;

    static void insertBegin(int val) {
        Node n = new Node(val);
        n.next = head;
        if (head != null) head.prev = n; else tail = n;
        head = n;
        count++;
        System.out.println("Inserted " + val + " at beginning");
    }

    static void insertEnd(int val) {
        Node n = new Node(val);
        n.prev = tail;
        if (tail != null) tail.next = n; else head = n;
        tail = n;
        count++;
        System.out.println("Inserted " + val + " at end");
    }

    static void insertPos(int val, int pos) {
        if (pos < 1 || pos > count + 1) { System.out.println("Invalid position"); return; }
        if (pos == 1) { insertBegin(val); return; }
        if (pos == count + 1) { insertEnd(val); return; }
        Node p = head;
        for (int i = 1; i < pos - 1; i++) p = p.next;   // node before pos
        Node n = new Node(val);
        n.next = p.next;
        n.prev = p;
        p.next.prev = n;
        p.next = n;
        count++;
        System.out.println("Inserted " + val + " at position " + pos);
    }

    // unlink a node from both neighbours (garbage collector frees it)
    static void removeNode(Node cur) {
        if (cur.prev != null) cur.prev.next = cur.next; else head = cur.next;
        if (cur.next != null) cur.next.prev = cur.prev; else tail = cur.prev;
        count--;
    }

    static void deleteValue(int val) {
        Node cur = head;
        while (cur != null && cur.data != val) cur = cur.next;
        if (cur == null) { System.out.println(val + " not found"); return; }
        removeNode(cur);
        System.out.println("Deleted " + val);
    }

    static void deletePos(int pos) {
        if (head == null) { System.out.println("List is empty (underflow)"); return; }
        if (pos < 1 || pos > count) { System.out.println("Invalid position"); return; }
        Node cur = head;
        for (int i = 1; i < pos; i++) cur = cur.next;
        int v = cur.data;
        removeNode(cur);
        System.out.println("Deleted " + v + " from position " + pos);
    }

    static void search(int val) {
        int pos = 1;
        for (Node p = head; p != null; p = p.next, pos++) {
            if (p.data == val) { System.out.println(val + " found at position " + pos); return; }
        }
        System.out.println(val + " not found");
    }

    static void displayForward() {
        if (head == null) { System.out.println("List is empty"); return; }
        StringBuilder sb = new StringBuilder("Forward: NULL <-> ");
        for (Node p = head; p != null; p = p.next) sb.append(p.data).append(" <-> ");
        System.out.println(sb.append("NULL"));
    }

    static void displayBackward() {
        if (tail == null) { System.out.println("List is empty"); return; }
        StringBuilder sb = new StringBuilder("Backward: NULL <-> ");
        for (Node p = tail; p != null; p = p.prev) sb.append(p.data).append(" <-> ");
        System.out.println(sb.append("NULL"));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (true) {
            System.out.println("\n--- Doubly Linked List ---");
            System.out.println("1. Insert at beginning\n2. Insert at end\n3. Insert at position");
            System.out.println("4. Delete by value\n5. Delete by position\n6. Search");
            System.out.println("7. Display forward\n8. Display backward\n0. Exit");
            System.out.print("Enter choice: ");
            if (!sc.hasNextInt()) break;
            int choice = sc.nextInt();
            if (choice == 0) break;
            int val, pos;
            switch (choice) {
                case 1: System.out.print("Enter value: "); val = sc.nextInt(); insertBegin(val); break;
                case 2: System.out.print("Enter value: "); val = sc.nextInt(); insertEnd(val); break;
                case 3:
                    System.out.print("Enter position (1-" + (count + 1) + "): "); pos = sc.nextInt();
                    System.out.print("Enter value: "); val = sc.nextInt();
                    insertPos(val, pos); break;
                case 4: System.out.print("Enter value to delete: "); val = sc.nextInt(); deleteValue(val); break;
                case 5:
                    System.out.print("Enter position (1-" + count + "): "); pos = sc.nextInt();
                    deletePos(pos); break;
                case 6: System.out.print("Enter value to search: "); val = sc.nextInt(); search(val); break;
                case 7: displayForward(); break;
                case 8: displayBackward(); break;
                default: System.out.println("Invalid choice");
            }
        }
        System.out.println("Exiting.");
    }
}
