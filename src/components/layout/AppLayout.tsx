import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";

export function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-[#f0f9ff] dark:bg-[#0B0D17]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 md:ml-60 min-h-screen">
        {/* Header mobile con hamburguesa */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-200 dark:border-white/6 bg-white dark:bg-[#0D0F1A] md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/7 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-slate-800 dark:text-white font-semibold text-sm">Lavandería Jireh</span>
        </div>

        <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
