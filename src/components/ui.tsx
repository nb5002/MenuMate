import type { ReactNode, CSSProperties } from "react";
import { theme } from "../theme";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.bg,
        color: theme.colors.text,
        fontFamily: theme.font.body,
      }}
    >
      {children}
    </div>
  );
}

export function TopBar({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 32px",
        borderBottom: `1px solid ${theme.colors.border}`,
        background: theme.colors.bgElevated,
      }}
    >
      <h1
        style={{
          fontFamily: theme.font.heading,
          fontSize: 26,
          margin: 0,
          letterSpacing: 0.3,
        }}
      >
        {title}
      </h1>
      {right}
    </div>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background: theme.colors.bgCard,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadow.card,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
  style?: CSSProperties;
}) {
  const variants: Record<string, CSSProperties> = {
    primary: {
      background: disabled ? theme.colors.border : theme.colors.accent,
      color: theme.colors.accentText,
    },
    secondary: {
      background: theme.colors.bgInput,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
    },
    danger: {
      background: theme.colors.danger,
      color: "#1a0a0a",
    },
    ghost: {
      background: "transparent",
      color: theme.colors.textMuted,
      border: `1px solid ${theme.colors.border}`,
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "11px 22px",
        borderRadius: theme.radius.sm,
        border: "none",
        fontWeight: 600,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 0.15s ease",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  style,
}: {
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  style?: CSSProperties;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "11px 14px",
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.bgInput,
        color: theme.colors.text,
        fontSize: 14,
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
}

export function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        background: `${color}22`,
        color,
      }}
    >
      {text}
    </span>
  );
}