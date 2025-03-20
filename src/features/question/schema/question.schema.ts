import { z } from "zod";

export const questionSchema = z.object({
    id: z.number().int(), // Auto-generated ID
    teacher_id: z.string().uuid(), // UUID of the teacher
    question_type: z.string().min(1, "Question type is required"),
    question_text: z.string().min(1, "Question is required"),
    options: z.array(z.string()).optional(),
    correct_answer: z.string().min(1, "Answer is required"),
    created_at: z.date(),
    updated_at: z.date(),
  });