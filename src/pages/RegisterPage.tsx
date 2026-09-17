import React, { useState } from "react";
import { Link } from "react-router-dom";
import { theme } from "../theme";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://menumateweb.runasp.net";

    try {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          password, 
          role: role.toLowerCase(), 
          adminKey: role.toLowerCase() === "admin" ? adminKey : "" 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message || "Account created successfully!");
        setUsername("");
        setPassword("");
        setAdminKey("");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
        console.log(err);
      setError("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}` }}>
      <h2 style={{ marginBottom: 20, textAlign: "center" }}>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: theme.colors.textFaint }}>Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}`, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: theme.colors.textFaint }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}`, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: theme.colors.textFaint }}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}`, boxSizing: "border-box" }}
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Conditionally rendered: Only appears when 'Admin' is selected */}
        {role.toLowerCase() === "admin" && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, color: theme.colors.textFaint }}>Admin Secret Key</label>
            <input
              type="password"
              required
              placeholder="e.g., MenuMate2026!"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              style={{ width: "100%", padding: 10, borderRadius: theme.radius.sm, border: `1px solid ${theme.colors.border}`, boxSizing: "border-box" }}
            />
          </div>
        )}

        {error && <p style={{ color: theme.colors.danger, fontSize: 13, marginBottom: 16 }}>{error}</p>}
        {success && <p style={{ color: theme.colors.accent, fontSize: 13, marginBottom: 16 }}>{success}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: theme.radius.sm,
            border: "none",
            background: loading ? theme.colors.border : `linear-gradient(90deg, ${theme.colors.accent}, #b8842f)`,
            color: theme.colors.accentText,
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating account..." : "Register →"}
        </button>
      </form>

      <hr style={{ border: "none", borderTop: `1px solid ${theme.colors.border}`, margin: "24px 0" }} />

      <p style={{ textAlign: "center", color: theme.colors.textFaint, fontSize: 13, margin: 0 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: theme.colors.accent, textDecoration: "none" }}>
          Log in
        </Link>
      </p>
    </div>
  );
}