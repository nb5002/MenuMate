import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../api/ordersApi";
import type { Order } from "../types";
import { theme } from "../theme";
import { PageShell, Card } from "../components/ui";

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await getOrderById(Number(id));
        setOrder(response.data);
      } catch (err) {
        setError("Could not retrieve your order details.");
      }
    }
    fetchOrder();
  }, [id]);

  if (error) {
    return (
      <PageShell>
        <p style={{ color: theme.colors.danger, padding: 24 }}>{error}</p>
      </PageShell>
    );
  }

  if (!order) {
    return (
      <PageShell>
        <p style={{ padding: 24 }}>Loading your order...</p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div style={{ display: "flex", justifyContent: "center", padding: "48px 16px" }}>
        <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: `${theme.colors.accent}22`,
              border: `2px solid ${theme.colors.accent}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 26,
              color: theme.colors.accent,
            }}
          >
            ✓
          </div>

          <h1 style={{ fontFamily: theme.font.heading, color: theme.colors.text, fontSize: 28, margin: "0 0 12px" }}>
            Order Confirmed!
          </h1>
          <p style={{ color: theme.colors.textMuted, marginBottom: 28, lineHeight: 1.5 }}>
            Thank you, {order.customerName}. We've received your order and will start preparing it shortly.
          </p>

          <Card style={{ textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: theme.colors.textMuted }}>Order Number</p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: theme.colors.accent }}>#{order.id}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 12, color: theme.colors.textMuted }}>Table</p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{order.tableNumber}</p>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: `1px solid ${theme.colors.border}`, margin: "16px 0" }} />

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <span
                style={{
                  padding: "8px 18px",
                  borderRadius: 20,
                  background: `${theme.colors.warning}22`,
                  color: theme.colors.warning,
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                ⏱ {order.status}
              </span>
            </div>

            {order.orderItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: `1px solid ${theme.colors.border}`,
                  fontSize: 14,
                }}
              >
                <span>
                  {item.quantity}x <span style={{ color: theme.colors.text, fontWeight: 600 }}>{item.menuItem.name}</span>
                </span>
                <span>₱{item.subtotal.toFixed(2)}</span>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              <strong>Total</strong>
              <strong style={{ color: theme.colors.accent, fontSize: 20 }}>
                ₱{order.totalPrice.toFixed(2)}
              </strong>
            </div>
          </Card>

          <button
            onClick={() => navigate("/menu")}
            style={{
              marginTop: 24,
              width: "100%",
              padding: "14px 24px",
              borderRadius: theme.radius.md,
              border: `1px solid ${theme.colors.accent}`,
              background: "transparent",
              color: theme.colors.accent,
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Browse More Items
          </button>
        </div>
      </div>
    </PageShell>
  );
}