import java.util.Scanner;

public class Main {
    // Merge arr[low..mid] and arr[mid+1..high]
    static void merge(int[] arr, int low, int mid, int high) {
        int[] L = new int[mid - low + 1];
        int[] R = new int[high - mid];
        for (int x = 0; x < L.length; x++) L[x] = arr[low + x];
        for (int x = 0; x < R.length; x++) R[x] = arr[mid + 1 + x];
        int i = 0, j = 0, k = low;
        while (i < L.length && j < R.length)
            arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
        while (i < L.length) arr[k++] = L[i++];
        while (j < R.length) arr[k++] = R[j++];
    }

    static void mergeSort(int[] arr, int low, int high) {
        if (low < high) {
            int mid = low + (high - low) / 2;
            mergeSort(arr, low, mid);
            mergeSort(arr, mid + 1, high);
            merge(arr, low, mid, high);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Size: ");
        int n = sc.nextInt();
        int[] arr = new int[n];
        System.out.print("Elements: ");
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        mergeSort(arr, 0, n - 1);
        System.out.print("Sorted: ");
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }
}
