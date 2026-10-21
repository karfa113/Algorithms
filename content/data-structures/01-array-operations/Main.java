import java.util.Scanner;

public class Main {
    static final int MAX = 10;   // fixed capacity of the array

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] arr = new int[MAX];
        int n = 0;   // number of elements currently stored
        int pos, val;

        while (true) {
            System.out.println("\n--- Array Operations ---");
            System.out.println("1. Insert at position\n2. Delete at position\n3. Traverse");
            System.out.println("4. Linear search\n5. Update\n0. Exit");
            System.out.print("Enter choice: ");
            if (!sc.hasNextInt()) break;
            int choice = sc.nextInt();

            if (choice == 0) {
                System.out.println("Exiting.");
                break;
            } else if (choice == 1) {
                if (n == MAX) { System.out.println("Array is full (overflow)"); continue; }
                System.out.print("Enter position (1-" + (n + 1) + "): ");
                pos = sc.nextInt();
                if (pos < 1 || pos > n + 1) { System.out.println("Invalid position"); continue; }
                System.out.print("Enter value: ");
                val = sc.nextInt();
                // shift elements right, starting from the last one
                for (int i = n; i >= pos; i--) arr[i] = arr[i - 1];
                arr[pos - 1] = val;
                n++;
                System.out.println("Inserted " + val + " at position " + pos);
            } else if (choice == 2) {
                if (n == 0) { System.out.println("Array is empty (underflow)"); continue; }
                System.out.print("Enter position (1-" + n + "): ");
                pos = sc.nextInt();
                if (pos < 1 || pos > n) { System.out.println("Invalid position"); continue; }
                val = arr[pos - 1];
                // shift elements left to close the gap
                for (int i = pos - 1; i < n - 1; i++) arr[i] = arr[i + 1];
                n--;
                System.out.println("Deleted " + val + " from position " + pos);
            } else if (choice == 3) {
                if (n == 0) { System.out.println("Array is empty"); continue; }
                StringBuilder sb = new StringBuilder("Array:");
                for (int i = 0; i < n; i++) sb.append(" ").append(arr[i]);
                System.out.println(sb);
            } else if (choice == 4) {
                System.out.print("Enter value to search: ");
                val = sc.nextInt();
                boolean found = false;
                for (int i = 0; i < n; i++) {
                    if (arr[i] == val) {
                        System.out.println(val + " found at position " + (i + 1));
                        found = true;
                        break;   // first occurrence only
                    }
                }
                if (!found) System.out.println(val + " not found");
            } else if (choice == 5) {
                if (n == 0) { System.out.println("Array is empty"); continue; }
                System.out.print("Enter position (1-" + n + "): ");
                pos = sc.nextInt();
                if (pos < 1 || pos > n) { System.out.println("Invalid position"); continue; }
                System.out.print("Enter new value: ");
                val = sc.nextInt();
                System.out.println("Updated position " + pos + ": " + arr[pos - 1] + " -> " + val);
                arr[pos - 1] = val;
            } else {
                System.out.println("Invalid choice");
            }
        }
    }
}
