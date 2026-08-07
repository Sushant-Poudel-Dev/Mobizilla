"use client";

import { type InputHTMLAttributes } from "react";

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  placeholder?: string;
  shortcut?: string;
  className?: string;
}

export function SearchInput({
  placeholder = "Search",
  shortcut = "Ctrl + K",
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative w-full max-w-[320px] lg:max-w-[400px]", className)}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="search"
        placeholder={placeholder}
        className="w-full pl-10 pr-24 py-2 text-sm bg-white border border-slate-300 rounded-sm
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     placeholder:text-slate-600 transition-colors"
        {...props}
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-mono text-slate-600 bg-white border border-slate-300 rounded whitespace-nowrap">
        {shortcut}
      </kbd>
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}