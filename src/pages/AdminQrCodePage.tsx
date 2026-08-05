import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";
import { PageShell, TopBar, Card, Button, Input } from "../components/ui";

export default function AdminQrCodePage() {
  const { username, logout } = useAuth();
  const [tableNumber, setTableNumber] = useState("1");

  const dineInUrl = `${window.location.origin}/?table=${tableNumber}`;
  const takeoutUrl = `${window.location.origin}/`;

  const handleDownload = (canvasId: string, filename: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <PageShell>
      <TopBar
        title="Admin Panel — QR Codes"
        right={
          <div>
            <span style={{ marginRight: 12 }}>Logged in as <strong>{username}</strong> (admin)</span>
            <Button onClick={logout} variant="secondary">Log Out</Button>
          </div>
        }
      />

      <div style={{ padding: 32, display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
        {/* Dine In — per table */}
        <Card style={{ textAlign: "center", padding: 40, maxWidth: 400 }}>
          <h2 style={{ fontFamily: theme.font.heading, marginBottom: 8 }}>Table QR Code</h2>
          <p style={{ color: theme.colors.textMuted, marginBottom: 24, fontSize: 13 }}>
            Enter a table number, then print and place the QR code on that table.
          </p>

          <div style={{ marginBottom: 20 }}>
            <Input placeholder="Table Number" type="number" value={tableNumber} onChange={setTableNumber} />
          </div>

          <div style={{ background: "#fff", padding: 16, borderRadius: theme.radius.md, display: "inline-block" }}>
            <QRCodeCanvas id="dinein-qr" value={dineInUrl} size={220} />
          </div>

          <p style={{ marginTop: 16, color: theme.colors.textFaint, fontSize: 12, wordBreak: "break-all" }}>
            {dineInUrl}
          </p>

          <Button
            onClick={() => handleDownload("dinein-qr", `menumate-qr-table-${tableNumber}.png`)}
            style={{ marginTop: 16 }}
          >
            Download QR Code for Table {tableNumber}
          </Button>
        </Card>

        {/* General / Take Out — plain link, no table param */}
        <Card style={{ textAlign: "center", padding: 40, maxWidth: 400 }}>
          <h2 style={{ fontFamily: theme.font.heading, marginBottom: 8 }}>General / Take Out QR Code</h2>
          <p style={{ color: theme.colors.textMuted, marginBottom: 24, fontSize: 13 }}>
            Print this once and place it at the counter or on flyers. Customers choose Dine In or Take Out themselves.
          </p>

          <div style={{ background: "#fff", padding: 16, borderRadius: theme.radius.md, display: "inline-block" }}>
            <QRCodeCanvas id="takeout-qr" value={takeoutUrl} size={220} />
          </div>

          <p style={{ marginTop: 16, color: theme.colors.textFaint, fontSize: 12, wordBreak: "break-all" }}>
            {takeoutUrl}
          </p>

          <Button
            onClick={() => handleDownload("takeout-qr", "menumate-qr-general.png")}
            style={{ marginTop: 16 }}
          >
            Download General QR Code
          </Button>
        </Card>
      </div>
    </PageShell>
  );
}