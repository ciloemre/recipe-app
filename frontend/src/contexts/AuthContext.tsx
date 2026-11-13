import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, registerUser, getUser, logoutUser, TOKEN_KEY } from "../api/api";
import { User } from "../types/types";
import { WELCOME_NAME_KEY } from "../utils/welcome";
import { bindSocketUser } from "../hooks/useSocket";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    username: string;
    name: string;
    email: string;
    password: string;
  }) => Promise<User>;
  updateCurrentUser: (user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bindSocketUser(user?._id ?? null);
  }, [user?._id]);

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
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const token = await loginUser({ email, password });
      localStorage.setItem(TOKEN_KEY, token);
      const userData = await getUser();
      if ("_id" in userData) {
        sessionStorage.setItem(WELCOME_NAME_KEY, (userData as User).name);
        setUser(userData as User);
        return userData as User;
      }
      throw new Error("Invalid user data");
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      throw error;
    }
  };

  const register = async (data: {
    username: string;
    name: string;
    email: string;
    password: string;
  }): Promise<User> => {
    const registered = await registerUser(data);
    if (!registered.token || !registered._id) {
      throw new Error("Kayıt tamamlandı ama oturum açılamadı");
    }
    localStorage.setItem(TOKEN_KEY, registered.token);
    const userData: User = {
      _id: registered._id,
      name: registered.name,
      email: registered.email,
      username: registered.username,
    };
    sessionStorage.setItem(WELCOME_NAME_KEY, userData.name);
    setUser(userData);
    return userData;
  };

  const updateCurrentUser = (next: User) => {
    setUser(next);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        updateCurrentUser,
        logout,
      }}
    >
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
