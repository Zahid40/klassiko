"use client";

import * as React from "react";
import {
  Bell,
  FlaskConical,
  Frame,
  LibraryBig,
  LifeBuoy,
  Map,
  PieChart,
  ScrollText,
  Send,
  Shapes,
} from "lucide-react";

import { ClassSwitcher } from "@/components/classSwitcher";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useUser } from "@/components/providers/user-provider";
import ProfileDialog from "@/components/profile-dialog";
import Link from "next/link";
import { Home } from "iconsax-react";

// This is sample data.
const data = {
  projects: [
    {
      name: "Home",
      url: "/dashboard",
      icon: Home,
    },
    {
      name: "Class",
      url: "/dashboard/class",
      icon: Shapes,
    },
    {
      name: "Quizzes",
      url: "/dashboard/quiz",
      icon: FlaskConical,
    },
    {
      name: "Papers",
      url: "/dashboard/paper",
      icon: ScrollText,
    },
    {
      name: "Question",
      url: "/dashboard/question",
      icon: LibraryBig,
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
