import java.util.Scanner;

public class Main {
    // Returns {max, min} of a[low..high] by divide and conquer
    static int[] maxMin(int[] a, int low, int high) {
        if (low == high) return new int[]{a[low], a[low]};
        if (high == low + 1) {
            if (a[low] < a[high]) return new int[]{a[high], a[low]};
            return new int[]{a[low], a[high]};
        }
        int mid = (low + high) / 2;
        int[] L = maxMin(a, low, mid);
        int[] R = maxMin(a, mid + 1, high);
        return new int[]{Math.max(L[0], R[0]), Math.min(L[1], R[1])};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Size: ");
        int n = sc.nextInt();
        int[] a = new int[n];
        System.out.print("Elements: ");
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int[] p = maxMin(a, 0, n - 1);
        System.out.println("Max = " + p[0] + ", Min = " + p[1]);
    }
}
