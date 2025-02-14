import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEeubzgO7za2wg9-i8dP9BWKAyKSaoXmI",
  authDomain: "beautysky-fe.firebaseapp.com",
  projectId: "beautysky-fe",
  storageBucket: "beautysky-fe.appspot.com",
  messagingSenderId: "603561443167",
  appId: "1:603561443167:web:1cd028dc8f2881256280ea",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Hàm đăng nhập bằng Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User Info:", result.user);
    window.location.href = "";
  } catch (error) {
    console.error("Login Error:", error);
  }
};

// Hàm đăng xuất
const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

export { auth, signInWithGoogle, logOut };
