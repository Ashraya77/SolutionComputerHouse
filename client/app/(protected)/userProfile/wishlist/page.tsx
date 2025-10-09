"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  img: string;
}

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await apiClient.get<{ products?: Product[] }>("/favorites");
        // ✅ Protect against undefined response
        setWishlistItems(data?.products ?? []);
      } catch (err) {
        setError("Failed to fetch your wishlist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading your wishlist...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">My Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty. Start adding products you love!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
