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
import { createQuiz } from "@/actions/quiz.action";
import { formatDistance, subDays } from "date-fns";
import { TickCircle } from "iconsax-react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { quizSchema } from "@/schema/schema";

// Schema
const formSchema = quizSchema.pick({
  quiz_name: true,
  questions: true,
  class_id: true,
  duration: true,
  scheduled_at: true,
});

// Draggable Question Component
function DraggableQuestion({ question }: { question: QuestionType }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 border rounded-md text-sm flex flex-col gap-2 cursor-grab"
    >
      <p className="text-base">{question.question_text}</p>
      <div className="grid grid-cols-2 gap-2">
        {question.options?.map((option) => {
          const isCorrect =
            option.toLowerCase() === question.correct_answer.toLowerCase();
          return (
            <p
              key={option}
              className={cn(
                "text-xs flex gap-2 items-center",
                isCorrect ? "text-green-600" : "text-neutral-700"
              )}
            >
              {option}
              {isCorrect && <TickCircle size={14} />}
            </p>
          );
        })}
      </div>
      <p className="text-[9px] text-gray-500 mt-1">
        {formatDistance(subDays(new Date(question.created_at), 0), new Date(), {
          addSuffix: true,
        })}
      </p>
    </div>
  );
}

// Main Component
export default function CreateQuizPage() {
  const { user } = useUser();
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quiz_name: "",
      class_id: "",
      duration: 0,
      scheduled_at: undefined,
      questions: selectedQuestions,
    },
  });

  // Fetch classes
  const {
    data: classData,
    isLoading: classLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["classes", user?.id, user?.role],
    queryFn: () =>
      getClass({
        userId: user?.id!,
        role: user?.role!,
      }),
    enabled: !!user,
  });

  // Fetch questions
  const { data: questionData, isLoading: questionLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("question_type", "multiple_choice");
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      createQuiz(values, user?.id!),
    onSuccess: () => {
      toast.success("Question added successfully!");
      form.reset();
    },
    onError: (error: any) => {
      console.error("Submission error:", error);
      toast.error(
        error.message || "Failed to submit the form. Please try again."
      );
    },
  });

  useEffect(() => {
    form.setValue("questions", selectedQuestions);
  }, [selectedQuestions]);

  // Submit Handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log({ ...values, questions: selectedQuestions });
    mutate(values);
  };

  // Handle Drag End
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = selectedQuestions.indexOf(active.id as string);
      const newIndex = selectedQuestions.indexOf(over?.id as string);

      setSelectedQuestions((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  // Toggle Question Selection
  const toggleQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
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
            {/* Quiz Name */}
            <FormField
              control={form.control}
              name="quiz_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter quiz name"
                      {...field}
                      className="text-3xl border-none shadow-none focus-visible:ring-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {/* Selected Questions (Drag & Drop) */}
            <h2 className="text-lg font-semibold mb-2">Selected Questions</h2>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedQuestions}
                strategy={verticalListSortingStrategy}
              >
                {selectedQuestions.map((id) => {
                  const question = questionData?.find((q) => q.id === id);
                  return (
                    question && (
                      <DraggableQuestion key={id} question={question} />
                    )
                  );
                })}
              </SortableContext>
            </DndContext>

            {/* Submit Button */}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Create Quiz
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
              selectedQuestions.includes(question.id) ? "bg-green-100" : ""
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
