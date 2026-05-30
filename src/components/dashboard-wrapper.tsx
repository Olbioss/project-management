import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import { Outlet } from "react-router";
import { useGlobalStore } from "../store";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

const queryClient = new QueryClient();

function DashboardLayout() {
  const isSidebarCollapsed = useGlobalStore(
    (state) => state.isSidebarCollapsed
  );
  const isDarkMode = useGlobalStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />
      <main
        className={`dark:bg-dark-bg flex w-full flex-col bg-gray-50 ${
          isSidebarCollapsed ? "" : "md:pl-64"
        } 
        `}
      >
        <Navbar />
        <Suspense
          fallback={
            <div className="p-8 text-gray-500 dark:text-neutral-400">
              Loading…
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

export default function DashboardWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout />
    </QueryClientProvider>
  );
}
