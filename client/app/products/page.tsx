"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  img: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
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
    return <div className="text-center p-8 text-gray-600">Loading products...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="mx-45 mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">View all the Products</h1>
        
      </div>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard
              key={item._id}
              img={item.img}
              name={item.name}
              price={item.price}
              category={item.category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
