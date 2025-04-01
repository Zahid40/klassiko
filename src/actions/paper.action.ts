import supabase from "@/lib/db";
import { paperSchema } from "@/schema/schema";
import { PaperType, QuestionType } from "@/types/type";
import { z } from "zod";

export const getPaper = async ({
  userId,
  role,
  id,
  limit = 10,
  cursor,
  classId,
  teacherId,
  withQuestions = false,
  withClass = false,
  withTeacher = false,
}: {
  userId: string;
  role: "student" | "teacher" | "admin";
  id?: string;
  limit?: number;
  cursor?: number; // Use created_at for pagination
  classId?: string;
  teacherId?: string;
  withQuestions?: boolean;
  withClass?: boolean;
  withTeacher?: boolean;
}): Promise<{ data: PaperType[]; hasMore: boolean }> => {
  try {
    let query = supabase.from("paper").select("*");

    // ✅ Fetch a specific paper by ID (all roles)
    if (id) {
      const { data, error } = await query.eq("id", id).single();
      if (error) throw new Error(error.message);

      // 🔒 Role-based validation
      if (
        (role === "student" && data.class_id !== classId) ||
        (role === "teacher" && data.teacher_id !== userId)
      ) {
        throw new Error("You are not authorized to access this paper.");
      }

      return { data: data ? [data] : [], hasMore: false };
    }

    // ✅ Paginated query setup (using created_at for better pagination)
    query = query.limit(limit);
    if (cursor) query = query.gt("created_at", cursor); // ✅ Fixed

    // 🔒 Role-based data filtering
    if (role === "student") {
      // Get enrolled classes
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

    // ✅ Optional filters for `classId` and `teacherId`
    if (classId) query = query.eq("class_id", classId);
    if (teacherId && role === "admin")
      query = query.eq("teacher_id", teacherId);

    query = query.order("created_at", { ascending: true });

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    // ✅ Fetch questions if `withQuestions` is enabled
    if (withQuestions && data.length > 0) {
      const questionIds = data.flatMap((p) =>
        p.questions ? p.questions.map((q: { id: any }) => q.id) : []
      );

      if (questionIds.length) {
        const { data: questions, error: questionsError } = await supabase
          .from("questions")
          .select("*")
          .in("id", questionIds);

        if (questionsError) throw new Error("Failed to load questions");

        // Attach questions to their respective paper
        data.forEach((paper) => {
          paper.questions = questions.filter((q) =>
            paper.questions.some((q: { id: string; marks: number }) => ({
              ...q,
              detail:
                questions.find((question) => question.id === q.id) || null,
            }))
          );
        });
      }
    }

    const hasMore = data.length === limit;
    return { data: data || [], hasMore };
  } catch (error) {
    console.error("Error fetching papers:", error);
    return { data: [], hasMore: false };
  }
};

const quizForm = paperSchema.pick({
  title: true,
  questions: true,
  class_id: true,
  duration: true,
  scheduled_at: true,
});

export const createPaper = async (
  values: z.infer<typeof quizForm>,
  teacherId: string
) => {
  const parsedSchema = paperSchema.pick({
    title: true,
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
    .from("paper")
    .insert([parsed.data])
    .select();

  if (error) throw new Error(error.message);
  return data;
};

// Define the return type for clarity
interface PaperWithDetails {
  id: string;
  title: string;
  questions: { id: string; marks: number; detail: QuestionType }[];
  teacher_name: string;
  class_name: string;
  teacher_id: string;
  class_id: string;
  duration: number;
  created_at: Date;
  updated_at: Date;
  scheduled_at?: Date | undefined;
}

// Fetch the paper data along with questions, teacher name, and class name
export const fetchQuestionPaper = async (
  id: string
): Promise<PaperWithDetails | null> => {
  try {
    // Fetch the paper by ID
    const { data: paper, error: paperError } = await supabase
      .from("paper")
      .select("*")
      .eq("id", id)
      .single();

    if (paperError || !paper) throw new Error("Paper not found");

    // Extract question IDs from paper.questions (array of { id, marks })
    const questionIds = paper.questions.map((q: { id: string }) => q.id);

    if (questionIds.length === 0)
      throw new Error("No questions linked to this paper");

    // Fetch detailed questions using the extracted IDs
    const { data: questionsData, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .in("id", questionIds);

    if (questionsError) throw new Error("Failed to load questions");

    // Merge questions with their corresponding marks from paper.questions
    const detailedQuestions = paper.questions.map(
      (q: { id: string; marks: number }) => ({
        ...q,
        detail: questionsData.find((question) => question.id === q.id) || null,
      })
    );

    // Fetch teacher's name using teacher_id
    const { data: teacherData, error: teacherError } = await supabase
      .from("users")
      .select("name")
      .eq("id", paper.teacher_id)
      .single();

    const teacherName = teacherData?.name || "Unknown Teacher";

    // Fetch class name using class_id
    const { data: classData, error: classError } = await supabase
      .from("class")
      .select("class_name")
      .eq("id", paper.class_id)
      .single();

    const className = classData?.class_name || "Unknown Class";

    // Return the complete data object with detailed questions
    return {
      ...paper,
      questions: detailedQuestions,
      teacher_name: teacherName,
      class_name: className,
    };
  } catch (error) {
    console.error("Error fetching paper details:", error);
    return null;
  }
};
