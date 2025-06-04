"use client";
import { useUser } from "@/components/providers/user-provider";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getQuiz, getQuizPerformance } from "@/actions/quiz.action";
import { Loader2 } from "lucide-react";
import { getClass } from "@/actions/class.action";
import CopyButton from "@/components/CopyButton";
import QuizCard from "@/components/quiz-card";
import { getPaper } from "@/actions/paper.action";
import PaperCard from "@/components/paper-card";

export default function ClassPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { user } = useUser();
  const classId = searchParams.class! as string;

  // Fetch Class Data
  const {
    data: selectedClass,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["class", user?.id, classId, user?.role],
    queryFn: () =>
      getClass({
        userId: user?.id!,
        classId,
        role: user?.role!,
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
  } = useQuery({
    queryKey: ["quizzes", classId, user?.id],
    queryFn: () =>
      getQuiz({
        userId: user?.id!,
        role: user?.role!,
        limit: 5,
        classId,
      }),
    enabled: !!classId && !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const {
    data: quizPerData,
    isLoading: quizPerLoading,
    isError: quizPerError,
  } = useQuery({
    queryKey: ["quizPer", classId, user?.id],
    queryFn: () =>
      getQuizPerformance({
        userId: user?.id!,
        role: user?.role!,
        limit: 5,
        classId,
      }),
    enabled: !!classId && !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Infinite Scroll Fetch for Quizzes
  const {
    data: papersData,
    isLoading: papersLoading,
    isError: papersError,
  } = useQuery({
    queryKey: ["papers", classId, user?.id],
    queryFn: () =>
      getPaper({
        userId: user?.id!,
        role: user?.role!,
        limit: 5,
        classId,
      }),
    enabled: !!classId && !!user?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const quizzes = quizzesData?.data;
  const papers = papersData?.data;
  const quiz_performance = quizPerData?.data;

  // Handle Errors
  useEffect(() => {
    if (isError) toast.error(error.message);
    if (quizzesError) toast.error("Failed to load quizzes.");
  }, [isError, quizzesError, error]);

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

  const classData = selectedClass.data[0];

  return (
    <div className="flex flex-col gap-6 items-start h-full px-4 py-8">
      <div className="flex flex-row flex-wrap gap-2 items-center">
        {/* Avatar (optional) */}
        <Avatar className="size-12 ">
          <AvatarFallback className="bg-primary-500 text-background text-2xl font-bold capitalize">
            {classData.class_name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>

        <h1 className="text-2xl font-bold">{classData.class_name}</h1>
      </div>

      {/* Class Info */}
      <div className="flex flex-col gap-3">
        <p className="text-neutral-700 text-sm ">{classData.description}</p>
        <CopyButton
        className="w-min"
          text={`${window.location.origin}/class/join/${classId}`}
          title="Joining Link for Students"
        />
      </div>
      

      <div className="flex gap-4 w-full">
        {/* Quizzes Section */}

        <div className="w-full ">
          <h2 className="text-lg font-semibold mb-2">Quizzes</h2>

          {/* Show loading if quizzes are still fetching */}
          {quizzesLoading && (
            <p className="text-center text-gray-500">Loading quizzes...</p>
          )}

          {/* Render quizzes */}
          {quizzes?.length ? (
            quizzes.map((q) => <QuizCard quiz={q} key={q.id} />)
          ) : (
            <p className="text-sm text-gray-500">No quizzes available yet.</p>
          )}
        </div>

        <div className="w-full">
          <h2 className="text-lg font-semibold mb-2">Quiz Attempts</h2>

          {/* Show loading if quizzes are still fetching */}
          {quizPerLoading && (
            <p className="text-center text-gray-500">
              Loading quiz performance...
            </p>
          )}

          {/* Render quizzes */}
          {quiz_performance?.length ? (
            quiz_performance.map((quiz: any) => (
              <div key={quiz.id} className="mb-4 border p-3 rounded-md">
                <h3 className="text-md font-medium">{quiz.quiz_name}</h3>

                {/* Show attempts & scores */}
                {quiz.attempts.length ? (
                  <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                    {quiz.attempts.map((attempt: any, index: number) => (
                      <li key={index}>
                        Score: {attempt.score}
                        {attempt.student && (
                          <span className="ml-2 text-gray-400">
                            ({attempt.student.name})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">No attempts yet.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No quiz performance available yet.
            </p>
          )}
        </div>
      </div>

      <div className="w-full ">
        <h2 className="text-lg font-semibold mb-2">Papers</h2>

        {papersLoading && (
          <p className="text-center text-gray-500">Loading papers....</p>
        )}
        {papers?.length ? (
          papers.map((p) => <PaperCard paper={p} key={p.id} />)
        ) : (
          <p className="text-sm text-gray-500">No quizzes available yet.</p>
        )}
      </div>
    </div>
  );
}
