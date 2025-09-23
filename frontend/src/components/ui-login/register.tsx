"use client";

export default function Register() {
  return (
    <div className="relative min-h-screen flex">
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
        {/* Left side */}
        <div
          className="sm:w-1/2 xl:w-2/5 h-full hidden md:flex flex-auto items-center justify-start p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1556741533-f6acd6471e6c?auto=format&fit=crop&w=1950&q=80)",
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

          {/* Floating background */}
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

            <form className="mt-8 space-y-6">
              {/* Name */}
              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Full Name
                </label>
                <input
                  className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                  type="text"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Email
                </label>
                <input
                  className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                  type="email"
                  placeholder="mail@gmail.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Phone Number
                </label>
                <input
                  className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                  type="tel"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                  file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Password
                </label>
                <input
                  className="w-full text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Confirm Password
                </label>
                <input
                  className="w-full text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
                  type="password"
                  placeholder="Confirm your password"
                />
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-blue-600 hover:to-indigo-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg transition-all duration-500 transform hover:scale-105 hover:shadow-2xl animate-pulse-slow"
                >
                  Register
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
