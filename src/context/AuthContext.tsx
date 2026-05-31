"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  signup: (email: string, name: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("cardio_token");
      if (token) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const userData = await res.json();
            const userObj: User = {
              name: userData.full_name || userData.username,
              email: userData.email,
            };
            setUser(userObj);
            localStorage.setItem("cardio_user", JSON.stringify(userObj));
          } else {
            localStorage.removeItem("cardio_user");
            localStorage.removeItem("cardio_token");
            setUser(null);
          }
        } catch (e) {
          console.error("Token verification failed:", e);
          const storedUser = localStorage.getItem("cardio_user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      // Security: Clear any leftover prediction cache on startup if not logged in
      if (!token) {
        sessionStorage.removeItem("cormetrics_result");
        sessionStorage.removeItem("cormetrics_input");
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    // Security: clear previous session's predictions
    sessionStorage.removeItem("cormetrics_result");
    sessionStorage.removeItem("cormetrics_input");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password || "");

      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || "Incorrect username/email or password.");
      }

      const data = await res.json();
      localStorage.setItem("cardio_token", data.access_token);

      const userObj: User = {
        name: data.username,
        email: email,
      };
      setUser(userObj);
      localStorage.setItem("cardio_user", JSON.stringify(userObj));
    } catch (err: any) {
      console.error("Sign in failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true);
    // Security: clear previous session's predictions
    sessionStorage.removeItem("cormetrics_result");
    sessionStorage.removeItem("cormetrics_input");

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || "Google Sign in failed.");
      }

      const data = await res.json();
      localStorage.setItem("cardio_token", data.access_token);

      const userObj: User = {
        name: data.username,
        // Since we don't return email from auth endpoint directly, we can fetch /me or leave email blank if unused in UI
        email: "google-user", 
      };
      setUser(userObj);
      localStorage.setItem("cardio_user", JSON.stringify(userObj));
      
      // Optionally fetch full user profile to get exact email
      const meRes = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        userObj.name = meData.full_name || meData.username;
        userObj.email = meData.email;
        setUser(userObj);
        localStorage.setItem("cardio_user", JSON.stringify(userObj));
      }
      
    } catch (err: any) {
      console.error("Google Sign in failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, name: string, password?: string) => {
    setIsLoading(true);
    // Security: clear previous session's predictions
    sessionStorage.removeItem("cormetrics_result");
    sessionStorage.removeItem("cormetrics_input");

    try {
      // Generate clean alphanumeric + underscore username
      let username = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
      if (username.length < 3) {
        username += "_usr";
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password: password || "",
          full_name: name,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || "Account registration failed.");
      }

      const data = await res.json();
      localStorage.setItem("cardio_token", data.access_token);

      const userObj: User = {
        name: data.username,
        email: email,
      };
      setUser(userObj);
      localStorage.setItem("cardio_user", JSON.stringify(userObj));
    } catch (err: any) {
      console.error("Sign up failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      localStorage.removeItem("cardio_user");
      localStorage.removeItem("cardio_token");
      sessionStorage.removeItem("cormetrics_result");
      sessionStorage.removeItem("cormetrics_input");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <AuthContext.Provider
        value={{
          user,
          isAuthenticated: !!user,
          isLoading,
          login,
          loginWithGoogle,
          signup,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
