import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const routineSteps = [
  {
    step: "Tẩy trang",
    product: { name: "Dầu tẩy trang DHC", image: "/images/dhc.jpg" },
  },
  {
    step: "Sữa rửa mặt",
    product: { name: "Sữa rửa mặt CeraVe", image: "/images/cerave.jpg" },
  },
  {
    step: "Toner",
    product: { name: "Toner Klairs", image: "/images/klairs.jpg" },
  },
  {
    step: "Serum",
    product: { name: "Serum Vitamin C", image: "/images/vitaminC.jpg" },
  },
  {
    step: "Kem trị mụn",
    product: {
      name: "Kem trị mụn La Roche-Posay",
      image: "/images/laroche.jpg",
    },
  },
  {
    step: "Kem chống nắng",
    product: { name: "Kem chống nắng Anessa", image: "/images/anessa.jpg" },
  },
];

const RoutineBuilderPage = () => {
  const [routineName, setRoutineName] = useState("");

  const handleSaveRoutine = () => {
    if (!routineName) {
      alert("Vui lòng nhập tên lộ trình.");
      return;
    }

    const newRoutine = { name: routineName, steps: routineSteps };
    console.log("Saved Routine:", newRoutine);
    alert("Routine đã được lưu thành công!");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <h1 className="text-4xl md:text-3xl sm:text-2xl font-bold text-[#6BBCFE] animate-pulse text-center px-4">
          ✨ Lộ trình chăm sóc da của bạn ✨
        </h1>

        <input
          type="text"
          placeholder="Nhập tên lộ trình"
          className="border p-3 mt-4 w-full md:w-3/4 max-w-lg rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
        />
        <div className="flex flex-col mt-6 w-full md:w-3/4">
          {routineSteps.map((item, index) => (
            <div key={index} className="flex items-center mb-4 px-2">
              <div className="flex items-center justify-center text-blue-600 font-bold text-lg mr-2 md:mr-4 border border-blue-600 rounded-full h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-grow flex items-center flex-wrap sm:flex-nowrap border rounded-lg p-2 md:p-4 shadow-lg shadow-blue-300 bg-white transition transform hover:scale-105 hover:bg-gray-100">
                <span className="text-blue-600 font-bold text-base md:text-lg mr-2 md:mr-4 w-full sm:w-auto mb-2 sm:mb-0">
                  {item.step}:
                </span>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-md"
                />
                <h3 className="text-base md:text-lg font-semibold text-gray-700 ml-2 md:ml-4 w-full sm:w-auto mt-2 sm:mt-0">
                  {item.product.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
        <button
          className="bg-gradient-to-r from-[#6BBCFE] to-blue-500 text-white px-4 md:px-6 py-2 md:py-3 mt-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition shadow-lg hover:shadow-xl text-sm md:text-base"
          onClick={handleSaveRoutine}
        >
          💾 Lưu Routine
        </button>
      </div>
      <Footer />
    </>
  );
};

export default RoutineBuilderPage;
