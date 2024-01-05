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
      <section className="foobar-challenge" id="sec-challenge1">
        <h2>Challenge 1</h2>
        <p>
          The first level contained only a single task, titled&nbsp;
          <a href="#sec-task-1">Re-ID</a>, which involved efficiently generating
          prime numbers. A task summary, adapted from the original challenge
          instructions, is given below.
        </p>
        <section className="foobar-task" id="sec-task-1">
          <div className="foobar-task-description">
            Re-ID
            <br />
            =====
            <br />
            <br />
            Write a function solution(n) which takes in the starting index n of
            a string of all primes, "2357111317192329...", and returns the next
            five digits in the string. For example, if n is 3 then their ID
            number will be "71113". The value of n will always be between 0 and
            10000.
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
            trivially given by returning the five digits starting at index&nbsp;
            <InlineMath math="n" />. Therefore, I solved this problem by
            defining a function that firstly generated this string of primes.
            This function works by checking the primality of all integers from{" "}
            <InlineMath math="2" /> to{" "}
            <InlineMath math={"m=20+\\lfloor n \\ln 10 \\rfloor"} />. This
            choice of <InlineMath math="m" /> ensures that the resulting string
            of primes is at least <InlineMath math="n+5" /> characters long,
            without too much excessive computation.
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
            <InlineMath math={"n+5 < \\pi(m)\\lceil \\log m \\rceil"} /> should
            ensure the resulting string is long enough when{" "}
            <InlineMath math="n" /> is large. This condition is satisfied by
          </p>
          <BlockMath math={"m=20+\\lfloor n \\ln 10 \\rfloor,"} />
          <p>
            which I checked empirically worked for when <InlineMath math="n" />{" "}
            is low.
            <br />
            <br />
            Each integer is considered prime if no previously identified prime
            numbers divide it. This involves checking all previously identified
            prime numbers less than or equal to the square-root of the current
            candidate number (there is no point checking factors higher than the
            square-root because they all pair with divisors less than the
            square-root). Once the list of prime numbers is generated then the
            integers are converted to strings before being joined into a single
            string.
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
            You have L, a list containing some digits (0 to 9). Write a function
            solution(L) which finds the largest number that can be made from
            some or all of these digits and is divisible by 3. If it is not
            possible to make such a number, return 0 as the solution. L will
            contain anywhere from 1 to 9 digits. The same digit may appear
            multiple times in the list, but each element in the list may only be
            used once.
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
            finding the largest number containing all the digits in the list L.
            Obviously, this is achieved by sorting the list with the largest on
            the left to the smallest on the right, so that the larger digits
            correspond to the higher decimal positions. Removing any digit will
            strictly decrease the size of the number (except when all digits are
            zero). Therefore, this result forms an upper bound to the original
            problem of finding the largest number that is also divisible by
            three.
            <br />
            <br />
            Now we can make use of the property of decimal numbers that they are
            divisible by 3 if and only if the sum of their digits is also
            divisible by three. Or, more generally, that the number is congruent
            modulo 3 to its digit sum. Since the order of a summation does not
            effect the result, we can use this rule to check the modularity of a
            list of numbers without knowing the order. Next we note that
            removing any two digits never lowers the value by less than only
            removing any one digit. Also note that removing a larger digit will
            lower the value by more than removing a lower digit. Therefore, we
            can solve the problem by firstly minimising the number of digits
            that need to be removed, and then minimising the values of the
            removed digits.
            <br />
            <br />
            The sum of digits can be congruent to 0, 1 or 2 (mod 3). In the
            first case, any permutation of all digits is divisible by 3 without
            removing any digits. Therefore, the solution returns the number
            containing all the digits in descending order. If the sum is
            congruent to 1 or 2, then there are three cases. Firstly, one of the
            digits is congruent to the sum, in which case, we just remove the
            smallest such digit. Secondly, two of the digits are congruent to
            twice the sum, in which case we remove the two smallest such digits.
            Thirdly, no combination of digits is divisible by 3, so return 0.
            After removing any digits, the solution is the number containing all
            the remaining digits in descending order. Note, that if there are no
            remaining digits, then return 0.
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
            points (x, y), with x being the distance from the vertical wall, and
            y being the height from the ground. For example, the value at (1, 1)
            is 1, the value at (3, 2) is 9, and the value at (2,3) is 8. This
            pattern of numbering continues indefinitely.
            <br />
            <br />
            | 7<br />
            | 4 8<br />
            | 2 5 9<br />
            | 1 3 6 10
            <br />
            <br />
            Write a function solution(x, y) which returns the grid value at the
            location (x, y). Both x and y will be at least 1 and no greater than
            100,000. Since the values can be very large, return your solution as
            a string representation of the number.
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
            large as 100000 so generating the entire grid would probably be much
            slower than directly calculating the values from a closed form
            expression for <InlineMath math={"f(x,y)"} />. To find one, I first
            noticed that the first row is given by the{" "}
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
            <InlineMath math={"k=y-1"} /> in the recursive relationship and then
            using the result for <InlineMath math={"f(x,1)"} /> by substituting{" "}
            <InlineMath math={"x\\rightarrow x+y-1"} />
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
            and 1s are impassable walls. The path may remove up to one wall. The
            path length is the total number of nodes you pass through, counting
            both the entrance and exit nodes. The starting and ending positions
            are always passable (0). The map will always be solvable, though you
            may or may not need to remove a wall. The height and width of the
            map can be from 2 to 20. Moves can only be made in cardinal
            directions; no diagonal moves are allowed.
            <br />
            <br />
            -- Test cases --
            <br />
            Input : solution([[0, 1, 1, 0], [0, 0, 0, 1], [1, 1, 0, 0], [1, 1,
            1, 0]])
            <br />
            Output: 7<br />
            <br />
            Input : solution([[0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 0], [0, 0, 0,
            0, 0, 0], [0, 1, 1, 1, 1, 1], [0, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0,
            0]])
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
            as a lower bound to the remaining distance between any node and the
            end node. After implementing the A* algorithm I use it to find the
            shortest path lengths of all possible maps with exactly 1 or 0 walls
            removed. The function then returns the smallest of these path
            lengths.
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
            Write a function called solution(n) that takes a positive integer n
            and returns the number of different staircases that can be built
            from exactly n bricks. n will always be between 3 and 200
            (inclusive). Each type of staircase should consist of 2 or more
            steps with no two steps being at the same height. All steps must
            contain at least one brick. A step's height is classified as the
            total amount of bricks that make up that step.
            <br />
            <br />
            For example, when n = 3, you have only 1 choice of how to build the
            staircase, with the first step having a height of 2 and the second
            step having a height of 1: (# indicates a brick)
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
            the given bricks. The two staircases can have heights (4, 1) or (3,
            2), as shown below:
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
            <InlineMath math="w(n,m,s)" /> which calculates the number of valid
            staircases that can be built with <InlineMath math="n" /> bricks,
            with each stair containing a maximum of <InlineMath math="m" />{" "}
            bricks and at least <InlineMath math="s" /> more steps. We can
            express <InlineMath math="w" /> as a recursive function.
            Specifically, the number of staircases that can be built is the sum
            of the number of staircases that can be built given the size of the
            next step. For example, if there are 5 bricks, then the number of
            possible staircases is the number of staircases that end with a
            height of 1, plus the number that end with a height of 2, plus a
            height of 3 and plus a height of 4.
            <br />
            <br />
            There are two base cases to this recursion. The first occurs when
            there are too many bricks. This occurs when the number of bricks is
            more than a maximal staircase with a constant step size of 1,{" "}
            <InlineMath math={"n > m(m+1)/2"} />. In this case, the number of
            valid staircases is 0. The second base case occurs when there are no
            bricks <InlineMath math="n=0" />, and the minimum number of
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
            <br />n = 4 requires two operations: 4 -{">"} 2 -{">"} 1<br />n = 15
            requires five operations: 15 -{">"} 16 -{">"} 8 -{">"} 4 -{">"} 2 -
            {">"} 1<br />
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
            minimising the number of operations to reach 1. Firstly, no shortest
            trajectory would contain a <InlineMath math="+1" /> operation
            immediately followed by a <InlineMath math="-1" /> operation, or
            vice versa, because any trajectory containing any such consecutive
            operations could be shortened by 2 steps by removing them. Secondly,
            even numbers should always be divided by 2. This is because a
            trajectory that repeats the other operations followed by a division
            can be shortened by dividing first. For example,
          </p>
          <BlockMath
            math={`\\begin{aligned} &2k \\rightarrow 2k\\pm 1 \\rightarrow 2k\\pm
            2 \\rightarrow k\\pm 1, \\\\ &2k \\rightarrow k \\hphantom{2 + 1}
            \\rightarrow k\\pm 1, \\end{aligned}`}
          />
          <p>
            where <InlineMath math="k" /> is any natural number. Basically, the
            number of consecutive addition or subtraction operations can be cut
            in half (or half plus 1) by dividing first. Note that this assumes
            that eventually there will be another halving operation. Except in
            the cases of <InlineMath math="n=2" /> and <InlineMath math="n=3" />{" "}
            where both halving and subtracting 1 will work, in every other case
            halving requires fewer operations than subtracting 1. Specifically,
            continuously subtracting 1 requires exactly{" "}
            <InlineMath math="n-1" /> operations, while halving every even and
            subtracting 1 off every odd number will require no more than{" "}
            <InlineMath math={"2\\lceil \\log_2 (n+1) \\rceil -2"} /> (when{" "}
            <InlineMath math="n" /> is one less than a power of 2) operations
            and no less than <InlineMath math={"\\lceil \\log_2 n \\rceil"} />{" "}
            (when <InlineMath math="n" /> is a power of 2) operations.
            Obviously, repeated additions can never reach 1 since they strictly
            increase the number. Therefore, for all <InlineMath math="n>3" />{" "}
            there exists a shortest sequence of operations whereby every even
            value is halved, and the number of even values is at least one.
            <br />
            <br />
            To decide on a rule for odd values, let us consider the two possible
            cases where <InlineMath math={"n=4k+1"} /> and{" "}
            <InlineMath math={"n=4k+3"} /> for any natural number,{" "}
            <InlineMath math="k" />. In the first case we can draw the following
            tree.
            <br />
            <br />
            <img
              src="/images/blog/google-foobar-challenge/foobar_c3c_a.svg"
              alt="flow diagram"
              className="tikz-diagram"
            />
            <br />
            In this case adding 1 inevitably leads to either{" "}
            <InlineMath math="k" /> or <InlineMath math="k+1" />, both of which
            can be reached in fewer or equal number of operations by subtracting
            1. Therefore, when <InlineMath math="n=4k+1" /> subtracting 1 is
            weakly faster than adding 1. Given this strategy, we can make an
            analogous decision tree for the <InlineMath math="n=4k+3" /> case.
            <br />
            <br />
            <img
              src="/images/blog/google-foobar-challenge/foobar_c3c_b.svg"
              alt="flow diagram"
              className="tikz-diagram"
            />
            <br />
            Now choosing to subtract 1 will inevitably lead to either{" "}
            <InlineMath math="k" /> or <InlineMath math="k+1" />, both of which
            can be reached in fewer or equal number of operations by adding 1.
            Therefore, when <InlineMath math="n=4k+3" /> adding 1 is weakly
            faster than subtracting 1. <br />
            <br />
            Finally, let us consider the simple small cases of which cannot be
            expressed as <InlineMath math="n=4k+r" />. When{" "}
            <InlineMath math="n=1" /> we do not need any operations so return 0,
            when <InlineMath math="n=2" /> follow the halving even rule to get
            to 1 needs only 1 operation, and when <InlineMath math="n=3" />{" "}
            subtracting 1, rather than adding 1 is faster. Therefore, we can
            define the following recursive function to solve the problem,
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
    </>
  );
};

export default ArticleGoogleFoobarChallenge;
