"use client";
import { useUser } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import React from "react";
import { ApiResponseType } from "@/types/app.type";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ClassType } from "@/types/type";

// Fetch function
const fetchClassData = async ({
  userId,
  classId,
  role,
}: {
  userId: string;
  classId: string | null;
  role: string;
}): Promise<ClassType> => {
  const response = await fetch(
    `/api/class?user_id=${userId}&class_id=${classId}&role=${role}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch class data`);
  }
  const result: ApiResponseType = await response.json();
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.data[0]; // Return the first class (assuming that's intended)
};

export default function Class() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const classId = searchParams.get("class");

  // UseQuery handles loading, error, and data states automatically
  const {
    data: selectedClass,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["class", user?.id, classId, user?.role],
    queryFn: () =>
      fetchClassData({
        userId: user?.id ?? "",
        classId,
        role: user?.role ?? "",
      }),
    enabled: !!user && !!classId, // Only fetch if user and classId are available
    staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
    retry: 1, // Retry only once if the request fails
  });

  // Handle error state
  if (isError) {
    toast.error((error as Error).message);
    return <>Failed to load class data.</>;
  }

  // Handle loading state
  if (isLoading) {
    return <>Loading...</>;
  }

  // Handle no class found
  if (!selectedClass) {
    return <>No Class Found</>;
  }

  return (
    <div className="flex flex-col gap-6 items-center h-full">
      {/* Avatar (optional) */}
      <Avatar className="size-12 ">
        <AvatarFallback className="bg-primary-500 text-background text-2xl font-bold capitalize">
          {selectedClass.class_name.slice(0, 1)}
        </AvatarFallback>
      </Avatar>

      <div>
        <h1 className="text-2xl text-nowrap">{selectedClass.class_name}</h1>

        <Separator className="w-full" />
      </div>
    </div>
  );
}
