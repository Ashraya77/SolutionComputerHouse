"use client";
import React from "react";

// Sample phone data
const phones = [
  {
    id: 1,
    model: "Redmi Note 13",
    price: 1200,
    img: "https://m.media-amazon.com/images/I/71Pyk+c4kqL.jpg",
  },
  {
    id: 2,
    model: "iPhone 15",
    price: 120000,
    img: "https://m.media-amazon.com/images/I/71yzJoE7WlL._AC_UF894,1000_QL80_.jpg",
  },
  {
    id: 3,
    model: "Samsung Galaxy S24",
    price: 95000,
    img: "https://m.media-amazon.com/images/I/61VfL-aiToL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 4,
    model: "OnePlus 12",
    price: 78000,
    img: "https://m.media-amazon.com/images/I/71VW8LmqqPL._AC_SL1500_.jpg",
  },
  {
    id: 5,
    model: "Google Pixel 9",
    price: 87000,
    img: "https://m.media-amazon.com/images/I/71iDxWQ7q1L._AC_UF1000,1000_QL80_.jpg",
  },
];

const Page = () => {
  return (
    <div className=" bg-gray-50 p-6 mx-45 ">
         <h1 className="text-orange-500 border-l-10 border-orange-500 pl-3 font-bold mb-3">
          Recent
        </h1>
      <div className="flex justify-between items-center">
       
        <h1 className="space-y-2 text-3xl w-114 border-orange-500 font-bold  mb-8">
          Get Best Deals on <span className="text-orange-400"> Smartphone</span>{" "}
        </h1>
        <h1 className="hover:bg-black cursor-pointer bg-orange-500 p-3 font-bold text-white"> View More </h1>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {phones.map((phone) => (
          <div
            key={phone.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition duration-300"
          >
            <img
              src={phone.img}
              alt={phone.model}
              className="w-full h-48 object-fit"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{phone.model}</h2>
              <p className="text-gray-600">Price: Rs. {phone.price}</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
