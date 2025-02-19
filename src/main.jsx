import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";
import "./index.css"; // Global styles
import App from "./App.jsx"; // Main application component
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import { store, persistor } from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
