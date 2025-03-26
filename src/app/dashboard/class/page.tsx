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
import { getClass } from "@/actions/class.action";
import CopyButton from "@/components/CopyButton";
import QuizCard from "@/components/quiz-card";

export default function Class() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const classId = searchParams.get("class")!;
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["quizzes", classId, user?.id],
    queryFn: ({ pageParam = 0 }) =>
      getQuiz({
        userId: user?.id!,
        role: user?.role!,
        limit: 5,
        cursor: pageParam,
        classId,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.hasMore ? allPages.length * 5 : undefined,
    enabled: !!classId && !!user?.id,
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

  const classData = selectedClass.data[0];

  return (
    <div className="flex flex-col gap-6 items-center h-full px-4 py-8">
      {/* Avatar (optional) */}
      <Avatar className="size-12 ">
        <AvatarFallback className="bg-primary-500 text-background text-2xl font-bold capitalize">
          {classData.class_name.slice(0, 1)}
        </AvatarFallback>
      </Avatar>

      {/* Class Info */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">{classData.class_name}</h1>
        <p className="text-neutral-700 text-sm text-center">
          {classData.description}
        </p>
        <Separator className="w-full mt-2" />
      </div>
      <div>
        <CopyButton
          text={`http://localhost:3000/class/join/${classId}`}
          title="Joining Link for Students"
        />
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
            <QuizCard quiz={q} key={q.id} />
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
