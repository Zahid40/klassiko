import { QuizType } from "@/types/type";
import { ArrowRight2, Clock } from "iconsax-react";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function QuizCard(params: { quiz: QuizType }) {
  const { quiz } = params;
  // Format time in HH:MM:SS
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours > 0 ? `${hours} min ` : ""}${
      minutes > 0 ? `${minutes} min` : ""
    } ${seconds.toString().padStart(2, "0")} sec`;
  };
  const formattedTime = formatTime(quiz.duration as number);
  return (
    <div
      key={quiz.id}
      className="p-4 border rounded-md text-sm relative flex flex-row justify-between items-center gap-2"
    >
      <div className="space-y-2">
        <p className="text-lg">{quiz.quiz_name}</p>
        <p className="text-sm">{quiz.questions.length} Questions</p>
        {quiz.duration && (
          <p className="text-xs flex gap-1 items-center">
            <Clock size={16} />
            Time limit of {formattedTime}
          </p>
        )}
      </div>
      <Button asChild>
        <Link href={`/quiz/start/${quiz.id}`}>
          Start Quiz
          <ArrowRight2 />
        </Link>
      </Button>
    </div>
  );
}
