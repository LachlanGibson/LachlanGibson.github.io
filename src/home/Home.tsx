import React, { useState, useEffect } from "react";
import "./Home.css";

const quotes = [
  "Success in any field requires patience, dedication, and a willingness to learn from failure.",
  "In mathematics, simplicity is the ultimate sophistication.",
  "The power of AI lies not in its ability to replace humans, but in its ability to augment and enhance our abilities.",
  "The key to unlocking the secrets of the universe lies in our ability to see patterns in the chaos.",
  "Data science is not just about analyzing data, it's about finding meaning in the patterns and using them to make informed decisions.",
  "In physics, there is beauty in simplicity, and elegance in complexity.",
  "The greatest ideas often come from those who are not afraid to challenge the status quo.",
  "Mathematics is the language of the universe, and those who learn to speak it can unlock its secrets.",
  "The true measure of intelligence is not in one's ability to solve problems, but in one's ability to identify them.",
  "In AI, there is a delicate balance between human creativity and machine efficiency.",
  "The laws of physics govern the behavior of the universe, but it is our interpretation of them that drives progress.",
  "Data without context is just noise, but with context, it can reveal valuable insights.",
  "Mathematics is not just a subject, it's a way of thinking.",
  "The beauty of science is in its ability to inspire wonder and curiosity.",
  "AI is not just about technology, it's about the ethics and responsibility of using it.",
  "In physics, every discovery is a step towards a greater understanding of the universe.",
  "Data science is not just about analyzing data, it's about creating a narrative from the insights.",
  "Mathematics may be the foundation of science, but it is creativity that drives innovation.",
  "The universe is not something to be understood, but rather to be explored, for it is through exploration that we expand our understanding of the world around us.",
  "The true power of knowledge is not in possessing it, but in sharing it, for it is through sharing that we empower others to achieve their full potential.",
  "The most valuable resource we have is not time, but attention, for it is through focused attention that we achieve our goals and make a meaningful impact in the world.",
  "The future belongs to those who are willing to embrace change, for it is through change that we adapt, grow, and evolve.",
  "The power of imagination is not in its ability to create new ideas, but in its ability to see the world in a different way, for it is through a new perspective that we unlock new possibilities.",
  "The most important thing we can do in life is to pursue our passions and live with purpose, for it is through living a life true to ourselves that we find true fulfillment and happiness.",
  "In the pursuit of knowledge, there is no greater ally than persistence, no greater tool than passion, and no greater reward than understanding.",
  "The beauty of science lies not in the answers it provides, but in the questions it poses, for it is through asking the right questions that we unlock the mysteries of the universe.",
  "The greatest obstacle to progress is not ignorance, but the refusal to question what we think we know, for it is only through questioning that we can truly learn.",
  "The true measure of success is not in the number of accolades we receive, but in the impact we have on the world around us, for it is through our actions that we leave a lasting legacy.",
  "There is no limit to what we can achieve when we combine our unique perspectives and talents towards a common goal, for it is through collaboration that we unlock the full potential of human innovation.",
  "Believe in the power of your curiosity, for it is the spark that ignites the flames of innovation and fuels the journey of discovery.",
  "Knowledge is power, but intelligence is the key to unlocking its full potential.",
  "Science is not just about discovering the truth, it's about embracing the unknown.",
  "In the pursuit of knowledge, we discover the beauty of the universe.",
  "The greatest scientific discoveries often arise from the most unexpected questions.",
  "Intelligence is not just about what you know, it's about how you use what you know.",
  "The beauty of science lies in its ability to challenge our assumptions and expand our minds.",
  "To truly understand the world around us, we must be willing to explore the unknown.",
  "The mind is a powerful tool - use it wisely and it will take you places you never thought possible.",
  "Science is not just a subject, it's a way of thinking.",
  "Intelligence is not just a measure of knowledge, it's a measure of curiosity and creativity.",
  "In science, there are no failures - only opportunities to learn and grow.",
  "The most powerful force in the universe is not gravity, it's the human mind.",
  "The more we learn, the more we realize how much we still have to discover.",
  "Science is the pursuit of knowledge, and knowledge is the key to unlocking the mysteries of the universe.",
  "Intelligence is not a gift - it's a skill that can be developed through hard work and dedication.",
  "The beauty of science is that it challenges us to question everything we think we know.",
  "In the pursuit of scientific discovery, failure is just another step towards success.",
  "The greatest scientific minds are those who are never satisfied with what they already know.",
  "Intelligence is not about being the smartest person in the room - it's about being the most curious and open-minded.",
  "Science is the art of asking questions, and intelligence is the art of finding the answers.",
];

function shuffle(array: Array<any>) {
  //Fisher–Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

shuffle(quotes);

const Home: React.FC<{}> = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [loadingBarWidth, setLoadingBarWidth] = useState(0);

  const author = "ChatGPT";
  const version = "May 3 Version";
  const quoteDuration = 12000; // 12 seconds
  const barTime = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingBarWidth((prevWidth) => {
        const newWidth = prevWidth + (barTime / quoteDuration) * 100;
        return newWidth >= 100 ? 100 : newWidth;
      });
    }, barTime);

    const quoteInterval = setInterval(() => {
      setLoadingBarWidth(0);
      setCurrentQuote((prevQuote) => (prevQuote + 1) % quotes.length);
    }, quoteDuration);

    return () => {
      clearInterval(interval);
      clearInterval(quoteInterval);
    };
  }, []);
  return (
    <div className="container">
      <div id="intro-div">
        <div className="img-div">
          <img src="/home/Lachlan_Gibson.png" alt="Lachlan Gibson" />
        </div>
        <div className="quote-div">
          <div>
            <p id="quote-text">{quotes[currentQuote]}</p>
            <span id="quote-author">— {author}</span>
            <span
              id="loading-bar"
              style={{ width: `${loadingBarWidth}%` }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
