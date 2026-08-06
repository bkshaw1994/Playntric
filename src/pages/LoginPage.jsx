import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Gamepad2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, user, logout } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Where to navigate after successful auth
  const fromPath = location.state?.from || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (mode === "login") {
      if (!formData.email.trim() || !formData.password.trim()) {
        setErrorMsg("Please enter both email and password.");
        return;
      }
      setIsSubmitting(true);
      try {
        await login(formData.email, formData.password);
        setSuccessMsg("Welcome back! Redirecting...");
        setTimeout(() => navigate(fromPath), 800);
      } catch (err) {
        setErrorMsg(err.message || "Failed to log in.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Sign Up validation
      if (
        !formData.username.trim() ||
        !formData.email.trim() ||
        !formData.password.trim()
      ) {
        setErrorMsg("Please fill in all required fields.");
        return;
      }
      if (formData.username.trim().length < 3) {
        setErrorMsg("Username must be at least 3 characters.");
        return;
      }
      if (formData.password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      setIsSubmitting(true);
      try {
        await register(
          formData.username.trim(),
          formData.email.trim(),
          formData.password
        );
        setSuccessMsg("Account created successfully! Redirecting...");
        setTimeout(() => navigate(fromPath), 800);
      } catch (err) {
        setErrorMsg(err.message || "Failed to register.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isAuthenticated && user && !successMsg) {
    return (
      <div className="login-container">
        <div className="login-card logged-in-card">
          <div className="logged-in-avatar">
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <h2>Welcome, {user.username || "Gamer"}!</h2>
          <p className="user-email-text">{user.email}</p>
          <div className="logged-in-badge">
            <CheckCircle2 size={16} /> Authenticated via MongoDB & JWT
          </div>

          <div className="logged-in-actions">
            <button className="primary-btn" onClick={() => navigate("/")}>
              <Gamepad2 size={18} /> Jump to Games
            </button>
            <button className="secondary-btn" onClick={logout}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-header">
          <div className="brand-badge">
            <Gamepad2 size={28} className="brand-icon" />
          </div>
          <h1>Playntric</h1>
          <p className="tagline">Sign in to save your game scores & achievements</p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs" role="tablist">
          <button
            className={`tab-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => {
              setMode("login");
              setErrorMsg("");
            }}
            type="button"
          >
            <LogIn size={16} /> Log In
          </button>
          <button
            className={`tab-btn ${mode === "signup" ? "active" : ""}`}
            onClick={() => {
              setMode("signup");
              setErrorMsg("");
            }}
            type="button"
          >
            <UserPlus size={16} /> Sign Up
          </button>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="auth-alert alert-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Feedback */}
        {successMsg && (
          <div className="auth-alert alert-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <div className="input-field">
                <User size={18} className="field-icon" />
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="CoolGamer99"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-field">
              <Mail size={18} className="field-icon" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-field">
              <Lock size={18} className="field-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-field">
                <Lock size={18} className="field-icon" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner">Processing...</span>
            ) : mode === "login" ? (
              <>
                <LogIn size={18} /> Sign In
              </>
            ) : (
              <>
                <UserPlus size={18} /> Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
