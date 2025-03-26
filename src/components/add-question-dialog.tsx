"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Add } from "iconsax-react";
import { useUser } from "@/components/providers/user-provider";
import { questionSchema } from "@/schema/schema";
import { useMutation } from "@tanstack/react-query";
import { addQuestion } from "@/actions/question.action";
import { cn } from "@/lib/utils";

const formSchema = questionSchema.pick({
  question_type: true,
  question_text: true,
  options: true,
  correct_answer: true,
});

interface AddQuestionDialogProps {
  className?: string;
  onSuccess?: () => void; // ✅ Pass this to refresh classes after adding
}

export default function AddQuestionDialog({
  className,
  onSuccess,
}: AddQuestionDialogProps) {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  // ✅ TanStack useMutation for handling question submission
  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      addQuestion(values, user?.id!),
    onSuccess: () => {
      toast.success("Question added successfully!");
      onSuccess?.();
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      console.error("Submission error:", error);
      toast.error(
        error.message || "Failed to submit the form. Please try again."
      );
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={cn(className, "")}>
          <Add size={42} />
          Add Question
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Questions</DialogTitle>
          <DialogDescription>
            Add a question and use it to create papers and quizzes.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Render Fields based on Question Type */}
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
                            placeholder="An amoeba is a single-celled organism..."
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
                            value={field.value as string[]}
                            onValueChange={field.onChange}
                            placeholder="Enter options"
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
                        <FormLabel>Correct Option</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={form.watch("options")?.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select correct option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {form
                              .watch("options")
                              ?.map((option: string, idx: number) => (
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
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => form.reset()}>
                  Clear
                </Button>
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
