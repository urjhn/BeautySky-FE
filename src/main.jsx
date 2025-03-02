import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Vẫn giữ Router ở đây
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import App from "./App.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import { ReviewProvider } from "./context/ReviewContext.jsx";
import { NewsProvider } from "./context/EvenContext.jsx";
import { UsersProvider } from "./context/UserContext.jsx";
import { OrdersProvider } from "./context/OrdersContext.jsx";
import { ThemeProvider } from "./pages/DashBoard/context/ThemeContext.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <Router>
    {" "}
    {/* Chỉ có 1 Router ở đây */}
    <AuthProvider>
      <CartProvider>
        <UsersProvider>
          <DataProvider>
            <OrdersProvider>
              <ReviewProvider>
                <ThemeProvider>
                  <NewsProvider>
                    <App />
                  </NewsProvider>
                </ThemeProvider>
              </ReviewProvider>
            </OrdersProvider>
          </DataProvider>
        </UsersProvider>
      </CartProvider>
    </AuthProvider>
  </Router>
);
