"use client";
import { getPaper } from "@/actions/paper.action";
import PaperCard from "@/components/paper-card";
import { useUser } from "@/components/providers/user-provider";
import { Button } from "@/components/ui/button";
import { PaperType } from "@/types/type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Add } from "iconsax-react";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

export default function PaperPage() {
  const { user } = useUser();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch quizzes with infinite scroll using cursor-based pagination
  const {
    data: papersData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["quizzes", user?.id],
    queryFn: ({ pageParam = 0 }) =>
      getPaper({
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

  const papers = papersData?.pages.flatMap((page) => page.data) ?? [];

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
      {user?.role !== "student" && (
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
      )}

      {/* Quizzes Container */}
      <div className="border rounded-lg p-4 min-h-[70dvh]">
        {isLoading ? (
          <p className="text-center">Loading quizzes...</p>
        ) : error ? (
          <p className="text-center text-red-500">Failed to load quizzes.</p>
        ) : papers.length > 0 ? (
          <div className="space-y-2">
            {papers.map((paper: PaperType) => (
              <PaperCard paper={paper} key={paper.id} />
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
