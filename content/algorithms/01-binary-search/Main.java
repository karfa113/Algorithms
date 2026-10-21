import java.util.Scanner;

public class Main {
    // Recursive binary search on a sorted array
    static int binarySearch(int[] arr, int low, int high, int key) {
        if (low > high) return -1;
        int mid = low + (high - low) / 2;
        if (arr[mid] == key) return mid;
        if (key < arr[mid])
            return binarySearch(arr, low, mid - 1, key);
        return binarySearch(arr, mid + 1, high, key);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter size of sorted array: ");
        int n = sc.nextInt();
        int[] arr = new int[n];
        System.out.print("Enter " + n + " sorted elements: ");
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        System.out.print("Enter key: ");
        int key = sc.nextInt();

        int idx = binarySearch(arr, 0, n - 1, key);
        if (idx == -1) System.out.println("Element not found.");
        else           System.out.println("Element found at index " + idx);
    }
}
