import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const routineSteps = [
  {
    step: "Tẩy trang",
    product: {
      name: "Dầu tẩy trang DHC",
      image: "/images/dhc.jpg",
      details:
        "Dầu tẩy trang giúp làm sạch lớp trang điểm và bụi bẩn sâu trong lỗ chân lông.",
    },
  },
  {
    step: "Sữa rửa mặt",
    product: {
      name: "Sữa rửa mặt CeraVe",
      image: "/images/cerave.jpg",
      details:
        "Sữa rửa mặt CeraVe giúp làm sạch da nhẹ nhàng mà không làm mất độ ẩm tự nhiên.",
    },
  },
  {
    step: "Toner",
    product: {
      name: "Toner Klairs",
      image: "/images/klairs.jpg",
      details:
        "Toner Klairs giúp cân bằng độ pH và làm dịu da sau khi rửa mặt.",
    },
  },
  {
    step: "Serum",
    product: {
      name: "Serum Vitamin C",
      image: "/images/vitaminC.jpg",
      details: "Serum Vitamin C giúp sáng da và giảm thâm nám hiệu quả.",
    },
  },
  {
    step: "Kem trị mụn",
    product: {
      name: "Kem trị mụn La Roche-Posay",
      image: "/images/laroche.jpg",
      details:
        "Kem trị mụn giúp giảm viêm, kháng khuẩn và làm dịu làn da bị mụn.",
    },
  },
  {
    step: "Kem chống nắng",
    product: {
      name: "Kem chống nắng Anessa",
      image: "/images/anessa.jpg",
      details:
        "Kem chống nắng giúp bảo vệ da khỏi tia UV và ngăn ngừa lão hóa sớm.",
    },
  },
];

const RoutineBuilderPage = () => {
  const [routineName, setRoutineName] = useState("");
  const [selectedStep, setSelectedStep] = useState(null);

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
        <h1 className="text-4xl font-bold text-[#6BBCFE] animate-pulse">
          ✨ Lộ trình chăm sóc da của bạn ✨
        </h1>

        <input
          type="text"
          placeholder="Nhập tên lộ trình"
          className="border p-3 mt-4 w-3/4 max-w-lg rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
        />

        <div className="w-2/4 mt-6">
          {routineSteps.map((item, index) => (
            <div key={index} className="mb-4">
              <div
                className={`flex items-center justify-between border rounded-lg p-4 shadow-lg bg-white cursor-pointer transition duration-300 ${
                  selectedStep === index ? "bg-blue-100" : ""
                }`}
                onClick={() =>
                  setSelectedStep(selectedStep === index ? null : index)
                }
              >
                <div className="flex items-center">
                  <span className="text-xl font-bold text-blue-600 mr-4">
                    {index + 1}.
                  </span>
                  <span className="text-blue-600 font-bold text-lg mr-4">
                    {item.step}:
                  </span>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-20 w-20 object-cover rounded-md"
                  />
                  <h3 className="text-lg font-semibold text-gray-700 ml-4">
                    {item.product.name}
                  </h3>
                </div>
                <span className="text-gray-600 text-2xl">
                  {selectedStep === index ? "🔼" : "🔽"}
                </span>
              </div>
              {selectedStep === index && (
                <div className="p-4 bg-gray-100 rounded-lg mt-2 shadow-inner transition-all duration-300 ease-in-out">
                  <p className="text-gray-700 font-medium">
                    {item.product.details}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          className="bg-gradient-to-r from-[#6BBCFE] to-blue-500 text-white px-6 py-3 mt-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition shadow-lg hover:shadow-xl"
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
