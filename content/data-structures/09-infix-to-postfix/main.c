#include <stdio.h>
#include <ctype.h>
#include <string.h>

#define MAX 256

/* operator precedence: higher binds tighter */
int prec(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return 0;
}

int isOperator(char c) { return c == '+' || c == '-' || c == '*' || c == '/' || c == '^'; }

/* Converts infix to postfix. Returns 1 on success, 0 on error (message printed). */
int toPostfix(const char *in, char *out) {
    char st[MAX]; int top = -1, k = 0;
    for (int i = 0; in[i]; i++) {
        char c = in[i];
        if (isalnum((unsigned char)c)) out[k++] = c;           /* operand goes straight out */
        else if (c == '(') st[++top] = c;
        else if (c == ')') {
            while (top >= 0 && st[top] != '(') out[k++] = st[top--];
            if (top < 0) { printf("Mismatched parentheses\n"); return 0; }
            top--;                                              /* discard '(' */
        } else if (isOperator(c)) {
            /* pop operators of higher precedence; equal precedence too, unless '^' (right associative) */
            while (top >= 0 && st[top] != '(' &&
                   (prec(st[top]) > prec(c) || (prec(st[top]) == prec(c) && c != '^')))
                out[k++] = st[top--];
            st[++top] = c;
        } else { printf("Invalid character '%c'\n", c); return 0; }
    }
    while (top >= 0) {
        if (st[top] == '(') { printf("Mismatched parentheses\n"); return 0; }
        out[k++] = st[top--];
    }
    out[k] = '\0';
    return 1;
}

int power(int a, int b) { int r = 1; while (b-- > 0) r *= a; return r; }

/* Evaluates a postfix string of single-digit operands. Returns 1 on success. */
int evalPostfix(const char *p, int *result) {
    int st[MAX], top = -1;
    for (int i = 0; p[i]; i++) {
        char c = p[i];
        if (isdigit((unsigned char)c)) st[++top] = c - '0';
        else if (isOperator(c)) {
            if (top < 1) { printf("Invalid postfix expression\n"); return 0; }
            int b = st[top--], a = st[top--];                   /* b is the right operand */
            switch (c) {
                case '+': st[++top] = a + b; break;
                case '-': st[++top] = a - b; break;
                case '*': st[++top] = a * b; break;
                case '/': if (b == 0) { printf("Division by zero\n"); return 0; }
                          st[++top] = a / b; break;
                case '^': st[++top] = power(a, b); break;
            }
        } else { printf("Invalid character '%c'\n", c); return 0; }
    }
    if (top != 0) { printf("Invalid postfix expression\n"); return 0; }
    *result = st[0];
    return 1;
}

int main(void) {
    int choice;
    char s[MAX], out[MAX];
    do {
        printf("\n--- Infix to Postfix ---\n");
        printf("1. Convert infix to postfix\n2. Evaluate postfix\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        switch (choice) {
            case 1: printf("Enter infix expression: "); scanf("%255s", s);
                    if (toPostfix(s, out)) printf("Postfix: %s\n", out);
                    break;
            case 2: printf("Enter postfix expression: "); scanf("%255s", s);
                    { int r; if (evalPostfix(s, &r)) printf("Result: %d\n", r); }
                    break;
            case 0: printf("Bye!\n"); break;
            default: printf("Invalid choice\n");
        }
    } while (choice != 0);
    return 0;
}
