"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, User, ChevronDown, Heart, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import apiClient from "@/lib/apiClient";
import CartBadge from "./CartBadge";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const { user, clearAuth } = useAuthStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post("/users/logout");
      clearAuth(); 
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b-2 border-gray-300">
      <div className="max-w-8xl mx-40 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TechHub
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">About</Link>

            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Products
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  <Link href="/mobiles" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Mobiles</Link>
                  <Link href="/laptops" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Laptops</Link>
                  <Link href="/computers" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Computers</Link>
                  <Link href="/printers" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Printers</Link>
                </div>
              )}
            </div>

            <Link href="/classes" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Computer Classes</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">Contact</Link>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Only render this section on the client to prevent hydration mismatch */}
            {isClient && (user ? (
              <>
               <Link href="/favorite">
               <Heart className="text-red-500 hover:text-red-600"/>
              </Link>
              <Link href="/cart" className="flex text-gray-700 hover:text-blue-600 transition-colors duration-200 relative">
                <CartBadge/>
              </Link>

              {user.role === 'admin' && (
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">Admin</Link>
              )}

             <button
               onClick={handleLogout}
               className="text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center"
             >
               <LogOut className="h-6 w-6 mr-1" /> Logout
             </button>
              </>
             
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center">
                <User className="h-6 w-6 mr-1" /> Sign In
              </Link>
            ))}

            

            {/* Mobile menu button */}
            <button onClick={toggleMenu} className="md:hidden text-gray-700 hover:text-blue-600 transition-colors duration-200">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="px-4 pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>

            <div className="space-y-1">
              <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Home</Link>

              <div className="px-4 py-2">
                <div className="text-gray-900 font-medium mb-2">Products</div>
                <div className="space-y-1 ml-4">
                  <Link href="/mobiles" className="block py-1 text-gray-600 hover:text-blue-600">Mobiles</Link>
                  <Link href="/laptops" className="block py-1 text-gray-600 hover:text-blue-600">Laptops</Link>
                  <Link href="/computers" className="block py-1 text-gray-600 hover:text-blue-600">Computers</Link>
                  <Link href="/printers" className="block py-1 text-gray-600 hover:text-blue-600">Printers</Link>
                </div>
              </div>

              <Link href="/classes" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Computer Classes</Link>
              <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">About</Link>
              <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600">Contact</Link>
            </div>
          </div>
        )}
      </div>

      {/* Dropdown backdrop */}
      {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />}
    </nav>
  );
};

export default Navbar;
