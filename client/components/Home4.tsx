"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard"; // adjust path if needed
import Link from "next/link";
import apiClient from "@/lib/apiClient";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  img: string;
}

const Home4 = () => {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const visibleProducts = showAll ? products : products.slice(0, 8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await apiClient.get("/product");
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
          <Link
            href="/products"
            className="bg-orange-500 hover:bg-black text-white px-6 py-3 rounded-lg font-bold transition"
          >
            View All Products
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home4;
