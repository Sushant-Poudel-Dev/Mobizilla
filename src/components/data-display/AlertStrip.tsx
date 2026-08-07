"use client";

import { type ReactNode } from "react";
import { cn } from "@/src/lib/utils";
import { formatRelativeTime } from "@/src/lib/format";

export interface AlertItem {
  id: string;
  type: "warning" | "critical" | "info" | "success";
  title: string;
  message?: string;
  action?: { label: string; href: string };
  dismissible?: boolean;
  onDismiss?: (id: string) => void;
}

const typeStyles: Record<AlertItem["type"], { bg: string; border: string; text: string; icon: ReactNode }> = {
  critical: {
    bg: "bg-error/5",
    border: "border-error/20",
    text: "text-error",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  warning: {
    bg: "bg-warning/5",
    border: "border-warning/20",
    text: "text-warning",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  info: {
    bg: "bg-accent/5",
    border: "border-accent/20",
    text: "text-accent",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 01-1.063.853l-.708-2.836a.75.75 0 011.063-.853z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
  success: {
    bg: "bg-success/5",
    border: "border-success/20",
    text: "text-success",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
};

interface AlertStripProps {
  alerts: AlertItem[];
  className?: string;
  onDismiss?: (id: string) => void;
}

export function AlertStrip({ alerts, className = "", onDismiss }: AlertStripProps) {
  if (!alerts.length) return null;

  return (
    <div className={cn("mb-6", className)}>
      <div className="flex flex-wrap gap-2" role="alert" aria-live="polite">
        {alerts.map((alert) => {
          const styles = typeStyles[alert.type];
          return (
            <div
              key={alert.id}
              className={`
                flex items-start gap-3 px-4 py-3 rounded-lg border
                ${styles.bg} ${styles.border} ${styles.text}
                animate-slide-in-right
              `}
              role="alert"
            >
              <span className="flex-shrink-0 mt-0.5" aria-hidden="true">{styles.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{alert.title}</p>
                {alert.message && <p className="text-sm opacity-90 mt-0.5">{alert.message}</p>}
                {alert.action && (
                  <a href={alert.action.href} className="mt-2 inline-flex items-center gap-1 text-sm font-medium underline hover:no-underline">
                    {alert.action.label}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                )}
              </div>
              {alert.dismissible !== false && (
                <button
                  type="button"
                  onClick={() => alert.onDismiss?.(alert.id) ?? onDismiss?.(alert.id)}
                  className="flex-shrink-0 p-1 rounded hover:bg-black/5 hover:bg-white/5 transition-colors"
                  aria-label="Dismiss alert"
                >
                  <svg className="w-4 h-4 opacity-60 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AlertBannerProps {
  alerts: AlertItem[];
  className?: string;
  onDismiss?: (id: string) => void;
}

export function AlertBanner({ alerts, className = "", onDismiss }: AlertBannerProps) {
  if (!alerts.length) return null;

  const criticalAlert = alerts.find(a => a.type === "critical");
  const warningAlert = alerts.find(a => a.type === "warning");

  // Show only the most critical alert as banner
  const bannerAlert = criticalAlert || warningAlert;
  if (!bannerAlert) return null;

  const styles = typeStyles[bannerAlert.type];

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-md animate-slide-in-right",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className={cn("flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg", styles.bg, styles.border, styles.text)}>
        <span className="flex-shrink-0 mt-0.5" aria-hidden="true">{styles.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{bannerAlert.title}</p>
          {bannerAlert.message && <p className="text-sm opacity-90 mt-0.5">{bannerAlert.message}</p>}
          {bannerAlert.action && (
            <a href={bannerAlert.action.href} className="mt-2 inline-flex items-center gap-1 text-sm font-medium underline hover:no-underline">
              {bannerAlert.action.label}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss?.(bannerAlert.id)}
          className="flex-shrink-0 p-1 rounded hover:bg-black/5 hover:bg-white/5 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4 opacity-60 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}