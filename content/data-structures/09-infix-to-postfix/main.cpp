#include <iostream>
#include <string>
#include <cctype>
using namespace std;

const int MAX = 256;

// operator precedence: higher binds tighter
int prec(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return 0;
}

bool isOperator(char c) { return c == '+' || c == '-' || c == '*' || c == '/' || c == '^'; }

// Converts infix to postfix. Returns true on success, false on error (message printed).
bool toPostfix(const string &in, string &out) {
    char st[MAX]; int top = -1;
    out = "";
    for (char c : in) {
        if (isalnum((unsigned char)c)) out += c;               // operand goes straight out
        else if (c == '(') st[++top] = c;
        else if (c == ')') {
            while (top >= 0 && st[top] != '(') out += st[top--];
            if (top < 0) { cout << "Mismatched parentheses\n"; return false; }
            top--;                                              // discard '('
        } else if (isOperator(c)) {
            // pop operators of higher precedence; equal precedence too, unless '^' (right associative)
            while (top >= 0 && st[top] != '(' &&
                   (prec(st[top]) > prec(c) || (prec(st[top]) == prec(c) && c != '^')))
                out += st[top--];
            st[++top] = c;
        } else { cout << "Invalid character '" << c << "'\n"; return false; }
    }
    while (top >= 0) {
        if (st[top] == '(') { cout << "Mismatched parentheses\n"; return false; }
        out += st[top--];
    }
    return true;
}

int power(int a, int b) { int r = 1; while (b-- > 0) r *= a; return r; }

// Evaluates a postfix string of single-digit operands. Returns true on success.
bool evalPostfix(const string &p, int &result) {
    int st[MAX], top = -1;
    for (char c : p) {
        if (isdigit((unsigned char)c)) st[++top] = c - '0';
        else if (isOperator(c)) {
            if (top < 1) { cout << "Invalid postfix expression\n"; return false; }
            int b = st[top--], a = st[top--];                   // b is the right operand
            switch (c) {
                case '+': st[++top] = a + b; break;
                case '-': st[++top] = a - b; break;
                case '*': st[++top] = a * b; break;
                case '/': if (b == 0) { cout << "Division by zero\n"; return false; }
                          st[++top] = a / b; break;
                case '^': st[++top] = power(a, b); break;
            }
        } else { cout << "Invalid character '" << c << "'\n"; return false; }
    }
    if (top != 0) { cout << "Invalid postfix expression\n"; return false; }
    result = st[0];
    return true;
}

int main() {
    int choice;
    string s, out;
    do {
        cout << "\n--- Infix to Postfix ---\n";
        cout << "1. Convert infix to postfix\n2. Evaluate postfix\n0. Exit\n";
        cout << "Enter choice: ";
        if (!(cin >> choice)) break;
        switch (choice) {
            case 1: cout << "Enter infix expression: "; cin >> s;
                    if (toPostfix(s, out)) cout << "Postfix: " << out << "\n";
                    break;
            case 2: cout << "Enter postfix expression: "; cin >> s;
                    { int r; if (evalPostfix(s, r)) cout << "Result: " << r << "\n"; }
                    break;
            case 0: cout << "Bye!\n"; break;
            default: cout << "Invalid choice\n";
        }
    } while (choice != 0);
    return 0;
}
