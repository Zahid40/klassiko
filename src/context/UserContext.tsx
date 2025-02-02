"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserType } from "@/features/user/types/user.type";
import { ApiResponseType } from "@/features/appState/types/app.type";

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
  user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "admin" | "teacher" | "student"
  ) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<UserType>) => void;
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
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  // Load user from cookies when the app starts
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const storedUser = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userState="))
          ?.split("=")[1];

        if (!storedUser) {
          logout();
          return;
        }

        const userData = JSON.parse(decodeURIComponent(storedUser));

        const response = await fetch("/api/auth/verify", {
          method: "GET",
        });

        const result = await response.json();

        if (result.isVerified) {
          setUser(userData); // Set user if verification is successful
        } else {
          toast.error(result.message);
          logout();
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        toast.error("Error verifying user:" + error);
        logout();
      }
    };

    verifyUser();
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

      if (result.success) {
        const userData: UserType = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          password: result.user.password,
          role: result.user.role,
          profile_picture: result.user.profile_picture || "",
          created_at: result.user.created_at,
          updated_at: result.user.updated_at,
          token: result.user.token,
        };

        setUser(userData);
        document.cookie = `userState=${encodeURIComponent(
          JSON.stringify(userData)
        )}; path=/; max-age=604800`; // Store in cookies (7 days)
        localStorage.setItem("token", result.token); // Store token separately
        router.push("/dashboard"); // Redirect after login
      } else {
        throw new Error(result.error || "Invalid login credentials");
      }
    } catch (error) {
      throw new Error("Login failed:" + error);
    }
  };

  // Register Function
  const register = async (
    name: string,
    email: string,
    password: string,
    role: "admin" | "teacher" | "student"
  ) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: role,
        }),
      });

      const result: ApiResponseType = await response.json();

      if (result.success) {
        throw new Error("Registration successful! Redirecting to login...");
      } else {
        throw new Error(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error", error);
      throw new Error("Failed to submit the form. Please try again.");
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
  const updateUser = (updatedUser: Partial<UserType>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    document.cookie = `userState=${encodeURIComponent(
      JSON.stringify(newUser)
    )}; path=/; max-age=604800`;
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
