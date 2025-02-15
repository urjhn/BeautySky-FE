import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const ViewCart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <>
      <Navbar cartCount={cartItems.length} />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
        <div className="w-3/4 bg-white shadow-md rounded-lg p-6">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <h3 className="text-lg font-semibold text-gray-800 flex-1 ml-4">
                  {item.name}
                </h3>
                <p className="text-blue-500 font-bold">
                  ${item.price.toFixed(2)}
                </p>
                <div className="flex items-center mx-4">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-2 py-1 bg-gray-300 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          )}
          <div className="flex justify-between mt-4 text-lg font-bold">
            <span>Total:</span>
            <span className="text-red-500">${totalPrice}</span>
          </div>
          <div className="flex justify-end mt-4">
            <Link
              to="/checkout"
              className="bg-[#6bbcfe] text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ViewCart;
