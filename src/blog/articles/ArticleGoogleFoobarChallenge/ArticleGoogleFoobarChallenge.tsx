import React from "react";
import "./ArticleGoogleFoobarChallenge.css";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import PythonCodeDisplay from "./PythonCodeDisplay";

const ArticleGoogleFoobarChallenge: React.FC = () => {
  return (
    <>
      <p>
        Recently, I completed Google's&nbsp;
        <a
          href="https://foobar.withgoogle.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          FooBar
        </a>
        &nbsp;challenge in April 2023. This involved solving a series of
        mathematical and coding problems using Python 2.7 or Java. The challenge
        presented five levels of increasing difficulty, with 1-3 tasks per
        level. In this document, I summarise the tasks I undertook and explain
        how I resolved each one. For further insight into the challenge, see
        articles by&nbsp;
        <a
          href="https://www.turing.com/kb/foobar-google-secret-hiring-technique"
          target="_blank"
          rel="noopener noreferrer"
        >
          Turing
        </a>
        &nbsp;and&nbsp;
        <a
          href="https://itsmohitt.medium.com/things-you-should-know-about-google-foobar-invitation-703a535bf30f"
          target="_blank"
          rel="noopener noreferrer"
        >
          Medium
        </a>
        .<br />
        <br />
        The document is structured into five sections, each pertaining to a
        different challenge level. Every level contains a section for each task.
        Within each task section, there are three main components. The first is
        a simplified task description, adapted from the original text. The
        second part consists of an explanation of how I approached and solved
        the problem. The final part features my Python code, which can be
        revealed by clicking on the corresponding box. The constraints for
        coding in Python or Java are delineated below.
        <br />
        <br />
        Should you wish to attempt a task yourself, I suggest you firstly peruse
        the task description and attempt the problem without reading my
        solution. Feel free to search online for any pertinent mathematical or
        coding principles, but refrain from seeking a direct solution to the
        problem. If you find yourself stuck for an extended period, then
        consider reading my solution explanation, but do not yet reveal my code.
        I recommend revealing and examining my code only if you are absolutely
        stuck, or if you wish to compare your solution with mine. Remember, some
        of the challenges are complex and may take several hours or even several
        days to solve. Enjoy the process!
      </p>
      <div className="table-of-contents toc-layer1">
        <a href="#sec-challenge1" id="a-challenge1">
          Challenge 1
        </a>
        <a href="#sec-challenge2" id="a-challenge2">
          Challenge 2
        </a>
        <a href="#sec-challenge3" id="a-challenge3">
          Challenge 3
        </a>
        <a href="#sec-challenge4" id="a-challenge4">
          Challenge 4
        </a>
        <a href="#sec-challenge5" id="a-challenge5">
          Challenge 5
        </a>
        <a href="#sec-bonus" id="a-bonus">
          Bonus
        </a>
      </div>
      <div className="foobar-task-description">
        Python Constraints
        <br />
        ==================
        <br />
        Your code will run inside a Python 2.7.13 sandbox. All tests will be run
        by calling the solution() function. Standard libraries are supported
        except for bz2, crypt, fcntl, mmap, pwd, pyexpat, select, signal,
        termios, thread, time, unicodedata, zipimport, zlib. Input/output
        operations are not allowed. Your solution must be under 32000 characters
        in length including new lines and other non-printing characters.
        <br />
        <br />
        Java Constraints
        <br />
        ================
        <br />
        Your code will be compiled using standard Java 8. All tests will be run
        by calling the solution() method inside the Solution class. Execution
        time is limited. Wildcard imports and some specific classes are
        restricted (e.g. java.lang.ClassLoader). You will receive an error when
        you verify your solution if you have used a restricted class.
        Third-party libraries, input/output operations, spawning threads or
        processes and changes to the execution environment are not allowed. Your
        solution must be under 32000 characters in length including new lines
        and other non-printing characters.
      </div>
      <div style={{ overflowX: "auto", position: "relative" }}>
        <section className="foobar-challenge" id="sec-challenge1">
          <h2>Challenge 1</h2>
          <p>
            The first level contained only a single task, titled&nbsp;
            <a href="#sec-task-1">Re-ID</a>, which involved efficiently
            generating prime numbers. A task summary, adapted from the original
            challenge instructions, is given below.
          </p>
          <section className="foobar-task" id="sec-task-1">
            <div className="foobar-task-description">
              Re-ID
              <br />
              =====
              <br />
              <br />
              Write a function solution(n) which takes in the starting index n
              of a string of all primes, "2357111317192329...", and returns the
              next five digits in the string. For example, if n is 3 then their
              ID number will be "71113". The value of n will always be between 0
              and 10000.
              <br />
              <br />
              -- Test cases --
              <br />
              Input : solution(0)
              <br />
              Output: 23571
              <br />
              <br />
              Input : solution(3)
              <br />
              Output: 71113
            </div>
            <p>
              If the string of prime numbers is known, then the solution is
              trivially given by returning the five digits starting at
              index&nbsp;
              <InlineMath math="n" />. Therefore, I solved this problem by
              defining a function that firstly generated this string of primes.
              This function works by checking the primality of all integers from{" "}
              <InlineMath math="2" /> to{" "}
              <InlineMath math={"m=20+\\lfloor n \\ln 10 \\rfloor"} />. This
              choice of <InlineMath math="m" /> ensures that the resulting
              string of primes is at least <InlineMath math="n+5" /> characters
              long, without too much excessive computation.
              <br />
              <br />
              This is a result of the{" "}
              <a
                href="https://mathworld.wolfram.com/PrimeNumberTheorem.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                prime number theorem
              </a>{" "}
              which gives an asymptotic expression for the prime counting
              function,
            </p>
            <BlockMath math={"\\pi(m)\\sim\\frac{m}{\\ln m},"} />
            <p>
              which counts the number of prime numbers{" "}
              <InlineMath math={"\\leqslant m"} />. The maximum number of digits
              each prime can have is{" "}
              <InlineMath math={"\\lceil \\log m \\rceil"} /> (base 10).
              Therefore, having{" "}
              <InlineMath math={"n+5 < \\pi(m)\\lceil \\log m \\rceil"} />{" "}
              should ensure the resulting string is long enough when{" "}
              <InlineMath math="n" /> is large. This condition is satisfied by
            </p>
            <BlockMath math={"m=20+\\lfloor n \\ln 10 \\rfloor,"} />
            <p>
              which I checked empirically worked for when{" "}
              <InlineMath math="n" /> is low.
              <br />
              <br />
              Each integer is considered prime if no previously identified prime
              numbers divide it. This involves checking all previously
              identified prime numbers less than or equal to the square-root of
              the current candidate number (there is no point checking factors
              higher than the square-root because they all pair with divisors
              less than the square-root). Once the list of prime numbers is
              generated then the integers are converted to strings before being
              joined into a single string.
            </p>
            <PythonCodeDisplay
              codeFile={"/blog/files/google-foobar-challenge/reid.py"}
            />
          </section>
        </section>
        <section className="foobar-challenge" id="sec-challenge2">
          <h2>Challenge 2</h2>

          <p>
            The second level contained two tasks, titled{" "}
            <a href="#sec-task-2">Please Pass the Coded Messages</a> and{" "}
            <a href="#sec-task-3">Bunny Worker Locations</a>.
          </p>
          <section className="foobar-task" id="sec-task-2">
            <div className="foobar-task-description">
              Please Pass the Coded Messages
              <br />
              ==============================
              <br />
              <br />
              You have L, a list containing some digits (0 to 9). Write a
              function solution(L) which finds the largest number that can be
              made from some or all of these digits and is divisible by 3. If it
              is not possible to make such a number, return 0 as the solution. L
              will contain anywhere from 1 to 9 digits. The same digit may
              appear multiple times in the list, but each element in the list
              may only be used once.
              <br />
              <br />
              -- Test cases -- <br />
              Input : solution([3, 1, 4, 1])
              <br />
              Output: 4311
              <br />
              <br />
              Input : solution([3, 1, 4, 1, 5, 9])
              <br />
              Output: 94311
              <br />
            </div>

            <p>
              To solve this problem, let's first consider the simpler problem of
              finding the largest number containing all the digits in the list
              L. Obviously, this is achieved by sorting the list with the
              largest on the left to the smallest on the right, so that the
              larger digits correspond to the higher decimal positions. Removing
              any digit will strictly decrease the size of the number (except
              when all digits are zero). Therefore, this result forms an upper
              bound to the original problem of finding the largest number that
              is also divisible by three.
              <br />
              <br />
              Now we can make use of the property of decimal numbers that they
              are divisible by 3 if and only if the sum of their digits is also
              divisible by three. Or, more generally, that the number is
              congruent modulo 3 to its digit sum. Since the order of a
              summation does not effect the result, we can use this rule to
              check the modularity of a list of numbers without knowing the
              order. Next we note that removing any two digits never lowers the
              value by less than only removing any one digit. Also note that
              removing a larger digit will lower the value by more than removing
              a lower digit. Therefore, we can solve the problem by firstly
              minimising the number of digits that need to be removed, and then
              minimising the values of the removed digits.
              <br />
              <br />
              The sum of digits can be congruent to 0, 1 or 2 (mod 3). In the
              first case, any permutation of all digits is divisible by 3
              without removing any digits. Therefore, the solution returns the
              number containing all the digits in descending order. If the sum
              is congruent to 1 or 2, then there are three cases. Firstly, one
              of the digits is congruent to the sum, in which case, we just
              remove the smallest such digit. Secondly, two of the digits are
              congruent to twice the sum, in which case we remove the two
              smallest such digits. Thirdly, no combination of digits is
              divisible by 3, so return 0. After removing any digits, the
              solution is the number containing all the remaining digits in
              descending order. Note, that if there are no remaining digits,
              then return 0.
            </p>

            <PythonCodeDisplay
              codeFile={"/blog/files/google-foobar-challenge/codedmessages.py"}
            />
          </section>
          <section className="foobar-task" id="sec-task-3">
            <div className="foobar-task-description">
              Bunny Worker Locations
              <br />
              ======================
              <br />
              <br />
              In a triangular grid of values each cell can be represented as
              points (x, y), with x being the distance from the vertical wall,
              and y being the height from the ground. For example, the value at
              (1, 1) is 1, the value at (3, 2) is 9, and the value at (2,3) is
              8. This pattern of numbering continues indefinitely.
              <br />
              <br />
              | 7<br />
              | 4 8<br />
              | 2 5 9<br />
              | 1 3 6 10
              <br />
              <br />
              Write a function solution(x, y) which returns the grid value at
              the location (x, y). Both x and y will be at least 1 and no
              greater than 100,000. Since the values can be very large, return
              your solution as a string representation of the number.
              <br />
              <br />
              -- Test cases --
              <br />
              Input : solution(5, 10)
              <br />
              Output: 96
              <br />
              <br />
              Input : solution(3, 2)
              <br />
              Output: 9
            </div>

            <p>
              The grid changes by 1 each step along a diagonal, which gives the
              following recursive relationships
            </p>
            <BlockMath math={"f(x,y)=f(x+1,y-1)-1,"} />
            <BlockMath math={"f(x,y)=f(x+k,y-k)-k,"} />
            <p>
              {" "}
              where <InlineMath math="k" /> can be any integer satisfying{" "}
              <InlineMath math={"0 < k < y"} />. The grid coordinates can be as
              large as 100000 so generating the entire grid would probably be
              much slower than directly calculating the values from a closed
              form expression for <InlineMath math={"f(x,y)"} />. To find one, I
              first noticed that the first row is given by the{" "}
              <a
                href="https://en.wikipedia.org/wiki/Triangular_number"
                target="_blank"
                rel="noopener noreferrer"
              >
                triangular numbers
              </a>
              . This makes sense since the values are given by the size of each
              diagonal, which grow by 1 each time. Therefore,
            </p>
            <BlockMath math={"f(x,1)=\\sum_{k=1}^x k=\\frac{x(x+1)}{2}."} />
            <p>
              So, we can get a closed form expression by choosing{" "}
              <InlineMath math={"k=y-1"} /> in the recursive relationship and
              then using the result for <InlineMath math={"f(x,1)"} /> by
              substituting <InlineMath math={"x\\rightarrow x+y-1"} />
            </p>
            <BlockMath math={"f(x,y)=\\frac{(x+y-1)(x+y)}{2}-y+1."} />

            <PythonCodeDisplay
              codeFile={
                "/blog/files/google-foobar-challenge/bunnyworkerlocations.py"
              }
            />
          </section>
        </section>
        <section className="foobar-challenge" id="sec-challenge3">
          <h2>Challenge 3</h2>
          <p>
            The third level contained three tasks, titled{" "}
            <a href="#sec-task-4">Prepare the Bunnies' Escape</a>,{" "}
            <a href="#sec-task-5">The Grandest Staircase Of Them All</a> and{" "}
            <a href="#sec-task-6">Fuel Injection Perfection</a>.
          </p>
          <section className="foobar-task" id="sec-task-4">
            <div className="foobar-task-description">
              Prepare the Bunnies' Escape
              <br />
              ===========================
              <br />
              <br />
              Write a function solution(map) that generates the length of the
              shortest path along a rectangular grid from (0,0) to (w-1,h-1),
              where w is the grid width, h is the grid height and the map is
              represented as a matrix of 0s and 1s, where 0s are passable space
              and 1s are impassable walls. The path may remove up to one wall.
              The path length is the total number of nodes you pass through,
              counting both the entrance and exit nodes. The starting and ending
              positions are always passable (0). The map will always be
              solvable, though you may or may not need to remove a wall. The
              height and width of the map can be from 2 to 20. Moves can only be
              made in cardinal directions; no diagonal moves are allowed.
              <br />
              <br />
              -- Test cases --
              <br />
              Input : solution([[0, 1, 1, 0], [0, 0, 0, 1], [1, 1, 0, 0], [1, 1,
              1, 0]])
              <br />
              Output: 7<br />
              <br />
              Input : solution([[0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 0], [0, 0,
              0, 0, 0, 0], [0, 1, 1, 1, 1, 1], [0, 1, 1, 1, 1, 1], [0, 0, 0, 0,
              0, 0]])
              <br />
              Output: 11
            </div>
            <p>
              To solve this problem I represent maps as{" "}
              <a
                href="https://en.wikipedia.org/wiki/Graph_theory"
                target="_blank"
                rel="noopener noreferrer"
              >
                graphs
              </a>{" "}
              where nodes correspond to passable spaces and edges correspond to
              adjacent passable spaces. Then I use the{" "}
              <a
                href="https://en.wikipedia.org/wiki/A*_search_algorithm"
                target="_blank"
                rel="noopener noreferrer"
              >
                A* algorithm
              </a>{" "}
              to find the shortest path length from the start and end nodes. To
              improve the efficiency of the algorithm I use the{" "}
              <a
                href="https://simple.wikipedia.org/wiki/Manhattan_distance"
                target="_blank"
                rel="noopener noreferrer"
              >
                Manhattan distance
              </a>{" "}
              as a lower bound to the remaining distance between any node and
              the end node. After implementing the A* algorithm I use it to find
              the shortest path lengths of all possible maps with exactly 1 or 0
              walls removed. The function then returns the smallest of these
              path lengths.
            </p>
            <PythonCodeDisplay
              codeFile={"/blog/files/google-foobar-challenge/prepareescape.py"}
            />
          </section>
          <section className="foobar-task" id="sec-task-5">
            <div className="foobar-task-description">
              The Grandest Staircase Of Them All
              <br />
              ==================================
              <br />
              <br />
              Write a function called solution(n) that takes a positive integer
              n and returns the number of different staircases that can be built
              from exactly n bricks. n will always be between 3 and 200
              (inclusive). Each type of staircase should consist of 2 or more
              steps with no two steps being at the same height. All steps must
              contain at least one brick. A step's height is classified as the
              total amount of bricks that make up that step.
              <br />
              <br />
              For example, when n = 3, you have only 1 choice of how to build
              the staircase, with the first step having a height of 2 and the
              second step having a height of 1: (# indicates a brick)
              <br />
              <br />
              #<br />
              ##
              <br />
              21
              <br />
              <br />
              When n = 4, you still only have 1 staircase choice:
              <br />
              <br />
              #<br />
              #<br />
              ##
              <br />
              31
              <br />
              <br />
              But when n = 5, there are two ways you can build a staircase from
              the given bricks. The two staircases can have heights (4, 1) or
              (3, 2), as shown below:
              <br />
              <br />
              #<br />
              #<br />
              #<br />
              ##
              <br />
              41
              <br />
              <br />
              #<br />
              ##
              <br />
              ##
              <br />
              32
              <br />
              <br />
              -- Test cases --
              <br />
              Input : solution(200)
              <br />
              Output: 487067745
              <br />
              <br />
              Input : solution(3)
              <br />
              Output: 1
            </div>
            <p>
              To solve this problem I used the principles of{" "}
              <a
                href="https://en.wikipedia.org/wiki/Dynamic_programming"
                target="_blank"
                rel="noopener noreferrer"
              >
                dynamic programming
              </a>{" "}
              to write a recursive function which relied on{" "}
              <a
                href="https://en.wikipedia.org/wiki/Memoization"
                target="_blank"
                rel="noopener noreferrer"
              >
                memoisation
              </a>{" "}
              to run efficiently. Consider the function{" "}
              <InlineMath math="w(n,m,s)" /> which calculates the number of
              valid staircases that can be built with <InlineMath math="n" />{" "}
              bricks, with each stair containing a maximum of{" "}
              <InlineMath math="m" /> bricks and at least{" "}
              <InlineMath math="s" /> more steps. We can express{" "}
              <InlineMath math="w" /> as a recursive function. Specifically, the
              number of staircases that can be built is the sum of the number of
              staircases that can be built given the size of the next step. For
              example, if there are 5 bricks, then the number of possible
              staircases is the number of staircases that end with a height of
              1, plus the number that end with a height of 2, plus a height of 3
              and plus a height of 4.
              <br />
              <br />
              There are two base cases to this recursion. The first occurs when
              there are too many bricks. This occurs when the number of bricks
              is more than a maximal staircase with a constant step size of 1,{" "}
              <InlineMath math={"n > m(m+1)/2"} />. In this case, the number of
              valid staircases is 0. The second base case occurs when there are
              no bricks <InlineMath math="n=0" />, and the minimum number of
              additional steps is less than zero (
              <InlineMath math={"s\\leqslant 0"} />
              ). In this case, the number of valid staircases is 1. Therefore,
            </p>
            <BlockMath
              math={`
              w(n,m,s)=\\begin{cases}
              0,\\quad n > m(m+1)/2\\\\[0.5em] 1,\\quad n=0 \\text{ and } s\\leqslant 0
              \\\\[0.5em] \\sum_{k=1}^{\\min(n,m)} w(n-k,k-1,s-1) \\end{cases}`}
            />
            <p>
              with the solution is given by <InlineMath math="w(n,n,2)" />.
            </p>
            <PythonCodeDisplay
              codeFile={
                "/blog/files/google-foobar-challenge/grandeststaircase.py"
              }
            />
          </section>
          <section className="foobar-task" id="sec-task-6">
            <div className="foobar-task-description">
              Fuel Injection Perfection
              <br />
              =========================
              <br />
              <br />
              Write a function called solution(n) which takes a positive integer
              as a string and returns the minimum number of operations needed to
              transform n to 1. Quantities will not exceed 309 digits long. The
              three allowed operations are +1, -1 and /2 (if the quantity is
              even).
              <br />
              <br />
              For example:
              <br />n = 4 requires two operations: 4 -{">"} 2 -{">"} 1<br />n =
              15 requires five operations: 15 -{">"} 16 -{">"} 8 -{">"} 4 -{">"}{" "}
              2 -{">"} 1<br />
              <br />
              -- Test cases --
              <br />
              Input : solution('15')
              <br />
              Output: 5<br />
              <br />
              Input : solution('4')
              <br />
              Output: 2
            </div>
            <p>
              To solve the problem we can identify several principles for
              minimising the number of operations to reach 1. Firstly, no
              shortest trajectory would contain a <InlineMath math="+1" />{" "}
              operation immediately followed by a <InlineMath math="-1" />{" "}
              operation, or vice versa, because any trajectory containing any
              such consecutive operations could be shortened by 2 steps by
              removing them. Secondly, even numbers should always be divided by
              2. This is because a trajectory that repeats the other operations
              followed by a division can be shortened by dividing first. For
              example,
            </p>
            <BlockMath
              math={`\\begin{aligned} &2k \\rightarrow 2k\\pm 1 \\rightarrow 2k\\pm
            2 \\rightarrow k\\pm 1, \\\\ &2k \\rightarrow k \\hphantom{2 + 1}
            \\rightarrow k\\pm 1, \\end{aligned}`}
            />
            <p>
              where <InlineMath math="k" /> is any natural number. Basically,
              the number of consecutive addition or subtraction operations can
              be cut in half (or half plus 1) by dividing first. Note that this
              assumes that eventually there will be another halving operation.
              Except in the cases of <InlineMath math="n=2" /> and{" "}
              <InlineMath math="n=3" /> where both halving and subtracting 1
              will work, in every other case halving requires fewer operations
              than subtracting 1. Specifically, continuously subtracting 1
              requires exactly <InlineMath math="n-1" /> operations, while
              halving every even and subtracting 1 off every odd number will
              require no more than{" "}
              <InlineMath math={"2\\lceil \\log_2 (n+1) \\rceil -2"} /> (when{" "}
              <InlineMath math="n" /> is one less than a power of 2) operations
              and no less than <InlineMath math={"\\lceil \\log_2 n \\rceil"} />{" "}
              (when <InlineMath math="n" /> is a power of 2) operations.
              Obviously, repeated additions can never reach 1 since they
              strictly increase the number. Therefore, for all{" "}
              <InlineMath math="n>3" /> there exists a shortest sequence of
              operations whereby every even value is halved, and the number of
              even values is at least one.
              <br />
              <br />
              To decide on a rule for odd values, let us consider the two
              possible cases where <InlineMath math={"n=4k+1"} /> and{" "}
              <InlineMath math={"n=4k+3"} /> for any natural number,{" "}
              <InlineMath math="k" />. In the first case we can draw the
              following tree.
              <br />
              <br />
              <img
                src="/images/blog/google-foobar-challenge/foobar_c3c_a.svg"
                alt="flow diagram"
                className="tikz-diagram"
              />
              <br />
              In this case adding 1 inevitably leads to either{" "}
              <InlineMath math="k" /> or <InlineMath math="k+1" />, both of
              which can be reached in fewer or equal number of operations by
              subtracting 1. Therefore, when <InlineMath math="n=4k+1" />{" "}
              subtracting 1 is weakly faster than adding 1. Given this strategy,
              we can make an analogous decision tree for the{" "}
              <InlineMath math="n=4k+3" /> case.
              <br />
              <br />
              <img
                src="/images/blog/google-foobar-challenge/foobar_c3c_b.svg"
                alt="flow diagram"
                className="tikz-diagram"
              />
              <br />
              Now choosing to subtract 1 will inevitably lead to either{" "}
              <InlineMath math="k" /> or <InlineMath math="k+1" />, both of
              which can be reached in fewer or equal number of operations by
              adding 1. Therefore, when <InlineMath math="n=4k+3" /> adding 1 is
              weakly faster than subtracting 1. <br />
              <br />
              Finally, let us consider the simple small cases of which cannot be
              expressed as <InlineMath math="n=4k+r" />. When{" "}
              <InlineMath math="n=1" /> we do not need any operations so return
              0, when <InlineMath math="n=2" /> follow the halving even rule to
              get to 1 needs only 1 operation, and when{" "}
              <InlineMath math="n=3" /> subtracting 1, rather than adding 1 is
              faster. Therefore, we can define the following recursive function
              to solve the problem,
            </p>
            <BlockMath
              math={`f(n)=\\begin{cases} 0, & n = 1,\\\\[0.5em] 1 + f(n/2), & n
      \\equiv 0 \\mod{2},\\\\[0.5em] 1 + f(n-1), & n \\equiv 1 \\mod{4}, \\text{ or }
      n=3, \\\\[0.5em] 1 + f(n+1), & \\text{otherwise.} \\end{cases}`}
            />
            <p>
              This solution can be implemented using a recursive function or a
              while loop.
            </p>
            <PythonCodeDisplay
              codeFile={"/blog/files/google-foobar-challenge/fuelinjection.py"}
            />
          </section>
        </section>
        <section className="foobar-challenge" id="sec-challenge4">
          <h2>Challenge 4</h2>
          <p>
            The fourth level contained two tasks, titled{" "}
            <a href="#sec-task-7">Bringing a Gun to a Trainer Fight</a> and{" "}
            <a href="#sec-task-8">Free the Bunny Workers</a>.
          </p>
          <section className="foobar-task" id="sec-task-7">
            <div className="foobar-task-description">
              Bringing a Gun to a Trainer Fight
              <br />
              =================================
              <br />
              <br />
              Write a function solution(dimensions, your_position,
              trainer_position, distance) that gives an array of 2 integers of
              the width and height of the room, an array of 2 integers of your x
              and y coordinates in the room, an array of 2 integers of the
              trainer's x and y coordinates in the room, and returns an integer
              of the number of distinct directions that you can fire to hit the
              elite trainer, given the maximum distance that the beam can
              travel.
              <br />
              <br />
              The room has integer dimensions [1 &lt; x_dim &lt;= 1250, 1 &lt;
              y_dim &lt;= 1250]. You and the elite trainer are both positioned
              on the integer lattice at different distinct positions (x, y)
              inside the room such that [0 &lt; x &lt; x_dim, 0 &lt; y &lt;
              y_dim]. Finally, the maximum distance that the beam can travel
              before becoming harmless will be given as an integer 1 &lt;
              distance &lt;= 10000.
              <br />
              <br />
              For example, if you and the elite trainer were positioned in a
              room with dimensions [3, 2], your_position [1, 1],
              trainer_position [2, 1], and a maximum shot distance of 4, you
              could shoot in seven different directions to hit the elite trainer
              (given as vector bearings from your location): [1, 0], [1, 2], [1,
              -2], [3, 2], [3, -2], [-3, 2], and [-3, -2]. As specific examples,
              the shot at bearing [1, 0] is the straight line horizontal shot of
              distance 1, the shot at bearing [-3, -2] bounces off the left wall
              and then the bottom wall before hitting the elite trainer with a
              total shot distance of sqrt(13), and the shot at bearing [1, 2]
              bounces off just the top wall before hitting the elite trainer
              with a total shot distance of sqrt(5).
              <br />
              <br />
              -- Test cases --
              <br />
              Input : solution([3,2], [1,1], [2,1], 4)
              <br />
              Output: 7<br />
              <br />
              Input : solution([300,275], [150,150], [185,100], 500)
              <br />
              Output: 9
            </div>
            <p>
              The key insight which helped me solve this problem was to view
              reflections as additional rooms (but mirrored). Therefore, the
              reflections form an infinite grid of repeated mirror copies of the
              room. This concept is illustrated below using the example in the
              task description. Therefore, I solved this problem by following
              these steps. Firstly, I generated all coordinates corresponding to
              all positions (both yours and the targets, both real and
              reflected) in a square shape with side length larger than the
              allowed distance. Then I filtered these coordinates to only allow
              points within the allowed distance to you. From these coordinates,
              I identified a set of directions, which were the vectors from you
              to the coordinate, scaled by the greatest common divisor of both
              dimensions. For each direction the shortest distance was saved.
              Next I removed any directions to hit the target that would hit
              yourself first (directions that appear in both sets in which the
              distance to hit yourself was shorter.) The final result is the
              size of the set of directions to hit the target.
            </p>
            <figure>
              <table className="grid-table" cellSpacing="0" cellPadding="0">
                <tbody>
                  <tr>
                    <td>7</td>
                    <td className="s0">Y</td>
                    <td className="s1">T</td>
                    <td className="s0">|</td>
                    <td className="s0">T</td>
                    <td className="s1">Y</td>
                    <td className="s0">|</td>
                    <td className="s0">Y</td>
                    <td className="s1">T</td>
                    <td className="s0">|</td>
                    <td className="s0">T</td>
                    <td className="s1">Y</td>
                    <td className="s0">|</td>
                    <td className="s0">Y</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td className="s0">Y</td>
                    <td className="s1">T</td>
                    <td className="s0">|</td>
                    <td className="s0">T</td>
                    <td className="s1">Y</td>
                    <td className="s0">|</td>
                    <td className="s4">Y</td>
                    <td className="s1">T</td>
                    <td className="s0">|</td>
                    <td className="s0">T</td>
                    <td className="s1">Y</td>
                    <td className="s0">|</td>
                    <td className="s0">Y</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                    <td className="s5">—</td>
                    <td className="s6">+</td>
                    <td className="s6">—</td>
                    <td className="s5">—</td>
                    <td className="s6">+</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td className="s0">Y</td>
                    <td className="s1">T</td>
                    <td className="s0">|</td>
                    <td className="s7">T</td>
                    <td className="s8">Y</td>
                    <td className="s9">|</td>
                    <td className="s4">Y</td>
                    <td className="s10">T</td>
                    <td className="s9">|</td>
                    <td className="s7">T</td>
                    <td className="s1">Y</td>
                    <td className="s0">|</td>
                    <td className="s0">Y</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s6">—</td>
                    <td className="s5">—</td>
                    <td className="s6">+</td>
                    <td className="s6">—</td>
                    <td className="s5">—</td>
                    <td className="s6">+</td>
                    <td className="s6">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td className="s0">Y</td>
                    <td className="s1">T</td>
                    <td className="s9">|</td>
                    <td className="s4">T</td>
                    <td className="s8">Y</td>
                    <td className="s11">|</td>
                    <td className="s12">Y</td>
                    <td className="s10">T</td>
                    <td className="s9">|</td>
                    <td className="s9">T</td>
                    <td className="s8">Y</td>
                    <td className="s0">|</td>
                    <td className="s0">Y</td>
                  </tr>
                  <tr>
                    <td>0</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s6">—</td>
                    <td className="s5">—</td>
                    <td className="s13">+</td>
                    <td className="s13">—</td>
                    <td className="s14">—</td>
                    <td className="s6">+</td>
                    <td className="s6">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                  </tr>
                  <tr>
                    <td>-1</td>
                    <td className="s0">Y</td>
                    <td className="s1">T</td>
                    <td className="s0">|</td>
                    <td className="s7">T</td>
                    <td className="s8">Y</td>
                    <td className="s9">|</td>
                    <td className="s4">Y</td>
                    <td className="s10">T</td>
                    <td className="s9">|</td>
                    <td className="s7">T</td>
                    <td className="s1">Y</td>
                    <td className="s0">|</td>
                    <td className="s0">Y</td>
                  </tr>
                  <tr>
                    <td className="table-y-axis">-2</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                    <td className="s5">—</td>
                    <td className="s6">+</td>
                    <td className="s6">—</td>
                    <td className="s5">—</td>
                    <td className="s6">+</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                  </tr>
                  <tr>
                    <td className="table-y-axis">-3</td>
                    <td className="s0">Y</td>
                    <td className="s1">T</td>
                    <td className="s0">|</td>
                    <td className="s0">T</td>
                    <td className="s1">Y</td>
                    <td className="s0">|</td>
                    <td className="s4">Y</td>
                    <td className="s1">T</td>
                    <td className="s0">|</td>
                    <td className="s0">T</td>
                    <td className="s1">Y</td>
                    <td className="s0">|</td>
                    <td className="s0">Y</td>
                  </tr>
                  <tr>
                    <td className="table-y-axis">-4</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                    <td className="s3">—</td>
                    <td className="s2">+</td>
                    <td className="s2">—</td>
                  </tr>
                  <tr>
                    <td className="table-y-axis">-5</td>
                    <td className="s0">Y</td>
                    <td className="s1">T</td>
                    <td className="s0">|</td>
                    <td className="s0">T</td>
                    <td className="s1">Y</td>
                    <td className="s0">|</td>
                    <td className="s0">Y</td>
                    <td className="s1">T</td>
                    <td className="s0">|</td>
                    <td className="s0">T</td>
                    <td className="s1">Y</td>
                    <td className="s0">|</td>
                    <td className="s0">Y</td>
                  </tr>
                  <tr>
                    <td className="table-bottom-left"></td>
                    <td className="table-x-axis">-5</td>
                    <td className="table-x-axis">-4</td>
                    <td className="table-x-axis">-3</td>
                    <td className="table-x-axis">-2</td>
                    <td className="table-x-axis">-1</td>
                    <td className="table-x-axis">0</td>
                    <td className="table-x-axis">1</td>
                    <td className="table-x-axis">2</td>
                    <td className="table-x-axis">3</td>
                    <td className="table-x-axis">4</td>
                    <td className="table-x-axis">5</td>
                    <td className="table-x-axis">6</td>
                    <td className="table-x-axis">7</td>
                  </tr>
                </tbody>
              </table>
              <figcaption>
                Illustrated example from the task description. The shaded region
                represents cells in range of you. Cells shaded in green denote
                the directions which would hit the target.
              </figcaption>
            </figure>

            <PythonCodeDisplay
              codeFile={
                "/blog/files/google-foobar-challenge/guntotrainerfight.py"
              }
            />
          </section>
          <section className="foobar-task" id="sec-task-8">
            <div className="foobar-task-description">
              Free the Bunny Workers
              <br />
              ======================
              <br />
              <br />
              Given the number of bunnies available and the number of locks
              required to open a work room, write a function solution(num_buns,
              num_required) which returns a specification of how to distribute
              the keys such that any num_required bunnies can open the locks,
              but no group of (num_required - 1) bunnies can.
              <br />
              <br />
              Each lock is numbered starting from 0. The keys are numbered the
              same as the lock they open (so for a duplicate key, the number
              will repeat, since it opens the same lock). For a given bunny, the
              keys they get is represented as a sorted list of the numbers for
              the keys. To cover all of the bunnies, the final solution is
              represented by a sorted list of each individual bunny's list of
              keys. Find the lexicographically least such key distribution -
              that is, the first bunny should have keys sequentially starting
              from 0.
              <br />
              <br />
              num_buns will always be between 1 and 9, and num_required will
              always be between 0 and 9 (both inclusive). For example, if you
              had 3 bunnies and required only 1 of them to open the cell, you
              would give each bunny the same key such that any of the 3 of them
              would be able to open it, like so:
              <br />
              <br />
              [<br />
              [0],
              <br />
              [0],
              <br />
              [0],
              <br />
              ]<br />
              <br />
              If you had 2 bunnies and required both of them to open the cell,
              they would receive different keys (otherwise they wouldn't both
              actually be required), and your solution would be as follows:
              <br />
              <br />
              [<br />
              [0],
              <br />
              [1],
              <br />
              ]<br />
              <br />
              Finally, if you had 3 bunnies and required 2 of them to open the
              cell, then any 2 of the 3 bunnies should have all of the keys
              necessary to open the cell, but no single bunny would be able to
              do it. Thus, the solution would be:
              <br />
              <br />
              [<br />
              [0, 1],
              <br />
              [0, 2],
              <br />
              [1, 2],
              <br />
              ]<br />
              <br />
              -- Test cases --
              <br />
              Input : solution(4, 4)
              <br />
              Output: [[0], [1], [2], [3]]
              <br />
              <br />
              Input : solution(5, 3)
              <br />
              Output: [[0, 1, 2, 3, 4, 5], [0, 1, 2, 6, 7, 8], [0, 3, 4, 6, 7,
              9], [1, 3, 5, 6, 8, 9], [2, 4, 5, 7, 8, 9]]
              <br />
              <br />
              Input : solution(2, 1)
              <br />
              Output: [[0], [0]]
            </div>
            <p>
              We know that no combination of num_required - 1 bunnies will
              collectively have all the required keys, they must be missing at
              least one key for a required lock. However, including any other
              additional bunny will complete the set of keys. Therefore, for
              every combination of num_required - 1 bunnies, every other bunny
              holds the missing keys. Therefore, we can minimally issue keys by
              assigning a set of keys for each lock to a unique combination of
              num_buns - num_required + 1. In this way, every possible
              combination of num_required will hold all required keys, and every
              possible combination of num_required - 1 will not. We know this
              minimises the total number of keys because removing any key will
              result in a combination of bunnies that cannot open that lock,
              regardless of how the keys are assigned.
            </p>
            <PythonCodeDisplay
              codeFile={
                "/blog/files/google-foobar-challenge/freethebunnyworkers.py"
              }
            />
          </section>
        </section>
        <section className="foobar-challenge" id="sec-challenge5">
          <h2>Challenge 5</h2>
          <p>
            The fifth and last level contained only a single task, titled{" "}
            <a href="#sec-task-9">Dodge the Lasers!</a>
          </p>
          <section className="foobar-task" id="sec-task-9">
            <div className="foobar-task-description">
              Dodge the Lasers!
              <br />
              =================
              <br />
              <br />
              Write a function solution(str_n) which, given the string
              representation of an integer n, returns the sum of
              (floor(1*sqrt(2)) + floor(2*sqrt(2)) + ... + floor(n*sqrt(2))) as
              a string. That is, for every number i in the range 1 to n, it adds
              up all of the integer portions of i*sqrt(2).
              <br />
              <br />
              For example, if str_n was "5", the solution would be calculated as
              <br />
              floor(1*sqrt(2)) +<br />
              floor(2*sqrt(2)) +<br />
              floor(3*sqrt(2)) +<br />
              floor(4*sqrt(2)) +<br />
              floor(5*sqrt(2))
              <br />
              = 1+2+4+5+7 = 19
              <br />
              so the function would return "19".
              <br />
              <br />
              str_n will be a positive integer between 1 and 10^100, inclusive.
              Since n can be very large (up to 101 digits!), using just sqrt(2)
              and a loop won't work. Sometimes, it's easier to take a step back
              and concentrate not on what you have in front of you, but on what
              you don't.
              <br />
              <br />
              -- Test cases --
              <br />
              Input : solution('77')
              <br />
              Output: 4208
              <br />
              <br />
              Input : solution('5')
              <br />
              Output: 19
            </div>
            <p>The task is essentially to code a function that can evaluate</p>
            <BlockMath
              math={"f(n) =\\sum_{i=1}^n \\lfloor i \\sqrt{2} \\rfloor"}
            />
            <p>
              {" "}
              for any integer{" "}
              <InlineMath math={"1 \\leqslant n \\leqslant 10^{100}"} />. In my
              first attempt to solve this problem I used the Fourier series to
              derive an approximate solution, and then guess and checked to
              "hack" the verification process to tweak the result to pass the
              checks. The fractional part of a number <InlineMath math="x" />,
              the difference between the number and its floor, forms a{" "}
              <a
                href="https://en.wikipedia.org/wiki/Sawtooth_wave"
                target="_blank"
                rel="noopener noreferrer"
              >
                sawtooth function
              </a>{" "}
              with a known{" "}
              <a
                href="https://en.wikipedia.org/wiki/Fourier_series"
                target="_blank"
                rel="noopener noreferrer"
              >
                Fourier series
              </a>
              ,
            </p>
            <BlockMath
              math={
                "\\lbrace x\\rbrace = x - \\lfloor x \\rfloor = \\frac{1}{2} - \\frac{1}{\\pi} \\sum_{k=1}^\\infty\\frac{\\sin(2\\pi k x)} {k}."
              }
            />

            <p>
              Therefore, we can express the function <InlineMath math="f(n)" />{" "}
              as an infinite series,
            </p>
            <BlockMath
              math={`\\begin{aligned}
              f(n) &= \\sum_{i=1}^n \\left\\lfloor i \\sqrt{2} \\right\\rfloor, \\\\
              &= \\sum_{i=1}^n \\left[ i \\sqrt{2} -\\frac{1}{2} + \\frac{1}{\\pi} \\sum_{k=1}^\\infty\\frac{\\sin(2\\pi k i \\sqrt{2})}{k} \\right], \\\\
              &= \\frac{n(n+1)}{\\sqrt{2}} -\\frac{n}{2} + \\frac{1}{\\pi} \\sum_{k=1}^\\infty \\frac{\\sin(\\sqrt{2}\\pi k n) \\sin(\\sqrt{2}\\pi k (n+1))}{k \\sin(\\sqrt{2}\\pi k)}.
              \\end{aligned}`}
            />
            <p>
              The problem with this approach is that the infinite series
              sometimes converged very slowly, requiring too many terms to
              stabilise. Furthermore, passing the checks via guess and check did
              not leave me with a satisfying ending to an otherwise rewarding
              challenge. Therefore, I continued working on the problem, and
              during some research I discovered a breakthrough. The key insight
              into solving this problem is to identify the summand as a{" "}
              <a
                href="https://en.wikipedia.org/wiki/Beatty_sequence"
                target="_blank"
                rel="noopener noreferrer"
              >
                Beatty sequence
              </a>
              . The trick is to exploit the complementary Beatty sequence to
              create a recursive formula to compute the series. Let the largest
              term be <InlineMath math={"m=\\lfloor n\\sqrt{2} \\rfloor"} />,
            </p>
            <BlockMath
              math={`\\begin{aligned} 
              f(n) &= \\sum_{k=1}^n \\left\\lfloor k\\sqrt{2} \\right\\rfloor, \\\\
              &= \\sum_{k=1}^m k - \\sum_{k=1}^{m-n} \\left\\lfloor k(2+\\sqrt{2}) \\right\\rfloor, \\\\
              &= \\sum_{k=1}^m k - 2\\sum_{k=1}^{m-n} k - \\sum_{k=1}^{m-n} \\left\\lfloor k\\sqrt{2} \\right\\rfloor, \\\\
              &= \\frac{m(m+1)}{2} - (m-n)(m-n+1) - f(m-n). 
              \\end{aligned}`}
            />
            <p>
              The size of the function argument is reduced by a factor of at
              least
              <InlineMath math={"\\sqrt{2}-1 < 0.5"} />. Therefore, the depth of
              the recursion is bounded by <InlineMath math={"\\log_2 n"} /> for
              large enough <InlineMath math="n" />, and is approximately{" "}
              <InlineMath math={"-\\log_2 n / \\log_2(\\sqrt{2}-1)"} />.
              <br />
              <br />
              Note that the code must be able to compute{" "}
              <InlineMath math={"m=\\lfloor n\\sqrt{2}\\rfloor"} />. The naive
              approach would require <InlineMath math={"\\sqrt{2}"} /> to be
              known to very high precision. Instead, I accomplished this by
              computing <InlineMath math={"m=\\lfloor\\sqrt{2n^2} \\rfloor"} />{" "}
              using a form of{" "}
              <a
                href="https://en.wikipedia.org/wiki/Integer_square_root#Using_only_integer_division"
                target="_blank"
                rel="noopener noreferrer"
              >
                Heron's method
              </a>{" "}
              that was adapted for integer operations only.
            </p>
            <PythonCodeDisplay
              codeFile={"/blog/files/google-foobar-challenge/dodgethelasers.py"}
            />
          </section>
        </section>
        <section className="foobar-challenge" id="sec-bonus">
          <h2>Bonus Tasks</h2>
          <p>
            After completing all five levels of the challenge, I found that I
            could still request new tasks. I believe these bonus tasks are
            alternative or old level 5 tasks. These extra tasks were titled{" "}
            <a href="#sec-task-10">Expanding Nebula</a>,{" "}
            <a href="#sec-task-11">Disorderly Escape</a> and{" "}
            <a href="#sec-task-12">Escape Pods</a>.
          </p>
          <section className="foobar-task" id="sec-task-10">
            <div className="foobar-task-description">
              Expanding Nebula
              <br />
              ================
              <br />
              The gas of the steadily expanding nebula can be modelled as a 2D
              grid. You find that the current existence of gas in a cell of the
              grid is determined exactly by its 4 nearby cells, specifically,
              (1) that cell, (2) the cell below it, (3) the cell to the right of
              it, and (4) the cell below and to the right of it. If, in the
              current state, exactly 1 of those 4 cells in the 2x2 block has
              gas, then it will also have gas in the next state. Otherwise, the
              cell will be empty in the next state.
              <br />
              <br />
              For example, let's say the previous state of the grid (p) was:
              <br />
              .O..
              <br />
              ..O.
              <br />
              ...O
              <br />
              O...
              <br />
              <br />
              To see how this grid will change to become the current grid (c)
              over the next time step, consider the 2x2 blocks of cells around
              each cell. Of the 2x2 block of [p[0][0], p[0][1], p[1][0],
              p[1][1]], only p[0][1] has gas in it, which means this 2x2 block
              would become cell c[0][0] with gas in the next time step:
              <br />
              .O -{">"} O<br />
              ..
              <br />
              <br />
              Likewise, in the next 2x2 block to the right consisting of
              [p[0][1], p[0][2], p[1][1], p[1][2]], two of the containing cells
              have gas, so in the next state of the grid, c[0][1] will NOT have
              gas:
              <br />
              O. -{">"} .<br />
              .O
              <br />
              <br />
              Following this pattern to its conclusion, from the previous state
              p, the current state of the grid c will be:
              <br />
              O.O
              <br />
              .O.
              <br />
              O.O
              <br />
              <br />
              Note that the resulting output will have 1 fewer row and column,
              since the bottom and rightmost cells do not have a cell below and
              to the right of them, respectively.
              <br />
              <br />
              Write a function solution(g) where g is an array of array of bools
              saying whether there is gas in each cell (the current scan of the
              nebula), and return an int with the number of possible previous
              states that could have resulted in that grid after 1 time step.
              For instance, if the function were given the current state c
              above, it would deduce that the possible previous states were p
              (given above) as well as its horizontal and vertical reflections,
              and would return 4. The width of the grid will be between 3 and 50
              inclusive, and the height of the grid will be between 3 and 9
              inclusive. The solution will always be less than one billion
              (10^9).
              <br />
              <br />
              -- Test cases --
              <br />
              Input: solution([[True, True, False, True, False, True, False,
              True, True, False], [True, True, False, False, False, False, True,
              True, True, False], [True, True, False, False, False, False,
              False, False, False, True], [False, True, False, False, False,
              False, True, True, False, False]])
              <br />
              Output: 11567
              <br />
              <br />
              Input: solution([[True, False, True], [False, True, False], [True,
              False, True]])
              <br />
              Output: 4<br />
              <br />
              Input: solution([[True, False, True, False, False, True, True,
              True], [True, False, True, False, False, False, True, False],
              [True, True, True, False, False, False, True, False], [True,
              False, True, False, False, False, True, False], [True, False,
              True, False, False, True, True, True]])
              <br />
              Output: 254
            </div>
            <p>
              The key to solving this problem is to use bitwise operations to
              significantly improve computational efficiency. Essentially, lists
              of booleans can be interpreted as a binary representation of an
              integer. For example, [True, False, True] would be 101 in binary
              which is equivalent to 5 in decimal. Bitwise operations allows us
              to compare two lists in a single operation. My solution works as
              follows.
              <br />
              <br />g is a boolean array (list of lists of bools) that is an
              outcome of a previous state, s, such that for all rows and cols
              g[row][col] is True if and only if exactly one of the following is
              True: s[row][col], s[row+1][col], s[row][col+1], s[row+1][col+1].
              solution(g) returns the number of unique previous states s that
              can produce g. It does this efficiently in four steps:
            </p>
            <ol className="numberedList">
              <li>
                Rows of g and s are represented as the decimal integers that are
                equal to a binary integer where each digit is given by the
                column of that row. Representing the rows as integers allows
                efficient boolean computations using the bitwise operations &,
                |, &lt;&lt;, &gt;&gt;.
              </li>
              <li>
                Every combination of row pairs of s is simulated to generate a
                possible row in g. If such a row exists in g, then these
                potential row pairs are recorded in a dictionary called
                potentials.
              </li>
              <li>
                For every row in g, all possible values of the corresponding row
                in g are tracked as well as the number of unique ways to reach
                that combination, given all the previous rows.
              </li>
              <li>
                The total number of unique states, s, is given by adding up the
                number of ways the last row of s is possible for each possible
                value of that last row.
              </li>
            </ol>

            <PythonCodeDisplay
              codeFile={
                "/blog/files/google-foobar-challenge/expandingnebula.py"
              }
            />
          </section>
          <section className="foobar-task" id="sec-task-11">
            <div className="foobar-task-description">
              Disorderly Escape
              <br />
              =================
              <br />
              Write a function solution(w, h, s) that takes 3 integers and
              returns the number of unique, non-equivalent configurations that
              can be found on a star grid w blocks wide and h blocks tall where
              each celestial body has s possible states. Equivalency is defined
              as above: any two star grids with each celestial body in the same
              state where the actual order of the rows and columns do not matter
              (and can thus be freely swapped around). Star grid standardization
              means that the width and height of the grid will always be between
              1 and 12, inclusive. And while there are a variety of celestial
              bodies in each grid, the number of states of those bodies is
              between 2 and 20, inclusive. The solution can be over 20 digits
              long, so return it as a decimal string. The intermediate values
              can also be large, so you will likely need to use at least 64-bit
              integers.
              <br />
              <br />
              For example, consider w=2, h=2, s=2. We have a 2x2 grid where each
              celestial body is either in state 0 (for instance, silent) or
              state 1 (for instance, noisy). We can examine which grids are
              equivalent by swapping rows and columns.
              <br />
              <br />
              00
              <br />
              00
              <br />
              <br />
              In the above configuration, all celestial bodies are "silent" -
              that is, they have a state of 0 - so any swap of row or column
              would keep it in the same state.
              <br />
              <br />
              00 00 01 10
              <br />
              01 10 00 00
              <br />
              <br />
              1 celestial body is emitting noise - that is, has a state of 1 -
              so swapping rows and columns can put it in any of the 4 positions.
              All four of the above configurations are equivalent.
              <br />
              <br />
              00 11
              <br />
              11 00
              <br />
              <br />
              2 celestial bodies are emitting noise side-by-side. Swapping
              columns leaves them unchanged, and swapping rows simply moves them
              between the top and bottom. In both, the *groupings* are the same:
              one row with two bodies in state 0, one row with two bodies in
              state 1, and two columns with one of each state.
              <br />
              <br />
              01 10
              <br />
              01 10
              <br />
              <br />
              2 noisy celestial bodies adjacent vertically. This is symmetric to
              the side-by-side case, but it is different because there's no way
              to transpose the grid.
              <br />
              <br />
              01 10
              <br />
              10 01
              <br />
              <br />
              2 noisy celestial bodies diagonally. Both have 2 rows and 2
              columns that have one of each state, so they are equivalent to
              each other.
              <br />
              <br />
              01 10 11 11
              <br />
              11 11 01 10
              <br />
              <br />
              3 noisy celestial bodies, similar to the case where only one of
              four is noisy.
              <br />
              <br />
              11
              <br />
              11
              <br />
              <br />
              4 noisy celestial bodies.
              <br />
              <br />
              There are 7 distinct, non-equivalent grids in total, so
              solution(2, 2, 2) would return 7.
              <br />
              <br />
              -- Test cases --
              <br />
              Input: solution(2, 3, 4)
              <br />
              Output: 430
              <br />
              <br />
              Input: solution(2, 2, 2)
              <br />
              Output: 7
            </div>
            <p>
              To solve this problem I had to brush-up on my{" "}
              <a
                href="https://en.wikipedia.org/wiki/Group_theory"
                target="_blank"
                rel="noopener noreferrer"
              >
                group theory
              </a>
              . I found the{" "}
              <a
                href="https://youtube.com/playlist?list=PL8yHsr3EFj51pjBvvCPipgAT3SYpIiIsJ"
                target="_blank"
                rel="noopener noreferrer"
              >
                Group Theory
              </a>{" "}
              course on YouTube by Fields Medalist Professor Richard Borcherds a
              helpful resource. The symmetries of grids form a group.
              Specifically, the direct product of two finite{" "}
              <a
                href="https://en.wikipedia.org/wiki/Symmetric_group"
                target="_blank"
                rel="noopener noreferrer"
              >
                symmetric groups
              </a>{" "}
              <InlineMath math={"S_w \\times S_h"} />. This is because grids are
              symmetric under row permutations and column permutations
              independently. A symmetric group of degree <InlineMath math="n" />{" "}
              has an order of <InlineMath math={"n!"} />, so the order of{" "}
              <InlineMath math={"S_w \\times S_h"} /> is{" "}
              <InlineMath math={"w!h!"} />.
              <br />
              <br />
              The number of configurations is equivalent to the number of orbits
              in the group <InlineMath math={"S_w \\times S_h"} />. This can be
              computed using{" "}
              <a
                href="https://en.wikipedia.org/wiki/Burnside%27s_lemma"
                target="_blank"
                rel="noopener noreferrer"
              >
                Burnside's counting theorem
              </a>
              .
            </p>
            <BlockMath
              math={
                "N(w,h,s)= \\frac{1}{w!h!} \\sum_{g_w\\in S_w } \\sum_{g_h\\in S_h}s^{C(g_w,g_h)}"
              }
            />
            <p>
              where <InlineMath math={"C(g_w,g_h)"} /> is the number of cycles
              in <InlineMath math={"g_h \\times g_w"} />. Many permutations
              contain the same combination of cycles, so we can group these
              terms to significantly reduce the size of the sum.
              <br />
              <br />
              For example, the permutation,{" "}
              <InlineMath math={"g_w = (2, 1, 4,5,3)"} />
              ,contains two cycles: one of length 2 and one of length 3. The
              total length of the permutation is the sum of the cycle lengths,{" "}
              <InlineMath math={"5 = 2+3"} />. Let <InlineMath math={"Q_w"} />{" "}
              and <InlineMath math={"Q_h"} /> be the sets of unique combinations
              of cycle lengths in <InlineMath math={"S_w"} /> and{" "}
              <InlineMath math={"S_h"} /> respectively. For example,
            </p>
            <BlockMath
              math={"Q_4=\\{(4), (3, 1), (2, 2), (2, 1, 1), (1, 1, 1, 1)\\},"}
            />
            <BlockMath
              math={
                "Q_5=\\{(5), (4, 1), (3, 2), (3, 1, 1), (2, 2, 1), (2, 1, 1, 1), (1, 1, 1, 1, 1)\\}."
              }
            />
            <p>
              When combining the row and column permutations, every cycle in the
              row permutation is paired with every cycle in the column
              permutation. The number of cycles in the array formed by a
              pairing, is the greatest common divisor (gcd). Therefore, the
              total number of configurations is
            </p>
            <BlockMath
              math={`N(w,h,s)= \\frac{1}{w!h!} \\sum_{q_w\\in Q_w }
      \\sum_{q_h\\in Q_h } \\frac{w!}{\\prod_{i=1}^w i^{m_i} m_i!} \\frac{h!}{\\prod_{j=1}^h j^{m_j} m_j!} s^{\\sum_{a \\in q_w}\\sum_{b \\in
      q_h}\\gcd(a,b)}`}
            />
            <p>
              where <InlineMath math={"m_i"} /> and <InlineMath math={"m_j"} />{" "}
              are the number of cycles of lengths <InlineMath math="i" /> and{" "}
              <InlineMath math="j" /> in <InlineMath math={"q_w"} /> and{" "}
              <InlineMath math={"q_h"} /> respectively.
            </p>
            <PythonCodeDisplay
              codeFile={
                "/blog/files/google-foobar-challenge/disorderlyescape.py"
              }
            />
          </section>
          <section className="foobar-task" id="sec-task-12">
            <div className="foobar-task-description">
              Escape Pods
              <br />
              ===========
              <br />
              Write a function solution(entrances, exits, path) that takes an
              array of integers indexing where the entrances are, an array of
              integers indexing where the exits are, and an array of an array of
              integers of the corridors, returning the maximum number of bunnies
              that can get through at each time step as an int. The entrances
              and exits are disjoint and thus will never overlap. The path
              element path[A][B] = C describes that the corridor going from A to
              B can fit C bunnies at each time step. There are at most 50 rooms
              connected by the corridors and at most 2000000 bunnies that will
              fit at a time.
              <br />
              <br />
              For example, if you have:
              <br />
              entrances = [0, 1]
              <br />
              exits = [4, 5]
              <br />
              path = [<br />
              [0, 0, 4, 6, 0, 0], # Room 0: Bunnies
              <br />
              [0, 0, 5, 2, 0, 0], # Room 1: Bunnies
              <br />
              [0, 0, 0, 0, 4, 4], # Room 2: Intermediate room
              <br />
              [0, 0, 0, 0, 6, 6], # Room 3: Intermediate room
              <br />
              [0, 0, 0, 0, 0, 0], # Room 4: Escape pods
              <br />
              [0, 0, 0, 0, 0, 0], # Room 5: Escape pods
              <br />
              ]<br />
              <br />
              Then in each time step, the following might happen:
              <br />
              0 sends 4/4 bunnies to 2 and 6/6 bunnies to 3<br />
              1 sends 4/5 bunnies to 2 and 2/2 bunnies to 3<br />
              2 sends 4/4 bunnies to 4 and 4/4 bunnies to 5<br />
              3 sends 4/6 bunnies to 4 and 4/6 bunnies to 5<br />
              <br />
              So, in total, 16 bunnies could make it to the escape pods at 4 and
              5 at each time step. (Note that in this example, room 3 could have
              sent any variation of 8 bunnies to 4 and 5, such as 2/6 and 6/6,
              but the final solution remains the same.)
              <br />
              <br />
              -- Test cases --
              <br />
              Input: solution([0], [3], [[0, 7, 0, 0], [0, 0, 6, 0], [0, 0, 0,
              8], [9, 0, 0, 0]])
              <br />
              Output: 6<br />
              <br />
              Input: solution([0, 1], [4, 5], [[0, 0, 4, 6, 0, 0], [0, 0, 5, 2,
              0, 0], [0, 0, 0, 0, 4, 4], [0, 0, 0, 0, 6, 6], [0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0]])
              <br />
              Output: 16
              <br />
            </div>
            <p>
              My first idea to solve this problem was to use{" "}
              <a
                href="https://en.wikipedia.org/wiki/Integer_programming"
                target="_blank"
                rel="noopener noreferrer"
              >
                integer linear programming
              </a>
              . However, after some more thought and research I realised the
              problem could be modelled as a{" "}
              <a
                href="https://en.wikipedia.org/wiki/Flow_network"
                target="_blank"
                rel="noopener noreferrer"
              >
                flow network
              </a>
              , where the maximum flow can be efficiently computed using the{" "}
              <a
                href="https://en.wikipedia.org/wiki/Push%E2%80%93relabel_maximum_flow_algorithm"
                target="_blank"
                rel="noopener noreferrer"
              >
                push-relabel algorithm
              </a>
              . I implimented the version taught in the lecture from{" "}
              <a
                href="https://youtu.be/0hI89H39USg"
                target="_blank"
                rel="noopener noreferrer"
              >
                A Second Course in Algorithms (Stanford CS261, Winter 2016)
              </a>{" "}
              found on YouTube.
              <br />
              <br />
            </p>
            <PythonCodeDisplay
              codeFile={"/blog/files/google-foobar-challenge/escapepods.py"}
            />
          </section>
        </section>
      </div>
    </>
  );
};

export default ArticleGoogleFoobarChallenge;
