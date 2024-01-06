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
import Games from "./games/Games";
import Game from "./games/Game";
import GameNotFound from "./games/GameNotFound";

const App: React.FC = () => {
  return (
    <Router>
      <Helmet>
        <title>Lachlan Gibson</title>
      </Helmet>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Article />} />
          <Route path="/blog/article-not-found" element={<ArticleNotFound />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:slug" element={<Game />} />
          <Route path="/games/game-not-found" element={<GameNotFound />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
