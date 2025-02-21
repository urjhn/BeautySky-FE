import { useState } from "react";
import RoutineCard from "./RoutineCard";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const hardcodedProducts = [
  { id: 1, name: "Sữa rửa mặt CeraVe", image: "/images/cerave.jpg" },
  { id: 2, name: "Toner Klairs", image: "/images/klairs.jpg" },
  { id: 3, name: "Serum Vitamin C", image: "/images/vitaminC.jpg" },
  { id: 4, name: "Kem chống nắng Anessa", image: "/images/anessa.jpg" },
];

const RoutineBuilderPage = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [routineName, setRoutineName] = useState("");

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
        <h1 className="text-4xl font-bold text-[#6BBCFE] animate-pulse">
          ✨ Xây dựng Routine của bạn ✨
        </h1>
        <input
          type="text"
          placeholder="Nhập tên Routine"
          className="border p-3 mt-4 w-3/4 max-w-lg rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 w-3/4">
          {hardcodedProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-lg hover:shadow-xl transition cursor-pointer bg-white transform hover:scale-105 hover:bg-blue-50"
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
          className="bg-gradient-to-r from-[#6BBCFE] to-blue-500 text-white px-6 py-3 mt-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition shadow-lg hover:shadow-xl"
          onClick={handleSaveRoutine}
        >
          💾 Lưu Routine
        </button>

        {selectedProducts.length > 0 && (
          <div className="w-3/4 mt-8">
            <h2 className="text-xl font-bold text-gray-700">
              📝 Routine của bạn
            </h2>
            <div className="space-y-4 mt-4">
              {selectedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="relative border rounded-lg p-4 shadow-lg bg-white flex items-center transition transform hover:scale-105 hover:bg-gray-100"
                >
                  <span className="text-blue-600 font-bold text-lg mr-4 animate-bounce">
                    Bước {index + 1}:
                  </span>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold text-gray-700 ml-4">
                    {product.name}
                  </h3>
                  <button
                    className="absolute top-2 right-2 bg-gray-300 text-white rounded-full px-2 py-1 text-sm hover:bg-red-600 transition"
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    ❌
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
