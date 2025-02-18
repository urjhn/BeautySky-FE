require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const app = express();
const PORT = 5000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const redirectUri = "http://localhost:5173/login";

// Kiểm tra xem biến môi trường có hợp lệ không
if (!process.env.GOOGLE_CLIENT_ID || !process.env.JWT_SECRET) {
  console.error(
    "Missing Google Client ID or JWT Secret in environment variables."
  );
  process.exit(1); // Dừng chương trình nếu thiếu biến môi trường
}

app.use(cors());
app.use(express.json());

// Xử lý đăng nhập Google
app.post("/auth/google", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    // Xác minh token với Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Kiểm tra giá trị client ID từ Google
      redirect_uri: redirectUri,
    });

    const payload = ticket.getPayload(); // Lấy thông tin người dùng từ payload
    console.log("User Info:", payload);

    const user = {
      id: payload.sub, // ID người dùng từ Google
      name: payload.name,
      email: payload.email,
      avatar: payload.picture,
    };

    // Tạo JWT token cho người dùng
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d", // JWT hết hạn sau 7 ngày
    });

    // Trả về thông tin người dùng và access token
    res.json({ user, accessToken });
  } catch (error) {
    console.error("Lỗi xác minh Google:", error);
    res
      .status(401)
      .json({ error: "Xác minh Google không thành công. Vui lòng thử lại!" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
