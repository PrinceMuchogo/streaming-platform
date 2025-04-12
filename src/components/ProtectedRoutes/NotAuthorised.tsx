import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Red",
  description: "This is a video streaming platform",
};

export default function NotAuthorised() {
  return (
    <div className="bg-black">
      <div className="relative h-screen bg-[url('/images/bgimage.jpg')] bg-cover bg-center bg-no-repeat">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        {/* Navbar */}
        <header className="absolute left-0 top-0 flex w-full items-center justify-between p-5">
          <div className="bg-gradient-to-r from-red-600 via-pink-500 to-yellow-400 bg-clip-text text-2xl font-extrabold tracking-wider text-transparent drop-shadow-lg">
            <Link
              href="#"
              className="block flex-shrink-0 transition-transform hover:scale-105"
            >
              Streamify
            </Link>
          </div>
        </header>

        {/* Main Section */}

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white md:px-8">
          <h1 className="w-[80%] max-w-md text-3xl font-extrabold leading-snug md:text-5xl md:leading-tight">
            {/* <span className="block text-lg font-medium md:text-2xl">
              Welcome to
            </span> */}
            <span className="mt-2 block text-4xl md:text-5xl">Streamify</span>
          </h1>
          <h2 className="mt-4 w-[80%] max-w-md text-base font-normal leading-relaxed md:text-2xl">
            Your ultimate hub for exclusive artistry and entertainment. Stream
            your favorite music, artwork and discover new laughs, all in one
            place, wherever you are.
          </h2>

          <div className="mt-6 w-full max-w-md">
            <div className="mt-4 flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0">
              {
                <Link
                  className="flex w-full items-center justify-center rounded-md bg-red-600 px-6 py-3 text-white md:w-auto"
                  href={"/"}
                >
                  You Are Not Authorised!
                </Link>
              }
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-0 left-0 w-full bg-black bg-opacity-80 p-4 text-center text-gray-400">
          <p>&copy; 2025 Streamify. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
