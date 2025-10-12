// pages/mobiles.tsx OR app/mobiles/page.tsx
import React from "react";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  img: string;
}

export default async function MobilesPage() {
  let products: Product[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product?category=mobiles`, {
      next: { revalidate: 60 }, // ISR caching
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    products = await res.json();
  } catch (error) {
    console.error("Error fetching mobiles:", error);
  }

  if (!products.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        No mobile phones found.
      </div>
    );
  }

  const topProducts = products.slice(0, 5);

  return (
    <div className="bg-gray-50 p-6 mt-10 mx-45 ">
      <h1 className="text-orange-500 border-l-8 border-orange-500 pl-3 font-bold mb-3">
        Recent
      </h1>

      <div className="flex justify-between items-center mb-8">
        <h1 className="space-y-2 text-3xl font-bold">
          Get Best Deals on <span className="text-orange-400">Smartphones</span>
        </h1>
        <button className="hover:bg-black cursor-pointer bg-orange-500 p-3 font-bold text-white">
          View More
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {topProducts.map((item) => (
          <ProductCard
            key={item._id}
            id={item._id}
            img={item.img}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

     
    </div>
  );
}
