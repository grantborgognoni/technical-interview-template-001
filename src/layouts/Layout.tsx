import { useState } from "react";
import type { ReactNode } from "react";
import Header from "~/components/Header";
import Sidebar from "~/components/Sidebar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:sticky md:top-0 md:block md:h-screen md:w-64 md:flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="relative w-64 bg-white shadow-xl">
            <Sidebar />
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
          <div
            className="bg-opacity-25 flex-1 bg-black"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10">
          <Header />
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
