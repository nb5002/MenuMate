import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMenuItems } from "../api/menuApi";
import { createOrder } from "../api/ordersApi";
import type { MenuItem } from "../types";
import { theme } from "../theme";
import { PageShell, TopBar, Card, Button, Input } from "../components/ui";

export default function CustomerOrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMenu() {
      const response = await getAllMenuItems();
      setMenuItems(response.data.filter((item) => item.isAvailable));
    }
    fetchMenu();
  }, []);

  const handleQuantityChange = (menuItemId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [menuItemId]: value }));
  };

  const handleSubmit = async () => {
    setMessage("");

    if (!customerName.trim() || !tableNumber.trim()) {
      setMessage("Please fill in your name and table number.");
      return;
    }

    const items = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([menuItemId, quantity]) => ({
        menuItemId: Number(menuItemId),
        quantity,
      }));

    if (items.length === 0) {
      setMessage("Please select at least one item.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await createOrder({
        customerName,
        tableNumber: Number(tableNumber),
        items,
      });
      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (err) {
      setMessage("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const total = menuItems.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + qty * item.price;
  }, 0);

  return (
    <PageShell>
      <TopBar title="Place an Order" right={<Button variant="secondary" onClick={() => navigate("/menu")}>← Back to Menu</Button>} />

      <div style={{ padding: "24px 16px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: "1 1 220px" }}>
            <Input placeholder="Your Name" value={customerName} onChange={setCustomerName} />
          </div>
          <div style={{ flex: "1 1 120px" }}>
            <Input placeholder="Table #" type="number" value={tableNumber} onChange={setTableNumber} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {menuItems.map((item) => (
            <Card key={item.id}>
              <h3 style={{ margin: "0 0 8px", fontSize: 15 }}>{item.name}</h3>
              <p style={{ margin: "0 0 10px", color: theme.colors.accent, fontWeight: 600 }}>₱{item.price}</p>
              <input
                type="number"
                min={0}
                value={quantities[item.id] || ""}
                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: 8,
                  borderRadius: theme.radius.sm,
                  border: `1px solid ${theme.colors.border}`,
                  background: theme.colors.bgInput,
                  color: theme.colors.text,
                  boxSizing: "border-box",
                }}
              />
            </Card>
          ))}
        </div>

        <div style={{ marginTop: 24, fontSize: 18 }}>
          <strong>Order Total: ₱{total}</strong>
        </div>

        {message && <p style={{ marginTop: 12, color: theme.colors.danger }}>{message}</p>}

        <Button onClick={handleSubmit} disabled={submitting} style={{ marginTop: 16, width: "100%", maxWidth: 300 }}>
          {submitting ? "Placing Order..." : "Submit Order"}
        </Button>
      </div>
    </PageShell>
  );
}