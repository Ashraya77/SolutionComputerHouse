"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";

interface Order {
  _id: string;
  user: {
    name: string;
  };
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paymentMethod: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await apiClient.get('/orders');
        setOrders(data);
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { data: updatedOrder } = await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? { ...order, status: updatedOrder.status, isDelivered: updatedOrder.isDelivered } : order
        )
      );
    } catch (err) {
      setError("Failed to update order status.");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center p-8">Loading orders...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="border-b">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-blue-600 hover:underline"><Link href={`/dashboard/orders/${order._id}`}>{order._id}</Link></td>
                <td className="p-4">{order.user?.name || 'N/A'}</td>
                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4">Rs. {order.totalPrice.toFixed(2)}</td>
                <td className="p-4">{order.paymentMethod}</td>
                <td className="p-4"> 
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;