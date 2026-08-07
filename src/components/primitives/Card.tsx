"use client";

import { type HTMLAttributes, type ReactNode } from "react";

export type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
  hover?: boolean;
  border?: boolean;
  children: ReactNode;
}

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ padding = "md", hover = false, border = true, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`
        bg-bg-elevated rounded-lg
        ${border ? "border border-border" : ""}
        ${paddingClasses[padding]}
        ${hover ? "transition-all duration-200 hover:shadow-card-hover hover:border-border-bright" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`flex items-center justify-between mb-4 pb-4 border-b border-border ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children }: { className?: string; children: ReactNode }) {
  return <h2 className={`text-lg font-semibold text-fg ${className}`}>{children}</h2>;
}

export function CardDescription({ className = "", children }: { className?: string; children: ReactNode }) {
  return <p className={`text-sm text-fg-secondary mt-0.5 ${className}`}>{children}</p>;
}

export function CardContent({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`flex items-center gap-3 mt-4 pt-4 border-t border-border ${className}`}>
      {children}
    </div>
  );
}

export type { CardProps };