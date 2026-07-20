import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMenuItems } from "../api/menuApi";
import type { MenuItem } from "../types";
import { theme } from "../theme";
import { PageShell, TopBar, Card, Button } from "../components/ui";

function toTitleCase(text: string) {
  return text.trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

const categoryAliases: Record<string, string> = {
  "combo deal combo (b)": "Combo Meals",
  "combo deals (combo a)": "Combo Meals",
};

function normalizeKey(text: string) {
  const cleaned = text.trim().toLowerCase();
  if (categoryAliases[cleaned]) return categoryAliases[cleaned].toLowerCase();
  return cleaned.replace(/s$/, "");
}

function getDisplayName(text: string) {
  const cleaned = text.trim().toLowerCase();
  if (categoryAliases[cleaned]) return categoryAliases[cleaned];
  return toTitleCase(text);
}

export default function CustomerMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await getAllMenuItems();
        setItems(response.data.filter((item) => item.isAvailable));
      } catch (err) {
        setError("Failed to load menu. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const categoryMap = new Map<string, { display: string; items: MenuItem[] }>();
  items.forEach((item) => {
    const key = normalizeKey(item.category);
    if (!categoryMap.has(key)) {
      categoryMap.set(key, { display: getDisplayName(item.category), items: [] });
    }
    categoryMap.get(key)!.items.push(item);
  });
  const categories = Array.from(categoryMap.entries());

  const visibleCategories =
    activeCategory === "all" ? categories : categories.filter(([key]) => key === activeCategory);

  const selectCategory = (key: string) => {
    setActiveCategory(key);
    setSidebarOpen(false); // auto-close on mobile after picking
  };

  if (loading) return <PageShell><p style={{ padding: 24 }}>Loading menu...</p></PageShell>;
  if (error) return <PageShell><p style={{ padding: 24, color: theme.colors.danger }}>{error}</p></PageShell>;

  return (
    <PageShell>
      <TopBar
        title="MenuMate — Digital Menu"
        right={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              style={{
                background: theme.colors.bgInput,
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.text,
                padding: "8px 12px",
                borderRadius: theme.radius.sm,
                cursor: "pointer",
              }}
            >
              ☰ Categories
            </button>
            <Button onClick={() => navigate("/order")}>Order Form →</Button>
          </div>
        }
      />

      <div style={{ display: "flex", position: "relative" }}>
        {/* Overlay for mobile */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`sidebar ${sidebarOpen ? "open" : ""}`}
          style={{
            width: 220,
            flexShrink: 0,
            borderRight: `1px solid ${theme.colors.border}`,
            minHeight: "calc(100vh - 77px)",
            padding: "24px 0",
            background: theme.colors.bg,
          }}
        >
          <SidebarItem label="🏠 Home" active={false} onClick={() => { navigate("/"); setSidebarOpen(false); }} />
          <div style={{ borderTop: `1px solid ${theme.colors.border}`, margin: "8px 0" }} />
          <SidebarItem label="All Items" active={activeCategory === "all"} onClick={() => selectCategory("all")} />
          {categories.map(([key, { display }]) => (
            <SidebarItem key={key} label={display} active={activeCategory === key} onClick={() => selectCategory(key)} />
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: 24, minWidth: 0 }}>
          {visibleCategories.length === 0 && (
            <p style={{ color: theme.colors.textMuted }}>No items in this category.</p>
          )}

          {visibleCategories.map(([key, { display, items }]) => (
            <div key={key} style={{ marginBottom: 40 }}>
              {activeCategory === "all" && (
                <h2
                  className="top-bar-title"
                  style={{ fontFamily: theme.font.heading, color: theme.colors.accent, fontSize: 22, marginBottom: 16 }}
                >
                  {display}
                </h2>
              )}

              <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12 }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="item-card"
                    onClick={() => navigate(`/menu/${item.id}`)}
                    style={{ flex: "0 0 220px", cursor: "pointer" }}
                  >
                    <Card style={{ height: "100%", padding: 0, overflow: "hidden" }}>
                      <div
                        style={{
                          width: "100%",
                          height: 130,
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
                      <div style={{ padding: 14 }}>
                        <h3 style={{ margin: "0 0 8px", fontSize: 15 }}>{item.name}</h3>
                        <p style={{ margin: 0, color: theme.colors.accent, fontWeight: 700, fontSize: 15 }}>
                          ₱{item.price}
                        </p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function SidebarItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "12px 24px",
        cursor: "pointer",
        color: active ? theme.colors.accent : theme.colors.textMuted,
        background: active ? theme.colors.bgCard : "transparent",
        borderLeft: active ? `3px solid ${theme.colors.accent}` : "3px solid transparent",
        fontWeight: active ? 600 : 400,
        fontSize: 14,
      }}
    >
      {label}
    </div>
  );
}