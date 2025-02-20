import { useState, useEffect } from "react";
import axios from "axios";
import RoutineCard from "./RoutineCard";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const RoutineBuilderPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [routineName, setRoutineName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleSelectProduct = (product) => {
    if (!selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.id !== id)
    );
  };

  const handleSaveRoutine = () => {
    if (!routineName || selectedProducts.length === 0) {
      alert("Vui lòng nhập tên routine và chọn sản phẩm.");
      return;
    }

    const newRoutine = { name: routineName, products: selectedProducts };
    console.log("Saved Routine:", newRoutine);
    alert("Routine đã được lưu thành công!");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-blue-600">
          Xây dựng Routine của bạn
        </h1>
        <input
          type="text"
          placeholder="Nhập tên Routine"
          className="border p-3 mt-4 w-3/4 max-w-lg rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 w-3/4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition cursor-pointer bg-white"
              onClick={() => handleSelectProduct(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-32 w-full object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold text-gray-700 mt-2 text-center">
                {product.name}
              </h3>
            </div>
          ))}
        </div>

        <button
          className="bg-blue-500 text-white px-6 py-3 mt-6 rounded-lg font-semibold hover:bg-blue-600 transition"
          onClick={handleSaveRoutine}
        >
          Lưu Routine
        </button>

        {selectedProducts.length > 0 && (
          <div className="w-3/4 mt-8">
            <h2 className="text-xl font-bold text-gray-700">Routine của bạn</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative border rounded-lg p-4 shadow-md bg-white"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-28 w-full object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold text-gray-700 mt-2 text-center">
                    {product.name}
                  </h3>
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-sm"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RoutineBuilderPage;
