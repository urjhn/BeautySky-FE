const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    name: "Hydrating Moisturizer",
    image: "/images/moisturizer.jpg",
    price: "$20",
  },
  {
    id: 2,
    name: "Oil-Free Cleanser",
    image: "/images/cleanser.jpg",
    price: "$18",
  },
  { id: 3, name: "Vitamin C Serum", image: "/images/serum.jpg", price: "$25" },
];

// API tìm kiếm sản phẩm
app.get("/search", (req, res) => {
  const query = req.query.query.toLowerCase();
  const results = products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );
  res.json(results);
});

app.listen(5000, () => console.log("Server running on port 5000"));
