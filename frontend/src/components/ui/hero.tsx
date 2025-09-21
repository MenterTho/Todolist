"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "../../../public/animations/DMPA.json";

export default function Hero() {
  return (
  <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-800 to-indigo-700 pt-20 pb-20">
      {/* Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="absolute top-40 -right-40 w-96 h-96 bg-yellow-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-ping"></div>
      <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-bounce"></div>

      {/* Content Wrapper */}
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10 px-6">
        {/* Left Side */}
        <div className="text-white max-w-xl">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-300"
          >
            Todo Management Platform
          </motion.h1>

          {/* Short Slogan */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-200 mb-8"
          >
            The all-in-one platform to manage your tasks and projects – organize,
            track progress, and collaborate smarter.
          </motion.p>

          {/* Features */}
          <motion.ul
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-3 text-base md:text-lg text-gray-100 mb-10"
          >
            <li className="flex items-center space-x-2">
                <img 
                    src="/images/authentication.png" 
                    alt="authentication" 
                    className="w-10 h-10 object-contain"
                  />
                  <span>Secure authentication & role management</span>
            </li>
            <li className="flex items-center space-x-2">
                <img 
                    src="/images/backlog.png" 
                    alt="authentication" 
                    className="w-10 h-10 object-contain"
                  />
                  <span>Workspaces & project organization</span>
            </li>
            <li className="flex items-center space-x-2">
                <img 
                    src="/images/follow-up.png" 
                    alt="authentication" 
                    className="w-10 h-10 object-contain"
                  />
                  <span>Detailed task tracking with assignees</span>
            </li>
            <li className="flex items-center space-x-2">
                <img 
                    src="/images/notification.png" 
                    alt="authentication" 
                    className="w-10 h-10 object-contain"
                  />
                  <span>Real-time comments & notifications</span>
            </li>
            <li className="flex items-center space-x-2">
                <img 
                    src="/images/add-group.png" 
                    alt="authentication" 
                    className="w-10 h-10 object-contain"
                  />
                  <span>Invite team members with ease</span>
            </li>
          </motion.ul>

          {/* CTA Buttons */}
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg bg-white text-indigo-700 font-semibold text-lg shadow hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
            <Link
              href="/features"
              className="px-8 py-3 rounded-lg border border-white text-white font-semibold text-lg shadow hover:bg-white/10 transition"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

        {/* Right Side - Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex justify-center items-center"
        >
          <div className="relative w-80 h-96 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex items-center justify-center">
            <Lottie animationData={animationData} loop={true} className="w-72 h-72" />
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
