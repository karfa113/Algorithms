#include <iostream>
using namespace std;

const int MAX = 10;   // fixed capacity of the array

int main() {
    int arr[MAX];
    int n = 0;   // number of elements currently stored
    int choice, pos, val;

    while (true) {
        cout << "\n--- Array Operations ---\n";
        cout << "1. Insert at position\n2. Delete at position\n3. Traverse\n";
        cout << "4. Linear search\n5. Update\n0. Exit\n";
        cout << "Enter choice: ";
        if (!(cin >> choice)) break;

        if (choice == 0) {
            cout << "Exiting.\n";
            break;
        } else if (choice == 1) {
            if (n == MAX) { cout << "Array is full (overflow)\n"; continue; }
            cout << "Enter position (1-" << n + 1 << "): ";
            cin >> pos;
            if (pos < 1 || pos > n + 1) { cout << "Invalid position\n"; continue; }
            cout << "Enter value: ";
            cin >> val;
            // shift elements right, starting from the last one
            for (int i = n; i >= pos; i--) arr[i] = arr[i - 1];
            arr[pos - 1] = val;
            n++;
            cout << "Inserted " << val << " at position " << pos << "\n";
        } else if (choice == 2) {
            if (n == 0) { cout << "Array is empty (underflow)\n"; continue; }
            cout << "Enter position (1-" << n << "): ";
            cin >> pos;
            if (pos < 1 || pos > n) { cout << "Invalid position\n"; continue; }
            val = arr[pos - 1];
            // shift elements left to close the gap
            for (int i = pos - 1; i < n - 1; i++) arr[i] = arr[i + 1];
            n--;
            cout << "Deleted " << val << " from position " << pos << "\n";
        } else if (choice == 3) {
            if (n == 0) { cout << "Array is empty\n"; continue; }
            cout << "Array:";
            for (int i = 0; i < n; i++) cout << " " << arr[i];
            cout << "\n";
        } else if (choice == 4) {
            cout << "Enter value to search: ";
            cin >> val;
            bool found = false;
            for (int i = 0; i < n; i++) {
                if (arr[i] == val) {
                    cout << val << " found at position " << i + 1 << "\n";
                    found = true;
                    break;   // first occurrence only
                }
            }
            if (!found) cout << val << " not found\n";
        } else if (choice == 5) {
            if (n == 0) { cout << "Array is empty\n"; continue; }
            cout << "Enter position (1-" << n << "): ";
            cin >> pos;
            if (pos < 1 || pos > n) { cout << "Invalid position\n"; continue; }
            cout << "Enter new value: ";
            cin >> val;
            cout << "Updated position " << pos << ": " << arr[pos - 1] << " -> " << val << "\n";
            arr[pos - 1] = val;
        } else {
            cout << "Invalid choice\n";
        }
    }
    return 0;
}
