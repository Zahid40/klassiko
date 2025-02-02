import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import supabase from "@/lib/db";

export async function GET(req: Request) {
  try {
    // 1️⃣ Get token from Cookies or Authorization Header
    const cookieStore = cookies();
    const token = JSON.parse(cookieStore.get("userState")!.value).token;

    if (!token) {
      return NextResponse.json(
        { success: true, isVerified: false, message: "Token missing." },
        { status: 401 }
      );
    }

    // 2️⃣ Verify JWT Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        {
          success: true,
          isVerified: false,
          message: "Invalid or expired token.",
        },
        { status: 401 }
      );
    }

    const { id, email } = decoded as { id: string; email: string };

    // 3️⃣ Check if user exists in database
    const { data: user, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", id)
      .single();

    if (error || !user) {
      return NextResponse.json(
        {
          success: true,
          isVerified: false,
          message: "User not found in database.",
        },
        { status: 404 }
      );
    }

    // ✅ If token is valid and user exists
    return NextResponse.json(
      {
        success: true,
        isVerified: true,
        message: "Token is valid and user exists.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        success: false,
        isVerified: false,
        message: "Server error during verification.",
      },
      { status: 500 }
    );
  }
}
