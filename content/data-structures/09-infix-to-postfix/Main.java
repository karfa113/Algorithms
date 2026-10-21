import java.util.Scanner;

public class Main {
    static final int MAX = 256;

    // operator precedence: higher binds tighter
    static int prec(char c) {
        if (c == '^') return 3;
        if (c == '*' || c == '/') return 2;
        if (c == '+' || c == '-') return 1;
        return 0;
    }

    static boolean isOperator(char c) { return c == '+' || c == '-' || c == '*' || c == '/' || c == '^'; }

    // Converts infix to postfix. Returns null on error (message printed).
    static String toPostfix(String in) {
        char[] st = new char[MAX];
        int top = -1;
        StringBuilder out = new StringBuilder();
        for (char c : in.toCharArray()) {
            if (Character.isLetterOrDigit(c)) out.append(c);   // operand goes straight out
            else if (c == '(') st[++top] = c;
            else if (c == ')') {
                while (top >= 0 && st[top] != '(') out.append(st[top--]);
                if (top < 0) { System.out.println("Mismatched parentheses"); return null; }
                top--;                                          // discard '('
            } else if (isOperator(c)) {
                // pop operators of higher precedence; equal precedence too, unless '^' (right associative)
                while (top >= 0 && st[top] != '(' &&
                       (prec(st[top]) > prec(c) || (prec(st[top]) == prec(c) && c != '^')))
                    out.append(st[top--]);
                st[++top] = c;
            } else { System.out.println("Invalid character '" + c + "'"); return null; }
        }
        while (top >= 0) {
            if (st[top] == '(') { System.out.println("Mismatched parentheses"); return null; }
            out.append(st[top--]);
        }
        return out.toString();
    }

    static int power(int a, int b) { int r = 1; while (b-- > 0) r *= a; return r; }

    // Evaluates a postfix string of single-digit operands. Returns null on error.
    static Integer evalPostfix(String p) {
        int[] st = new int[MAX];
        int top = -1;
        for (char c : p.toCharArray()) {
            if (c >= '0' && c <= '9') st[++top] = c - '0';
            else if (isOperator(c)) {
                if (top < 1) { System.out.println("Invalid postfix expression"); return null; }
                int b = st[top--], a = st[top--];               // b is the right operand
                switch (c) {
                    case '+': st[++top] = a + b; break;
                    case '-': st[++top] = a - b; break;
                    case '*': st[++top] = a * b; break;
                    case '/': if (b == 0) { System.out.println("Division by zero"); return null; }
                              st[++top] = a / b; break;
                    case '^': st[++top] = power(a, b); break;
                }
            } else { System.out.println("Invalid character '" + c + "'"); return null; }
        }
        if (top != 0) { System.out.println("Invalid postfix expression"); return null; }
        return st[0];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int choice;
        do {
            System.out.println("\n--- Infix to Postfix ---");
            System.out.println("1. Convert infix to postfix\n2. Evaluate postfix\n0. Exit");
            System.out.print("Enter choice: ");
            if (!sc.hasNextInt()) break;
            choice = sc.nextInt();
            switch (choice) {
                case 1: { System.out.print("Enter infix expression: ");
                          String r = toPostfix(sc.next());
                          if (r != null) System.out.println("Postfix: " + r); }
                        break;
                case 2: { System.out.print("Enter postfix expression: ");
                          Integer r = evalPostfix(sc.next());
                          if (r != null) System.out.println("Result: " + r); }
                        break;
                case 0: System.out.println("Bye!"); break;
                default: System.out.println("Invalid choice");
            }
        } while (choice != 0);
    }
}
