"use client";
import React, { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getQuiz } from "@/actions/quiz.action";
import { Button } from "@/components/ui/button";
import { QuizType } from "@/types/type";
import Link from "next/link";
import { useUser } from "@/components/providers/user-provider";
import QuizCard from "@/components/quiz-card";

export default function QuizPage() {
  const { user } = useUser();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch quizzes with infinite scroll using cursor-based pagination
  // Infinite Scroll Fetch for Quizzes
  const {
    data: quizzesData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["quizzes", user?.id],
    queryFn: ({ pageParam = 0 }) =>
      getQuiz({
        userId: user?.id!,
        role: user?.role!,
        limit: 5,
        cursor: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.hasMore ? allPages.length * 5 : undefined,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const quizzes = quizzesData?.pages.flatMap((page: any) => page.data) ?? [];

  // Infinite scroll trigger setup
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

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-xl font-bold">Quiz Page</h1>

      {/* Create Quiz Button */}
      {user?.role !== "student" && (
        <Button asChild>
          <Link href={"/dashboard/quiz/create"}>Create Quiz</Link>
        </Button>
      )}

      {/* Quizzes Container */}
      <div className="border rounded-lg p-4 min-h-[70dvh]">
        {isLoading ? (
          <p className="text-center">Loading quizzes...</p>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load quizzes.</p>
        ) : quizzes.length > 0 ? (
          <div className="space-y-2">
            {quizzes.map((q: QuizType) => (
              <QuizCard quiz={q} key={q.id} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No quizzes found.</p>
        )}

        {/* Infinite Scroll Trigger */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="h-10 mt-4 text-center">
            {isFetchingNextPage ? "Loading more quizzes..." : "Load more..."}
          </div>
        )}
      </div>
    </div>
  );
}
