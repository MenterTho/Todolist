"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth.hook";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); 
  const [dropdownOpen, setDropdownOpen] = useState(false); 
// const { user, isAuthenticated, logout } = useAuth();
const isAuthenticated = true;
const user = { 
  name: "Demo User", 
  avatarUrl: "/images/avatar/avatardefault.png" 
};
const logout = () => console.log("fake logout");

  return (
    <nav className="fixed top-0 left-0 w-full z-20 bg-white/10 backdrop-blur-md border-b border-white/10 rounded-b-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img src="/images/Logo.png" alt="Logo" className="h-25 w-25" />
              <span className="font-sans font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-yellow-300">
                DMPA
              </span>
            </Link>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex md:items-center md:space-x-4">
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
                <div className="relative">
                  {/* Avatar button */}
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center focus:outline-none"
                  >
                    <img
                      src={user?.avatarUrl || "/images/avatar/avatardefault.png"}
                      alt={user?.name}
                      className="h-8 w-8 rounded-full border border-gray-300"
                    />
                    <span className="ml-2 text-white">{user?.name}</span>
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
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
              )}
            </div>

            {/* Mobile Button */}
            <div className="flex items-center md:hidden">
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 bg-opacity-90">
            <Link
              href="/"
              className="text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium"
            >
              About
            </Link>

            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="block w-full text-center text-white bg-gray-700 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center bg-white text-indigo-600 px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center px-5">
                  <img
                    src={user?.avatarUrl || "/images/default-avatar.png"}
                    alt={user?.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <span className="ml-3 text-white">{user?.name}</span>
                </div>
                <Link
                  href="/profile"
                  className="mt-3 block w-full text-center text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="block w-full text-center text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base"
                >
                  Settings
                </Link>
                <button
                  onClick={() => logout()}
                  className="mt-3 w-full text-center text-white bg-red-500 px-3 py-2 rounded-md text-base font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
