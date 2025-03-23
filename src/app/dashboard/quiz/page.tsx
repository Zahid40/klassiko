"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getQuiz } from "@/actions/quiz.action";
import { Button } from "@/components/ui/button";
import UnifiedPagination from "@/features/app/components/unified-pagination";
import { QuizType } from "@/types/type";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();

  // Read page/pageSize from URL or fallback to 1 / 10
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  // Fetch quizzes with react-query
  const { data, error, isLoading } = useQuery({
    queryKey: ["quizzes", currentPage, pageSize, user?.id],
    queryFn: () =>
      getQuiz(currentPage, pageSize),
    enabled: !!user?.id, // Only fetch if user ID is available
  });

  const quizzes = data?.data ?? [];
  const total = data?.total ?? 0;

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
                className="p-4 border rounded-md text-sm relative flex flex-col gap-2"
              >
                <p>{q.quiz_name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No quizzes found.</p>
        )}
      </div>

      {/* Pagination Component */}
      <UnifiedPagination total={total} />
    </div>
  );
}
