import ArticleEvilGeniusMinionReady from "./articles/ArticleEvilGeniusMinionReady/ArticleEvilGeniusMinionReady";
import ArticleGoogleFoobarChallenge from "./articles/ArticleGoogleFoobarChallenge/ArticleGoogleFoobarChallenge";
import Codenames from "./articles/Codenames/Codenames";
import GameConnectFour from "./articles/connectfour/GameConnectFour";
import GameTicTacToe from "./articles/tictactoe/GameTicTacToe";

export type ArticleType = {
  title: string;
  author: string;
  authorImageLink: string;
  type: string;
  description: string;
  publishedDateISO: string;
  modifiedDateISO?: string;
  publishedDateLabel: string;
  modifiedDateLabel?: string;
  imageLink: string;
  imageResolution: [string, string];
  otherMetaElements?: JSX.Element[];
  metaTags?: string[];
  language: string;
  articleElement: JSX.Element;
};

type ArticleMetaDataType = {
  [slug: string]: ArticleType;
};

const articleMetaData: ArticleMetaDataType = {
  codenames: {
    title: "Codenames",
    author: "Lachlan Gibson",
    authorImageLink: "/images/home/lachlan_gibson_200.webp",
    type: "article",
    publishedDateISO: "2024-01-20",
    publishedDateLabel: "Work in progress",
    imageLink: "/images/blog/codenames.webp",
    imageResolution: ["1024", "1024"],
    description: "A functional game of Codenames with an AI spymaster.",
    language: "en-au",
    articleElement: <Codenames />,
  },
  "connect-four": {
    title: "Connect Four",
    author: "Lachlan Gibson",
    authorImageLink: "/images/home/lachlan_gibson_200.webp",
    type: "article",
    publishedDateISO: "2024-01-09",
    publishedDateLabel: "Work in progress",
    imageLink: "/images/blog/connect-four.webp",
    imageResolution: ["1024", "1024"],
    description: "A functional game of connect four with an AI opponent.",
    language: "en-au",
    articleElement: <GameConnectFour />,
  },
  "tic-tac-toe": {
    title: "Tic Tac Toe",
    author: "Lachlan Gibson",
    authorImageLink: "/images/home/lachlan_gibson_200.webp",
    type: "article",
    publishedDateISO: "2024-01-12",
    publishedDateLabel: "12 January 2024",
    imageLink: "/images/blog/tic-tac-toe.webp",
    imageResolution: ["1024", "1024"],
    description:
      "A functional game of tic-tac-toe with an interesting AI opponent and explanation.",
    language: "en-au",
    metaTags: [
      "AI",
      "tic-tac-toe",
      "noughts and crosses",
      "minimax",
      "softmax",
      "dynamic programming",
      "tree search",
      "zero-sum game",
      "perfect information",
      "policy",
    ],
    articleElement: <GameTicTacToe />,
  },
  "evil-genius-minion-ready": {
    title: "Evil Genius, Minion Ready",
    author: "Lachlan Gibson",
    authorImageLink: "/images/home/lachlan_gibson_200.webp",
    type: "article",
    publishedDateISO: "2023-06-04",
    publishedDateLabel: "4 June 2023",
    imageLink: "/images/blog/evil-genius-minion-ready.webp",
    imageResolution: ["1024", "1024"],
    description:
      "ChatGPT's plans to conquer the world included infiltrating media groups, provoking a global crisis, and orchestrating disinformation campaigns.",
    language: "en-au",
    metaTags: [
      "ChatGPT",
      "AI",
      "AGI",
      "Super Intelligence",
      "AI Safety",
      "AI Ethics",
      "World Domination",
      "Role-play",
      "LLM",
      "GPT-4",
      "Language Model",
      "Power Seeking",
      "RLHF",
    ],
    articleElement: <ArticleEvilGeniusMinionReady />,
  },
  "google-foobar-challenge": {
    title: "Google's FooBar Challenge",
    author: "Lachlan Gibson",
    authorImageLink: "/images/home/lachlan_gibson_200.webp",
    type: "article",
    publishedDateISO: "2023-05-24",
    publishedDateLabel: "24 May 2023",
    modifiedDateISO: "2023-06-08",
    modifiedDateLabel: "8 June 2023",
    imageLink: "/images/blog/google-foobar-challenge.webp",
    imageResolution: ["1024", "1024"],
    description:
      "I completed Google's FooBar challenge which involved solving a series of mathematical and coding problems of 5 levels of increasing difficulty.",
    language: "en-au",
    metaTags: [
      "Google",
      "Foobar",
      "Coding Challenge",
      "Python",
      "Java",
      "Mathematics",
      "Prime numbers",
      "Dynamic programming",
      "Memoisation",
      "Recursion",
      "Beatty sequence",
      "A*",
      "Algorithm",
    ],
    articleElement: <ArticleGoogleFoobarChallenge />,
  },
};

export default articleMetaData;
