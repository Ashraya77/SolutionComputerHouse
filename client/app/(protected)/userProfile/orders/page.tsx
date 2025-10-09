"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
}

const UserOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const { data } = await apiClient.get("/orders/myorders");
        setOrders(data);
      } catch (err) {
        setError("Failed to fetch your orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading your orders...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="border-b">
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{order._id.substring(0, 8)}...</td>
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">Rs. {order.totalPrice.toFixed(2)}</td>
                  <td className="p-4">{order.status}</td>
                  <td className="p-4"><Link href={`/userProfile/orders/${order._id}`} className="text-blue-600 hover:underline">View Details</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;