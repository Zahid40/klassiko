"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bell,
  BookOpen,
  Bot,
  Command,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  LifeBuoy,
  Map,
  MoreHorizontal,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Trash2,
} from "lucide-react";

import { ClassSwitcher } from "@/components/classSwitcher";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/components/providers/user-provider";
import ProfileDialog from "@/components/profile-dialog";
import { toast } from "sonner";
import { ClassType } from "@/features/class/types/class.type";
import Link from "next/link";

// This is sample data.
const data = {
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
    {
      title: "Notifications",
      url: "#",
      icon: Bell,
    },
  ],
  projects: [
    {
      name: "Class",
      url: "/dashboard/class",
      icon: Frame,
    },
    {
      name: "Quizzes",
      url: "/dashboard/quiz",
      icon: PieChart,
    },
    {
      name: "Papers",
      url: "/dashboard/paper",
      icon: Map,
    },
    {
      name: "Question",
      url: "/dashboard/question",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher role={user?.role} />
      </SidebarHeader>
      <SidebarContent>
        <ClassSwitcher />
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {data.projects.map((item, idx) => (
                <SidebarMenuItem key={item.name + idx}>
                  <SidebarMenuButton asChild size="sm">
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
        <ProfileDialog />
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
