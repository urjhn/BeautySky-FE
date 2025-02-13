import { useState } from "react";

const RoutineModal = ({ routine, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold">{routine.name}</h2>
        <ul className="mt-4">
          {routine.products.map((product, index) => (
            <li key={index} className="border-b py-2">
              {product.name}
            </li>
          ))}
        </ul>
        <button
          className="bg-red-500 text-white px-4 py-2 mt-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RoutineModal;
