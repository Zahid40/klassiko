import { classEnrollment, classSchema, paperSchema, questionSchema, quizSchema } from "@/schema/schema";
import { z } from "zod";

export type QuizType = z.infer<typeof quizSchema>;
export type QuestionType = z.infer<typeof questionSchema>;
export type ClassType = z.infer<typeof classSchema>;
export type ClassEnrollmentType = z.infer<typeof classEnrollment>;
export type PaperType = z.infer<typeof paperSchema>;
