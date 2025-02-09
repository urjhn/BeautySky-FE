import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function Login() {
  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <div className="form-section">
            <form className="login-form">
              <h3>Sign In</h3>
              <input
                type="text"
                placeholder="Username"
                className="form-input"
              />
              <input
                type="password"
                placeholder="Password"
                className="form-input"
              />
              <button type="submit" className="sign-in-button">
                Sign In
              </button>
            </form>
            <div className="options">
              <a href="#" className="forgot-password">
                Forget password?
              </a>
              <div className="sign-up">
                <p>Does not have an account?</p>
                <Link to="/register">Sign up</Link>
              </div>
            </div>
            <div className="divider">
              <span>OR</span>
            </div>
            <div className="external-sign-in">
              <button className="google-sign-in">
                <i className="fab fa-google"></i> Sign in with Google
              </button>
              <button className="email-sign-in">
                <i className="fas fa-envelope"></i> Sign in with Email
              </button>
            </div>
            <p className="terms">FASCO Terms & Conditions</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;
