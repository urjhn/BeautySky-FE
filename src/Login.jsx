import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="image-section">
          <img
            src="https://via.placeholder.com/500" // Thay bằng URL ảnh thực tế
            alt="Sky Beauty"
            className="login-image"
          />
        </div>
        <div className="form-section">
          <div className="logo">
            <img
              src="https://via.placeholder.com/60"
              alt="Logo"
              className="logo-image"
            />
            <div className="logo-text">
              <h2>Sky Beauty</h2>
              <p>We Care About You</p>
            </div>
          </div>
          <form className="login-form">
            <h3>Sign In</h3>
            <input type="text" placeholder="Username" className="form-input" />
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
            <a href="#" className="sign-up">
              Does not have an account? Sign up
            </a>
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
  );
}

export default Login;
