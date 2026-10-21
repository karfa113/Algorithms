#include <stdio.h>

#define MAX 10   /* fixed capacity of the array */

int main(void) {
    int arr[MAX];
    int n = 0;   /* number of elements currently stored */
    int choice, pos, val;

    while (1) {
        printf("\n--- Array Operations ---\n");
        printf("1. Insert at position\n2. Delete at position\n3. Traverse\n");
        printf("4. Linear search\n5. Update\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;

        if (choice == 0) {
            printf("Exiting.\n");
            break;
        } else if (choice == 1) {
            if (n == MAX) { printf("Array is full (overflow)\n"); continue; }
            printf("Enter position (1-%d): ", n + 1);
            scanf("%d", &pos);
            if (pos < 1 || pos > n + 1) { printf("Invalid position\n"); continue; }
            printf("Enter value: ");
            scanf("%d", &val);
            /* shift elements right, starting from the last one */
            for (int i = n; i >= pos; i--) arr[i] = arr[i - 1];
            arr[pos - 1] = val;
            n++;
            printf("Inserted %d at position %d\n", val, pos);
        } else if (choice == 2) {
            if (n == 0) { printf("Array is empty (underflow)\n"); continue; }
            printf("Enter position (1-%d): ", n);
            scanf("%d", &pos);
            if (pos < 1 || pos > n) { printf("Invalid position\n"); continue; }
            val = arr[pos - 1];
            /* shift elements left to close the gap */
            for (int i = pos - 1; i < n - 1; i++) arr[i] = arr[i + 1];
            n--;
            printf("Deleted %d from position %d\n", val, pos);
        } else if (choice == 3) {
            if (n == 0) { printf("Array is empty\n"); continue; }
            printf("Array:");
            for (int i = 0; i < n; i++) printf(" %d", arr[i]);
            printf("\n");
        } else if (choice == 4) {
            printf("Enter value to search: ");
            scanf("%d", &val);
            int found = 0;
            for (int i = 0; i < n; i++) {
                if (arr[i] == val) {
                    printf("%d found at position %d\n", val, i + 1);
                    found = 1;
                    break;   /* first occurrence only */
                }
            }
            if (!found) printf("%d not found\n", val);
        } else if (choice == 5) {
            if (n == 0) { printf("Array is empty\n"); continue; }
            printf("Enter position (1-%d): ", n);
            scanf("%d", &pos);
            if (pos < 1 || pos > n) { printf("Invalid position\n"); continue; }
            printf("Enter new value: ");
            scanf("%d", &val);
            printf("Updated position %d: %d -> %d\n", pos, arr[pos - 1], val);
            arr[pos - 1] = val;
        } else {
            printf("Invalid choice\n");
        }
    }
    return 0;
}
