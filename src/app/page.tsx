"use client";

import React from "react";
import "next-cloudinary/dist/cld-video-player.css";
import { useEffect, useState } from "react";
import { videos } from "@/types/video";
import useStore from "@/zustand/videoStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Play, Flame, Film, Users, Globe,HeartHandshake } from "lucide-react";

export default function Home() {
  const [video_data, set_video_data] = useState<videos | any>([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { setVideos } = useStore();

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await fetch("/api/get-videos", {
        method: "GET",
      });
      const data = await response.json();
      set_video_data(data);
      setVideos(data);
    };
    fetchVideos();
  }, []);

  const handleGetStarted = () => {
    console.log("handleGetStarted");
    router.push("/play/home");
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black">
      {/* Dynamic Background - Optimized for mobile */}
      <div className="absolute inset-0 bg-[url('/images/bgimage.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-red-950/30"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Animated Shapes - Adjusted for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/3 top-1/4 h-[300px] w-[300px] animate-pulse rounded-full bg-red-500/10 blur-3xl sm:h-[500px] sm:w-[500px]"></div>
        <div className="absolute -right-1/3 top-3/4 h-[300px] w-[300px] animate-pulse rounded-full bg-yellow-500/10 blur-3xl sm:h-[500px] sm:w-[500px]"></div>
      </div>

      {/* Content Container */}
      <div className="relative flex min-h-[100dvh] flex-col justify-between">
        {/* Navbar - Mobile optimized */}
        <header className="relative z-50">
          <nav className="px-4 py-6 sm:px-6 sm:py-8">
            <Link
              href="/"
              className="group relative inline-flex items-center gap-2"
            >
              <div className="relative flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12">
                <div className="animate-spin-slow absolute inset-0 rounded-full bg-gradient-to-tr from-red-500 to-yellow-500 blur-sm"></div>
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

        {/* Hero Section - Mobile optimized */}
        <main className="relative z-40 flex-1">
          <div className="flex min-h-[calc(100dvh-8rem)] items-center px-4 py-8 sm:min-h-0 sm:px-6 sm:py-2">
            <div className="relative mx-auto w-full max-w-lg sm:max-w-2xl">
              {/* Main Content */}
              <div className="text-center">
                <h1 className="relative">
                  <span className="absolute -left-1/4 top-1/2 h-px w-[150%] -translate-y-1/2 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></span>
                  <span className="relative block text-sm font-medium uppercase tracking-widest text-red-500 sm:text-base">
                    Welcome to the Future of Entertainment
                  </span>
                  <span className="mt-4 block text-3xl font-extrabold tracking-tight text-white sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl">
                    Code Red Studios
                  </span>
                </h1>

                <p className="mt-6 text-base leading-relaxed text-gray-300 [text-wrap:balance] sm:mt-8 sm:text-lg">
                  Your ultimate hub for exclusive comedy and entertainment.
                  Stream your favorite shows and discover new laughs, all in one
                  place, wherever you are.
                </p>

                <div className="mt-8 flex flex-col items-stretch gap-4 px-4 sm:mt-12 sm:flex-row sm:items-center sm:justify-center sm:gap-6 sm:px-0">
                  {session == null ? (
                    <Link
                      href="/auth/signin"
                      className="group relative isolate overflow-hidden rounded-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 transition-transform duration-300 group-hover:scale-105"></div>
                      <div className="relative flex h-14 items-center justify-center gap-2 bg-black/90 px-8 transition-colors duration-300 group-hover:bg-black/80 sm:h-12">
                        <span className="font-medium text-white">
                          Join Now to Begin
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      href="/play/home"
                      className="group relative isolate overflow-hidden rounded-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-yellow-500 transition-transform duration-300 group-hover:scale-105"></div>
                      <div className="relative flex h-14 items-center justify-center gap-2 bg-black/90 px-8 transition-colors duration-300 group-hover:bg-black/80 sm:h-12">
                        <span className="font-medium text-white">
                          Continue Watching
                        </span>
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    </Link>
                  )}
                </div>
                {/* Features */}
                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
                    <Globe className="mx-auto h-8 w-8 text-red-500" />
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      Stream Anywhere
                    </h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Watch your favorite content on any device, anywhere in the
                      world
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
                    <Film className="mx-auto h-8 w-8 text-pink-500" />
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      Exclusive Content
                    </h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Access premium content you won&apos;t find anywhere
                      else
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
                    <Users className="mx-auto h-8 w-8 text-yellow-500" />
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      Community
                    </h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Join a growing community of entertainment
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
                    <HeartHandshake className="mx-auto h-8 w-8 text-yellow-500" />
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      Support
                    </h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Support by joining a growing community of entertainment enthusiasts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer - Mobile optimized */}
        <footer className="relative z-40 border-t border-white/10">
          <div className="bg-black/40 backdrop-blur-sm">
            <div className="px-4 py-4 sm:px-6">
              <p className="text-center text-xs text-gray-400 sm:text-sm">
                &copy; {new Date().getFullYear()} Code Red Studios. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
