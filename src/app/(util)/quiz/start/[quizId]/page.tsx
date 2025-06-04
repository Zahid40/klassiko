"use client";
import { useUser } from "@/components/providers/user-provider";
import React, { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Clock, TickCircle } from "iconsax-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createQuizPerformance,
  fetchQuizWithQuestions,
} from "@/actions/quiz.action";
import { toast } from "sonner";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { formatDistance, formatRelative, subDays } from "date-fns";
import { QuestionType } from "@/types/type";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { quizId: string } }) {
  const { user } = useUser();
  // if (!user) return null;
  const { quizId } = params;
  const router = useRouter();

  const isStudent = user?.role === "student";

  const {
    data: quiz,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => fetchQuizWithQuestions(quizId),
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<
    { question_id: string; selected_option: string | null }[]
  >([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Mutation setup for submitting quiz
  const { mutate } = useMutation({
    mutationFn: createQuizPerformance,
    onSuccess: () => {
      toast.success("Quiz submitted successfully!");
      router.replace("/dashboard/class");
    },
    onError: (error) => {
      toast.error(`Failed to submit quiz: ${error.message}`);
    },
  });

  // Calculate score
  const calculateScore = useCallback((responses: any[], questions: any[]) => {
    return responses.reduce((score, response) => {
      const question = questions.find((q) => q.id === response.question_id);
      return question &&
        response.selected_option &&
        response.selected_option.toLowerCase() ===
          question.correct_answer.toLowerCase()
        ? score + 1
        : score;
    }, 0);
  }, []);

  // Handle submitting the quiz
  const handleSubmitQuiz = useCallback(
    (finalScore: number) => {
      if (isStudent) {
        mutate({ quiz_id: quizId, student_id: user.id, score: finalScore });
      } else {
        toast.success("Quiz completed!");
        router.replace("/dashboard/class");
      }
    },
    [isStudent, quizId, user?.id, mutate, router]
  );

  // Handle option selection
  const handleSelectOption = (option: string) => setSelectedOption(option);

  // Handle "Next" button click
  const handleNext = () => {
    if (selectedOption !== null) {
      const updatedResponses = [
        ...responses,
        { question_id: currentQuestion.id, selected_option: selectedOption },
      ];
      setResponses(updatedResponses);
      setSelectedOption(null);

      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        const score = calculateScore(updatedResponses, quiz.questions);
        setFinalScore(score);
        setShowResults(true);
        handleSubmitQuiz(score);
        toast.success(`Quiz submitted! Your score: ${score}`);
      }
    } else {
      toast.error("Please select an option before proceeding.");
    }
  };

  // Handle "Skip" button click
  const handleSkip = () => {
    const updatedResponses = [
      ...responses,
      { question_id: currentQuestion.id, selected_option: null },
    ];
    setResponses(updatedResponses);
    setSelectedOption(null);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const score = calculateScore(updatedResponses, quiz.questions);
      setFinalScore(score);
      setShowResults(true);
      handleSubmitQuiz(score);

      toast.success(`Quiz submitted! Your score: ${score}`);
    }
  };

  // Handle quiz timeout (auto-skip remaining questions)
  const handleTimeout = () => {
    const remainingQuestions = quiz.questions
      .slice(currentQuestionIndex)
      .map((q: any) => ({ question_id: q.id, selected_option: null }));
    const updatedResponses = [...responses, ...remainingQuestions];

    setResponses(updatedResponses);
    const score = calculateScore(updatedResponses, quiz.questions);
    setFinalScore(score);
    setShowResults(true);
    handleSubmitQuiz(score);

    toast.warning("Time's up! Unanswered questions were skipped.");
  };

  // Count attempted and skipped questions
  const attempted = responses.filter((r) => r.selected_option !== null).length;
  const skipped = responses.length - attempted;

  // Format time in HH:MM:SS
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours > 0 ? `${hours}:` : ""}${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (isLoading) return <p>Loading quiz...</p>;
  if (error) {
    toast.error("Failed to load quiz.");
    return <p>Error loading quiz</p>;
  }

  if (!quiz) return <p>Quiz not found</p>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const quizDuration = quiz.duration || 0; // Duration in seconds

  return (
    <section className="min-w-sm max-w-md mx-auto h-dvh min-h-dvh max-h-dvh p-6 flex flex-col gap-4 overflow-hidden relative">
      <h1 className="text-center text-xl font-medium bg-primary-500 rounded-sm p-4 text-background">
        Test Quiz 1
      </h1>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={user?.profile_picture} alt={user?.name} />
          <AvatarFallback className="rounded-lg bg-primary-100">
            {user?.name ? user.name.slice(0, 1) : "U"}
          </AvatarFallback>
        </Avatar>
        <p className="truncate font-semibold text-sm">{user?.name}</p>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          className="rounded-full aspect-square p-0"
          variant="outline"
          size="icon"
        >
          <X size={14} />
        </Button>
        <div className="flex gap-4 w-full flex-1 items-center border rounded-3xl py-2 px-4">
          <Progress
            className="flex-1"
            value={((currentQuestionIndex + 1) / quiz.questions.length) * 100}
          />
          <span className="text-sm">
            {currentQuestionIndex + 1}/{quiz.questions.length}
          </span>
        </div>
      </div>

      {/* Results Section */}
      {showResults ? (
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Quiz Completed!</h2>
          <p className="text-green-500 text-lg">Score: {finalScore}</p>
          <p className="text-neutral-600">
            Attempted: {attempted} | Skipped: {skipped}
          </p>

          <div className="space-y-2">
            {quiz.questions.map((question: QuestionType) => (
              <div
                key={question.id}
                className="p-4 border rounded-md text-sm relative flex flex-col gap-2"
              >
                {/* Question Text */}
                <p className="text-base ">{question.question_text}</p>

                {/* Options / Answer */}
                {question.options?.length ? (
                  <div className="grid grid-cols-2 gap-2">
                    {question.options.map((option) => {
                      const isCorrect =
                        option.toLowerCase() ===
                        question.correct_answer.toLowerCase();

                      const isUserSelectionCorrect =
                        responses
                          .find((quesId) => quesId.question_id === question.id)
                          ?.selected_option?.toLowerCase() ===
                        option.toLowerCase();
                      return (
                        <p
                          key={option + "_ans"}
                          className={cn(
                            "text-xs flex gap-2 items-center",
                            isUserSelectionCorrect
                              ? isCorrect
                                ? "text-green-600"
                                : "text-red-500"
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
        </div>
      ) : (
        <div className="pt-8 space-y-6">
          <div className="bg-primary-50/20 rounded-sm py-8 px-4 border-2 relative">
            {quizDuration > 0 && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm border-2 bg-background rounded-full p-2 aspect-square flex justify-center items-center">
                <CountdownCircleTimer
                  isPlaying
                  duration={quizDuration}
                  colors={["#4caf50", "#F7B801", "#A30000"]}
                  colorsTime={[quizDuration, quizDuration / 2, 0]}
                  size={40}
                  strokeWidth={4}
                  onComplete={handleTimeout}
                >
                  {({ remainingTime }) => (
                    <span className="text-xs font-semibold">
                      {formatTime(remainingTime)}
                    </span>
                  )}
                </CountdownCircleTimer>
              </div>
            )}
            <h4 className="text-md text-center text-balance">
              {currentQuestion.question_text}
            </h4>
          </div>

          {/* Options Section */}
          <div className="w-full space-y-4">
            {currentQuestion.options.map((option: string, index: number) => (
              <Button
                key={index}
                className={`w-full shadow-none py-8 ${
                  selectedOption === option
                    ? "bg-neutral-800 hover:bg-neutral-700 text-white"
                    : "bg-transparent hover:bg-neutral-100"
                }`}
                size="lg"
                variant="outline"
                onClick={() => handleSelectOption(option)}
              >
                <p className="text-center text-balance">{option}</p>
              </Button>
            ))}
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              size="lg"
              variant="default"
              onClick={handleNext}
              disabled={!selectedOption}
            >
              <p>
                {currentQuestionIndex === quiz.questions.length - 1
                  ? "Submit"
                  : "Next"}
              </p>
            </Button>
            <Button
              className="w-full"
              size="lg"
              variant="secondary"
              onClick={handleSkip}
            >
              <p>Skip</p>
            </Button>
          </div>
        </div>
      )}

      <div className="absolute bottom-2 flex flex-col justify-center items-center">
        <p className="text-xs font-medium text-neutral-500">
          Quiz Id: {params.quizId}
        </p>
        <p className="text-xs font-medium text-neutral-500 text-center flex items-center justify-center gap-1">
          <Clock size={16} />
          Last updated at :{" "}
          {formatDistance(subDays(new Date(quiz.updated_at), 0), new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>
    </section>
  );
}
