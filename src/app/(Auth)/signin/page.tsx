"use client";

import { useState, FormEvent, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setVerified(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Admin Sign In
        </h1>

        {verified && (
          <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-2 rounded-lg text-sm mb-4">
            ✅ Email verified! You can now sign in.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-green-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}