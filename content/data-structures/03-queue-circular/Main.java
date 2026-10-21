import java.util.Scanner;

public class Main {
    static final int MAX = 5;            // capacity of the circular queue
    static int[] queue = new int[MAX];
    static int front = 0;                // index of the first element
    static int count = 0;                // number of elements; distinguishes full from empty

    static boolean isEmpty() { return count == 0; }
    static boolean isFull() { return count == MAX; }

    static void enqueue(int val) {
        if (isFull()) { System.out.println("Queue overflow! Cannot enqueue " + val); return; }
        int rear = (front + count) % MAX;   // next free slot, wraps around
        queue[rear] = val;
        count++;
        System.out.println("Enqueued " + val);
    }

    static void dequeue() {
        if (isEmpty()) { System.out.println("Queue underflow! Nothing to dequeue"); return; }
        System.out.println("Dequeued " + queue[front]);
        front = (front + 1) % MAX;   // move front forward, wrapping
        count--;
    }

    static void showFront() {
        if (isEmpty()) { System.out.println("Queue is empty"); return; }
        System.out.println("Front element: " + queue[front]);
    }

    static void display() {
        if (isEmpty()) { System.out.println("Queue is empty"); return; }
        StringBuilder sb = new StringBuilder("Queue (front to rear):");
        for (int i = 0; i < count; i++) sb.append(" ").append(queue[(front + i) % MAX]);
        System.out.println(sb);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (true) {
            System.out.println("\n--- Circular Queue ---");
            System.out.println("1. Enqueue\n2. Dequeue\n3. Front\n4. Check empty/full\n5. Display\n0. Exit");
            System.out.print("Enter choice: ");
            if (!sc.hasNextInt()) break;
            int choice = sc.nextInt();
            if (choice == 0) { System.out.println("Exiting."); break; }
            switch (choice) {
                case 1: System.out.print("Enter value: "); enqueue(sc.nextInt()); break;
                case 2: dequeue(); break;
                case 3: showFront(); break;
                case 4:
                    System.out.println("Queue is empty: " + (isEmpty() ? "yes" : "no"));
                    System.out.println("Queue is full: " + (isFull() ? "yes" : "no"));
                    break;
                case 5: display(); break;
                default: System.out.println("Invalid choice");
            }
        }
    }
}
