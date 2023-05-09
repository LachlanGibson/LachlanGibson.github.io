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
];

const author = "ChatGPT";
const version = "May 3 Version";
const quoteDuration = 12000; //number of ms
const barTime = 10; //number of ms

const quoteElement = document.getElementById("quote-text");
const authorElement = document.getElementById("quote-author");
const versionElement = document.getElementById("quote-version");
const barElement = document.getElementById("loading-bar");

if (authorElement) {
  authorElement.innerHTML = author;
}

if (versionElement) {
  versionElement.innerHTML = version;
}

function shuffle(array) {
  //Fisher–Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function setQuote() {
  quoteElement.innerHTML = `"${quotes[currentQuote]}"`;
}

shuffle(quotes);

let barInterval;
barInterval = setInterval(updateBar, barTime);
let currentBar = 0;
let interval;
resetInterval(interval);
let currentQuote = 0;
setQuote();

function updateBar() {
  currentBar += barTime / quoteDuration;
  barElement.style.width = `${Math.floor(1000 * currentBar) / 10}%`;
}

function nextQuote() {
  currentQuote = (currentQuote + 1) % quotes.length;
  setQuote();
  currentBar = 0;
}

function resetInterval(interval) {
  interval = setInterval(nextQuote, quoteDuration);
  currentBar = 0;
}

// quoteElement.addEventListener("click", () => {
//   clearInterval(interval);
//   resetInterval();
//   nextQuote();
// });
