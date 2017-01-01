---
title: Countability of Infinite Sets
---

Mathematicians know that different types of infinite sequences exist. Lets start off by discussing two different types of infinite sequences: **countably infinite** sequences and **uncountably infinite** sequences.

## Countably Infinite

Lets take a look at a small sample of the set of all binary strings. The set looks like the following:

0, 1, 00, 01, 10, 11, 000, 101, ...

The set of all possible sets of binary strings is countably infinite. This is quite interesting because this means that the number of computer programs that can be written is also countable infinite. For the purpose of this example we can assume that a compiled program can be represented as a single binary string.

## Uncountably Infinite

To think about infinite sets that are uncountable, let us consider the following statement. *The set of all problems that exist is uncountable.* In other words, there is an infinite number of possible problems in the universe. Because there is a never ending number of problems, this means that there are problems which cannot be computed. This is because the number of programs that exist is countably infinite, but the number of problems is not.

## The set of Natural Numbers

The notation N represents the set of natural numbers.

Some examples of subsets of N could be:

Θ, {1}, {2}, {1, 2, 3}, {2, 4, 6, 8, ...}, {1, 3, 5, 7, 9, ...}, {2, 3, 5, 7, 11, ...}, and so on.

The notation 2<sup>N</sup> represents the power set of N. The power set of N is uncountable.

We can prove that 2<sup>N</sup> is uncountable.

**Proof:** Suppose, to the contrary, that 2<sup>N</sup> is countably infinite.
Then, there exists some countably infinite listing, say S1, S2, S3... of all possible subsets of the natural numbers of N.
Consider the following chart.

## Cantor's Diagonalization

<table>
  <tbody>
<tr>
    <th></th>
    <th>1</th>
    <th>2</th>
    <th>3</th>
    <th>4</th>
    <th>5</th>
    <th>...</th>
  </tr>
<tr>
    <td>S1</td>
    <td>N</td>
    <td>N</td>
    <td>N</td>
    <td>N</td>
    <td>N</td>
    <td></td>
  </tr>
<tr>
    <td>S2</td>
    <td>Y</td>
    <td>N</td>
    <td>N</td>
    <td>N</td>
    <td>N</td>
    <td></td>
  </tr>
<tr>
    <td>S3</td>
    <td>N</td>
    <td>Y</td>
    <td>N</td>
    <td>N</td>
    <td>N</td>
    <td></td>
  </tr>
<tr>
    <td>S4</td>
    <td>N</td>
    <td>Y</td>
    <td>N</td>
    <td>Y</td>
    <td>N</td>
    <td></td>
  </tr>
<tr>
    <td>...</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
<tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
  </tr>
</tbody></table>

S = {1, 2, 3, ...}

Define a set S as follows:

```
for each i = 1, 2, 3, ...
    if i ∈ Si, then i ∉ S
    if i ∉ Si, then i ∈ S
```

The set S is a subset of N
but S ≠ Si for any i.
In other words, S is not in the list of __all__ possible subsets of N.
Therefore 2<sup>N</sup> is uncountable.

## Future Writing

In my next post I will talk more about Cantor's Denationalization within a three dimensional graph. I will also be introducing the continuum hypothesis which states that there is no set whose cardinality is strictly between that of the integers and the real numbers.
