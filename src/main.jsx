import { createRoot } from "react-dom/client";
import { CartProvider } from "./context/CartContext.jsx";
import { ThemeProvider } from "./pages/DashBoard/context/ThemeContext.jsx";
import { EventProvider } from "./context/EvenContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="97056897827-v2rgbcjteb21e5ogji3aff65toeg0bc6.apps.googleusercontent.com">
    <CartProvider>
      <ThemeProvider>
        <EventProvider>
          <App />
        </EventProvider>
      </ThemeProvider>
    </CartProvider>
  </GoogleOAuthProvider>
);
