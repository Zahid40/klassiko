"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
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
import { Plus } from "lucide-react";

// ✅ Import your createClass API function
import { createClass } from "@/actions/class.action";
import { useUser } from "./providers/user-provider";

const formSchema = z.object({
  class_name: z.string().min(3, "Class name must be at least 3 characters."),
  description: z.string().min(3, "Description must be at least 3 characters."),
});

interface AddClassDialogProps {
  className?: string;
  onSuccess?: () => void; // ✅ Pass this to refresh classes after adding
}

export default function AddClassDialog({
  className,
  onSuccess,
}: AddClassDialogProps) {
  const { user } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class_name: "",
      description: "",
    },
  });

  // ✅ Setup mutation for class creation
  const { mutate: createNewClass, isPending } = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      toast.success("Class created successfully!");
      form.reset(); // Reset form after success
      onSuccess?.(); // ✅ Trigger the parent refresh function
    },
    onError: (error) => {
      console.error("Error creating class:", error);
      toast.error("Failed to create class. Please try again.");
    },
  });

  // ✅ Form submission handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createNewClass({ ...values, teacher_id: user?.id! });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
      <DialogTrigger asChild >
        <Button
          variant="secondary"
          className={cn(className, "w-full justify-start")}
          size="lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
            <Plus className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">Add Class</div>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Class</DialogTitle>
          <DialogDescription>
            You can create a class, and students can join the class.
          </DialogDescription>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 py-10"
            >
              {/* Class Name Field */}
              <FormField
                control={form.control}
                name="class_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Science XI (Evening)"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="You can learn everything with us"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Add Class"}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
