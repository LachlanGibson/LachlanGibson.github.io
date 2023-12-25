import ArticleEvilGeniusMinionReady from "./articles/ArticleEvilGeniusMinionReady";
import ArticleGoogleFoobarChallenge from "./articles/ArticleGoogleFoobarChallenge";

type ArticleType = {
  title: string;
  author: string;
  timeElement: JSX.Element;
  lastModifiedElement?: JSX.Element;
  imageElement: JSX.Element;
  metaElements: JSX.Element[];
  articleElement: JSX.Element;
};

type ArticleMetaDataType = {
  [slug: string]: ArticleType;
};

const articleMetaData: ArticleMetaDataType = {
  "evil-genius-minion-ready": {
    title: "Evil Genius, Minion Ready",
    author: "Lachlan Gibson",
    timeElement: <time dateTime="2023-06-04">4 June 2023</time>,
    imageElement: <img src="/images/blog/genius-minion.webp" alt="" />,
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
        content="ChatGPT's plans to conquer the world included infiltrating media groups, government agencies, and scientific communities, provoking a global crisis, striking at key infrastructure and orchestrating disinformation campaigns."
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
    ],
    articleElement: <ArticleEvilGeniusMinionReady />,
  },
  "google-foobar-challenge": {
    title: "Google's FooBar Challenge",
    author: "Lachlan Gibson",
    timeElement: <time dateTime="2023-05-24">24 May 2023</time>,
    lastModifiedElement: <time dateTime="2023-06-08">8 June 2023</time>,
    imageElement: <img src="/images/blog/foobar-challenge.webp" alt="" />,
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
        content="I completed Google's FooBar challenge which involved solving a series of mathematical and coding problems. The challenge included 5 levels of increasing difficulty which I solve in this document."
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
    ],
    articleElement: <ArticleGoogleFoobarChallenge />,
  },
};

export default articleMetaData;
