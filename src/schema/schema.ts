import { z } from "zod";

export const quizSchema = z.object({
  id: z.string().uuid(),
  quiz_name: z.string().nonempty(), // Name of the quiz
  class_id: z.string().uuid(),
  teacher_id: z.string().uuid(),
  duration: z.number().int(),
  scheduled_at: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  questions: z.array(z.string()).nonempty(),
});

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

export const classEnrollment = z.object({
  id: z.string().uuid(),
  class_id: z.string().uuid(),
  student_id: z.string().uuid(),
  enrolled_at: z.date(),
});

// Define the schema for class creation
export const classSchema = z.object({
  id: z.string().uuid(),
  class_name: z.string().min(1, "Class name is required"),
  description: z.string().optional(),
  enrollments: classEnrollment.array(),
  teacher_id: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});
