---
title: Logic and Statements
---

Statement - A mathematical phrase that is true or false

Examples:
- P: Today is Monday. --> false
- Q: The integer 5 is even. --> false
- R: The integer 0 is even. --> true

***
**Unrelated:** This shows how it is possible to proove that 0 is even.
n is even if and only if n = 2k for some integer k.
0 = 2 * 0
***

The following examples of P, Q and R display their meaning in plain terms.
- P v Q is true --> "At least one of these is true."
- Q ^ R is true --> "Both of these are true."
- P ⊕ R is true --> "One of these is true but not both."

Laws
====

> Demorgan's law:  
> ~(PvQ) ≡ ~P ^ ~Q  
> ~(P^Q) ≡ ~P v ~Q  

Examples:

> ~(1 ≤ n < 3)  
> <=========○-----●=========>  
>           1      3  
> Also: n < 1 OR n ≥ 3  

> 1 ≤ n < 3  
> <---------●=====○--------->  
>           1      3  

> 1.) Negate the following statements.  
> The earth has two moons or 3 + 5 < 2  
> The earth does not have two moons and 3 + 5 ≥ 2  

> 2.) Negate the following statements.  
> A stack overflow has occured and the sector size is not supported.  
> A stack overflow has not occured and the sector size is supported.  

> 3.) Negate the following statements.  
> x is positive or y is negative.  
> x is not positive or y is not negative.  

***

Conditional Statements (Implications)
=====================================

> P --> The hypothesis  
> Q --> The conclusion  

> If P then Q

> If n is even, then n<sup>2</sup> is even  
> Hypothesis: n is even  
> Conclusion: n<sup>2</sup> is even  

There is many ways in which implications can be worded. Some examples are:
> P => Q  
> If P, then Q  
> P implies Q  
> P only if Q  
> Q if P  
> P is sufficient for Q  
> Q is necessary for P  

## Negating an if then statement (negating an implication)

> ~(P => Q) ≡ ~(~P v Q)  
> ~(~P v Q) ≡ p ^ ~Q  

Examples:

> Negate the following.  
> If x > y, then x<sup>2</sup> > y<sup>2</sup>  
> x > y and x<sup>2</sup> ≤ y<sup>2</sup>  
> **Note:** Do not write the *If* in the negation.  

> Negate the following.  
> If rs = 0, then r = 0 or s = 0  
> rs = 0 and r != 0 and s != 0  
> **Notice:** The negation results in the form *P ^ ~Q*.  

## Contrapositive and converse statements

> If P, then Q.  
> Contrapositive: If ~Q, then ~P.  
> Converse: If Q, then P.  

> If T is equalateral, then T is isosceles.  
> **Note:** isosceles defines a triangle in which two sides are congruent.  
> Contrapositive: If T is not isoscelesm then T is not equalateral.  
> Converse: If T is isosceles, then T is equalateral.  
> **Note:** The contrapositive of this statement is true while the converse of this statement is false.  
> The contrapositive will always be logically equivilant to the origional statement.  

## Biconditional statements

> P <=> Q  
> "P if and only if Q"  
> "If p, then Q and if Q then P"  

Examples:

> If ab is even, then a is even and b is even.  
> False, 2 * 3 = 6, 6 is even but 2 is even and 3 is not even.  

> If ab is even then, a is even or b is even.  
> True  
> Converse: If a is even or b is even, then ab is even.  
> True  
> Biconditional: ab is even *if and only if* a is even or b is even.  
> **Note:** The statement and the converse are not always both true, but when they are it means the biconditional is true.  

## Set notation

- ℕ is the set of natural numbers.
- Mathemeticians and computer scientists define the set of natural numbers diferently.
- Mathemeticians: ℕ = {1, 2, 3, ...}
- Computer scientists: ℕ = {0, 1, 2, ...}

- ℤ is the set of integers.
- ℤ = {..., -3, -2, -1, 0, 1, 2, 3, ...}

- ℝ is the set of real numbers.
- ℝ = {1, 12.38, -0.8625, 3/4, √2, 198}

- ℚ is the set of rational numbers.
- ℚ = { a/b | a, b ∈ ℤ, b != 0}
- 3/7 ∈ ℚ
- -4000/201 ∈ ℚ
- 4 = 4/1 ∈ ℚ
- π ∉ ℚ

**Note:** The symbol '∈' is pronounced *is a subset of*.
