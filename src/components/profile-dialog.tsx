"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircleQuestionIcon as QuestionMarkCircle,
  Mail,
  Lock,
  Calendar,
  Clock,
  Edit,
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { format, formatDistance, subDays } from "date-fns";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SidebarGroup, SidebarMenuButton } from "@/components/ui/sidebar";

export default function ProfileDialog() {
  const { user, logout } = useUser();
  if (!user) {
    return;
  }
  return (
    <SidebarGroup>
      <Dialog>
        <DialogTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.profile_picture} alt={user.name} />
              <AvatarFallback className="rounded-lg bg-primary-100 ">
                {user.name ? user.name.slice(0, 1) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[525px] aspect-square"
          aria-describedby={"Profile Dialog"}
        >
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <Link
              href="/help"
              className="text-sm text-muted-foreground flex items-center gap-2"
            >
              <QuestionMarkCircle className="h-4 w-4" />
              help
            </Link>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="size-44">
                <AvatarImage
                  src={user?.profile_picture}
                  alt="Profile picture"
                />
                <AvatarFallback>{user?.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <Button
                variant={"outline"}
                size={"sm"}
                className="absolute bottom-2 right-1  size-8 rounded-full "
              >
                <Edit size="32" />
              </Button>
            </div>

            <h2 className="text-2xl font-semibold tracking-wide">
              {user?.name}
            </h2>

            <div className="w-full space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">Email</span>
                </div>
                <span className="text-sm">{user?.email}</span>
              </div>

              {/* <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    password
                  </span>
                </div>
                <span className="text-sm">{user?.password}</span>
              </div> */}

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    Created At
                  </span>
                </div>
                <span className="text-sm">
                  {format(new Date(user?.created_at!), "dd MMM yyyy")}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col justify-between items-center w-full gap-6">
              <div className="flex flex-row gap-4 w-full">
                <Button
                  variant="default"
                  className="flex items-center gap-2 w-full"
                >
                  <Edit className="size-6" />
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={() => logout()}
                >
                  <LogOut className="size-6" />
                  Logout
                </Button>
              </div>

              <div className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
                <Clock className="size-3" />
                last updated{" "}
                {formatDistance(
                  subDays(new Date(user?.updated_at!), 0),
                  new Date(),
                  { addSuffix: true }
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarGroup>
  );
}
