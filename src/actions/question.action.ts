// src/features/question/actions/question.action.ts

import supabase from "@/lib/db";
import { questionSchema } from "@/schema/schema";
import { QuestionType } from "@/types/type";
import { z } from "zod";

// Function to fetch questions with pagination
export const getQuestions = async (
  page: number = 1,
  pageSize: number = 10,
  teacherId: string
): Promise<{ questions: QuestionType[]; total: number }> => {
  try {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Fetch questions within the given range
    const { data: questions, error } = await supabase
      .from("questions")
      .select("*")
      .eq("teacher_id", teacherId)
      .range(start, end);

    if (error) throw error;

    // Fetch total count of questions
    const { count } = await supabase
      .from("questions")
      .select("id", { count: "exact", head: true });

    return { questions: questions || [], total: count || 0 };
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return { questions: [], total: 0 };
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
