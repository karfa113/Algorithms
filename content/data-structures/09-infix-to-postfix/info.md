---
title: Infix to Postfix Conversion and Evaluation
short: Infix to Postfix
tags: Stack, Expression, Application
---

## Concept

In **infix** notation the operator sits between its operands (`A + B * C`), so we need precedence rules and parentheses to know the evaluation order. In **postfix** (Reverse Polish) notation the operator comes after its operands (`A B C * +`); the order of evaluation is fixed by the position alone, so no parentheses or precedence rules are needed. Computers prefer postfix because it can be evaluated in one left-to-right scan using a single stack.

Both algorithms are classic stack applications. **Conversion** (the shunting-yard idea) keeps a stack of operators: operands are copied to the output at once, and an operator waits on the stack until an operator of lower precedence arrives. **Evaluation** keeps a stack of values: operands are pushed, and each operator pops two values, applies itself, and pushes the result. In this program operands are single characters (single digits for evaluation), the operators are `+ - * / ^` and parentheses, and `^` is right associative while the rest are left associative.

## Operations

1. **Step 1:** Define precedence: `^` = 3, `*` and `/` = 2, `+` and `-` = 1.
2. **Step 2:** Infix to postfix. Create an empty operator stack `st` and an empty output string. Scan the infix string left to right; for each character `c`:
    - **(a)** If `c` is an operand (letter or digit), append it to the output.
    - **(b)** If `c` is `(`, push it on `st`.
    - **(c)** If `c` is `)`, pop operators to the output until `(` is on top, then pop and discard the `(`. If the stack becomes empty first, report mismatched parentheses.
    - **(d)** If `c` is an operator, repeatedly pop to the output while the top is not `(` and either `prec(top) > prec(c)`, or `prec(top) == prec(c)` and `c` is left associative (not `^`). Then push `c`.
3. **Step 3:** After the scan, pop all remaining operators to the output. If a `(` is found, report mismatched parentheses.
4. **Step 4:** Postfix evaluation. Create an empty value stack. Scan the postfix string left to right; for each character `c`:
    - **(a)** If `c` is a digit, push `c - '0'`.
    - **(b)** If `c` is an operator, pop `b` (right operand) and then `a` (left operand); if fewer than two values are available the expression is invalid.
    - **(c)** Compute `a op b` (report division by zero if `op` is `/` and `b == 0`) and push the result.
5. **Step 5:** At the end exactly one value must remain on the stack; that value is the answer. Otherwise the expression is invalid.
6. **Step 6:** Stop.

## Complexity

- Convert: O(n)
- Evaluate: O(n)
- Push / Pop: O(1)
- Space: O(n)

## Applications

- Compilers and interpreters evaluating arithmetic expressions.
- Stack-based calculators (HP Reverse Polish calculators) and virtual machines such as the JVM bytecode.
- Syntax parsing and expression trees.

## Viva

### Why is postfix notation preferred by computers?

It needs no parentheses and no precedence rules; a single left-to-right scan with a stack evaluates it in O(n).

### What is the postfix form of `A+B*C` and `(A+B)*C`?

`ABC*+` and `AB+C*`. Multiplication binds tighter in the first, while the parentheses force the addition first in the second.

### Why is `^` handled differently from the other operators?

It is right associative: `A^B^C` means `A^(B^C)`, so its postfix is `ABC^^`. For an equal-precedence operator on the stack we do not pop when the incoming operator is `^`. For left-associative `A-B-C` we do pop, giving `AB-C-`.

### What goes on the operator stack, and what happens to `(`?

Only operators and left parentheses. `(` is pushed unconditionally and is never popped by an operator; only a `)` removes it. That is why the pop loop stops at `(`.

### In postfix evaluation, which operand is popped first?

The right operand `b`. For `82/`, we pop `2` then `8` and compute `8 / 2`. Swapping them gives wrong answers for `-`, `/` and `^`.

### How do you detect an invalid expression?

During conversion: a `)` with no matching `(`, or a `(` left on the stack at the end. During evaluation: an operator with fewer than two values on the stack, or not exactly one value left at the end.

### How would you support multi-digit numbers?

Tokenise the input first (for example space-separated tokens, or accumulating consecutive digits into one number) and push whole numbers instead of single characters.

### What changes to convert infix to prefix?

Reverse the infix string (swapping `(` and `)`), convert it to postfix with the standard algorithm (with the associativity rules adjusted), and reverse the result.
