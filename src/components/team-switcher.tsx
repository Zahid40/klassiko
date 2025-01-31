"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "./Logo";

export function TeamSwitcher(props: {
  role: "admin" | "teacher" | "student" | undefined;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Logo className="size-8" />

          <div className="grid flex-1 text-left text-sm leading-tight">
            <p className="truncate font-semibold text-base">Klassiko</p>
            <span className="truncate text-xs capitalize">{props.role}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
