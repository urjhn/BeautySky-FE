import { useState } from "react";
import { auth, provider, signInWithPopup } from "../../firebaseConfig";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import loginImage from "../../assets/login/login.png";

function Login() {
  const [user, setUser] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        phoneNumber: result.user.phoneNumber || "Not available",
        providerId: result.user.providerData[0].providerId,
      };

      console.log("User Data:", userData);
      setUser(userData);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex bg-white shadow-lg rounded-lg overflow-hidden w-3/4 max-w-4xl">
          <div className="w-1/2 hidden md:block">
            <img
              src={loginImage}
              alt="Login"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h3 className="text-2xl font-semibold text-center mb-4">Sign In</h3>

            {!user ? (
              <>
                <button
                  className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  onClick={handleGoogleSignIn}
                >
                  <i className="fab fa-google mr-2"></i> Sign in with Google
                </button>
              </>
            ) : (
              <div className="text-center">
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full mx-auto mt-4"
                />
                <h3 className="text-xl font-semibold mt-2">
                  {user.displayName}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-500">UID: {user.uid}</p>
                <p className="text-gray-500">Phone: {user.phoneNumber}</p>
                <p className="text-gray-500">Provider: {user.providerId}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
