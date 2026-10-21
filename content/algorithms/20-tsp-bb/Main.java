import java.util.*;

public class Main {
    static int n;
    static int[][] cost_;
    static int[] finalPath;
    static boolean[] visited;
    static int finalRes = Integer.MAX_VALUE;

    static void copyToFinal(int[] currPath) {
        for (int i = 0; i < n; i++) finalPath[i] = currPath[i];
        finalPath[n] = currPath[0];
    }

    static int firstMin(int i) {
        int mn = Integer.MAX_VALUE;
        for (int k = 0; k < n; k++)
            if (cost_[i][k] < mn && i != k) mn = cost_[i][k];
        return mn;
    }

    static int secondMin(int i) {
        int first = Integer.MAX_VALUE, second = Integer.MAX_VALUE;
        for (int j = 0; j < n; j++) {
            if (i == j) continue;
            if (cost_[i][j] <= first) { second = first; first = cost_[i][j]; }
            else if (cost_[i][j] <= second && cost_[i][j] != first) second = cost_[i][j];
        }
        return second;
    }

    static void TSPRec(int currBound, int currWeight, int level, int[] currPath) {
        if (level == n) {
            if (cost_[currPath[level - 1]][currPath[0]] != 0) {
                int currRes = currWeight + cost_[currPath[level - 1]][currPath[0]];
                if (currRes < finalRes) {
                    copyToFinal(currPath);
                    finalRes = currRes;
                }
            }
            return;
        }
        for (int i = 0; i < n; i++) {
            if (cost_[currPath[level - 1]][i] != 0 && !visited[i]) {
                int temp = currBound;
                currWeight += cost_[currPath[level - 1]][i];

                if (level == 1)
                    currBound -= ((firstMin(currPath[level - 1]) + firstMin(i)) / 2);
                else
                    currBound -= ((secondMin(currPath[level - 1]) + firstMin(i)) / 2);

                if (currBound + currWeight < finalRes) {
                    currPath[level] = i;
                    visited[i] = true;
                    TSPRec(currBound, currWeight, level + 1, currPath);
                }
                // backtrack
                currWeight -= cost_[currPath[level - 1]][i];
                currBound = temp;
                Arrays.fill(visited, false);
                for (int j = 0; j <= level - 1; j++) visited[currPath[j]] = true;
            }
        }
    }

    static void TSP() {
        int[] currPath = new int[n + 1];
        Arrays.fill(currPath, -1);
        visited = new boolean[n];
        finalPath = new int[n + 1];
        Arrays.fill(finalPath, -1);

        int currBound = 0;
        for (int i = 0; i < n; i++) currBound += (firstMin(i) + secondMin(i));
        currBound = ((currBound & 1) != 0) ? currBound / 2 + 1 : currBound / 2;

        visited[0] = true;
        currPath[0] = 0;
        TSPRec(currBound, 0, 1, currPath);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Number of cities: ");
        n = sc.nextInt();
        cost_ = new int[n][n];
        System.out.print("Cost matrix (0 if no edge):\n");
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) cost_[i][j] = sc.nextInt();

        TSP();
        System.out.println("Minimum cost = " + finalRes);
        System.out.print("Path: ");
        for (int x : finalPath) System.out.print(x + " ");
        System.out.println();
    }
}
