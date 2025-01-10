import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface LogoProps {
  className?: string; // Optional className
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn("aspect-square size-12 relative", className)}>
      <Image
        src="/icon.svg" // Path to your SVG
        alt="Logo"
        fill
        style={{
          objectFit: "cover",
        }}
        priority // Optimized loading
      />
    </div>
  );
};

export default Logo;
