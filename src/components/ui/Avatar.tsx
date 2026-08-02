import { type HTMLAttributes } from "react";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
}

export function Avatar({ name, src, size = "md", className = "", ...props }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colorIndex = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = colorIndex % 360;
  const bgColor = `hsl(${hue}, 55%, 52%)`;

  return (
    <div
      className={`
        inline-flex items-center justify-center rounded-full font-medium bg-accent-light text-accent
        select-none ring-2 ring-bg
        ${sizeClasses[size]} ${className}
      `}
      style={{ backgroundColor: src ? undefined : bgColor }}
      {...props}
    >
      {src ? (
        <img src={src} alt="" className="w-full h-full rounded-full object-cover" />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = "md",
  className = "",
}: {
  avatars: { name: string; src?: string | null }[];
  max?: number;
  size?: AvatarSize;
  className?: string;
}) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`} aria-label={`${avatars.length} people`}>
      {visible.map((avatar, index) => (
        <Avatar key={index} {...avatar} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={`
            inline-flex items-center justify-center rounded-full font-medium bg-fg-tertiary text-white
            ring-2 ring-bg ${sizeClasses[size]}
          `}
          aria-label={`${remaining} more`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

export type { AvatarProps };