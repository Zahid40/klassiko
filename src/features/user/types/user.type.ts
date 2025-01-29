import { z } from "zod";
import { UserRoleEnum, UserSchema } from "../schema/user.schema";

// TypeScript Type for User
export type UserType = z.infer<typeof UserSchema>;
export type UserRoleType = z.infer<typeof UserRoleEnum>;
