"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/apiClient"; // must point to your Express base URL
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.agree) {
      setError("Please agree to the terms and conditions.");
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.address) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await apiClient.post("/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
      });

      if (res.status === 201) {
        alert("Account created successfully!");
        router.push("/login");
      }
    } catch (err: any) {
      console.error(err);
      // Handle both array-based validation errors and single error
      const msg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.error ||
        "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        {/* Left side */}
        <div className="relative h-full w-[400px] hidden md:block">
          <Image
            src="/loginImage.png"
            alt="Decorative image for sign-up page"
            fill
            className="rounded-l-2xl object-cover"
          />
        </div>

        {/* Right side */}
        <div className="flex flex-col justify-center p-8 md:p-14">
          <span className="mb-3 text-4xl font-bold">Create Account</span>
          <span className="font-light text-gray-400 mb-8">
            Let's get you started!
          </span>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="py-2">
            <span className="mb-2 text-md">Full Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              placeholder="Enter your full name"
            />
          </div>

          <div className="py-2">
            <span className="mb-2 text-md">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="py-2">
            <span className="mb-2 text-md">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="py-2">
            <span className="mb-2 text-md">Address</span>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              placeholder="Enter your address"
            />
          </div>

          <div className="flex justify-between w-full py-4">
            <div className="mr-24">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-md">I agree to the terms and conditions</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>

          <div className="text-center text-gray-400">
            Already have an account?
            <Link
              href="/login"
              className="font-bold text-black hover:text-blue-600 ml-2"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
