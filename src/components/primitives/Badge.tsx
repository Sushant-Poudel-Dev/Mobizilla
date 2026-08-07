import { type HTMLAttributes } from "react";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "accent" | "info";
export type BadgeSize = "sm" | "md";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  success: "bg-success-light text-success border border-success/20",
  warning: "bg-warning-light text-warning border border-warning/20",
  danger: "bg-error-light text-error border border-error/20",
  accent: "bg-accent-light text-accent border border-accent/20",
  info: "bg-blue-50 text-blue-700 border border-blue-100",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs gap-1",
  md: "px-2.5 py-1 text-sm gap-1.5",
};

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} aria-hidden="true" />}
      {children}
    </span>
  );
}

export function StatusBadge({
  status,
  className = "",
}: {
  status: string;
  className?: string;
}) {
  const statusLower = status.toLowerCase();
  let variant: BadgeVariant = "default";

  if (statusLower.includes("open") || statusLower.includes("new") || statusLower.includes("pending")) {
    variant = "accent";
  } else if (statusLower.includes("progress") || statusLower.includes("diagnos") || statusLower.includes("repair") || statusLower.includes("waiting")) {
    variant = "warning";
  } else if (statusLower.includes("complete") || statusLower.includes("done") || statusLower.includes("finished") || statusLower.includes("closed") || statusLower.includes("paid")) {
    variant = "success";
  } else if (statusLower.includes("cancel") || statusLower.includes("reject") || statusLower.includes("void")) {
    variant = "danger";
  } else if (statusLower.includes("partial")) {
    variant = "warning";
  }

  return <Badge variant={variant} size="sm" className={className}>{status}</Badge>;
}

export type { BadgeProps };