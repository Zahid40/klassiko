import supabase from "@/lib/db";
import { UserSchema } from "@/schema/user.schema";

// ✅ **Create a new user**
export const createUser = async ({
  name,
  email,
  password,
  role,
  profile_picture,
}: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "teacher" | "student";
  profile_picture?: string;
}) => {
  try {
    // Validate input
    const parsedData = UserSchema.parse({
      name,
      email,
      password,
      role,
      profile_picture,
    });

    // Insert user into Supabase
    const { data, error } = await supabase.from("users").insert([parsedData]);

    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error };
  }
};

// ✅ **Get a user by ID (Admin can fetch any user, others can fetch themselves)**
export const getUser = async ({
  userId,
  role,
  requestUserId,
}: {
  userId: string;
  role: string;
  requestUserId: string;
}) => {
  try {
    if (role !== "admin" && userId !== requestUserId)
      throw new Error("Unauthorized access");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error };
  }
};

// ✅ **Update user details (Only admins or the user themselves can update)**
export const updateUser = async ({
  userId,
  requestUserId,
  role,
  updates,
}: {
  userId: string;
  requestUserId: string;
  role: string;
  updates: Partial<{ name: string; email: string; profile_picture: string }>;
}) => {
  try {
    if (role !== "admin" && userId !== requestUserId)
      throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId);
    if (error) throw new Error(error.message);

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error };
  }
};

// ✅ **Delete user (Only admin can delete users)**
export const deleteUser = async ({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) => {
  try {
    if (role !== "admin") throw new Error("Only admins can delete users");

    const { error } = await supabase.from("users").delete().eq("id", userId);
    if (error) throw new Error(error.message);

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    return { success: false, error: error };
  }
};
