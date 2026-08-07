"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

export interface DropdownItem {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  className = "",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside as EventListener);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener,
      );
  }, []);

  const triggerRect = triggerRef.current?.getBoundingClientRect();
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  return (
    <div
      className='relative inline-block'
      ref={triggerRef}
    >
      <div
        onClick={() => setOpen(!open)}
        className='cursor-pointer'
      >
        {trigger}
      </div>
      {open && triggerRect && (
        <div
          ref={dropdownRef}
          className={`
            fixed z-50 min-w-45 bg-bg-elevated border border-border rounded-lg shadow-card-hover
            py-1 animate-fade-in
            ${align === "right" ? "right-0" : "left-0"}
          `}
          style={{
            top: triggerRect.bottom + scrollY + 4,
            left: align === "left" ? triggerRect.left + scrollX : undefined,
            right:
              align === "right"
                ? window.innerWidth - (triggerRect.right + scrollX)
                : undefined,
          }}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
              disabled={item.disabled}
              className={`
                w-full px-4 py-2 text-sm text-left flex items-center gap-2
                transition-colors
                ${item.danger ? "text-error hover:bg-error-light" : "text-fg hover:bg-bg-hover"}
                ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {item.icon && (
                <span className='w-4 h-4 shrink-0'>{item.icon}</span>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
