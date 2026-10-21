#include <iostream>
#include <vector>
using namespace std;

struct Job { char id; int deadline, profit; };

void sortJobs(vector<Job>& j) {
    int n = j.size();
    for (int i = 0; i < n - 1; i++)
        for (int k = 0; k < n - i - 1; k++)
            if (j[k].profit < j[k+1].profit) swap(j[k], j[k+1]);
}

void jobSequencing(vector<Job> jobs) {
    sortJobs(jobs);
    int M = 0;
    for (auto& j : jobs) M = max(M, j.deadline);

    vector<char> slot(M, '-');
    vector<bool> used(M, false);
    int totalProfit = 0;

    for (auto& j : jobs)
        for (int t = min(M, j.deadline) - 1; t >= 0; t--)
            if (!used[t]) { slot[t] = j.id; used[t] = true; totalProfit += j.profit; break; }

    cout << "Scheduled: ";
    for (int i = 0; i < M; i++) if (used[i]) cout << slot[i] << " ";
    cout << "\nTotal profit = " << totalProfit << endl;
}

int main() {
    int n; cout << "Jobs: "; cin >> n;
    vector<Job> jobs(n);
    cout << "id deadline profit:\n";
    for (auto& j : jobs) cin >> j.id >> j.deadline >> j.profit;
    jobSequencing(jobs);
    return 0;
}
