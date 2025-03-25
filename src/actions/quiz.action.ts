// src/actions/quiz.action.ts
import supabase from "@/lib/db";
import { quizSchema } from "@/schema/schema";
import { QuizType } from "@/types/type";
import { z } from "zod";

export const getQuiz = async (
  id?: string,
  limit: number = 10,
  cursor?: number,
  classId?: string,
  teacherId?: string
): Promise<{ data: QuizType[]; hasMore: boolean }> => {
  try {
    let query = supabase.from("quiz").select("*");

    // If an ID is provided, fetch only that quiz
    if (id) {
      const { data, error } = await query.eq("id", id).single();
      if (error) throw new Error(error.message);
      return { data: data ? [data] : [], hasMore: false };
    }

    // Fallback to paginated query if no ID is provided
    query = query.limit(limit);

    if (cursor) query = query.gt("id", cursor);
    if (classId) query = query.eq("class_id", classId);
    if (teacherId) query = query.eq("teacher_id", teacherId);

    query = query.order("id", { ascending: true });

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const hasMore = data.length === limit;

    return { data: data || [], hasMore };
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return { data: [], hasMore: false };
  }
};

export const fetchQuizWithQuestions = async (quizId: string) => {
  const { data: quiz, error: quizError } = await supabase
    .from("quiz")
    .select("*")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) throw new Error("Quiz not found");

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .in("id", quiz.questions);

  if (questionsError) throw new Error("Failed to load questions");

  return { ...quiz, questions };
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
