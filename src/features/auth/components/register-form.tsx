"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import Logo from "../../../components/Logo";
import { useRouter } from "next/navigation";

type Role = "Student" | "Teacher";

interface RoleSelectorProps {
  onRoleChange: (role: Role) => void;
}

// Improved schema with additional validation rules
const formSchema = z
  .object({
    role: z.enum(["student", "teacher"], {
      required_error: "You need to select a role.",
    }),
    name: z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
    confirmPassword: z
      .string()
      .min(6, {
        message: "Confirm Password must be at least 6 characters long",
      })
      .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // Set the path for error messages
    message: "Passwords do not match",
  });

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: undefined,
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login"); // Redirect to login page
        }, 1500);
      } else {
        toast.error(result.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 relative", className)} {...props}>
      <Card className="overflow-hidden rounded-xl">
        <CardContent className="grid p-0 md:grid-cols-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-12 py-12 px-6"
            >
              <div className="flex flex-col items-center text-center gap-2">
                <Logo className="size-16 absolute -top-8" />
                <h1 className="text-lg ">Welcome to Klassiko</h1>
                <p className="text-muted-foreground text-xs ">
                  Create your Klassiko account
                </p>
              </div>
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="grid gap-1">
                      <FormLabel>Select your role</FormLabel>
                      <FormControl>
                        <div className="flex flex-col sm:flex-row gap-4 grow w-full">
                          <Button
                            type="button"
                            onClick={() => field.onChange("student")}
                            className={`w-full  px-8 py-3 text-sm  `}
                            variant={
                              field.value !== "student" ? "outline" : "default"
                            }
                            aria-pressed={field.value === "student"}
                          >
                            Student
                          </Button>
                          <Button
                            type="button"
                            onClick={() => field.onChange("teacher")}
                            className={`w-full  px-8 py-3 text-sm `}
                            variant={
                              field.value !== "teacher" ? "outline" : "default"
                            }
                            aria-pressed={field.value === "teacher"}
                          >
                            Teacher
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid gap-1">
                      <FormLabel htmlFor="email">Name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Zahid"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-1">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="zahid@gmail.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-1">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password">Password</FormLabel>
                      </div>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-1">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FormLabel>
                      </div>
                      <FormControl>
                        <PasswordInput
                          id="confirmPassword"
                          placeholder="******"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="underline">
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </Form>

          {/* <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div> */}
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our{" "}
        <a href="/terms">Terms of Service</a> and{" "}
        <a href="/policy">Privacy Policy</a>.
      </div>
    </div>
  );
}
