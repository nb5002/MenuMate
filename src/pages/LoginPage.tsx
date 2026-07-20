import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { theme } from "../theme";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginApi({ username, password });
      const { token, role, username: returnedUsername } = response.data;
      login(token, role, returnedUsername);

      if (role === "admin") navigate("/admin/menu");
      else if (role === "staff") navigate("/staff");
      else navigate("/menu");
    } catch (err) {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 50% 30%, #2a1e10 0%, #0d0b08 70%)`,
        padding: 24,
        boxSizing: "border-box",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(24, 20, 14, 0.85)",
          border: `1px solid ${theme.colors.border}`,
          borderRadius: 20,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          
          <img
            src={logo}
            alt="MenuMate Logo"
            style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", margin: "0 auto 20px" }}
          />
          
          <h1 style={{ fontFamily: theme.font.heading, color: theme.colors.accent, fontSize: 30, margin: "0 0 8px" }}>
            MenuMate
          </h1>
          <p style={{ color: theme.colors.textFaint, fontSize: 11, letterSpacing: 2, margin: 0 }}>
            STAFF &amp; ADMIN LOGIN
          </p>
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", color: theme.colors.accent, fontSize: 11, letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>
            USERNAME
          </label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: theme.colors.textFaint }}>
              👤
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
              style={{
                width: "100%",
                padding: "12px 14px 12px 40px",
                borderRadius: theme.radius.sm,
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.bgInput,
                color: theme.colors.text,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={{ color: theme.colors.accent, fontSize: 11, letterSpacing: 1, fontWeight: 700 }}>
              PASSWORD
            </label>
            <span style={{ color: theme.colors.accent, fontSize: 12, cursor: "pointer" }}>
              Forgot?
            </span>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: theme.colors.textFaint }}>
              🔒
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
              style={{
                width: "100%",
                padding: "12px 40px 12px 40px",
                borderRadius: theme.radius.sm,
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.bgInput,
                color: theme.colors.text,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
            <span
              onClick={() => setShowPassword((s) => !s)}
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: theme.colors.textFaint,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {error && <p style={{ color: theme.colors.danger, fontSize: 13, marginBottom: 16 }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: theme.radius.sm,
            border: "none",
            background: loading
              ? theme.colors.border
              : `linear-gradient(90deg, ${theme.colors.accent}, #b8842f)`,
            color: theme.colors.accentText,
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Log In →"}
        </button>

        <hr style={{ border: "none", borderTop: `1px solid ${theme.colors.border}`, margin: "24px 0" }} />

        <p style={{ textAlign: "center", color: theme.colors.textFaint, fontSize: 13, margin: 0 }}>
          New to MenuMate? <span style={{ color: theme.colors.accent, cursor: "pointer" }}>Create account</span>
        </p>
      </form>
    </div>
  );
}