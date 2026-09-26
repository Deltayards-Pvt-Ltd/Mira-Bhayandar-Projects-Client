import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function AppLayout() {
  return (
    <div className="flex min-h-full min-w-0 flex-1 flex-col overflow-x-clip bg-navy text-cream">
      <Navbar />
      <main className="relative z-0 min-w-0 flex-1 overflow-x-clip">
        <Suspense fallback={<div className="min-h-[50vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
