import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../api/ordersApi";
import type { Order, OrderStatus } from "../types";
import { useAuth } from "../context/AuthContext";

const statusOptions: OrderStatus[] = ["Pending", "Preparing", "Served"];

const statusColor: Record<OrderStatus, string> = {
  Pending: "#facc15",
  Preparing: "#60a5fa",
  Served: "#4ade80",
};

export default function StaffDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "All">("All");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { username, logout } = useAuth();

  const loadOrders = async () => {
    setLoading(true);
    const response = await getAllOrders();
    // sort most recent first
    const sorted = [...response.data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(sorted);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
    } catch (err) {
      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Derived list: orders stays the full list, this is only what we display
  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div style={{ minHeight: "100vh", background: "#121212", padding: 24, color: "#fff" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1>Staff Dashboard — Incoming Orders</h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "All")}
          style={{
            padding: "12px 18px",
            fontSize: 18,
            minWidth: 220,
            borderRadius: 8,
            background: "#242424",
            color: "#fff",
            border: "1px solid #444",
          }}
        >
          <option value="All">All</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div style={{ justifySelf: "end" }}>
          <span style={{ marginRight: 12 }}>Logged in as <strong>{username}</strong> (staff)</span>
          <button onClick={logout} style={{ padding: "12px 18px", borderRadius: 8, background: "#242424", color: "#fff", border: "1px solid #444", cursor: "pointer" }}>Log Out</button>
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p style={{ color: "#888" }}>No orders yet.</p>
      ) : filteredOrders.length === 0 ? (
        <p style={{ color: "#888" }}>No {statusFilter.toLowerCase()} orders.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "#1e1e1e",
                borderRadius: 8,
                padding: 20,
                borderLeft: `4px solid ${statusColor[order.status]}`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <strong style={{ fontSize: 16 }}>{order.customerName}</strong>
                  <span style={{ color: "#888", marginLeft: 10 }}>Table {order.tableNumber}</span>
                </div>
                <span style={{ color: "#888", fontSize: 13 }}>
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
                {order.orderItems.map((item) => (
                  <li key={item.id}>
                    {item.menuItem.name} × {item.quantity} — ₱{item.subtotal}
                  </li>
                ))}
              </ul>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "#4f7fff" }}>Total: ₱{order.totalPrice}</strong>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ color: statusColor[order.status], fontWeight: 600 }}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    style={{
                      padding: "12px 18px",
                      borderRadius: 8,
                      background: "#242424",
                      color: "#fff",
                      border: "1px solid #444",
                    }}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
