---
title: Discrete math review notes
---

﻿* Definition of a prime: An integer n>1 is prime if it is only divisible by one and itself.
* A number is rational if it can be written as ab where a and b are integers and b≠0.
* Direct - If P then Q
* Negation - P and Q̸
* Converse - If Q then P
* Contrapositive - If Q̸ then P̸
divisible by 10 if and only if its ones digit is 0.
In an expression a + b + c, if a and b are multiples of 5, then in order for the 
result to be a multiple of 5, c must also be divisible by 5. 
For example, 10 + 15 + 20 can be written as 5 * 2 + 5 * 3 + 5 * 4 = 5(2 + 3 + 4) 
Another example, a number 473 = 4 * 100 + 7 * 10 + 3


divisible by 3 if and only if the sum of its digits is divisible by 3.
Example 1: 3 | 3120 since 
3 | 3 + 1 + 3 + 0 
The symbol “|” means “divides into” 
Example 2: 713 is not divisible by 3 since 7 + 1 + 3 = 11 and 3 does not | 11.


divisible by 9 if and only if the sum of its digits is divisible by 9.
Example: 347 = 3(100) + 4(10) + 7 
= 3(99 + 1) + 4(9 + 1) + 7 
= 3 * 99 + 4 * 9 + (3 + 4 + 7) 
Notice the 99 and the 9


divisible by 6 if and only if and only if it is divisible by both 2 and 3.
Breaking 24 into it's prime number factorizations: 
24 = 2 * 3 * 2 * 2 
24/6 = 2 * 3 
n/6 = P1 * P2 * P3… / 2 * 3 
Example: n = 3120 
Since 2 | n and 3 | n then we know 6 | n
For the following number determine all possible ways to fill in the missing 
ones digit so that the number is divisible by 6.
4,32_ 
The ones digit must be either 0, 2, 4, 6 or 8. 
3 | 4320? Yes, 4 + 3 + 2 == 9 and 3 | 9 
3 | 4 + 3 + 2 and 3 does not go into 4 + 3 + 2 + 2 


divisible by 4 if and only if the number represented by its last two digits is divisible by 4.
Ex 1: 1784 = (1 * 1000) + (7 * 100) + (8 * 10) + 4 
Ex 2: Does 4 divide 342? 
No, because 4 does not divide 42.
    divisible by 2 if and only if it's ones digit is even (i.e. 0, 2, 4, 6, 8).
For instance, 8 is even because 8 / 4 = 2. In other words, its even because its evenly divisible by something.
divisible by 5 if and only if its ones digit it 0 or 5.
2 and 5 are the easiest to test because we are working with a base 10 system. 
2 and 5 are divisors of 10. 
Whatever system your in, the divisors of that system will be the easiest to work with.


divisible by 8 if and only if the number represented by its last 3 digits is divisible by 8.
Ex: 8 | 3120 since 8 | 120, i.e. 120 = 8 * 15.
Interesting therem: 
For 2^1 check the last digit 
For 2 squared check the the last two 
For 2 cubed chek the last three


divisible by 11 if and only if the alternating sum of its digits is divisible by 11.
* (Altername means alternate signs between + and -)
Ex: Let n = 6314 
6 - 3 + 1 - 4 = 0 
So, since 11 | 0 it must be that 11 | 6314 
Ex: Let n = 3120 
3 - 1 + 2 - 0 = 4 
Since 11 does not | 4, then 11 does not | 3120. 
What if we computed - 3 + 1 - 2 + 0 = -4? 
So since 11 does not | -4 (and in general, if 11 does not | a then 11 | -a) 
then the divisibility rule is unaffected.


divisible by 7 if and only if
* Use the following iterative process:
* Step 1: Take the last digit and remove it from the rest of the number.
* Last digit: d = n % 10, remove last digit: n = n/10
* Step 2: Subtract twice the last digit from the number formed by the remaining digits
* n = n - 2 * d
* Repeat steps one and two as needed.
* The original number n is divisible by 7 if and only if the number obtained by this iterative process is divisible by 7.
Ex: n = 392 
Step 1: d = 2, n = 39 
Step 2: n - 2d = 39 - 4 = 35 
True since 7 | 35, then 7 | 392
Ex: n = 1384 
Step 1: d = 4, n = 138 
Step 2: 138 - 2d = 130 
Repeat: 
Step 1: d = 0, n = 13 
Step 2: 13 - 2(0) = 13 
Since 7 does not | 13, then 7 does not divide 1384.
    

Primes 2, 3, 5, 7, 11, 13, 17…
Definition of a composite 1. An integer n > 1 is composite if it is not prime. 2. An integer n is composite if there exist integers a and b with 1 < a < n and 1 < b < n such that n = ab. 3. There exist positive integers r and s such that n = rs and r != 1 and s != 1.
Proof (contrapositive):
1. Assume n is even.
2. Then n=2k for some integer k
3. So n2=(2k)2=4k2=2(2k2).
4. Since 2k2 is an integer, n2 is even.
    Proof (contradiction):
1. Assume n2 is odd.
2. Suppose, to the contrary, that n is even.
3. Then n=2k for some integer k.
4. So n2−(2k)2=4k2−2(2k2).
5. Since 2k2 is an integer, n2 is even, contradicting that n2 is odd.
6. Therefore, n is odd.
    For any two integers m and n, 3m+5n is even if and only if m and n are of the same parity.
* NOTE: (Two integers m and n have the same parity if they are either both even or both odd.)
If 3m+5n is even, then m and n are of the same parity.
Proof (contrapositive): If m and n are of opposite parity, then 3m+5n is odd.
Case 1: m is even and n is odd.
Case 2: m is odd and n is even.
if m and n are of the same parity, then 3m+5n is even.
Proof (direct):
Case 1: m and n are both even.
Case 2: m and n are both odd.
    For any sets A, B, and C, (A−B)∪(A−C)=A−(B∩C).
1. Let A, B, and C be sets.
First we show that (A−B)∪(A−C)⊆A−(B∩C)
1. Let x∈(A−B)∪(A−C).
2. So x∈A−B or x∈A−C.
Case 1: x∈A−B
1. Then x∈A and x∉B.
2. So x∈A and since x∉B, we know x∉B∩C.
3. So x∈A−(B∩C).
Case 2: x∈A−C
1. Then x∈A and x∉C.
2. So x∈A and since x∉C, we know x∉B∩C.
3. So x∈A−(B∩C).
4. Thus x∈A−(B∩C), implying (A−B)∪(A−C)⊆A−(B∩C).
Next we show A−(B C)⊆(A−B)∪(A−C).
1. Let x∈A−(B∩C).
2. Then x∈A and x∉B∩C.
3. So x∈!(B∩C), which implies x∈!B∪!C.
4. So x∉B or x∉C.
Case 1: x∉B
1. Since x∈X and x∉B, we know x∈A−B.
2. Therefore x∈(A−B)∪(A−C).
Case 2: x∉C
1. Since x∈A and x∉C, we know x∈A−C.
2. Therefore x∈(A−B)∪(A−C)
    For all integers a, b, and c, if a|c and b|c, then ab|c. = False.
Let a=2, b=4, and c=12.
1. Then 2|12 and 4|12, but 2∗4=8/|12.
    For all integers a, b, c, and d, if a|b and c|d, then ac|bd. = True.
bd=ax∗cy=ac∗xy
1. Assume a|b and c|d.
2. Then b=ax and c=dy for some integers x and y.
3. So bd=ax∗cy=ac(xy)
4. Since xy is an integer, ac|bd.
    

Proof by Mathematical Induction using Factorials 
1 * 1! + 2 * 2! + 3 * 3! .. + n * n! = (n + 1)! = 1 for all n >= 1. 
Proof: Observe that when n = 1, 1 * 1! = 1 == 2! - 1 = (1 + 1)! - 1 proving the base case. 
Let k >= 1 be any arbitrary integer. 
Assume 1 * 1! + 2 * 2! + 3 * 3! .. + k * k! = (k + 1)! - 1. 
We want to show that 1 * 1! + 2 * 2! + 3 * 3! .. + k * k! = (k + 1) * (k + 1)! = (k + 2)! - 1 
1 * 1! + 2 * 2! + 3 * 3! .. + k * k! = (k + 1) * (k + 1)! = (k + 1)! - 1 + (k + 1) * (k + 1)! 
= (k + 1)! * (1 + k + 1) - 1 
= (k + 1)! * (k + 2) - 1 
= (k + 2)! - 1 
By the P.M.I., Eni=1 i * i = (n + 1)! - 1 for all n >= 1.
