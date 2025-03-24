"use client";

import { useUser } from "@/components/providers/user-provider";
import supabase from "@/lib/db";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input";
import { Button } from "@/components/ui/button";
import { ClassType, QuestionType } from "@/types/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getClass } from "@/actions/class.action";
import { formatDistance, subDays } from "date-fns";
import { TickCircle } from "iconsax-react";
import { cn } from "@/lib/utils";
import { paperSchema } from "@/schema/schema";
import { Badge } from "@/components/ui/badge";
import { Asterisk, SquareStack } from "lucide-react";
import { createPaper } from "@/actions/paper.action";
import { useRouter } from "next/navigation";

// Paper form schema
const formSchema = paperSchema.pick({
  title: true,
  questions: true,
  class_id: true,
  duration: true,
  scheduled_at: true,
});

// Draggable Question Component with Marks Input
function DraggableQuestion({
  question,
  marks,
  setMarks,
}: {
  question: QuestionType;
  marks: number;
  setMarks: (id: string, value: number) => void;
}) {
  return (
    <div className="p-4 border rounded-md flex flex-col gap-2 relative">
      {/* Time since creation */}
      <p className="text-[9px] absolute bottom-2 right-2">
        {formatDistance(subDays(new Date(question.created_at), 0), new Date(), {
          addSuffix: true,
        })}
      </p>

      {/* Question Text */}
      <p className="text-base ">{question.question_text}</p>

      {/* Options / Answer */}
      {question.options?.length ? (
        <div className="grid grid-cols-2 gap-2">
          {question.options.map((option) => {
            const isCorrect =
              option.toLowerCase() === question.correct_answer.toLowerCase();
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

      {/* Marks Input */}
      <div className="flex gap-2 items-center">
        <p className="text-sm">Marks</p>
        <Input
          type="number"
          value={marks}
          onChange={(e) => setMarks(question.id, Number(e.target.value))}
          className="w-20 text-sm"
          placeholder="Marks"
        />
      </div>

      {/* Time since creation */}
      <p className="text-[9px] font-normal absolute bottom-2 right-2">
        {formatDistance(subDays(new Date(question.created_at), 0), new Date(), {
          addSuffix: true,
        })}
      </p>
    </div>
  );
}

// Main Paper Creation Component
export default function CreatePaperPage() {
  const { user } = useUser();
  if (!user) return null;
  const router = useRouter();
  const [selectedQuestions, setSelectedQuestions] = useState<
    { id: string; marks: number }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      class_id: "",
      duration: 0,
      scheduled_at: undefined,
      questions: selectedQuestions,
    },
  });

  // Fetch Classes
  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["classes", user.id],
    queryFn: () => getClass(user.id),
  });

  // Fetch Questions
  const { data: questionData, isLoading: questionLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("questions").select("*");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  // Mutation for creating paper
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      createPaper(values, user?.id!),
    onSuccess: () => {
      toast.success("Paper created successfully!");
      form.reset();
      router.replace(`/dashboard/paper`);
    },
    onError: (error: any) => {
      console.error("Submission error:", error);
      toast.error(
        error.message || "Failed to create the paper. Please try again."
      );
    },
  });

  useEffect(() => {
    form.setValue("questions", selectedQuestions);
  }, [selectedQuestions]);

  // Submit Handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({ ...values, questions: selectedQuestions });
  };

  // Toggle Question Selection with default marks
  const toggleQuestion = (id: string) => {
    setSelectedQuestions((prev) => {
      const existing = prev.find((q) => q.id === id);
      return existing
        ? prev.filter((q) => q.id !== id)
        : [...prev, { id, marks: 1 }];
    });
  };

  // Update Marks for a selected question
  const setMarks = (id: string, value: number) => {
    setSelectedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, marks: value } : q))
    );
  };

  if (classLoading || questionLoading) return <p>Loading...</p>;

  return (
    <section className="flex flex-wrap gap-4">
      <div className="flex-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) =>
              console.log("Form Errors:", errors)
            )}
            className="space-y-6 py-6"
          >
            {/* Paper Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter paper title"
                      {...field}
                      className="text-3xl border-none shadow-none focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p className="text-sm">
                Total Marks :{" "}
                {selectedQuestions.reduce((acc, curr) => acc + curr.marks, 0)}
              </p>
            </div>

            {/* Class Selection */}
            <FormField
              control={form.control}
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classData?.data.map((item: ClassType) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.class_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Minutes"
                        value={field.value} // Ensure the value syncs properly
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsedValue = value === "" ? "" : Number(value);

                          // Only update if it's a valid number or empty string
                          if (
                            parsedValue === "" ||
                            (!isNaN(parsedValue) && parsedValue >= 1)
                          ) {
                            field.onChange(parsedValue);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduled_at"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Schedule ( Optional )</FormLabel>
                    <FormControl>
                      <SmartDatetimeInput
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="e.g. Tomorrow morning 9am"
                        hour12
                      />
                    </FormControl>
                    <FormDescription>
                      Please select the full time
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Questions Section */}
            <h2 className="text-lg font-semibold mb-2">Selected Questions</h2>
            {selectedQuestions.map(({ id, marks }) => {
              const question = questionData?.find((q) => q.id === id);
              return (
                question && (
                  <DraggableQuestion
                    key={id}
                    question={question}
                    marks={marks}
                    setMarks={setMarks}
                  />
                )
              );
            })}

            {/* Submit Button */}
            <Button type="submit" disabled={isPending}>
              Create Paper
            </Button>
          </form>
        </Form>
      </div>

      {/* Question List */}
      <div className="flex-1 space-y-2">
        {questionData?.map((question: QuestionType) => (
          <div
            key={question.id}
            className={`p-4 border rounded-md cursor-pointer ${
              selectedQuestions.some((q) => q.id === question.id)
                ? "bg-green-100"
                : ""
            }`}
            onClick={() => toggleQuestion(question.id)}
          >
            {question.question_text}
          </div>
        ))}
      </div>
    </section>
  );
}
