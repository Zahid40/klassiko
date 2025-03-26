"use client";

import { ChevronsUpDown, Plus, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { useIsMobile } from "@/hooks/use-mobile";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/components/providers/user-provider";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";
import { ClassType } from "@/types/type";
import { getClass } from "@/actions/class.action";
import AddClassDialog from "./add-class-dilog";

export const ClassSwitcher = () => {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [activeClass, setActiveClass] = useState<ClassType | null>(null);

  // Fetch classes using react-query
  const {
    data: classes,
    isLoading,
    isError,
    error,
    refetch: refetchClasses,
  } = useQuery({
    queryKey: ["classes", user?.id, user?.role],
    queryFn: () =>
      getClass({
        userId: user?.id!,
        role: user?.role!,
      }),
    enabled: !!user,
  });

  // Update active class when classes are fetched
  useEffect(() => {
    if (classes?.data.length! > 0) {
      setActiveClass(classes?.data[0]!);
    }
  }, [classes]);

  // Set initial query parameters if missing
  useEffect(() => {
    if (!searchParams) return;
    const newParams = new URLSearchParams(searchParams.toString());

    if (!newParams.has("class") && activeClass?.id) {
      newParams.set("class", activeClass.id);
      router.replace(`?${newParams.toString()}`);
    }
  }, [router, searchParams, activeClass]);

  const setSearchParam = useCallback(
    (name: string, value: string) => {
      if (!searchParams) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (activeClass?.id) {
      setSearchParam("class", activeClass.id);
    }
  }, [activeClass, setSearchParam]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Classes</SidebarGroupLabel>
      {isLoading ? (
        <div className="p-2 flex flex-row gap-2 items-center justify-start">
          <Skeleton className="size-8 aspect-square rounded-full" />
          <Skeleton className="size-4 w-full" />
        </div>
      ) : isError ? (
        <p className="text-red-500 text-sm">Failed to load classes.</p>
      ) : activeClass ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Star className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeClass.class_name}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              classes
            </DropdownMenuLabel>
            {classes?.data.map((Class, index) => (
              <DropdownMenuItem
                key={Class.id}
                onClick={() => setActiveClass(Class)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Star className="size-4 shrink-0" />
                </div>
                {Class.class_name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            {user?.role !== "student" && (
             
                <AddClassDialog onSuccess={() => refetchClasses()} />
              
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
         {user?.role !== "student" && (
             
             <AddClassDialog onSuccess={() => refetchClasses()} />
           
         )}
        </>
      )}
    </SidebarGroup>
  );
};
