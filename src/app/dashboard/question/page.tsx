"use client";
import React, { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Asterisk, SquareStack, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TickCircle } from "iconsax-react";
import { formatDistance, subDays } from "date-fns";
import AddQuestionDialog from "@/components/add-question-dialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getQuestions } from "@/actions/question.action";
import { QuestionType } from "@/types/type";
import { useUser } from "@/components/providers/user-provider";

export default function QuestionPage() {
  const { user } = useUser();
  const loadMoreRef = useRef<HTMLDivElement>(null); // Ref for load more trigger

  // Infinite Scroll Query Setup
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["questions", user?.id],
    queryFn: ({ pageParam }) =>
      getQuestions({
        limit: 10,
        cursor: pageParam,
        userId: user?.id!,
        role: user?.role!,
      }),
    initialPageParam: "",
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.questions.at(-1)?.id : undefined,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const questions = data?.pages.flatMap((page: any) => page.questions) || [];

  // Scroll Observer for "Load More"
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

  // Handle errors
  if (isError) {
    console.error("Error loading questions:", error);
    return (
      <p className="text-red-500 text-center">Failed to load questions.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-xl font-bold">Questions</h1>

      {/* Add Question Section */}
      <div className="flex flex-row gap-6 justify-between items-center border rounded-lg p-8">
        <p className="text-sm text-balance text-neutral-700">
          Add your Question and reuse it in any paper or quiz
        </p>
        <AddQuestionDialog onSuccess={refetch} />
      </div>

      {/* Questions List */}
      <div className="border rounded-lg p-4 min-h-[70dvh]">
        {isLoading ? (
          <p className="text-center text-neutral-500">Loading questions...</p>
        ) : questions.length > 0 ? (
          <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((question: QuestionType) => (
              <div
                key={question.id}
                className="py-8 px-6 border rounded-md text-sm relative flex flex-col gap-2 min-h-24 bg-neutral-100"
              >
                <Badge
                  className="text-[9px] font-medium gap-2 absolute top-2 right-2"
                  variant={
                    question.question_type === "general"
                      ? "secondary"
                      : question.question_type === "multiple_choice"
                      ? "outline"
                      : "default"
                  }
                >
                  {question.question_type === "general" ? (
                    <>
                      <Asterisk size={14} /> General{" "}
                    </>
                  ) : question.question_type === "multiple_choice" ? (
                    <>
                      <SquareStack size={14} /> Multiple Choice{" "}
                    </>
                  ) : (
                    "Undefined"
                  )}
                </Badge>

                {/* Time since creation */}
                <p className="text-[9px] absolute bottom-2 right-2">
                  {formatDistance(
                    subDays(new Date(question.created_at), 0),
                    new Date(),
                    { addSuffix: true }
                  )}
                </p>

                {/* Question Text */}
                <p className="text-base">{question.question_text}</p>

                {/* Options / Answer */}
                {question.options?.length ? (
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option) => {
                      const isCorrect =
                        option.toLowerCase() ===
                        question.correct_answer.toLowerCase();
                      return (
                        <p
                          key={option + "_ans"}
                          className={cn(
                            "text-xs flex gap-2 items-center",
                            isCorrect ? "text-green-600" : "text-neutral-700 "
                          )}
                        >
                          {option}
                          {isCorrect && <TickCircle size={14} />}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs">{question.correct_answer}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500">No questions found.</p>
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

        {/* Show end message when done */}
        {!hasNextPage && questions.length > 0 && (
          <p className="text-center text-xs text-neutral-500 mt-6">
            You have reached the end!
          </p>
        )}
      </div>
    </div>
  );
}
