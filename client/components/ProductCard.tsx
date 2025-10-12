import React from "react";
import { Heart } from "lucide-react";
import useCartStore from "@/store/useCartStore";
import { useRequireAuth } from "@/utils/requireAuth";

interface CardElements {
  id: string; 
  img: string; 
  name: string;
  price: number;
}

const ProductCard: React.FC<CardElements> = ({ id, img, name, price }) => {  // ✅ Add id to destructuring
  const addItem = useCartStore((state) => state.addItem);
  const requireAuth = useRequireAuth();

 const handleAddToCart = () => {
    console.log("Product id value:", id); // ✅ Add this line
  requireAuth(() => {
    console.log("Sending to cart:", { id, quantity: 1 }); // ✅ Add this
    addItem({
      id: id,
      quantity: 1
    });
  });
}

  return (
    <div className="relative bg-white overflow-hidden group transition duration-300">
      {/* Fav Button */}
      <button className="absolute top-3 right-12 bg-white p-2 rounded-full shadow hover:bg-red-100 transition z-10">
        <Heart className="w-5 h-5 text-red-500" />
      </button>

      {/* Product Image with hover Add-to-Cart */}
      <div className="relative h-70 w-80 p-10 bg-gray-200 flex justify-center items-center">
        <img
          src={img}
          alt={name}
          className="object-contain max-h-full max-w-full"
        />
        {/* Add to Cart on hover */}
        <button
          onClick={handleAddToCart}
          className="cursor-pointer absolute bottom-0 left-0 w-full bg-black text-white py-2 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300"
        >
          Add to Cart
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <h2 className="text-lg font-semibold truncate">{name}</h2>
        <p className="text-gray-600">Rs. {price}</p>
      </div>
    </div>
  );
};

export default ProductCard;