import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Play } from "lucide-react";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/home";
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Enter your email below to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 p-4">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            placeholder="Enter your password"
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
              {loading ? "Signing in..." : "Sign in"}
            </span>
            <Play className="h-4 w-4 text-white" />
          </div>
        </button>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-red-500 hover:text-red-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;