"use client";

import { ChevronsUpDown, Plus, Star, type LucideIcon } from "lucide-react";

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
import { useState } from "react";
import { ClassType } from "@/features/class/types/class.type";
import { useUser } from "@/context/UserContext";
import React from "react";
import { toast } from "sonner";
import { ApiResponseType } from "@/features/appState/types/app.type";
import { Skeleton } from "./ui/skeleton";

export const ClassSwitcher = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const [classes, setClasses] = React.useState<ClassType[]>([]);

  React.useEffect(() => {
    if (user) {
      const fetchClasses = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/class?user_id=${user.id}&role=${user.role}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const result: ApiResponseType = await response.json();
          if (result.success && result.data.length > 0) {
            setClasses(result.data);
            setActiveClass(result.data[0]);
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
  }, [user?.id]);

  const isMobile = useIsMobile();
  const [activeClass, setActiveClass] = useState(classes[0]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Classes</SidebarGroupLabel>
      {activeClass ? (
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
            {classes.map((Class, index) => (
              <DropdownMenuItem
                key={Class.class_name}
                onClick={() => setActiveClass(Class)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Star className="size-4 shrink-0" />
                </div>
                {Class.class_name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add Class</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="p-2 flex flex-row gap-2 items-center justify-start">
          <Skeleton className="size-8 aspect-square rounded-full" />
          <Skeleton className="size-4 w-full" />
        </div>
      )}
    </SidebarGroup>
  );
};
