import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import Logo from "./Logo";

export default function Navbar() {
  const links = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#benefits", label: "Benefits" },
    { href: "#demo", label: "Demo" },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={'/'} className="flex items-center space-x-2">
          <Logo className="size-10" />
          <span className="text-xl font-semibold text-neutral-900">
            Klassiko
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-primary-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>

          <Button size="sm" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
