#include <stdio.h>

int binarySearch(int arr[], int low, int high, int key) {
    if (low > high) return -1;          // base case: not found
    int mid = low + (high - low) / 2;
    if (arr[mid] == key) return mid;
    if (key < arr[mid])
        return binarySearch(arr, low, mid - 1, key);
    return binarySearch(arr, mid + 1, high, key);
}

int main(void) {
    int n, key;
    printf("Enter size of sorted array: ");
    scanf("%d", &n);
    int arr[n];
    printf("Enter %d sorted elements: ", n);
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    printf("Enter key: ");
    scanf("%d", &key);

    int idx = binarySearch(arr, 0, n - 1, key);
    if (idx == -1) printf("Element not found.\n");
    else           printf("Element found at index %d\n", idx);
    return 0;
}
