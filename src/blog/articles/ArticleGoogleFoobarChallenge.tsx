import React from "react";
import "./ArticleGoogleFoobarChallenge.css";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const ArticleGoogleFoobarChallenge: React.FC = () => {
  return (
    <>
      <Helmet>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
        <script
          id="MathJax-script"
          async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        ></script>
      </Helmet>
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
        <Link to="#sec-challenge1" id="a-challenge1">
          Challenge 1
        </Link>
        <Link to="#sec-challenge2" id="a-challenge2">
          Challenge 2
        </Link>
        <Link to="#sec-challenge3" id="a-challenge3">
          Challenge 3
        </Link>
        <Link to="#sec-challenge4" id="a-challenge4">
          Challenge 4
        </Link>
        <Link to="#sec-challenge5" id="a-challenge5">
          Challenge 5
        </Link>
        <Link to="#sec-bonus" id="a-bonus">
          Bonus
        </Link>
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
          <Link to="#sec-task-1">Re-ID</Link>, which involved efficiently
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
            trivially given by returning the five digits starting at index
            \(n\). Therefore, I solved this problem by defining a function that
            firstly generated this string of primes. This function works by
            checking the primality of all integers from \(2\) to \(m=20+\lfloor
            n \ln 10 \rfloor \). This choice of \(m\) ensures that the resulting
            string of primes is at least \(n+5\) characters long, without too
            much excessive computation.
            <br />
            <br />
            This is a result of the
            <a
              href="https://mathworld.wolfram.com/PrimeNumberTheorem.html"
              target="_blank"
            >
              prime number theorem
            </a>
            which gives an asymptotic expression for the prime counting
            function, {"[pi(m)sim{m over ln m},]"} which counts the number of
            prime numbers \(\leqslant m\). The maximum number of digits each
            prime can have is \(\lceil \log m \rceil\) (base 10). Therefore,
            having \(n+5 &lt; \pi(m)\lceil \log m \rceil\) should ensure the
            resulting string is long enough when \(n\) is large. This condition
            is satisfied by \[m=20+\lfloor n \ln 10 \rfloor ,\] which I checked
            empirically worked for when \(n\) is low.
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
        </section>
      </section>
    </>
  );
};

export default ArticleGoogleFoobarChallenge;
