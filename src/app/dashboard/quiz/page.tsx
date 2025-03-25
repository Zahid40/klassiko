"use client";
import React, { useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getQuiz } from "@/actions/quiz.action";
import { Button } from "@/components/ui/button";
import { QuizType } from "@/types/type";
import Link from "next/link";
import { useUser } from "@/components/providers/user-provider";
import { ArrowRight2, Clock } from "iconsax-react";

export default function QuizPage() {
  const { user } = useUser();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch quizzes with infinite scroll using cursor-based pagination
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["quizzes", user?.id],
    queryFn: ({ pageParam }) =>
      getQuiz(undefined, 5, pageParam, undefined, user?.id),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore
        ? lastPage.data[lastPage.data.length - 1]?.id
        : undefined,
    enabled: !!user?.id,
  });

  const quizzes = data?.pages.flatMap((page: any) => page.data) ?? [];

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
      <Button asChild>
        <Link href={"/dashboard/quiz/create"}>Create Quiz</Link>
      </Button>

      {/* Quizzes Container */}
      <div className="border rounded-lg p-4 min-h-[70dvh]">
        {isLoading ? (
          <p className="text-center">Loading quizzes...</p>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load quizzes.</p>
        ) : quizzes.length > 0 ? (
          <div className="space-y-2">
            {quizzes.map((q: QuizType) => (
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
                  <Link href={`/quiz/start/${q.id}`}>
                    Start Quiz
                    <ArrowRight2 />
                  </Link>
                </Button>
              </div>
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
