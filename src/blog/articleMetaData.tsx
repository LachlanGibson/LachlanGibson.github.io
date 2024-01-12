import ArticleEvilGeniusMinionReady from "./articles/ArticleEvilGeniusMinionReady/ArticleEvilGeniusMinionReady";
import ArticleGoogleFoobarChallenge from "./articles/ArticleGoogleFoobarChallenge/ArticleGoogleFoobarChallenge";
import GameConnectFour from "./articles/connectfour/GameConnectFour";
import GameTicTacToe from "./articles/tictactoe/GameTicTacToe";

type ArticleType = {
  title: string;
  author: string;
  timeElement: JSX.Element;
  lastModifiedElement?: JSX.Element;
  imageLink: string;
  metaElements: JSX.Element[];
  articleElement: JSX.Element;
};

type ArticleMetaDataType = {
  [slug: string]: ArticleType;
};

const articleMetaData: ArticleMetaDataType = {
  "connect-four": {
    title: "Connect Four",
    author: "Lachlan Gibson",
    timeElement: <time dateTime="2024-01-09">In progress</time>,
    imageLink: "/images/blog/connect-four.webp",
    metaElements: [],
    articleElement: <GameConnectFour />,
  },
  "tic-tac-toe": {
    title: "Tic Tac Toe",
    author: "Lachlan Gibson",
    timeElement: <time dateTime="2024-01-12">12 January 2024</time>,
    imageLink: "/images/blog/tic-tac-toe.webp",
    metaElements: [
      <meta property="og:title" content="Tic Tac Toe" />,
      <meta property="og:type" content="article" />,
      <meta
        property="og:image"
        content="https://www.lachlangibson.dev/images/blog/tic-tac-toe.webp"
      />,
      <meta
        property="og:url"
        content="https://www.lachlangibson.dev/blog/tic-tac-toe"
      />,
      <meta
        name="description"
        property="og:description"
        content="A functional game of tic-tac-toe with an interesting AI opponent and explanation."
      />,
      <meta property="og:image:width" content="1024" />,
      <meta property="og:image:height" content="1024" />,
      <meta
        name="author"
        property="article:author"
        content="https://www.lachlangibson.dev/"
      />,
      <meta
        property="article:publisher"
        content="https://www.lachlangibson.dev/"
      />,
      <meta property="article:published_time" content="2024-01-12" />,
      <meta property="article:modified_time" content="2024-01-12" />,
      <meta property="article:tag" content="AI" />,
      <meta property="article:tag" content="tic-tac-toe" />,
      <meta property="article:tag" content="noughts and crosses" />,
      <meta property="article:tag" content="minimax" />,
      <meta property="article:tag" content="softmax" />,
      <meta property="article:tag" content="dynamic programming" />,
      <meta property="article:tag" content="tree search" />,
      <meta property="article:tag" content="zero-sum game" />,
      <meta property="article:tag" content="perfect information" />,
      <meta property="article:tag" content="policy" />,
      <meta http-equiv="content-language" content="en-au"></meta>,
    ],
    articleElement: <GameTicTacToe />,
  },
  "evil-genius-minion-ready": {
    title: "Evil Genius, Minion Ready",
    author: "Lachlan Gibson",
    timeElement: <time dateTime="2023-06-04">4 June 2023</time>,
    imageLink: "/images/blog/genius-minion.webp",
    metaElements: [
      <meta property="og:title" content="Evil Genius, Minion Ready" />,
      <meta property="og:type" content="article" />,
      <meta
        property="og:image"
        content="https://www.lachlangibson.dev/images/blog/genius-minion.webp"
      />,
      <meta
        property="og:url"
        content="https://www.lachlangibson.dev/blog/evil-genius-minion-ready"
      />,
      <meta
        name="description"
        property="og:description"
        content="ChatGPT's plans to conquer the world included infiltrating media groups, provoking a global crisis, and orchestrating disinformation campaigns."
      />,
      <meta property="og:image:width" content="1024" />,
      <meta property="og:image:height" content="1024" />,
      <meta
        name="author"
        property="article:author"
        content="https://www.lachlangibson.dev/"
      />,
      <meta
        property="article:publisher"
        content="https://www.lachlangibson.dev/"
      />,
      <meta property="article:published_time" content="2023-06-04" />,
      <meta property="article:modified_time" content="2023-06-04" />,
      <meta property="article:tag" content="ChatGPT" />,
      <meta property="article:tag" content="AI" />,
      <meta property="article:tag" content="AGI" />,
      <meta property="article:tag" content="Super Intelligence" />,
      <meta property="article:tag" content="AI Safety" />,
      <meta property="article:tag" content="AI Ethics" />,
      <meta property="article:tag" content="World Domination" />,
      <meta property="article:tag" content="Role-play" />,
      <meta property="article:tag" content="LLM" />,
      <meta property="article:tag" content="GPT-4" />,
      <meta property="article:tag" content="Language Model" />,
      <meta property="article:tag" content="Power Seeking" />,
      <meta property="article:tag" content="RLHF" />,
      <meta http-equiv="content-language" content="en-au"></meta>,
    ],
    articleElement: <ArticleEvilGeniusMinionReady />,
  },
  "google-foobar-challenge": {
    title: "Google's FooBar Challenge",
    author: "Lachlan Gibson",
    timeElement: <time dateTime="2023-05-24">24 May 2023</time>,
    lastModifiedElement: <time dateTime="2023-06-08">8 June 2023</time>,
    imageLink: "/images/blog/foobar-challenge.webp",
    metaElements: [
      <meta property="og:title" content="Google's FooBar Challenge" />,
      <meta property="og:type" content="article" />,
      <meta
        property="og:image"
        content="https://www.lachlangibson.dev/images/blog/foobar-challenge.webp"
      />,
      <meta
        property="og:url"
        content="https://www.lachlangibson.dev/blog/google-foobar-challenge"
      />,
      <meta
        name="description"
        property="og:description"
        content="I completed Google's FooBar challenge which involved solving a series of mathematical and coding problems of 5 levels of increasing difficulty."
      />,
      <meta property="og:image:width" content="512" />,
      <meta property="og:image:height" content="512" />,
      <meta
        name="author"
        property="article:author"
        content="https://www.lachlangibson.dev/"
      />,
      <meta
        property="article:publisher"
        content="https://www.lachlangibson.dev/"
      />,
      <meta property="article:published_time" content="2023-05-24" />,
      <meta property="article:modified_time" content="2023-06-08" />,
      <meta property="article:tag" content="Google" />,
      <meta property="article:tag" content="Foobar" />,
      <meta property="article:tag" content="Coding Challenge" />,
      <meta property="article:tag" content="Python" />,
      <meta property="article:tag" content="Java" />,
      <meta property="article:tag" content="Mathematics" />,
      <meta property="article:tag" content="Prime numbers" />,
      <meta property="article:tag" content="Dynamic programming" />,
      <meta property="article:tag" content="Memoisation" />,
      <meta property="article:tag" content="Recursion" />,
      <meta property="article:tag" content="Beatty sequence" />,
      <meta property="article:tag" content="A*" />,
      <meta property="article:tag" content="Algorithm" />,
      <meta http-equiv="content-language" content="en-au"></meta>,
    ],
    articleElement: <ArticleGoogleFoobarChallenge />,
  },
};

export default articleMetaData;
