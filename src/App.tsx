import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./navigation/Navbar";
import Home from "./home/Home";
import About from "./about/About";
import Blog from "./blog/Blog";
import Article from "./blog/Article";
import Footer from "./footer/Footer";
import "./App.css";
import ArticleNotFound from "./blog/ArticleNotFound";
import { Helmet } from "react-helmet";
import ScrollToTop from "./ScrollToTop";

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Helmet>
        <title>Lachlan Gibson</title>
      </Helmet>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about/" element={<About />} />
          <Route path="/blog/" element={<Blog />} />
          <Route path="/blog/:slug/" element={<Article />} />
          <Route
            path="/blog/article-not-found/"
            element={<ArticleNotFound />}
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
