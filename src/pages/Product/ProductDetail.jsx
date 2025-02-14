import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import {
  FaArrowLeft,
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaExchangeAlt,
} from "react-icons/fa";

const allProducts = [
  {
    id: "1",
    name: "Hydrating Facial Cleanser",
    skinType: "Dry Skin",
    price: 25.99,
    image: "https://via.placeholder.com/400x300",
    description:
      "A gentle hydrating cleanser that refreshes and nourishes your skin.",
    ingredients: ["Hyaluronic Acid", "Glycerin", "Aloe Vera"],
    usage: "Apply to damp skin and massage gently. Rinse with warm water.",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Oil-Free Moisturizer",
    skinType: "Oily Skin",
    price: 30.99,
    image: "https://via.placeholder.com/400x300",
    description:
      "Lightweight, non-greasy moisturizer perfect for oily skin types.",
    ingredients: ["Niacinamide", "Salicylic Acid", "Green Tea Extract"],
    usage: "Apply a small amount to clean skin. Use morning and night.",
    rating: 4.2,
  },
  {
    id: "3",
    name: "Soothing Toner",
    skinType: "Sensitive Skin",
    price: 19.99,
    image: "https://via.placeholder.com/400x300",
    description: "A gentle toner to calm and balance sensitive skin.",
    ingredients: ["Chamomile", "Witch Hazel", "Rose Water"],
    usage: "Apply with a cotton pad after cleansing.",
    rating: 4.0,
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [compareProduct, setCompareProduct] = useState(null);

  useEffect(() => {
    const foundProduct = allProducts.find((p) => p.id === id);
    setProduct(foundProduct);
  }, [id]);

  const handleCompareChange = (e) => {
    const selectedProduct = allProducts.find((p) => p.id === e.target.value);
    setCompareProduct(selectedProduct);
  };

  if (!product) {
    return (
      <div className="text-center text-gray-500 text-lg mt-20">
        Product not found
      </div>
    );
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-400 text-xl" />
      ) : (
        <FaRegStar key={i} className="text-gray-400 text-xl" />
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-100 to-white py-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col md:flex-row w-full max-w-5xl animate-fadeIn">
          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/2 h-auto rounded-xl shadow-md"
          />

          {/* Product Details */}
          <div className="md:ml-10 flex flex-col justify-between mt-6 md:mt-0 w-full">
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center mt-2">
              {renderStars(product.rating)}
            </div>
            <p className="text-lg text-gray-600 mt-2">{product.description}</p>
            <p className="text-md text-gray-500 mt-2">
              Suitable for:{" "}
              <span className="font-semibold">{product.skinType}</span>
            </p>
            <p className="text-2xl font-semibold text-blue-600 mt-4">
              ${product.price.toFixed(2)}
            </p>

            {/* Ingredients */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Ingredients
              </h3>
              <ul className="list-disc pl-5 text-gray-600">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Usage Instructions */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800">
                How to Use
              </h3>
              <p className="text-gray-600">{product.usage}</p>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex space-x-4">
              <button
                className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                onClick={() => addToCart(product)}
              >
                <FaShoppingCart />
                Add to Cart
              </button>
              <button
                className="w-full bg-gray-300 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-all flex items-center justify-center gap-2"
                onClick={() => navigate(-1)}
              >
                <FaArrowLeft />
                Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Product Comparison */}
        <div className="mt-10 w-full max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Compare with:
          </h2>
          <select
            className="border border-gray-300 rounded-lg p-2"
            onChange={handleCompareChange}
            defaultValue=""
          >
            <option value="" disabled>
              Select a product
            </option>
            {allProducts
              .filter((p) => p.id !== product.id)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>

          {compareProduct && (
            <div className="bg-white rounded-2xl shadow-md p-6 mt-6 flex flex-col md:flex-row w-full max-w-5xl">
              <img
                src={compareProduct.image}
                alt={compareProduct.name}
                className="w-full md:w-1/2 h-auto rounded-xl shadow-md"
              />
              <div className="md:ml-10 flex flex-col justify-between mt-6 md:mt-0 w-full">
                <h1 className="text-3xl font-bold text-gray-900">
                  {compareProduct.name}
                </h1>
                <div className="flex items-center mt-2">
                  {renderStars(compareProduct.rating)}
                </div>
                <p className="text-lg text-gray-600 mt-2">
                  {compareProduct.description}
                </p>
                <p className="text-2xl font-semibold text-blue-600 mt-4">
                  ${compareProduct.price.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
