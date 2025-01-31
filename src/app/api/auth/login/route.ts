import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import supabase from "@/lib/db";

// Define Login Schema
const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// POST API to handle login
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Find user in Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, password, role, profile_picture")
      .eq("email", email)
      .single();

    if (!user || error) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_picture: user.profile_picture || "",
      token,
    };

    // Set cookie using Next.js headers
    cookies().set("userState", JSON.stringify(userData), { path: "/", maxAge: 604800 }); // 7 days

    return NextResponse.json({ success: true, user: userData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}