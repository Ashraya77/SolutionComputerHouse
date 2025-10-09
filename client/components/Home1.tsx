"use client";
import React from "react";
import ProductCard from "@/components/ProductCard"; // adjust path if needed
import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  img: string;
}

const Page = () => {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const visibleProducts = showAll ? products : products.slice(0, 4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await apiClient.get("/product?category=mobiles");
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="text-center p-8 text-gray-600">Loading products...</div>
    );
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  
  return (
    <div className=" bg-gray-50 p-6 mx-45 mt-10">
         <h1 className="text-orange-500 border-l-10 border-orange-500 pl-3 font-bold mb-3">
          Recent
        </h1>
      <div className="flex justify-between items-center ">
       
        <h1 className="space-y-2 text-3xl w-120 border-orange-500 font-bold  mb-8">
          Get Best Deals on <span className="text-orange-400"> Smartphone</span>{" "}
        </h1>
        <h1 className="hover:bg-black cursor-pointer bg-orange-500 p-3 font-bold mb-8 mr-10 text-white"> View More </h1>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {visibleProducts.map((item) => (
          <ProductCard
            key={item._id}
            id={item._id}
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

export default Page;
