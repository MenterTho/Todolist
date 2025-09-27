"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth.hook";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"notif" | "profile" | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // fake user
  // const isAuthenticated = true;
  // const user = {
  //   name: "Demo User",
  //   avatarUrl: "/images/avatar/avatardefault.png",
  // };
  // const logout = () => console.log("fake logout");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-20 bg-white/10 backdrop-blur-md border-b border-white/10 rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img src="/images/Logo.png" alt="Logo" className="h-10 w-10" />
              <span className="ml-2 font-sans font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-yellow-300">
                DMPA
              </span>
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="text-white hover:text-gray-200 px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4" ref={dropdownRef}>
                {/* Notification */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(activeDropdown === "notif" ? null : "notif")
                    }
                    className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/20 text-white"
                  >
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center 
                                    px-1.5 py-0.5 text-xs font-bold leading-none 
                                    text-white bg-red-600 rounded-full">
                      3
                    </span>
                  </button>

                  {activeDropdown === "notif" && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50">
                      <p className="px-4 py-2 text-sm text-gray-600">Bạn có 3 thông báo</p>
                      <Link
                        href="/notifications"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Xem tất cả
                      </Link>
                    </div>
                  )}
                </div>

                {/* Avatar + name */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(activeDropdown === "profile" ? null : "profile")
                    }
                    className="flex items-center focus:outline-none"
                  >
                    <img
                      src={user?.avatarUrl}
                      alt={user?.name}
                      className="h-8 w-8 rounded-full border border-gray-300"
                    />
                    <span className="ml-2 text-white">{user?.name}</span>
                  </button>
                  {activeDropdown === "profile" && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => logout()}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
