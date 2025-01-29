import { NextResponse } from "next/server";
import { UserSchema } from "@/features/user/schema/user.schema";
import bcrypt from "bcryptjs";
import supabase from "@/lib/db";

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const parsed = UserSchema.omit({
      id: true,
      created_at: true,
      updated_at: true,
    }).safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, password , role } = parsed.data;

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into Supabase
    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword , role }])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
