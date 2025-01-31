import { UserType } from "@/features/user/types/user.type";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const dispatch = useDispatch();

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem("token", result.token); // Store token for API calls

      toast.success("Login successful!");
    } else {
      toast.error(result.error || "Invalid login credentials");
    }
  } catch (error) {
    toast.error("Login failed. Please try again.");
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token"); // Remove token
  toast.success("Logged out successfully!");
};

export const updateUserProfile = async (
  userId: string,
  updatedData: Partial<UserType>
) => {
  try {
    const response = await fetch(`/api/users/update/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error(result.error || "Update failed.");
    }
  } catch (error) {
    toast.error("Failed to update profile.");
  }
};
