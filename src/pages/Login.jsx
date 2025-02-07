import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <div className="image-section">
            <img
              src="https://via.placeholder.com/500" // Replace with the actual image URL
              alt="Sky Beauty"
              className="login-image"
            />
          </div>
          <div className="form-section">
            <div className="logo-container">
              <div className="logo">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Logo 1"
                  className="logo-image"
                />
                <p>Logo 1</p>
              </div>
              <div className="logo">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Logo 2"
                  className="logo-image"
                />
                <p>Logo 2</p>
              </div>
            </div>
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
                <p> Does not have an account?</p>
                <Link to="/register"> Sign up</Link>
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
    </>
  );
}

export default Login;
