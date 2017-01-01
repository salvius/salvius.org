---
title: Abstract Data Types
---

## Link List

[HEAD]--> [ ][ ]--> [ ][/]

## Circular Linked list

[HEAD]--> [ ][ ]--> [ ][ ]--> [Back to HEAD]

## Doubally Linked List

[HEAD]<-->[ ][ ]<-->[ ][/]

## Circular Doubally Linked List

[HEAD]<-->[ ][ ]<-->[ ][ ]<-->[Back to HEAD]

## Dummy head

- Head points to the dummy head
- Has no data
- Dummy head is never removed

## Tail node

- Points to last node in the list

# Induction proofs

- f(0) = 0
- f(n) = f(n-1) + 3n
- Closed form: f(n) = 3n(n+1)/2

BASIS
f(0) = 0 in recurrence relationship
Substitute 0 for n in closed form: f(0) = 3 * 0 * (0+1) / 2 = 0

INDUCTIVE ASSUMPTION
Assume k is an integer, k > 0.
f(k) = 3k(k+1)/2

We want to show that f(k + 1) = 3 * (k+1) * (k+2) / 2

**Proof**

```
Plug k+1 in for n in the recursive relation
f(k+1) = f(k+1 - 1) + 3(k+1)
       = f(k) + 3(k+1)
       = 3k(k+1)/2 + 3(k+1)
       = 3k(k+1)/2 = 6(k+1)/2
       = (3k(k+1) + 6(k+1))/2
       = ((k+1)(3k+6))/2
       = 3(k+1)(K+2)/2      QED
```

# Axioms

- Things we can write that are true about out ADT
- EX: After creating a list, the list should be empty
- EX: After creatig a list, then adding an item, then removing an item, the list should be empty.

# Test Review Notes
Note: Review using recursion to traverse a list
Anything that takes a node as a parameter has to be private. <-- Is this statement correct?
The client can never know about nodes.
Nodes are package-privte.
