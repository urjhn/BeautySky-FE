import axios from 'axios';

const BASE_URL = 'https://localhost:7112/api/Google';

const googleAPI = {
  // Hàm này sẽ mở cửa sổ đăng nhập Google
  googleLogin: async () => {
    try {
      // Mở tab mới để đăng nhập Google
      window.open(`${BASE_URL}/google-login`, '_self');
    } catch (error) {
      throw error;
    }
  },

  // Hàm cập nhật profile
  updateProfile: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/update-profile`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default googleAPI;
