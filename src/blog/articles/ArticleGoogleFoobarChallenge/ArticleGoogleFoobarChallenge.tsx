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
    </>
  );
};

export default ArticleGoogleFoobarChallenge;
