"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

const navigation = [
  {
    label: "Core",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Repairs", href: "/dashboard/repairs", icon: "wrench" },
      { name: "Invoices", href: "/dashboard/invoices", icon: "file-text" },
      { name: "Purchases", href: "/dashboard/purchases", icon: "shopping-cart" },
    ],
  },
  {
    label: "Inventory",
    items: [
      { name: "Catalog", href: "/dashboard/inventory", icon: "package" },
      { name: "Stock Levels", href: "/dashboard/inventory/stock", icon: "archive" },
    ],
  },
  {
    label: "People",
    items: [
      { name: "Customers", href: "/dashboard/customers", icon: "users" },
      { name: "Suppliers", href: "/dashboard/suppliers", icon: "truck" },
      { name: "Staff", href: "/dashboard/staff", icon: "user-cog" },
    ],
  },
];

const navigationIcons: Record<string, React.ReactNode> = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
    </svg>
  ),
  wrench: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.021-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
  "file-text": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  package: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  archive: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM15.75 19.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM21 15.75a3.75 3.75 0 01-7.5 0H3a3.75 3.75 0 010-7.5h10.5a3.75 3.75 0 017.5 0Z" />
    </svg>
  ),
  truck: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
    </svg>
  ),
  "shopping-cart": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  "user-cog": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM15 19.5a3.75 3.75 0 01-7.5 0M9 9a3.75 3.75 0 017.5 0M9 15.75a3.75 3.75 0 017.5 0" />
    </svg>
  ),
};

const chevronDown = (
  <svg className="w-4 h-4 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const chevronRight = (
  <svg className="w-4 h-4 transition-transform duration-200 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const sawIcon = (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M3 21l18-18M12 3v18M3 12h18" />
  </svg>
);

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>(navigation.map(s => s.label));

  const toggleSection = (label: string) => {
    setExpandedSections(prev => prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label]);
  };

  return (
    <>
      {/* Backdrop - only on mobile when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - always fixed, visible on lg+, drawer on mobile */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 transition-transform duration-300 ease-out",
          "hidden lg:block",
          "translate-x-full lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ width: "250px" }}
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            <Link href="/dashboard" className="flex items-center gap-3" aria-label="Mobizilla Home">
              <div className="relative w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25H19.5A2.25 2.25 0 0121.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 00-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
                </svg>
                {/* Quarry block accent */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-slate-200 border border-slate-300 rounded-sm rotate-3" />
              </div>
              <span className="font-semibold text-lg text-slate-900 tracking-tight">Mobizilla</span>
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation with collapsible sections */}
          <nav className="flex-1 p-3 space-y-4 overflow-y-auto" aria-label="Main navigation">
            {navigation.map((section) => {
              const isExpanded = expandedSections.includes(section.label);
              const hasActiveItem = section.items.some(item => 
                pathname === item.href || pathname.startsWith(item.href + "/")
              );
              
              return (
                <div key={section.label} className="group">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.label)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                      "text-slate-500 hover:text-slate-900 hover:bg-slate-100",
                      hasActiveItem && "text-slate-900"
                    )}
                    aria-expanded={isExpanded}
                    aria-controls={`${section.label}-items`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {isExpanded ? chevronDown : chevronRight}
                      <span className="uppercase tracking-wider text-xs">{section.label}</span>
                    </span>
                  </button>
                  
                  <div 
                    id={`${section.label}-items`}
                    className={cn(
                      "overflow-hidden transition-all duration-200 ease-out",
                      isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
                    )}
                    role="region"
                    aria-label={`${section.label} navigation items`}
                  >
                    <div className="space-y-1 pl-2 border-l border-slate-200/50 ml-5">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = navigationIcons[item.icon];
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                              "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                              isActive
                                ? "text-slate-900 bg-slate-100"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                            onClick={onClose}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <span className="flex-shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors">
                              {Icon}
                            </span>
                            <span className="truncate">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">v1.0.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}