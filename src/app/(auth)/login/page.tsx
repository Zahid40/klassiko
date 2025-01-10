import Logo from "@/components/Logo";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center  p-6 md:p-10">
      <div className="w-full max-w-sm  flex flex-col  justify-center items-stretch gap-4">
        <LoginForm />
      </div>
    </div>
  );
}
