import java.util.Scanner;

public class Main {
    static final int MAX = 100;
    static int[] heap = new int[MAX];
    static int size = 0;

    static void swap(int a, int b) { int t = heap[a]; heap[a] = heap[b]; heap[b] = t; }

    // Move the element at index i up until its parent is not larger.
    static void heapifyUp(int i) {
        while (i > 0 && heap[(i - 1) / 2] > heap[i]) {
            swap((i - 1) / 2, i);
            i = (i - 1) / 2;
        }
    }

    // Move the element at index i down until both children are not smaller.
    static void heapifyDown(int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
            if (l < size && heap[l] < heap[smallest]) smallest = l;
            if (r < size && heap[r] < heap[smallest]) smallest = r;
            if (smallest == i) break;
            swap(i, smallest);
            i = smallest;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = -1, v;
        do {
            System.out.print("\n--- Priority Queue (Min Heap) ---\n");
            System.out.print("1. Insert\n2. Extract Min\n3. Peek\n4. Display\n0. Exit\n");
            System.out.print("Enter choice: ");
            if (!sc.hasNextInt()) break;
            choice = sc.nextInt();
            switch (choice) {
                case 1:
                    if (size == MAX) { System.out.print("Heap is full\n"); break; }
                    System.out.print("Enter value: "); v = sc.nextInt();
                    heap[size++] = v;
                    heapifyUp(size - 1);
                    System.out.print("Inserted " + v + "\n");
                    break;
                case 2:
                    if (size == 0) { System.out.print("Heap is empty\n"); break; }
                    v = heap[0];
                    heap[0] = heap[--size];     // move last element to the root
                    heapifyDown(0);
                    System.out.print("Extracted " + v + "\n");
                    break;
                case 3:
                    if (size == 0) System.out.print("Heap is empty\n");
                    else System.out.print("Minimum = " + heap[0] + "\n");
                    break;
                case 4:
                    if (size == 0) { System.out.print("Heap is empty\n"); break; }
                    System.out.print("Heap array: ");
                    for (int i = 0; i < size; i++) System.out.print(heap[i] + " ");
                    System.out.print("\n");
                    break;
                case 0: System.out.print("Goodbye!\n"); break;
                default: System.out.print("Invalid choice.\n");
            }
        } while (choice != 0);
    }
}
