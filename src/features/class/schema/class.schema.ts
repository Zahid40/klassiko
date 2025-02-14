// schemas/classSchema.ts
import { z } from "zod";

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

