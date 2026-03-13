"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!usernameOrEmail || !password) {
      setError("Please enter both username/email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Save all needed values to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);

        // Save profileImage or fallback to default
        localStorage.setItem(
          "profileImage",
          data.profileImage || "/assets/profile.jpg"
        );

        router.push("/");
      } else {
        setError(data.error || "Invalid username/email or password");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("An unexpected error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-xl">
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/logo.png"
            alt="Your Company Logo"
            width={150}
            height={60}
            className="rounded-md"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-8">Log In</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username-email" className="sr-only">
              Username or Email
            </label>
            <input
              type="text"
              id="username-email"
              name="username-email"
              placeholder="Username or Email"
              required
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white bg-gray-800"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-white bg-gray-800"
            />
            <div className="text-right mt-2">
              <Link href="/reset-password">
                <span className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors duration-200 cursor-pointer">
                  Forgot password?
                </span>
              </Link>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-400">
          Don't have an account?{" "}
          <Link href="/signup">
            <span className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200 cursor-pointer">
              Sign up
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
