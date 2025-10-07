"use client";

import { useState } from "react";

// Mock data
const mockOrders = [
  { id: "ORD-001", customer: "Ashraya", date: "2024-05-20", total: 120000, status: "Shipped" },
  { id: "ORD-002", customer: "John Doe", date: "2024-05-19", total: 280000, status: "Processing" },
  { id: "ORD-003", customer: "Jane Smith", date: "2024-05-18", total: 145000, status: "Delivered" },
];

const OrdersPage = () => {
  const [orders, setOrders] = useState(mockOrders);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4">Rs. {order.total}</td>
                <td className="p-4">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;