"use client";
import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  img: string;
}

const MobilesPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
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

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-600">Loading products...</div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Smartphones</h1>
        <Link href="/products" className="text-blue-600 hover:underline">
          View All Products
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No mobile phones found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard  
            key={item._id}
           id={item._id}  // ✅ ADD THIS LINE
            img={item.img}
            name={item.name}
            price={item.price} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MobilesPage;
