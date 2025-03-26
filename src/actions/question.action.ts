// src/features/question/actions/question.action.ts

import supabase from "@/lib/db";
import { questionSchema } from "@/schema/schema";
import { QuestionType } from "@/types/type";
import { z } from "zod";

interface GetQuestionsParams {
  limit?: number; // ✅ Limit the number of questions per fetch
  cursor?: number; // ✅ Use last item ID as cursor for infinite scroll
  userId: string;
  role: "student" | "teacher" | "admin";
  isQuiz?: boolean;
}

/**
 * Fetches questions with role-based control and supports infinite scroll.
 */
export const getQuestions = async ({
  limit = 10,
  cursor,
  userId,
  role,
  isQuiz,
}: GetQuestionsParams): Promise<{
  questions: QuestionType[];
  hasMore: boolean;
}> => {
  try {
    // ✅ Role-based access control
    if (role === "student") {
      console.warn("Students are not allowed to fetch questions.");
      return { questions: [], hasMore: false };
    }

    let query = supabase.from("questions").select("*");

    // 🔒 Role-based filtering
    if (role === "teacher") query = query.eq("teacher_id", userId);

    if (isQuiz) query = query.eq("question_type", "multiple_choice");

    // ✅ Cursor-based pagination for infinite scroll
    if (cursor) query = query.gt("id", cursor);

    // ✅ Limit the number of results
    query = query.limit(limit);

    // ✅ Order by ID for consistent pagination
    query = query.order("id", { ascending: true });

    const { data: questions, error } = await query;

    if (error) throw error;

    // ✅ Check if there's more data (hasNextPage)
    const hasMore = questions.length === limit;

    return { questions: questions || [], hasMore };
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return { questions: [], hasMore: false };
  }
};

const questionForm = questionSchema.pick({
  question_type: true,
  question_text: true,
  options: true,
  correct_answer: true,
});

export const addQuestion = async (
  values: z.infer<typeof questionForm>,
  teacherId: string
) => {
  const parsedSchema = questionSchema.pick({
    question_type: true,
    question_text: true,
    options: true,
    correct_answer: true,
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
    .from("questions")
    .insert([parsed.data])
    .select();
  if (error) throw error;

  return data;
};
