import { useEffect, useState } from "react";
import { getOrderHistory } from "../api/ordersApi";
import type { Order, OrderStatus } from "../types";
import { useAuth } from "../context/AuthContext";

const statusColor: Record<OrderStatus, string> = {
  Pending: "#facc15",
  Preparing: "#60a5fa",
  Served: "#4ade80",
};

export default function AdminOrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { username, logout } = useAuth();

  useEffect(() => {
    async function loadHistory() {
      const response = await getOrderHistory();
      const sorted = [...response.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
      setLoading(false);
    }
    loadHistory();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#121212", padding: 24, color: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1>Admin Panel — Order History</h1>
        <div>
          <span style={{ marginRight: 12 }}>Logged in as <strong>{username}</strong> (admin)</span>
          <button onClick={logout} style={{ padding: "6px 12px", cursor: "pointer" }}>Log Out</button>
        </div>
      </div>

      {loading ? (
        <p>Loading order history...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: "#888" }}>No order history available.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#1e1e1e" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
                <th style={{ padding: 12 }}>Order ID</th>
                <th style={{ padding: 12 }}>Customer</th>
                <th style={{ padding: 12 }}>Table</th>
                <th style={{ padding: 12 }}>Items</th>
                <th style={{ padding: 12 }}>Total</th>
                <th style={{ padding: 12 }}>Status</th>
                <th style={{ padding: 12 }}>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #2a2a2a" }}>
                  <td style={{ padding: 12 }}>#{order.id}</td>
                  <td style={{ padding: 12 }}>{order.customerName}</td>
                  <td style={{ padding: 12 }}>{order.tableNumber}</td>
                  <td style={{ padding: 12 }}>
                    {order.orderItems.map((item) => (
                      <div key={item.id}>
                        {item.menuItem.name} × {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: 12, color: "#4f7fff", fontWeight: 600 }}>₱{order.totalPrice}</td>
                  <td style={{ padding: 12, color: statusColor[order.status], fontWeight: 600 }}>
                    {order.status}
                  </td>
                  <td style={{ padding: 12, color: "#888", fontSize: 13 }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}