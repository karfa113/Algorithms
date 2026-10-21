import java.util.Scanner;

public class Main {
    static void swap(int[] a, int i, int j) {
        int t = a[i]; a[i] = a[j]; a[j] = t;
    }

    // Sift a[i] down so the subtree rooted at i is a max-heap (heap size n)
    static void heapify(int[] a, int n, int i) {
        int largest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && a[l] > a[largest]) largest = l;
        if (r < n && a[r] > a[largest]) largest = r;
        if (largest != i) {
            swap(a, i, largest);
            heapify(a, n, largest);
        }
    }

    static void heapSort(int[] a) {
        int n = a.length;
        for (int i = n / 2 - 1; i >= 0; i--) heapify(a, n, i);   // build max-heap
        for (int i = n - 1; i > 0; i--) {
            swap(a, 0, i);          // move max to its final place
            heapify(a, i, 0);       // restore heap on the rest
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Size: ");
        int n = sc.nextInt();
        int[] a = new int[n];
        System.out.print("Elements: ");
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        heapSort(a);
        System.out.print("Sorted: ");
        for (int x : a) System.out.print(x + " ");
        System.out.println();
    }
}
