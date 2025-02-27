import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Vẫn giữ Router ở đây
import { CartProvider } from "./context/CartContext.jsx";
import { ThemeProvider } from "./pages/DashBoard/context/ThemeContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import App from "./App.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import { ReviewProvider } from "./context/ReviewContext.jsx";
import { NewsProvider } from "./context/EvenContext.jsx";
import { UsersProvider } from "./context/UserContext.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="97056897827-v2rgbcjteb21e5ogji3aff65toeg0bc6.apps.googleusercontent.com">
    <Router>
      {" "}
      {/* Chỉ có 1 Router ở đây */}
      <AuthProvider>
        <CartProvider>
          <ThemeProvider>
            <UsersProvider>
              <DataProvider>
                <ReviewProvider>
                  <NewsProvider>
                    <App />
                  </NewsProvider>
                </ReviewProvider>
              </DataProvider>
            </UsersProvider>
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  </GoogleOAuthProvider>
);
