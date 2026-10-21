import java.util.*;

public class Main {
    static int n;
    static int[][] graph;
    static int[] path_;

    static boolean isSafe(int v, int pos) {
        if (graph[path_[pos - 1]][v] == 0) return false;
        for (int i = 0; i < pos; i++) if (path_[i] == v) return false;
        return true;
    }

    static boolean hamCycle(int pos) {
        if (pos == n)
            return graph[path_[pos - 1]][path_[0]] == 1;
        for (int v = 1; v < n; v++) {
            if (isSafe(v, pos)) {
                path_[pos] = v;
                if (hamCycle(pos + 1)) return true;
                path_[pos] = -1;   // backtrack
            }
        }
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int e, u, v;
        System.out.print("Vertices: ");
        n = sc.nextInt();
        System.out.print("Edges: ");
        e = sc.nextInt();
        graph = new int[n][n];
        path_ = new int[n];
        Arrays.fill(path_, -1);
        System.out.print("Edges (u v):\n");
        while (e-- > 0) { u = sc.nextInt(); v = sc.nextInt(); graph[u][v] = graph[v][u] = 1; }
        path_[0] = 0;

        if (hamCycle(1)) {
            System.out.print("Hamiltonian Cycle: ");
            for (int i = 0; i < n; i++) System.out.print(path_[i] + " -> ");
            System.out.println(path_[0]);
        } else {
            System.out.println("No Hamiltonian Cycle exists.");
        }
    }
}
