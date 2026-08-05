import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";
import { PageShell, TopBar, Card, Button, Input } from "../components/ui";

export default function AdminQrCodePage() {
  const { username, logout } = useAuth();
  const [tableNumber, setTableNumber] = useState("1");

  const menuUrl = `${window.location.origin}/menu?table=${tableNumber}`;

  const handleDownload = () => {
    const canvas = document.getElementById("menumate-qr") as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `menumate-qr-table-${tableNumber}.png`;
    link.click();
  };

  return (
    <PageShell>
      <TopBar
        title="Admin Panel — QR Code"
        right={
          <div>
            <span style={{ marginRight: 12 }}>Logged in as <strong>{username}</strong> (admin)</span>
            <Button onClick={logout} variant="secondary">Log Out</Button>
          </div>
        }
      />

      <div style={{ padding: 32, display: "flex", justifyContent: "center" }}>
        <Card style={{ textAlign: "center", padding: 40, maxWidth: 400 }}>
          <h2 style={{ fontFamily: theme.font.heading, marginBottom: 8 }}>Table QR Code</h2>
          <p style={{ color: theme.colors.textMuted, marginBottom: 24, fontSize: 13 }}>
            Enter a table number, then print and place the QR code on that table.
          </p>

          <div style={{ marginBottom: 20 }}>
            <Input
              placeholder="Table Number"
              type="number"
              value={tableNumber}
              onChange={setTableNumber}
            />
          </div>

          <div style={{ background: "#fff", padding: 16, borderRadius: theme.radius.md, display: "inline-block" }}>
            <QRCodeCanvas id="menumate-qr" value={menuUrl} size={220} />
          </div>

          <p style={{ marginTop: 16, color: theme.colors.textFaint, fontSize: 12, wordBreak: "break-all" }}>
            {menuUrl}
          </p>

          <Button onClick={handleDownload} style={{ marginTop: 16 }}>
            Download QR Code for Table {tableNumber}
          </Button>
        </Card>
      </div>
    </PageShell>
  );
}