"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  img: string;
}

const ManageProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/product");
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await apiClient.delete(`/product/${productId}`);
        setProducts(products.filter((p) => p._id !== productId));
        alert("Product deleted successfully.");
      } catch (err) {
        setError("Failed to delete product.");
        console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center p-8">Loading products...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Link href="/dashboard/addProduct" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add New Product
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="border-b">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="p-4"><img src={product.img} alt={product.name} className="w-16 h-16 object-cover rounded"/></td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4 capitalize">{product.category}</td>
                <td className="p-4">Rs. {product.price.toFixed(2)}</td>
                <td className="p-4 flex space-x-4 items-center">
                  <Link href={`/dashboard/products/edit/${product._id}`} className="text-blue-600 hover:text-blue-800">Edit <Edit size={20} /></Link>
                  <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800"> Delete <Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProductsPage;