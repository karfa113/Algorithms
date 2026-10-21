import java.util.Scanner;

public class Main {
    static class Node {
        int data;
        Node next;
        Node(int v) { data = v; next = null; }
    }

    static Node front = null, rear = null;   // dequeue at front, enqueue at rear

    static boolean isEmpty() { return front == null; }

    static void enqueue(int v) {
        Node n = new Node(v);
        if (rear == null) front = rear = n;   // first element
        else { rear.next = n; rear = n; }
    }

    // Returns the removed value; caller must check isEmpty() first.
    static int dequeue() {
        int v = front.data;
        front = front.next;
        if (front == null) rear = null;       // queue became empty
        return v;
    }

    static void display() {
        if (isEmpty()) { System.out.println("Queue is empty"); return; }
        StringBuilder sb = new StringBuilder("Queue (front to rear): ");
        for (Node c = front; c != null; c = c.next) sb.append(c.data).append(" ");
        System.out.println(sb);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice, v;
        do {
            System.out.println("\n--- Queue using Linked List ---");
            System.out.println("1. Enqueue\n2. Dequeue\n3. Front\n4. Display\n5. Is Empty\n0. Exit");
            System.out.print("Enter choice: ");
            if (!sc.hasNextInt()) break;
            choice = sc.nextInt();
            switch (choice) {
                case 1: System.out.print("Enter value: "); v = sc.nextInt(); enqueue(v);
                        System.out.println("Enqueued " + v); break;
                case 2: if (!isEmpty()) System.out.println("Dequeued " + dequeue());
                        else System.out.println("Queue underflow: queue is empty"); break;
                case 3: if (isEmpty()) System.out.println("Queue is empty");
                        else System.out.println("Front element is " + front.data); break;
                case 4: display(); break;
                case 5: System.out.println(isEmpty() ? "Queue is empty" : "Queue is not empty"); break;
                case 0: System.out.println("Bye!"); break;
                default: System.out.println("Invalid choice");
            }
        } while (choice != 0);
    }
}
