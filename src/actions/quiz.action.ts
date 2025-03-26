// src/actions/quiz.action.ts
import supabase from "@/lib/db";
import { quizPerformanceSchema, quizSchema } from "@/schema/schema";
import { QuizType } from "@/types/type";
import { z } from "zod";

export const getQuiz = async ({
  userId,
  role,
  id,
  limit = 10,
  cursor,
  classId,
  teacherId,
  withQuestions = false,
}: {
  userId: string;
  role: "student" | "teacher" | "admin";
  id?: string;
  limit?: number;
  cursor?: number;
  classId?: string;
  teacherId?: string;
  withQuestions?: boolean;
}): Promise<{ data: QuizType[]; hasMore: boolean }> => {
  try {
    let query = supabase.from("quiz").select("*");

    // ✅ Fetch specific quiz by ID (all roles)
    if (id) {
      const { data, error } = await query.eq("id", id).single();
      if (error) throw new Error(error.message);

      // 🔒 Role check — only teachers or enrolled students can access
      if (
        (role === "student" && data.class_id && classId !== data.class_id) ||
        (role === "teacher" && data.teacher_id !== userId)
      ) {
        throw new Error("You are not authorized to access this quiz.");
      }

      // ✅ If withQuestions is true, fetch associated questions
      if (withQuestions && data?.questions?.length) {
        const { data: questions, error: questionsError } = await supabase
          .from("questions")
          .select("*")
          .in("id", data.questions);

        if (questionsError) throw new Error("Failed to load questions");
        data.questions = questions;
      }

      return { data: data ? [data] : [], hasMore: false };
    }

    // ✅ Paginated query setup
    query = query.limit(limit);
    if (cursor) query = query.gt("id", cursor);

    // 🔒 Role-specific data filtering
    if (role === "student") {
      const { data: enrollments, error: enrollmentError } = await supabase
        .from("class_enrollments")
        .select("class_id")
        .eq("student_id", userId);

      if (enrollmentError || !enrollments.length)
        throw new Error("Not enrolled in any classes.");

      const enrolledClasses = enrollments.map((e) => e.class_id);
      query = query.in("class_id", enrolledClasses);
    } else if (role === "teacher") {
      query = query.eq("teacher_id", userId);
    }

    // ✅ Optional filters for classId/teacherId (admin support too)
    if (classId) query = query.eq("class_id", classId);
    if (teacherId && role === "admin")
      query = query.eq("teacher_id", teacherId);

    query = query.order("id", { ascending: true });

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // ✅ If withQuestions is true, fetch questions for each quiz
    if (withQuestions && data.length > 0) {
      const quizIds = data.map((q) => q.id);

      const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .in("quiz_id", quizIds);

      if (questionsError) throw new Error("Failed to load questions");

      data.forEach((quiz) => {
        quiz.questions = questions.filter((q) => q.quiz_id === quiz.id);
      });
    }

    const hasMore = data.length === limit;
    return { data: data || [], hasMore };
  } catch (error) {
    console.error("Error fetching quizzes:", error);
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

// Quiz Performance Actions

const quizPerformanceForm = quizPerformanceSchema.pick({
  quiz_id: true,
  student_id: true,
  score: true,
});

export const createQuizPerformance = async (
  values: z.infer<typeof quizPerformanceForm>
) => {
  const payload: z.infer<typeof quizPerformanceForm> = values;

  const parsed = quizPerformanceForm.safeParse(payload);
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  const { data, error } = await supabase
    .from("quiz_performance")
    .insert([parsed.data])
    .select();

  if (error) throw new Error(error.message);
  return data;
};
