import axios from "axios";

const handleLogin = async (email, password) => {
  try {
    const response = await axios.post("https://your-backend.com/api/login", {
      email,
      password,
    });

    console.log("Login SuccesfullySuccesfully:", response.data);
    localStorage.setItem("token", response.data.token);
  } catch (error) {
    console.error("Error Login", error.response?.data || error.message);
  }
};

// Gọi hàm login
handleLogin("test@example.com", "123456");
