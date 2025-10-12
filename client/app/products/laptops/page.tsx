import ProductCard from "@/components/ProductCard";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  price: number;
  img: string;
}

export default async function MobilesPage() {
  let products: Product[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product?category=laptops`, {
      next: { revalidate: 60 }, // ISR caching: refresh every 60s
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

  return (
    <div className="mx-45 px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Laptops</h1>
        <Link href="/products" className="text-blue-600 hover:underline">
          View All Products
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((item) => (
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
