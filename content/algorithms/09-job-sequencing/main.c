#include <stdio.h>

struct Job { char id; int deadline, profit; };

// Bubble sort by profit, highest first
void sortJobs(struct Job j[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int k = 0; k < n - i - 1; k++)
            if (j[k].profit < j[k+1].profit) {
                struct Job t = j[k]; j[k] = j[k+1]; j[k+1] = t;
            }
}

void jobSequencing(struct Job jobs[], int n) {
    sortJobs(jobs, n);
    int M = 0;
    for (int i = 0; i < n; i++) if (jobs[i].deadline > M) M = jobs[i].deadline;

    char slot[M > 0 ? M : 1];
    int used[M > 0 ? M : 1];
    for (int i = 0; i < M; i++) { slot[i] = '-'; used[i] = 0; }
    int totalProfit = 0;

    // Place each job in the latest free slot on or before its deadline
    for (int i = 0; i < n; i++) {
        int t = (M < jobs[i].deadline ? M : jobs[i].deadline) - 1;
        for (; t >= 0; t--)
            if (!used[t]) { slot[t] = jobs[i].id; used[t] = 1; totalProfit += jobs[i].profit; break; }
    }

    printf("Scheduled: ");
    for (int i = 0; i < M; i++) if (used[i]) printf("%c ", slot[i]);
    printf("\nTotal profit = %d\n", totalProfit);
}

int main() {
    int n;
    printf("Jobs: "); scanf("%d", &n);
    struct Job jobs[n];
    printf("id deadline profit:\n");
    for (int i = 0; i < n; i++)
        scanf(" %c %d %d", &jobs[i].id, &jobs[i].deadline, &jobs[i].profit);
    jobSequencing(jobs, n);
    return 0;
}
