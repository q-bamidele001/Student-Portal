"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-gray-700">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-400 mb-4">Check Your Email!</h2>
          <p className="text-gray-300 mb-6">
            We've sent a verification link to <strong>{form.email}</strong>
          </p>
          <Link href="/signin" className="text-blue-400 hover:underline">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Admin Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}