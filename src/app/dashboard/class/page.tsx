"use client";
import { useUser } from "@/components/providers/user-provider";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { ApiResponseType } from "@/types/app.type";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { ClassType, QuizType } from "@/types/type";
import { getQuiz } from "@/actions/quiz.action";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { ArrowRight2, Clock } from "iconsax-react";

// Fetch Class Data
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
  if (!response.ok) throw new Error("Failed to fetch class data");

  const result: ApiResponseType = await response.json();
  if (!result.success) throw new Error(result.message);

  return result.data[0];
};

export default function Class() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const classId = searchParams.get("class");
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch Class Data
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
    enabled: !!user && !!classId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Infinite Scroll Fetch for Quizzes
  const {
    data: quizzesData,
    isLoading: quizzesLoading,
    isError: quizzesError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["quizzes", classId, user?.id],
    queryFn: ({ pageParam }) =>
      getQuiz(5, pageParam, classId ?? undefined, user?.id),
    initialPageParam: 0, // ✅ Set the initial page
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length === 5 ? allPages.length + 1 : undefined,
    enabled: !!classId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const quizzes = quizzesData?.pages.flatMap((page) => page.data) ?? [];

  // Infinite Scroll Trigger
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle Errors
  useEffect(() => {
    if (isError) toast.error((error as Error).message);
    if (quizzesError) toast.error("Failed to load quizzes.");
  }, [isError, quizzesError]);

  // Loading State for Class
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If Class Not Found
  if (!selectedClass) {
    return <p className="text-center text-gray-500">No Class Found.</p>;
  }

  return (
    <div className="flex flex-col gap-6 items-center h-full px-4 py-8">
      {/* Avatar (optional) */}
      <Avatar className="size-12 ">
        <AvatarFallback className="bg-primary-500 text-background text-2xl font-bold capitalize">
          {selectedClass.class_name.slice(0, 1)}
        </AvatarFallback>
      </Avatar>

      {/* Class Info */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">{selectedClass.class_name}</h1>
        <Separator className="w-full mt-2" />
      </div>

      {/* Quizzes Section */}
      <div className="w-full ">
        <h2 className="text-lg font-semibold mb-2">Quizzes</h2>

        {/* Show loading if quizzes are still fetching */}
        {quizzesLoading && (
          <p className="text-center text-gray-500">Loading quizzes...</p>
        )}

        {/* Render quizzes */}
        {quizzes.length ? (
          quizzes.map((q) => (
            <div
              key={q.id}
              className="p-4 border rounded-md text-sm relative flex flex-row justify-between items-center gap-2"
            >
              <div className="space-y-2">
                <p className="text-lg">{q.quiz_name}</p>
                <p className="text-sm">{q.questions.length} Questions</p>
                {q.duration && (
                  <p className="text-xs flex gap-1 items-center">
                    <Clock size={16} />
                    {q.duration} mins
                  </p>
                )}
              </div>
              <Button asChild>
                <Link href={`/dashboard/quiz/start/${q.id}/${user?.id}`}>
                  Start Quiz
                  <ArrowRight2 />
                </Link>
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No quizzes available yet.</p>
        )}

        {/* Infinite Scroll Load More Trigger */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="h-10 mt-4 text-center">
            {isFetchingNextPage ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Load more..."
            )}
          </div>
        )}
      </div>
    </div>
  );
}
