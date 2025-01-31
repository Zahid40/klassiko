"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Define User Type
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  profile_picture?: string;
  token: string;
}

// Define Context Type
interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom Hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// UserProvider Component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Load user from cookies when the app starts
  useEffect(() => {
    const storedUser = document.cookie
      .split("; ")
      .find((row) => row.startsWith("userState="))
      ?.split("=")[1];

    if (storedUser) {
      setUser(JSON.parse(decodeURIComponent(storedUser)));
    }
  }, []);

  // Login Function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        const userData: User = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          profile_picture: result.user.profile_picture || "",
          token: result.token,
        };

        setUser(userData);
        document.cookie = `userState=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=604800`; // Store in cookies (7 days)
        localStorage.setItem("token", result.token); // Store token separately
        router.push("/dashboard"); // Redirect after login
      } else {
        throw new Error(result.error || "Invalid login credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Logout Function
  const logout = () => {
    setUser(null);
    document.cookie = "userState=; path=/; max-age=0"; // Remove cookie
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Update User Function
  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    document.cookie = `userState=${encodeURIComponent(JSON.stringify(newUser))}; path=/; max-age=604800`;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
