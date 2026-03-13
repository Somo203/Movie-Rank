// app/reset-password/page.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password updated successfully. You can now log in.");
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Reset error:", err);
      setError("Something went wrong. Try again later.");
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
            alt="Logo"
            width={150}
            height={60}
            className="rounded-md"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Reset Password
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-800 text-white"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-800 text-white"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-700 rounded-md bg-gray-800 text-white"
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {message && <p className="text-green-400 text-sm text-center">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-semibold py-3 rounded-md"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Remembered your password?{" "}
          <Link href="/login">
            <span className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer">
              Log in
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
