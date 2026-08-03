"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode, type ComponentPropsWithoutRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover focus:ring-accent",
  secondary: "bg-bg-elevated text-fg border border-border hover:bg-bg-hover hover:border-border-bright focus:ring-border-bright",
  ghost: "bg-transparent text-fg-secondary hover:bg-bg-hover hover:text-fg focus:ring-border-bright",
  danger: "bg-error text-white hover:bg-red-700 focus:ring-error",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-base gap-2",
  lg: "px-6 py-3 text-lg gap-2.5",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, asChild = false, children, className = "", ...props }, ref) => {
    const isDisabled = disabled || loading;

    const Comp = asChild ? "span" : "button";

    const buttonProps = asChild
      ? props
      : {
          ref,
          disabled: isDisabled,
          type: props.type ?? "button",
          ...props,
        };

    return (
      <Comp
        {...buttonProps}
        className={`
          inline-flex items-center justify-center font-medium rounded-md
          transition-all duration-120 ease-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]} ${sizeClasses[size]} ${className}
        `}
      >
        {!asChild && loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };