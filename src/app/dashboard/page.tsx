"use client";
import { getClass } from "@/actions/class.action";
import CopyButton from "@/components/CopyButton";
import { useUser } from "@/components/providers/user-provider";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistance, subDays } from "date-fns";
import { Clock } from "iconsax-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const classId = searchParams.get("class")!;

  // Fetch Class Data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["class", user?.id, user?.role],
    queryFn: () =>
      getClass({
        userId: user?.id!,
        role: user?.role!,
      }),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const classes = data?.data;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full border rounded-xl p-8 flex flex-row gap-6 items-end">
        <Image
          src={"/image/robot.svg"}
          alt="welcometoklassiko"
          height={160}
          width={160}
        />
        <div>
          <h1 className="text-2xl">Hi , {user?.name}</h1>
          <p>Welcome to Klassiko !</p>
        </div>
      </div>

      <div className="w-full ">
        <h2 className="text-lg font-semibold mb-2">Classes</h2>

        {/* Show loading if quizzes are still fetching */}
        {isLoading && (
          <p className="text-center text-gray-500">Loading classes ...</p>
        )}

        {/* Render quizzes */}
        {classes?.length ? (
          classes.map((c) => {
            const isClassActive = c.id === classId;
            return (
              <div
                className="border  p-6 rounded-xl flex flex-row relative"
                key={c.id}
              >
                {isClassActive && (
                  <Badge className="bg-green-600 absolute top-2 right-2 font-medium gap-1">
                    <div className="size-2 rounded-full bg-green-300 shadow-2xl shadow-green-300 animate-pulse"></div>
                    Active
                  </Badge>
                )}
                <div className=" absolute bottom-2 right-2 font-medium gap-1">
                  <p className="text-xs font-medium text-neutral-500 text-center flex items-center justify-center gap-1">
                    <Clock size={16} />
                    Last updated at :{" "}
                    {formatDistance(
                      subDays(new Date(c.updated_at), 0),
                      new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl">{c.class_name}</h3>
                  <p className="text-xs">{c.description}</p>
                  <div className="flex gap-2 items-center text-sm">
                    Class id : <CopyButton text={c.id} />{" "}
                  </div>
                  <p className="text-sm">
                    Created At :{" "}
                    {format(new Date(c.created_at), "dd MMMM yyyy")}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">No classes available yet.</p>
        )}
      </div>
    </div>
  );
}
