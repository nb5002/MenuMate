import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllMenuItems } from "../api/menuApi";
import { createOrder } from "../api/ordersApi";
import type { MenuItem, OrderType } from "../types";
import { theme } from "../theme";
import { PageShell, TopBar, Card, Button, Input, Badge } from "../components/ui";
import { OrderTypeSelector } from "../components/OrderTypeSelector";

export default function CustomerOrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showReview, setShowReview] = useState(false); // NEW: is the review pop-up open?

  const navigate = useNavigate();
  const location = useLocation();

  const tableFromQr = location.state?.tableNumber || "";
  const [orderType, setOrderType] = useState<OrderType>(location.state?.orderType || "dine_in");
  const [tableNumber, setTableNumber] = useState(tableFromQr);

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

  // NEW: only the items the customer actually picked (quantity above 0)
  const selectedItems = menuItems
    .filter((item) => (quantities[item.id] || 0) > 0)
    .map((item) => ({ item, quantity: quantities[item.id] }));

  // NEW: runs when "Submit Order" is clicked. Checks the form, then opens the review pop-up.
  const handleReview = () => {
    setMessage("");

    if (!customerName.trim()) {
      setMessage("Please fill in your name.");
      return;
    }

    if (orderType === "dine_in" && !tableNumber.trim()) {
      setMessage("Please fill in your table number.");
      return;
    }

    if (selectedItems.length === 0) {
      setMessage("Please select at least one item.");
      return;
    }

    setShowReview(true);
  };

  // CHANGED: this used to be handleSubmit. It now runs only when "Confirm Order" is clicked.
  const handleConfirm = async () => {
    const items = selectedItems.map(({ item, quantity }) => ({
      menuItemId: item.id,
      quantity,
    }));

    setSubmitting(true);
    try {
      const response = await createOrder({
        customerName,
        orderType,
        tableNumber: orderType === "dine_in" ? Number(tableNumber) : null,
        items,
      });
      navigate(`/order-confirmation/${response.data.orderId}`);
    } catch (err) {
      setShowReview(false);
      setMessage("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const total = menuItems.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + qty * item.price;
  }, 0);

  // Inline "Change order type" view — items and name stay intact underneath
  if (showTypeSelector) {
    return (
      <PageShell>
        <TopBar
          title="Change Order Type"
          right={
            <Button variant="secondary" onClick={() => setShowTypeSelector(false)}>
              ← Back
            </Button>
          }
        />
        <OrderTypeSelector
          onSelect={(type) => {
            setOrderType(type);
            setShowTypeSelector(false);
          }}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <TopBar title="Place an Order" right={<Button variant="secondary" onClick={() => navigate("/menu")}>← Back to Menu</Button>} />

      <div style={{ padding: "24px 16px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <Badge
            text={orderType === "dine_in" ? "🍴 Dine In" : "🛍️ Take Out"}
            color={theme.colors.accent}
          />
          <span
            onClick={() => setShowTypeSelector(true)}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              color: theme.colors.textMuted,
              fontSize: 13,
            }}
          >
            Change
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: "1 1 220px" }}>
            <Input placeholder="Your Name" value={customerName} onChange={setCustomerName} />
          </div>
          {orderType === "dine_in" && (
            <div style={{ flex: "1 1 120px" }}>
              <Input placeholder="Table #" type="number" value={tableNumber} onChange={setTableNumber} />
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {menuItems.map((item) => (
            <Card key={item.id}>
               <div
                style={{
                  width: "100%",
                  height: 120,
                  borderRadius: theme.radius.sm,
                  marginBottom: 10,
                  background:
                    item.imageUrl && item.imageUrl !== "string" && item.imageUrl !== "?"
                      ? `url(${item.imageUrl}) center/cover`
                      : theme.colors.bgInput,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.colors.textFaint,
                  fontSize: 12,
                }}
              >
                {!(item.imageUrl && item.imageUrl !== "string" && item.imageUrl !== "?") && "No Image"}
              </div>

              
              <h3 style={{ margin: "0 0 8px", fontSize: 15 }}>{item.name}</h3>
              <p style={{ margin: "0 0 10px", color: theme.colors.accent, fontWeight: 600 }}>₱{item.price}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <button
                  onClick={() => handleQuantityChange(item.id, Math.max(0, (quantities[item.id] || 0) - 1))}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: theme.radius.sm,
                    border: `1px solid ${theme.colors.border}`,
                    background: theme.colors.bgInput,
                    color: theme.colors.text,
                    cursor: "pointer",
                    fontSize: 16,
                 }}
               >
                 −
                </button>

                <span style={{ minWidth: 24, textAlign: "center", fontWeight: 600 }}>
                  {quantities[item.id] || 0}
                </span>

                <button
                  onClick={() => handleQuantityChange(item.id, (quantities[item.id] || 0) + 1)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: theme.radius.sm,
                    border: `1px solid ${theme.colors.border}`,
                    background: theme.colors.bgInput,
                    color: theme.colors.text,
                    cursor: "pointer",
                    fontSize: 16,
                 }}
               >
                +
               </button>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ marginTop: 24, fontSize: 18 }}>
          <strong>Order Total: ₱{total}</strong>
        </div>

        {message && <p style={{ marginTop: 12, color: theme.colors.danger }}>{message}</p>}

        {/* CHANGED: the button now opens the review pop-up instead of sending the order */}
        <Button onClick={handleReview} disabled={submitting} style={{ marginTop: 16, width: "100%", maxWidth: 300 }}>
          Submit Order
        </Button>
      </div>

      {/* NEW: the review pop-up */}
      {showReview && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 1000,
          }}
        >
          <div style={{ width: "100%", maxWidth: 420, maxHeight: "90vh", overflowY: "auto" }}>
            <Card style={{ textAlign: "left" }}>
              <h2
                style={{
                  fontFamily: theme.font.heading,
                  color: theme.colors.text,
                  fontSize: 22,
                  margin: "0 0 6px",
                }}
              >
                Review Your Order
              </h2>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: theme.colors.textMuted }}>
                Please check your details before submitting.
              </p>

              <div style={{ fontSize: 14, marginBottom: 12, lineHeight: 1.8 }}>
                <div>
                  <span style={{ color: theme.colors.textMuted }}>Name: </span>
                  <strong>{customerName}</strong>
                </div>
                <div>
                  <span style={{ color: theme.colors.textMuted }}>Order type: </span>
                  <strong>{orderType === "dine_in" ? "Dine In" : "Take Out"}</strong>
                </div>
                {orderType === "dine_in" && (
                  <div>
                    <span style={{ color: theme.colors.textMuted }}>Table: </span>
                    <strong>{tableNumber}</strong>
                  </div>
                )}
              </div>

              <hr style={{ border: "none", borderTop: `1px solid ${theme.colors.border}`, margin: "12px 0" }} />

              {selectedItems.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: `1px solid ${theme.colors.border}`,
                    fontSize: 14,
                  }}
                >
                  <span>
                    {quantity}x <span style={{ fontWeight: 600 }}>{item.name}</span>
                  </span>
                  <span>₱{(item.price * quantity).toFixed(2)}</span>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
                <strong>Total</strong>
                <strong style={{ color: theme.colors.accent, fontSize: 18 }}>₱{total.toFixed(2)}</strong>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <Button
                  variant="secondary"
                  onClick={() => setShowReview(false)}
                  disabled={submitting}
                  style={{ flex: 1 }}
                >
                  Edit Order
                </Button>
                <Button onClick={handleConfirm} disabled={submitting} style={{ flex: 1 }}>
                  {submitting ? "Placing Order..." : "Confirm Order"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </PageShell>
  );
}