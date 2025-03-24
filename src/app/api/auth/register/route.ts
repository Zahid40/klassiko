import { NextResponse } from "next/server";
import { UserSchema } from "@/schema/user.schema";
import bcrypt from "bcryptjs";
import supabase from "@/lib/db";
import { ApiResponseType } from "@/types/app.type";

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const parsed = UserSchema.omit({
      id: true,
      created_at: true,
      updated_at: true,
      token: true,
    }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<ApiResponseType>({
        success: false,
        status: 400,
        message: "Invalid request data.",
        data: parsed.error.format(),
      });
    }

    const { name, email, password, role } = parsed.data;

    // ✅ Check if user already exists
    const { data: existingUser, error: existingError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json<ApiResponseType>({
        success: false,
        status: 400,
        message: "Email is already in use. Please use a different email.",
      });
    }

    if (existingError && existingError.code !== "PGRST116") {
      return NextResponse.json<ApiResponseType>({
        success: false,
        status: 500,
        message: "Database error.",
        data: existingError.message,
      });
    }

    // ✅ Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    const profile_picture = `https://avatar.iran.liara.run/public/${Math.floor(
      Math.random() * 100
    )}`;

    // ✅ Insert new user into Supabase
    const { data, error } = await supabase
      .from("users")
      .insert([
        { name, email, password: hashedPassword, role, profile_picture },
      ])
      .select();

    if (error) {
      return NextResponse.json<ApiResponseType>({
        success: false,
        status: 500,
        message: "Failed to create user.",
        data: error.message,
      });
    }

    return NextResponse.json<ApiResponseType>({
      success: true,
      status: 201,
      message: "User registered successfully.",
      data,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json<ApiResponseType>({
      success: false,
      status: 500,
      message: "Internal server error.",
    });
  }
}
