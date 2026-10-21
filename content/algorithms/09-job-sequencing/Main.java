import java.util.Scanner;

public class Main {
    static class Job { char id; int deadline, profit; }

    // Bubble sort by profit, highest first
    static void sortJobs(Job[] j) {
        int n = j.length;
        for (int i = 0; i < n - 1; i++)
            for (int k = 0; k < n - i - 1; k++)
                if (j[k].profit < j[k + 1].profit) {
                    Job t = j[k]; j[k] = j[k + 1]; j[k + 1] = t;
                }
    }

    static void jobSequencing(Job[] jobs) {
        sortJobs(jobs);
        int M = 0;
        for (Job j : jobs) M = Math.max(M, j.deadline);

        char[] slot = new char[M];
        boolean[] used = new boolean[M];
        for (int i = 0; i < M; i++) slot[i] = '-';
        int totalProfit = 0;

        // Place each job in the latest free slot on or before its deadline
        for (Job j : jobs)
            for (int t = Math.min(M, j.deadline) - 1; t >= 0; t--)
                if (!used[t]) { slot[t] = j.id; used[t] = true; totalProfit += j.profit; break; }

        System.out.print("Scheduled: ");
        for (int i = 0; i < M; i++) if (used[i]) System.out.print(slot[i] + " ");
        System.out.print("\nTotal profit = " + totalProfit + "\n");
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Jobs: ");
        int n = sc.nextInt();
        Job[] jobs = new Job[n];
        System.out.print("id deadline profit:\n");
        for (int i = 0; i < n; i++) {
            jobs[i] = new Job();
            jobs[i].id = sc.next().charAt(0);
            jobs[i].deadline = sc.nextInt();
            jobs[i].profit = sc.nextInt();
        }
        jobSequencing(jobs);
    }
}
