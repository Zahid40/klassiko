"use client";
import { getPaper } from "@/actions/paper.action";
import { useUser } from "@/components/providers/user-provider";
import { Button } from "@/components/ui/button";
import { PaperType } from "@/types/type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Add, ArrowRight2, Clock } from "iconsax-react";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

export default function PaperPage() {
  const {user} = useUser();
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
    queryKey: ["papers", user?.id],
    queryFn: ({ pageParam }) => getPaper(5, pageParam,  user?.id),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore
        ? lastPage.data[lastPage.data.length - 1]?.id
        : undefined,
    enabled: !!user?.id,
  });

  const quizzes = data?.pages.flatMap((page) => page.data) ?? [];

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
    <div className="flex flex-col gap-6">
      <h1 className="text-center">Create Papers</h1>
      <div className="flex flex-row gap-6 justify-between items-center border rounded-lg p-8  ">
        <p className="text-base text-balance text-neutral-700">
          Add your paper
        </p>
        <Button asChild>
          <Link href={"/dashboard/paper/create"}>
            <Add />
            Add Paper
          </Link>
        </Button>
      </div>
      {/* Quizzes Container */}
      <div className="border rounded-lg p-4 min-h-[70dvh]">
        {isLoading ? (
          <p className="text-center">Loading quizzes...</p>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load quizzes.</p>
        ) : quizzes.length > 0 ? (
          <div className="space-y-2">
            {quizzes.map((q: PaperType) => (
              <div
                key={q.id}
                className="p-4 border rounded-md text-sm relative flex flex-row justify-between items-center gap-2"
              >
                <div className="space-y-2">
                  <p className="text-lg">{q.title}</p>
                  <p className="text-sm">{q.questions.length} Questions</p>
                  {q.duration && (
                    <p className="text-xs flex gap-1 items-center">
                      <Clock size={16} />
                      {q.duration} mins
                    </p>
                  )}
                </div>
                <Button asChild>
                  <Link href={`/dashboard/paper/${q.id}`}>
                    View Paper
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
