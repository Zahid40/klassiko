import { z } from "zod";

export const quizSchema = z.object({
  id: z.string().uuid(),
  quiz_name: z.string().nonempty(), // Name of the quiz
  class_id: z.string().uuid(),
  teacher_id: z.string().uuid(),
  duration: z.number().int().optional(),
  scheduled_at: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  questions: z.array(z.string()).nonempty(),
});

export const questionSchema = z.object({
  id: z.string(), // Auto-generated ID
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

export const paperSchema = z.object({
  id: z.string().uuid(), // Auto-generated ID
  title: z.string().nonempty(), // Title of the paper
  questions: z
    .array(
      z.object({
        // Array of questions in JSON format
        id: z.string().uuid(),
        marks: z.number().int().default(1), // Marks for the question
      })
    )
    .nonempty(), // Ensure at least one question is present
  teacher_id: z.string().uuid(), // UUID of the teacher
  class_id: z.string().uuid(), // UUID of the associated class
  duration: z.number().int().default(0), // Duration of the paper in seconds
  scheduled_at: z.date().optional(), // Scheduled date and time for the paper
  created_at: z.date(), // Timestamp of creation
  updated_at: z.date(), // Timestamp of last update
});
