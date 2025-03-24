// src/actions/class.action.ts
import supabase from "@/lib/db";
import { ClassType } from "@/types/type";

export const getClass = async (
  teacherId: string,
  pageSize: number = 10,
  lastItemId?: string
): Promise<{ data: ClassType[]; hasNext: boolean }> => {
  let query = supabase
    .from("class")
    .select("*")
    .eq("teacher_id", teacherId)
    .order("id")
    .limit(pageSize);

  // If lastItemId exists, fetch the next page after it
  if (lastItemId) query = query.gt("id", lastItemId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  // Determine if there's a next page by checking length
  const hasNext = data.length === pageSize;
  return { data, hasNext };
};
