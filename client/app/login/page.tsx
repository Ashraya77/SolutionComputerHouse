"use client";
import { useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiClient.post("/users/login", { email, password });
      
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      window.location.href = "/"; // redirect to home or dashboard
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen mx-45">
      {/* Left side - Full screen image */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src="/loginImage.png"
          alt="Login background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login form */}
      <div className="flex flex-col justify-center w-full md:w-1/2 bg-white p-8 md:p-16">
        <h1 className="text-4xl font-bold mb-3">Welcome back</h1>
        <p className="text-gray-400 mb-8">Welcome back! Please enter your details</p>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-md font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-md placeholder:text-gray-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="pass" className="block mb-2 text-md font-medium">
              Password
            </label>
            <input
              type="password"
              id="pass"
              className="w-full p-3 border border-gray-300 rounded-md placeholder:text-gray-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Remember me + Forgot */}
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" />
              Remember for 30 days
            </label>
            <span className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-white hover:text-black border border-transparent hover:border-gray-400 transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Error message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>

        {/* Sign up link */}
        <p className="text-center text-gray-500 mt-6">
          Don't have an account?
          <Link href="/sign-up" className="ml-2 text-black font-semibold hover:text-blue-600">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
