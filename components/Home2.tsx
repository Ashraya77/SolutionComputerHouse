"use client";
import React from "react";
import { Phone, Monitor, Camera } from "lucide-react";

const categories = [
  { name: "Phone", icon: <Phone size={35} /> },
  { name: "Computer", icon: <Monitor size={35} /> },
  { name: "Camera", icon: <Camera size={35} /> },
  { name: "Printer", icon: <Camera size={35} /> },
  { name: "Ink", icon: <Camera size={35} /> },
  { name: "Classes", icon: <Camera size={35} /> },
  // Add more categories if needed
];

const Home2 = () => {
  return (
    <div className="p-8 mx-45">
        <h1 className="text-orange-500 border-l-10 border-orange-500 pl-3 font-bold mb-3">
          Categories
        </h1>
      <h1 className="text-2xl font-bold mb-6">Browse By <span className="text-orange-500"> Category </span> </h1>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-6 w-auto h-40">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-6 cursor-pointer 
                       hover:bg-red-500 hover:text-white transition-colors duration-300"
          >
            {category.icon}
            <span className="mt-2 font-medium">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home2;
