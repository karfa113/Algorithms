#include <stdio.h>

void maxMin(int arr[], int low, int high, int *max, int *min) {
    int max1, min1, max2, min2, mid;
    if (low == high) {
        *max = *min = arr[low];
    } else if (high == low + 1) {
        if (arr[low] < arr[high]) { *min = arr[low];  *max = arr[high]; }
        else                       { *min = arr[high]; *max = arr[low];  }
    } else {
        mid = (low + high) / 2;
        maxMin(arr, low, mid, &max1, &min1);
        maxMin(arr, mid + 1, high, &max2, &min2);
        *max = (max1 > max2) ? max1 : max2;
        *min = (min1 < min2) ? min1 : min2;
    }
}

int main(void) {
    int n, max, min;
    printf("Size: "); scanf("%d", &n);
    int arr[n];
    printf("Elements: ");
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    maxMin(arr, 0, n - 1, &max, &min);
    printf("Max = %d, Min = %d\n", max, min);
    return 0;
}
