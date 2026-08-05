import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import logo from "../assets/logo.png";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "90vh",
        background: theme.colors.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "80px 24px 48px",
        boxSizing: "border-box",
      }}
    >
      <div /> {/* spacer to help vertical centering */}

      <div style={{ textAlign: "center" }}>
        <img
          src={logo}
          alt="MenuMate Logo"
          style={{
            width: 140,
            height: 140,
            borderRadius: "50%",
            objectFit: "cover",
            margin: "0 auto 28px",
            boxShadow: `0 0 30px ${theme.colors.accent}55`,
          }}
        />
        <h1
          style={{
            fontFamily: theme.font.heading,
            color: theme.colors.accent,
            fontSize: 48,
            margin: "0 0 12px",
          }}
        >
          MenuMate
        </h1>
        <p
          style={{
            fontFamily: theme.font.heading,
            fontStyle: "italic",
            color: theme.colors.textMuted,
            fontSize: 16,
            margin: 0,
          }}
        >
          Your digital menu, always fresh.
        </p>
      </div>

      <button
        onClick={() => navigate("/order-type")}
        style={{
          width: "100%",
          maxWidth: 360,
          padding: "16px 24px",
          borderRadius: theme.radius.md,
          border: "none",
          background: theme.colors.accent,
          color: theme.colors.accentText,
          fontSize: 17,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: `0 0 24px ${theme.colors.accent}55`,
        }}
      >
        Start Order
      </button>
    </div>
  );
}