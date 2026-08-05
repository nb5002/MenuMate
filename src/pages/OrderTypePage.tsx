import { useNavigate } from "react-router-dom";
import { PageShell, Card } from "../components/ui";
import { theme } from "../theme";

export default function OrderTypePage() {
  const navigate = useNavigate();

  const handleSelect = (orderType: "dine_in" | "takeout") => {
    navigate("/menu", { state: { orderType } });
  };

  return (
    <PageShell>
      <div style={{ textAlign: "center", padding: "60px 16px 24px" }}>
        <h1 style={{ color: theme.colors.accent, fontSize: 32, margin: 0, fontFamily: theme.font.heading }}>
          How would you like to eat?
        </h1>
        <p style={{ color: theme.colors.textMuted, fontStyle: "italic", marginTop: 8 }}>
          Choose your dining preference to get started.
        </p>
      </div>

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div onClick={() => handleSelect("dine_in")} style={{ cursor: "pointer" }}>
          <Card>
            <h3 style={{ margin: 0 }}>🍴 Dine In</h3>
            <p style={{ margin: "4px 0 0", color: theme.colors.textMuted }}>Eat here at your table</p>
          </Card>
        </div>

        <div onClick={() => handleSelect("takeout")} style={{ cursor: "pointer" }}>
          <Card>
            <h3 style={{ margin: 0 }}>🛍️ Take Out</h3>
            <p style={{ margin: "4px 0 0", color: theme.colors.textMuted }}>Pick up and go</p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}