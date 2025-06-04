"use client";

import { useUser } from "@/components/providers/user-provider";
import { joinClass, getClass } from "@/actions/class.action";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Page({ params }: { params: { classId: string } }) {
  const { classId } = params;
  const { user } = useUser();
  const router = useRouter();

  // 🎯 Handle join class mutation
  const { mutate: handleJoinClass, isPending } = useMutation({
    mutationFn: () => joinClass(classId, user!.id),
    onSuccess: () => router.push(`/dashboard/class?class=${classId}`),
    onError: () => alert("Failed to join class. Please try again."),
  });

  // 🔒 Block non-students
  if (user && user.role !== "student") {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl font-semibold">You are not a student.</h1>
      </div>
    );
  }

  // 🎉 Render class join card
  return (
    <div className="h-screen flex justify-center items-center bg-primary-600">
      <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center flex-col gap-4">
        <h1 className="text-xl font-medium mb-2 text-center">
          Join class {classId}
        </h1>
        <Button
          onClick={() => handleJoinClass()}
          disabled={isPending}
          className=" px-4 py-2 "
        >
          {isPending ? "Joining..." : "Join Class"}
        </Button>
      </div>
    </div>
  );
}
