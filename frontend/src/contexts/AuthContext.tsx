import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, getUser, logoutUser, TOKEN_KEY } from "../api/api";
import { User } from "../types/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      getUser()
        .then((userData: User) => {
          if ("_id" in userData) {
            setUser(userData as User);
          } else {
            throw new Error("Invalid user data");
          }
        })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        });
    }

    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login with:", email);
      const token = await loginUser({ email, password });
      console.log("Received token:", token);
      localStorage.setItem(TOKEN_KEY, token);
      const userData = await getUser();
      console.log("User data:", userData);
      if ("_id" in userData) {
        setUser(userData as User);
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      throw error;
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
