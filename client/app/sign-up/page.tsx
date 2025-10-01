import Link from "next/link";
import Image from "next/image";

const page = () => {
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

          <div className="py-4">
            <span className="mb-2 text-md">Full Name</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="name"
              id="name"
              placeholder="Enter your full name"
            />
          </div>

          <div className="py-4">
            <span className="mb-2 text-md">Email</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="email"
              id="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="py-4">
            <span className="mb-2 text-md">Password</span>
            <input
              type="password"
              name="pass"
              id="pass"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-between w-full py-4">
            <div className="mr-24">
              <input type="checkbox" name="ch" id="ch" className="mr-2" />
              <span className="text-md">I agree to the terms and conditions</span>
            </div>
          </div>

          <button className="w-full bg-black text-white p-2 rounded-lg mb-6 hover:bg-white hover:text-black hover:border hover:border-gray-300">
            Sign up
          </button>

          <div className="text-center text-gray-400">
            Already have an account?
            <Link href="/login" className="font-bold text-black hover:text-blue-600 ml-2">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;