import { createRoot } from "react-dom/client";
import "./index.css"; // Global styles
import App from "./App.jsx"; // Main application component
import { Provider } from "react-redux";
import store from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
