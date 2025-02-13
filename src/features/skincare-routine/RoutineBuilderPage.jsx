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
    setSelectedProducts([...selectedProducts, product]);
  };

  const handleSaveRoutine = () => {
    if (!routineName || selectedProducts.length === 0) {
      alert("Please enter a routine name and select products.");
      return;
    }

    const newRoutine = { name: routineName, products: selectedProducts };
    console.log("Saved Routine:", newRoutine);
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Build Your Skincare Routine</h1>
        <input
          type="text"
          placeholder="Routine Name"
          className="border p-2 mt-4 w-full"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="border p-4 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectProduct(product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-20 w-full object-cover"
              />
              <h3 className="font-bold mt-2">{product.name}</h3>
            </div>
          ))}
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 mt-4"
          onClick={handleSaveRoutine}
        >
          Save Routine
        </button>

        <h2 className="text-xl font-semibold mt-6">Your Routine</h2>
        {selectedProducts.map((product, index) => (
          <RoutineCard key={index} product={product} />
        ))}
      </div>
      <Footer />
    </>
  );
};

export default RoutineBuilderPage;
