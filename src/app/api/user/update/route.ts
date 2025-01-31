import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import jwt from "jsonwebtoken";

// Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Define Update Schema
const UpdateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  profile_picture: z.string().url().optional(),
});

// Middleware: Authenticate JWT Token
async function authenticateUser(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded; // { id, email, role }
  } catch (error) {
    return null;
  }
}

// PATCH API to update user data
export async function PATCH(req: Request) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = UpdateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    // Update user in Supabase
    const { data, error } = await supabase
      .from("users")
      .update(parsed.data)
      .eq("id", user.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: data }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
