import AddQuestionDialog from "@/features/question/components/add-question-dialog";
import React from "react";

export default function PaperPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-center">Create Papers</h1>
      <div className="flex flex-row gap-6 justify-between items-center border rounded-lg p-8  ">
        <p className="text-base text-balance text-neutral-700">
          Add your Question and Reuse in any paper or quiz
        </p>
        <AddQuestionDialog />
      </div>
      <div>
        
      </div>
    </div>
  );
}
