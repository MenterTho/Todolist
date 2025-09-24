"use client";
import { useState } from "react";

export default function ForgotPasswordModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative animate-fadeInUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          ✕
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email address and we’ll send you a reset link
        </p>

        <form className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="youremail@example.com"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
              />
            </svg>
            Reset Password
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-indigo-600 font-medium hover:text-indigo-800 transition"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
