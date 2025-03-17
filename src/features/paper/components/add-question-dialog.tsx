"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TagsInput } from "@/components/ui/tags-input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Add } from "iconsax-react";
import supabase from "@/lib/db";
import { questionSchema } from "../schema/paper.schema";
import { useUser } from "@/context/UserContext";

const formSchema = questionSchema.pick({
  question_type: true,
  question_text: true,
  options: true,
  correct_answer: true,
});

export default function AddQuestionDialog() {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question_type: "",
      question_text: "",
      options: [],
      correct_answer: "",
    },
  });

  const questionType = form.watch("question_type");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const parsedSchema = questionSchema.pick({
        question_type: true,
        question_text: true,
        options: true,
        correct_answer: true,
        teacher_id: true,
      });
      const payload: z.infer<typeof parsedSchema> = {
        ...values,
        teacher_id: user?.id!,
      };

      const parsed = parsedSchema.safeParse(payload);

      if (!parsed.success) {
        console.error("Validation failed", parsed.error);
        toast.error("Invalid form data. Please check your inputs.");
        return;
      }

      const { data, error } = await supabase
        .from("questions")
        .insert([parsed.data])
        .select();

      if (error) throw error;

      toast.success("Question added successfully!");
      console.log("Inserted data:", data);
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
      <DialogTrigger asChild>
        <Button>
          <Add size={42} />
          Add Question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Questions</DialogTitle>
          <DialogDescription>
            Add a question and use them to create papers and quizzes.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Question Type Field */}
              <FormField
                control={form.control}
                name="question_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="multiple_choice">
                          Multiple Choice
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose your question type</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditionally Render Fields based on Question Type */}
              {questionType === "general" && (
                <>
                  <FormField
                    control={form.control}
                    name="question_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What is an amoeba?"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="correct_answer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correct Answer</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="An amoeba is a single-celled organism that has no fixed shape and moves using pseudopodia."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {questionType === "multiple_choice" && (
                <>
                  <FormField
                    control={form.control}
                    name="question_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What is the capital of France?"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options</FormLabel>
                        <FormControl>
                          <TagsInput
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Enter your options"
                          />
                        </FormControl>
                        <FormDescription>Add multiple options</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="correct_answer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correct Option</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={form.watch("options").length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select correct option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {form
                              .watch("options")
                              .map((option: string, idx: number) => (
                                <SelectItem key={idx} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <div className="flex flex-row gap-4">
                <Button variant="outline" onClick={() => form.reset()}>
                  Clear
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
