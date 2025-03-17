"use client";
import { useUser } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClassType } from "../types/class.type";
import { ApiResponseType } from "@/features/app/types/app.type";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Class() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const class_id = searchParams.get("class");
  const [classes, setClasses] = useState<ClassType>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchClasses = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/class?user_id=${user.id}&class_id=${class_id}&role=${user.role}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result: ApiResponseType = await response.json();
          if (result.success) {
            console.log(result.data);

            setClasses(result.data[0]);
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.error("Error while fetching classes:", error);
          toast.error("Failed to fetch classes. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchClasses();
    }
  }, [class_id]);

  if (isLoading) {
    return <>Loading....</>;
  }

  if (!classes) {
    return <>No Class Found</>;
  }

  return (
    <div className="flex flex-col gap-6 items-center  h-full">
      {/* <Avatar className="size-12 ">
        <AvatarFallback className="bg-primary-500 text-background text-2xl font-bold capitalize">
          {classes.class_name.slice(0, 1)}
        </AvatarFallback>
      </Avatar> */}
      <div>
        <h1 className="text-2xl text-nowrap">{classes.class_name}</h1>

        <Separator className="w-full" />
        <Button>add question</Button>
      </div>
    </div>
  );
}
