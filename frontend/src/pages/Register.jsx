import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Wallet,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

import { registerUser } from "../api/AuthApi";

import "../styles/global.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.value,
    });
  };

  // ==========================================
  // HANDLE REGISTER
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setMessage(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      console.error(
        "REGISTER ERROR:",
        err
      );

      if (err.response?.data) {
        const backendError =
          err.response.data;

        setError(
          typeof backendError === "string"
            ? backendError
            : backendError.message ||
              "Registration failed. Please try again."
        );

      } else {
        setError(
          "Unable to connect to the backend. Make sure Spring Boot is running on port 8080."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* LOGO */}

        <div className="auth-logo">
          <Wallet size={30} />
        </div>

        {/* HEADER */}

        <h1>
          Create Account
        </h1>

        <p className="auth-subtitle">
          Start managing your expenses today.
        </p>

        {/* SUCCESS */}

        {message && (
          <p className="auth-success-message">
            {message}
          </p>
        )}

        {/* ERROR */}

        {error && (
          <p className="auth-error-message">
            {error}
          </p>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div className="auth-input-group">

            <label>
              Name
            </label>

            <div className="auth-input-wrapper">

              <User size={18} />

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* EMAIL */}

          <div className="auth-input-group">

            <label>
              Email
            </label>

            <div className="auth-input-wrapper">

              <Mail size={18} />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div className="auth-input-group">

            <label>
              Password
            </label>

            <div className="auth-input-wrapper">

              <Lock size={18} />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* LOGIN LINK */}

        <p className="auth-footer">

          Already have an account?{" "}

          <Link to="/">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;