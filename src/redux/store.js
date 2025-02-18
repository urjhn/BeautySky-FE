import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Đảm bảo đúng đường dẫn
// const store = configureStore({
//   reducer: {
//     auth: authReducer, // Đảm bảo reducer có key là "auth"
//   },
// });

// export default store;
export default configureStore({
  reducer: {
    auth: authReducer,
  },
});
