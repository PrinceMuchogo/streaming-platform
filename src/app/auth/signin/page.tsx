"use client";

import React from "react";
import Image from "next/image";
import Signin from "@/components/Auth/Signin";
import Link from "next/link";
import { Flame } from "lucide-react";

const SignIn: React.FC = () => {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('/images/bgimage.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-red-950/30"></div>
        <div className="absolute inset-0  mix-blend-overlay opacity-20"></div>
      </div>

      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/3 top-1/4 h-[300px] w-[300px] animate-pulse rounded-full bg-red-500/10 blur-3xl sm:h-[500px] sm:w-[500px]"></div>
        <div className="absolute -right-1/3 top-3/4 h-[300px] w-[300px] animate-pulse rounded-full bg-yellow-500/10 blur-3xl sm:h-[500px] sm:w-[500px]"></div>
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        {/* Header */}
        <header className="relative z-50">
          <nav className="px-4 py-6 sm:px-6 sm:py-8">
            <Link href="/" className="group relative inline-flex items-center gap-2">
              <div className="relative flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12">
                <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-tr from-red-500 to-yellow-500 blur-sm"></div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-black sm:h-10 sm:w-10">
                  <Flame className="h-5 w-5 text-red-500 sm:h-6 sm:w-6" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tighter text-white sm:text-2xl">
                Code Red Studios
              </span>
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-[1200px] overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="flex flex-col-reverse lg:flex-row">
              {/* Sign In Form */}
              <div className="w-full p-6 sm:p-8 lg:w-1/2 lg:p-12">
                <Signin />
              </div>

              {/* Image Section */}
              <div className="relative hidden w-full lg:block lg:w-1/2">
                <div className="relative h-full min-h-[400px] overflow-hidden">
                  <Image
                    src="/images/steps.jpg"
                    alt="Welcome"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 p-12">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                      Welcome Back!
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                      Sign in to continue your entertainment journey with Code Red Studios
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-40 mt-auto border-t border-white/10">
          <div className="bg-black/40 backdrop-blur-sm">
            <div className="px-4 py-4 sm:px-6">
              <p className="text-center text-xs text-gray-400 sm:text-sm">
                &copy; {new Date().getFullYear()} Code Red Studios. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SignIn;