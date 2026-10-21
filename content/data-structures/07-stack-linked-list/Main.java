import java.util.Scanner;

public class Main {
    static class Node {
        int data;
        Node next;
        Node(int v, Node n) { data = v; next = n; }
    }

    static Node top = null;   // top of stack = head of the list

    static boolean isEmpty() { return top == null; }

    static void push(int v) {
        top = new Node(v, top);    // new node points to the old top and becomes top
    }

    // Returns the popped value; caller must check isEmpty() first.
    static int pop() {
        int v = top.data;
        top = top.next;            // the old node is garbage collected
        return v;
    }

    static void display() {
        if (isEmpty()) { System.out.println("Stack is empty"); return; }
        StringBuilder sb = new StringBuilder("Stack (top to bottom): ");
        for (Node c = top; c != null; c = c.next) sb.append(c.data).append(" ");
        System.out.println(sb);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice, v;
        do {
            System.out.println("\n--- Stack using Linked List ---");
            System.out.println("1. Push\n2. Pop\n3. Peek\n4. Display\n5. Is Empty\n0. Exit");
            System.out.print("Enter choice: ");
            if (!sc.hasNextInt()) break;
            choice = sc.nextInt();
            switch (choice) {
                case 1: System.out.print("Enter value: "); v = sc.nextInt(); push(v);
                        System.out.println("Pushed " + v); break;
                case 2: if (!isEmpty()) System.out.println("Popped " + pop());
                        else System.out.println("Stack underflow: stack is empty"); break;
                case 3: if (isEmpty()) System.out.println("Stack is empty");
                        else System.out.println("Top element is " + top.data); break;
                case 4: display(); break;
                case 5: System.out.println(isEmpty() ? "Stack is empty" : "Stack is not empty"); break;
                case 0: System.out.println("Bye!"); break;
                default: System.out.println("Invalid choice");
            }
        } while (choice != 0);
    }
}
