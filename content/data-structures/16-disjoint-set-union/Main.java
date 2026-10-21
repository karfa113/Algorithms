import java.util.Scanner;

public class Main {
    static final int MAX = 50;
    static int[] parent = new int[MAX], rnk = new int[MAX];
    static int n = 0;

    // Find the representative of x; compress the path on the way back.
    static int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    // Union by rank: attach the shorter tree under the taller one.
    static boolean unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rnk[ra] < rnk[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rnk[ra] == rnk[rb]) rnk[ra]++;
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice = -1, a, b;
        do {
            System.out.print("\n--- Disjoint Set Union ---\n");
            System.out.print("1. Make sets\n2. Union\n3. Find\n4. Connected?\n5. Display\n0. Exit\n");
            System.out.print("Enter choice: ");
            if (!sc.hasNextInt()) break;
            choice = sc.nextInt();
            if (choice >= 2 && choice <= 5 && n == 0) { System.out.print("Make sets first.\n"); continue; }
            switch (choice) {
                case 1:
                    System.out.print("Enter number of elements: "); a = sc.nextInt();
                    if (a < 1 || a > MAX) { System.out.print("Number of elements must be between 1 and " + MAX + ".\n"); break; }
                    n = a;
                    for (int i = 0; i < n; i++) { parent[i] = i; rnk[i] = 0; }
                    System.out.print("Created " + n + " singleton sets (0 to " + (n - 1) + ").\n");
                    break;
                case 2:
                    System.out.print("Enter two elements: "); a = sc.nextInt(); b = sc.nextInt();
                    if (a < 0 || a >= n || b < 0 || b >= n) { System.out.print("Invalid element. Elements are 0 to " + (n - 1) + ".\n"); break; }
                    if (unite(a, b)) System.out.print("Merged the sets of " + a + " and " + b + ".\n");
                    else System.out.print(a + " and " + b + " are already in the same set.\n");
                    break;
                case 3:
                    System.out.print("Enter element: "); a = sc.nextInt();
                    if (a < 0 || a >= n) { System.out.print("Invalid element. Elements are 0 to " + (n - 1) + ".\n"); break; }
                    System.out.print("Representative of " + a + " is " + find(a) + "\n");
                    break;
                case 4:
                    System.out.print("Enter two elements: "); a = sc.nextInt(); b = sc.nextInt();
                    if (a < 0 || a >= n || b < 0 || b >= n) { System.out.print("Invalid element. Elements are 0 to " + (n - 1) + ".\n"); break; }
                    System.out.print(a + " and " + b + " are " + (find(a) == find(b) ? "connected" : "not connected") + ".\n");
                    break;
                case 5:
                    System.out.print("Element: ");
                    for (int i = 0; i < n; i++) System.out.printf("%3d", i);
                    System.out.print("\nParent : ");
                    for (int i = 0; i < n; i++) System.out.printf("%3d", parent[i]);
                    System.out.print("\nRank   : ");
                    for (int i = 0; i < n; i++) System.out.printf("%3d", rnk[i]);
                    System.out.print("\n");
                    break;
                case 0: System.out.print("Goodbye!\n"); break;
                default: System.out.print("Invalid choice.\n");
            }
        } while (choice != 0);
    }
}
