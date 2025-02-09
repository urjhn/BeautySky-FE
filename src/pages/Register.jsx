import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function Register() {
  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-card">
          <div className="form-section">
            <form className="login-form">
              <h3>Sign Up</h3>
              <input
                type="text"
                placeholder="Username"
                className="form-input"
              />
              <input type="email" placeholder="Email" className="form-input" />
              <input
                type="password"
                placeholder="Password"
                className="form-input"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-input"
              />
              <div className="sign-in-button">
                <p>Do you already have an account?</p>
                <Link to="/login">Sign in</Link>
              </div>
            </form>
            <div className="divider">
              <span>OR</span>
            </div>
            <div className="external-sign-in">
              <button className="google-sign-in">
                <i className="fab fa-google"></i> Sign up with Google
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Register;
