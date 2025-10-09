"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { User, ShoppingCart, Settings, Heart, LogOut } from "lucide-react";

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !user) {
      router.push("/login");
    }
  }, [user, isClient, router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const navLinks = [
    { href: "/userProfile", icon: User, label: "Profile" },
    { href: "/userProfile/orders", icon: ShoppingCart, label: "My Orders" },
    { href: "/userProfile/wishlist", icon: Heart, label: "Wishlist" },
    { href: "/userProfile/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      pathname === link.href
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <link.icon className="mr-3 h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 border-t pt-4">
                <button
                  onClick={handleLogout}
                  className="flex items-center p-3 rounded-lg text-red-500 hover:bg-red-50 w-full transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </aside>
          <main className="w-full md:w-3/4">
            <div className="bg-white p-8 rounded-lg shadow-md">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}