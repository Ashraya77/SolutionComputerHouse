"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Package, Users } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isClient && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, isClient, router]);

  // Show loading state while client is mounting or if the user is not an admin.
  if (!isClient || !user || user.role !== "admin") {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="flex items-center p-2 rounded hover:bg-gray-700"><LayoutDashboard className="mr-3" />Dashboard</Link>
          <Link href="/dashboard/products" className="flex items-center p-2 rounded hover:bg-gray-700"><Package className="mr-3" />Products</Link>
          <Link href="/dashboard/addProduct" className="flex items-center p-2 rounded hover:bg-gray-700"><Package className="mr-3" />Add Products</Link>
          <Link href="/dashboard/orders" className="flex items-center p-2 rounded hover:bg-gray-700"><ShoppingCart className="mr-3" />Orders</Link>
          <Link href="/dashboard/orders" className="flex items-center p-2 rounded hover:bg-gray-700"><Users className="mr-3" />Users</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
}