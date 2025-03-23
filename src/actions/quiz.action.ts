// src/actions/quiz.action.ts
import supabase from "@/lib/db";
import { QuizType } from "@/types/type";

export const getQuiz = async (
  page: number = 1,
  pageSize: number = 10,
  classId?: string,
  teacherId?: string
): Promise<{ data: QuizType[]; total: number }> => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  // Build the query dynamically
  let query = supabase.from("quiz").select("*", { count: "exact" }).range(start, end);

  // Apply filters conditionally
  if (classId) query = query.eq("class_id", classId);
  if (teacherId) query = query.eq("teacher_id", teacherId);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return { data: data || [], total: count || 0 };
};
