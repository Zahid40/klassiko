import Logo from "@/components/Logo";
import { SignUpForm } from "@/features/auth/components/signup-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center  p-6 md:p-10">
      <div className="w-full max-w-sm  flex flex-col  justify-center items-stretch gap-4">
        <SignUpForm />
      </div>
    </div>
  );
}
