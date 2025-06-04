"use client"
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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import Logo from "../../../components/Logo";
import { useUser } from "@/components/providers/user-provider";

// Improved schema with additional validation rules
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[a-zA-Z0-9]/, { message: "Password must be alphanumeric" }),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login } = useUser();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login(values.email, values.password);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please try again.");
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center  p-6 md:p-10">
      <div className="w-full max-w-sm  flex flex-col  justify-center items-stretch gap-4">
        <div className={"flex flex-col gap-6 relative"}>
          <Card className="overflow-hidden rounded-xl">
            <CardContent className="grid p-0 md:grid-cols-1">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-12 py-12 px-6"
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <Logo className="size-16 absolute -top-8" />
                    <h1 className="text-lg ">Welcome back</h1>
                    <p className="text-muted-foreground text-xs ">
                      Login to your Klassiko account
                    </p>
                  </div>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="grid gap-1">
                          <FormLabel htmlFor="email">Email</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              placeholder="johndoe@mail.com"
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
                            {/* <Link
                              href="#"
                              className="ml-auto inline-block text-sm underline"
                            >
                              Forgot your password?
                            </Link> */}
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

                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                    <div className="mt-4 text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <Link href="/register" className="underline">
                        Register here
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>

             
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            By clicking continue, you agree to our{" "}
            <a href="/terms">Terms of Service</a> and{" "}
            <a href="/policy">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
