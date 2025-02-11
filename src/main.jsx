import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter và Routes
import Home from "./pages/Homepage/Homepage.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Product from "./pages/Product/Product.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import Viewcart from "./pages/Product/Viewcart.jsx";
import Quizz from "./features/quiz/QuizPage.jsx";
import Error from "./pages/Errors/NotFoundPage.jsx";
import UserProfile from "./pages/Profile/UserProfilePage.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Định nghĩa các route cho các trang */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/viewcart" element={<Viewcart />} />
        <Route path="/quizz" element={<Quizz />} />
        <Route path="*" element={<Error />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  </StrictMode>
);
