import supabase from "@/lib/db";
import { paperSchema } from "@/schema/schema";
import { PaperType, QuestionType } from "@/types/type";
import { z } from "zod";

export const getPaper = async ({
  id,
  limit = 10,
  cursor,
  classId,
  teacherId,
}: {
  id?: string;
  limit?: number;
  cursor?: number;
  classId?: string;
  teacherId?: string;
}): Promise<{ data: PaperType[]; hasMore: boolean }> => {
  let query = supabase.from("paper").select("*");

  // If an ID is provided, fetch only that paper
  if (id) {
    query = query.eq("id", id).single();
  } else {
    // Apply pagination and filters only when no ID is provided
    if (cursor) query = query.gt("id", cursor);
    if (classId) query = query.eq("class_id", classId);
    if (teacherId) query = query.eq("teacher_id", teacherId);

    // Limit and order by ID for consistent pagination
    query = query.limit(limit).order("id", { ascending: true });
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  // For a single paper, return data as an array for consistency
  const normalizedData = id ? (data ? [data] : []) : data || [];
  const hasMore = !id && normalizedData.length === limit;

  return { data: normalizedData, hasMore };
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
