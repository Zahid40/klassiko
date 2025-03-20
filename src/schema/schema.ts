import { z } from "zod";

export const quizSchema = z.object({
  id: z.string().uuid(),
  quiz_name: z.string().nonempty(), // Name of the quiz
  class_id: z.string().uuid(),
  duration: z.number().int(),
  scheduled_at: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  questions: z.array(z.string()).nonempty(),
});

