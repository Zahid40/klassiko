import { z } from "zod";

// Define the role types
export const UserRoleEnum = z.enum(["admin", "teacher", "student"]);

// Define the user schema
export const UserSchema = z.object({
  id: z.string().uuid().optional(), // UUID (optional, will be generated in the backend)
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"), // Enforce strong password
  role: UserRoleEnum, // Role must be 'admin', 'teacher', or 'student'
  profile_picture: z.string().url().optional(), // Optional URL for profile picture
  created_at: z.string().optional(), // Date string
  updated_at: z.string().optional(), // Date string
  token:z.string().optional()
});
