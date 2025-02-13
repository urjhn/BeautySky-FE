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
// import Contact from "./pages/Contact/Contact.jsx";
import Blog from "./pages/Blogs/BlogPage.jsx";
import UserProfile from "./pages/Profile/UserProfilePage.jsx";
import DashboardLayout from "./pages/DashBoard/DashboardLayout.jsx";
import Dashboard from "./pages/DashBoard/pages/DashBoard.jsx";
import Customers from "./pages/DashBoard/pages/Customers.jsx";
import Order from "./pages/DashBoard/pages/Order.jsx";
import Products from "./pages/DashBoard/pages/Products.jsx";
import Report from "./pages/DashBoard/pages/Report.jsx";
import Setting from "./pages/DashBoard/pages/Setting.jsx";
import BlogManagement from "./pages/DashBoard/pages/BlogManagement.jsx";
import Promotion from "./pages/DashBoard/pages/Promotion.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";
import { CartProvider } from "./context/CartContext.jsx"; // Import CartProvider
import { AuthProvider } from "./context/AuthContext"; // Đúng đường dẫn

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        {" "}
        {/* Bọc toàn bộ app với CartProvider */}
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
            {/* <Route path="/contact" element={<Contact />} /> */}
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<Error />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/routine-builder" element={<RoutineBuilderPage />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="blogs" element={<BlogManagement />} />
              <Route path="promotions" element={<Promotion />} />
              <Route path="customers" element={<Customers />} />
              <Route path="orders" element={<Order />} />
              <Route path="products" element={<Products />} />
              <Route path="reports" element={<Report />} />
              <Route path="settings" element={<Setting />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
