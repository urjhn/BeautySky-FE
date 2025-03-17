const RoutineCard = ({ product }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="h-20 w-full object-cover rounded"
      />
      <h3 className="font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-500">{product.description}</p>
      <p className="text-blue-500 font-bold">{product.price}</p>
    </div>
  );
};

export default RoutineCard;
