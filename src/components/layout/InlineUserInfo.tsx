"use client";

import { Avatar } from "../primitives/Avatar";
import { useState, useEffect } from "react";

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  front_desk: "Front Desk",
  technician: "Technician",
  staff: "Staff",
};

const notificationIcon = (
  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 17.128v-.003c0-1.113-.285-2.16-.786-3.07M15 17.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const themeIcon = (
  <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.756 9.756 0 003 11.25C3 16.635 7.365 21 12.75 21a9.756 9.756 0 009.002-5.998z" />
  </svg>
);

const verticalLine = (
  <div className="w-px h-8 bg-slate-200 mx-2" aria-hidden="true" />
);

export interface InlineUserInfoProps {
  name: string;
  role: string;
  size?: "sm" | "md";
}

export function InlineUserInfo({ name, role, size = "md" }: InlineUserInfoProps) {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);
  
  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle theme"
        >
          {themeIcon}
        </button>
        {verticalLine}
        {notificationIcon}
        {verticalLine}
        <Avatar name={name} size={size} />
      </div>
      <div className="text-left hidden sm:block">
        <p className="text-sm font-medium text-slate-900 truncate max-w-[160px]">{name}</p>
        <p className="text-xs text-slate-500">{roleLabels[role] ?? role}</p>
      </div>
    </div>
  );
}