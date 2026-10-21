import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    static final int MAX = 50;

    static int n = 0;
    static boolean directed = false, created = false;
    static int[][] matrix;                     // adjacency matrix
    static ArrayList<ArrayList<Integer>> adj;  // adjacency list: one list per vertex

    static String arrow() { return directed ? "->" : "-"; }

    static void addEdge(int u, int v) {
        if (u < 0 || u >= n || v < 0 || v >= n) { System.out.println("Invalid vertex. Vertices are 0 to " + (n - 1) + "."); return; }
        if (u == v) { System.out.println("Self loops are not allowed."); return; }
        if (matrix[u][v] == 1) { System.out.println("Edge " + u + " " + arrow() + " " + v + " already exists."); return; }
        matrix[u][v] = 1;
        adj.get(u).add(v);
        if (!directed) { matrix[v][u] = 1; adj.get(v).add(u); }
        System.out.println("Edge " + u + " " + arrow() + " " + v + " added.");
    }

    static void showMatrix() {
        System.out.println("Adjacency matrix:");
        StringBuilder sb = new StringBuilder("    ");
        for (int j = 0; j < n; j++) sb.append(String.format("%3d", j));
        System.out.println(sb);
        for (int i = 0; i < n; i++) {
            sb = new StringBuilder(String.format("%3d:", i));
            for (int j = 0; j < n; j++) sb.append(String.format("%3d", matrix[i][j]));
            System.out.println(sb);
        }
    }

    static void showList() {
        System.out.println("Adjacency list:");
        for (int i = 0; i < n; i++) {
            StringBuilder sb = new StringBuilder(String.valueOf(i));
            for (int v : adj.get(i)) sb.append(" -> ").append(v);
            System.out.println(sb.append(" -> NULL"));
        }
    }

    static void showDegrees() {
        for (int i = 0; i < n; i++) {
            int out = 0, in = 0;
            for (int j = 0; j < n; j++) { out += matrix[i][j]; in += matrix[j][i]; }
            if (directed) System.out.println("Vertex " + i + ": in-degree = " + in + ", out-degree = " + out + ", total = " + (in + out));
            else System.out.println("Vertex " + i + ": degree = " + out);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        while (true) {
            System.out.print("\n--- Graph Representation ---\n1. Create graph\n2. Add edge\n3. Display adjacency matrix\n4. Display adjacency list\n5. Degree of vertices\n6. Check if edge exists\n0. Exit\nEnter choice: ");
            if (!sc.hasNextInt()) break;
            int choice = sc.nextInt();
            if (choice == 0) { System.out.println("Goodbye!"); break; }
            if (choice >= 2 && choice <= 6 && !created) { System.out.println("Create a graph first."); continue; }
            int u, v;
            switch (choice) {
            case 1:
                System.out.print("Enter number of vertices: "); v = sc.nextInt();
                if (v < 1 || v > MAX) { System.out.println("Number of vertices must be between 1 and " + MAX + "."); break; }
                System.out.print("Enter graph type (1 = Directed, 2 = Undirected): "); u = sc.nextInt();
                if (u != 1 && u != 2) { System.out.println("Invalid graph type."); break; }
                n = v; directed = (u == 1); created = true;
                matrix = new int[n][n];
                adj = new ArrayList<>();
                for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
                System.out.print("Enter number of edges: "); int e = sc.nextInt();
                for (int i = 0; i < e; i++) {
                    System.out.print("Enter edge " + (i + 1) + " (u v): ");
                    u = sc.nextInt(); v = sc.nextInt();
                    addEdge(u, v);
                }
                System.out.println((directed ? "Directed" : "Undirected") + " graph with " + n + " vertices created.");
                break;
            case 2:
                System.out.print("Enter edge (u v): "); u = sc.nextInt(); v = sc.nextInt();
                addEdge(u, v); break;
            case 3: showMatrix(); break;
            case 4: showList(); break;
            case 5: showDegrees(); break;
            case 6:
                System.out.print("Enter edge (u v): "); u = sc.nextInt(); v = sc.nextInt();
                if (u < 0 || u >= n || v < 0 || v >= n) { System.out.println("Invalid vertex. Vertices are 0 to " + (n - 1) + "."); break; }
                System.out.println("Edge " + u + " " + arrow() + " " + v + (matrix[u][v] == 1 ? " exists." : " does not exist."));
                break;
            default: System.out.println("Invalid choice.");
            }
        }
    }
}
