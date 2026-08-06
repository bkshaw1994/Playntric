import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Gamepad2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import "./LoginModal.css";

export default function LoginModal({ onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
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
        setSuccessMsg("Welcome back!");
        setTimeout(() => {
          onClose();
        }, 600);
      } catch (err) {
        setErrorMsg(err.message || "Failed to log in.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
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
        setSuccessMsg("Account created successfully!");
        setTimeout(() => {
          onClose();
        }, 600);
      } catch (err) {
        setErrorMsg(err.message || "Failed to register.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-brand-icon">
            <Gamepad2 size={24} />
          </div>
          <h3>{mode === "login" ? "Welcome Back" : "Join Playntric"}</h3>
          <p>Sign in to sync your game progress & ranks</p>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => {
              setMode("login");
              setErrorMsg("");
            }}
          >
            <LogIn size={15} /> Log In
          </button>
          <button
            className={`modal-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => {
              setMode("signup");
              setErrorMsg("");
            }}
          >
            <UserPlus size={15} /> Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="modal-alert alert-error">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="modal-alert alert-success">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          {mode === "signup" && (
            <div className="modal-group">
              <label>Username</label>
              <div className="modal-field">
                <User size={16} className="m-icon" />
                <input
                  type="text"
                  name="username"
                  placeholder="GamerTag"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="modal-group">
            <label>Email</label>
            <div className="modal-field">
              <Mail size={16} className="m-icon" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="modal-group">
            <label>Password</label>
            <div className="modal-field">
              <Lock size={16} className="m-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="m-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div className="modal-group">
              <label>Confirm Password</label>
              <div className="modal-field">
                <Lock size={16} className="m-icon" />
                <input
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

          <button type="submit" className="modal-submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Connecting..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
