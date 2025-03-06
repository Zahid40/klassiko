import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div>
      Home
      <Button asChild>
        <Link href={"/login"}>Login</Link>
      </Button>
      <Button asChild>
        <Link href={"/register"}>Register</Link>
      </Button>
    </div>
  );
}
