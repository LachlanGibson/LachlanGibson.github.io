import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { hydrateRoot, createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
if (rootElement) {
  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, <App />);
  } else {
    const root = createRoot(rootElement);
    root.render(<App />);
  }
}

reportWebVitals();
