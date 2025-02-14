import { z } from "zod";
import { classSchema } from "../schema/class.schema";

// Infer the TypeScript type from the schema
export type ClassType = z.infer<typeof classSchema>;
