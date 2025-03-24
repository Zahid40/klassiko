// src/actions/quiz.action.ts
import supabase from "@/lib/db";
import { quizSchema } from "@/schema/schema";
import { QuizType } from "@/types/type";
import { z } from "zod";

export const getQuiz = async (
  limit: number = 10,
  cursor?: number,
  classId?: string,
  teacherId?: string
): Promise<{ data: QuizType[]; hasMore: boolean }> => {
  // Start building the base query
  let query = supabase.from("quiz").select("*").limit(limit);

  // Apply cursor-based pagination (fetch next batch after the last item)
  if (cursor) query = query.gt("id", cursor); // `gt` means "greater than" the last ID

  // Apply optional filters
  if (classId) query = query.eq("class_id", classId);
  if (teacherId) query = query.eq("teacher_id", teacherId);

  // Order by creation or ID to maintain consistency
  query = query.order("id", { ascending: true });

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  // Determine if there are more items to load (less than limit means no more data)
  const hasMore = data.length === limit;

  return { data: data || [], hasMore };
};


const quizForm = quizSchema.pick({
  quiz_name: true,
  questions: true,
  class_id: true,
  duration: true,
  scheduled_at: true,
});

export const createQuiz = async (
  values: z.infer<typeof quizForm>,
  teacherId: string
) => {
  const parsedSchema = quizSchema.pick({
    quiz_name: true,
    questions: true,
    class_id: true,
    duration: true,
    scheduled_at: true,
    teacher_id: true,
  });

  const payload: z.infer<typeof parsedSchema> = {
    ...values,
    teacher_id: teacherId,
  };

  const parsed = parsedSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  const { data, error } = await supabase
    .from("quiz")
    .insert([parsed.data])
    .select();

  if (error) throw new Error(error.message);
  return data;
};
