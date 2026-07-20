export const theme = {
  colors: {
    bg: "#0f0f10",
    bgElevated: "#18181b",
    bgCard: "#1e1e21",
    bgInput: "#26262a",
    border: "#2e2e33",
    text: "#f4f4f5",
    textMuted: "#9a9aa2",
    textFaint: "#6b6b73",
    accent: "#d4a24c",
    accentHover: "#e0b463",
    accentText: "#1a1409",
    success: "#4ade80",
    warning: "#facc15",
    danger: "#f87171",
    info: "#60a5fa",
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
  },
  shadow: {
    card: "0 4px 20px rgba(0,0,0,0.35)",
    elevated: "0 8px 30px rgba(0,0,0,0.5)",
  },
  font: {
    heading: "'Playfair Display', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
  },
};

export const statusColor: Record<string, string> = {
  Pending: theme.colors.warning,
  Preparing: theme.colors.info,
  Served: theme.colors.success,
};