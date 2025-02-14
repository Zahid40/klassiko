import { ApiResponseType } from "@/features/appState/types/app.type";
import {
  classSchema,
} from "@/features/class/schema/class.schema";
import supabase from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Validate request body
    const parsed = classSchema
      .pick({ class_name: true, description: true, teacher_id: true })
      .safeParse(req.body);
    if (!parsed.success) {
      return NextResponse.json<ApiResponseType>({
        success: false,
        status: 400,
        message: "Invalid request data.",
        data: parsed.error.format(),
      });
    }

    const { class_name, description, teacher_id } = parsed.data;

    // ✅ Insert new Class into Supabase
    const { data, error } = await supabase
      .from("class")
      .insert([{ class_name, description, teacher_id }])
      .select();

    if (error) {
      return NextResponse.json<ApiResponseType>({
        success: false,
        status: 500,
        message: "Failed to create class.",
        data: error.message,
      });
    }

    return NextResponse.json<ApiResponseType>({
      success: true,
      status: 201,
      message: "Class Created successfully.",
      data,
    });
  } catch (error) {
    console.error("Error while creating class :", error);
    return NextResponse.json<ApiResponseType>({
      success: false,
      status: 500,
      message: "Internal server error.",
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");
    const classId = searchParams.get("class_id");
    const userRole = searchParams.get("role");

    if (!userId || !userRole) {
      return NextResponse.json<ApiResponseType>({
        success: false,
        status: 400,
        message: "Missing userId or Role parameter.",
      });
    }

    // Base query to fetch class data
    let query = supabase.from("class").select("*").eq("teacher_id", userId);

    if (classId) {
      query = query.eq("id", classId);
    }

    const { data: classes, error: classError } = await query;

    if (classError) {
      throw classError;
    }

    if (userRole === "teacher") {
      // Fetch enrollment data for each class
      const classIds = classes.map((cls) => cls.id);
      const { data: enrollments, error: enrollmentError } = await supabase
        .from("class_enrollments")
        .select("class_id, users (name, email, profile_picture)")
        .in("class_id", classIds);

      if (enrollmentError) {
        throw enrollmentError;
      }

      // Attach enrollment data to classes
      const classesWithEnrollments = classes.map((cls) => ({
        ...cls,
        enrollments: enrollments.filter(
          (enrollment) => enrollment.class_id === cls.id
        ),
      }));

      return NextResponse.json<ApiResponseType>({
        success: true,
        status: 200,
        message: "Classes retrieved successfully.",
        data: classesWithEnrollments,
      });
    } else {
      // For students or other roles, return class data without enrollments
      return NextResponse.json<ApiResponseType>({
        success: true,
        status: 200,
        message: "Classes retrieved successfully.",
        data: classes,
      });
    }
  } catch (error) {
    console.error("Error while fetching class:", error);
    return NextResponse.json<ApiResponseType>({
      success: false,
      status: 500,
      message: "Internal server error.",
    });
  }
}
