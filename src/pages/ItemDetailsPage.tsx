import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenuItemById } from "../api/menuApi";
import type { MenuItem } from "../types";
import { theme } from "../theme";
import { PageShell, Card, Button } from "../components/ui";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await getMenuItemById(Number(id));
        setItem(response.data);
      } catch (err) {
        setError("Failed to load item details.");
      }
    }
    fetchItem();
  }, [id]);

  if (error) {
    return (
      <PageShell>
        <p style={{ color: theme.colors.danger, padding: 24 }}>{error}</p>
      </PageShell>
    );
  }

  if (!item) {
    return (
      <PageShell>
        <p style={{ padding: 24 }}>Loading...</p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div style={{ maxWidth: 500, width: "100%", margin: "0 auto", padding: "24px 16px", boxSizing: "border-box" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 20,
            padding: "8px 14px",
            background: theme.colors.bgInput,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.sm,
            color: theme.colors.text,
            cursor: "pointer",
          }}
        >
          ← Back to Menu
        </button>

        <Card>
          <div
            style={{
              width: "100%",
              height: 200,
              borderRadius: theme.radius.md,
              marginBottom: 16,
              background:
                item.imageUrl && item.imageUrl !== "string" && item.imageUrl !== "?"
                  ? `url(${item.imageUrl}) center/cover`
                  : theme.colors.bgInput,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.textFaint,
            }}
          >
            {!(item.imageUrl && item.imageUrl !== "string" && item.imageUrl !== "?") && "No Image"}
          </div>

          <h1 style={{ marginTop: 0, fontFamily: theme.font.heading, fontSize: 24 }}>{item.name}</h1>
          <p style={{ color: theme.colors.textMuted, marginBottom: 12 }}>{item.category}</p>
          <p style={{ marginBottom: 16, lineHeight: 1.5 }}>{item.description}</p>
          <p style={{ fontSize: 22, color: theme.colors.accent, fontWeight: 700 }}>₱{item.price}</p>

          <Button onClick={() => navigate("/order")} style={{ marginTop: 16, width: "100%" }}>
            Order This Item
          </Button>
        </Card>
      </div>
    </PageShell>
  );
}