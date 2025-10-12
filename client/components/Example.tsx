"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/useCartStore";
import Link from "next/link";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const { clearAuth } = useAuthStore();
  const { clearCart } = useCartStore();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await apiClient.post("/users/logout");
      clearAuth();
      clearCart();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      {/* User button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
      >
        <User size={20} className="text-gray-700" />
      </button>

      {/* Dropdown menu */}
      {open && (
        <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-md py-1 z-50">
          <Link
            href="/userProfile"
            className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Profile
          </Link>
          <Link
            href="/userProfile/settings"
            className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Settings
          </Link>
          <Link
            href="/userProfile/notifications"
            className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Notifications
          </Link>
          <button
            className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </ul>
      )}
    </div>
  );
}
