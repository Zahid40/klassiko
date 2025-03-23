"use client";
import { useUser } from "@/context/UserContext";
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
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { useRouter, useSearchParams } from "next/navigation";
import UnifiedPagination from "@/features/app/components/unified-pagination";
import { Button } from "@/components/ui/button";
import { ClassType, QuestionType } from "@/types/type";

export default function CreateQuizPage() {
  const { user } = useUser();
  if (!user) return null;
  const [classList, setClassList] = useState<ClassType[]>([]);
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const formSchema = z.object({
    quiz_name: z.string().min(1, "Quiz name is required"),
    class_id: z.string().min(1, "Class is required"),
    scheduled_at: z.date().optional(),
    duration: z.number().min(1, "Duration must be at least 1 minute"),
    questions: z
      .array(z.string())
      .nonempty("Please select at least one question"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quiz_name: "",
      class_id: "",
      scheduled_at: new Date(),
      duration: 2,
      questions: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.from("quiz").insert([values]);
      if (error) throw error;
      toast.success("Quiz created successfully!");
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: classes, error: classError },
          { data: questions, error: questionError },
        ] = await Promise.all([
          supabase.from("class").select("*").eq("teacher_id", user.id),
          supabase
            .from("questions")
            .select("*")
            .eq("question_type", "multiple_choice"),
        ]);

        if (classError) throw classError;
        if (questionError) throw questionError;

        setClassList(classes || []);
        setQuestions(questions || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load classes or questions. Please try again.");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
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
            <div className="flex flex-wrap gap-4">
              <div className="flex-1">
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
                          {classList.map((item) => (
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

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormLabel className="text-nowrap">
                        Duration (Optional)
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder=""
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                          <span className="text-sm border rounded-md py-2 px-8 shadow text-primary-600">
                            Minutes
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduled_at"
                  render={({ field }) => (
                    <FormItem>
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

                {/* Questions Selection */}
                <FormField
                  control={form.control}
                  name="questions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Questions</FormLabel>
                      <FormControl>
                        <MultiSelector
                          values={field.value}
                          onValuesChange={field.onChange}
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Select questions" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {questions.map((q) => (
                                <MultiSelectorItem
                                  key={q.id}
                                  value={q.id.toString()}
                                >
                                  {q.question_text}
                                </MultiSelectorItem>
                              ))}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">Drag</div>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
