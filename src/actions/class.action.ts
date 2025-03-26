// src/actions/class.action.ts
import supabase from "@/lib/db";
import { classSchema } from "@/schema/schema";
import { ClassType } from "@/types/type";
import { z } from "zod";

export const getClass = async ({
  userId,
  role = "student",
  classId,
  pageSize = 10,
  lastItemId,
  withEnrollments = false,
}: {
  userId: string;
  role: "student" | "teacher" | "admin";
  classId?: string;
  pageSize?: number;
  lastItemId?: string;
  withEnrollments?: boolean;
}): Promise<{ data: ClassType[]; hasNext: boolean }> => {
  let query = supabase.from("class").select("*");

  if (role === "student") {
    // ✅ If classId is provided — check if student is enrolled in that class
    if (classId) {
      const { data: enrollment, error: enrollmentError } = await supabase
        .from("class_enrollments")
        .select("*")
        .eq("class_id", classId)
        .eq("student_id", userId)
        .single();
  
      if (enrollmentError || !enrollment)
        throw new Error("You're not enrolled in this class.");
  
      query = query.eq("id", classId);
    } 
    // ✅ If no classId — return all classes student is enrolled in
    else {
      const { data: enrollments, error: enrollmentError } = await supabase
        .from("class_enrollments")
        .select("class_id")
        .eq("student_id", userId);
  
      if (enrollmentError || !enrollments.length)
        throw new Error("You're not enrolled in any classes.");
  
      // 🔥 Get all classes where the student is enrolled
      const enrolledClassIds = enrollments.map((e) => e.class_id);
      query = query.in("id", enrolledClassIds);
    }
  }
  

  // ✅ Fetch class with enrollments (teacher/admin-specific)
  else if (classId && (role === "teacher" || role === "admin")) {
    query = query.eq("id", classId);
    if (role === "teacher") query = query.eq("teacher_id", userId);

    const { data: classData, error: classError } = await query.single();
    if (classError) throw new Error("Failed to fetch class data.");

    // Fetch enrollments only if withEnrollments is true
    if (withEnrollments) {
      const { data: enrollments, error: enrollmentError } = await supabase
        .from("class_enrollments")
        .select("student_id")
        .eq("class_id", classId);

      if (enrollmentError) throw new Error("Failed to fetch enrollments.");
      return { data: [{ ...classData, enrollments }], hasNext: false };
    }

    return { data: [classData], hasNext: false };
  }

  // ✅ Normal teacher classes fetch with pagination
  else if (role === "teacher") {
    query = query.eq("teacher_id", userId).order("id").limit(pageSize);

    if (lastItemId) query = query.gt("id", lastItemId);
  }

  // ✅ Admin fetches all classes with pagination
  else if (role === "admin") {
    query = query.order("id").limit(pageSize);

    if (lastItemId) query = query.gt("id", lastItemId);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch classes: ${error.message}`);

  // ✅ Add enrollments to each class if withEnrollments is true
  if (withEnrollments) {
    for (let i = 0; i < data.length; i++) {
      const { data: enrollments, error: enrollmentError } = await supabase
        .from("class_enrollments")
        .select("student_id")
        .eq("class_id", data[i].id);

      if (enrollmentError) throw new Error("Failed to fetch enrollments.");
      data[i].enrollments = enrollments;
    }
  }

  const hasNext = data.length === pageSize;
  return { data, hasNext };
};


const classFormSchema = classSchema.pick({
  class_name: true,
  description: true,
  teacher_id: true,
});
export const createClass = async (values: z.infer<typeof classFormSchema>) => {
  const payload: z.infer<typeof classFormSchema> = values;

  const parsed = classFormSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }
  const { data, error } = await supabase
    .from("class")
    .insert([parsed.data])
    .select()
    .single();

  if (error) throw new Error(`Failed to create class: ${error.message}`);
  return data;
};

export const updateClass = async (
  classId: string,
  updates: z.infer<typeof classFormSchema>
) => {
  const parsedSchema = classSchema.pick({
    class_name: true,
    description: true,
    teacher_id: true,
    updated_at: true,
  });

  const payload: z.infer<typeof parsedSchema> = {
    ...updates,
    updated_at: new Date(),
  };

  const parsed = parsedSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }
  const { data, error } = await supabase
    .from("class")
    .update(parsed.data)
    .eq("id", classId)
    .select()
    .single();

  if (error) throw new Error(`Failed to update class: ${error.message}`);
  return data;
};

export const deleteClass = async (classId: string) => {
  const { error } = await supabase.from("class").delete().eq("id", classId);

  if (error) throw new Error(`Failed to delete class: ${error.message}`);
  return { message: "Class deleted successfully" };
};


export const joinClass = async (classId: string, studentId: string) => {
  const { data: existingEnrollment } = await supabase
    .from("class_enrollments")
    .select("*")
    .eq("class_id", classId)
    .eq("student_id", studentId)
    .single();

  if (existingEnrollment) throw new Error("Student is already enrolled in this class.");

  const { data: enrollment, error } = await supabase
    .from("class_enrollments")
    .insert([{ class_id: classId, student_id: studentId }]);

  if (error) throw new Error(`Failed to join class: ${error.message}`);
  return enrollment;
};

export const removeEnrollment = async (classId: string, studentId: string) => {
  const { error } = await supabase
    .from("class_enrollments")
    .delete()
    .eq("class_id", classId)
    .eq("student_id", studentId);

  if (error) throw new Error(`Failed to remove enrollment: ${error.message}`);
  return { message: "Student unenrolled successfully" };
};
