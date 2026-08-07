"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { Avatar } from "../primitives/Avatar";
import { Button } from "../primitives/Button";

interface UserMenuProps {
  name: string;
  email: string;
  role: string;
}

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  front_desk: "Front Desk",
  technician: "Technician",
  staff: "Staff",
};

export function UserMenu({ name, email, role }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    setMounted(true);
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () => document.removeEventListener("mousedown", handleClickOutside as EventListener);
  }, []);

  useEffect(() => {
    if (!triggerRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    
    setDropdownStyle({
      top: triggerRect.bottom + scrollY + 4,
      right: window.innerWidth - (triggerRect.right + scrollX),
    });
  }, [open]);

  const handleSignOut = () => {
    const form = document.createElement("form");
    form.action = "/api/auth/signout";
    form.method = "POST";
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="relative inline-block" ref={triggerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-bg-hover transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Avatar name={name} size="md" />
      </button>
      {open && mounted && triggerRef.current && (
        <div
          ref={dropdownRef}
          className="fixed z-50 right-0 min-w-[220px] bg-bg-elevated border border-border rounded-lg shadow-card-hover py-2 animate-fade-in"
          style={dropdownStyle}
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-fg">{name}</p>
            <p className="text-xs text-fg-secondary truncate">{email}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1.5 bg-accent-light text-accent">
              {roleLabels[role] ?? role}
            </span>
          </div>
          <div className="py-1">
            <button
              onClick={() => { window.location.href = "/dashboard/profile"; setOpen(false); }}
              className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 text-fg hover:bg-bg-hover transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Profile
            </button>
            <button
              onClick={() => { window.location.href = "/dashboard/settings"; setOpen(false); }}
              className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 text-fg hover:bg-bg-hover transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <hr className="my-1 border-border" />
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 text-error hover:bg-error-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}