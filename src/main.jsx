import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // Vẫn giữ Router ở đây
import { CartProvider } from "./context/CartContext.jsx";
import "./index.css";
import App from "./App.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import { ReviewProvider } from "./context/ReviewContext.jsx";
import { NewsProvider } from "./context/EvenContext.jsx";
import { UsersProvider } from "./context/UserContext.jsx";
import { OrdersProvider } from "./context/OrdersContext.jsx";
import { BlogsProvider } from "./context/BlogsContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { QuizProvider } from "./context/QuizContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <Router>
    {" "}
    {/* Chỉ có 1 Router ở đây */}
    <AuthProvider>
      <NotificationProvider>
        <OrdersProvider>
          <CartProvider>
            <UsersProvider>
              <DataProvider>
                <QuizProvider>
                  <ReviewProvider>
                      <NewsProvider>
                        <BlogsProvider>
                          <App />
                        </BlogsProvider> 
                      </NewsProvider>
                  </ReviewProvider>
                </QuizProvider>
              </DataProvider>
            </UsersProvider>
          </CartProvider>
        </OrdersProvider>
      </NotificationProvider>
    </AuthProvider>
  </Router>
);
