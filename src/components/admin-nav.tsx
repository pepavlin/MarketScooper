"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/sources", label: "Sources" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/errors", label: "Errors" },
  { href: "/admin/actions", label: "Actions" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4 border-b pb-4 mb-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-[var(--primary)]",
            pathname === item.href
              ? "text-[var(--primary)] border-b-2 border-[var(--primary)] pb-1"
              : "text-[var(--muted-foreground)]"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
