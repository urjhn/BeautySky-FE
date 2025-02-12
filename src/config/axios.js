const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors()); // Cho phép FE gọi API

const SECRET_KEY = "6LdigtQqAAAAAIaIO6O5wAIP2DpfF7Ko_fISmDDu"; // Thay bằng secret key của bạn

app.post("/login", async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  // 1. Xác thực token reCAPTCHA với Google
  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({
        secret: SECRET_KEY,
        response: recaptchaToken,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (!response.data.success) {
      return res.status(400).json({ message: "reCAPTCHA validation failed" });
    }

    // 2. Kiểm tra tài khoản (fake database)
    if (email === "manager@example.com" && password === "123456") {
      return res.json({ role: "manager" });
    } else if (email === "staff@example.com" && password === "123456") {
      return res.json({ role: "staff" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("reCAPTCHA verification error", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
