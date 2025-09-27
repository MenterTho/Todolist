"use client";

import { useState } from "react";
import ForgotPasswordModal from "./forgotpassword";
import { useAuth } from "@/hooks/useAuth.hook";
import toast from "react-hot-toast";
import { LoginRequest } from "@/types/auth.type";

export default function Login() {
  const [isForgotOpen, setForgotOpen] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({ email: "", password: "" });
  const { login, isLoading, error } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
      toast.success("Đăng nhập thành công!");
    } catch (err) {
      const apiError = err as Error;
      toast.error(apiError.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="relative min-h-screen flex">
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
        {/* Left side */}
        <div
          className="sm:w-1/2 xl:w-2/5 h-full hidden md:flex flex-auto items-center justify-start p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1579451861283-a2239070aaa9?auto=format&fit=crop&w=1950&q=80)",
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

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Email
                </label>
                <input
                  className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
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
                  className="w-full text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
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
                  {isLoading ? "Signing in..." : "Sign in"}
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