#include <iostream>
#include <vector>
using namespace std;

struct Item { double weight, value, ratio; };

void sortByRatio(vector<Item>& a) {
    int n = a.size();
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (a[j].ratio < a[j+1].ratio) swap(a[j], a[j+1]);
}

double fractionalKnapsack(vector<Item> items, double W) {
    sortByRatio(items);
    double total = 0;
    for (auto& it : items) {
        if (W <= 0) break;
        if (it.weight <= W) { total += it.value; W -= it.weight; }
        else                { total += it.ratio * W; W = 0; }
    }
    return total;
}

int main() {
    int n; cout << "Items: "; cin >> n;
    vector<Item> items(n);
    cout << "Enter weight value for each:\n";
    for (auto& it : items) {
        cin >> it.weight >> it.value;
        it.ratio = it.value / it.weight;
    }
    double W; cout << "Capacity: "; cin >> W;
    cout << "Max value = " << fractionalKnapsack(items, W) << endl;
    return 0;
}
