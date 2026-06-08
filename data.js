/* ============================================================
   Algorithm Lab Data
   17 algorithms — concept, algorithm, complexity, C, C++, viva
   ============================================================ */

window.ALGORITHMS = [
/* ============================================================
   1. BINARY SEARCH USING RECURSION
============================================================ */
{
  id: 1,
  name: "Binary Search (Recursive)",
  short: "Binary Search",
  tags: ["Divide & Conquer", "Search"],
  concept: `Binary Search is an efficient searching algorithm used to locate a target value inside a <strong>sorted</strong> array. Instead of scanning every element (as in linear search), it repeatedly halves the search space. We compare the target with the middle element: if equal, we are done; if smaller, we recurse on the left half; if larger, we recurse on the right half. Because the array size is halved at each step, only <code>O(log n)</code> comparisons are needed.`,
  process: [
    "Sort the array if it is not already sorted.",
    "Define a recursive function that takes the array, the lower bound <code>low</code>, the upper bound <code>high</code>, and the search key <code>key</code>.",
    "Compute the middle index: <code>mid = low + (high - low) / 2</code>.",
    "If <code>arr[mid] == key</code>, return <code>mid</code> (element found).",
    "If <code>key &lt; arr[mid]</code>, recursively search the left half: <code>(low, mid - 1)</code>.",
    "If <code>key &gt; arr[mid]</code>, recursively search the right half: <code>(mid + 1, high)</code>.",
    "If <code>low &gt; high</code>, the key is not present — return -1."
  ],
  complexity: { best: "O(1)", avg: "O(log n)", worst: "O(log n)", space: "O(log n)" },
  c: `#include <stdio.h>

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
    printf("Enter key to search: ");
    scanf("%d", &key);

    int idx = binarySearch(arr, 0, n - 1, key);
    if (idx == -1) printf("Element not found.\\n");
    else           printf("Element found at index %d\\n", idx);
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int binarySearch(int arr[], int low, int high, int key) {
    if (low > high) return -1;
    int mid = low + (high - low) / 2;
    if (arr[mid] == key) return mid;
    if (key < arr[mid])
        return binarySearch(arr, low, mid - 1, key);
    return binarySearch(arr, mid + 1, high, key);
}

int main() {
    int n, key;
    cout << "Enter size of sorted array: ";
    cin >> n;
    int arr[n];
    cout << "Enter " << n << " sorted elements: ";
    for (int i = 0; i < n; i++) cin >> arr[i];
    cout << "Enter key: ";
    cin >> key;

    int idx = binarySearch(arr, 0, n - 1, key);
    if (idx == -1) cout << "Element not found." << endl;
    else           cout << "Element found at index " << idx << endl;
    return 0;
}`,
  viva: [
    { q: "What is the prerequisite for applying binary search?", a: "The input array must be sorted (ascending or descending). Without sorting, the divide-and-conquer logic does not work." },
    { q: "What is the time complexity of binary search?", a: "Best case is O(1) when the middle element is the key; average and worst cases are O(log n) since the search space halves each step." },
    { q: "Why use <code>low + (high - low)/2</code> instead of <code>(low + high)/2</code>?", a: "To avoid integer overflow when <code>low</code> and <code>high</code> are very large. The expression <code>(low+high)</code> may exceed INT_MAX." },
    { q: "What is the space complexity of recursive binary search?", a: "O(log n) due to the recursion call stack. The iterative version uses O(1) space." },
    { q: "Can binary search be applied to linked lists?", a: "Not efficiently. Linked lists do not support O(1) random access, so finding the middle element costs O(n), defeating the purpose." },
    { q: "Is binary search a divide-and-conquer algorithm?", a: "Yes. It divides the problem into smaller subproblems (half the array) and conquers each recursively. There is no combine step." },
    { q: "What is the recurrence relation?", a: "<code>T(n) = T(n/2) + O(1)</code>, which solves to O(log n) by the Master Theorem." }
  ]
},

/* ============================================================
   2. MERGE SORT
============================================================ */
{
  id: 2,
  name: "Merge Sort",
  short: "Merge Sort",
  tags: ["Divide & Conquer", "Sorting", "Stable"],
  concept: `Merge Sort is a classical divide-and-conquer sorting algorithm. The array is recursively divided into two halves until each subarray has one element (which is trivially sorted). Then the halves are <strong>merged</strong> back together in sorted order. The merge step is the heart of the algorithm: it walks two sorted subarrays with two pointers and writes the smaller element each time. Merge sort guarantees <code>O(n log n)</code> time in all cases and is <strong>stable</strong>.`,
  process: [
    "If the array has 0 or 1 elements, it is already sorted (base case).",
    "Find the middle index: <code>mid = (low + high) / 2</code>.",
    "Recursively call mergeSort on the left half <code>arr[low..mid]</code>.",
    "Recursively call mergeSort on the right half <code>arr[mid+1..high]</code>.",
    "Merge the two sorted halves using an auxiliary array:",
    "&nbsp;&nbsp;&nbsp;– maintain two pointers <code>i</code>, <code>j</code> for the halves and one <code>k</code> for the output;",
    "&nbsp;&nbsp;&nbsp;– copy the smaller of <code>arr[i]</code>, <code>arr[j]</code> to position <code>k</code>;",
    "&nbsp;&nbsp;&nbsp;– copy any remaining elements after one half is exhausted.",
    "Copy back from the auxiliary array to the original."
  ],
  complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  c: `#include <stdio.h>
#include <stdlib.h>

void merge(int arr[], int low, int mid, int high) {
    int n1 = mid - low + 1, n2 = high - mid;
    int *L = malloc(n1 * sizeof(int));
    int *R = malloc(n2 * sizeof(int));

    for (int i = 0; i < n1; i++) L[i] = arr[low + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = low;
    while (i < n1 && j < n2)
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];

    free(L); free(R);
}

void mergeSort(int arr[], int low, int high) {
    if (low < high) {
        int mid = low + (high - low) / 2;
        mergeSort(arr, low, mid);
        mergeSort(arr, mid + 1, high);
        merge(arr, low, mid, high);
    }
}

int main(void) {
    int n;
    printf("Enter array size: "); scanf("%d", &n);
    int arr[n];
    printf("Enter %d elements: ", n);
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    mergeSort(arr, 0, n - 1);
    printf("Sorted: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& arr, int low, int mid, int high) {
    vector<int> L(arr.begin() + low, arr.begin() + mid + 1);
    vector<int> R(arr.begin() + mid + 1, arr.begin() + high + 1);
    int i = 0, j = 0, k = low;
    while (i < (int)L.size() && j < (int)R.size())
        arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];
    while (i < (int)L.size()) arr[k++] = L[i++];
    while (j < (int)R.size()) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int mid = low + (high - low) / 2;
        mergeSort(arr, low, mid);
        mergeSort(arr, mid + 1, high);
        merge(arr, low, mid, high);
    }
}

int main() {
    int n; cout << "Size: "; cin >> n;
    vector<int> arr(n);
    cout << "Elements: ";
    for (auto& x : arr) cin >> x;
    mergeSort(arr, 0, n - 1);
    cout << "Sorted: ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    return 0;
}`,
  viva: [
    { q: "Is merge sort stable?", a: "Yes. Equal elements retain their original relative order because the merge step uses <code>&lt;=</code> when picking from the left half." },
    { q: "What is the time complexity?", a: "O(n log n) in best, average and worst cases. The recurrence is T(n) = 2T(n/2) + O(n)." },
    { q: "Why is merge sort preferred for linked lists?", a: "It does not require random access; only sequential traversal. Splitting a linked list is O(n) and merging is in-place with pointer manipulation." },
    { q: "What is the space complexity?", a: "O(n) for the auxiliary array used in the merge step. Recursion stack adds O(log n)." },
    { q: "Is merge sort in-place?", a: "No, the standard array implementation requires O(n) auxiliary space." },
    { q: "When is merge sort better than quicksort?", a: "When stability is required, for external sorting (data on disk), or when worst-case guarantees matter (quicksort is O(n²) worst case)." },
    { q: "What is the recurrence relation?", a: "T(n) = 2T(n/2) + Θ(n). By the Master Theorem (case 2), T(n) = Θ(n log n)." }
  ]
},

/* ============================================================
   3. RANDOMIZED QUICK SORT
============================================================ */
{
  id: 3,
  name: "Randomized Quick Sort",
  short: "Randomized Quick Sort",
  tags: ["Divide & Conquer", "Sorting", "Randomized"],
  concept: `Quick Sort is a divide-and-conquer algorithm that picks a <strong>pivot</strong>, partitions the array such that smaller elements lie left of the pivot and larger ones lie right, and then recursively sorts the two partitions. In <strong>Randomized Quick Sort</strong> the pivot is chosen uniformly at random rather than as a fixed position. Randomization avoids the worst-case <code>O(n²)</code> behavior on already-sorted or adversarial inputs and gives an <strong>expected</strong> running time of <code>O(n log n)</code>.`,
  process: [
    "If <code>low &lt; high</code>: pick a random index in <code>[low, high]</code> and swap it with <code>arr[high]</code>.",
    "Run the Lomuto/Hoare partition step using <code>arr[high]</code> as the pivot:",
    "&nbsp;&nbsp;&nbsp;– maintain pointer <code>i</code> for the boundary of \"smaller than pivot\" elements;",
    "&nbsp;&nbsp;&nbsp;– scan with <code>j</code>; if <code>arr[j] &le; pivot</code>, swap <code>arr[++i]</code> and <code>arr[j]</code>;",
    "&nbsp;&nbsp;&nbsp;– finally swap pivot into position <code>i + 1</code> and return that index.",
    "Recursively quick-sort the left part <code>(low, p - 1)</code> and the right part <code>(p + 1, high)</code>."
  ],
  complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
  c: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

int partition(int arr[], int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (arr[j] <= pivot) swap(&arr[++i], &arr[j]);
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

int randomPartition(int arr[], int low, int high) {
    int r = low + rand() % (high - low + 1);
    swap(&arr[r], &arr[high]);
    return partition(arr, low, high);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int p = randomPartition(arr, low, high);
        quickSort(arr, low, p - 1);
        quickSort(arr, p + 1, high);
    }
}

int main(void) {
    srand(time(NULL));
    int n;
    printf("Size: "); scanf("%d", &n);
    int arr[n];
    printf("Elements: ");
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    quickSort(arr, 0, n - 1);
    printf("Sorted: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
#include <cstdlib>
#include <ctime>
using namespace std;

int partition(vector<int>& a, int low, int high) {
    int pivot = a[high], i = low - 1;
    for (int j = low; j < high; j++)
        if (a[j] <= pivot) swap(a[++i], a[j]);
    swap(a[i + 1], a[high]);
    return i + 1;
}

int randomPartition(vector<int>& a, int low, int high) {
    int r = low + rand() % (high - low + 1);
    swap(a[r], a[high]);
    return partition(a, low, high);
}

void quickSort(vector<int>& a, int low, int high) {
    if (low < high) {
        int p = randomPartition(a, low, high);
        quickSort(a, low, p - 1);
        quickSort(a, p + 1, high);
    }
}

int main() {
    srand(time(0));
    int n; cout << "Size: "; cin >> n;
    vector<int> a(n);
    cout << "Elements: ";
    for (auto& x : a) cin >> x;
    quickSort(a, 0, n - 1);
    cout << "Sorted: ";
    for (int x : a) cout << x << " ";
    cout << endl;
    return 0;
}`,
  viva: [
    { q: "Why randomize the pivot?", a: "To avoid the worst-case O(n²) when input is already sorted or reverse-sorted. With random pivots, the <i>expected</i> complexity is O(n log n) regardless of input." },
    { q: "Is quick sort stable?", a: "No. The partition step swaps elements across positions and can reorder equal keys." },
    { q: "Is it in-place?", a: "Yes. Partitioning is done within the array using swaps. Space usage is only the recursion stack." },
    { q: "What is the worst case input for non-randomized quick sort?", a: "An already-sorted or reverse-sorted array when the first/last element is always the pivot." },
    { q: "What is the recurrence?", a: "Best/Avg: T(n) = 2T(n/2) + O(n) = O(n log n). Worst: T(n) = T(n-1) + O(n) = O(n²)." },
    { q: "How can worst case be avoided besides randomization?", a: "Use median-of-three pivot selection, or switch to heap/merge sort once recursion depth exceeds 2 log n (Introsort)." },
    { q: "Difference between Lomuto and Hoare partition?", a: "Lomuto is simpler and uses one scanning pointer with the pivot at the end. Hoare uses two pointers moving from both ends and is generally faster but more complex." }
  ]
},

/* ============================================================
   4. MAX-MIN USING DIVIDE AND CONQUER
============================================================ */
{
  id: 4,
  name: "Max-Min using Divide & Conquer",
  short: "Max-Min (D&C)",
  tags: ["Divide & Conquer"],
  concept: `Given an array of <code>n</code> elements, we need to find the maximum and minimum simultaneously. A naive approach uses 2(n - 1) comparisons. With <strong>divide and conquer</strong>, we split the array into two halves, recursively find the (max, min) of each half, and then combine using just 2 comparisons. The total number of comparisons drops to <code>⌈3n/2⌉ - 2</code>, which is optimal.`,
  process: [
    "If the array has 1 element, max = min = that element.",
    "If the array has 2 elements, compare them directly: assign smaller to min and larger to max.",
    "Otherwise:",
    "&nbsp;&nbsp;&nbsp;– divide the array into two halves at <code>mid = (low + high) / 2</code>;",
    "&nbsp;&nbsp;&nbsp;– recursively find <code>(max1, min1)</code> in the left half;",
    "&nbsp;&nbsp;&nbsp;– recursively find <code>(max2, min2)</code> in the right half;",
    "&nbsp;&nbsp;&nbsp;– combine: <code>max = max(max1, max2)</code>, <code>min = min(min1, min2)</code>.",
    "Return the result."
  ],
  complexity: { best: "O(n)", avg: "O(n)", worst: "O(n)", space: "O(log n)" },
  c: `#include <stdio.h>

typedef struct { int max, min; } Pair;

Pair maxMin(int arr[], int low, int high) {
    Pair result, left, right;
    if (low == high) {
        result.max = result.min = arr[low];
    } else if (high == low + 1) {
        if (arr[low] < arr[high]) { result.min = arr[low];  result.max = arr[high]; }
        else                       { result.min = arr[high]; result.max = arr[low];  }
    } else {
        int mid = (low + high) / 2;
        left  = maxMin(arr, low, mid);
        right = maxMin(arr, mid + 1, high);
        result.max = (left.max > right.max) ? left.max : right.max;
        result.min = (left.min < right.min) ? left.min : right.min;
    }
    return result;
}

int main(void) {
    int n;
    printf("Size: "); scanf("%d", &n);
    int arr[n];
    printf("Elements: ");
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    Pair p = maxMin(arr, 0, n - 1);
    printf("Max = %d, Min = %d\\n", p.max, p.min);
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

pair<int,int> maxMin(vector<int>& a, int low, int high) {
    if (low == high) return {a[low], a[low]};
    if (high == low + 1) {
        if (a[low] < a[high]) return {a[high], a[low]};
        return {a[low], a[high]};
    }
    int mid = (low + high) / 2;
    auto L = maxMin(a, low, mid);
    auto R = maxMin(a, mid + 1, high);
    return { max(L.first, R.first), min(L.second, R.second) };
}

int main() {
    int n; cout << "Size: "; cin >> n;
    vector<int> a(n);
    cout << "Elements: ";
    for (auto& x : a) cin >> x;
    auto p = maxMin(a, 0, n - 1);
    cout << "Max = " << p.first << ", Min = " << p.second << endl;
    return 0;
}`,
  viva: [
    { q: "What is the number of comparisons in this approach?", a: "Roughly ⌈3n/2⌉ - 2, which is fewer than the naive 2n - 2." },
    { q: "What is the recurrence relation?", a: "T(n) = 2T(n/2) + 2 for n &gt; 2. By the Master Theorem this resolves to O(n)." },
    { q: "Can the same be achieved iteratively?", a: "Yes — pair-compare adjacent elements first, then compare the smaller with current min and the larger with current max. Same comparison count." },
    { q: "Why is divide & conquer preferred?", a: "It minimizes the comparison count and demonstrates the technique, although iterative pair-comparison achieves the same in O(1) extra space." },
    { q: "What is the space complexity?", a: "O(log n) for the recursion stack." }
  ]
},

/* ============================================================
   5. HEAP SORT
============================================================ */
{
  id: 5,
  name: "Heap Sort",
  short: "Heap Sort",
  tags: ["Sorting", "Heap"],
  concept: `Heap Sort uses the <strong>binary heap</strong> data structure (typically a max-heap) to sort an array in place. First the array is reorganized into a max-heap so that the largest element sits at index 0. Then we repeatedly swap the root with the last element of the heap and shrink the heap by one, calling <code>heapify</code> on the root to restore the heap property. After <code>n</code> such steps the array is sorted in ascending order. Heap sort is <strong>not stable</strong> but has guaranteed <code>O(n log n)</code> behavior.`,
  process: [
    "<strong>Build max-heap:</strong> for <code>i</code> from <code>n/2 - 1</code> down to <code>0</code>, call <code>heapify(arr, n, i)</code>.",
    "<strong>Sort:</strong> for <code>i</code> from <code>n - 1</code> down to <code>1</code>:",
    "&nbsp;&nbsp;&nbsp;– swap <code>arr[0]</code> with <code>arr[i]</code> (largest element to the end);",
    "&nbsp;&nbsp;&nbsp;– reduce heap size to <code>i</code> and call <code>heapify(arr, i, 0)</code>.",
    "<strong>Heapify procedure:</strong> given a node, find the largest among the node and its two children. If a child is larger, swap and recurse on that child."
  ],
  complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
  c: `#include <stdio.h>

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(&arr[i], &arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(&arr[0], &arr[i]);
        heapify(arr, i, 0);
    }
}

int main(void) {
    int n;
    printf("Size: "); scanf("%d", &n);
    int arr[n];
    printf("Elements: ");
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    heapSort(arr, n);
    printf("Sorted: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

void heapify(vector<int>& a, int n, int i) {
    int largest = i, l = 2*i + 1, r = 2*i + 2;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest != i) {
        swap(a[i], a[largest]);
        heapify(a, n, largest);
    }
}

void heapSort(vector<int>& a) {
    int n = a.size();
    for (int i = n/2 - 1; i >= 0; i--) heapify(a, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(a[0], a[i]);
        heapify(a, i, 0);
    }
}

int main() {
    int n; cout << "Size: "; cin >> n;
    vector<int> a(n);
    cout << "Elements: ";
    for (auto& x : a) cin >> x;
    heapSort(a);
    cout << "Sorted: ";
    for (int x : a) cout << x << " ";
    cout << endl;
    return 0;
}`,
  viva: [
    { q: "What is a heap?", a: "A complete binary tree where every parent satisfies the heap property: in a max-heap parent ≥ children, in a min-heap parent ≤ children." },
    { q: "Is heap sort stable?", a: "No. Swapping the root with the last element can break the relative order of equal keys." },
    { q: "Time complexity of building a heap?", a: "O(n), not O(n log n). The aggregate work using siftDown from the middle to the root is bounded by Σ (n/2^(h+1)) · h ≈ n." },
    { q: "Space complexity?", a: "O(1) — sorting is performed in place; only a constant amount of extra memory is needed." },
    { q: "Why is the heap built bottom-up?", a: "Leaves already satisfy the heap property, so building from <code>n/2 - 1</code> down to 0 lets each <code>heapify</code> use the already-heapified children." },
    { q: "Why is heap sort O(n log n) in the worst case?", a: "n extractions, each costing log n for re-heapification, giving n log n." },
    { q: "How is a heap represented in an array?", a: "Index i has children at 2i + 1 and 2i + 2, and parent at (i - 1) / 2." }
  ]
},

/* ============================================================
   6. BFS USING ADJACENCY MATRIX
============================================================ */
{
  id: 6,
  name: "BFS (Adjacency Matrix, no STL)",
  short: "BFS",
  tags: ["Graph", "Traversal"],
  concept: `Breadth-First Search explores a graph <strong>level by level</strong> starting from a source vertex. Vertices are visited in the order of their distance (in number of edges) from the source. BFS uses a <strong>queue</strong>: enqueue the source, then repeatedly dequeue a vertex, visit it, and enqueue all its unvisited neighbours. A <code>visited[]</code> array prevents the same vertex from being processed twice. BFS finds the shortest path in an unweighted graph.`,
  process: [
    "Initialize <code>visited[v] = 0</code> for every vertex.",
    "Create an empty array-based queue with <code>front = rear = 0</code>.",
    "Mark the source visited and enqueue it.",
    "While the queue is not empty:",
    "&nbsp;&nbsp;&nbsp;– dequeue a vertex <code>u</code> and print it;",
    "&nbsp;&nbsp;&nbsp;– for every <code>v</code> from 0 to n - 1, if <code>adj[u][v] == 1</code> and <code>v</code> is not visited, mark it visited and enqueue.",
    "Continue until the queue becomes empty."
  ],
  complexity: { best: "O(V²)", avg: "O(V²)", worst: "O(V²)", space: "O(V)" },
  c: `#include <stdio.h>
#define MAX 100

int adj[MAX][MAX], visited[MAX];
int queue_[MAX], front = 0, rear = 0;

void enqueue(int x) { queue_[rear++] = x; }
int  dequeue(void)  { return queue_[front++]; }
int  isEmpty(void)  { return front == rear; }

void bfs(int start, int n) {
    enqueue(start);
    visited[start] = 1;
    while (!isEmpty()) {
        int u = dequeue();
        printf("%d ", u);
        for (int v = 0; v < n; v++)
            if (adj[u][v] && !visited[v]) {
                visited[v] = 1;
                enqueue(v);
            }
    }
}

int main(void) {
    int n, e, u, v, src;
    printf("Vertices: "); scanf("%d", &n);
    printf("Edges: ");    scanf("%d", &e);
    printf("Enter %d edges (u v):\\n", e);
    for (int i = 0; i < e; i++) {
        scanf("%d %d", &u, &v);
        adj[u][v] = adj[v][u] = 1;
    }
    printf("Source: "); scanf("%d", &src);
    printf("BFS: ");
    bfs(src, n);
    printf("\\n");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;
#define MAX 100

int adj[MAX][MAX], visited[MAX];
int q[MAX], front_ = 0, rear_ = 0;

void enqueue(int x) { q[rear_++] = x; }
int  dequeue()      { return q[front_++]; }
bool empty_()       { return front_ == rear_; }

void bfs(int start, int n) {
    enqueue(start);
    visited[start] = 1;
    while (!empty_()) {
        int u = dequeue();
        cout << u << " ";
        for (int v = 0; v < n; v++)
            if (adj[u][v] && !visited[v]) {
                visited[v] = 1;
                enqueue(v);
            }
    }
}

int main() {
    int n, e, u, v, src;
    cout << "Vertices: "; cin >> n;
    cout << "Edges: ";    cin >> e;
    cout << "Edges (u v):\\n";
    while (e--) { cin >> u >> v; adj[u][v] = adj[v][u] = 1; }
    cout << "Source: "; cin >> src;
    cout << "BFS: ";
    bfs(src, n);
    cout << endl;
    return 0;
}`,
  viva: [
    { q: "Which data structure does BFS use?", a: "A FIFO queue — vertices are explored in the order they are discovered." },
    { q: "Time complexity using an adjacency matrix?", a: "O(V²) — for every vertex we scan all V entries of its row." },
    { q: "Time complexity using an adjacency list?", a: "O(V + E) — each vertex is enqueued once and each edge is examined twice (in undirected graphs)." },
    { q: "What is BFS useful for?", a: "Finding the shortest path in unweighted graphs, level-order traversal, connected components, bipartite checking, and web crawling." },
    { q: "Is BFS guaranteed to terminate?", a: "Yes, because the visited array ensures each vertex is enqueued at most once and the graph has finitely many vertices." },
    { q: "Difference between BFS and DFS?", a: "BFS explores level by level using a queue; DFS goes deep first using a stack/recursion. BFS finds shortest paths in unweighted graphs; DFS detects cycles and finds connected components more naturally." },
    { q: "Space complexity?", a: "O(V) for the visited array and queue." }
  ]
},

/* ============================================================
   7. DFS USING ADJACENCY MATRIX
============================================================ */
{
  id: 7,
  name: "DFS (Recursive & Iterative)",
  short: "DFS",
  tags: ["Graph", "Traversal"],
  concept: `Depth-First Search explores a graph as deeply as possible along each branch before backtracking. Starting at a source, DFS visits an unvisited neighbour, recurses on it, and only moves to another neighbour after the entire subtree is exhausted. Recursive DFS uses the function-call stack implicitly, while iterative DFS uses an explicit stack. DFS underlies topological sorting, cycle detection, strongly connected components, and many other graph algorithms.`,
  process: [
    "<strong>Recursive DFS</strong>:",
    "&nbsp;&nbsp;&nbsp;– mark the current vertex <code>u</code> as visited and print it;",
    "&nbsp;&nbsp;&nbsp;– for each neighbour <code>v</code>: if not visited, call DFS(v).",
    "<strong>Iterative DFS</strong>:",
    "&nbsp;&nbsp;&nbsp;– push the source onto a stack;",
    "&nbsp;&nbsp;&nbsp;– while the stack is not empty: pop a vertex, if unvisited, mark visited and push all unvisited neighbours."
  ],
  complexity: { best: "O(V²)", avg: "O(V²)", worst: "O(V²)", space: "O(V)" },
  c: `#include <stdio.h>
#define MAX 100

int adj[MAX][MAX], visited[MAX], n;

/* ---- Recursive DFS ---- */
void dfsRec(int u) {
    visited[u] = 1;
    printf("%d ", u);
    for (int v = 0; v < n; v++)
        if (adj[u][v] && !visited[v])
            dfsRec(v);
}

/* ---- Iterative DFS ---- */
void dfsIter(int start) {
    int stack[MAX], top = -1;
    int seen[MAX] = {0};
    stack[++top] = start;
    while (top >= 0) {
        int u = stack[top--];
        if (seen[u]) continue;
        seen[u] = 1;
        printf("%d ", u);
        for (int v = n - 1; v >= 0; v--)         /* reverse to keep order */
            if (adj[u][v] && !seen[v])
                stack[++top] = v;
    }
}

int main(void) {
    int e, u, v, src;
    printf("Vertices: "); scanf("%d", &n);
    printf("Edges: ");    scanf("%d", &e);
    printf("Edges (u v):\\n");
    for (int i = 0; i < e; i++) {
        scanf("%d %d", &u, &v);
        adj[u][v] = adj[v][u] = 1;
    }
    printf("Source: "); scanf("%d", &src);

    printf("Recursive DFS: ");
    dfsRec(src);
    printf("\\nIterative DFS: ");
    dfsIter(src);
    printf("\\n");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;
#define MAX 100

int adj[MAX][MAX], visited[MAX], n;

void dfsRec(int u) {
    visited[u] = 1;
    cout << u << " ";
    for (int v = 0; v < n; v++)
        if (adj[u][v] && !visited[v])
            dfsRec(v);
}

void dfsIter(int start) {
    int stack_[MAX], top = -1;
    int seen[MAX] = {0};
    stack_[++top] = start;
    while (top >= 0) {
        int u = stack_[top--];
        if (seen[u]) continue;
        seen[u] = 1;
        cout << u << " ";
        for (int v = n - 1; v >= 0; v--)
            if (adj[u][v] && !seen[v])
                stack_[++top] = v;
    }
}

int main() {
    int e, u, v, src;
    cout << "Vertices: "; cin >> n;
    cout << "Edges: ";    cin >> e;
    cout << "Edges (u v):\\n";
    while (e--) { cin >> u >> v; adj[u][v] = adj[v][u] = 1; }
    cout << "Source: "; cin >> src;

    cout << "Recursive DFS: "; dfsRec(src);
    cout << "\\nIterative DFS: "; dfsIter(src);
    cout << endl;
    return 0;
}`,
  viva: [
    { q: "Which data structure does DFS use?", a: "A stack — either explicit (iterative) or implicit via recursion." },
    { q: "Time complexity with an adjacency matrix?", a: "O(V²); with adjacency list it is O(V + E)." },
    { q: "Applications of DFS?", a: "Cycle detection, topological sorting (DAGs), strongly connected components (Kosaraju/Tarjan), finding bridges & articulation points, maze solving." },
    { q: "Difference between recursive and iterative DFS?", a: "Recursive uses the system call-stack; iterative uses an explicit stack. Iterative avoids stack overflow on deep graphs and is preferable in production." },
    { q: "How does DFS detect a cycle?", a: "In a directed graph by tracking vertices in the current DFS path; if we encounter a back-edge to an ancestor a cycle exists. In an undirected graph by spotting a visited neighbour that is not the parent." },
    { q: "Can DFS find shortest paths?", a: "Not in general for unweighted graphs; it may find a longer path before a shorter one. Use BFS for shortest paths in unweighted graphs." }
  ]
},

/* ============================================================
   8. FRACTIONAL KNAPSACK
============================================================ */
{
  id: 8,
  name: "Fractional Knapsack",
  short: "Fractional Knapsack",
  tags: ["Greedy"],
  concept: `In the Fractional Knapsack problem we have <code>n</code> items, each with a weight and value, and a knapsack with capacity <code>W</code>. We may take any fraction of an item. The goal is to maximize total value. The <strong>greedy</strong> strategy is to sort items by <code>value/weight</code> ratio in descending order and take items fully while there is enough capacity, then take a fraction of the next item. Unlike 0/1 Knapsack, the greedy solution here is optimal.`,
  process: [
    "Compute the ratio <code>value[i]/weight[i]</code> for every item.",
    "Sort items in <strong>descending</strong> order of this ratio.",
    "Initialize <code>totalValue = 0</code> and remaining capacity <code>= W</code>.",
    "Iterate through the sorted list:",
    "&nbsp;&nbsp;&nbsp;– if the whole item fits, add its value and subtract its weight from capacity;",
    "&nbsp;&nbsp;&nbsp;– otherwise take a fraction <code>(remaining / weight) * value</code> and stop.",
    "Return <code>totalValue</code>."
  ],
  complexity: { best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  c: `#include <stdio.h>
#define MAX 100

typedef struct { float weight, value, ratio; } Item;

void sortByRatio(Item items[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (items[j].ratio < items[j + 1].ratio) {
                Item t = items[j]; items[j] = items[j+1]; items[j+1] = t;
            }
}

float fractionalKnapsack(Item items[], int n, float W) {
    sortByRatio(items, n);
    float totalValue = 0;
    for (int i = 0; i < n && W > 0; i++) {
        if (items[i].weight <= W) {
            totalValue += items[i].value;
            W -= items[i].weight;
        } else {
            totalValue += items[i].ratio * W;
            W = 0;
        }
    }
    return totalValue;
}

int main(void) {
    int n;
    float W;
    printf("Number of items: "); scanf("%d", &n);
    Item items[MAX];
    printf("Enter weight and value of each item:\\n");
    for (int i = 0; i < n; i++) {
        scanf("%f %f", &items[i].weight, &items[i].value);
        items[i].ratio = items[i].value / items[i].weight;
    }
    printf("Capacity: "); scanf("%f", &W);

    float ans = fractionalKnapsack(items, n, W);
    printf("Maximum value = %.2f\\n", ans);
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

struct Item { double weight, value, ratio; };

void sortByRatio(vector<Item>& a) {
    int n = a.size();
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (a[j].ratio < a[j+1].ratio) swap(a[j], a[j+1]);
}

double fractionalKnapsack(vector<Item> items, double W) {
    sortByRatio(items);
    double total = 0;
    for (auto& it : items) {
        if (W <= 0) break;
        if (it.weight <= W) { total += it.value; W -= it.weight; }
        else                { total += it.ratio * W; W = 0; }
    }
    return total;
}

int main() {
    int n; cout << "Items: "; cin >> n;
    vector<Item> items(n);
    cout << "Enter weight value for each:\\n";
    for (auto& it : items) {
        cin >> it.weight >> it.value;
        it.ratio = it.value / it.weight;
    }
    double W; cout << "Capacity: "; cin >> W;
    cout << "Max value = " << fractionalKnapsack(items, W) << endl;
    return 0;
}`,
  viva: [
    { q: "Why does greedy work for fractional knapsack?", a: "Because we can split items. Taking the highest value-per-weight first is provably optimal — any swap leads to equal or lesser total." },
    { q: "Why doesn't greedy work for 0/1 knapsack?", a: "Because items cannot be split; the high-ratio item may not fit while a combination of smaller items might yield more value." },
    { q: "Time complexity?", a: "O(n log n) due to sorting (O(n²) with bubble sort as shown). After sorting, the selection loop is O(n)." },
    { q: "What is the greedy choice property here?", a: "At each step, choose the item with the highest value/weight ratio that still has capacity left." },
    { q: "What is the type of problem (optimization)?", a: "It is a classic optimization problem solved with a greedy strategy. The exchange-argument proof shows the greedy choice never reduces optimality." },
    { q: "Difference from 0/1 knapsack solution technique?", a: "0/1 Knapsack uses dynamic programming and is NP-hard in general; fractional is solvable greedily in polynomial time." }
  ]
},

/* ============================================================
   9. JOB SEQUENCING WITH DEADLINES
============================================================ */
{
  id: 9,
  name: "Job Sequencing with Deadlines",
  short: "Job Sequencing",
  tags: ["Greedy", "Scheduling"],
  concept: `We are given <code>n</code> jobs, each with a deadline and a profit. Each job takes one unit of time and only one job can be scheduled at a time. The goal is to schedule a subset of jobs to maximize the total profit such that no job misses its deadline. The greedy approach sorts jobs by descending profit, then places each job in the latest free time-slot on or before its deadline. If no slot is free, the job is skipped.`,
  process: [
    "Sort jobs in descending order of profit.",
    "Find the maximum deadline among all jobs; create a <code>slot[]</code> array of that size, all initially free.",
    "For every job (in sorted order):",
    "&nbsp;&nbsp;&nbsp;– for <code>t</code> = <code>min(maxDeadline, deadline) - 1</code> down to <code>0</code>:",
    "&nbsp;&nbsp;&nbsp;– if <code>slot[t]</code> is free, assign the job there and stop.",
    "Sum the profits of scheduled jobs."
  ],
  complexity: { best: "O(n²)", avg: "O(n²)", worst: "O(n²)", space: "O(n)" },
  c: `#include <stdio.h>

typedef struct { char id; int deadline, profit; } Job;

void sortJobs(Job jobs[], int n) {
    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < n - i - 1; j++)
            if (jobs[j].profit < jobs[j + 1].profit) {
                Job t = jobs[j]; jobs[j] = jobs[j+1]; jobs[j+1] = t;
            }
}

int maxDeadline(Job jobs[], int n) {
    int m = 0;
    for (int i = 0; i < n; i++) if (jobs[i].deadline > m) m = jobs[i].deadline;
    return m;
}

void jobSequencing(Job jobs[], int n) {
    sortJobs(jobs, n);
    int M = maxDeadline(jobs, n);
    char slot[M];           int used[M];
    for (int i = 0; i < M; i++) used[i] = 0;

    int totalProfit = 0;
    for (int i = 0; i < n; i++) {
        for (int t = (jobs[i].deadline < M ? jobs[i].deadline : M) - 1; t >= 0; t--)
            if (!used[t]) { slot[t] = jobs[i].id; used[t] = 1; totalProfit += jobs[i].profit; break; }
    }

    printf("Scheduled jobs: ");
    for (int i = 0; i < M; i++) if (used[i]) printf("%c ", slot[i]);
    printf("\\nTotal profit = %d\\n", totalProfit);
}

int main(void) {
    int n;
    printf("Number of jobs: "); scanf("%d", &n);
    Job jobs[n];
    printf("Enter id deadline profit:\\n");
    for (int i = 0; i < n; i++)
        scanf(" %c %d %d", &jobs[i].id, &jobs[i].deadline, &jobs[i].profit);
    jobSequencing(jobs, n);
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

struct Job { char id; int deadline, profit; };

void sortJobs(vector<Job>& j) {
    int n = j.size();
    for (int i = 0; i < n - 1; i++)
        for (int k = 0; k < n - i - 1; k++)
            if (j[k].profit < j[k+1].profit) swap(j[k], j[k+1]);
}

void jobSequencing(vector<Job> jobs) {
    sortJobs(jobs);
    int M = 0;
    for (auto& j : jobs) M = max(M, j.deadline);

    vector<char> slot(M, '-');
    vector<bool> used(M, false);
    int totalProfit = 0;

    for (auto& j : jobs)
        for (int t = min(M, j.deadline) - 1; t >= 0; t--)
            if (!used[t]) { slot[t] = j.id; used[t] = true; totalProfit += j.profit; break; }

    cout << "Scheduled: ";
    for (int i = 0; i < M; i++) if (used[i]) cout << slot[i] << " ";
    cout << "\\nTotal profit = " << totalProfit << endl;
}

int main() {
    int n; cout << "Jobs: "; cin >> n;
    vector<Job> jobs(n);
    cout << "id deadline profit:\\n";
    for (auto& j : jobs) cin >> j.id >> j.deadline >> j.profit;
    jobSequencing(jobs);
    return 0;
}`,
  viva: [
    { q: "Why sort jobs by profit in descending order?", a: "Greedy choice: scheduling the most profitable job first guarantees we never lose a high-profit opportunity to a lower-profit one." },
    { q: "Why pick the latest free slot before deadline?", a: "To keep earlier slots free for other jobs that may have tighter deadlines." },
    { q: "Time complexity?", a: "O(n²) with a simple latest-free-slot scan. With Disjoint Set Union (Union-Find) it can be O(n log n)." },
    { q: "How can you improve performance?", a: "Use a Disjoint Set Union to find the latest free slot in nearly constant amortized time, reducing complexity to O(n α(n))." },
    { q: "What is the greedy property used?", a: "Local optimality (max profit) leads to global optimality because each unit time-slot is independent; rearranging never improves." }
  ]
},

/* ============================================================
   10. KRUSKAL'S ALGORITHM
============================================================ */
{
  id: 10,
  name: "Kruskal's Algorithm",
  short: "Kruskal's MST",
  tags: ["Greedy", "MST", "Graph"],
  concept: `Kruskal's algorithm finds a <strong>Minimum Spanning Tree (MST)</strong> in a weighted undirected graph. An MST is a tree that connects all vertices with the minimum possible total edge weight. Kruskal sorts all edges by weight and adds them one by one to the MST, skipping any edge that would form a cycle. Cycle detection is done with the <strong>Union-Find (Disjoint Set Union)</strong> data structure.`,
  process: [
    "Sort all edges in non-decreasing order of weight.",
    "Initialize a Disjoint Set: every vertex is its own set.",
    "Iterate through the sorted edges:",
    "&nbsp;&nbsp;&nbsp;– find the sets of <code>u</code> and <code>v</code>;",
    "&nbsp;&nbsp;&nbsp;– if they are in different sets, add the edge to the MST and union the two sets;",
    "&nbsp;&nbsp;&nbsp;– otherwise skip (it would create a cycle).",
    "Stop when the MST contains <code>V - 1</code> edges."
  ],
  complexity: { best: "O(E log E)", avg: "O(E log E)", worst: "O(E log E)", space: "O(V + E)" },
  c: `#include <stdio.h>
#include <stdlib.h>

typedef struct { int u, v, w; } Edge;

int parent[100], rnk[100];

int find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (rnk[a] < rnk[b]) parent[a] = b;
    else if (rnk[a] > rnk[b]) parent[b] = a;
    else { parent[b] = a; rnk[a]++; }
}

int cmp(const void *a, const void *b) {
    return ((Edge*)a)->w - ((Edge*)b)->w;
}

int main(void) {
    int n, e;
    printf("Vertices: "); scanf("%d", &n);
    printf("Edges: ");    scanf("%d", &e);
    Edge edges[e];
    printf("Enter u v w for each edge:\\n");
    for (int i = 0; i < e; i++) scanf("%d %d %d", &edges[i].u, &edges[i].v, &edges[i].w);

    qsort(edges, e, sizeof(Edge), cmp);
    for (int i = 0; i < n; i++) { parent[i] = i; rnk[i] = 0; }

    int totalCost = 0, taken = 0;
    printf("MST edges:\\n");
    for (int i = 0; i < e && taken < n - 1; i++) {
        if (find(edges[i].u) != find(edges[i].v)) {
            unite(edges[i].u, edges[i].v);
            printf("%d - %d : %d\\n", edges[i].u, edges[i].v, edges[i].w);
            totalCost += edges[i].w;
            taken++;
        }
    }
    printf("Total cost = %d\\n", totalCost);
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Edge { int u, v, w; };
int parent[100], rnk[100];

int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (rnk[a] < rnk[b]) parent[a] = b;
    else if (rnk[a] > rnk[b]) parent[b] = a;
    else { parent[b] = a; rnk[a]++; }
}

int main() {
    int n, e;
    cout << "Vertices: "; cin >> n;
    cout << "Edges: ";    cin >> e;
    vector<Edge> edges(e);
    cout << "u v w:\\n";
    for (auto& x : edges) cin >> x.u >> x.v >> x.w;

    sort(edges.begin(), edges.end(),
         [](Edge a, Edge b){ return a.w < b.w; });
    for (int i = 0; i < n; i++) { parent[i] = i; rnk[i] = 0; }

    int total = 0, taken = 0;
    cout << "MST edges:\\n";
    for (auto& x : edges) {
        if (taken == n - 1) break;
        if (find(x.u) != find(x.v)) {
            unite(x.u, x.v);
            cout << x.u << " - " << x.v << " : " << x.w << "\\n";
            total += x.w; taken++;
        }
    }
    cout << "Total cost = " << total << endl;
    return 0;
}`,
  viva: [
    { q: "What is a Minimum Spanning Tree?", a: "A spanning tree of a connected weighted graph that uses V - 1 edges with the smallest possible total weight." },
    { q: "Time complexity of Kruskal's?", a: "O(E log E) for sorting, plus nearly-linear Disjoint Set operations. Overall O(E log E) ≈ O(E log V)." },
    { q: "Is Kruskal's algorithm greedy?", a: "Yes — at each step it greedily picks the smallest-weight edge that does not create a cycle." },
    { q: "What does Union-Find do here?", a: "It efficiently detects whether two vertices are in the same connected component (i.e., whether adding an edge would create a cycle)." },
    { q: "Is Kruskal's better for dense or sparse graphs?", a: "Sparse graphs — sorting edges is the dominant cost, and Prim's with an adjacency matrix is faster on dense graphs." },
    { q: "Does Kruskal's work on disconnected graphs?", a: "It produces a minimum spanning <i>forest</i> rather than a tree." }
  ]
},

/* ============================================================
   11. PRIM'S ALGORITHM
============================================================ */
{
  id: 11,
  name: "Prim's Algorithm",
  short: "Prim's MST",
  tags: ["Greedy", "MST", "Graph"],
  concept: `Prim's algorithm also computes a Minimum Spanning Tree but grows it <strong>vertex by vertex</strong> starting from an arbitrary source. At every step it adds the minimum-weight edge that connects a vertex already in the tree to a vertex outside the tree. Using an adjacency matrix and a <code>key[]</code> array, the algorithm runs in <code>O(V²)</code> time; with a binary heap it improves to <code>O(E log V)</code>.`,
  process: [
    "Initialize <code>key[v] = ∞</code> for every vertex, <code>parent[v] = -1</code>, and <code>inMST[v] = false</code>.",
    "Set <code>key[0] = 0</code> (start vertex).",
    "Repeat V times:",
    "&nbsp;&nbsp;&nbsp;– pick the vertex <code>u</code> with the minimum <code>key</code> among those not yet in the MST;",
    "&nbsp;&nbsp;&nbsp;– mark <code>inMST[u] = true</code>;",
    "&nbsp;&nbsp;&nbsp;– for every neighbour <code>v</code>: if <code>v</code> is not in MST and <code>graph[u][v] &lt; key[v]</code>, update <code>key[v]</code> and <code>parent[v] = u</code>.",
    "Output the parent array as the MST."
  ],
  complexity: { best: "O(V²)", avg: "O(V²)", worst: "O(V²)", space: "O(V)" },
  c: `#include <stdio.h>
#include <limits.h>
#define V 100

int graph[V][V], n;

int minKey(int key[], int inMST[]) {
    int min = INT_MAX, minIndex = -1;
    for (int v = 0; v < n; v++)
        if (!inMST[v] && key[v] < min) { min = key[v]; minIndex = v; }
    return minIndex;
}

void primMST() {
    int parent[V], key[V], inMST[V];
    for (int i = 0; i < n; i++) { key[i] = INT_MAX; inMST[i] = 0; parent[i] = -1; }
    key[0] = 0;

    for (int count = 0; count < n - 1; count++) {
        int u = minKey(key, inMST);
        inMST[u] = 1;
        for (int v = 0; v < n; v++)
            if (graph[u][v] && !inMST[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
    }

    int total = 0;
    printf("Edge\\tWeight\\n");
    for (int i = 1; i < n; i++) {
        printf("%d - %d\\t%d\\n", parent[i], i, graph[i][parent[i]]);
        total += graph[i][parent[i]];
    }
    printf("Total cost = %d\\n", total);
}

int main(void) {
    printf("Vertices: "); scanf("%d", &n);
    printf("Enter adjacency matrix (%d x %d), 0 if no edge:\\n", n, n);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) scanf("%d", &graph[i][j]);
    primMST();
    return 0;
}`,
  cpp: `#include <iostream>
#include <climits>
#include <vector>
using namespace std;

void primMST(vector<vector<int>>& g, int n) {
    vector<int> key(n, INT_MAX), parent(n, -1);
    vector<bool> inMST(n, false);
    key[0] = 0;

    for (int count = 0; count < n - 1; count++) {
        int u = -1, min_ = INT_MAX;
        for (int v = 0; v < n; v++)
            if (!inMST[v] && key[v] < min_) { min_ = key[v]; u = v; }

        inMST[u] = true;
        for (int v = 0; v < n; v++)
            if (g[u][v] && !inMST[v] && g[u][v] < key[v]) {
                parent[v] = u;
                key[v]    = g[u][v];
            }
    }

    int total = 0;
    cout << "Edge\\tWeight\\n";
    for (int i = 1; i < n; i++) {
        cout << parent[i] << " - " << i << "\\t" << g[i][parent[i]] << "\\n";
        total += g[i][parent[i]];
    }
    cout << "Total cost = " << total << endl;
}

int main() {
    int n; cout << "Vertices: "; cin >> n;
    vector<vector<int>> g(n, vector<int>(n));
    cout << "Adjacency matrix (0 if no edge):\\n";
    for (auto& r : g) for (auto& x : r) cin >> x;
    primMST(g, n);
    return 0;
}`,
  viva: [
    { q: "Difference between Prim's and Kruskal's?", a: "Prim's grows a single tree from a source; Kruskal's grows a forest by sorting edges. Prim's prefers dense graphs (matrix); Kruskal's prefers sparse." },
    { q: "Time complexity of Prim's?", a: "O(V²) using an adjacency matrix and a <code>key</code> array; O(E log V) using an adjacency list with a binary heap; O(E + V log V) using a Fibonacci heap." },
    { q: "Is Prim's greedy?", a: "Yes — at each step it greedily adds the minimum-weight crossing edge from the current tree." },
    { q: "Does Prim's work on disconnected graphs?", a: "It can only build the MST of the component containing the source. To cover all components, run from each component's representative." },
    { q: "What is the cut property used to prove correctness?", a: "For any cut of the graph, the lightest crossing edge is in some MST. Prim's always picks such an edge across the cut between in-MST and out-MST." }
  ]
},

/* ============================================================
   12. DIJKSTRA'S ALGORITHM
============================================================ */
{
  id: 12,
  name: "Dijkstra's Algorithm",
  short: "Dijkstra's",
  tags: ["Greedy", "Shortest Path", "Graph"],
  concept: `Dijkstra's algorithm computes the shortest distance from a single source to every other vertex in a graph with <strong>non-negative</strong> edge weights. It maintains a distance array initialised to infinity (except the source = 0), then repeatedly picks the unvisited vertex with the smallest distance, marks it finalized, and <strong>relaxes</strong> its outgoing edges. The algorithm is greedy: once a vertex's distance is finalised it never changes.`,
  process: [
    "Set <code>dist[source] = 0</code> and <code>dist[v] = ∞</code> for every other vertex. Mark all vertices as not finalized.",
    "Repeat V times:",
    "&nbsp;&nbsp;&nbsp;– select the unfinalized vertex <code>u</code> with the smallest <code>dist[u]</code>;",
    "&nbsp;&nbsp;&nbsp;– mark <code>u</code> finalized;",
    "&nbsp;&nbsp;&nbsp;– for every neighbour <code>v</code> of <code>u</code>: if <code>dist[u] + w(u,v) &lt; dist[v]</code>, update <code>dist[v] = dist[u] + w(u,v)</code>.",
    "After the loop, <code>dist[v]</code> holds the shortest distance from source to <code>v</code>."
  ],
  complexity: { best: "O(V²)", avg: "O(V²)", worst: "O(V²)", space: "O(V)" },
  c: `#include <stdio.h>
#include <limits.h>
#define V 100

int graph[V][V], n;

int minDist(int dist[], int visited[]) {
    int min = INT_MAX, idx = -1;
    for (int v = 0; v < n; v++)
        if (!visited[v] && dist[v] < min) { min = dist[v]; idx = v; }
    return idx;
}

void dijkstra(int src) {
    int dist[V], visited[V];
    for (int i = 0; i < n; i++) { dist[i] = INT_MAX; visited[i] = 0; }
    dist[src] = 0;

    for (int count = 0; count < n - 1; count++) {
        int u = minDist(dist, visited);
        if (u == -1) break;
        visited[u] = 1;
        for (int v = 0; v < n; v++)
            if (!visited[v] && graph[u][v] && dist[u] != INT_MAX
                && dist[u] + graph[u][v] < dist[v])
                dist[v] = dist[u] + graph[u][v];
    }

    printf("Vertex\\tDistance from %d\\n", src);
    for (int i = 0; i < n; i++) printf("%d\\t%d\\n", i, dist[i]);
}

int main(void) {
    int src;
    printf("Vertices: "); scanf("%d", &n);
    printf("Adjacency matrix (0 if no edge):\\n");
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) scanf("%d", &graph[i][j]);
    printf("Source: "); scanf("%d", &src);
    dijkstra(src);
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

void dijkstra(vector<vector<int>>& g, int src) {
    int n = g.size();
    vector<int> dist(n, INT_MAX);
    vector<bool> visited(n, false);
    dist[src] = 0;

    for (int count = 0; count < n - 1; count++) {
        int u = -1, min_ = INT_MAX;
        for (int v = 0; v < n; v++)
            if (!visited[v] && dist[v] < min_) { min_ = dist[v]; u = v; }
        if (u == -1) break;
        visited[u] = true;
        for (int v = 0; v < n; v++)
            if (!visited[v] && g[u][v] && dist[u] != INT_MAX
                && dist[u] + g[u][v] < dist[v])
                dist[v] = dist[u] + g[u][v];
    }

    cout << "Vertex\\tDistance\\n";
    for (int i = 0; i < n; i++) cout << i << "\\t" << dist[i] << "\\n";
}

int main() {
    int n, src;
    cout << "Vertices: "; cin >> n;
    vector<vector<int>> g(n, vector<int>(n));
    cout << "Adjacency matrix:\\n";
    for (auto& r : g) for (auto& x : r) cin >> x;
    cout << "Source: "; cin >> src;
    dijkstra(g, src);
    return 0;
}`,
  viva: [
    { q: "Does Dijkstra's work with negative weights?", a: "No. A negative edge can decrease the distance of an already-finalized vertex, violating the greedy invariant. Use Bellman-Ford instead." },
    { q: "Time complexity?", a: "O(V²) with an adjacency matrix; O((V + E) log V) using a binary heap + adjacency list; O(E + V log V) with a Fibonacci heap." },
    { q: "Why is it a greedy algorithm?", a: "At each step it greedily picks the closest unfinalized vertex; that distance is provably final under non-negative weights." },
    { q: "Difference between Dijkstra's and Prim's?", a: "Both grow from a source, but Prim's compares only the weight of the connecting edge, while Dijkstra's compares the total distance from the source." },
    { q: "Can Dijkstra's detect negative cycles?", a: "No. It assumes non-negative edges and can produce wrong results if negatives are present." }
  ]
},

/* ============================================================
   13. BELLMAN-FORD ALGORITHM
============================================================ */
{
  id: 13,
  name: "Bellman-Ford Algorithm",
  short: "Bellman-Ford",
  tags: ["DP", "Shortest Path", "Graph"],
  concept: `Bellman-Ford computes single-source shortest paths in graphs that may have <strong>negative-weight edges</strong>. Unlike Dijkstra's, it does not require non-negative weights and can also <strong>detect negative-weight cycles</strong> reachable from the source. The algorithm relaxes every edge <code>V - 1</code> times. If any distance can still be improved on a V-th pass, a negative cycle exists. The complexity is <code>O(V·E)</code>.`,
  process: [
    "Initialize <code>dist[source] = 0</code> and <code>dist[v] = ∞</code> for all other vertices.",
    "Repeat <code>V - 1</code> times:",
    "&nbsp;&nbsp;&nbsp;– for every edge <code>(u, v, w)</code>: if <code>dist[u] + w &lt; dist[v]</code>, update <code>dist[v] = dist[u] + w</code>.",
    "Run one more pass over all edges:",
    "&nbsp;&nbsp;&nbsp;– if any distance can still be reduced, report a negative-weight cycle.",
    "Otherwise <code>dist[]</code> holds the shortest distances."
  ],
  complexity: { best: "O(VE)", avg: "O(VE)", worst: "O(VE)", space: "O(V)" },
  c: `#include <stdio.h>
#include <limits.h>

typedef struct { int u, v, w; } Edge;

int main(void) {
    int n, e, src;
    printf("Vertices: "); scanf("%d", &n);
    printf("Edges: ");    scanf("%d", &e);
    Edge edges[e];
    printf("u v w:\\n");
    for (int i = 0; i < e; i++) scanf("%d %d %d", &edges[i].u, &edges[i].v, &edges[i].w);
    printf("Source: "); scanf("%d", &src);

    long dist[n];
    for (int i = 0; i < n; i++) dist[i] = LONG_MAX;
    dist[src] = 0;

    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < e; j++) {
            int u = edges[j].u, v = edges[j].v, w = edges[j].w;
            if (dist[u] != LONG_MAX && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
        }

    /* Detect negative cycle */
    for (int j = 0; j < e; j++) {
        int u = edges[j].u, v = edges[j].v, w = edges[j].w;
        if (dist[u] != LONG_MAX && dist[u] + w < dist[v]) {
            printf("Negative-weight cycle detected.\\n"); return 0;
        }
    }

    printf("Vertex\\tDistance from %d\\n", src);
    for (int i = 0; i < n; i++) {
        if (dist[i] == LONG_MAX) printf("%d\\tINF\\n", i);
        else                     printf("%d\\t%ld\\n", i, dist[i]);
    }
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

struct Edge { int u, v, w; };

int main() {
    int n, e, src;
    cout << "Vertices: "; cin >> n;
    cout << "Edges: ";    cin >> e;
    vector<Edge> edges(e);
    cout << "u v w:\\n";
    for (auto& x : edges) cin >> x.u >> x.v >> x.w;
    cout << "Source: "; cin >> src;

    vector<long long> dist(n, LLONG_MAX);
    dist[src] = 0;

    for (int i = 0; i < n - 1; i++)
        for (auto& x : edges)
            if (dist[x.u] != LLONG_MAX && dist[x.u] + x.w < dist[x.v])
                dist[x.v] = dist[x.u] + x.w;

    for (auto& x : edges)
        if (dist[x.u] != LLONG_MAX && dist[x.u] + x.w < dist[x.v]) {
            cout << "Negative-weight cycle detected." << endl;
            return 0;
        }

    cout << "Vertex\\tDistance\\n";
    for (int i = 0; i < n; i++) {
        if (dist[i] == LLONG_MAX) cout << i << "\\tINF\\n";
        else                       cout << i << "\\t" << dist[i] << "\\n";
    }
    return 0;
}`,
  viva: [
    { q: "Why V - 1 iterations?", a: "Any shortest simple path has at most V - 1 edges. After V - 1 relaxations, all distances are correct (in the absence of negative cycles)." },
    { q: "How does Bellman-Ford detect negative cycles?", a: "After V - 1 passes the distances are final. If a V-th pass still relaxes an edge, a negative-weight cycle exists." },
    { q: "Time complexity?", a: "O(V·E). For dense graphs it can be slower than Dijkstra's but it handles negatives." },
    { q: "When to use Bellman-Ford over Dijkstra's?", a: "Whenever the graph has negative weights or you need to detect a negative cycle." },
    { q: "Can Bellman-Ford be applied to undirected graphs with negative edges?", a: "Treat each undirected edge as two directed edges; but a single negative edge then forms a 2-cycle, so the answer is generally negative-cycle." }
  ]
},

/* ============================================================
   14. FLOYD-WARSHALL ALGORITHM
============================================================ */
{
  id: 14,
  name: "Floyd-Warshall Algorithm",
  short: "Floyd-Warshall",
  tags: ["DP", "All-Pairs Shortest Path", "Graph"],
  concept: `Floyd-Warshall finds the shortest distance between every pair of vertices in a weighted graph (with possibly negative weights, but no negative cycles). It uses dynamic programming over an intermediate vertex <code>k</code>: <code>dist[i][j]</code> is updated to the minimum of itself and <code>dist[i][k] + dist[k][j]</code> for every <code>k</code>. The algorithm runs in <code>O(V³)</code> time and is well suited for dense graphs.`,
  process: [
    "Initialize <code>dist[i][j]</code> = edge weight <code>(i, j)</code>, or <code>∞</code> if no edge. Set <code>dist[i][i] = 0</code>.",
    "For <code>k</code> from <code>0</code> to <code>V - 1</code>:",
    "&nbsp;&nbsp;&nbsp;– for <code>i</code> from <code>0</code> to <code>V - 1</code>:",
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;– for <code>j</code> from <code>0</code> to <code>V - 1</code>:",
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;– if <code>dist[i][k] + dist[k][j] &lt; dist[i][j]</code>, update <code>dist[i][j]</code>.",
    "After the triple loop, <code>dist[i][j]</code> is the shortest distance from <code>i</code> to <code>j</code>.",
    "A negative diagonal entry indicates a negative cycle."
  ],
  complexity: { best: "O(V³)", avg: "O(V³)", worst: "O(V³)", space: "O(V²)" },
  c: `#include <stdio.h>
#define INF 99999
#define V 100

int n;
int dist[V][V];

void floydWarshall() {
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];

    printf("Shortest distances:\\n");
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (dist[i][j] == INF) printf("INF\\t");
            else                   printf("%d\\t", dist[i][j]);
        }
        printf("\\n");
    }
}

int main(void) {
    printf("Vertices: "); scanf("%d", &n);
    printf("Adjacency matrix (use %d for no edge):\\n", INF);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) scanf("%d", &dist[i][j]);
    floydWarshall();
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;
const int INF = 99999;

void floydWarshall(vector<vector<int>>& d) {
    int n = d.size();
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (d[i][k] + d[k][j] < d[i][j])
                    d[i][j] = d[i][k] + d[k][j];

    cout << "Shortest distances:\\n";
    for (auto& row : d) {
        for (int x : row) {
            if (x >= INF) cout << "INF\\t";
            else          cout << x << "\\t";
        }
        cout << "\\n";
    }
}

int main() {
    int n; cout << "Vertices: "; cin >> n;
    vector<vector<int>> d(n, vector<int>(n));
    cout << "Adjacency matrix (use " << INF << " for no edge):\\n";
    for (auto& r : d) for (auto& x : r) cin >> x;
    floydWarshall(d);
    return 0;
}`,
  viva: [
    { q: "What is the time complexity?", a: "O(V³). Three nested loops over vertices." },
    { q: "Does Floyd-Warshall handle negative edges?", a: "Yes, as long as there is no negative cycle. A negative <code>dist[i][i]</code> after running indicates a cycle." },
    { q: "When prefer Floyd-Warshall over running Dijkstra's V times?", a: "When the graph is dense or has negative edges. Dijkstra's needs non-negative weights and V × O(V²) = O(V³) anyway, but Floyd-Warshall is simpler." },
    { q: "Why is the outermost loop <code>k</code>?", a: "Because k represents the set of allowed intermediate vertices {0..k}. After processing k, dist[i][j] is shortest using vertices ≤ k as intermediates." },
    { q: "What is the recurrence?", a: "dist^k[i][j] = min(dist^(k-1)[i][j], dist^(k-1)[i][k] + dist^(k-1)[k][j])." }
  ]
},

/* ============================================================
   15. MATRIX CHAIN MULTIPLICATION
============================================================ */
{
  id: 15,
  name: "Matrix Chain Multiplication",
  short: "Matrix Chain Mult.",
  tags: ["DP"],
  concept: `Given a chain of matrices <code>A1, A2, …, An</code> with dimensions <code>p0×p1, p1×p2, …, p(n-1)×pn</code>, we cannot change the order of the matrices, but we <em>can</em> change how they are parenthesized. The cost of multiplying <code>p×q</code> by <code>q×r</code> is <code>p·q·r</code> scalar multiplications. The aim is to find a parenthesization that minimizes the total cost. This is a classic dynamic-programming problem solved in <code>O(n³)</code> time.`,
  process: [
    "Let <code>m[i][j]</code> = minimum scalar multiplications to compute <code>A[i..j]</code>.",
    "Base case: <code>m[i][i] = 0</code> for all <code>i</code>.",
    "For chain length <code>L</code> from 2 to <code>n</code>:",
    "&nbsp;&nbsp;&nbsp;– for every <code>i</code> from 1 to <code>n - L + 1</code>:",
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;– <code>j = i + L - 1</code>, <code>m[i][j] = ∞</code>;",
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;– for every split <code>k</code> from <code>i</code> to <code>j - 1</code>:",
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;– <code>q = m[i][k] + m[k+1][j] + p[i-1]·p[k]·p[j]</code>;",
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;– if <code>q &lt; m[i][j]</code>, update <code>m[i][j] = q</code>.",
    "Answer is <code>m[1][n]</code>."
  ],
  complexity: { best: "O(n³)", avg: "O(n³)", worst: "O(n³)", space: "O(n²)" },
  c: `#include <stdio.h>
#include <limits.h>

int matrixChainOrder(int p[], int n) {
    int m[n][n];
    for (int i = 1; i < n; i++) m[i][i] = 0;
    for (int L = 2; L < n; L++) {
        for (int i = 1; i < n - L + 1; i++) {
            int j = i + L - 1;
            m[i][j] = INT_MAX;
            for (int k = i; k < j; k++) {
                int q = m[i][k] + m[k+1][j] + p[i-1] * p[k] * p[j];
                if (q < m[i][j]) m[i][j] = q;
            }
        }
    }
    return m[1][n-1];
}

int main(void) {
    int n;
    printf("Number of matrices: "); scanf("%d", &n);
    int p[n + 1];
    printf("Enter %d dimensions (p0 p1 ... pn): ", n + 1);
    for (int i = 0; i <= n; i++) scanf("%d", &p[i]);
    int cost = matrixChainOrder(p, n + 1);
    printf("Minimum scalar multiplications = %d\\n", cost);
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int matrixChainOrder(vector<int>& p) {
    int n = p.size();
    vector<vector<int>> m(n, vector<int>(n, 0));
    for (int L = 2; L < n; L++)
        for (int i = 1; i < n - L + 1; i++) {
            int j = i + L - 1;
            m[i][j] = INT_MAX;
            for (int k = i; k < j; k++) {
                int q = m[i][k] + m[k+1][j] + p[i-1] * p[k] * p[j];
                if (q < m[i][j]) m[i][j] = q;
            }
        }
    return m[1][n-1];
}

int main() {
    int n; cout << "Matrices: "; cin >> n;
    vector<int> p(n + 1);
    cout << "Dimensions (p0 .. pn): ";
    for (auto& x : p) cin >> x;
    cout << "Min multiplications = " << matrixChainOrder(p) << endl;
    return 0;
}`,
  viva: [
    { q: "What does the problem actually decide?", a: "Only the parenthesization (associative grouping). The order of matrices is fixed." },
    { q: "Time and space complexity?", a: "O(n³) time and O(n²) space." },
    { q: "Why is it a DP problem?", a: "It has optimal substructure (optimal parenthesization breaks into two optimal sub-products at some split k) and overlapping sub-problems (the same sub-chains are evaluated repeatedly in a naive recursive approach)." },
    { q: "What is the recurrence?", a: "m[i][j] = min over k in [i, j-1] of (m[i][k] + m[k+1][j] + p[i-1]·p[k]·p[j]); base case m[i][i] = 0." },
    { q: "How to recover the parenthesization?", a: "Store the optimal split <code>s[i][j] = k</code> while filling the DP table, then recursively print." }
  ]
},

/* ============================================================
   16. N-QUEEN PROBLEM
============================================================ */
{
  id: 16,
  name: "N-Queen Problem",
  short: "N-Queen",
  tags: ["Backtracking"],
  concept: `The N-Queen problem asks: place <code>n</code> queens on an <code>n × n</code> chessboard such that no two queens attack each other. A queen attacks along the same row, column and both diagonals. The standard solution uses <strong>backtracking</strong>: place queens column by column, check whether the current placement is safe, recurse to the next column, and backtrack if no safe row is found. The first valid placement is reported (or all placements can be enumerated).`,
  process: [
    "Start with column <code>col = 0</code>.",
    "For each row in the current column:",
    "&nbsp;&nbsp;&nbsp;– check whether placing a queen at <code>(row, col)</code> is safe (no conflict on row, upper-left diagonal, lower-left diagonal);",
    "&nbsp;&nbsp;&nbsp;– if safe, place the queen and recurse on column <code>col + 1</code>;",
    "&nbsp;&nbsp;&nbsp;– if the recursive call returns true, propagate success; otherwise <strong>backtrack</strong> (remove the queen).",
    "If <code>col == n</code>, all queens are placed — solution found.",
    "If no row works in column <code>col</code>, return false."
  ],
  complexity: { best: "O(N!)", avg: "O(N!)", worst: "O(N!)", space: "O(N²)" },
  c: `#include <stdio.h>
#include <stdbool.h>
#define MAX 20

int board[MAX][MAX], N;

void printBoard(void) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) printf("%c ", board[i][j] ? 'Q' : '.');
        printf("\\n");
    }
}

bool isSafe(int row, int col) {
    for (int i = 0; i < col; i++) if (board[row][i]) return false;
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false;
    for (int i = row, j = col; i < N && j >= 0; i++, j--) if (board[i][j]) return false;
    return true;
}

bool solve(int col) {
    if (col >= N) return true;
    for (int i = 0; i < N; i++) {
        if (isSafe(i, col)) {
            board[i][col] = 1;
            if (solve(col + 1)) return true;
            board[i][col] = 0;     /* backtrack */
        }
    }
    return false;
}

int main(void) {
    printf("Enter N: "); scanf("%d", &N);
    for (int i = 0; i < N; i++) for (int j = 0; j < N; j++) board[i][j] = 0;
    if (solve(0)) printBoard();
    else          printf("No solution exists.\\n");
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int N;
vector<vector<int>> board;

bool isSafe(int row, int col) {
    for (int i = 0; i < col; i++) if (board[row][i]) return false;
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false;
    for (int i = row, j = col; i < N && j >= 0; i++, j--) if (board[i][j]) return false;
    return true;
}

bool solve(int col) {
    if (col >= N) return true;
    for (int i = 0; i < N; i++) {
        if (isSafe(i, col)) {
            board[i][col] = 1;
            if (solve(col + 1)) return true;
            board[i][col] = 0;
        }
    }
    return false;
}

int main() {
    cout << "N: "; cin >> N;
    board.assign(N, vector<int>(N, 0));
    if (solve(0)) {
        for (auto& r : board) {
            for (int x : r) cout << (x ? 'Q' : '.') << " ";
            cout << "\\n";
        }
    } else cout << "No solution.\\n";
    return 0;
}`,
  viva: [
    { q: "Why is N-Queens classified as backtracking?", a: "We explore choices (place a queen in some row), recurse, and undo (remove the queen) when the partial solution cannot be extended." },
    { q: "What is the worst-case time complexity?", a: "Roughly O(N!), since we try N rows in the first column, then up to N - 1 in the next, and so on." },
    { q: "What is the constraint check?", a: "No queen on the same row, column, upper diagonal, or lower diagonal. Column conflict is automatic because we place one per column." },
    { q: "How many solutions exist for N = 8?", a: "92 in total, 12 unique up to reflection/rotation." },
    { q: "How can the algorithm be made faster?", a: "Track row/diagonal occupancy with boolean arrays (or bitmasks) for O(1) safety checks. Also use symmetry to skip mirrored states." }
  ]
},

/* ============================================================
   17. M-COLORING (GRAPH COLORING)
============================================================ */
{
  id: 17,
  name: "M-Coloring (Graph Coloring)",
  short: "M-Coloring",
  tags: ["Backtracking", "Graph"],
  concept: `Given an undirected graph and <code>m</code> colors, the M-Coloring problem asks whether we can color the vertices using at most <code>m</code> colors such that no two adjacent vertices share a color. The decision version is <strong>NP-complete</strong>. The standard solution uses <strong>backtracking</strong>: try assigning each color to the current vertex; if it does not conflict with already-colored neighbours, recurse on the next vertex; backtrack on failure.`,
  process: [
    "Initialize <code>color[v] = 0</code> for every vertex.",
    "Recursive function <code>graphColoring(v)</code>:",
    "&nbsp;&nbsp;&nbsp;– if <code>v == n</code>, all vertices are colored → return true;",
    "&nbsp;&nbsp;&nbsp;– for each color <code>c</code> from 1 to <code>m</code>:",
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;– if assigning <code>c</code> to vertex <code>v</code> is safe (no neighbour already has <code>c</code>), assign <code>color[v] = c</code> and recurse;",
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;– on failure, reset <code>color[v] = 0</code> (backtrack).",
    "Return false if no color works."
  ],
  complexity: { best: "O(m^N)", avg: "O(m^N)", worst: "O(m^N)", space: "O(N)" },
  c: `#include <stdio.h>
#include <stdbool.h>
#define V 20

int graph[V][V], color[V], n, m;

bool isSafe(int v, int c) {
    for (int i = 0; i < n; i++)
        if (graph[v][i] && color[i] == c) return false;
    return true;
}

bool graphColoring(int v) {
    if (v == n) return true;
    for (int c = 1; c <= m; c++) {
        if (isSafe(v, c)) {
            color[v] = c;
            if (graphColoring(v + 1)) return true;
            color[v] = 0;     /* backtrack */
        }
    }
    return false;
}

int main(void) {
    int e, u, v;
    printf("Vertices: "); scanf("%d", &n);
    printf("Edges: ");    scanf("%d", &e);
    printf("Edges (u v):\\n");
    for (int i = 0; i < e; i++) { scanf("%d %d", &u, &v); graph[u][v] = graph[v][u] = 1; }
    printf("Number of colors m: "); scanf("%d", &m);
    for (int i = 0; i < n; i++) color[i] = 0;

    if (graphColoring(0)) {
        printf("Coloring: ");
        for (int i = 0; i < n; i++) printf("V%d=%d ", i, color[i]);
        printf("\\n");
    } else {
        printf("Not possible with %d colors.\\n", m);
    }
    return 0;
}`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

int n, m;
vector<vector<int>> graph;
vector<int> color;

bool isSafe(int v, int c) {
    for (int i = 0; i < n; i++)
        if (graph[v][i] && color[i] == c) return false;
    return true;
}

bool graphColoring(int v) {
    if (v == n) return true;
    for (int c = 1; c <= m; c++) {
        if (isSafe(v, c)) {
            color[v] = c;
            if (graphColoring(v + 1)) return true;
            color[v] = 0;
        }
    }
    return false;
}

int main() {
    int e, u, v;
    cout << "Vertices: "; cin >> n;
    cout << "Edges: ";    cin >> e;
    graph.assign(n, vector<int>(n, 0));
    color.assign(n, 0);
    cout << "Edges (u v):\\n";
    while (e--) { cin >> u >> v; graph[u][v] = graph[v][u] = 1; }
    cout << "Colors m: "; cin >> m;

    if (graphColoring(0)) {
        cout << "Coloring: ";
        for (int i = 0; i < n; i++) cout << "V" << i << "=" << color[i] << " ";
        cout << endl;
    } else cout << "Not possible with " << m << " colors.\\n";
    return 0;
}`,
  viva: [
    { q: "What is the chromatic number of a graph?", a: "The minimum number of colors needed to properly color the graph. Determining it is NP-hard." },
    { q: "Why is graph coloring NP-complete?", a: "There is no known polynomial-time algorithm for general graphs and 3-coloring is one of Karp's 21 original NP-complete problems." },
    { q: "Time complexity?", a: "Worst-case O(m^N) — each vertex can take m colors and there are N vertices." },
    { q: "What is the role of backtracking here?", a: "It systematically tries every color for each vertex and undoes assignments that lead to dead-ends, pruning impossible branches." },
    { q: "Real-world applications?", a: "Map coloring, register allocation in compilers, time-table scheduling, frequency assignment in cellular networks, and Sudoku." }
  ]
}
];
