"use client";
import UnifiedPagination from "@/features/app/components/unified-pagination";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Asterisk, SquareStack } from "lucide-react";
import { cn } from "@/lib/utils";
import { TickCircle } from "iconsax-react";
import { formatDistance, subDays } from "date-fns";
import AddQuestionDialog from "@/features/question/components/add-question-dialog";
import { useQuery } from "@tanstack/react-query";
import { getQuestions } from "@/actions/question.action";
import { QuestionType } from "@/types/type";
import { useUser } from "@/context/UserContext";

export default function QuestionPage() {
  const searchParams = useSearchParams();
  const {user} = useUser()

  // Read page/pageSize from URL, or default to 1 / 10
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  // React Query - Fetch questions
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["questions", currentPage, pageSize],
    queryFn: () => getQuestions(currentPage, pageSize , user?.id!),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  const questions = data?.questions || [];
  const total = data?.total || 0;

  // Handle errors
  if (isError) {
    console.error("Error loading questions:", error);
    return <p className="text-red-500 text-center">Failed to load questions.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-xl font-bold">Questions</h1>

      {/* Add Question Section */}
      <div className="flex flex-row gap-6 justify-between items-center border rounded-lg p-8">
        <p className="text-base text-balance text-neutral-700">
          Add your Question and reuse it in any paper or quiz
        </p>
        <AddQuestionDialog onSuccess={refetch} />
      </div>

      {/* Questions List */}
      <div className="border rounded-lg p-4 min-h-[70dvh]">
        {isLoading ? (
          <p className="text-center">Loading questions...</p>
        ) : questions.length > 0 ? (
          <div className="space-y-2">
            {questions.map((question: QuestionType) => (
              <div
                key={question.id}
                className="p-4 border rounded-md text-sm relative flex flex-col gap-2"
              >
                <Badge
                  className="text-xs font-medium gap-2 absolute top-2 right-2"
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
                      <Asterisk size={16} /> General{" "}
                    </>
                  ) : question.question_type === "multiple_choice" ? (
                    <>
                      <SquareStack size={16} /> Multiple Choice{" "}
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
                <p className="text-base ">{question.question_text}</p>

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
                            isCorrect
                              ? "text-green-600"
                              : "text-neutral-700 "
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
          <p className="text-center text-gray-500">No questions found.</p>
        )}
      </div>

      {/* Pagination Component */}
      <UnifiedPagination total={total} />
    </div>
  );
}
