"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth.hook";
import toast from "react-hot-toast";
import { RegisterRequest } from "@/types/auth.type";

export default function Register() {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: "",
    name: "",
    password: "",
    phoneNumber: "",
    avatarUrl: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, isLoading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; 
    setAvatarFile(file); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      await register({ data: formData, file: avatarFile });
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (err) {
      const apiError = err as Error;
      toast.error(apiError.message || "Đăng ký thất bại");
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
              Create Account
            </div>
            <div className="sm:text-sm xl:text-md text-gray-200 font-normal animate-fadeInUp delay-200">
              Join us and start managing your tasks smarter
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
                Sign Up
              </h2>
              <p className="mt-2 text-sm text-gray-500 animate-fadeInUp delay-200">
                Please fill in the details to create your account
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Full Name
                </label>
                <input
                  className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                />
              </div>

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

              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Phone Number
                </label>
                <input
                  className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 transition-all duration-300"
                />
              </div>

              <div>
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

              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Confirm Password
                </label>
                <input
                  className="w-full text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl animate-pulse-slow ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>

            <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500 animate-fadeInUp delay-500">
              <span>Already have an account?</span>
              <a
                href="/login"
                className="text-indigo-400 hover:text-blue-500 no-underline hover:underline cursor-pointer transition ease-in duration-300"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}