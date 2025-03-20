import { quizSchema } from "@/schema/schema";
import { z } from "zod";

export type QuizType = z.infer<typeof quizSchema>;
