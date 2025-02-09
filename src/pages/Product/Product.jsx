import { useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const ProductsPage = () => {
  const products = Array.from({ length: 50 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    price: (Math.random() * 100).toFixed(2),
    image: `https://via.placeholder.com/200?text=Product+${index + 1}`,
    skinType: ["Oily Skin", "Dry Skin", "Normal Skin"][
      Math.floor(Math.random() * 3)
    ],
  }));

  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [cartItems, setCartItems] = useState([]);

  const filteredProducts =
    selectedFilter === "All"
      ? products
      : products.filter((product) => product.skinType === selectedFilter);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find((item) => item.id === product.id);
      return existingProduct
        ? prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
              : item
          )
        : [...prevItems, { ...product, quantity: 1 }];
    });
  };

  return (
    <div>
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
      />

      <div className="products-container">
        <h1>Product List</h1>

        <div className="filters">
          <label htmlFor="skin-type">Filter by Skin Type:</label>
          <select
            id="skin-type"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Oily Skin">Oily Skin</option>
            <option value="Dry Skin">Dry Skin</option>
            <option value="Normal Skin">Normal Skin</option>
          </select>
        </div>

        <div className="products-grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>Skin Type: {product.skinType}</p>
              <p>Price: ${product.price}</p>
              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
