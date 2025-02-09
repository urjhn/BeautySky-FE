import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("VNPay");

  const handlePayment = () => {
    if (paymentMethod === "VNPay") {
      alert("Redirecting to VNPay...");
      showPaymentStatus(true);
    } else {
      alert("Processing other payment methods...");
      showPaymentStatus(false);
    }
  };

  function showPaymentStatus(isSuccess) {
    const paymentStatus = document.getElementById("payment-status");
    const successMessage = document.getElementById("success-message");
    const errorMessage = document.getElementById("error-message");

    if (isSuccess) {
      successMessage.style.display = "block";
      errorMessage.style.display = "none";
    } else {
      successMessage.style.display = "none";
      errorMessage.style.display = "block";
    }

    paymentStatus.classList.add("show");

    setTimeout(() => {
      paymentStatus.classList.remove("show");
    }, 3000);
  }

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <main className="checkout-main">
          <h1>Checkout</h1>
          <form className="checkout-form">
            <section className="billing-details">
              <h2>Billing Details</h2>
              <label>
                Full Name:
                <input type="text" placeholder="Enter your name" required />
              </label>
              <label>
                Email Address:
                <input type="email" placeholder="Enter your email" required />
              </label>
              <label>
                Phone Number:
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />
              </label>
              <label>
                Address:
                <textarea placeholder="Enter your address" required />
              </label>
            </section>

            <section className="order-summary">
              <h2>Order Summary</h2>
              <div className="order-item">
                <span>Product 1</span>
                <span>$25.99</span>
              </div>
              <div className="order-item">
                <span>Product 2</span>
                <span>$30.99</span>
              </div>
              <div className="order-total">
                <strong>Total:</strong>
                <strong>$56.98</strong>
              </div>
            </section>

            <section className="payment-methods">
              <h2>Payment Method</h2>
              <label className="payment-option">
                <input
                  type="radio"
                  value="VNPay"
                  checked={paymentMethod === "VNPay"}
                  onChange={() => setPaymentMethod("VNPay")}
                />
                Pay with VNPay
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  value="CreditCard"
                  checked={paymentMethod === "CreditCard"}
                  onChange={() => setPaymentMethod("CreditCard")}
                />
                Pay with Credit Card
              </label>
            </section>

            <button
              type="button"
              className="checkout-button"
              onClick={handlePayment}
            >
              Proceed to Payment
            </button>
          </form>

          <div id="payment-status" className="payment-status">
            <div id="success-message" className="status-message success">
              <p>Payment Successful!</p>
            </div>
            <div id="error-message" className="status-message error">
              <p>Payment Failed. Please try again!</p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
