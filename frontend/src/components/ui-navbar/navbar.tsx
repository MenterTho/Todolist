"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth.hook";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"notif" | "profile" | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const notificationCount = 3;

  // Chỉ render client để tránh hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isMounted) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-20 bg-white/10 backdrop-blur-md border-b border-white/10 rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img src="/images/Logo.png" alt="Logo DMPA" className="h-10 w-10" />
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
                    aria-label="Notifications"
                    aria-expanded={activeDropdown === "notif"}
                    className="relative flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/20 text-white transition-colors duration-200"
                  >
                    <Bell className="h-6 w-6 text-yellow-500" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </button>

                  {activeDropdown === "notif" && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 animate-fadeInDown">
                      <p className="px-4 py-2 text-sm text-gray-600">Bạn có {notificationCount} thông báo</p>
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
                    aria-label={`Profile of ${user?.name || "User"}`}
                    aria-expanded={activeDropdown === "profile"}
                    className="flex items-center focus:outline-none"
                  >
                    <img
                      src={user?.avatarUrl || "/images/avatar/avatardefault.png"}
                      alt={user?.name || "User"}
                      className="h-12 w-12 rounded-full border border-gray-300"
                    />
                    <span className="ml-2 text-black">{user?.name || "User"}</span>
                  </button>
                  {activeDropdown === "profile" && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 animate-fadeInDown">
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
                aria-label="Toggle mobile menu"
                aria-expanded={isOpen}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-gray-700 transition-colors duration-200"
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

        {/* Mobile menu */}
        {isOpen && (
          <div ref={mobileMenuRef} className="md:hidden bg-white/90 backdrop-blur-md border-t border-white/10 animate-slideInDown">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-indigo-600 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    href="/notifications"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Notifications
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
