---
title: Divisibility Tests
---

## A number is...

## divisible by 2 if and only if it's ones digit is even (i.e. 0, 2, 4, 6, 8).
> For instance, 8 is even because 8 / 4 = 2. In other words, its even because its evenly divisible by something.

## divisible by 5 if and only if its ones digit it 0 or 5.

> 2 and 5 are the easiest to test because we are working with a base 10 system.  
> 2 and 5 are divisors of 10.  
> Whatever system your in, the divisors of that system will be the easiest to work with.  

## divisible by 10 if and only if its ones digit is 0.

> In an expression a + b + c, if a and b are multiples of 5, then in order for the
> result to be a multiple of 5, c must also be divisible by 5.  
> For example, 10 + 15 + 20 can be written as 5 * 2 + 5 * 3 + 5 * 4 = 5(2 + 3 + 4)  
> Another example, a number 473 = 4 * 100 + 7 * 10 + 3  

## divisible by 3 if and only if the sum of its digits is divisible by 3.

> Example 1: 3 | 3120 since  
>         3 | 3 + 1 + 3 + 0  
> The symbol "|" means "divides into"  
> Example 2: 713 is not divisible by 3 since 7 + 1 + 3 = 11 and 3 does not | 11.  

## divisible by 9 if and only if the sum of its digits is divisible by 9.

> Example: 347 = 3(100) + 4(10) + 7
>                = 3(99 + 1) + 4(9 + 1) + 7
>                = 3 * 99 + 4 * 9 + (3 + 4 + 7)
> Notice the 99 and the 9

## divisible by 6 if and only if and only if it is divisible by both 2 and 3.

> Breaking 24 into it's prime number factorizations:
> 24 = 2 * 3 * 2 * 2
> 24/6 = 2 * 3
> n/6 = P1 * P2 * P3... / 2 * 3
> Example: n = 3120
> Since 2 | n and 3 | n then we know 6 | n

**For the following number determine all possible ways to fill in the missing**
**ones digit so that the number is divisible by 6.**

> 4,32_  
> The ones digit must be either 0, 2, 4, 6 or 8.  
> 3 | 4320? Yes, 4 + 3 + 2 == 9 and 3 | 9  
> 3 | 4 + 3 + 2 and 3 does not go into 4 + 3 + 2 + 2  
> ...  

## divisible by 4 if and only if the number represented by its lats two digits is divisible by 4.

> Ex 1: 1784 = (1 * 1000) + (7 * 100) + (8 * 10) + 4  
> Ex 2: Does 4 divide 342?  
> No, because 4 does not divide 42.  

## divisible by 8 if and only if the number represented by its last 3 digits is divisible by 8.

> Ex: 8 | 3120 since 8 | 120, i.e. 120 = 8 * 15.  

> Interesting therem:  
> For 2^1 check the last digit  
> For 2 squared check the the last two  
> For 2 cubed chek the last three  

## divisible by 11 if and only if the alternating sum of its digits is divisible by 11.

- (Altername means alternate signs between + and -)

> Ex: Let n = 6314  
> 6 - 3 + 1 - 4 = 0  
> So, since 11 | 0 it must be that 11 | 6314  
> Ex: Let n = 3120  
> 3 - 1 + 2 - 0 = 4  
> Since 11 does not | 4, then 11 does not | 3120.  
> What if we computed - 3 + 1 - 2 + 0 = -4?  
> So since 11 does not | -4 (and in general, if 11 does not | a then 11 | -a)  
> then the divisibility rule is **unaffected**.  

## divisible by 7 if and only if 

- Use the following iterative process:
- Step 1: Take the last digit and remove it from the rest of the number.
- Last digit: d = n % 10, remove last digit: n = n/10
- Step 2: Subtract twice the last digit from the number formed by the remaining digits
- n = n - 2 * d
- Repeat steps one and two as needed.
- The origional number n is divisible by 7 if and only if the number obtained by this iterative process is divisible by 7.

> Ex: n = 392  
> Step 1: d = 2, n = 39  
> Step 2: n - 2d = 39 - 4 = 35  
> True since 7 | 35, then 7 | 392  

> Ex: n = 1384  
> Step 1: d = 4, n = 138  
> Step 2: 138 - 2d = 130  
> Repeat:  
> Step 1: d = 0, n = 13  
> Step 2: 13 - 2(0) = 13  
> Since 7 does not | 13, then 7 does not divide 1384.  
