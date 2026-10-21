import java.util.Scanner;

public class Main {
    static class Item { double weight, value, ratio; }

    // Bubble sort by value/weight ratio, highest first
    static void sortByRatio(Item[] a) {
        int n = a.length;
        for (int i = 0; i < n - 1; i++)
            for (int j = 0; j < n - i - 1; j++)
                if (a[j].ratio < a[j + 1].ratio) {
                    Item t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                }
    }

    static double fractionalKnapsack(Item[] items, double W) {
        sortByRatio(items);
        double total = 0;
        for (Item it : items) {
            if (W <= 0) break;
            if (it.weight <= W) { total += it.value; W -= it.weight; }
            else                { total += it.ratio * W; W = 0; }
        }
        return total;
    }

    // Mimics C++ cout's default double format (6 significant digits, %g style)
    static String fmt(double d) {
        String s = String.format("%g", d);
        if (s.contains("e")) {
            // %g in Java never strips zeros; handle the exponent form like C
            String[] p = s.split("e");
            String m = p[0].contains(".") ? p[0].replaceAll("0+$", "").replaceAll("\\.$", "") : p[0];
            return m + "e" + p[1];
        }
        if (s.contains(".")) s = s.replaceAll("0+$", "").replaceAll("\\.$", "");
        return s;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Items: ");
        int n = sc.nextInt();
        Item[] items = new Item[n];
        System.out.print("Enter weight value for each:\n");
        for (int i = 0; i < n; i++) {
            items[i] = new Item();
            items[i].weight = sc.nextDouble();
            items[i].value = sc.nextDouble();
            items[i].ratio = items[i].value / items[i].weight;
        }
        System.out.print("Capacity: ");
        double W = sc.nextDouble();
        System.out.println("Max value = " + fmt(fractionalKnapsack(items, W)));
    }
}
