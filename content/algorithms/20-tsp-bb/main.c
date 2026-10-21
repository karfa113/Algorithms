#include <stdio.h>
#include <limits.h>
#define N 20

int n;
int cost[N][N];
int finalPath[N + 1];
int visited[N];
int finalRes = INT_MAX;

void copyToFinal(int currPath[]) {
    for (int i = 0; i < n; i++) finalPath[i] = currPath[i];
    finalPath[n] = currPath[0];
}

int firstMin(int i) {
    int min = INT_MAX;
    for (int k = 0; k < n; k++)
        if (cost[i][k] < min && i != k) min = cost[i][k];
    return min;
}

int secondMin(int i) {
    int first = INT_MAX, second = INT_MAX;
    for (int j = 0; j < n; j++) {
        if (i == j) continue;
        if (cost[i][j] <= first) { second = first; first = cost[i][j]; }
        else if (cost[i][j] <= second && cost[i][j] != first) second = cost[i][j];
    }
    return second;
}

void TSPRec(int currBound, int currWeight, int level, int currPath[]) {
    if (level == n) {
        if (cost[currPath[level - 1]][currPath[0]] != 0) {
            int currRes = currWeight + cost[currPath[level - 1]][currPath[0]];
            if (currRes < finalRes) {
                copyToFinal(currPath);
                finalRes = currRes;
            }
        }
        return;
    }
    for (int i = 0; i < n; i++) {
        if (cost[currPath[level - 1]][i] != 0 && !visited[i]) {
            int temp = currBound;
            currWeight += cost[currPath[level - 1]][i];

            if (level == 1)
                currBound -= ((firstMin(currPath[level - 1]) + firstMin(i)) / 2);
            else
                currBound -= ((secondMin(currPath[level - 1]) + firstMin(i)) / 2);

            if (currBound + currWeight < finalRes) {
                currPath[level] = i;
                visited[i] = 1;
                TSPRec(currBound, currWeight, level + 1, currPath);
            }
            /* backtrack */
            currWeight -= cost[currPath[level - 1]][i];
            currBound = temp;
            for (int j = 0; j < n; j++) visited[j] = 0;
            for (int j = 0; j <= level - 1; j++) visited[currPath[j]] = 1;
        }
    }
}

void TSP(void) {
    int currPath[N + 1];
    int currBound = 0;
    for (int i = 0; i <= n; i++) currPath[i] = -1;
    for (int i = 0; i < n; i++) visited[i] = 0;

    for (int i = 0; i < n; i++)
        currBound += (firstMin(i) + secondMin(i));
    currBound = (currBound & 1) ? currBound / 2 + 1 : currBound / 2;

    visited[0] = 1;
    currPath[0] = 0;
    TSPRec(currBound, 0, 1, currPath);
}

int main(void) {
    printf("Number of cities: "); scanf("%d", &n);
    printf("Cost matrix (0 if no edge):\n");
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) scanf("%d", &cost[i][j]);

    TSP();
    printf("Minimum cost = %d\n", finalRes);
    printf("Path: ");
    for (int i = 0; i <= n; i++) printf("%d ", finalPath[i]);
    printf("\n");
    return 0;
}
