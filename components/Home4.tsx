"use client";
import React, { useState } from "react";
import ProductCard from "@/components/ProductCard"; // adjust path if needed

// Sample product data
const products = [
  {
    id: 1,
    name: "Redmi Note 13",
    price: 1200,
    img: "https://m.media-amazon.com/images/I/71Pyk+c4kqL.jpg",
  },
  {
    id: 2,
    name: "iPhone 15",
    price: 120000,
    img: "https://m.media-amazon.com/images/I/71yzJoE7WlL._AC_UF894,1000_QL80_.jpg",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    price: 95000,
    img: "https://m.media-amazon.com/images/I/61VfL-aiToL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 4,
    name: "OnePlus 12",
    price: 78000,
    img: "https://m.media-amazon.com/images/I/71VW8LmqqPL._AC_SL1500_.jpg",
  },
  {
    id: 5,
    name: "Google Pixel 9",
    price: 87000,
    img: "https://m.media-amazon.com/images/I/71iDxWQ7q1L._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 6,
    name: "MacBook Pro 16",
    price: 280000,
    img: "https://m.media-amazon.com/images/I/61eoeJ8gj8L._AC_SL1500_.jpg",
  },
  {
    id: 7,
    name: "Sony WH-1000XM5 Headphones",
    price: 45000,
    img: "https://m.media-amazon.com/images/I/61+VYd8P0yL._AC_SL1500_.jpg",
  },
  {
    id: 8,
    name: "iPad Pro 12.9",
    price: 160000,
    img: "https://m.media-amazon.com/images/I/81gC7frRJyL._AC_SL1500_.jpg",
  },
  {
    id: 9,
    name: "Apple Watch Ultra",
    price: 110000,
    img: "https://m.media-amazon.com/images/I/91z5KuonXrL._AC_SL1500_.jpg",
  },
  {
    id: 10,
    name: "Dell XPS 13",
    price: 145000,
    img: "https://m.media-amazon.com/images/I/71NItAVnNqL._AC_SL1500_.jpg",
  },
];

const Home4 = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleProducts = showAll ? products : products.slice(0, 8);

  return (
    <div className="bg-gray-50 p-6 mx-45 mt-20">
      <h1 className="text-orange-500 border-l-10 border-orange-500 pl-3 font-bold mb-3">
        Our Products
      </h1>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-8">
          Get Best Deals on{" "}
          <span className="text-orange-400">Tech Products</span>
        </h1>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {visibleProducts.map((item) => (
          <ProductCard
            key={item.id}
            img={item.img}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

      {/* View All Button */}
      {!showAll && products.length > 8 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="bg-orange-500 hover:bg-black text-white px-6 py-3 rounded-lg font-bold transition"
          >
            View All Products
          </button>
        </div>
      )}
    </div>
  );
};

export default Home4;
