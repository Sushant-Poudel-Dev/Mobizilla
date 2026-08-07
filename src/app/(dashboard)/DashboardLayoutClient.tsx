"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/src/components/ui";
import { DashboardHeader } from "@/src/components/ui";

interface AppUser {
  full_name: string;
  email: string;
  role: string;
  organization_id: string;
  branch_id: string | null;
}

interface DashboardLayoutClientProps {
  appUser: AppUser;
  children: React.ReactNode;
}

export function DashboardLayoutClient({ appUser, children }: DashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-[250px] min-h-screen flex flex-col">
        <DashboardHeader
          user={{ full_name: appUser.full_name, role: appUser.role }}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}