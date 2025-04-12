"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { Flame, Play } from "lucide-react";
import Image from "next/image";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordStrong, setIsPasswordStrong] = useState(true);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      validatePasswordStrength(value);
    }
  };

  const validatePasswordStrength = (password: string) => {
    const strongPasswordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (strongPasswordRegex.test(password)) {
      setIsPasswordStrong(true);
      setPasswordError("");
    } else {
      setIsPasswordStrong(false);
      setPasswordError(
        "Password must be at least 8 characters, include a number, and a special character."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`${data.message}`);
        router.push("/auth/signin");
      } else {
        toast.error(`${data.message}`);
      }
    } catch (error) {
      toast.error("Signup error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('/images/bgimage.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-red-950/30"></div>
        <div className="absolute inset-0 mix-blend-overlay opacity-20"></div>
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
              {/* Sign Up Form */}
              <div className="w-full p-6 sm:p-8 lg:w-1/2 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Create your account
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Join Code Red Studios to start streaming your favorite content
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        value={formData.firstname}
                        onChange={handleChange}
                        required
                      />
                      <input
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    {!isPasswordStrong && formData.password && (
                      <p className="text-sm text-red-500">{passwordError}</p>
                    )}
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative mt-6 w-full overflow-hidden rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 p-px focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  >
                    <div className="relative flex h-11 items-center justify-center space-x-2 bg-black transition-colors group-hover:bg-black/80">
                      <span className="text-sm font-medium text-white">
                        {loading ? "Creating account..." : "Create account"}
                      </span>
                      <Play className="h-4 w-4 text-white" />
                    </div>
                  </button>

                  <div className="mt-6">
                    <p className="text-center text-sm text-gray-400">
                      Already have an account?{" "}
                      <Link
                        href="/auth/signin"
                        className="font-medium text-red-500 hover:text-red-400"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>

              {/* Image Section */}
              <div className="relative hidden w-full lg:block lg:w-1/2">
                <div className="relative h-full min-h-[400px] overflow-hidden">
                  <Image
                    src="/images/steps.jpg"
                    alt="Join Us"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 p-12">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                      Join Our Community
                    </h2>
                    <p className="mt-4 text-lg text-gray-300">
                      Create an account to start your entertainment journey with Code Red Studios
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
}