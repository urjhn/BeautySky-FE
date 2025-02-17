import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Global styles
import App from "./App.jsx"; // Main application component

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
