"use client";
import UnifiedPagination from "@/features/app/components/unified-pagination";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { QuestionType } from "../types/question.type";
import supabase from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Asterisk, SquareStack } from "lucide-react";
import { cn } from "@/lib/utils";
import { TickCircle } from "iconsax-react";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import AddQuestionDialog from "./add-question-dialog";

export default function QuestionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read page/pageSize from the URL, or fallback to 1 / 10
  const pageParam = searchParams.get("page");
  const pageSizeParam = searchParams.get("pageSize");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : 10;

  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Fetch questions from the DB
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);

      try {
        // Calculate start & end range for pagination
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize - 1;

        // Fetch questions
        const { data: questions, error } = await supabase
          .from("questions")
          .select("*")
          .range(start, end);

        if (error) throw error;

        // Set fetched questions
        setQuestions(questions || []);

        // Fetch total number of questions
        const { count } = await supabase
          .from("questions")
          .select("id", { count: "exact", head: true });

        setTotal(count || 0);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage, pageSize]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-xl font-bold">Questions</h1>
      <div className="flex flex-row gap-6 justify-between items-center border rounded-lg p-8  ">
        <p className="text-base text-balance text-neutral-700">
          Add your Question and Reuse in any paper or quiz
        </p>
        <AddQuestionDialog />
      </div>

      <div className="border rounded-lg p-4 min-h-[70dvh]">
        {loading ? (
          <p className="text-center">Loading questions...</p>
        ) : questions.length > 0 ? (
          <div className="space-y-2">
            {questions.map((question) => {
              return (
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
                        <SquareStack size={16} /> Multiple choice{" "}
                      </>
                    ) : (
                      "Undefined"
                    )}
                  </Badge>
                  <p className="text-[9px] absolute bottom-2 right-2">
                    {formatDistance(
                      subDays(new Date(question.created_at), 0),
                      new Date(),
                      { addSuffix: true }
                    )}
                  </p>
                  <p className="text-base ">{question.question_text}</p>
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
              );
            })}
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
