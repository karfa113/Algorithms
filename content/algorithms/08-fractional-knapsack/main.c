#include <stdio.h>

struct Item { double weight, value, ratio; };

// Bubble sort by value/weight ratio, highest first
void sortByRatio(struct Item a[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (a[j].ratio < a[j+1].ratio) {
                struct Item t = a[j]; a[j] = a[j+1]; a[j+1] = t;
            }
}

double fractionalKnapsack(struct Item items[], int n, double W) {
    sortByRatio(items, n);
    double total = 0;
    for (int i = 0; i < n; i++) {
        if (W <= 0) break;
        if (items[i].weight <= W) { total += items[i].value; W -= items[i].weight; }
        else                      { total += items[i].ratio * W; W = 0; }
    }
    return total;
}

int main() {
    int n;
    printf("Items: "); scanf("%d", &n);
    struct Item items[n];
    printf("Enter weight value for each:\n");
    for (int i = 0; i < n; i++) {
        scanf("%lf %lf", &items[i].weight, &items[i].value);
        items[i].ratio = items[i].value / items[i].weight;
    }
    double W;
    printf("Capacity: "); scanf("%lf", &W);
    printf("Max value = %g\n", fractionalKnapsack(items, n, W));
    return 0;
}
