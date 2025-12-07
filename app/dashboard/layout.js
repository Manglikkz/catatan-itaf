import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Plus, BookOpen, User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/buat", icon: Plus, label: "Upload Catatan" },
  { href: "/dashboard/catatan", icon: BookOpen, label: "Catatan Saya" },
  { href: "/dashboard/profil", icon: User, label: "Profil" },
];

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container-custom py-6 md:py-10">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
            {/* User Info */}
            <div className="pb-4 mb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-primary-600">
                  {user.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>

            {/* Nav Items */}
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                    "text-gray-600 hover:bg-gray-50 hover:text-primary-600",
                    "transition-colors"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Nav */}
        <div className="lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap",
                  "bg-white border border-gray-200 text-gray-600",
                  "hover:border-primary-300 hover:text-primary-600",
                  "transition-colors"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
