import { z } from "zod";
import { questionSchema } from "../schema/question.schema";

export type QuestionType = z.infer<typeof questionSchema>;