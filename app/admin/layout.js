import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, Shield, User } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/murid", icon: Users, label: "Kelola Murid" },
  { href: "/admin/catatan", icon: BookOpen, label: "Kelola Catatan" },
  { href: "/admin/profil", icon: User, label: "Profil" },
];

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="container-custom py-6 md:py-10">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
            {/* Admin Badge */}
            <div className="pb-4 mb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-primary-600 font-medium">
                Administrator
              </p>
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

            {/* Back to site */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
              >
                ← Kembali ke Website
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Nav */}
        <div className="lg:hidden">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary-500" />
            <span className="font-semibold text-gray-900">Admin Panel</span>
          </div>
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
