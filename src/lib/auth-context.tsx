"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
}

const ADMIN_EMAIL = "suraj244023@gmail.com";
const ADMIN_PASSWORD = "suraj244023@gmail.com";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("dsbe_auth");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("dsbe_auth");
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): Array<{ name: string; email: string; password: string }> => {
    try {
      return JSON.parse(localStorage.getItem("dsbe_users") || "[]");
    } catch {
      return [];
    }
  };

  const saveUsers = (users: Array<{ name: string; email: string; password: string }>) => {
    localStorage.setItem("dsbe_users", JSON.stringify(users));
  };

  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { email: normalizedEmail, name: "Admin", isAdmin: true };
      setUser(adminUser);
      localStorage.setItem("dsbe_auth", JSON.stringify(adminUser));
      return { success: true };
    }

    const users = getUsers();
    const found = users.find((u) => u.email === normalizedEmail && u.password === password);
    
    if (!found) {
      return { success: false, error: "Invalid email or password" };
    }

    const loggedUser = { email: found.email, name: found.name, isAdmin: false };
    setUser(loggedUser);
    localStorage.setItem("dsbe_auth", JSON.stringify(loggedUser));
    return { success: true };
  };

  const register = (name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    if (!name || !email || !password) {
      return { success: false, error: "All fields are required" };
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return { success: false, error: "Please enter a valid email" };
    }
    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    const users = getUsers();
    if (users.some((u) => u.email === normalizedEmail)) {
      return { success: false, error: "Email already registered" };
    }

    users.push({ name, email: normalizedEmail, password });
    saveUsers(users);

    const newUser = { email: normalizedEmail, name, isAdmin: false };
    setUser(newUser);
    localStorage.setItem("dsbe_auth", JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dsbe_auth");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin: user?.isAdmin || false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
