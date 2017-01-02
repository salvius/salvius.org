---
title: Preliminary Outline and Bibliography
---

**(The first few steps in teaching machines to walk.)**

Bipedal modality is a feature of human evolution that coincides with the development of higher cognitive function, the freeing of the hands for other tasks and allowing a wider range of vision by raising the head.

## What is efficient about biped?

McNeill Alexander describes the advantages of bipedal locomotion. He states that at normal walking speeds, gravity is responsible for the forward swinging motion of each leg. As a result, a bipedal entity exerts very little muscular activity when walking on level surfaces (McNeill Alexander 1985).

## What is inefficient?

Anthropologist John Hawks argues that the reason behind upright, bipedal walking is efficiency.

* Climbing is more difficult
* Cannot use feet to hold objects

Hawks argues that there is an evolutionary tradeoff between the ability to walk upright and the loss of the ability to climb.

## Advantages of bipedalism in robotics

Humans have adapted their environment to suit their needs. In the future it will be easier to adapt robots to be better suited for human environments and to use human tools than it would be to modify all human environments to be suitable for robots.

## Engineering challenges of biped walking

* Continuous motors control and synchronization
* robot height
* power consumption

## Computational challenges of biped walking

* Computationally challenging real time processing
* Increasing complexity at high walking speeds
* Reliable stability outside of a laboratory environment
* Need to be able to keep track of spatial and temporary foot paths
* Zero Moment Point (ZMP) and pseudoZMP
   * ZPM algorithm definitions → http://www.mate.tue.nl/mate/pdfs/10796.pdf
* kinematics and available degrees of freedom

## Solutions for some challenges

Complexity decreases as the number of active degrees of freedom decrease. Active degrees of freedom are degrees which need to be controlled and monitored.

Complexity can also be reduced by only using active degrees of freedom when absolutely necessary.

The energy of a previous step can be put in the taking of the next step.

## Algorithms for walking

* Limit Cycle Walking
   * Limit cycle walking is a design paradigm for biped that achieves a stable periodic gait without locally stabilizing the walking trajectory at every instant in time (Wisse, 2008).
   * It is important to note that Limit Cycle Walking is a relatively new concept and traditional algorithms stabilize the walking at every point during the walking process.
   * Generally use less energy than other walking methods
   * Limit Cycle Walking does not account for walking on stairs, stopping, or curving while walking (Dekker, 2009).

## Elements of Learning algorithms for bipedal walking

* Walking Primitives
   * Walking Primitives (WPs) are fractions of the walking gait of a biped (Dekker, 2009)
   * Examples:
      * performing a left step of a given length
      * performing a right or left step on a slope
      * Moving the ZPM from the center of one foot to the center of the other
* Optimal Stride Learning Algorithm (Benbrahim, 1996)
   * Search space is based off of possible joint movements.
   * Constraints:
      * Foot stance does not move during the step. This is a relaxation of the problem that makes it so that the problem does not take into consideration the fact that the terrain that the entity is walking on could be unstable.
      * The joints of the robot cannot move beyond their physical limits
* Transition primitives
   * Transition primitives are elements that the robot can use in any combination to achieve complex gaits.
   * Examples:
      * Walking on stairs
      * Stepping sideways
      * Stepping over an object
* WP mapping
   * Deals with symmetrical robots
   * WP-databases

**DARPA's Atlas robot walking**

* Related: http://dasl.mem.drexel.edu/atlas/?p=40

## Conclusion about machine learning methods for biped locomotion

Artificial intelligence provides a much more flexible solution to biped walking problems than traditional algorithms. It appears that many of the problems encountered with this solution are presented when it comes to real time processing constraints. The solution to time constraints is the abstraction of the initial problem in order to eliminate variables such as rough terrain and other obstacles, however this comes at the expense of the ability of the biped entity to navigate through a wider range of environments.

* Genetic walkers demo: http://rednuht.org/genetic_walkers/
* Walking on an incline: http://www.cs.cmu.edu/~cga/legs/Paper_3.pdf

***

## Works Cited

Benbrahim, Hamid. "BIPED DYNAMIC WALKING USING REINFORCEMENT
LEARNING." University of New Hampshire, Dec. 1996. Web.
http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.99.6229&rep=rep1&type=pdf

Dekker, M.h.p., July 2009 Eindhoven, and Dct No.: 2009.07.
ZERO-MOMENT POINT METHOD FOR STABLE BIPED WALKING (n.d.): n.
pag. July 2009. Web. http://www.mate.tue.nl/mate/pdfs/10796.pdf

Hawks, John. "Why Be Bipedal?" John Hawks Weblog. N.p., 1 Feb. 2005. Web. 29 Oct. 2015.

McNeill Alexander Ra. 1992. Human locomotion. In: Jones S, Martin R, Pilbeam D, editors,
The Cambridge encyclopedia of human evolution.
Cambridge: Cambridge University Press. p 80-85.

Wisse, Hobbelen, ‘Controlling the Walking Speed in Limit Cycle Walking’,
the Int. Journal of Robotics Research, 2008, p. 989-1005.
