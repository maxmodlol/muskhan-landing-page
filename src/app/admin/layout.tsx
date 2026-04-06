import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      dir="rtl"
      lang="ar"
      className="min-h-screen bg-musakhan-atmosphere text-earth"
    >
      {children}
    </div>
  );
}
