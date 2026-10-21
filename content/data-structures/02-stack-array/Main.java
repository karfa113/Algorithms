import java.util.Scanner;

public class Main {
    static final int MAX = 5;          // capacity of the stack
    static int[] stack = new int[MAX];
    static int top = -1;               // index of the top element; -1 means empty

    static boolean isEmpty() { return top == -1; }
    static boolean isFull() { return top == MAX - 1; }

    static void push(int val) {
        if (isFull()) { System.out.println("Stack overflow! Cannot push " + val); return; }
        stack[++top] = val;   // increment top first, then store
        System.out.println("Pushed " + val);
    }

    static void pop() {
        if (isEmpty()) { System.out.println("Stack underflow! Nothing to pop"); return; }
        System.out.println("Popped " + stack[top--]);   // read, then decrement top
    }

    static void peek() {
        if (isEmpty()) { System.out.println("Stack is empty"); return; }
        System.out.println("Top element: " + stack[top]);
    }

    static void display() {
        if (isEmpty()) { System.out.println("Stack is empty"); return; }
        StringBuilder sb = new StringBuilder("Stack (top to bottom):");
        for (int i = top; i >= 0; i--) sb.append(" ").append(stack[i]);
        System.out.println(sb);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (true) {
            System.out.println("\n--- Stack (Array) ---");
            System.out.println("1. Push\n2. Pop\n3. Peek\n4. Check empty/full\n5. Display\n0. Exit");
            System.out.print("Enter choice: ");
            if (!sc.hasNextInt()) break;
            int choice = sc.nextInt();
            if (choice == 0) { System.out.println("Exiting."); break; }
            switch (choice) {
                case 1: System.out.print("Enter value: "); push(sc.nextInt()); break;
                case 2: pop(); break;
                case 3: peek(); break;
                case 4:
                    System.out.println("Stack is empty: " + (isEmpty() ? "yes" : "no"));
                    System.out.println("Stack is full: " + (isFull() ? "yes" : "no"));
                    break;
                case 5: display(); break;
                default: System.out.println("Invalid choice");
            }
        }
    }
}
