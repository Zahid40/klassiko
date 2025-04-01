"use client";
import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import ExportButton from "@/components/ExportButton";
import { fetchQuestionPaper } from "@/actions/paper.action";
import { formatDistance, subDays } from "date-fns";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch paper data
  const {
    data: paper,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["paper", id],
    queryFn: () => fetchQuestionPaper(id),
  });

  // Handle loading, errors, and missing data
  if (isLoading) return <p>Loading paper...</p>;

  if (error || !paper) {
    toast.error("Failed to load paper.");
    return <p className="text-red-500 text-center mt-8">Error loading paper</p>;
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours > 0 ? `${hours} min ` : ""}${
      minutes > 0 ? `${minutes} min` : ""
    } ${seconds.toString().padStart(2, "0")} sec`;
  };
  const formattedTime = formatTime(paper.duration as number);

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <ExportButton contentRef={contentRef} label="Download as PDF" />

      {/* A4 Paper View */}
      <div
        ref={contentRef}
        className="w-[210mm] h-[297mm] p-12 bg-white border relative"
      >
        {/* Paper Title */}
        <h1 className="text-3xl font-bold mb-4 text-center">{paper.title}</h1>

        {/* Paper Meta Info */}
        <div className="flex justify-between mb-4 text-gray-600 text-sm">
          <p>
            Class: <span>{paper.class_name || paper.class_id}</span>
          </p>
          {paper.duration !== 0 && (
            <p>
              Duration: <span>{formattedTime}</span>
            </p>
          )}
          <p>
            Teacher: <span>{paper.teacher_name || "Unknown"}</span>
          </p>
          <p>
            Total marks:{" "}
            <strong>
              {paper.questions.length > 0 &&
                paper.questions.reduce((acc, curr) => acc + curr.marks, 0)}
            </strong>
          </p>
        </div>

        {/* Questions Section */}

        <div className="space-y-4">
          {paper.questions.length > 0 ? (
            paper.questions.map((q, index) => (
              <div
                key={q.id || index}
                className="border-b pb-2 flex  justify-between"
              >
                <div className="space-y-3">
                  <p className="text-base mb-1">
                    <span>Q{index + 1} :</span>{" "}
                    {q.detail?.question_text || "No question text"}
                  </p>
                  <ol className="flex flex-wrap gap-4 list-[lower-alpha] text-xs  text-neutral-700 list-inside">
                    {q.detail?.options?.map((option) => {
                      return (
                        <li
                          key={option + "_ans"}
                          className="basis-1/3 text-nowrap px-2"
                        >
                          {option}
                        </li>
                      );
                    })}
                  </ol>
                </div>
                <p className="text-sm text-nowrap text-gray-600">
                  Marks: <strong>{q.marks ?? 0}</strong>
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No questions available.</p>
          )}
        </div>

        {/* Footer Section */}
        <footer className="absolute bottom-2 gap-4 text-center text-gray-500 text-[9px] flex justify-between">
          Paper ID: {paper.id}
          <p className="text-[9px] ">
            Last updated at :{" "}
            {formatDistance(
              subDays(new Date(paper.updated_at), 0),
              new Date(),
              { addSuffix: true }
            )}
          </p>
        </footer>
      </div>
    </div>
  );
}
