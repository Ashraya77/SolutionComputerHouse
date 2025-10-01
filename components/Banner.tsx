import React from "react";

const Banner = () => {
  return (
    <section className="flex flex-col md:flex-row h-[40vh] mx-45">
      {/* Sidebar */}
      <aside className="w-full md:w-1/6 text-gray-700 p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-gray-300">
        <ul className="space-y-5 text-xl ">
          <li className="hover:text-blue-500 cursor-pointer">Home</li>
          <li className="hover:text-blue-500 cursor-pointer">Shop</li>
          <li className="hover:text-blue-500 cursor-pointer">About</li>
          <li className="hover:text-blue-500 cursor-pointer">Contact</li>
          <li className="hover:text-blue-500 cursor-pointer">Services</li>
          <li className="hover:text-blue-500 cursor-pointer">Blog</li>
          <li className="hover:text-blue-500 cursor-pointer">Support</li>
        </ul>
      </aside>

      {/* Banner */}
      <div className="flex-1  flex justify-center items-center text-white ">
        <img
          src="banner.jpg"
          alt="Banner"
          className=" h-[45vh] w-full p-8 object-cover mt-5"
        />
      </div>
    </section>
  );
};

export default Banner;
