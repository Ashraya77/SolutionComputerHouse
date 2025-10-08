"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, ShoppingCart, Settings } from "lucide-react";

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

 useEffect(() => {
    setIsClient(true);
 }, []);

 useEffect(() => {
    if (isClient && !user) {
      router.push("/login");
    }
 }, [user, isClient, router]);

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>; // Or a spinner
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-md h-125">
            <h2 className="text-xl font-bold mb-4">My Account</h2>
            <nav className="space-y-2">
              <Link href="/userProfile" className="flex items-center p-2 rounded hover:bg-gray-100"><User className="mr-3 h-5 w-5" />Profile</Link>
              <Link href="/userProfile/orders" className="flex items-center p-2 rounded hover:bg-gray-100"><ShoppingCart className="mr-3 h-5 w-5" />My Orders</Link>
              <Link href="/userProfile/wishlist" className="flex items-center p-2 rounded hover:bg-gray-100"><ShoppingCart className="mr-3 h-5 w-5" />Wishlist</Link>
              <Link href="/userProfile/settings" className="flex items-center p-2 rounded hover:bg-gray-100"><Settings className="mr-3 h-5 w-5" />Settings</Link>
            </nav>
          </div>
        </aside>
        <main className="w-full md:w-3/4">{children}</main>
      </div>
    </div>
  );
}