import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("VNPay");
  const [paymentStatus, setPaymentStatus] = useState(null); // null | "success" | "error"
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://your-api.com/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method: paymentMethod }),
      });

      const result = await response.json();
      setLoading(false);

      if (result.success) {
        setPaymentStatus("success");
      } else {
        setPaymentStatus("error");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
        <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
          <form className="space-y-6">
            {/* Billing Details */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Billing Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Address"
                  required
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </section>

            {/* Order Summary */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Order Summary
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Product 1</span>
                  <span>$25.99</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Product 2</span>
                  <span>$30.99</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 mt-2">
                  <span>Total:</span>
                  <span>$56.98</span>
                </div>
              </div>
            </section>

            {/* Payment Methods */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Payment Method
              </h2>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer w-full bg-gray-100 hover:bg-blue-100 transition">
                  <input
                    type="radio"
                    value="VNPay"
                    checked={paymentMethod === "VNPay"}
                    onChange={() => setPaymentMethod("VNPay")}
                  />
                  <span className="text-gray-800">Pay with VNPay</span>
                </label>
                <label className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer w-full bg-gray-100 hover:bg-blue-100 transition">
                  <input
                    type="radio"
                    value="CreditCard"
                    checked={paymentMethod === "CreditCard"}
                    onChange={() => setPaymentMethod("CreditCard")}
                  />
                  <span className="text-gray-800">Pay with Credit Card</span>
                </label>
              </div>
            </section>

            {/* Checkout Button */}
            <button
              type="button"
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition flex justify-center"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </button>
          </form>

          {/* Payment Status Messages */}
          {paymentStatus === "success" && (
            <div className="mt-6 p-3 bg-green-500 text-white text-center rounded-lg animate-fade-in">
              Payment Successful!
            </div>
          )}
          {paymentStatus === "error" && (
            <div className="mt-6 p-3 bg-red-500 text-white text-center rounded-lg animate-fade-in">
              Payment Failed. Please try again!
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
