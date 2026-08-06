import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../lib/api";
import { usePlayer } from "./PlayerContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("playntric_jwt_token") || null
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const { setPlayerName } = usePlayer();

  // Load user profile on app startup if JWT token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user: fetchedUser } = await authApi.getMe(token);
        setUser(fetchedUser);
        if (fetchedUser?.username) {
          setPlayerName(fetchedUser.username);
        }
      } catch (err) {
        console.error("Session restore error:", err);
        // Invalid or expired token
        localStorage.removeItem("playntric_jwt_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const data = await authApi.login({ email, password });
      const { token: newToken, user: loggedUser } = data;
      localStorage.setItem("playntric_jwt_token", newToken);
      setToken(newToken);
      setUser(loggedUser);
      if (loggedUser?.username) {
        setPlayerName(loggedUser.username);
      }
      return loggedUser;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    setAuthError(null);
    try {
      const data = await authApi.register({ username, email, password });
      const { token: newToken, user: newLoggedUser } = data;
      localStorage.setItem("playntric_jwt_token", newToken);
      setToken(newToken);
      setUser(newLoggedUser);
      if (newLoggedUser?.username) {
        setPlayerName(newLoggedUser.username);
      }
      return newLoggedUser;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("playntric_jwt_token");
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
