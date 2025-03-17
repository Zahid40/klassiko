import { z } from "zod";
import { questionSchema } from "../schema/paper.schema";

export type QuestionType = z.infer<typeof questionSchema>;