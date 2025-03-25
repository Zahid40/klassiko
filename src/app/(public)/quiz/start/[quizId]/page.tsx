"use client";
import { useUser } from "@/components/providers/user-provider";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Clock } from "iconsax-react";
import { useQuery } from "@tanstack/react-query";
import { fetchQuizWithQuestions } from "@/actions/quiz.action";
import { toast } from "sonner";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { formatRelative } from "date-fns";

export default function page({ params }: { params: { quizId: string } }) {
  const { user } = useUser();
  if (!user) return null;
  const { quizId } = params;

  const isStudent = user.role === "student";

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

  if (isLoading) return <p>Loading quiz...</p>;
  if (error) {
    toast.error("Failed to load quiz.");
    return <p>Error loading quiz</p>;
  }

  if (!quiz) return <p>Quiz not found</p>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const quizDuration = quiz.duration || 0; // Duration in seconds

  // Handle option selection
  const handleSelectOption = (option: string) => setSelectedOption(option);

  const calculateScore = (responses: any[], questions: any[]) => {
    let totalScore = 0;

    responses.forEach((response) => {
      const question = questions.find((q) => q.id === response.question_id);

      if (
        question &&
        response.selected_option &&
        response.selected_option.toLowerCase() ===
          question.correct_answer.toLowerCase()
      ) {
        totalScore += 1;
      }
    });

    return totalScore;
  };

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

  return (
    <section className="min-w-sm max-w-md mx-auto h-dvh min-h-dvh max-h-dvh p-6 flex flex-col gap-4 overflow-hidden relative">
      <h1 className="text-center text-xl font-medium bg-primary-500 rounded-sm p-4 text-background">
        Test Quiz 1
      </h1>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage src={user.profile_picture} alt={user.name} />
          <AvatarFallback className="rounded-lg bg-primary-100">
            {user.name ? user.name.slice(0, 1) : "U"}
          </AvatarFallback>
        </Avatar>
        <p className="truncate font-semibold text-sm">{user.name}</p>
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
        <div className="text-center">
          <h2 className="text-2xl font-bold">Quiz Completed!</h2>
          <p className="text-green-500 text-lg">Score: {finalScore}</p>
          <p className="text-gray-600">
            Attempted: {attempted} | Skipped: {skipped}
          </p>
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
          {formatRelative(new Date(quiz.updated_at), new Date())}
        </p>
      </div>
    </section>
  );
}
