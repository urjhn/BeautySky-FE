const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const questions = [
  {
    question: "How does your skin feel after washing your face?",
    options: [
      "Tight and dry",
      "Oily and greasy",
      "Balanced and smooth",
      "Sensitive and itchy",
    ],
  },
  {
    question: "How often does your skin get oily?",
    options: ["Rarely", "Often", "Sometimes", "Never"],
  },
];

const products = {
  "Dry Skin": [
    {
      name: "Moisturizer",
      image: "moisturizer.jpg",
      description: "Hydrating cream",
      price: "$20",
    },
  ],
  "Oily Skin": [
    {
      name: "Oil-Free Cleanser",
      image: "cleanser.jpg",
      description: "Removes excess oil",
      price: "$18",
    },
  ],
};

app.get("/questions", (req, res) => res.json(questions));
app.post("/determine-skin", (req, res) => {
  const answers = req.body.answers;
  const skinType = answers.includes("Tight and dry") ? "Dry Skin" : "Oily Skin";
  res.json({ skinType });
});
app.get("/products", (req, res) =>
  res.json(products[req.query.skinType] || [])
);

app.listen(5000, () => console.log("Server running on port 5000"));
