import java.util.Random;
import java.util.Scanner;

public class Main {
    static Random rng = new Random();

    static void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }

    // Lomuto partition with a[high] as pivot
    static int partition(int[] a, int low, int high) {
        int pivot = a[high], i = low - 1;
        for (int j = low; j < high; j++)
            if (a[j] <= pivot) swap(a, ++i, j);
        swap(a, i + 1, high);
        return i + 1;
    }

    // Pick a random pivot, move it to the end, then partition
    static int randomPartition(int[] a, int low, int high) {
        int r = low + rng.nextInt(high - low + 1);
        swap(a, r, high);
        return partition(a, low, high);
    }

    static void quickSort(int[] a, int low, int high) {
        if (low < high) {
            int p = randomPartition(a, low, high);
            quickSort(a, low, p - 1);
            quickSort(a, p + 1, high);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Size: ");
        int n = sc.nextInt();
        int[] a = new int[n];
        System.out.print("Elements: ");
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        quickSort(a, 0, n - 1);
        System.out.print("Sorted: ");
        for (int x : a) System.out.print(x + " ");
        System.out.println();
    }
}
