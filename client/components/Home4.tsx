// pages/index.tsx OR app/page.tsx
import ProductCard from "@/components/ProductCard"; // must be a client component
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  img: string;
}

// ✅ Mark the component async to use await
export default async function Home4() {
  let products: Product[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product`, {
      next: { revalidate: 60 }, // ISR caching
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    products = await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  if (!products.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        No products found.
      </div>
    );
  }

  const topProducts = products.slice(0, 8);

  return (
    <div className="bg-gray-50 p-6 mt-20 mx-45">
      <h1 className="text-orange-500 border-l-4 border-orange-500 pl-3 font-bold mb-3">
        Our Products
      </h1>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Get Best Deals on{" "}
          <span className="text-orange-400">Tech Products</span>
        </h1>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {topProducts.map((item) => (
          <ProductCard
            key={item._id}
            id={item._id} // ✅ if ProductCard uses id for add-to-cart
            img={item.img}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>

      {/* View All Button */}
      {products.length > 8 && (
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
}
