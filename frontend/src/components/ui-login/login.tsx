"use client";

import { useState, useEffect } from "react";
import ForgotPasswordModal from "./forgotpassword";
import { useAuth } from "@/hooks/useAuth.hook";
import { LoginRequest } from "@/types/auth.type";
import { CustomApiError } from "@/utils/apiErrorHandler.util";

export default function Login() {
  const [isForgotOpen, setForgotOpen] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { login, isLoading, error } = useAuth();

  // Theo dõi error từ hook
  useEffect(() => {
    if (error) {
      const apiError = error as CustomApiError;
      const message = apiError.details?.join(', ') || apiError.message || "Đăng nhập thất bại";
      setErrorMessage(message);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    login(formData);
  };

  return (
    <div className="relative min-h-screen flex">
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
        {/* Left side */}
        <div
          className="sm:w-1/2 xl:w-2/5 h-full hidden md:flex flex-auto items-center justify-start p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative"
          style={{
            backgroundImage:
              "ur[](https://images.unsplash.com/photo-1579451861283-a2239070aaa9?auto=format&fit=crop&w=1950&q=80)",
          }}
        >
          <div className="absolute bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900 opacity-80 inset-0 z-0 animate-gradient-x"></div>
          <div className="absolute triangle min-h-screen right-0 w-16"></div>

          <div className="w-full max-w-md z-10">
            <div className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6 animate-fadeInUp">
              Welcome Back
            </div>
            <div className="sm:text-sm xl:text-md text-gray-200 font-normal animate-fadeInUp delay-200">
              Sign in to continue managing your tasks
            </div>
          </div>

          <ul className="circles">
            {Array.from({ length: 10 }).map((_, i) => (
              <li key={i} className="animate-floating"></li>
            ))}
          </ul>
        </div>

        {/* Right side form */}
        <div className="md:flex md:items-center md:justify-center w-full sm:w-auto md:h-full w-2/5 xl:w-2/5 p-8 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900 animate-fadeInUp">
                Sign In
              </h2>
              <p className="mt-2 text-sm text-gray-500 animate-fadeInUp delay-200">
                Please sign in to your account
              </p>
            </div>

            {/* Hiển thị error message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg animate-fadeInUp">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Email
                </label>
                <input
                  className={`w-full text-base px-4 py-2 border-b ${
                    errorMessage ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="mail@gmail.com"
                  required
                />
              </div>

              <div className="mt-8">
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Password
                </label>
                <input
                  className={`w-full text-base px-4 py-2 border-b rounded-2xl ${
                    errorMessage ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300`}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-900">
                  <input type="checkbox" className="mr-2" /> Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-indigo-400 hover:text-blue-500 transition-colors duration-300"
                >
                  Forgot password?
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl animate-pulse-slow ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500 animate-fadeInUp delay-500">
              <span>Do not have an account?</span>
              <a
                href="/register"
                className="text-indigo-400 hover:text-blue-500 no-underline hover:underline cursor-pointer transition ease-in duration-300"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
}