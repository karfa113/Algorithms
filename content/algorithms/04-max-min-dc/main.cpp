#include <iostream>
#include <vector>
using namespace std;

pair<int,int> maxMin(vector<int>& a, int low, int high) {
    if (low == high) return {a[low], a[low]};
    if (high == low + 1) {
        if (a[low] < a[high]) return {a[high], a[low]};
        return {a[low], a[high]};
    }
    int mid = (low + high) / 2;
    auto L = maxMin(a, low, mid);
    auto R = maxMin(a, mid + 1, high);
    return { max(L.first, R.first), min(L.second, R.second) };
}

int main() {
    int n; cout << "Size: "; cin >> n;
    vector<int> a(n);
    cout << "Elements: ";
    for (auto& x : a) cin >> x;
    auto p = maxMin(a, 0, n - 1);
    cout << "Max = " << p.first << ", Min = " << p.second << endl;
    return 0;
}
