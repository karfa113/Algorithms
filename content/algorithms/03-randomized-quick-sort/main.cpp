#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
using namespace std;

int partition(vector<int>& a, int low, int high) {
    int pivot = a[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (a[j] <= pivot) swap(a[++i], a[j]);
    swap(a[i + 1], a[high]);
    return i + 1;
}

int randomPartition(vector<int>& a, int low, int high) {
    int r = low + rand() % (high - low + 1);
    swap(a[r], a[high]);
    return partition(a, low, high);
}

void quickSort(vector<int>& a, int low, int high) {
    if (low < high) {
        int p = randomPartition(a, low, high);
        quickSort(a, low, p - 1);
        quickSort(a, p + 1, high);
    }
}

int main() {
    srand(time(0));
    int n; cout << "Size: "; cin >> n;
    vector<int> a(n);
    cout << "Elements: ";
    for (auto& x : a) cin >> x;
    quickSort(a, 0, n - 1);
    cout << "Sorted: ";
    for (int x : a) cout << x << " ";
    cout << endl;
    return 0;
}
