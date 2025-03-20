import { Button } from "@/components/ui/button";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function QuizPage() {
  return (
    <div className="flex flex-col gap-4">
      QuizPage
      <CreateQuizDialog />
    </div>
  );
}

function CreateQuizDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Quiz</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create your Quiz</DialogTitle>
          <DialogDescription>
            These quiz will be used to test your student's knowledge
          </DialogDescription>
          
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
